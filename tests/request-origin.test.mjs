import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isAllowedRequestOrigin } from '../src/lib/request-origin.ts';

test('accepts the public HTTPS origin behind an internal HTTP proxy', () => {
  assert.equal(isAllowedRequestOrigin('https://merigf.com', 'http://0.0.0.0:3000', 'https://merigf.com', true), true);
});
test('rejects foreign, missing, opaque and malformed origins', () => {
  for (const origin of [null, '', 'null', 'https://evil.example', 'https://merigf.com.evil.example', 'http://merigf.com', 'https://merigf.com:444', 'https://merigf.com/path', 'https://user@merigf.com', 'https://merigf.com, https://evil.example']) {
    assert.equal(isAllowedRequestOrigin(origin, 'http://0.0.0.0:3000', 'https://merigf.com', true), false, String(origin));
  }
});
test('does not trust a matching attacker-controlled request URL in production', () => {
  assert.equal(isAllowedRequestOrigin('https://evil.example', 'https://evil.example', 'https://merigf.com', true), false);
  assert.equal(isAllowedRequestOrigin('https://evil.example', 'https://evil.example', undefined, true), false);
});
test('supports local development without production configuration', () => {
  assert.equal(isAllowedRequestOrigin('http://localhost:3100', 'http://localhost:3100', undefined, false), true);
});
test('fails closed for an invalid configured URL', () => {
  assert.equal(isAllowedRequestOrigin('https://merigf.com', 'https://merigf.com', 'bad url', true), false);
});
