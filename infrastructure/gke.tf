resource "google_container_cluster" "primary" {
  name     = var.cluster_name
  location = var.zone

  # Remove the default node pool so we define our own node pool below
  remove_default_node_pool = true
  initial_node_count       = 1

  # Use VPC-native (alias IPs) networking - recommended
  networking_mode = "VPC_NATIVE"

  # Minimal cluster settings
  release_channel {
    channel = "STABLE"
  }

  # Basic maintenance window (UTC) to avoid surprise upgrades during your demo
  maintenance_policy {
    daily_maintenance_window {
      start_time = "03:00"
    }
  }

  # Optional IP allocation config left to defaults for now
}

resource "google_container_node_pool" "primary_nodes" {
  name     = "${var.cluster_name}-pool"
  cluster  = google_container_cluster.primary.name
  location = google_container_cluster.primary.location

  node_count = var.node_count

  node_config {
    machine_type = var.machine_type
    disk_size_gb = var.node_disk_size_gb

    # Keep scopes broad for demo convenience; in production use least-privilege or Workload Identity.
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
