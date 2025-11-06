provider "google" {
  project = var.gcp_project_id
  region  = var.region
  # If you want to explicitly use ADC credentials from gcloud:
  # credentials = file(var.google_credentials_file)   # OPTIONAL if using ADC
}
