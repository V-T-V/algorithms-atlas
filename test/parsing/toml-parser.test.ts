import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseToml } from '../../src/algorithms/parsing/toml-parser/impl.ts';
import { buildTrace } from '../../src/algorithms/parsing/toml-parser/trace.ts';

test('parseToml 基本键值', () => {
  const r = parseToml('title = "hi"\ncount = 3\nflag = true');
  assert.equal(r['title'], 'hi');
  assert.equal(r['count'], 3);
  assert.equal(r['flag'], true);
});

test('parseToml 节与嵌套', () => {
  const r = parseToml('[server]\nhost = "localhost"\nport = 8080');
  assert.deepEqual(r['server'], { host: 'localhost', port: 8080 });
});

test('parseToml 点号嵌套节', () => {
  const r = parseToml('[a.b.c]\nx = 1');
  assert.equal((r['a'] as { b: { c: { x: number } } }).b.c.x, 1);
});

test('parseToml 数组', () => {
  const r = parseToml('tags = ["x", "y", "z"]');
  assert.deepEqual(r['tags'], ['x', 'y', 'z']);
});

test('parseToml 空数组', () => {
  const r = parseToml('empty = []');
  assert.deepEqual(r['empty'], []);
});

test('parseToml 忽略空行与注释', () => {
  const r = parseToml('# comment\n\nkey = 5\n');
  assert.equal(r['key'], 5);
});

test('parseToml 负数与浮点', () => {
  const r = parseToml('a = -7\nb = 3.14');
  assert.equal(r['a'], -7);
  assert.equal(r['b'], 3.14);
});

test('parseToml 钩子触发', () => {
  let kvs = 0;
  let secs = 0;
  parseToml('[s]\nk = 1', {
    onKeyValue: () => kvs++,
    onSection: () => secs++,
  });
  assert.equal(kvs, 1);
  assert.equal(secs, 1);
});

test('buildTrace 生成帧序列', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 3);
});
