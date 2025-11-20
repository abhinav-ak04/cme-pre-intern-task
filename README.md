
# 🚀 Scalable REST API on GKE with CI/CD

This repository contains a cloud-native REST API application deployed on **Google Kubernetes Engine (GKE)** backed by **Cloud SQL (PostgreSQL)**. It features a fully automated **CI/CD pipeline** using GitHub Actions, **Infrastructure as Code (IaC)** using Terraform, and comprehensive observability and security practices.


## 📋 Project Overview

The objective of this project was to design, develop, and deploy a containerized application with a robust DevOps workflow.

### Tech Stack
- **Application:** Node.js (Express.js) with Sequelize ORM.
- **Database:** Google Cloud SQL (PostgreSQL 15).
- **Containerization:** Docker (Multi-stage builds).
- **Orchestration:** Google Kubernetes Engine (GKE).
- **IaC:** Terraform (managing GKE & Cloud SQL).
- **CI/CD:** GitHub Actions (Build -> Push -> Deploy -> Test).
- **Observability:** Google Cloud Logging (Pino structured logs) & Cloud Monitoring.
- **Security:** API Key Authentication, Kubernetes Secrets, Least Privilege IAM.

## 🏗️ Architecture

The application runs as a Pod in GKE. To ensure secure database connections without exposing the database to the public internet, the Sidecar Pattern is used with the Google Cloud SQL Auth Proxy.

**Traffic Flow**:
User -> GCP Load Balancer -> GKE Service -> Pod (Node API Container -> Localhost:5433 -> Cloud SQL Proxy Container) -> Cloud SQL Instance


## 📂 Repository Structure


```bash
  .
├── ci/                  # Automated test scripts (Smoke & Integration tests)
├── db/                  # Database connection logic
├── infrastructure/      # Terraform configuration files
│   ├── gke.tf           # Cluster & Node Pool definitions
│   ├── cloudsql.tf      # Database instance & user definitions
│   └── ...
├── k8s/                 # Kubernetes Manifests
│   ├── deployment.yaml  # App deployment with Sidecar
│   └── service.yaml     # LoadBalancer Service
├── models/              # Sequelize Data Models
├── routes/              # API Routes
├── controllers/         # API Controller Functions
├── utils/               # Utilities (Logger, etc.)
├── .github/workflows/   # CI/CD Pipeline definition
├── Dockerfile           # Application Container image
└── index.js             # Server Entry point
```




## 🛠️ Setup & Installation

### Prerequisites

 - [Google Cloud SDK (gcloud)](https://cloud.google.com/sdk/docs/install)
 - [Terraform](https://developer.hashicorp.com/terraform/downloads)
 - [Docker](https://docs.docker.com/get-docker/)
 - [Kubectl](https://kubernetes.io/docs/tasks/tools/)

 ### Local Development

 **1. Clone the repository:**
```bash
git clone abhinav-ak04/cme-pre-intern-task
```

 **2. Install dependencies:**
```bash
npm install
```
 **3. Setup Environment Variables:**
```bash
PORT=8000
DB_NAME=products
DB_USER=appuser
DB_PASS=<your-db-password>
DB_HOST=127.0.0.1
DB_PORT=5433  # Port exposed by Cloud SQL Proxy
DB_SSL=false
API_KEY=<your-secure-api-key> # Required for POST/PUT/DELETE
```
 **4. Run Cloud SQL Proxy (Required for local DB access):**
```bash
.\cloud-sql-proxy.exe "cme-pre-intern:us-central1:products-db-instance" --port 5433
```
 **5. Start the Server:**
```bash
npm run dev
```

## ☁️ Infrastructure Provisioning (Terraform)
The infrastructure/ folder contains Terraform scripts to provision the GKE Cluster and Cloud SQL instance.

**1. Initialize Terraform:**
```bash
cd infrastructure
terraform init
```

 **2. Plan the Infrastructure:**
```bash
terraform plan -out=tfplan
```
 **3. Apply Changes:**
```bash
terraform apply "tfplan"
```
*Output will provide the Cloud SQL Connection Name and IP addresses.*


## 🚀 CI/CD Pipeline
The project uses **GitHub Actions** for continuous integration and deployment. The pipeline (deploy.yml) triggers on every push to the main branch.

### Pipeline Stages:

**1. Build:** Creates a Docker image of the application.

**2. Push:** Pushes the image to Google Artifact Registry.

**3. Deploy:** Updates the GKE Deployment to use the new image using a Rolling Update strategy to ensure zero downtime.

**4. Verify:** Runs post-deployment smoke tests and integration tests against the live Load Balancer IP to ensure the API and Database are functioning correctly.




## 📘 API Documentation

The API runs on port `8000` (container) and port `80` (Load Balancer).

Authentication:
Write operations (`POST`, `PUT`, `DELETE`) require the header:
`x-api-key: <YOUR_CONFIGURED_API_KEY>`

| Method    | Endpoint     | Protected                |Description                |
| :-------- | :------- | :------------------------- |:------------------------- |
| `GET` | `/` | No |Health check. Returns "API is working fine" |
| `GET` | `/products` | No |Retrieve list of all products |
| `GET` | `/products/:id` | No |Retrieve a specific product by ID |
| `POST` | `/products` | **Yes** |Create a new product |
| `PUT` | `/products/:id` | **Yes** |Update an existing product |
| `DELETE` | `/products/:id` | **Yes** |Delete a product |


## 🛡️ Security & Observability

### Security

- **API Key Auth:** Middleware intercepts write requests to validate the `x-api-key` header.

- **Secrets Management:**  Database credentials and API keys are stored in **Kubernetes Secrets**, not in code or ConfigMaps.

- **Least Privilege:** The GitHub Actions Service Account has minimal IAM roles (`container.admin`, `storage.admin`) required for deployment.

- **Private Connectivity:** The application connects to the DB via `localhost` through the secure Cloud SQL Proxy tunnel, avoiding public IP exposure for the database connection logic.

### Observability

- **Logging:** The application uses `pino` to emit structured **JSON logs**. These are automatically captured by **Google Cloud Logging**.

- **Monitoring:** Custom Log-based metrics (`request_count`, `error_count`, `latency`) are configured in **Google Cloud Monitoring**.

- **Dashboards:** A custom GKE Dashboard tracks CPU/Memory usage, Request Per Second (RPS), and API Latency.


### 📝 License
This project is part of the CME Group Pre-Internship task.

