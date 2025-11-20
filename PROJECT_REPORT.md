
# Project Report: Scalable REST API on GKE

## 1. Executive Summary
This report documents the design, development, and deployment of a scalable REST API for the CME Group Pre-Internship assignment. The project leverages Google Cloud Platform (GCP) to provide a highly available, secure, and observable infrastructure. The core application is a Node.js microservice managed by Kubernetes (GKE) and supported by a fully automated CI/CD pipeline via GitHub Actions.

## 2. Design Decisions
### 2.1 Database Connectivity: Sidecar Pattern
**Decision:** Use Google Cloud SQL Auth Proxy as a sidecar container in the Kubernetes Pod.

**Reasoning:**
- **Security:** It eliminates the need to whitelist pod IPs or manage SSL certificates manually. The proxy handles authentication using IAM.
- **Simplicity:** The application logic connects to localhost, decoupling the app from cloud-specific networking logic.

### 2.2 Infrastructure as Code: Terraform
**Decision:** Use Terraform for all resource provisioning.

**Reasoning:**
- Ensures the infrastructure is reproducible and version-controlled.
- Prevents configuration drift by maintaining a state file.
- Modular configuration allows easy resizing of the GKE cluster or Database tiers.

### 2.3 CI/CD: GitHub Actions
**Decision:** Use GitHub Actions for the pipeline.

**Reasoning:**
- Deep integration with the source code repository.
- Supports OIDC/Service Account authentication with GCP.
- Allows for creating "Post-Deployment" test jobs that run verification scripts against the live environment immediately after a rollout.

### 2.4 Observability: Structured Logging
**Decision:** Use `pino` for JSON logging.

**Reasoning:**
- Google Cloud Logging parses JSON logs automatically. This allows for creating Log-Based Metrics (e.g., extracting `duration_ms` from log payloads to chart latency) without complex parsing rules.


## 3. Challenges Faced & Solutions
- **Challenge:** Application logs were not appearing correctly in Cloud Logging.
    - **Solution:** The logger was configured to "pretty print" in production. I refactored the logger to emit raw JSON in all environments, ensuring GKE's fluentd agent could parse them correctly.

- **Challenge:** CI/CD pipeline failing due to stale Docker images.
    - **Solution:**  Kubernetes was using cached images due to the imagePullPolicy: IfNotPresent. I updated the policy to Always to ensure the latest code is pulled on every deployment.

- **Challenge:** Handling secrets securely.
    - **Solution:** Migrated from .env files to Kubernetes Secrets. In the CI/CD pipeline, Google Service Account keys are stored in GitHub Secrets and never exposed in the codebase.


## 4. Security Implementation
- **API Security:** Implemented a custom middleware to enforce API Key validation for `POST`, `PUT`, and `DELETE` routes.
- **IAM:** Followed the principle of Least Privilege. The CI/CD Service Account has restricted permissions (scoped only to GKE and Artifact Registry).
- **Network:** The Database is secured behind the Cloud SQL Proxy, encrypted in transit.

## 5. Conclusion

The project successfully demonstrates a modern DevSecOps workflow. The architecture supports zero-downtime deployments, automatic scaling (via GKE), and provides deep visibility into application health through structured logging and monitoring dashboards.