import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fibBinet, fibMatrix, fibCompare } from '../../src/algorithms/misc/fibonacci-binet/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/misc/fibonacci-binet/trace.ts';

test('fibMatrix 基本值', () => {
  assert.equal(fibMatrix(0), 0);
  assert.equal(fibMatrix(1), 1);
  assert.equal(fibMatrix(2), 1);
  assert.equal(fibMatrix(3), 2);
  assert.equal(fibMatrix(10), 55);
  assert.equal(fibMatrix(20), 6765);
});

test('fibBinet 基本值（小 n 精确）', () => {
  assert.equal(fibBinet(0), 0);
  assert.equal(fibBinet(1), 1);
  assert.equal(fibBinet(2), 1);
  assert.equal(fibBinet(10), 55);
  assert.equal(fibBinet(20), 6765);
});

test('fibMatrix 与 fibBinet 在小 n 一致', () => {
  for (let n = 0; n <= 70; n++) {
    assert.equal(fibMatrix(n), fibBinet(n), `n=${n} 不一致`);
  }
});

test('fibMatrix 递推关系 F(n) = F(n-1) + F(n-2)', () => {
  for (let n = 2; n <= 50; n++) {
    assert.equal(fibMatrix(n), fibMatrix(n - 1) + fibMatrix(n - 2));
  }
});

test('fibMatrix 大 n 正确（已知值）', () => {
  // F(50) = 12586269025
  assert.equal(fibMatrix(50), 12586269025);
});

test('fibMatrix 非法输入抛错', () => {
  assert.throws(() => fibMatrix(-1));
  assert.throws(() => fibMatrix(1.5));
});

test('fibBinet 非法输入抛错', () => {
  assert.throws(() => fibBinet(-1));
  assert.throws(() => fibBinet(1.5));
});

test('fibCompare 返回两个值', () => {
  const r = fibCompare(10);
  assert.equal(r.binet, 55);
  assert.equal(r.matrix, 55);
});

test('fibMatrix 钩子：onResult 触发', () => {
  let result = -1;
  fibMatrix(10, { onResult: (_n, v) => (result = v) });
  assert.equal(result, 55);
});

test('fibBinet 钩子：onBinet 触发', () => {
  let approx = 0;
  fibBinet(10, { onBinet: (_n, a) => (approx = a) });
  assert.ok(approx > 54 && approx < 56);
});

test('fibMatrix 钩子：onMatrixStep 触发（log n 次）', () => {
  let steps = 0;
  fibMatrix(100, { onMatrixStep: () => steps++ });
  // log2(100) ≈ 7，步数应在该量级
  assert.ok(steps >= 5 && steps <= 10);
});

test('buildTrace 含 aux，末帧含一致性', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 3);
  assert.ok(frames[0]!.aux, '首帧含 aux');
  const last = frames[frames.length - 1]!;
  const c = last.aux!.find((e) => e.label === '一致性');
  assert.ok(c, '末帧应含一致性');
});
