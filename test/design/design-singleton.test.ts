import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ConfigSingleton } from '../../src/algorithms/design/design-singleton/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/design/design-singleton/trace.ts';

test('singleton 多次 getInstance 同一实例', () => {
  ConfigSingleton.reset();
  const a = ConfigSingleton.getInstance();
  const b = ConfigSingleton.getInstance();
  assert.equal(a, b);
});
test('singleton set/get', () => {
  ConfigSingleton.reset();
  const c = ConfigSingleton.getInstance();
  c.set('k', 'v');
  assert.equal(c.get('k'), 'v');
});
test('singleton 访问计数', () => {
  ConfigSingleton.reset();
  const c = ConfigSingleton.getInstance();
  c.set('a', '1');
  c.set('b', '2');
  c.get('a');
  c.get('b');
  c.get('a');
  assert.equal(c.getAccessCount(), 3);
});
test('singleton 状态在 getInstance 间共享', () => {
  ConfigSingleton.reset();
  ConfigSingleton.getInstance().set('x', '9');
  assert.equal(ConfigSingleton.getInstance().get('x'), '9');
});
test('singleton get 未设置返回 undefined', () => {
  ConfigSingleton.reset();
  assert.equal(ConfigSingleton.getInstance().get('ghost'), undefined);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace(DEFAULT_INPUT).length >= 3);
});
