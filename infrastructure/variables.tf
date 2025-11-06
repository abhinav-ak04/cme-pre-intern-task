# variables.tf

variable "gcp_project_id" {
  description = "The ID of the GCP project where resources will be created"
  type        = string
  default     = "cme-pre-intern" 
}

variable "region" {
  description = "The GCP region for the Cloud SQL and GKE services"
  type        = string
  default     = "us-central1" 
}

variable "db_password" {
  description = "The secure password for the PostgreSQL root user"
  type        = string
  sensitive   = true 
}