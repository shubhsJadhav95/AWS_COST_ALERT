variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "bucket_name" {
  type = string
  default = "shubhsJadhav95/aws-alert-bucket"
}

variable "function_name" {
    type = string
    default = "lambda-alert"
  
}


variable "role_name" {
    type = string
    default = "lambda-role"
  
}

