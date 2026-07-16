import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  lambdaSearch,
  buildFlatTree,
  DEFAULT_LAMBDA_CONFIG,
} from '../../src/algorithms/ai-search/lambda-search/impl.ts';

test('lambda-search 直接威胁（λ=1）', () => {
  // root 有一个 utility=200 子节点（≥ 阈值 100）
  const root = buildFlatTree([10, 200, 30]);
  const lambda = lambdaSearch(root, DEFAULT_LAMBDA_CONFIG);
  assert.equal(lambda, 1);
});

test('lambda-search 无威胁返回 ∞', () => {
  const root = buildFlatTree([1, 2, 3]);
  const lambda = lambdaSearch(root, DEFAULT_LAMBDA_CONFIG);
  assert.equal(lambda, Infinity);
});

test('lambda-search 单叶子（叶子无子）', () => {
  const leaf = { id: 'x', utility: 150 };
  assert.equal(lambdaSearch(leaf, DEFAULT_LAMBDA_CONFIG), 1);
});

test('lambda-search 单叶子不达阈值返回 ∞', () => {
  const leaf = { id: 'x', utility: 50 };
  assert.equal(lambdaSearch(leaf, DEFAULT_LAMBDA_CONFIG), Infinity);
});

test('lambda-search 钩子被调用', () => {
  const root = buildFlatTree([10, 200]);
  let probes = 0;
  let threats = 0;
  lambdaSearch(root, DEFAULT_LAMBDA_CONFIG, {
    onProbe: () => probes++,
    onThreatFound: () => threats++,
  });
  assert.ok(probes > 0);
  assert.ok(threats >= 1);
});

test('lambda-search 多个子节点都达阈值仍返回 λ=1', () => {
  const root = buildFlatTree([100, 150, 200]);
  assert.equal(lambdaSearch(root, DEFAULT_LAMBDA_CONFIG), 1);
});
