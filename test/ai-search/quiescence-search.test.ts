import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  quiescence,
  alphaBetaWithQuiescence,
  buildCaptureChain,
  type QsNode,
} from '../../src/algorithms/ai-search/quiescence-search/impl.ts';

test('quiescence 静止局面返回 standPat', () => {
  const node: QsNode = { id: 'x', staticEval: 7 };
  const v = quiescence(node, -Infinity, Infinity);
  assert.equal(v, 7);
});

test('quiescence capture 链使值高于静态估值', () => {
  // 静态 -3，但 capture 链 → +5
  const root = buildCaptureChain();
  const v = quiescence(root, -Infinity, Infinity);
  assert.ok(v > -3, `静止值 ${v} 应高于静态 -3`);
  // 根有一个 capture 通向 mid（se=-2），mid 有 capture 通向 deepGood（se=5）
  // 根视角 = max(-3, -quiescence(mid)) = max(-3, -max(-2, -quiescence(deepGood)))
  //        = max(-3, -max(-2, -5)) = max(-3, -(-2)) = max(-3, 2) = 2
  assert.equal(v, 2);
});

test('quiescence standPat >= beta 时直接返回（剪枝）', () => {
  // standPat=10, beta=5 → 应直接返回 10 不展开 capture
  let stands = 0;
  const node: QsNode = {
    id: 'n',
    staticEval: 10,
    children: [{ moveId: 0, isCapture: true, node: { id: 'c', staticEval: 1 } }],
  };
  const v = quiescence(node, -Infinity, 5, {
    onStandPat: () => stands++,
  });
  assert.equal(v, 10);
  assert.equal(stands, 1);
});

test('quiescence 无 capture 子节点时返回 standPat', () => {
  const node: QsNode = {
    id: 'n',
    staticEval: 4,
    children: [{ moveId: 0, isCapture: false, node: { id: 'c', staticEval: 1 } }],
  };
  assert.equal(quiescence(node, -Infinity, Infinity), 4);
});

test('alphaBetaWithQuiescence depth=0 时调用 quiescence', () => {
  const root = buildCaptureChain();
  const v = alphaBetaWithQuiescence(root, 0, -Infinity, Infinity);
  assert.ok(v > -3);
});

test('quiescence 钩子被调用', () => {
  let stands = 0;
  let captures = 0;
  let returns = 0;
  const root = buildCaptureChain();
  quiescence(root, -Infinity, Infinity, {
    onStandPat: () => stands++,
    onCapture: () => captures++,
    onReturn: () => returns++,
  });
  assert.ok(stands > 0);
  assert.ok(captures > 0);
  assert.ok(returns > 0);
});
