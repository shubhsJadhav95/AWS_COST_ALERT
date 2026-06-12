output "bucket_name" {
  value = module.s3_bucket.bucket_name
}

output "bucket_arn" {
  value = module.s3_bucket.bucket_arn
}

output "lambda_function_name" {
  value = module.Lambda.function_name
}

output "lambda_function_arn" {
  value = module.Lambda.function_arn
}

output "sns_topic_arn" {
  value = module.sns.topic_arn
}

output "layer_arn" {
  value = module.layer.layer_arn
}