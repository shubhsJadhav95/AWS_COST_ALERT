import json
import boto3
import csv
import io
import numpy as np
import os
from datetime import datetime

s3 = boto3.client("s3")
sns = boto3.client("sns", region_name="us-east-1")

SNS_TOPIC_ARN = os.environ.get('SNS_TOPIC_ARN', 'arn:aws:sns:us-east-1:347026173735:aws-alert')

DATE_FORMATS = [
    "%Y-%m-%d",
    "%m/%d/%Y",
    "%d-%m-%Y",
    "%d/%m/%Y",
    "%b %d, %Y",
    "%B %d, %Y",
    "%Y/%m/%d",
    "%m-%d-%Y",
]

def parse_date(date_str):
    for fmt in DATE_FORMATS:
        try:
            return datetime.strptime(date_str.strip(), fmt).date()
        except ValueError:
            continue
    return None

def safe_float(value):
    try:
        v = str(value).strip()
        return float(v) if v != '' else 0.0
    except (ValueError, TypeError):
        return 0.0

def get_upper_bound(values):
    q1, q3 = np.percentile(values, [25, 75])
    iqr = q3 - q1
    return q3 + 1.5 * iqr

def pct_change(values):
    changes = np.empty(len(values))
    changes[0] = np.nan
    for i in range(1, len(values)):
        prev = values[i - 1]
        changes[i] = ((values[i] - prev) / prev * 100) if prev != 0 else np.nan
    return changes

def normalize_headers(row):
    return {
        k.lstrip('\ufeff').strip().strip('"'): v
        for k, v in row.items()
    }

def publish_alert(subject, message):
    if not SNS_TOPIC_ARN.startswith('arn:aws:sns:'):
        print(f"WARNING: SNS_TOPIC_ARN is missing or invalid: '{SNS_TOPIC_ARN}'. Skipping publish.")
        return
    sns.publish(
        TopicArn=SNS_TOPIC_ARN,
        Subject=subject,
        Message=message
    )
    print("SNS alert sent.")

def lambda_handler(event, context):
    try:
        # 1. Get bucket and file information
        bucketname = event["Records"][0]["s3"]["bucket"]["name"]
        bucketobject = event["Records"][0]["s3"]["object"]["key"]

        # 2. Fetch the CSV data
        response = s3.get_object(Bucket=bucketname, Key=bucketobject)
        raw_text = response["Body"].read().decode("utf-8-sig")

        # 3. Parse CSV
        reader = csv.DictReader(io.StringIO(raw_text))
        rows = [normalize_headers(row) for row in reader]

        print(f"Total rows read from CSV: {len(rows)}")
        if rows:
            print(f"Normalized headers: {list(rows[0].keys())}")

        # 4. Filter out 'Service total' and rows with no parseable date
        filtered_rows = []
        skipped_rows  = []

        for row in rows:
            service_val = row.get('Service', '').strip()

            if service_val == 'Service total':
                continue

            parsed_date = parse_date(service_val)
            if parsed_date is None:
                skipped_rows.append(service_val)
                continue

            total_cost = safe_float(row.get('Total costs($)', 0))
            filtered_rows.append((parsed_date, total_cost, row))

        print(f"Rows successfully parsed: {len(filtered_rows)}")
        if skipped_rows:
            print(f"Skipped rows: {skipped_rows}")

        if len(filtered_rows) < 3:
            print("Not enough data rows for spike analysis (need at least 3).")
            return {
                'statusCode': 200,
                'body': json.dumps('Not enough data for analysis.')
            }

        # Sort by date
        filtered_rows.sort(key=lambda x: x[0])

        dates       = [r[0] for r in filtered_rows]
        total_costs = np.array([r[1] for r in filtered_rows], dtype=float)
        raw_rows    = [r[2] for r in filtered_rows]

        email_body = ""

        # --- ANALYSIS PART 1: TOTAL COST SPIKES ---
        upper_bound_total = get_upper_bound(total_costs)
        total_pct         = pct_change(total_costs)
        spike_mask_total  = total_costs > upper_bound_total

        print(f"Total cost upper bound (IQR): {upper_bound_total:.6f}")

        if np.any(spike_mask_total):
            email_body += "=================== Total Cost Spikes ========================\n"
            for i, is_spike in enumerate(spike_mask_total):
                if is_spike:
                    pct_str = f"{total_pct[i]:.2f}%" if not np.isnan(total_pct[i]) else "N/A"
                    email_body += (
                        f"Date: {dates[i]}, "
                        f"Amount: ${total_costs[i]:.6f}, "
                        f"Increase from Prev Day: {pct_str}\n"
                    )

        # --- ANALYSIS PART 2: INDIVIDUAL SERVICE-WISE SPIKES ---
        exclude_cols = {'Service', 'Total costs($)', 'Tax($)'}
        all_cols     = list(raw_rows[0].keys()) if raw_rows else []
        service_cols = [c for c in all_cols if c not in exclude_cols]

        print(f"Service columns detected: {service_cols}")

        svc_email_section = "\n=================== Cost Spikes for Services ========================\n"
        svc_spike_found   = False

        for col in service_cols:
            col_values = np.array(
                [safe_float(row.get(col, 0)) for row in raw_rows], dtype=float
            )

            upper_bound_svc = get_upper_bound(col_values)
            svc_pct         = pct_change(col_values)
            spike_mask_svc  = col_values > upper_bound_svc

            if np.any(spike_mask_svc):
                svc_spike_found = True
                for i, is_spike in enumerate(spike_mask_svc):
                    if is_spike:
                        pct_str = f"{svc_pct[i]:.2f}%" if not np.isnan(svc_pct[i]) else "N/A"
                        svc_email_section += (
                            f"{col} Spike — Date: {dates[i]}, "
                            f"Amount: ${col_values[i]:.6f}, "
                            f"Increase: {pct_str}\n"
                        )

        if svc_spike_found:
            email_body += svc_email_section

        # 5. SEND EMAIL VIA SNS
        if email_body:
            publish_alert(
                subject=f"Alert: AWS Cost Spike Detected - {bucketobject}",
                message=email_body
            )
        else:
            print("No spikes detected. No alert sent.")

        return {
            'statusCode': 200,
            'body': json.dumps('Analysis completed and alert sent if spikes were found.')
        }

    except Exception as e:
        print(f"Error: {str(e)}")
        return {'statusCode': 500, 'body': json.dumps({'error': str(e)})}