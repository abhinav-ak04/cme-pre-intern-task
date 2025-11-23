resource "google_container_cluster" "primary" {
  name     = var.cluster_name
  location = var.zone

  remove_default_node_pool = true
  initial_node_count       = 1

  networking_mode = "VPC_NATIVE"

  release_channel {
    channel = "STABLE"
  }

  maintenance_policy {
    daily_maintenance_window {
      start_time = "03:00"
    }
  }
}

resource "google_container_node_pool" "primary_nodes" {
  name     = "${var.cluster_name}-pool"
  cluster  = google_container_cluster.primary.name
  location = google_container_cluster.primary.location

  node_count = var.node_count

  node_config {
    machine_type = var.machine_type
    disk_size_gb = var.node_disk_size_gb

    oauth_scopes = [
      "https://www.googleapis.com/auth/cloud-platform"
    ]
  }

  autoscaling {
    min_node_count = 1
    max_node_count = 3
  }

  management {
    auto_repair  = true
    auto_upgrade = true
  }
}
