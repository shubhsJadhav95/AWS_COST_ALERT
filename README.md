# 📊 AWS Cost Alert System
A serverless system that automatically monitors AWS billing CSV files, detects cost spikes, and alerts you via email.
---
![Architecture Diagram](output\diagram-export-12-06-2026-20_31_35.pngdiagram-export-12-06-2026-20_31_35.png)
## 🔍 How It Works (Simple Words)
Whenever a new billing CSV file is uploaded to your S3 bucket, the following happens automatically:
```
[ Upload CSV to S3 ] ──> ( Triggers Lambda ) ──> [ Analyzes costs using Python ] 
                                                               │
                                                       (If spike detected)
                                                               │
                                                               └──> [ Email Notification via SNS ]
```
1. **Upload**: You (or AWS Cost & Usage Reports) upload a billing CSV file to the S3 bucket.
2. **Trigger**: S3 automatically tells AWS Lambda that a new file has arrived.
3. **Analysis**: The Lambda function uses a custom Layer (with `numpy`/`pandas`) to read the CSV, look at your cost history, and calculate if there is an unusual cost spike.
4. **Alert**: If a cost spike is detected (either in total cost or in individual services), Lambda publishes an alert to an SNS Topic, which immediately emails you.
---
## 🛠️ Infrastructure (Terraform)
The project uses Terraform to set up all AWS resources:
- **S3 Bucket**: Stores billing CSV files.
- **Lambda Function**: Run the Python script (`lambda_handler.py`) to process the CSV data.
- **Lambda Layer**: Packages Python libraries like `numpy` and `pandas` so Lambda can perform math analysis.
- **SNS Topic**: Sends email notifications to subscribed email endpoints.
- **IAM Policies**: Grants Lambda secure permissions to read S3 and send SNS emails.
---
## 📋 Terraform Outputs
After running `terraform apply`, the system will output the following details:
- `bucket_name`: The name of the S3 bucket created for uploading CSVs.
- `bucket_arn`: The Amazon Resource Name (ARN) of the S3 bucket.
- `lambda_function_name`: The name of the deployed Lambda function.
- `lambda_function_arn`: The Amazon Resource Name (ARN) of the Lambda function.
- `sns_topic_arn`: The Amazon Resource Name (ARN) of the SNS notification topic.
- `layer_arn`: The Amazon Resource Name (ARN) of the uploaded pandas/numpy Python layer.
---
## 🚀 How to Run the Project
### 1. Configure Variables
Open `terraform/terraform.tfvars` and add the email addresses you want to receive alerts:
```hcl
email_endpoints = ["your-email@example.com"]
```
### 2. Deploy Infrastructure
Navigate to the `terraform` directory and run:
```bash
cd terraform
terraform init
terraform plan
terraform apply
```
### 3. Test the Setup
Once deployment completes:
1. Confirm the SNS subscription by clicking the verification link in the email sent to you.
2. Upload a billing CSV file (e.g. `billing.csv`) to your new S3 bucket.
3. If there is a cost spike in the CSV data, you will receive an email alert detailing exactly which service caused the spike!
---
## ☸️ Kubernetes (k8s) & GitOps Deployment
This project includes a containerized deployment setup using **Kubernetes** and **ArgoCD (GitOps)** to run the application dashboard (Frontend & Backend) in a cluster:
### 1. Components
- **Frontend**: A React application deployed as a Kubernetes Deployment and Service.
- **Backend**: A Spring Boot API deployed as a Kubernetes Deployment and Service. It reads credentials from a Kubernetes Secret (`aws-credentials`).
- **Ingress**: Manages traffic routing to direct external web traffic to the correct Frontend and Backend services.
- **ArgoCD**: Automatially syncs the cluster state with the configuration files inside the `/k8s` folder.
### 2. Manual Deployment
To deploy the applications manually to your cluster, run:
```bash
# Apply secrets (make sure to edit secret.yml with your base64 encoded AWS keys first)
kubectl apply -f k8s/backend/secret.yml
# Deploy Backend
kubectl apply -f k8s/backend/deployment.yml
kubectl apply -f k8s/backend/service.yml
kubectl apply -f k8s/backend/ingress.yml
# Deploy Frontend
kubectl apply -f k8s/frontend/deployment.yml
kubectl apply -f k8s/frontend/service.yml
kubectl apply -f k8s/frontend/ingress.yml
```
### 3. Automated GitOps Deployment (ArgoCD)
ArgoCD application files are located in `k8s/argocd/`. To set up automated syncing:
```bash
kubectl apply -f k8s/argocd/application-backend.yml
kubectl apply -f k8s/argocd/application-frontend.yml
```
ArgoCD will monitor this Git repository and automatically keep your running cluster in sync with your codebase.