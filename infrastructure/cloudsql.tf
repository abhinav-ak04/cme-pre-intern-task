resource "google_sql_database_instance" "postgres" {
  name             = "products-db-instance"
  database_version = "POSTGRES_15"
  region           = var.region

  settings {
    tier = "db-f1-micro"  

    ip_configuration {
      ipv4_enabled = true

      authorized_networks {
        name  = "my-home-ip"
        value = "49.43.110.176/32" 
      }

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
