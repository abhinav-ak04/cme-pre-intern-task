# cloudsql.tf - Single Cloud SQL PostgreSQL instance (public IP for now), database, and user

resource "google_sql_database_instance" "postgres" {
  name             = "products-db-instance"
  database_version = "POSTGRES_15"
  region           = var.region

  settings {
    tier = "db-f1-micro"  # small instance for learning/dev

    ip_configuration {
      ipv4_enabled = true

      authorized_networks {
        name  = "my-home-ip"
        value = "49.43.110.176/32" 
      }

      # keep require_ssl true for better security (warning is OK)
      require_ssl = true
    }

    backup_configuration {
      enabled = true
    }

    availability_type = "ZONAL"
  }

  deletion_protection = false
}

resource "google_sql_database" "products_db" {
  name     = "products"
  instance = google_sql_database_instance.postgres.name
  charset  = "UTF8"
  collation = "en_US.UTF8"
}

resource "google_sql_user" "app_user" {
  name     = "appuser"
  instance = google_sql_database_instance.postgres.name
  password = var.db_password
}
