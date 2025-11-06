# versions.tf
terraform {
  required_providers {
    google = {
      # Specifies the source (HashiCorp's Google provider)
      source  = "hashicorp/google"
      # We lock the version to prevent unexpected changes
      version = "~> 5.0" 
    }
  }
}

