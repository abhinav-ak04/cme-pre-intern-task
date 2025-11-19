// Integration test: POST /products -> GET /products/:id -> DELETE /products/:id
// Hits the real deployed API on GKE and Cloud SQL.

const { execSync } = require('child_process');

// Helper: get LoadBalancer IP from Kubernetes via kubectl
function getLoadBalancerIp() {
  const cmd =
    "kubectl get svc product-api-lb -n default -o jsonpath='{.status.loadBalancer.ingress[0].ip}'";
  const output = execSync(cmd, { encoding: 'utf-8' }).trim();

  if (!output) {
    throw new Error('Could not find external IP for service product-api-lb');
  }

  return output.replace(/^'/, '').replace(/'$/, '');
}

describe('Product API integration (live GKE + Cloud SQL)', () => {
  let baseUrl;
  let createdProductId;

  beforeAll(async () => {
    const lbIp = getLoadBalancerIp();
    baseUrl = `http://${lbIp}`;
    console.log('Using base URL:', baseUrl);
  });

  test('should create, read and delete a product successfully', async () => {
    // 1) Create a new product via POST /products
    const newProductPayload = {
      name: 'CI Test Product ' + Date.now(),
      description: 'Product created by Jest integration test',
      price: 123.45,
      quantity: 10,
    };

    const createRes = await fetch(`${baseUrl}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.API_KEY || '',
      },
      body: JSON.stringify(newProductPayload),
    });

    expect(createRes.status).toBe(201);

    const createBody = await createRes.json();
    expect(createBody).toHaveProperty('product');
    expect(createBody.product).toHaveProperty('id');

    createdProductId = createBody.product.id;
    expect(createdProductId).toBeTruthy();

    // 2) Fetch the product by ID: GET /products/:id
    const getByIdRes = await fetch(`${baseUrl}/products/${createdProductId}`);
    expect(getByIdRes.status).toBe(200);

    const getByIdBody = await getByIdRes.json();
    expect(getByIdBody).toHaveProperty('product');
    expect(getByIdBody.product.name).toBe(newProductPayload.name);

    // 3) Optionally, check that GET /products returns it somewhere in the list
    const listRes = await fetch(`${baseUrl}/products`);
    expect(listRes.status).toBe(200);

    const listBody = await listRes.json();
    expect(listBody).toHaveProperty('products');
    const found = listBody.products.some((p) => p.id === createdProductId);
    expect(found).toBe(true);
  });

  afterAll(async () => {
    // Cleanup: delete the product if it was created
    if (!createdProductId) return;

    const deleteRes = await fetch(`${baseUrl}/products/${createdProductId}`, {
      method: 'DELETE',
      headers: { 'x-api-key': process.env.API_KEY || '' },
    });

    // Even if delete fails, don't throw too hard
    if (deleteRes.status !== 200) {
      console.warn(
        `Cleanup: expected 200 deleting product ${createdProductId}, got`,
        deleteRes.status
      );
    }
  });
});
