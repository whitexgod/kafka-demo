# Kafka Demo with NestJS

Simple event-driven demo using Kafka, Zookeeper, and two NestJS services:
- `job-service` publishes events
- `notification-service` consumes events

## Architecture

- `job-service` (host `localhost:3011`)
  - Produces to:
    - `job-events`
    - `analytics-events`
- `notification-service` (host `localhost:3012`)
  - Consumes:
    - `job-events`
    - `analytics-events`
- Kafka + Zookeeper via Docker Compose
- Kafka UI at `http://localhost:8080`

## Tech Stack

- NestJS
- KafkaJS
- Docker Compose
- Confluent Kafka + Zookeeper images

## Prerequisites

- Docker Desktop (or Docker Engine + Compose plugin)
- Node.js 18+ (only if running services outside Docker)

## Run with Docker

From repo root:

```bash
docker compose up --build
```

Services:
- Job service: `http://localhost:3011`
- Notification service: `http://localhost:3012`
- Kafka UI: `http://localhost:8080`

Stop:

```bash
docker compose down
```

## Health Endpoints

- `GET http://localhost:3011/health`
- `GET http://localhost:3012/health`

Note: these are HTTP endpoints, not HTTPS.

## API Endpoints

### 1) Create Job Event

`POST http://localhost:3011/jobs`

Body:

```json
{
  "title": "Backend Engineer"
}
```

Effect:
- Publishes `JOB_CREATED` to topic `job-events`

### 2) Track Job View Event

`POST http://localhost:3011/jobs/:id/view`

Example:

```bash
curl -X POST http://localhost:3011/jobs/123/view
```

Effect:
- Publishes `JOB_VIEWED` to topic `analytics-events`

## Kafka Topics

- `job-events`
- `analytics-events`

`notification-service` logs messages from both topics.

## Troubleshooting

### `ECONNREFUSED kafka:29092`

Usually means Kafka is not healthy yet or listeners are misconfigured.
This repo config includes:
- `KAFKA_LISTENERS` and `KAFKA_ADVERTISED_LISTENERS`
- Kafka healthcheck
- `depends_on` with `condition: service_healthy`

If needed:

```bash
docker compose down -v
docker compose up --build
```

### `https://localhost:3011/health` not responding

Use HTTP:

```bash
curl http://localhost:3011/health
```

### Git error: `'job-service/' does not have a commit checked out`

`job-service` is being treated as a broken submodule/nested repo.
If it should be a normal folder:

```bash
rm -rf job-service/.git
git add .
```

If it should be a real submodule:

```bash
git submodule update --init --recursive
```
