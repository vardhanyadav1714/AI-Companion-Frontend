import { test } from 'node:test';
import assert from 'node:assert/strict';
import { clientIpHeaders } from '../src/lib/client-ip.ts';

test('uses the validated ingress address and replaces incoming private headers', () => {
  assert.deepEqual(clientIpHeaders(new Headers({ 'x-real-ip': '203.0.113.4', 'x-forwarded-for': '198.51.100.2', 'x-eva-proxy-key': 'attacker' }), 'server-key'), {
    'X-Eva-Client-IP': '203.0.113.4', 'X-Eva-Proxy-Key': 'server-key'
  });
});
test('fails closed without a server key or a single valid ingress address', () => {
  for (const value of ['', 'fake', '203.0.113.1, 203.0.113.2']) assert.deepEqual(clientIpHeaders(new Headers({ 'x-real-ip': value }), 'server-key'), {});
  assert.deepEqual(clientIpHeaders(new Headers({ 'x-forwarded-for': '203.0.113.1' }), 'server-key'), {});
  assert.deepEqual(clientIpHeaders(new Headers({ 'x-real-ip': '203.0.113.1' }), ''), {});
});
