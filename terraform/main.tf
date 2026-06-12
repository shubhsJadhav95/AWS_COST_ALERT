
module "layer" {
  source     = "./modules/layer"
  layer_name = var.layer_name
  layer_zip  = "../layer.zip"
}


module "sns" {
  source          = "./modules/sns"
  topic_name      = var.topic_name
  email_endpoints = var.email_endpoints
}

module "Lambda" {
  source        = "./modules/lambda"
  function_name = var.function_name
  role_name     = var.role_name
  policy_name   = var.policy_name
  layer_arn     = module.layer.layer_arn
  sns_topic_arn = module.sns.topic_arn
}

module "s3_bucket" {
  source      = "./modules/s3"
  bucket_name = var.bucket_name
  environment = var.environment
  versioning  = true
}
# Allow S3 to invoke Lambda
resource "aws_lambda_permission" "allow_s3" {
  statement_id  = "AllowExecutionFromS3Bucket"
  action        = "lambda:InvokeFunction"
  function_name = module.Lambda.function_arn
  principal     = "s3.amazonaws.com"
  source_arn    = module.s3_bucket.bucket_arn
}

# S3 bucket notification triggering Lambda on CSV file upload
resource "aws_s3_bucket_notification" "s3_trigger" {
  bucket = module.s3_bucket.bucket_id

  lambda_function {
    lambda_function_arn = module.Lambda.function_arn
    events              = ["s3:ObjectCreated:*"]
    filter_suffix       = ".csv"
  }

  depends_on = [aws_lambda_permission.allow_s3]
}

# Configure SNS as the destination for Lambda async execution results (On Success & On Failure)
resource "aws_lambda_function_event_invoke_config" "lambda_destination" {
  function_name = module.Lambda.function_name

  destination_config {
    on_success {
      destination = module.sns.topic_arn
    }
    on_failure {
      destination = module.sns.topic_arn
    }
  }
}

