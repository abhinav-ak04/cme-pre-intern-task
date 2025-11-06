output "cloudsql_instance_connection_name" {
  description = "Cloud SQL instance connection name (useful for Cloud SQL Proxy or connectors)"
  value       = google_sql_database_instance.postgres.connection_name
}

output "cloudsql_private_ip" {
  description = "Private IP address for the Cloud SQL instance (if available)"
  value       = google_sql_database_instance.postgres.ip_address[*].ip_address
  # Note: this returns an array; the private IP may appear here once provisioning completes.
}
