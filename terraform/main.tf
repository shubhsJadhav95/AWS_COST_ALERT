module "Lambda" {
  source        = "./modules/lambda"
  function_name = var.function_name
  role_name     = var.role_name
  policy_name   = var.policy_name
}

module "s3_bucket" {
  source = "./modules/s3"

  bucket_name = var.bucket_name
  environment = var.environment
  versioning  = true
}

module "sns" {
  source = "./modules/sns"

  topic_name = var.topic_name
}
