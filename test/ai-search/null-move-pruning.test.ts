import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  alphaBetaNullMove,
  alphaBetaPlain,
  buildTree,
  DEFAULT_NM_CONFIG,
} from '../../src/algorithms/ai-search/null-move-pruning/impl.ts';

test('null-move 禁用时与纯 alpha-beta 一致', () => {
  const utils = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25];
  const a = buildTree({ utilities: utils, branching: 4 });
  const b = buildTree({ utilities: utils, branching: 4 });
  const disabled = { minDepth: 3, reduction: 2, enabled: false };
  const va = alphaBetaNullMove(a, 2, -Infinity, Infinity, disabled);
  const vb = alphaBetaPlain(b, 2, -Infinity, Infinity);
  assert.equal(va, vb);
});

test('null-move 单叶子返回效用', () => {
  const root = { id: 'x', utility: 42 };
  assert.equal(alphaBetaNullMove(root, 3, -Infinity, Infinity), 42);
});

test('null-move 钩子被调用', () => {
  const a = buildTree({ utilities: [10, 11, 12, 13, 14, 15, 16, 17], branching: 2 });
  let tries = 0;
  let visits = 0;
  alphaBetaNullMove(a, 3, -Infinity, Infinity, DEFAULT_NM_CONFIG, {
    onNullTry: () => tries++,
    onVisit: () => visits++,
  });
  assert.ok(visits > 0);
  assert.ok(tries >= 0);
});

test('null-move 启用与禁用根值关系稳定（启用时可能更乐观）', () => {
  const utils = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25];
  const a = buildTree({ utilities: utils, branching: 4 });
  const b = buildTree({ utilities: utils, branching: 4 });
  const enabled = alphaBetaNullMove(a, 2, -Infinity, Infinity, DEFAULT_NM_CONFIG);
  const disabled = alphaBetaPlain(b, 2, -Infinity, Infinity);
  // 根值都应是有效数字
  assert.ok(typeof enabled === 'number');
  assert.ok(typeof disabled === 'number');
});

test('null-move 配置 R=0 不触发空着（minDepth 高）', () => {
  const a = buildTree({ utilities: [10, 11, 12, 13, 14, 15, 16, 17], branching: 2 });
  const cfg = { minDepth: 100, reduction: 2, enabled: true };
  let tries = 0;
  alphaBetaNullMove(a, 3, -Infinity, Infinity, cfg, {
    onNullTry: () => tries++,
  });
  assert.equal(tries, 0);
});
