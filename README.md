# 🌐 CME Pre-Intern Task — Scalable Product REST API with Terraform and Cloud SQL

To develop a simple REST API application that interacts with a PostgreSQL database, and set up a CI/CD pipeline for automated deployments to GKE.

## Project Progress (as of now)

| Stage                           | Description                                                                         | Status       |
| :------------------------------ | :---------------------------------------------------------------------------------- | :----------- |
| 1. REST API Development         | Built a Node.js + Express API with Sequelize ORM for managing products.             | ✅ Completed |
| 2. Database Setup               | PostgreSQL instance created and connected using Google Cloud SQL.                   | ✅ Completed |
| 3. Infrastructure as Code (IaC) | Provisioned Cloud SQL instance using Terraform scripts.`                            | ✅ Completed |
| 4. Cloud SQL Connection         | Connected local and Dockerized app to Cloud SQL via Cloud SQL Auth Proxy.           | ✅ Completed |
| 5. Dockerization                | Containerized the API using a production-ready Dockerfile.                          | ✅ Completed |
| 6. Repository Setup             | Structured and cleaned the repo with .gitignore, .env, and proper folder hierarchy. | ✅ Completed |
| GKE Deployment                  | Deploying the containerized app on Google Kubernetes Engine.                        | 🔜 Next Step |
| 8. CI/CD Pipeline               | Automating deployments via GitHub Actions or GCP Cloud Build.                       | 🔜 Upcoming  |

## API Reference

#### Health check — verifies the API is running

```http
  GET /
```

#### Get all products

```http
  GET /products
```

#### Get a product by ID

```http
  GET /products/:id
```

| Parameter | Type   | Description                       |
| :-------- | :----- | :-------------------------------- |
| `id`      | `UUID` | **Required**. Id of item to fetch |

#### Create a new product

```http
  POST /products/
```

#### Update an existing product

```http
  PUT /products/:id
```

| Parameter | Type   | Description                        |
| :-------- | :----- | :--------------------------------- |
| `id`      | `UUID` | **Required**. Id of item to update |

#### Delete a product by ID

```http
  GET /products/:id
```

| Parameter | Type   | Description                        |
| :-------- | :----- | :--------------------------------- |
| `id`      | `UUID` | **Required**. Id of item to delete |
