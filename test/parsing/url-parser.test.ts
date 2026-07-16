import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseUrl } from '../../src/algorithms/parsing/url-parser/impl.ts';
import { buildTrace } from '../../src/algorithms/parsing/url-parser/trace.ts';

test('parseUrl 完整 URL', () => {
  const u = parseUrl('https://user:pass@example.com:8080/api/v1/search?q=hello&page=2#results');
  assert.equal(u.scheme, 'https');
  assert.equal(u.user, 'user');
  assert.equal(u.password, 'pass');
  assert.equal(u.host, 'example.com');
  assert.equal(u.port, 8080);
  assert.equal(u.path, '/api/v1/search');
  assert.equal(u.query['q'], 'hello');
  assert.equal(u.query['page'], '2');
  assert.equal(u.fragment, 'results');
});

test('parseUrl 无端口无查询', () => {
  const u = parseUrl('http://localhost/foo');
  assert.equal(u.scheme, 'http');
  assert.equal(u.host, 'localhost');
  assert.equal(u.port, undefined);
  assert.equal(u.path, '/foo');
});

test('parseUrl 仅查询参数', () => {
  const u = parseUrl('https://a.com/x?a=1&b=2&c');
  assert.equal(u.query['a'], '1');
  assert.equal(u.query['b'], '2');
  assert.equal(u.query['c'], '');
});

test('parseUrl 仅锚点', () => {
  const u = parseUrl('https://a.com/#top');
  assert.equal(u.fragment, 'top');
});

test('parseUrl URL 编码', () => {
  const u = parseUrl('https://a.com/s?q=hello%20world');
  assert.equal(u.query['q'], 'hello world');
});

test('parseUrl 无 scheme', () => {
  const u = parseUrl('example.com/path');
  assert.equal(u.scheme, '');
  assert.equal(u.host, 'example.com');
});

test('parseUrl userinfo 无密码', () => {
  const u = parseUrl('ftp://alice@host/x');
  assert.equal(u.user, 'alice');
  assert.equal(u.password, undefined);
});

test('parseUrl 钩子触发', () => {
  let schemes = 0;
  let params = 0;
  parseUrl('https://h/p?a=1&b=2', {
    onScheme: () => schemes++,
    onQueryParam: () => params++,
  });
  assert.equal(schemes, 1);
  assert.equal(params, 2);
});

test('buildTrace 生成帧序列', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 3);
});
