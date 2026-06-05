variable "bucket_name" {
  type = string
}

variable "environment" {
  type    = string
  default = "dev"
}

variable "versioning" {
  type    = bool
  default = true
}