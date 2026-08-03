import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  bstar,
  buildTree,
  DEFAULT_BSTAR_CONFIG,
  type BstarNode,
} from '../../src/algorithms/ai-search/best-first-game-search/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/best-first-game-search/trace.ts';

/** 构造一棵两层 MAX 树：根（MAX）→ 两个 MIN → 各两个叶子。 */
function makeTwoLevelTree(utilities: number[]): BstarNode {
  const root: BstarNode = {
    id: 'root',
    isMax: true,
    opt: 0,
    pess: 0,
    expanded: false,
    children: [
      {
        id: 'L',
        isMax: false,
        opt: 0,
        pess: 0,
        expanded: false,
        children: [
          { id: 'L0', isMax: true, opt: 0, pess: 0, expanded: false, utility: utilities[0] },
          { id: 'L1', isMax: true, opt: 0, pess: 0, expanded: false, utility: utilities[1] },
        ],
      },
      {
        id: 'R',
        isMax: false,
        opt: 0,
        pess: 0,
        expanded: false,
        children: [
          { id: 'R0', isMax: true, opt: 0, pess: 0, expanded: false, utility: utilities[2] },
          { id: 'R1', isMax: true, opt: 0, pess: 0, expanded: false, utility: utilities[3] },
        ],
      },
    ],
  };
  return root;
}

test('best-first-game-search：MAX 选最优分支', () => {
  // 右子树叶子较大（R0=12, R1=8），MIN 会选小（8）；左子树 MIN 选 min(3,5)=3
  // MAX 根选 max(3, 8) = 8 → 右分支
  const root = makeTwoLevelTree([3, 5, 12, 8]);
  const best = bstar(root, DEFAULT_BSTAR_CONFIG);
  assert.equal(best.id, 'R');
});

test('best-first-game-search：叶子效用被 ±tolerance 初始化', () => {
  const root = makeTwoLevelTree([10, 10, 10, 10]);
  bstar(root, DEFAULT_BSTAR_CONFIG);
  // 取任意叶子验证 opt/pess 区间
  const leaf = root.children![0]!.children![0]!;
  assert.equal(leaf.opt, 10 + DEFAULT_BSTAR_CONFIG.tolerance);
  assert.equal(leaf.pess, 10 - DEFAULT_BSTAR_CONFIG.tolerance);
});

test('best-first-game-search：buildTree 构造的树可求解', () => {
  const root = buildTree({ utilities: [3, 12, 8, 2, 4, 6, 14, 10, 5], branching: 3 });
  const best = bstar(root, DEFAULT_BSTAR_CONFIG);
  // 应返回 root 的某个子节点
  assert.ok(root.children?.some((c) => c.id === best.id));
});

test('best-first-game-search：钩子被调用', () => {
  const root = makeTwoLevelTree([1, 2, 3, 4]);
  let expanded = 0;
  let propagated = 0;
  bstar(root, DEFAULT_BSTAR_CONFIG, {
    onExpand: () => (expanded += 1),
    onPropagate: () => (propagated += 1),
  });
  assert.ok(expanded >= 1, '至少展开一个内部节点');
});

test('best-first-game-search：maxExpansions 上限避免无限循环', () => {
  const root = makeTwoLevelTree([1, 2, 3, 4]);
  // 极小上限，确保不无限展开
  const best = bstar(root, { tolerance: 5, maxExpansions: 2 });
  assert.ok(root.children!.includes(best) || best === root);
});

test('best-first-game-search：单子节点根返回该子节点', () => {
  const root: BstarNode = {
    id: 'root',
    isMax: true,
    opt: 0,
    pess: 0,
    expanded: false,
    children: [
      { id: 'only', isMax: false, opt: 0, pess: 0, expanded: false, utility: 7 },
    ],
  };
  const best = bstar(root, DEFAULT_BSTAR_CONFIG);
  assert.equal(best.id, 'only');
});

test('buildTrace 生成有序帧', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 2);
});
