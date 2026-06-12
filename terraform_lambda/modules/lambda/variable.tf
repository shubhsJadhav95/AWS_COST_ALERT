variable "function_name" {
  type    = string
  default = "default_name"
}

variable "role_name" {
  type    = string
  default = "default_role_name"
}

variable "policy_name" {
  type    = string
  default = "default_policy_name"
}

variable "layer_arn" {
  type        = string
  description = "ARN of the Lambda layer to attach"
}

variable "sns_topic_arn" {
  type        = string
  description = "ARN of the SNS topic for cost alerts"
}

