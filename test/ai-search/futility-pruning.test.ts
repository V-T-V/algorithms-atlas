import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  alphaBetaFutility,
  alphaBetaPlain,
  buildTree,
  DEFAULT_FP_CONFIG,
} from '../../src/algorithms/ai-search/futility-pruning/impl.ts';

test('futility 禁用时与纯 alpha-beta 一致', () => {
  const utils = [100, 200, 300, 400, 500, 600, 700, 800];
  const a = buildTree({ utilities: utils, branching: 2 });
  const b = buildTree({ utilities: utils, branching: 2 });
  const disabled = { frontierDepth: 1, margin: 100, enabled: false };
  const va = alphaBetaFutility(a, 3, -Infinity, Infinity, disabled);
  const vb = alphaBetaPlain(b, 3, -Infinity, Infinity);
  assert.equal(va, vb);
});

test('futility 单叶子返回效用', () => {
  const root = { id: 'x', utility: 42 };
  assert.equal(alphaBetaFutility(root, 3, -Infinity, Infinity), 42);
});

test('futility 钩子被调用', () => {
  const a = buildTree({ utilities: [100, 200, 300, 400, 500, 600, 700, 800], branching: 2 });
  let visits = 0;
  let futile = 0;
  alphaBetaFutility(a, 3, -Infinity, Infinity, DEFAULT_FP_CONFIG, {
    onVisit: () => visits++,
    onFutile: () => futile++,
  });
  assert.ok(visits > 0);
  assert.ok(futile >= 0);
});

test('futility margin 大到不会触发裁枝', () => {
  const a = buildTree({ utilities: [100, 200, 300, 400, 500, 600, 700, 800], branching: 2 });
  const cfg = { frontierDepth: 1, margin: 100000, enabled: true };
  let futile = 0;
  alphaBetaFutility(a, 3, -Infinity, Infinity, cfg, {
    onFutile: () => futile++,
  });
  assert.equal(futile, 0);
});

test('futility frontierDepth 设为 0 不触发（叶子不被裁）', () => {
  const a = buildTree({ utilities: [100, 200, 300, 400, 500, 600, 700, 800], branching: 2 });
  const cfg = { frontierDepth: 0, margin: 100, enabled: true };
  let futile = 0;
  alphaBetaFutility(a, 3, -Infinity, Infinity, cfg, {
    onFutile: () => futile++,
  });
  assert.equal(futile, 0);
});
