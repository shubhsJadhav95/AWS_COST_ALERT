variable "topic_name" {
  type = string
}

variable "email_endpoints" {
  type    = list(string)
  default = []
}