import { test } from 'node:test';
import assert from 'node:assert/strict';
import { matrixChain2 } from '../../src/algorithms/dp/matrix-chain-2/impl.ts';
import { buildTrace } from '../../src/algorithms/dp/matrix-chain-2/trace.ts';

test('matrix-chain-2 经典用例', () => {
  assert.equal(matrixChain2([40, 20, 30, 10, 30]), 26000);
  // [10,30,5,60]: (AB)C = 1500 + 3000 = 4500 最优
  assert.equal(matrixChain2([10, 30, 5, 60]), 4500);
});

test('matrix-chain-2 边界', () => {
  assert.equal(matrixChain2([10, 20]), 0); // 单矩阵
  assert.equal(matrixChain2([5]), 0);
});

test('matrix-chain-2 两矩阵', () => {
  // 2x3 与 3x4 -> 2*3*4 = 24
  assert.equal(matrixChain2([2, 3, 4]), 24);
});

test('matrix-chain-2 钩子被调用', () => {
  let tries = 0;
  let fills = 0;
  matrixChain2([10, 30, 5, 60], {
    onTry: () => tries++,
    onFill: () => fills++,
  });
  assert.ok(tries > 0);
  assert.ok(fills > 0);
});

test('matrix-chain-2 buildTrace 产出帧', () => {
  const frames = buildTrace();
  assert.ok(frames.length > 2);
});
