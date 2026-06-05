resource "aws_lambda_layer_version" "example" {
  filename   = "var.file_name"
  layer_name = "var.layer_name"

  compatible_runtimes = ["nodejs24.x"]
}




resource "aws_lambda_layer_version" "python_layen" {
  filename            = "../layer.zip"
  layer_name          = "pandas-python312"
  compatible_runtimes = ["python3.12"]

  source_code_hash = filebase64sha256(
    "../layer.zip"
  )
}