const { execSync } = require('child_process');

jest.setTimeout(120000);

function getLoadBalancerIp() {
  const cmd =
    "kubectl get svc product-api-lb -n default -o jsonpath='{.status.loadBalancer.ingress[0].ip}'";
  const output = execSync(cmd, { encoding: 'utf-8' }).trim();

  if (!output) {
    throw new Error('Could not find external IP for service product-api-lb');
  }

  return output.replace(/^'/, '').replace(/'$/, '');
}

describe('Smoke test: API root endpoint', () => {
  let baseUrl;

  beforeAll(() => {
    const lbIp = getLoadBalancerIp();
    baseUrl = `http://${lbIp}`;
    console.log('Smoke test using base URL:', baseUrl);
  });

  test('GET / should return 200', async () => {
    const res = await fetch(`${baseUrl}/`);
    expect(res.status).toBe(200);
  });
});
