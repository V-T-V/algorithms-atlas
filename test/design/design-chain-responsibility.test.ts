import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildChain } from '../../src/algorithms/design/design-chain-responsibility/impl.ts';
import {
  buildTrace,
  DEFAULT_INPUT,
} from '../../src/algorithms/design/design-chain-responsibility/trace.ts';

test('chain L1 处理简单问题', () => {
  const r = buildChain().handle(1);
  assert.equal(r, 'L1');
});
test('chain L2 处理中等问题', () => {
  const r = buildChain().handle(3);
  assert.equal(r, 'L2');
});
test('chain L3 处理困难问题', () => {
  const r = buildChain().handle(5);
  assert.equal(r, 'L3');
});
test('chain 超出所有级别返回 null', () => {
  const r = buildChain().handle(99);
  assert.equal(r, null);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace(DEFAULT_INPUT).length >= 3);
});
