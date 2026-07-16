import { test } from 'node:test';
import assert from 'node:assert/strict';
import { printNumbers } from '../../src/algorithms/recursion/print-numbers/impl.ts';
import { buildTrace } from '../../src/algorithms/recursion/print-numbers/trace.ts';

test('printNumbers 升序 1..n', () => {
  assert.deepEqual(printNumbers(5), [1, 2, 3, 4, 5]);
  assert.deepEqual(printNumbers(1), [1]);
});

test('printNumbers n=0 返回空', () => {
  assert.deepEqual(printNumbers(0), []);
});

test('printNumbers 非法输入抛错', () => {
  assert.throws(() => printNumbers(-1));
  assert.throws(() => printNumbers(1.5));
});

test('printNumbers 钩子触发', () => {
  let prints = 0;
  printNumbers(4, { onPrint: () => prints++ });
  assert.equal(prints, 4);
});

test('printNumbers 钩子基线触发', () => {
  let bases = 0;
  printNumbers(3, { onBase: () => bases++ });
  assert.equal(bases, 1);
});

test('buildTrace 生成帧序列', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 3);
});
