#!/usr/bin/env bash
set -eu

# Service name in k8s
SVC_NAME="product-api-lb"
NAMESPACE="${K8S_NAMESPACE:-default}"

# How long to wait total (in seconds) and polling
MAX_WAIT=300   # 5 minutes
SLEEP=10       # 10 seconds between tries
TRIES=$((MAX_WAIT / SLEEP))

echo "Looking up external IP for service $SVC_NAME in namespace $NAMESPACE..."

# get external IP from kubectl (assumes kubecontext is configured already)
LB_IP=""
for i in $(seq 1 $TRIES); do
  LB_IP=$(kubectl get svc "$SVC_NAME" -n "$NAMESPACE" -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null || true)
  if [ -n "$LB_IP" ]; then
    echo "Found External IP: $LB_IP"
    break
  fi
  echo "External IP not available yet (attempt $i/$TRIES). Sleeping $SLEEP s..."
  sleep $SLEEP
done

if [ -z "$LB_IP" ]; then
  echo "::error::Failed to discover external IP for service $SVC_NAME within $MAX_WAIT seconds."
  exit 1
fi

URL="http://$LB_IP/"
echo "Testing endpoint: $URL"

# Try hitting the endpoint until success or timeout
for i in $(seq 1 $TRIES); do
  HTTP_CODE=$(curl -sS -o /dev/null -w "%{http_code}" "$URL" || echo "000")
  if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ OK — $URL returned 200"
    exit 0
  fi
  echo "Attempt $i/$TRIES: got HTTP $HTTP_CODE — retrying in $SLEEP s ..."
  sleep $SLEEP
done

echo "::error::Endpoint $URL did not return HTTP 200 after $MAX_WAIT seconds."
exit 1
