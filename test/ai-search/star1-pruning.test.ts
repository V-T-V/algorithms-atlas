import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  star1Search,
  expectimaxPlain,
  buildExampleTree,
  buildDeepTree,
  DEFAULT_STAR_CONFIG,
} from '../../src/algorithms/ai-search/star1-pruning/impl.ts';

test('Star1 与精确 expectimax 一致（示例树）', () => {
  const a = buildExampleTree();
  const b = buildExampleTree();
  const va = star1Search(a, DEFAULT_STAR_CONFIG.valueLo, DEFAULT_STAR_CONFIG.valueHi);
  const vb = expectimaxPlain(b);
  assert.equal(va.toFixed(3), vb.toFixed(3));
});

test('Star1 单叶子返回效用', () => {
  const root = { id: 'x', type: 'max' as const, utility: 42 };
  assert.equal(star1Search(root, DEFAULT_STAR_CONFIG.valueLo, DEFAULT_STAR_CONFIG.valueHi), 42);
});

test('Star1 禁用时仍与 expectimax 一致', () => {
  const a = buildExampleTree();
  const b = buildExampleTree();
  const cfg = {
    valueLo: DEFAULT_STAR_CONFIG.valueLo,
    valueHi: DEFAULT_STAR_CONFIG.valueHi,
    enabled: false,
  };
  const va = star1Search(a, cfg.valueLo, cfg.valueHi, cfg);
  const vb = expectimaxPlain(b);
  assert.equal(va.toFixed(3), vb.toFixed(3));
});

test('Star1 在深层树上与 expectimax 一致', () => {
  const a = buildDeepTree(2, [10, 20, 30, 40, 50, 60, 70, 80], [0.3, 0.7]);
  const b = buildDeepTree(2, [10, 20, 30, 40, 50, 60, 70, 80], [0.3, 0.7]);
  const va = star1Search(a, DEFAULT_STAR_CONFIG.valueLo, DEFAULT_STAR_CONFIG.valueHi);
  const vb = expectimaxPlain(b);
  assert.equal(va.toFixed(3), vb.toFixed(3));
});

test('Star1 钩子被调用', () => {
  const a = buildExampleTree();
  let visits = 0;
  let chanceChild = 0;
  star1Search(a, DEFAULT_STAR_CONFIG.valueLo, DEFAULT_STAR_CONFIG.valueHi, DEFAULT_STAR_CONFIG, {
    onVisit: () => visits++,
    onChanceChild: () => chanceChild++,
  });
  assert.ok(visits > 0);
  assert.ok(chanceChild > 0);
});
