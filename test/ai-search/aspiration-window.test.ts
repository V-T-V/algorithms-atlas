import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  aspirationSearch,
  fullWindowSearch,
  buildTree,
} from '../../src/algorithms/ai-search/aspiration-window/impl.ts';

test('渴望窗口 prevBest 准确且窗口够大时命中', () => {
  const utils = [3, 5, 2, 9, 1, 7, 4, 6];
  // 先求真值
  const rootTrue = buildTree([...utils], 2);
  const trueVal = fullWindowSearch(rootTrue, 3);
  // 用大窗口（>= 真值范围）必然命中
  const root = buildTree([...utils], 2);
  const r = aspirationSearch(root, 3, trueVal, 100);
  assert.equal(r.hit, true);
  assert.equal(r.value, trueVal);
});

test('渴望窗口 与全宽搜索结果一致（窗口命中）', () => {
  const utils = [3, 5, 2, 9, 1, 7, 4, 6];
  const rootA = buildTree([...utils], 2);
  const rootB = buildTree([...utils], 2);
  const trueVal = fullWindowSearch(rootA, 3);
  const r = aspirationSearch(rootB, 3, trueVal, 50);
  assert.equal(r.value, trueVal);
});

test('渴望窗口 与全宽搜索结果一致（窗口失败）', () => {
  const utils = [3, 5, 2, 9, 1, 7, 4, 6];
  const rootA = buildTree([...utils], 2);
  const rootB = buildTree([...utils], 2);
  const trueVal = fullWindowSearch(rootA, 3);
  // 故意把 prevBest 设错且窗口很窄 → 失败 → 重搜 → 结果仍 = trueVal
  const r = aspirationSearch(rootB, 3, trueVal + 1000, 1);
  assert.equal(r.hit, false);
  assert.equal(r.value, trueVal);
});

test('渴望窗口 fail-low 时正确重搜', () => {
  const utils = [1, 2, 3, 4, 5, 6, 7, 8];
  const rootA = buildTree([...utils], 2);
  const rootB = buildTree([...utils], 2);
  const trueVal = fullWindowSearch(rootA, 3);
  // prevBest 设很高 → 真值 ≤ alpha → fail-low
  const r = aspirationSearch(rootB, 3, trueVal + 100, 1);
  assert.equal(r.value, trueVal);
  assert.ok(r.researches >= 1);
});

test('渴望窗口 fail-high 时正确重搜', () => {
  const utils = [1, 2, 3, 4, 5, 6, 7, 8];
  const rootA = buildTree([...utils], 2);
  const rootB = buildTree([...utils], 2);
  const trueVal = fullWindowSearch(rootA, 3);
  // prevBest 设很低 → 真值 ≥ beta → fail-high
  const r = aspirationSearch(rootB, 3, trueVal - 100, 1);
  assert.equal(r.value, trueVal);
});

test('渴望窗口钩子被调用', () => {
  const utils = [3, 5, 2, 9];
  const rootA = buildTree([...utils], 2);
  const rootB = buildTree([...utils], 2);
  const trueVal = fullWindowSearch(rootA, 2);
  let searches = 0;
  let visits = 0;
  aspirationSearch(rootB, 2, trueVal + 50, 1, {
    onSearch: () => searches++,
    onVisit: () => visits++,
  });
  assert.ok(searches >= 1);
  assert.ok(visits > 0);
});
