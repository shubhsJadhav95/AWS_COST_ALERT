variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "bucket_name" {
  type = string
}

variable "function_name" {
  type = string
  default = "lambda-alert"
}

variable "role_name" {
  type = string
  default = "lambda-role"
}

variable "environment" {
  type    = string
  default = "dev"
}

variable "email_endpoints" {
  type = list(string)
}

variable "policy_name" {
  type = string
}

variable "layer_name" {
  type = string
}

variable "topic_name" {
  type = string
}