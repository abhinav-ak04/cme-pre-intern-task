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


# GKE cluster variables
variable "zone" {
  description = "The GCP zone where the GKE cluster will be deployed"
  type        = string
  default     = "us-central1-a"
}

variable "cluster_name" {
  description = "Name of the GKE cluster"
  type        = string
  default     = "cme-preintern-gke"
}

variable "node_count" {
  description = "Number of nodes in the cluster"
  type        = number
  default     = 1
}

variable "machine_type" {
  description = "Machine type for GKE nodes"
  type        = string
  default     = "e2-small"  # Low-cost node type (1 vCPU, 2GB RAM)
}

variable "node_disk_size_gb" {
  description = "Disk size for each GKE node (in GB)"
  type        = number
  default     = 20
}
