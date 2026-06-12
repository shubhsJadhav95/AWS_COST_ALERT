resource "aws_lambda_layer_version" "this" {
  filename            = var.layer_zip
  layer_name          = var.layer_name
  compatible_runtimes = ["python3.12"]
  source_code_hash    = filebase64sha256(var.layer_zip)
}