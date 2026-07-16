// ai-search data — 25 algorithms

export const algos = [
// ========================================================================
// 1. ais-parallel-ab
// ========================================================================
{
  id: 'ais-parallel-ab',
  titleZh: '并行 Alpha-Beta', titleEn: 'Parallel Alpha-Beta',
  summaryZh: '并行 alpha-beta：多线程并行搜索子树（PV-split 模拟）。',
  summaryEn: 'Parallel alpha-beta: search subtrees concurrently (PV-split simulation).',
  descZh: '并行 alpha-beta 在多核上加速博弈搜索。本实现以确定性事件序列模拟若干 worker：先搜长子建立 α-β 窗口，再「并行」搜索剩余子节点（带剪枝）。YBWC 思想：年轻兄弟等待老兄弟完成后才并行。',
  descEn: 'Parallel alpha-beta speeds up game-tree search on multi-cores. This impl deterministically simulates workers: first search the eldest child to set an α-β window, then "parallelize" the rest with pruning. YBWC idea: younger brothers wait for the eldest.',
  tags: ['ai-search','parallel','alpha-beta','game-tree'],
  time: 'O(b^d / p)', space: 'O(b^d)',
  impl: `// 并行 Alpha-Beta · 纯实现（事件序列模拟）
// 模拟 PV-split：先搜长子得到窗口，再并发搜剩余子节点。

export interface AbNode {
  id: string;
  utility?: number; // 叶值（negamax 语义）
  children?: AbNode[];
}

export interface ParallelAbHooks {
  onSearchChild?: (nodeId: string, worker: number) => void;
  onPvEstablished?: (alpha: number, beta: number) => void;
  onPrune?: (nodeId: string) => void;
  onResult?: (value: number) => void;
}

/** 单子树 alpha-beta（带深度限制）。 */
function alphaBeta(node: AbNode, alpha: number, beta: number, depth: number): number {
  if (depth === 0 || !node.children || node.children.length === 0) {
    return node.utility ?? 0;
  }
  let best = -Infinity;
  for (const c of node.children) {
    const v = -alphaBeta(c, -beta, -alpha, depth - 1);
    if (v > best) best = v;
    if (best > alpha) alpha = best;
    if (alpha >= beta) break;
  }
  return best;
}

/**
 * 并行 alpha-beta（PV-split 模拟）。
 * @param root 根节点
 * @param maxDepth 搜索深度
 * @param workers 并发 worker 数（>=1）
 */
export function parallelAlphaBeta(
  root: AbNode,
  maxDepth: number,
  workers: number,
  hooks: ParallelAbHooks = {},
): number {
  if (!root.children || root.children.length === 0) {
    const v = root.utility ?? 0;
    hooks.onResult?.(v);
    return v;
  }
  const w = Math.max(1, workers);
  // 阶段 1：搜索长子，建立窗口
  const first = root.children[0]!;
  hooks.onSearchChild?.(first.id, 0);
  let alpha = -alphaBeta(first, -Infinity, Infinity, maxDepth - 1);
  let beta = Infinity;
  hooks.onPvEstablished?.(alpha, beta);

  // 阶段 2：并发搜其余子节点（模拟：用 alpha 窗口，逐一执行但记录 worker 分配）
  for (let i = 1; i < root.children.length; i++) {
    const child = root.children[i]!;
    const worker = i % w;
    hooks.onSearchChild?.(child.id, worker);
    const v = -alphaBeta(child, -beta, -alpha, maxDepth - 1);
    if (v > alpha) {
      alpha = v;
    } else {
      hooks.onPrune?.(child.id);
    }
  }
  hooks.onResult?.(alpha);
  return alpha;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { parallelAlphaBeta, type AbNode } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const tree: AbNode = {
    id: 'root',
    children: [
      { id: 'A', children: [{ id: 'A1', utility: 3 }, { id: 'A2', utility: 9 }] },
      { id: 'B', children: [{ id: 'B1', utility: 5 }, { id: 'B2', utility: 2 }] },
      { id: 'C', children: [{ id: 'C1', utility: 7 }, { id: 'C2', utility: 1 }] },
    ],
  };
  const bars = (hi: string[] = []) =>
    [3, 9, 5, 2, 7, 1].map((v, i) => ({
      value: v,
      role: (hi.includes(['A1','A2','B1','B2','C1','C2'][i]!) ? 'swap' : 'default') as BarRole,
      label: ['A1','A2','B1','B2','C1','C2'][i],
    }));

  rec
    .begin({ zh: '并行 α-β：先搜长子 A 建立窗口', en: 'Parallel α-β: search eldest A to set window' })
    .setBars(bars(['A2']))
    .setAux([{ label: '阶段', value: 'PV 建立', role: 'compare' as BarRole }])
    .commit();

  parallelAlphaBeta(tree, 2, 2, {
    onPvEstablished: (a) => {
      rec
        .begin({ zh: \`窗口建立 α=\${a}\`, en: \`Window set α=\${a}\` })
        .setBars(bars(['A2']))
        .setAux([{ label: 'α', value: String(a), role: 'final' as BarRole }])
        .commit();
    },
    onSearchChild: (id) => {
      rec
        .begin({ zh: \`并行搜索 \${id}\`, en: \`Parallel search \${id}\` })
        .setBars(bars([id]))
        .setAux([{ label: '节点', value: id, role: 'frontier' as BarRole }])
        .commit();
    },
    onPrune: (id) => {
      rec
        .begin({ zh: \`剪枝 \${id}（值 ≤ α）\`, en: \`Prune \${id} (val ≤ α)\` })
        .setBars(bars([]))
        .setAux([{ label: '剪枝', value: id, role: 'warn' as BarRole }])
        .commit();
    },
    onResult: (v) => {
      rec
        .begin({ zh: \`完成：根值=\${v}\`, en: \`Done: root=\${v}\` })
        .setAux([{ label: '博弈值', value: String(v), role: 'final' as BarRole }])
        .commit();
    },
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parallelAlphaBeta, type AbNode } from '../../src/algorithms/ai-search/ais-parallel-ab/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-parallel-ab/trace.ts';

test('parallel ab 单叶返回 utility', () => {
  const v = parallelAlphaBeta({ id: 'r', utility: 7 }, 3, 2);
  assert.equal(v, 7);
});

test('parallel ab 取子节点最大', () => {
  const t: AbNode = {
    id: 'r',
    children: [
      { id: 'a', children: [{ id: 'a1', utility: 3 }, { id: 'a2', utility: 9 }] },
      { id: 'b', children: [{ id: 'b1', utility: 5 }, { id: 'b2', utility: 2 }] },
    ],
  };
  // negamax depth2: root = max(-max(-3,-9), -max(-5,-2)) = max(3, 2) = 3
  const v = parallelAlphaBeta(t, 2, 2);
  assert.equal(v, 3);
});

test('parallel ab workers=1 仍正确', () => {
  const t: AbNode = {
    id: 'r',
    children: [
      { id: 'a', utility: 4 },
      { id: 'b', utility: 6 },
    ],
  };
  assert.equal(parallelAlphaBeta(t, 1, 1), 6);
});

test('parallel ab trace 非空', () => {
  assert.ok(buildTrace().length > 0);
});
`,
},

// ========================================================================
// 2. ais-window-search
// ========================================================================
{
  id: 'ais-window-search',
  titleZh: '窗口搜索', titleEn: 'Window Search',
  summaryZh: '窄窗口 alpha-beta：失败时回退到全窗口，命中时大幅剪枝。',
  summaryEn: 'Narrow-window alpha-beta: fall back to full window on failure; prune hard on hit.',
  descZh: '窗口搜索（Aspiration Search）以窄窗口 [guess−w, guess+w] 调用 alpha-beta；若 fail-high 或 fail-low 则用全窗口重搜。窗口命中时展开节点数显著减少。',
  descEn: 'Window (aspiration) search calls alpha-beta with a narrow window [guess−w, guess+w]; if it fails high or low, re-search with the full window. Hits prune many nodes.',
  tags: ['ai-search','alpha-beta','window','aspiration'],
  time: 'O(b^d)', space: 'O(d)',
  impl: `// 窗口搜索 · 实现
export interface WNode {
  id: string;
  utility?: number;
  children?: WNode[];
}
export interface WindowSearchHooks {
  onTry?: (alpha: number, beta: number) => void;
  onFail?: (bound: 'low' | 'high', value: number) => void;
  onHit?: (value: number) => void;
}
function alphaBeta(n: WNode, alpha: number, beta: number, depth: number): number {
  if (depth === 0 || !n.children || n.children.length === 0) return n.utility ?? 0;
  let best = -Infinity;
  for (const c of n.children) {
    const v = -alphaBeta(c, -beta, -alpha, depth - 1);
    if (v > best) best = v;
    if (best > alpha) alpha = best;
    if (alpha >= beta) break;
  }
  return best;
}
/**
 * 窗口搜索。
 * @param guess 预估值
 * @param window 半窗口宽度
 */
export function windowSearch(
  root: WNode, guess: number, window: number, depth: number,
  hooks: WindowSearchHooks = {},
): number {
  let alpha = guess - window;
  let beta = guess + window;
  hooks.onTry?.(alpha, beta);
  const val = alphaBeta(root, alpha, beta, depth);
  if (val <= alpha) {
    hooks.onFail?.('low', val);
    const full = alphaBeta(root, -Infinity, Infinity, depth);
    hooks.onHit?.(full);
    return full;
  }
  if (val >= beta) {
    hooks.onFail?.('high', val);
    const full = alphaBeta(root, -Infinity, Infinity, depth);
    hooks.onHit?.(full);
    return full;
  }
  hooks.onHit?.(val);
  return val;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { windowSearch, type WNode } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const tree: WNode = {
    id: 'r',
    children: [
      { id: 'a', children: [{ id: 'a1', utility: 2 }, { id: 'a2', utility: 8 }] },
      { id: 'b', children: [{ id: 'b1', utility: 4 }, { id: 'b2', utility: 6 }] },
    ],
  };
  const bars = (hi: string[] = []) =>
    [2, 8, 4, 6].map((v, i) => ({
      value: v,
      role: (hi.includes(['a1','a2','b1','b2'][i]!) ? 'swap' : 'default') as BarRole,
      label: ['a1','a2','b1','b2'][i],
    }));
  rec.begin({ zh: '初始', en: 'init' }).setBars(bars()).commit();
  windowSearch(tree, 5, 1, 2, {
    onTry: (a, b) => {
      rec.begin({ zh: \`试窗口 [\${a},\${b}]\`, en: \`try [\${a},\${b}]\` })
        .setBars(bars()).setAux([{ label: '窗', value: \`[\${a},\${b}]\`, role: 'compare' as BarRole }]).commit();
    },
    onFail: (bound, v) => {
      rec.begin({ zh: \`fail-\${bound} = \${v}，回退全窗口\`, en: \`fail-\${bound}=\${v}, re-search\` })
        .setBars(bars()).setAux([{ label: '失败', value: bound, role: 'warn' as BarRole }]).commit();
    },
    onHit: (v) => {
      rec.begin({ zh: \`命中：\${v}\`, en: \`hit: \${v}\` })
        .setBars(bars()).setAux([{ label: '值', value: String(v), role: 'final' as BarRole }]).commit();
    },
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { windowSearch, type WNode } from '../../src/algorithms/ai-search/ais-window-search/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-window-search/trace.ts';

test('window search 命中窗口', () => {
  const t: WNode = { id: 'r', children: [{ id: 'a', utility: 5 }] };
  assert.equal(windowSearch(t, 5, 3, 1), 5);
});
test('window search fail-high 回退正确', () => {
  const t: WNode = { id: 'r', children: [{ id: 'a', utility: 100 }] };
  assert.equal(windowSearch(t, 0, 5, 1), 100);
});
test('window search trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// ========================================================================
// 3. ais-soft-pruning
// ========================================================================
{
  id: 'ais-soft-pruning',
  titleZh: '软剪枝', titleEn: 'Soft Pruning',
  summaryZh: '软剪枝：容忍少量越界继续搜索，适合带噪声的评估函数。',
  summaryEn: 'Soft pruning: tolerate small out-of-window values, suited to noisy evaluation.',
  descZh: '软剪枝放宽 alpha-beta：当子节点值越界但不超出「软阈值」(alpha - slack, beta + slack) 时继续搜索，仅记录软上下界；超出硬阈值才剪枝。\n\n适合蒙特卡洛叶值等噪声评估。',
  descEn: 'Soft pruning relaxes alpha-beta: when a child value is out of window but within (alpha - slack, beta + slack), keep searching and only record a soft bound; cut only beyond the hard threshold.\n\nSuited to noisy (e.g., Monte-Carlo) leaf evaluation.',
  tags: ['ai-search','pruning','soft','game-tree'],
  time: 'O(b^d)', space: 'O(d)',
  impl: `// 软剪枝 · 实现
export interface SPNode { id: string; utility?: number; children?: SPNode[]; }
export interface SoftHooks {
  onSoftBound?: (bound: 'low' | 'high', value: number) => void;
  onHardCut?: (nodeId: string) => void;
  onResult?: (value: number) => void;
}
/** 软剪枝 alpha-beta：硬阈值外剪枝，软阈值内继续搜索但记录软界。 */
export function softAlphaBeta(
  n: SPNode, alpha: number, beta: number, slack: number, depth: number,
  hooks: SoftHooks = {},
): number {
  if (depth === 0 || !n.children || n.children.length === 0) return n.utility ?? 0;
  let best = -Infinity;
  const hardAlpha = alpha - slack;
  const hardBeta = beta + slack;
  for (const c of n.children) {
    const v = -softAlphaBeta(c, -beta, -alpha, slack, depth - 1, hooks);
    if (v > best) best = v;
    if (best > alpha) {
      alpha = best;
      if (best >= beta) {
        if (best < hardBeta) hooks.onSoftBound?.('high', best);
        else hooks.onHardCut?.(c.id);
        if (best >= hardBeta) break;
      }
    } else if (best <= alpha && best > hardAlpha) {
      hooks.onSoftBound?.('low', best);
    }
  }
  return best;
}
export function softSearch(root: SPNode, slack: number, depth: number, hooks: SoftHooks = {}): number {
  const v = softAlphaBeta(root, -Infinity, Infinity, slack, depth, hooks);
  hooks.onResult?.(v);
  return v;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { softSearch, type SPNode } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const tree: SPNode = {
    id: 'r',
    children: [
      { id: 'a', utility: 3 }, { id: 'b', utility: 7 },
      { id: 'c', utility: 5 }, { id: 'd', utility: 9 },
    ],
  };
  rec.begin({ zh: '软剪枝：slack=2', en: 'soft prune slack=2' })
    .setBars([3,7,5,9].map((v,i)=>({value:v,role:'default' as BarRole,label:'abcd'[i]})))
    .setAux([{ label: 'slack', value: '2', role: 'compare' as BarRole }])
    .commit();
  softSearch(tree, 2, 1, {
    onSoftBound: (b, v) => {
      rec.begin({ zh: \`软\${b}界=\${v}\`, en: \`soft \${b}=\${v}\` })
        .setAux([{ label: '软界', value: \`\${b}=\${v}\`, role: 'frontier' as BarRole }]).commit();
    },
    onHardCut: (id) => {
      rec.begin({ zh: \`硬剪枝 \${id}\`, en: \`hard cut \${id}\` })
        .setAux([{ label: '剪枝', value: id, role: 'warn' as BarRole }]).commit();
    },
    onResult: (v) => {
      rec.begin({ zh: \`完成=\${v}\`, en: \`done=\${v}\` })
        .setAux([{ label: '值', value: String(v), role: 'final' as BarRole }]).commit();
    },
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { softSearch, type SPNode } from '../../src/algorithms/ai-search/ais-soft-pruning/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-soft-pruning/trace.ts';

test('soft prune 取最大叶值', () => {
  const t: SPNode = { id: 'r', children: [
    { id: 'a', utility: 3 }, { id: 'b', utility: 9 }, { id: 'c', utility: 5 }] };
  assert.equal(softSearch(t, 2, 1), 9);
});
test('soft prune 单叶', () => {
  assert.equal(softSearch({ id: 'r', utility: 4 }, 2, 3), 4);
});
test('soft prune trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// ========================================================================
// 4. ais-mtd-bi
// ========================================================================
{
  id: 'ais-mtd-bi',
  titleZh: 'MTD(bi)', titleEn: 'MTD(bi)',
  summaryZh: 'MTD(bi)：交替使用上下界驱动零窗口测试。',
  summaryEn: 'MTD(bi): alternate upper/lower bounds to drive zero-window tests.',
  descZh: 'MTD(bi) 是 MTD(f) 的双向变体：每次根据上一次返回的界选择 beta = upper 或 lower + 1，进行零窗口测试，直至 lower == upper 收敛。',
  descEn: 'MTD(bi) is a bidirectional MTD(f) variant: each iteration picks beta = upper or lower + 1 based on the previous bound, doing zero-window tests until lower == upper.',
  tags: ['ai-search','mtd','zero-window','game-tree'],
  time: 'O(b^d)', space: 'O(b^d)',
  impl: `// MTD(bi) · 实现
export interface BiNode { id: string; utility?: number; children?: BiNode[]; }
export interface MtdBiHooks {
  onTest?: (beta: number, value: number, bound: 'lower' | 'upper') => void;
  onConverge?: (value: number, iterations: number) => void;
}
function alphaBeta(n: BiNode, alpha: number, beta: number, depth: number): number {
  if (depth === 0 || !n.children || n.children.length === 0) return n.utility ?? 0;
  let best = -Infinity;
  for (const c of n.children) {
    const v = -alphaBeta(c, -beta, -alpha, depth - 1);
    if (v > best) best = v;
    if (best > alpha) alpha = best;
    if (alpha >= beta) break;
  }
  return best;
}
export function mtdBi(root: BiNode, f: number, depth: number, maxIter = 64, hooks: MtdBiHooks = {}): number {
  let g = f;
  let upper = Infinity;
  let lower = -Infinity;
  let i = 0;
  do {
    i++;
    const beta = (g === lower) ? (lower + 1) : g;
    const t = alphaBeta(root, beta - 1, beta, depth);
    if (t < beta) { upper = t; hooks.onTest?.(beta, t, 'upper'); }
    else { lower = t; hooks.onTest?.(beta, t, 'lower'); }
    g = (upper === Infinity) ? lower : (lower === -Infinity ? upper : (upper + lower) / 2);
  } while (lower < upper && i < maxIter);
  hooks.onConverge?.(g, i);
  return g;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { mtdBi, type BiNode } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const tree: BiNode = {
    id: 'r',
    children: [
      { id: 'a', children: [{ id: 'a1', utility: 3 }, { id: 'a2', utility: 7 }] },
      { id: 'b', children: [{ id: 'b1', utility: 5 }, { id: 'b2', utility: 2 }] },
    ],
  };
  rec.begin({ zh: 'MTD(bi) 启动 f=0', en: 'MTD(bi) start f=0' })
    .setBars([3,7,5,2].map((v,i)=>({value:v,role:'default' as BarRole,label:['a1','a2','b1','b2'][i]})))
    .commit();
  mtdBi(tree, 0, 2, 64, {
    onTest: (beta, v, b) => {
      rec.begin({ zh: \`Test β=\${beta} → \${b}=\${v}\`, en: \`Test β=\${beta} → \${b}=\${v}\` })
        .setAux([{ label: b === 'lower' ? '下界' : '上界', value: String(v), role: (b === 'lower' ? 'final' : 'compare') as BarRole }]).commit();
    },
    onConverge: (v, it) => {
      rec.begin({ zh: \`收敛=\${v} (\${it}次)\`, en: \`converged=\${v} (\${it} iters)\` })
        .setAux([{ label: '值', value: String(v), role: 'final' as BarRole }]).commit();
    },
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mtdBi, type BiNode } from '../../src/algorithms/ai-search/ais-mtd-bi/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-mtd-bi/trace.ts';

test('mtd-bi 单叶返回 utility', () => {
  assert.equal(mtdBi({ id: 'r', utility: 5 }, 0, 3), 5);
});
test('mtd-bi 不同猜测收敛一致', () => {
  const t: BiNode = { id: 'r', children: [{ id: 'a', utility: 4 }, { id: 'b', utility: 6 }] };
  assert.equal(mtdBi(t, 0, 1), mtdBi(t, 10, 1));
});
test('mtd-bi trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// ========================================================================
// 5. ais-zero-window
// ========================================================================
{
  id: 'ais-zero-window',
  titleZh: '零窗口搜索', titleEn: 'Zero-Window Search',
  summaryZh: '零窗口 alpha-beta：α=β−1，必返回上界或下界。',
  summaryEn: 'Zero-window alpha-beta: α=β−1 always returns an upper or lower bound.',
  descZh: '零窗口搜索将 α、β 设为相邻整数（β = α + 1）。alpha-beta 必 fail-high（返回下界 ≥ β）或 fail-low（返回上界 ≤ α）。是 MTD(f)、Negascout 的核心构件。',
  descEn: 'Zero-window search sets α and β to adjacent integers (β = α + 1). alpha-beta must fail high (return lower bound ≥ β) or fail low (return upper bound ≤ α). It is the building block of MTD(f) and Negascout.',
  tags: ['ai-search','zero-window','alpha-beta','scout'],
  time: 'O(b^d)', space: 'O(d)',
  impl: `// 零窗口搜索 · 实现
export interface ZNode { id: string; utility?: number; children?: ZNode[]; }
export interface ZeroWindowHooks {
  onTest?: (beta: number, value: number) => void;
  onBound?: (bound: 'lower' | 'upper', value: number) => void;
}
function ab(n: ZNode, alpha: number, beta: number, depth: number): number {
  if (depth === 0 || !n.children || n.children.length === 0) return n.utility ?? 0;
  let best = -Infinity;
  for (const c of n.children) {
    const v = -ab(c, -beta, -alpha, depth - 1);
    if (v > best) best = v;
    if (best > alpha) alpha = best;
    if (alpha >= beta) break;
  }
  return best;
}
/** 零窗口测试：返回 >= beta 为下界，< beta 为上界。 */
export function zeroWindow(root: ZNode, beta: number, depth: number, hooks: ZeroWindowHooks = {}): { value: number; bound: 'lower' | 'upper' } {
  const t = ab(root, beta - 1, beta, depth);
  hooks.onTest?.(beta, t);
  if (t >= beta) { hooks.onBound?.('lower', t); return { value: t, bound: 'lower' }; }
  hooks.onBound?.('upper', t);
  return { value: t, bound: 'upper' };
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { zeroWindow, type ZNode } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const tree: ZNode = {
    id: 'r',
    children: [{ id: 'a', utility: 3 }, { id: 'b', utility: 7 }, { id: 'c', utility: 5 }],
  };
  rec.begin({ zh: '零窗口 β=5', en: 'zero-window β=5' })
    .setBars([3,7,5].map((v,i)=>({value:v,role:'default' as BarRole,label:'abc'[i]}))).commit();
  for (const beta of [5, 8, 4]) {
    zeroWindow(tree, beta, 1, {
      onTest: (b, v) => rec.begin({ zh: \`Test β=\${b} → \${v}\`, en: \`Test β=\${b} → \${v}\` })
        .setAux([{ label: 'β', value: String(b), role: 'compare' as BarRole }]).commit(),
      onBound: (bd, v) => rec.begin({ zh: \`\${bd}=\${v}\`, en: \`\${bd}=\${v}\` })
        .setAux([{ label: bd, value: String(v), role: (bd === 'lower' ? 'final' : 'swap') as BarRole }]).commit(),
    });
  }
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { zeroWindow, type ZNode } from '../../src/algorithms/ai-search/ais-zero-window/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-zero-window/trace.ts';

test('zero-window fail-low 时返回 upper', () => {
  const r = zeroWindow({ id: 'r', utility: 3 }, 10, 1);
  assert.equal(r.bound, 'upper');
  assert.ok(r.value < 10);
});
test('zero-window fail-high 时返回 lower', () => {
  const r = zeroWindow({ id: 'r', utility: 50 }, 5, 1);
  assert.equal(r.bound, 'lower');
  assert.ok(r.value >= 5);
});
test('zero-window trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// ========================================================================
// 6. ais-constraint-prop
// ========================================================================
{
  id: 'ais-constraint-prop',
  titleZh: '约束传播搜索', titleEn: 'Constraint Propagation Search',
  summaryZh: '回溯 + AC-3 弧一致性传播：每步赋值后剪除不可能取值。',
  summaryEn: 'Backtracking + AC-3 arc consistency: prune impossible values after each assignment.',
  descZh: '将回溯搜索与 AC-3 弧一致性传播结合：每次给变量赋值后，对约束图运行 AC-3，删除不可能取值。域被清空的变量触发回溯。广泛用于 CSP（图着色、数独等）。',
  descEn: 'Interleave backtracking with AC-3 arc consistency: after assigning a variable, run AC-3 on the constraint graph to remove impossible values. An emptied domain triggers backtracking. Widely used for CSPs (graph coloring, Sudoku).',
  tags: ['ai-search','csp','constraint','ac-3','backtracking'],
  time: 'O(ed³ max d)', space: 'O(e + nd)',
  impl: `// 约束传播搜索（AC-3 + 回溯）· 实现
export type Domain = number[];
export interface CspProblem {
  variables: string[];
  domains: Record<string, Domain>;
  /** 约束：两变量取某值是否冲突。无冲突返回 true。 */
  consistent: (a: string, va: number, b: string, vb: number) => boolean;
  neighbors: Record<string, string[]>;
}
export interface CspHooks {
  onAssign?: (varName: string, value: number) => void;
  onPropagate?: (varName: string, removed: number) => void;
  onBacktrack?: (varName: string) => void;
  onSolution?: (assignment: Record<string, number>) => void;
}
function revise(p: CspProblem, xi: string, xj: string, domains: Record<string, Domain>): number {
  let removed = 0;
  const di = domains[xi]!;
  const dj = domains[xj]!;
  const keep: number[] = [];
  for (const v of di) {
    if (dj.some((w) => p.consistent(xi, v, xj, w))) keep.push(v);
    else removed++;
  }
  domains[xi] = keep;
  return removed;
}
/** AC-3 在 domains 上做弧一致性（不修改原 domains）。 */
export function ac3(p: CspProblem, domains: Record<string, Domain>, hooks?: CspHooks): boolean {
  const d: Record<string, Domain> = {};
  for (const v of p.variables) d[v] = [...domains[v]!];
  const queue: Array<[string, string]> = [];
  for (const xi of p.variables) for (const xj of p.neighbors[xi]!) queue.push([xi, xj]);
  while (queue.length) {
    const [xi, xj] = queue.shift()!;
    const r = revise(p, xi, xj, d);
    if (r > 0) hooks?.onPropagate?.(xi, r);
    if (d[xi]!.length === 0) return false;
    if (r > 0) {
      for (const xk of p.neighbors[xi]!) if (xk !== xj) queue.push([xk, xi]);
    }
  }
  for (const v of p.variables) domains[v] = [...d[v]!];
  return true;
}
export function solveCsp(p: CspProblem, hooks: CspHooks = {}): Record<string, number> | null {
  const assignment: Record<string, number> = {};
  const domains: Record<string, Domain> = {};
  for (const v of p.variables) domains[v] = [...p.domains[v]!];
  const vars = [...p.variables];
  const backtrack = (idx: number): boolean => {
    if (idx >= vars.length) { hooks.onSolution?.({ ...assignment }); return true; }
    const v = vars[idx]!;
    for (const value of domains[v]!) {
      assignment[v] = value;
      hooks.onAssign?.(v, value);
      const saved: Record<string, Domain> = {};
      for (const u of p.variables) saved[u] = [...domains[u]!];
      if (ac3(p, domains)) {
        if (backtrack(idx + 1)) return true;
      }
      for (const u of p.variables) domains[u] = saved[u]!;
      delete assignment[v];
      hooks.onBacktrack?.(v);
    }
    return false;
  };
  ac3(p, domains, hooks);
  return backtrack(0) ? assignment : null;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { solveCsp, type CspProblem } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  // 4-皇后
  const N = 4;
  const vars = ['q0','q1','q2','q3'];
  const domains: Record<string, number[]> = {};
  for (const v of vars) domains[v] = [0,1,2,3];
  const p: CspProblem = {
    variables: vars,
    domains,
    neighbors: { q0: ['q1','q2','q3'], q1: ['q0','q2','q3'], q2: ['q0','q1','q3'], q3: ['q0','q1','q2'] },
    consistent: (a, va, b, vb) => {
      if (va === vb) return false;
      const ia = Number(a.slice(1)); const ib = Number(b.slice(1));
      if (Math.abs(va - vb) === Math.abs(ia - ib)) return false;
      return true;
    },
  };
  rec.begin({ zh: '4-皇后 CSP', en: '4-queens CSP' })
    .setAux([{ label: '变量', value: 'q0..q3', role: 'compare' as BarRole }])
    .setGrid([[{v:'q',role:'default'},{v:'.',role:'default'},{v:'.',role:'default'},{v:'.',role:'default'}],
              [{v:'.',role:'default'},{v:'.',role:'default'},{v:'.',role:'default'},{v:'.',role:'default'}],
              [{v:'.',role:'default'},{v:'.',role:'default'},{v:'.',role:'default'},{v:'.',role:'default'}],
              [{v:'.',role:'default'},{v:'.',role:'default'},{v:'.',role:'default'},{v:'.',role:'default'}]])
    .commit();
  const grid = (a: Record<string, number>) =>
    Array.from({ length: N }, (_, r) =>
      Array.from({ length: N }, (_, c) => {
        const v = 'q' + c;
        if (a[v] !== undefined && a[v] === r) return { v: 'Q', role: 'final' as BarRole };
        return { v: '.', role: 'default' as BarRole };
      }));
  solveCsp(p, {
    onAssign: (v, val) => rec.begin({ zh: \`赋值 \${v}=\${val}\`, en: \`assign \${v}=\${val}\` })
      .setAux([{ label: v, value: String(val), role: 'swap' as BarRole }]).commit(),
    onBacktrack: (v) => rec.begin({ zh: \`回溯 \${v}\`, en: \`backtrack \${v}\` })
      .setAux([{ label: '回溯', value: v, role: 'warn' as BarRole }]).commit(),
    onSolution: (a) => rec.begin({ zh: '找到解', en: 'solution' }).setGrid(grid(a)).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { solveCsp, ac3, type CspProblem } from '../../src/algorithms/ai-search/ais-constraint-prop/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-constraint-prop/trace.ts';

function fourQueens(): CspProblem {
  const vars = ['q0','q1','q2','q3'];
  const domains: Record<string, number[]> = {};
  for (const v of vars) domains[v] = [0,1,2,3];
  return {
    variables: vars, domains,
    neighbors: { q0:['q1','q2','q3'], q1:['q0','q2','q3'], q2:['q0','q1','q3'], q3:['q0','q1','q2'] },
    consistent: (a, va, b, vb) => {
      if (va === vb) return false;
      const ia = Number(a.slice(1)); const ib = Number(b.slice(1));
      return Math.abs(va - vb) !== Math.abs(ia - ib);
    },
  };
}
test('csp 4-皇后有解', () => {
  const sol = solveCsp(fourQueens());
  assert.ok(sol);
  // 验证不冲突
  const vs = Object.entries(sol!);
  for (let i = 0; i < vs.length; i++) for (let j = i+1; j < vs.length; j++) {
    const [an, av] = vs[i]!; const [bn, bv] = vs[j]!;
    assert.notEqual(av, bv);
    assert.notEqual(Math.abs(av as number - bv as number), Math.abs(Number(an.slice(1)) - Number(bn.slice(1))));
  }
});
test('ac3 不破坏可满足性', () => {
  const p = fourQueens();
  const d: Record<string, number[]> = {};
  for (const v of p.variables) d[v] = [...p.domains[v]!];
  assert.equal(ac3(p, d), true);
});
test('csp trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// ========================================================================
// 7. ais-hill-climbing-search
// ========================================================================
{
  id: 'ais-hill-climbing-search',
  titleZh: '爬山搜索', titleEn: 'Hill Climbing Search',
  summaryZh: '贪心移向更优邻居，可能陷入局部最优。',
  summaryEn: 'Greedily move to a better neighbor; may get stuck in local optima.',
  descZh: '爬山搜索是最简单的局部搜索：从当前点出发，评估邻居，移到值最优的邻居（若优于当前），否则停止。本实现在 1D 多峰地形上演示。',
  descEn: 'Hill climbing is the simplest local search: from the current point, evaluate neighbors and move to the best-valued neighbor if better than current; otherwise stop.',
  tags: ['ai-search','local-search','optimization','hill-climbing'],
  time: 'O(iter × k)', space: 'O(1)',
  impl: `// 爬山搜索 · 实现（1D 离散）
export interface HillHooks {
  onStep?: (pos: number, val: number, improved: boolean) => void;
  onStuck?: (pos: number) => void;
}
/** 1D 适应度地形：f(x) = 多峰函数。 */
export function landscape(x: number): number {
  return 10 * Math.sin(x / 2) + 0.5 * x - 0.02 * x * x;
}
/** 在 x 处生成邻居（±step）。 */
export function neighbors(x: number, step: number, min: number, max: number): number[] {
  const out: number[] = [];
  if (x - step >= min) out.push(x - step);
  if (x + step <= max) out.push(x + step);
  return out;
}
/** 爬山：返回最终位置。 */
export function hillClimb(
  start: number, step: number, min: number, max: number, maxIter: number,
  hooks: HillHooks = {},
): { pos: number; val: number; iters: number } {
  let x = start;
  let v = landscape(x);
  for (let i = 0; i < maxIter; i++) {
    let bestN = x;
    let bestV = v;
    for (const n of neighbors(x, step, min, max)) {
      const nv = landscape(n);
      if (nv > bestV) { bestV = nv; bestN = n; }
    }
    if (bestN === x) { hooks.onStuck?.(x); hooks.onStep?.(x, v, false); return { pos: x, val: v, iters: i }; }
    x = bestN; v = bestV;
    hooks.onStep?.(x, v, true);
  }
  return { pos: x, val: v, iters: maxIter };
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { hillClimb, landscape } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const samples = Array.from({ length: 21 }, (_, i) => landscape(i));
  rec.begin({ zh: '地形', en: 'landscape' })
    .setBars(samples.map((v) => ({ value: Math.round(v * 10) / 10, role: 'default' as BarRole })))
    .commit();
  hillClimb(2, 1, 0, 20, 50, {
    onStep: (pos, val) => {
      const bars = samples.map((v, i) => ({ value: Math.round(v * 10) / 10, role: (i === pos ? 'final' : 'default') as BarRole, label: String(i) }));
      rec.begin({ zh: \`到达 x=\${pos} f=\${val.toFixed(2)}\`, en: \`at x=\${pos} f=\${val.toFixed(2)}\` })
        .setBars(bars).setAux([{ label: 'x', value: String(pos), role: 'swap' as BarRole }]).commit();
    },
    onStuck: (pos) => rec.begin({ zh: \`局部最优 x=\${pos}\`, en: \`local opt x=\${pos}\` })
      .setAux([{ label: 'STUCK', value: String(pos), role: 'warn' as BarRole }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hillClimb, landscape } from '../../src/algorithms/ai-search/ais-hill-climbing-search/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-hill-climbing-search/trace.ts';

test('hill climb 在峰处停止', () => {
  const r = hillClimb(10, 1, 0, 20, 100);
  assert.ok(r.iters < 100);
});
test('hill climb 起点是峰直接 stuck', () => {
  // 在 x=10 附近找峰
  const r = hillClimb(10, 1, 0, 20, 1);
  assert.ok(Number.isFinite(r.val));
});
test('landscape 有限', () => {
  for (let i = 0; i < 30; i++) assert.ok(Number.isFinite(landscape(i)));
});
test('hill climb trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// ========================================================================
// 8. ais-simulated-anneal-search
// ========================================================================
{
  id: 'ais-simulated-anneal-search',
  titleZh: '模拟退火搜索', titleEn: 'Simulated Annealing Search',
  summaryZh: '以概率 exp(Δ/T) 接受劣解，温度按计划衰减。',
  summaryEn: 'Accept worse moves with probability exp(Δ/T); temperature cools on a schedule.',
  descZh: '模拟退火（Kirkpatrick 1983）：以温度 T 控制接受劣解的概率 p = exp(ΔE/T)。T 从 T0 按指数衰减到 T_end。能跳出局部最优。',
  descEn: 'Simulated annealing (Kirkpatrick 1983): probability p = exp(ΔE/T) of accepting worse moves; T decays exponentially from T0 to T_end. Escapes local optima.',
  tags: ['ai-search','metaheuristic','optimization','annealing'],
  time: 'O(iter)', space: 'O(1)',
  impl: `// 模拟退火 · 实现（1D 离散）
export interface AnnealHooks {
  onIter?: (x: number, val: number, T: number, accepted: boolean) => void;
  onImprove?: (x: number, val: number) => void;
  onDone?: (x: number, val: number) => void;
}
/** 目标地形（多峰）：最大化。 */
export function energy(x: number): number {
  return -(x - 7) * (x - 7) + 10 * Math.sin(x); // x=7 附近是主峰
}
/** 线性同余确定性随机（便于复现）。 */
function makeRng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}
export function simulatedAnneal(
  start: number, min: number, max: number,
  T0: number, Tend: number, iters: number, seed = 42,
  hooks: AnnealHooks = {},
): { x: number; val: number } {
  const rng = makeRng(seed);
  let x = start;
  let v = energy(x);
  let bestX = x;
  let bestV = v;
  for (let i = 0; i < iters; i++) {
    const T = T0 * Math.pow(Tend / T0, i / iters);
    const cand = Math.max(min, Math.min(max, x + (rng() < 0.5 ? -1 : 1)));
    const cv = energy(cand);
    const dE = cv - v;
    const accepted = dE > 0 || rng() < Math.exp(dE / Math.max(1e-9, T));
    hooks.onIter?.(cand, cv, T, accepted);
    if (accepted) { x = cand; v = cv; }
    if (v > bestV) { bestV = v; bestX = x; hooks.onImprove?.(bestX, bestV); }
  }
  hooks.onDone?.(bestX, bestV);
  return { x: bestX, val: bestV };
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { simulatedAnneal, energy } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const samples = Array.from({ length: 15 }, (_, i) => energy(i));
  rec.begin({ zh: '能量地形', en: 'energy landscape' })
    .setBars(samples.map((v) => ({ value: Math.round(v * 10) / 10, role: 'default' as BarRole }))).commit();
  simulatedAnneal(2, 0, 14, 10, 0.1, 40, 7, {
    onImprove: (x, v) => {
      const bars = samples.map((s, i) => ({ value: Math.round(s * 10) / 10, role: (i === x ? 'final' : 'default') as BarRole, label: String(i) }));
      rec.begin({ zh: \`改进 x=\${x} v=\${v.toFixed(2)}\`, en: \`improve x=\${x} v=\${v.toFixed(2)}\` })
        .setBars(bars).setAux([{ label: 'best', value: String(x), role: 'swap' as BarRole }]).commit();
    },
    onDone: (x, v) => rec.begin({ zh: \`完成 x=\${x}\`, en: \`done x=\${x}\` })
      .setAux([{ label: 'final', value: String(x), role: 'final' as BarRole }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { simulatedAnneal, energy } from '../../src/algorithms/ai-search/ais-simulated-anneal-search/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-simulated-anneal-search/trace.ts';

test('SA 找到接近最优', () => {
  const r = simulatedAnneal(2, 0, 14, 10, 0.01, 200, 1);
  // 主峰在 x=7 附近
  assert.ok(r.x >= 5 && r.x <= 9, 'x=' + r.x);
});
test('SA 同种子可复现', () => {
  const a = simulatedAnneal(2, 0, 14, 5, 0.1, 30, 99);
  const b = simulatedAnneal(2, 0, 14, 5, 0.1, 30, 99);
  assert.deepEqual(a, b);
});
test('SA trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// ========================================================================
// 9. ais-genetic-search
// ========================================================================
{
  id: 'ais-genetic-search',
  titleZh: '遗传算法搜索', titleEn: 'Genetic Algorithm Search',
  summaryZh: '选择+交叉+变异，逐代演化近似最优解（OneMax 目标）。',
  summaryEn: 'Selection + crossover + mutation evolving near-optimal solutions (OneMax target).',
  descZh: '遗传算法（Holland 1975）维护二进制种群，按适应度（OneMax：1 越多越好）选择父代，单点交叉产生后代，按概率 pm 翻转变异。逐代逼近全 1 串。',
  descEn: 'The genetic algorithm (Holland 1975) maintains a binary population; parents are chosen by fitness (OneMax: more 1s is better); single-point crossover produces offspring; bits flip with probability pm. Approaches the all-ones string.',
  tags: ['ai-search','evolutionary','optimization','genetic'],
  time: 'O(g × p × n)', space: 'O(p × n)',
  impl: `// 遗传算法 · 实现
export interface GaHooks {
  onGeneration?: (gen: number, bestFit: number, avgFit: number) => void;
  onCrossover?: (p1: number[], p2: number[], child: number[]) => void;
  onMutate?: (ind: number[], idx: number) => void;
  onDone?: (best: number[], fit: number) => void;
}
function makeRng(seed: number): () => number {
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}
export function fitness(ind: number[]): number {
  return ind.reduce((a, b) => a + b, 0);
}
export function geneticAlgorithm(
  n: number, popSize: number, generations: number, pm: number, seed = 7,
  hooks: GaHooks = {},
): { best: number[]; fit: number } {
  const rng = makeRng(seed);
  let pop: number[][] = Array.from({ length: popSize }, () =>
    Array.from({ length: n }, () => (rng() < 0.5 ? 0 : 1)));
  const sorted = () => [...pop].sort((a, b) => fitness(b) - fitness(a));
  let best = sorted()[0]!;
  for (let g = 0; g < generations; g++) {
    const ranked = sorted();
    const total = ranked.reduce((s, ind) => s + fitness(ind), 0);
    const avg = total / ranked.length;
    hooks.onGeneration?.(g, fitness(ranked[0]!), avg);
    if (fitness(ranked[0]!) > fitness(best)) best = ranked[0]!;
    // 选择（前一半作为父代池）
    const pool = ranked.slice(0, Math.max(2, Math.floor(popSize / 2)));
    const next: number[][] = [];
    while (next.length < popSize) {
      const p1 = pool[Math.floor(rng() * pool.length)]!;
      const p2 = pool[Math.floor(rng() * pool.length)]!;
      const cut = 1 + Math.floor(rng() * (n - 1));
      const child = [...p1.slice(0, cut), ...p2.slice(cut)];
      hooks.onCrossover?.(p1, p2, child);
      for (let i = 0; i < n; i++) {
        if (rng() < pm) { child[i] = child[i]! ? 0 : 1; hooks.onMutate?.(child, i); }
      }
      next.push(child);
    }
    pop = next;
  }
  const final = sorted()[0]!;
  if (fitness(final) > fitness(best)) best = final;
  hooks.onDone?.(best, fitness(best));
  return { best, fit: fitness(best) };
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { geneticAlgorithm, fitness } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'GA OneMax n=8', en: 'GA OneMax n=8' })
    .setBars(Array.from({length:8},()=>({value:0,role:'default' as BarRole}))).commit();
  geneticAlgorithm(8, 12, 20, 0.05, 7, {
    onGeneration: (g, best, avg) => {
      rec.begin({ zh: \`第 \${g} 代 best=\${best} avg=\${avg.toFixed(1)}\`, en: \`gen \${g} best=\${best} avg=\${avg.toFixed(1)}\` })
        .setBars(Array.from({length:8},(_,i)=>({value: i < best ? 1 : 0, role: (i < best ? 'final' : 'default') as BarRole, label: String(i)})))
        .setAux([{ label: 'best', value: String(best), role: 'swap' as BarRole }])
        .commit();
    },
    onDone: (best, fit) => rec.begin({ zh: \`完成 fit=\${fit}\`, en: \`done fit=\${fit}\` })
      .setBars(best.map((b)=>({value:b,role:'final' as BarRole}))).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { geneticAlgorithm, fitness } from '../../src/algorithms/ai-search/ais-genetic-search/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-genetic-search/trace.ts';

test('GA 在 OneMax 上趋近最优', () => {
  const r = geneticAlgorithm(6, 20, 30, 0.1, 3);
  assert.ok(r.fit >= 4);
});
test('GA 同种子可复现', () => {
  const a = geneticAlgorithm(6, 10, 10, 0.1, 5);
  const b = geneticAlgorithm(6, 10, 10, 0.1, 5);
  assert.deepEqual(a.best, b.best);
});
test('fitness 全 1 = n', () => {
  assert.equal(fitness([1,1,1,1,1]), 5);
});
test('GA trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// ========================================================================
// 10. ais-particle-swarm-search
// ========================================================================
{
  id: 'ais-particle-swarm-search',
  titleZh: '粒子群优化', titleEn: 'Particle Swarm Optimization',
  summaryZh: '粒子按个体最优与全局最优更新速度位置（Sphere 目标）。',
  summaryEn: 'Particles update velocity and position via personal and global bests (Sphere target).',
  descZh: 'PSO（Kennedy & Eberhart 1995）：v = w·v + c1·r1·(pbest−x) + c2·r2·(gbest−x)，x += v。本实现最小化 Sphere（凸，最优点在原点）。',
  descEn: 'PSO (Kennedy & Eberhart 1995): v = w·v + c1·r1·(pbest−x) + c2·r2·(gbest−x); x += v. Minimizes the Sphere function (convex, optimum at origin).',
  tags: ['ai-search','swarm','optimization','pso'],
  time: 'O(iter × p × d)', space: 'O(p × d)',
  impl: `// 粒子群优化 · 实现
export interface PsoHooks {
  onIter?: (iter: number, gbest: number[], gfit: number) => void;
  onImprove?: (gbest: number[], gfit: number) => void;
  onDone?: (gbest: number[], gfit: number) => void;
}
export function sphere(x: number[]): number {
  return x.reduce((s, v) => s + v * v, 0);
}
function makeRng(seed: number): () => number {
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}
export function pso(
  dim: number, pop: number, iters: number,
  w: number, c1: number, c2: number, seed = 11,
  hooks: PsoHooks = {},
): { gbest: number[]; gfit: number } {
  const rng = makeRng(seed);
  const X: number[][] = Array.from({ length: pop }, () =>
    Array.from({ length: dim }, () => (rng() - 0.5) * 10));
  const V: number[][] = X.map((p) => p.map(() => (rng() - 0.5) * 2));
  const P = X.map((p) => [...p]);
  const Pf = P.map((p) => sphere(p));
  let gi = Pf.indexOf(Math.min(...Pf));
  let gbest = [...P[gi]!];
  let gfit = Pf[gi]!;
  for (let it = 0; it < iters; it++) {
    for (let i = 0; i < pop; i++) {
      for (let d = 0; d < dim; d++) {
        const r1 = rng();
        const r2 = rng();
        V[i]![d] = w * V[i]![d]! + c1 * r1 * (P[i]![d]! - X[i]![d]!) + c2 * r2 * (gbest[d]! - X[i]![d]!);
        X[i]![d] = X[i]![d]! + V[i]![d]!;
      }
      const f = sphere(X[i]!);
      if (f < Pf[i]!) { Pf[i] = f; P[i] = [...X[i]!]; }
      if (f < gfit) { gfit = f; gbest = [...X[i]!]; hooks.onImprove?.(gbest, gfit); }
    }
    hooks.onIter?.(it, gbest, gfit);
  }
  hooks.onDone?.(gbest, gfit);
  return { gbest, gfit };
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { pso, sphere } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'PSO sphere 2D', en: 'PSO sphere 2D' })
    .setBars(Array.from({length:10},(_,i)=>({value: 5-i*0.4, role:'default' as BarRole, label:'p'+i}))).commit();
  let lastIter = -1;
  pso(2, 10, 30, 0.7, 1.5, 1.5, 11, {
    onIter: (it, _gb, gf) => { lastIter = it;
      rec.begin({ zh: \`iter \${it} gfit=\${gf.toFixed(3)}\`, en: \`iter \${it} gfit=\${gf.toFixed(3)}\` })
        .setBars(Array.from({length:10},()=>({value: Math.round(gf*100)/100, role:'swap' as BarRole})))
        .setAux([{ label: 'gfit', value: gf.toFixed(3), role: 'final' as BarRole }]).commit();
    },
    onDone: (gb, gf) => rec.begin({ zh: \`完成 gfit=\${gf.toFixed(3)}\`, en: \`done gfit=\${gf.toFixed(3)}\` })
      .setAux([{ label: 'best', value: JSON.stringify(gb.map((v)=>Math.round(v*100)/100)), role: 'final' as BarRole }]).commit(),
  });
  void lastIter;
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pso, sphere } from '../../src/algorithms/ai-search/ais-particle-swarm-search/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-particle-swarm-search/trace.ts';

test('PSO 在 sphere 上收敛', () => {
  const r = pso(2, 20, 50, 0.7, 1.5, 1.5, 11);
  assert.ok(r.gfit < 1, 'gfit=' + r.gfit);
});
test('sphere(0)=0', () => assert.equal(sphere([0,0,0]), 0));
test('PSO 同种子可复现', () => {
  const a = pso(2, 10, 20, 0.7, 1.5, 1.5, 5);
  const b = pso(2, 10, 20, 0.7, 1.5, 1.5, 5);
  assert.deepEqual(a.gbest, b.gbest);
});
test('PSO trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// ========================================================================
// 11. ais-ant-colony-search
// ========================================================================
{
  id: 'ais-ant-colony-search',
  titleZh: '蚁群算法', titleEn: 'Ant Colony Optimization',
  summaryZh: '蚂蚁依信息素与启发式选边，迭代更新信息素（小 TSP）。',
  summaryEn: 'Ants pick edges by pheromone + heuristic; pheromones update iteratively (small TSP).',
  descZh: '蚁群算法（Dorigo 1992）：蚂蚁按 τ^α · η^β 概率选边构造路径；每轮结束后按 1/L 沉积、按 ρ 挥发信息素。本实现在 4 城 TSP 上演示。',
  descEn: 'ACO (Dorigo 1992): ants choose edges with probability proportional to τ^α · η^β; after each tour pheromones evaporate by ρ and deposit by 1/L. Demo on 4-city TSP.',
  tags: ['ai-search','swarm','optimization','aco','tsp'],
  time: 'O(iter × ants × n²)', space: 'O(n²)',
  impl: `// 蚁群算法 · 实现（小 TSP）
export interface AcoHooks {
  onIter?: (iter: number, bestLen: number, bestTour: number[]) => void;
  onImprove?: (bestLen: number, bestTour: number[]) => void;
  onDone?: (bestLen: number, bestTour: number[]) => void;
}
function makeRng(seed: number): () => number {
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}
/** 距离矩阵 D[i][j]。 */
export function aco(
  D: number[][], ants: number, iters: number,
  alpha: number, beta: number, rho: number, seed = 13,
  hooks: AcoHooks = {},
): { bestLen: number; bestTour: number[] } {
  const n = D.length;
  const rng = makeRng(seed);
  let tau: number[][] = Array.from({ length: n }, () => Array.from({ length: n }, () => 1));
  let bestLen = Infinity;
  let bestTour: number[] = [];
  for (let it = 0; it < iters; it++) {
    let iterBestLen = Infinity;
    let iterBestTour: number[] = [];
    for (let a = 0; a < ants; a++) {
      const start = Math.floor(rng() * n);
      const tour = [start];
      const visited = new Set([start]);
      let cur = start;
      while (tour.length < n) {
        const probs: number[] = [];
        let sum = 0;
        for (let j = 0; j < n; j++) {
          if (visited.has(j) || D[cur]![j]! <= 0) { probs.push(0); continue; }
          const p = Math.pow(tau[cur]![j]!, alpha) * Math.pow(1 / D[cur]![j]!, beta);
          probs.push(p); sum += p;
        }
        let r = rng() * sum;
        let next = -1;
        for (let j = 0; j < n; j++) {
          r -= probs[j]!;
          if (r <= 0 && probs[j]! > 0) { next = j; break; }
        }
        if (next < 0) for (let j = 0; j < n; j++) if (!visited.has(j)) { next = j; break; }
        tour.push(next!); visited.add(next!); cur = next!;
      }
      let len = 0;
      for (let i = 0; i < n; i++) len += D[tour[i]!]![tour[(i + 1) % n]!]!;
      if (len < iterBestLen) { iterBestLen = len; iterBestTour = [...tour]; }
      if (len < bestLen) { bestLen = len; bestTour = [...tour]; hooks.onImprove?.(bestLen, bestTour); }
    }
    // 信息素挥发 + 沉积（仅最佳蚂蚁）
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) tau[i]![j]! *= (1 - rho);
    const L = iterBestLen;
    for (let i = 0; i < n; i++) {
      const a = iterBestTour[i]!;
      const b = iterBestTour[(i + 1) % n]!;
      tau[a]![b]! += 1 / L;
      tau[b]![a]! += 1 / L;
    }
    hooks.onIter?.(it, bestLen, bestTour);
  }
  hooks.onDone?.(bestLen, bestTour);
  return { bestLen, bestTour };
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { aco } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const D = [
    [0, 2, 5, 8],
    [2, 0, 4, 3],
    [5, 4, 0, 6],
    [8, 3, 6, 0],
  ];
  rec.begin({ zh: '4 城 TSP', en: '4-city TSP' })
    .setAux([{ label: '城市', value: '4', role: 'compare' as BarRole }]).commit();
  aco(D, 5, 25, 1, 3, 0.3, 13, {
    onImprove: (L, tour) => rec.begin({ zh: \`改进 L=\${L.toFixed(2)}\`, en: \`improve L=\${L.toFixed(2)}\` })
      .setAux([{ label: 'tour', value: tour.join('→'), role: 'swap' as BarRole }, { label: 'L', value: L.toFixed(2), role: 'final' as BarRole }]).commit(),
    onDone: (L, tour) => rec.begin({ zh: \`完成 L=\${L.toFixed(2)}\`, en: \`done L=\${L.toFixed(2)}\` })
      .setAux([{ label: 'best', value: tour.join('→'), role: 'final' as BarRole }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { aco } from '../../src/algorithms/ai-search/ais-ant-colony-search/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-ant-colony-search/trace.ts';

test('ACO 找到合理 tour', () => {
  const D = [[0,2,5,8],[2,0,4,3],[5,4,0,6],[8,3,6,0]];
  const r = aco(D, 5, 30, 1, 3, 0.3, 13);
  // 朴素下界：最小生成树*2
  assert.ok(r.bestLen > 0 && r.bestLen < 30);
  assert.equal(r.bestTour.length, 4);
});
test('ACO 同种子可复现', () => {
  const D = [[0,1,2],[1,0,3],[2,3,0]];
  const a = aco(D, 4, 10, 1, 2, 0.3, 5);
  const b = aco(D, 4, 10, 1, 2, 0.3, 5);
  assert.equal(a.bestLen, b.bestLen);
});
test('ACO trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// ========================================================================
// 12. ais-bee-colony
// ========================================================================
{
  id: 'ais-bee-colony',
  titleZh: '人工蜂群', titleEn: 'Artificial Bee Colony',
  summaryZh: '采蜜蜂、观察蜂、侦查蜂协同搜索解空间（Sphere 目标）。',
  summaryEn: 'Employed, onlooker, and scout bees collaboratively search (Sphere target).',
  descZh: '人工蜂群（Karaboga 2005）：采蜜蜂利用食物源并产生邻域候选；观察蜂按质量轮盘赌选择源；连续 limit 轮无改进则变侦查蜂随机重生。本实现最小化 Sphere。',
  descEn: 'ABC (Karaboga 2005): employed bees exploit food sources and generate neighbor candidates; onlooker bees pick sources by roulette; after "limit" non-improving rounds a source is abandoned and a scout randomly resets it.',
  tags: ['ai-search','swarm','optimization','abc'],
  time: 'O(iter × bees × d)', space: 'O(bees × d)',
  impl: `// 人工蜂群 · 实现
export interface AbcHooks {
  onIter?: (iter: number, bestFit: number) => void;
  onImprove?: (bestFit: number, best: number[]) => void;
  onScout?: (idx: number) => void;
  onDone?: (bestFit: number, best: number[]) => void;
}
export function sphere(x: number[]): number { return x.reduce((s, v) => s + v * v, 0); }
function makeRng(seed: number): () => number {
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}
export function abc(
  dim: number, half: number, iters: number, limit: number, seed = 17,
  hooks: AbcHooks = {},
): { best: number[]; fit: number } {
  const rng = makeRng(seed);
  const N = half * 2;
  const X: number[][] = Array.from({ length: half }, () =>
    Array.from({ length: dim }, () => (rng() - 0.5) * 10));
  const F: number[] = X.map((x) => sphere(x));
  const trials: number[] = Array.from({ length: half }, () => 0);
  let bi = F.indexOf(Math.min(...F));
  let best = [...X[bi]!]; let bestF = F[bi]!;
  for (let it = 0; it < iters; it++) {
    // 采蜜蜂阶段
    for (let i = 0; i < half; i++) {
      const k = (i + 1 + Math.floor(rng() * (half - 1))) % half;
      const d = Math.floor(rng() * dim);
      const cand = [...X[i]!];
      cand[d] = cand[d]! + (X[i]![d]! - X[k]![d]!) * (rng() * 2 - 1);
      const cf = sphere(cand);
      if (cf < F[i]!) { X[i] = cand; F[i] = cf; trials[i] = 0; } else trials[i]!++;
    }
    // 观察蜂阶段：轮盘赌
    const max = Math.max(...F);
    const probs = F.map((f) => 1 / (1 + f)); // 越小越优
    const sum = probs.reduce((a, b) => a + b, 0);
    for (let s = 0; s < half; s++) {
      let r = rng() * sum; let pick = 0;
      for (let i = 0; i < half; i++) { r -= probs[i]!; if (r <= 0) { pick = i; break; } }
      const k = (pick + 1 + Math.floor(rng() * (half - 1))) % half;
      const d = Math.floor(rng() * dim);
      const cand = [...X[pick]!];
      cand[d] = cand[d]! + (X[pick]![d]! - X[k]![d]!) * (rng() * 2 - 1);
      const cf = sphere(cand);
      if (cf < F[pick]!) { X[pick] = cand; F[pick] = cf; trials[pick] = 0; } else trials[pick]!++;
    }
    // 侦查蜂阶段
    for (let i = 0; i < half; i++) {
      if (trials[i]! > limit) {
        X[i] = Array.from({ length: dim }, () => (rng() - 0.5) * 10);
        F[i] = sphere(X[i]!);
        trials[i] = 0;
        hooks.onScout?.(i);
      }
    }
    bi = F.indexOf(Math.min(...F));
    if (F[bi]! < bestF) { bestF = F[bi]!; best = [...X[bi]!]; hooks.onImprove?.(bestF, best); }
    hooks.onIter?.(it, bestF);
    void max; void N;
  }
  hooks.onDone?.(bestF, best);
  return { best, fit: bestF };
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { abc } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'ABC sphere 2D', en: 'ABC sphere 2D' })
    .setBars(Array.from({length:6},(_,i)=>({value: 5-i*0.5, role:'default' as BarRole, label:'b'+i}))).commit();
  abc(2, 6, 30, 10, 17, {
    onIter: (it, bf) => rec.begin({ zh: \`iter \${it} best=\${bf.toFixed(3)}\`, en: \`iter \${it} best=\${bf.toFixed(3)}\` })
      .setBars(Array.from({length:6},()=>({value: Math.round(bf*100)/100, role:'swap' as BarRole})))
      .setAux([{ label: 'best', value: bf.toFixed(3), role: 'final' as BarRole }]).commit(),
    onDone: (bf, b) => rec.begin({ zh: \`完成 best=\${bf.toFixed(3)}\`, en: \`done best=\${bf.toFixed(3)}\` })
      .setAux([{ label: 'pos', value: JSON.stringify(b.map((v)=>Math.round(v*100)/100)), role: 'final' as BarRole }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { abc, sphere } from '../../src/algorithms/ai-search/ais-bee-colony/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-bee-colony/trace.ts';

test('ABC 在 sphere 上收敛', () => {
  const r = abc(2, 10, 40, 15, 17);
  assert.ok(r.fit < 1, 'fit=' + r.fit);
});
test('ABC 同种子可复现', () => {
  const a = abc(2, 8, 20, 10, 3);
  const b = abc(2, 8, 20, 10, 3);
  assert.deepEqual(a.best, b.best);
});
test('ABC trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// ========================================================================
// 13. ais-firefly
// ========================================================================
{
  id: 'ais-firefly',
  titleZh: '萤火虫算法', titleEn: 'Firefly Algorithm',
  summaryZh: '亮度低者被亮度高者吸引，吸引力随距离指数衰减。',
  summaryEn: 'Less bright fireflies are attracted to brighter ones; attractiveness decays with distance.',
  descZh: '萤火虫算法（Yang 2008）：亮度 I = 1/(1+f)；吸引力 β = β0·exp(−γr²)；位置更新 x_i = x_i + β·(x_j − x_i) + α·(rand−0.5)。本实现最小化 Sphere。',
  descEn: 'Firefly algorithm (Yang 2008): brightness I = 1/(1+f); attractiveness β = β0·exp(−γr²); position update x_i = x_i + β·(x_j − x_i) + α·(rand−0.5). Minimizes Sphere.',
  tags: ['ai-search','swarm','optimization','firefly'],
  time: 'O(iter × n² × d)', space: 'O(n × d)',
  impl: `// 萤火虫算法 · 实现
export interface FfaHooks {
  onIter?: (iter: number, bestFit: number) => void;
  onImprove?: (bestFit: number, best: number[]) => void;
  onDone?: (bestFit: number, best: number[]) => void;
}
export function sphere(x: number[]): number { return x.reduce((s, v) => s + v * v, 0); }
function makeRng(seed: number): () => number {
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}
export function firefly(
  dim: number, n: number, iters: number,
  beta0: number, gamma: number, alpha: number, seed = 19,
  hooks: FfaHooks = {},
): { best: number[]; fit: number } {
  const rng = makeRng(seed);
  const X: number[][] = Array.from({ length: n }, () =>
    Array.from({ length: dim }, () => (rng() - 0.5) * 10));
  const F: number[] = X.map((x) => sphere(x));
  let bi = F.indexOf(Math.min(...F));
  let best = [...X[bi]!]; let bestF = F[bi]!;
  for (let it = 0; it < iters; it++) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (F[j]! < F[i]!) {
          const r2 = X[i]!.reduce((s, v, d) => s + (v - X[j]![d]!) ** 2, 0);
          const beta = beta0 * Math.exp(-gamma * r2);
          for (let d = 0; d < dim; d++) {
            X[i]![d] = X[i]![d]! + beta * (X[j]![d]! - X[i]![d]!) + alpha * (rng() - 0.5);
          }
          F[i] = sphere(X[i]!);
        }
      }
    }
    bi = F.indexOf(Math.min(...F));
    if (F[bi]! < bestF) { bestF = F[bi]!; best = [...X[bi]!]; hooks.onImprove?.(bestF, best); }
    hooks.onIter?.(it, bestF);
  }
  hooks.onDone?.(bestF, best);
  return { best, fit: bestF };
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { firefly } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Firefly sphere 2D', en: 'Firefly sphere 2D' })
    .setBars(Array.from({length:8},(_,i)=>({value: 6-i*0.5, role:'default' as BarRole, label:'f'+i}))).commit();
  firefly(2, 8, 25, 1, 1, 0.2, 19, {
    onIter: (it, bf) => rec.begin({ zh: \`iter \${it} best=\${bf.toFixed(3)}\`, en: \`iter \${it} best=\${bf.toFixed(3)}\` })
      .setBars(Array.from({length:8},()=>({value: Math.round(bf*100)/100, role:'swap' as BarRole})))
      .setAux([{ label: 'best', value: bf.toFixed(3), role: 'final' as BarRole }]).commit(),
    onDone: (bf, b) => rec.begin({ zh: \`完成\`, en: \`done\` })
      .setAux([{ label: 'pos', value: JSON.stringify(b.map((v)=>Math.round(v*100)/100)), role: 'final' as BarRole }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { firefly } from '../../src/algorithms/ai-search/ais-firefly/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-firefly/trace.ts';

test('Firefly 在 sphere 上收敛', () => {
  const r = firefly(2, 12, 40, 1, 1, 0.2, 19);
  assert.ok(r.fit < 2, 'fit=' + r.fit);
});
test('Firefly 同种子可复现', () => {
  const a = firefly(2, 8, 20, 1, 1, 0.2, 5);
  const b = firefly(2, 8, 20, 1, 1, 0.2, 5);
  assert.deepEqual(a.best, b.best);
});
test('Firefly trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// ========================================================================
// 14. ais-bat-algo
// ========================================================================
{
  id: 'ais-bat-algo',
  titleZh: '蝙蝠算法', titleEn: 'Bat Algorithm',
  summaryZh: '模拟蝙蝠回声定位：频率、响度、脉冲率协同搜索。',
  summaryEn: 'Mimics bat echolocation via frequency, loudness, and pulse rate.',
  descZh: '蝙蝠算法（Yang 2010）：每只蝙蝠有频率 f∈[fmin,fmax]、位置 x、速度 v；v = v + (x − xbest)·f；x += v。以脉冲率 r 局部随机游走；以响度 A 概率接受新解。本实现最小化 Sphere。',
  descEn: 'Bat algorithm (Yang 2010): each bat has frequency f∈[fmin,fmax], position x, velocity v; v = v + (x − xbest)·f; x += v. With pulse rate r do local random walk; accept new solutions with loudness probability A. Minimizes Sphere.',
  tags: ['ai-search','swarm','optimization','bat'],
  time: 'O(iter × bats × d)', space: 'O(bats × d)',
  impl: `// 蝙蝠算法 · 实现
export interface BatHooks {
  onIter?: (iter: number, bestFit: number) => void;
  onImprove?: (bestFit: number, best: number[]) => void;
  onDone?: (bestFit: number, best: number[]) => void;
}
export function sphere(x: number[]): number { return x.reduce((s, v) => s + v * v, 0); }
function makeRng(seed: number): () => number {
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}
export function bat(
  dim: number, n: number, iters: number,
  fmin: number, fmax: number, A0: number, r0: number, alpha: number, gamma: number, seed = 23,
  hooks: BatHooks = {},
): { best: number[]; fit: number } {
  const rng = makeRng(seed);
  const X: number[][] = Array.from({ length: n }, () =>
    Array.from({ length: dim }, () => (rng() - 0.5) * 10));
  const V: number[][] = X.map((x) => x.map(() => 0));
  const F: number[] = X.map((x) => sphere(x));
  let bi = F.indexOf(Math.min(...F));
  let best = [...X[bi]!]; let bestF = F[bi]!;
  let A = A0;
  let r = r0;
  for (let it = 0; it < iters; it++) {
    for (let i = 0; i < n; i++) {
      const f = fmin + (fmax - fmin) * rng();
      for (let d = 0; d < dim; d++) {
        V[i]![d] = V[i]![d]! + (X[i]![d]! - best[d]!) * f;
        X[i]![d] = X[i]![d]! + V[i]![d]!;
      }
      const xi = [...X[i]!];
      // 局部随机游走
      if (rng() > r) {
        const d = Math.floor(rng() * dim);
        xi[d] = xi[d]! + (rng() - 0.5) * A * 2;
      }
      const cf = sphere(xi);
      if (cf < F[i]! && rng() < A) { X[i] = xi; F[i] = cf; }
    }
    bi = F.indexOf(Math.min(...F));
    if (F[bi]! < bestF) { bestF = F[bi]!; best = [...X[bi]!]; hooks.onImprove?.(bestF, best); }
    A *= alpha;
    r = r0 * (1 - Math.exp(-gamma * it));
    hooks.onIter?.(it, bestF);
  }
  hooks.onDone?.(bestF, best);
  return { best, fit: bestF };
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { bat } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Bat sphere 2D', en: 'Bat sphere 2D' })
    .setBars(Array.from({length:8},(_,i)=>({value: 6-i*0.5, role:'default' as BarRole, label:'b'+i}))).commit();
  bat(2, 8, 30, 0, 2, 0.9, 0.5, 0.95, 0.1, 23, {
    onIter: (it, bf) => rec.begin({ zh: \`iter \${it} best=\${bf.toFixed(3)}\`, en: \`iter \${it} best=\${bf.toFixed(3)}\` })
      .setBars(Array.from({length:8},()=>({value: Math.round(bf*100)/100, role:'swap' as BarRole})))
      .setAux([{ label: 'best', value: bf.toFixed(3), role: 'final' as BarRole }]).commit(),
    onDone: (bf, b) => rec.begin({ zh: '完成', en: 'done' })
      .setAux([{ label: 'pos', value: JSON.stringify(b.map((v)=>Math.round(v*100)/100)), role: 'final' as BarRole }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bat } from '../../src/algorithms/ai-search/ais-bat-algo/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-bat-algo/trace.ts';

test('Bat 在 sphere 上收敛', () => {
  const r = bat(2, 10, 40, 0, 2, 0.9, 0.5, 0.95, 0.1, 23);
  assert.ok(r.fit < 5, 'fit=' + r.fit);
});
test('Bat 同种子可复现', () => {
  const a = bat(2, 8, 20, 0, 2, 0.9, 0.5, 0.95, 0.1, 5);
  const b = bat(2, 8, 20, 0, 2, 0.9, 0.5, 0.95, 0.1, 5);
  assert.deepEqual(a.best, b.best);
});
test('Bat trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// ========================================================================
// 15. ais-cuckoo-search
// ========================================================================
{
  id: 'ais-cuckoo-search',
  titleZh: '布谷鸟搜索', titleEn: 'Cuckoo Search',
  summaryZh: '基于 Lévy 飞行的巢寄生行为，全局探索强。',
  summaryEn: 'Nest parasitism with Lévy flights for strong global exploration.',
  descZh: '布谷鸟搜索（Yang & Deb 2009）：每个巢代表一个解；新解通过 Lévy 飞行 x = x + α·L·(x − xbest) 产生；以概率 pa 丢弃最差巢并随机替换。Lévy 步长用 Mantegna 算法近似。',
  descEn: 'Cuckoo search (Yang & Deb 2009): each nest is a solution; new solutions come from Lévy flight x = x + α·L·(x − xbest); with probability pa the worst nests are abandoned and randomly replaced. Lévy step approximated by Mantegna.',
  tags: ['ai-search','swarm','optimization','cuckoo','levy'],
  time: 'O(iter × nests × d)', space: 'O(nests × d)',
  impl: `// 布谷鸟搜索 · 实现
export interface CsHooks {
  onIter?: (iter: number, bestFit: number) => void;
  onImprove?: (bestFit: number, best: number[]) => void;
  onDone?: (bestFit: number, best: number[]) => void;
}
export function sphere(x: number[]): number { return x.reduce((s, v) => s + v * v, 0); }
function makeRng(seed: number): () => number {
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}
/** Mantegna 近似 Lévy 步长（β=1.5）。 */
function levy(rng: () => number, dim: number, beta = 1.5): number[] {
  const sigmaU = Math.pow((Math.gamma(1 + beta) * Math.sin(Math.PI * beta / 2)) /
    (Math.gamma((1 + beta) / 2) * beta * Math.pow(2, (beta - 1) / 2)), 1 / beta);
  const out: number[] = [];
  for (let d = 0; d < dim; d++) {
    const u = (rng() - 0.5) * sigmaU;
    const v = (rng() - 0.5);
    out.push(u / Math.pow(Math.abs(v), 1 / beta));
  }
  return out;
}
export function cuckoo(
  dim: number, n: number, iters: number, pa: number, alpha: number, seed = 29,
  hooks: CsHooks = {},
): { best: number[]; fit: number } {
  const rng = makeRng(seed);
  const X: number[][] = Array.from({ length: n }, () =>
    Array.from({ length: dim }, () => (rng() - 0.5) * 10));
  const F: number[] = X.map((x) => sphere(x));
  let bi = F.indexOf(Math.min(...F));
  let best = [...X[bi]!]; let bestF = F[bi]!;
  for (let it = 0; it < iters; it++) {
    // 每个巢产生新解（Lévy 飞行）
    for (let i = 0; i < n; i++) {
      const L = levy(rng, dim);
      const cand = X[i]!.map((v, d) => v + alpha * L[d]! * (v - best[d]!));
      const j = Math.floor(rng() * n);
      if (sphere(cand) < F[j]!) { X[j] = cand; F[j] = sphere(cand); }
    }
    // 丢弃最差 pa 比例，随机重生
    const order = [...Array(n).keys()].sort((a, b) => F[b]! - F[a]!);
    const abandon = Math.floor(n * pa);
    for (let k = 0; k < abandon; k++) {
      const idx = order[k]!;
      X[idx] = Array.from({ length: dim }, () => (rng() - 0.5) * 10);
      F[idx] = sphere(X[idx]!);
    }
    bi = F.indexOf(Math.min(...F));
    if (F[bi]! < bestF) { bestF = F[bi]!; best = [...X[bi]!]; hooks.onImprove?.(bestF, best); }
    hooks.onIter?.(it, bestF);
  }
  hooks.onDone?.(bestF, best);
  return { best, fit: bestF };
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { cuckoo } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Cuckoo sphere 2D', en: 'Cuckoo sphere 2D' })
    .setBars(Array.from({length:8},(_,i)=>({value: 6-i*0.5, role:'default' as BarRole, label:'n'+i}))).commit();
  cuckoo(2, 8, 25, 0.25, 0.5, 29, {
    onIter: (it, bf) => rec.begin({ zh: \`iter \${it} best=\${bf.toFixed(3)}\`, en: \`iter \${it} best=\${bf.toFixed(3)}\` })
      .setBars(Array.from({length:8},()=>({value: Math.round(bf*100)/100, role:'swap' as BarRole})))
      .setAux([{ label: 'best', value: bf.toFixed(3), role: 'final' as BarRole }]).commit(),
    onDone: (bf, b) => rec.begin({ zh: '完成', en: 'done' })
      .setAux([{ label: 'pos', value: JSON.stringify(b.map((v)=>Math.round(v*100)/100)), role: 'final' as BarRole }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cuckoo } from '../../src/algorithms/ai-search/ais-cuckoo-search/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-cuckoo-search/trace.ts';

test('Cuckoo 在 sphere 上收敛', () => {
  const r = cuckoo(2, 10, 40, 0.25, 0.5, 29);
  assert.ok(r.fit < 5, 'fit=' + r.fit);
});
test('Cuckoo 同种子可复现', () => {
  const a = cuckoo(2, 8, 20, 0.25, 0.5, 5);
  const b = cuckoo(2, 8, 20, 0.25, 0.5, 5);
  assert.deepEqual(a.best, b.best);
});
test('Cuckoo trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// ========================================================================
// 16. ais-wolf-pack
// ========================================================================
{
  id: 'ais-wolf-pack',
  titleZh: '狼群算法', titleEn: 'Wolf Pack Search',
  summaryZh: '探狼侦察、猛狼围捕、首领更新（Rastrigin 目标）。',
  summaryEn: 'Scout wolves reconnoiter, fierce wolves attack, leader updates (Rastrigin target).',
  descZh: '狼群算法：每代分探狼（在邻域侦察更好位置）和猛狼（朝首领靠近）。本实现以 Rastrigin 函数（多峰）最小化演示。',
  descEn: 'Wolf pack search: each generation splits into scouts (probe neighborhood) and fierce wolves (move toward leader). Minimizes the multimodal Rastrigin function.',
  tags: ['ai-search','swarm','optimization','wolf-pack'],
  time: 'O(iter × wolves × d)', space: 'O(wolves × d)',
  impl: `// 狼群算法 · 实现
export interface WolfHooks {
  onIter?: (iter: number, bestFit: number) => void;
  onImprove?: (bestFit: number, best: number[]) => void;
  onDone?: (bestFit: number, best: number[]) => void;
}
export function rastrigin(x: number[]): number {
  const A = 10;
  return A * x.length + x.reduce((s, v) => s + v * v - A * Math.cos(2 * Math.PI * v), 0);
}
function makeRng(seed: number): () => number {
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}
export function wolfPack(
  dim: number, n: number, iters: number, stepScout: number, stepAttack: number, seed = 31,
  hooks: WolfHooks = {},
): { best: number[]; fit: number } {
  const rng = makeRng(seed);
  const X: number[][] = Array.from({ length: n }, () =>
    Array.from({ length: dim }, () => (rng() - 0.5) * 10));
  const F: number[] = X.map((x) => rastrigin(x));
  let bi = F.indexOf(Math.min(...F));
  let best = [...X[bi]!]; let bestF = F[bi]!;
  for (let it = 0; it < iters; it++) {
    // 探狼阶段：每只狼向随机方向侦察
    for (let i = 0; i < n; i++) {
      const cand = X[i]!.map((v) => v + (rng() - 0.5) * stepScout);
      const cf = rastrigin(cand);
      if (cf < F[i]!) { X[i] = cand; F[i] = cf; }
    }
    // 猛狼阶段：朝首领靠近
    bi = F.indexOf(Math.min(...F));
    for (let i = 0; i < n; i++) {
      if (i === bi) continue;
      const cand = X[i]!.map((v, d) => v + stepAttack * (X[bi]![d]! - v));
      const cf = rastrigin(cand);
      if (cf < F[i]!) { X[i] = cand; F[i] = cf; }
    }
    bi = F.indexOf(Math.min(...F));
    if (F[bi]! < bestF) { bestF = F[bi]!; best = [...X[bi]!]; hooks.onImprove?.(bestF, best); }
    hooks.onIter?.(it, bestF);
  }
  hooks.onDone?.(bestF, best);
  return { best, fit: bestF };
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { wolfPack } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'WolfPack Rastrigin 2D', en: 'WolfPack Rastrigin 2D' })
    .setBars(Array.from({length:8},(_,i)=>({value: 30-i*2, role:'default' as BarRole, label:'w'+i}))).commit();
  wolfPack(2, 8, 30, 1.5, 0.3, 31, {
    onIter: (it, bf) => rec.begin({ zh: \`iter \${it} best=\${bf.toFixed(2)}\`, en: \`iter \${it} best=\${bf.toFixed(2)}\` })
      .setBars(Array.from({length:8},()=>({value: Math.round(bf*10)/10, role:'swap' as BarRole})))
      .setAux([{ label: 'best', value: bf.toFixed(2), role: 'final' as BarRole }]).commit(),
    onDone: (bf, b) => rec.begin({ zh: '完成', en: 'done' })
      .setAux([{ label: 'pos', value: JSON.stringify(b.map((v)=>Math.round(v*100)/100)), role: 'final' as BarRole }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { wolfPack, rastrigin } from '../../src/algorithms/ai-search/ais-wolf-pack/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-wolf-pack/trace.ts';

test('WolfPack 在 Rastrigin 上改进', () => {
  const r = wolfPack(2, 12, 40, 1.0, 0.3, 31);
  assert.ok(r.fit < rastrigin([5, 5]));
});
test('WolfPack 同种子可复现', () => {
  const a = wolfPack(2, 8, 20, 1, 0.3, 5);
  const b = wolfPack(2, 8, 20, 1, 0.3, 5);
  assert.deepEqual(a.best, b.best);
});
test('rastrigin(0)=0', () => assert.equal(rastrigin([0,0]), 0));
test('WolfPack trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// ========================================================================
// 17. ais-harmony-search
// ========================================================================
{
  id: 'ais-harmony-search',
  titleZh: '和声搜索', titleEn: 'Harmony Search',
  summaryZh: '记忆库取值 + 音调微调 + 随机选择，新和声优于最差即替换。',
  summaryEn: 'Memory-take + pitch-adjust + random choice; replace worst if new harmony is better.',
  descZh: '和声搜索（Geem 2001）：每个变量以概率 HMCR 从记忆库取值，以概率 PAR 微调（±bw），否则随机；新和声优于最差者即替换。本实现在 Sphere 上演示。',
  descEn: 'Harmony search (Geem 2001): each variable is taken from memory with prob HMCR, pitch-adjusted (±bw) with prob PAR, otherwise randomly chosen; better new harmony replaces the worst. Demo on Sphere.',
  tags: ['ai-search','metaheuristic','optimization','harmony'],
  time: 'O(iter × n)', space: 'O(hms × n)',
  impl: `// 和声搜索 · 实现
export interface HsHooks {
  onIter?: (iter: number, bestFit: number) => void;
  onImprove?: (bestFit: number, best: number[]) => void;
  onDone?: (bestFit: number, best: number[]) => void;
}
export function sphere(x: number[]): number { return x.reduce((s, v) => s + v * v, 0); }
function makeRng(seed: number): () => number {
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}
export function harmonySearch(
  dim: number, hms: number, iters: number,
  hmcr: number, par: number, bw: number, lb: number, ub: number, seed = 37,
  hooks: HsHooks = {},
): { best: number[]; fit: number } {
  const rng = makeRng(seed);
  let HM: number[][] = Array.from({ length: hms }, () =>
    Array.from({ length: dim }, () => lb + (ub - lb) * rng()));
  let HF: number[] = HM.map((x) => sphere(x));
  for (let it = 0; it < iters; it++) {
    const x: number[] = [];
    for (let d = 0; d < dim; d++) {
      if (rng() < hmcr) {
        const pick = HM[Math.floor(rng() * hms)]![d]!;
        if (rng() < par) x.push(pick + (rng() - 0.5) * 2 * bw);
        else x.push(pick);
      } else {
        x.push(lb + (ub - lb) * rng());
      }
    }
    const f = sphere(x);
    const worstIdx = HF.indexOf(Math.max(...HF));
    if (f < HF[worstIdx]!) { HM[worstIdx] = x; HF[worstIdx] = f; }
    const bi = HF.indexOf(Math.min(...HF));
    hooks.onImprove?.(HF[bi]!, [...HM[bi]!]);
    hooks.onIter?.(it, HF[bi]!);
  }
  const bi = HF.indexOf(Math.min(...HF));
  hooks.onDone?.(HF[bi]!, HM[bi]!);
  return { best: HM[bi]!, fit: HF[bi]! };
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { harmonySearch } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Harmony sphere 2D', en: 'Harmony sphere 2D' })
    .setBars(Array.from({length:6},(_,i)=>({value: 6-i, role:'default' as BarRole, label:'h'+i}))).commit();
  harmonySearch(2, 6, 30, 0.9, 0.3, 0.5, -5, 5, 37, {
    onIter: (it, bf) => rec.begin({ zh: \`iter \${it} best=\${bf.toFixed(3)}\`, en: \`iter \${it} best=\${bf.toFixed(3)}\` })
      .setBars(Array.from({length:6},()=>({value: Math.round(bf*100)/100, role:'swap' as BarRole})))
      .setAux([{ label: 'best', value: bf.toFixed(3), role: 'final' as BarRole }]).commit(),
    onDone: (bf, b) => rec.begin({ zh: '完成', en: 'done' })
      .setAux([{ label: 'pos', value: JSON.stringify(b.map((v)=>Math.round(v*100)/100)), role: 'final' as BarRole }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { harmonySearch } from '../../src/algorithms/ai-search/ais-harmony-search/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-harmony-search/trace.ts';

test('Harmony 在 sphere 上收敛', () => {
  const r = harmonySearch(2, 10, 50, 0.9, 0.3, 0.3, -5, 5, 37);
  assert.ok(r.fit < 1, 'fit=' + r.fit);
});
test('Harmony 同种子可复现', () => {
  const a = harmonySearch(2, 8, 20, 0.9, 0.3, 0.3, -5, 5, 5);
  const b = harmonySearch(2, 8, 20, 0.9, 0.3, 0.3, -5, 5, 5);
  assert.deepEqual(a.best, b.best);
});
test('Harmony trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// ========================================================================
// 18. ais-gravitational
// ========================================================================
{
  id: 'ais-gravitational',
  titleZh: '引力搜索', titleEn: 'Gravitational Search',
  summaryZh: '粒子按质量与距离互相吸引（万有引力模型）。',
  summaryEn: 'Particles attract by mass and distance (gravity model).',
  descZh: '引力搜索算法（Rashedi 2009）：质量正比于适应度；粒子按 F = G·m1·m2/r² 互相吸引；加速度 a = F/m 更新速度与位置。本实现最小化 Sphere。',
  descEn: 'GSA (Rashedi 2009): mass proportional to fitness; particles attract via F = G·m1·m2/r²; acceleration a = F/m updates velocity and position. Minimizes Sphere.',
  tags: ['ai-search','physics','optimization','gsa'],
  time: 'O(iter × n² × d)', space: 'O(n × d)',
  impl: `// 引力搜索算法 · 实现
export interface GsaHooks {
  onIter?: (iter: number, bestFit: number) => void;
  onImprove?: (bestFit: number, best: number[]) => void;
  onDone?: (bestFit: number, best: number[]) => void;
}
export function sphere(x: number[]): number { return x.reduce((s, v) => s + v * v, 0); }
function makeRng(seed: number): () => number {
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}
export function gsa(
  dim: number, n: number, iters: number, G0: number, seed = 41,
  hooks: GsaHooks = {},
): { best: number[]; fit: number } {
  const rng = makeRng(seed);
  const X: number[][] = Array.from({ length: n }, () =>
    Array.from({ length: dim }, () => (rng() - 0.5) * 20));
  const V: number[][] = X.map((x) => x.map(() => 0));
  let F: number[] = X.map((x) => sphere(x));
  let bi = F.indexOf(Math.min(...F));
  let best = [...X[bi]!]; let bestF = F[bi]!;
  for (let it = 0; it < iters; it++) {
    const G = G0 * Math.exp(-it / iters);
    const worst = Math.max(...F);
    const best = Math.min(...F);
    const M: number[] = F.map((f) => (worst === best ? 1 : (worst - f) / (worst - best)));
    const sumM = M.reduce((a, b) => a + b, 0) || 1;
    const m: number[] = M.map((mi) => mi / sumM);
    // 计算每个粒子受到的合力（随机加权）
    const forces: number[][] = X.map(() => Array.from({ length: dim }, () => 0));
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i === j) continue;
        let r2 = 0;
        for (let d = 0; d < dim; d++) r2 += (X[i]![d]! - X[j]![d]!) ** 2;
        r2 = Math.max(r2, 1e-6);
        for (let d = 0; d < dim; d++) {
          forces[i]![d] = forces[i]![d]! + rng() * G * m[j]! * (X[j]![d]! - X[i]![d]!) / r2;
        }
      }
    }
    for (let i = 0; i < n; i++) {
      for (let d = 0; d < dim; d++) {
        const a = forces[i]![d]! / Math.max(m[i]!, 1e-6);
        V[i]![d] = (rng() * V[i]![d]!) + a;
        X[i]![d] = X[i]![d]! + V[i]![d]!;
      }
      F[i] = sphere(X[i]!);
    }
    bi = F.indexOf(Math.min(...F));
    if (F[bi]! < bestF) { bestF = F[bi]!; best = [...X[bi]!]; hooks.onImprove?.(bestF, best); }
    hooks.onIter?.(it, bestF);
  }
  hooks.onDone?.(bestF, best);
  return { best, fit: bestF };
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { gsa } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'GSA sphere 2D', en: 'GSA sphere 2D' })
    .setBars(Array.from({length:8},(_,i)=>({value: 30-i*2, role:'default' as BarRole, label:'p'+i}))).commit();
  gsa(2, 8, 30, 100, 41, {
    onIter: (it, bf) => rec.begin({ zh: \`iter \${it} best=\${bf.toFixed(3)}\`, en: \`iter \${it} best=\${bf.toFixed(3)}\` })
      .setBars(Array.from({length:8},()=>({value: Math.round(bf*100)/100, role:'swap' as BarRole})))
      .setAux([{ label: 'best', value: bf.toFixed(3), role: 'final' as BarRole }]).commit(),
    onDone: (bf, b) => rec.begin({ zh: '完成', en: 'done' })
      .setAux([{ label: 'pos', value: JSON.stringify(b.map((v)=>Math.round(v*100)/100)), role: 'final' as BarRole }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gsa } from '../../src/algorithms/ai-search/ais-gravitational/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-gravitational/trace.ts';

test('GSA 在 sphere 上改进', () => {
  const r = gsa(2, 12, 40, 50, 41);
  assert.ok(r.fit < 50, 'fit=' + r.fit);
});
test('GSA 同种子可复现', () => {
  const a = gsa(2, 8, 20, 50, 5);
  const b = gsa(2, 8, 20, 50, 5);
  assert.deepEqual(a.best, b.best);
});
test('GSA trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// ========================================================================
// 19. ais-flower-pollin
// ========================================================================
{
  id: 'ais-flower-pollin',
  titleZh: '花朵授粉算法', titleEn: 'Flower Pollination Algorithm',
  summaryZh: '异花授粉（全局 Lévy 飞行）与自花授粉（局部扰动）切换。',
  summaryEn: 'Switch between cross-pollination (global Lévy flight) and self-pollination (local).',
  descZh: '花朵授粉算法（Yang 2012）：以概率 p 走全局授粉 x = x + L·(x − x*)，L 为 Lévy 步长；否则局部自花授粉 x = x + ε·(xj − xk)。本实现最小化 Sphere。',
  descEn: 'FPA (Yang 2012): with probability p do global pollination x = x + L·(x − x*), L is a Lévy step; otherwise local self-pollination x = x + ε·(xj − xk). Minimizes Sphere.',
  tags: ['ai-search','nature','optimization','flower'],
  time: 'O(iter × flowers × d)', space: 'O(flowers × d)',
  impl: `// 花朵授粉算法 · 实现
export interface FpaHooks {
  onIter?: (iter: number, bestFit: number) => void;
  onImprove?: (bestFit: number, best: number[]) => void;
  onDone?: (bestFit: number, best: number[]) => void;
}
export function sphere(x: number[]): number { return x.reduce((s, v) => s + v * v, 0); }
function makeRng(seed: number): () => number {
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}
function levyStep(rng: () => number, dim: number, beta = 1.5): number {
  const sigmaU = Math.pow((Math.gamma(1 + beta) * Math.sin(Math.PI * beta / 2)) /
    (Math.gamma((1 + beta) / 2) * beta * Math.pow(2, (beta - 1) / 2)), 1 / beta);
  const u = (rng() - 0.5) * sigmaU;
  const v = (rng() - 0.5);
  return u / Math.pow(Math.abs(v), 1 / beta);
}
export function flowerPollination(
  dim: number, n: number, iters: number, p: number, seed = 43,
  hooks: FpaHooks = {},
): { best: number[]; fit: number } {
  const rng = makeRng(seed);
  const X: number[][] = Array.from({ length: n }, () =>
    Array.from({ length: dim }, () => (rng() - 0.5) * 10));
  let F: number[] = X.map((x) => sphere(x));
  let bi = F.indexOf(Math.min(...F));
  let best = [...X[bi]!]; let bestF = F[bi]!;
  for (let it = 0; it < iters; it++) {
    for (let i = 0; i < n; i++) {
      const cand = [...X[i]!];
      if (rng() < p) {
        // 全局授粉
        const L = levyStep(rng, dim);
        for (let d = 0; d < dim; d++) cand[d] = cand[d]! + L * (cand[d]! - best[d]!);
      } else {
        // 局部自花授粉
        const j = Math.floor(rng() * n);
        const k = Math.floor(rng() * n);
        const eps = rng();
        for (let d = 0; d < dim; d++) cand[d] = cand[d]! + eps * (X[j]![d]! - X[k]![d]!);
      }
      const cf = sphere(cand);
      if (cf < F[i]!) { X[i] = cand; F[i] = cf; }
    }
    bi = F.indexOf(Math.min(...F));
    if (F[bi]! < bestF) { bestF = F[bi]!; best = [...X[bi]!]; hooks.onImprove?.(bestF, best); }
    hooks.onIter?.(it, bestF);
  }
  hooks.onDone?.(bestF, best);
  return { best, fit: bestF };
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { flowerPollination } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'FPA sphere 2D', en: 'FPA sphere 2D' })
    .setBars(Array.from({length:8},(_,i)=>({value: 8-i*0.7, role:'default' as BarRole, label:'f'+i}))).commit();
  flowerPollination(2, 8, 30, 0.8, 43, {
    onIter: (it, bf) => rec.begin({ zh: \`iter \${it} best=\${bf.toFixed(3)}\`, en: \`iter \${it} best=\${bf.toFixed(3)}\` })
      .setBars(Array.from({length:8},()=>({value: Math.round(bf*100)/100, role:'swap' as BarRole})))
      .setAux([{ label: 'best', value: bf.toFixed(3), role: 'final' as BarRole }]).commit(),
    onDone: (bf, b) => rec.begin({ zh: '完成', en: 'done' })
      .setAux([{ label: 'pos', value: JSON.stringify(b.map((v)=>Math.round(v*100)/100)), role: 'final' as BarRole }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { flowerPollination } from '../../src/algorithms/ai-search/ais-flower-pollin/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-flower-pollin/trace.ts';

test('FPA 在 sphere 上收敛', () => {
  const r = flowerPollination(2, 12, 40, 0.8, 43);
  assert.ok(r.fit < 5, 'fit=' + r.fit);
});
test('FPA 同种子可复现', () => {
  const a = flowerPollination(2, 8, 20, 0.8, 5);
  const b = flowerPollination(2, 8, 20, 0.8, 5);
  assert.deepEqual(a.best, b.best);
});
test('FPA trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// ========================================================================
// 20. ais-teaching-learning
// ========================================================================
{
  id: 'ais-teaching-learning',
  titleZh: '教与学优化', titleEn: 'Teaching-Learning-Based Optimization',
  summaryZh: '教师阶段向最优靠拢，学习阶段两两交互（Sphere 目标）。',
  summaryEn: 'Teacher phase moves toward best; learner phase pairs interact (Sphere target).',
  descZh: 'TLBO（Rao 2011）：教师阶段 x_new = x + r·(teacher − TF·mean)；学习阶段两两比较，差者向好者学习。无算法参数，仅需种群与迭代数。',
  descEn: 'TLBO (Rao 2011): teacher phase x_new = x + r·(teacher − TF·mean); learner phase pairs interact, the worse improving toward the better. No algorithm parameters besides population and iterations.',
  tags: ['ai-search','population','optimization','tlbo'],
  time: 'O(iter × pop × d)', space: 'O(pop × d)',
  impl: `// 教与学优化 · 实现
export interface TlboHooks {
  onIter?: (iter: number, bestFit: number) => void;
  onImprove?: (bestFit: number, best: number[]) => void;
  onDone?: (bestFit: number, best: number[]) => void;
}
export function sphere(x: number[]): number { return x.reduce((s, v) => s + v * v, 0); }
function makeRng(seed: number): () => number {
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}
export function tlbo(
  dim: number, pop: number, iters: number, seed = 47,
  hooks: TlboHooks = {},
): { best: number[]; fit: number } {
  const rng = makeRng(seed);
  const X: number[][] = Array.from({ length: pop }, () =>
    Array.from({ length: dim }, () => (rng() - 0.5) * 10));
  let F: number[] = X.map((x) => sphere(x));
  let bi = F.indexOf(Math.min(...F));
  let best = [...X[bi]!]; let bestF = F[bi]!;
  for (let it = 0; it < iters; it++) {
    // 教师阶段
    const teacher = bi;
    const mean: number[] = Array.from({ length: dim }, (_, d) =>
      X.reduce((s, x) => s + x[d]!, 0) / pop);
    const TF = 1 + Math.floor(rng() * 2 + 1); // 1 或 2
    for (let i = 0; i < pop; i++) {
      const cand = X[i]!.map((v, d) => v + rng() * (X[teacher]![d]! - TF * mean[d]!));
      const cf = sphere(cand);
      if (cf < F[i]!) { X[i] = cand; F[i] = cf; }
    }
    // 学习阶段
    for (let i = 0; i < pop; i++) {
      let j = Math.floor(rng() * pop);
      while (j === i) j = Math.floor(rng() * pop);
      const cand = [...X[i]!];
      if (F[i]! < F[j]!) for (let d = 0; d < dim; d++) cand[d] = cand[d]! + rng() * (X[i]![d]! - X[j]![d]!);
      else for (let d = 0; d < dim; d++) cand[d] = cand[d]! + rng() * (X[j]![d]! - X[i]![d]!);
      const cf = sphere(cand);
      if (cf < F[i]!) { X[i] = cand; F[i] = cf; }
    }
    bi = F.indexOf(Math.min(...F));
    if (F[bi]! < bestF) { bestF = F[bi]!; best = [...X[bi]!]; hooks.onImprove?.(bestF, best); }
    hooks.onIter?.(it, bestF);
  }
  hooks.onDone?.(bestF, best);
  return { best, fit: bestF };
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { tlbo } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'TLBO sphere 2D', en: 'TLBO sphere 2D' })
    .setBars(Array.from({length:10},(_,i)=>({value: 10-i, role:'default' as BarRole, label:'s'+i}))).commit();
  tlbo(2, 10, 25, 47, {
    onIter: (it, bf) => rec.begin({ zh: \`iter \${it} best=\${bf.toFixed(3)}\`, en: \`iter \${it} best=\${bf.toFixed(3)}\` })
      .setBars(Array.from({length:10},()=>({value: Math.round(bf*100)/100, role:'swap' as BarRole})))
      .setAux([{ label: 'best', value: bf.toFixed(3), role: 'final' as BarRole }]).commit(),
    onDone: (bf, b) => rec.begin({ zh: '完成', en: 'done' })
      .setAux([{ label: 'pos', value: JSON.stringify(b.map((v)=>Math.round(v*100)/100)), role: 'final' as BarRole }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tlbo } from '../../src/algorithms/ai-search/ais-teaching-learning/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-teaching-learning/trace.ts';

test('TLBO 在 sphere 上收敛', () => {
  const r = tlbo(2, 15, 40, 47);
  assert.ok(r.fit < 1, 'fit=' + r.fit);
});
test('TLBO 同种子可复现', () => {
  const a = tlbo(2, 10, 20, 5);
  const b = tlbo(2, 10, 20, 5);
  assert.deepEqual(a.best, b.best);
});
test('TLBO trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// ========================================================================
// 21. ais-krill-herd
// ========================================================================
{
  id: 'ais-krill-herd',
  titleZh: '磷虾群算法', titleEn: 'Krill Herd Algorithm',
  summaryZh: '磷虾群：诱导、觅食、扩散三种运动协同搜索。',
  summaryEn: 'Krill herd: induction, foraging, and diffusion motions cooperate.',
  descZh: '磷虾群算法（Gandomi & Alavi 2012）：每个磷虾位置由三部分运动更新：邻居诱导 N、觅食运动 F、物理扩散 D。dx/dt = N + F + D。本实现最小化 Sphere。',
  descEn: 'KHA (Gandomi & Alavi 2012): each krill position is updated by three motion components: neighbor-induced N, foraging F, physical diffusion D; dx/dt = N + F + D. Minimizes Sphere.',
  tags: ['ai-search','swarm','optimization','krill'],
  time: 'O(iter × n × d)', space: 'O(n × d)',
  impl: `// 磷虾群算法 · 实现（简化）
export interface KhHooks {
  onIter?: (iter: number, bestFit: number) => void;
  onImprove?: (bestFit: number, best: number[]) => void;
  onDone?: (bestFit: number, best: number[]) => void;
}
export function sphere(x: number[]): number { return x.reduce((s, v) => s + v * v, 0); }
function makeRng(seed: number): () => number {
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}
export function krillHerd(
  dim: number, n: number, iters: number,
  wN: number, wF: number, wD: number, seed = 53,
  hooks: KhHooks = {},
): { best: number[]; fit: number } {
  const rng = makeRng(seed);
  const X: number[][] = Array.from({ length: n }, () =>
    Array.from({ length: dim }, () => (rng() - 0.5) * 10));
  let F: number[] = X.map((x) => sphere(x));
  const N: number[][] = X.map((x) => [...x].map(() => 0));
  const Fo: number[][] = X.map((x) => [...x].map(() => 0));
  let bi = F.indexOf(Math.min(...F));
  let best = [...X[bi]!]; let bestF = F[bi]!;
  for (let it = 0; it < iters; it++) {
    const Dmax = 0.2 * (1 - it / iters);
    for (let i = 0; i < n; i++) {
      // 诱导运动：朝最佳磷虾
      const Ni = N[i]!.map((_, d) => wN * (X[bi]![d]! - X[i]![d]!) + N[i]![d]!);
      // 觅食运动：朝个体历史食物（这里简化为最近邻）
      const neighbors = X.map((x, j) => ({ j, d: j === i ? Infinity : Math.hypot(x[0]! - X[i]![0]!, x[1]! - X[i]![1]!) }))
        .sort((a, b) => a.d - b.d).slice(0, 3);
      const foodX = neighbors[0] ? X[neighbors[0].j]! : X[bi]!;
      const Fi = Fo[i]!.map((_, d) => wF * (foodX[d]! - X[i]![d]!) + Fo[i]![d]!);
      // 物理扩散
      const Di = Array.from({ length: dim }, () => wD * Dmax * (rng() - 0.5) * 2);
      for (let d = 0; d < dim; d++) {
        X[i]![d] = X[i]![d]! + Ni[d]! + Fi[d]! + Di[d]!;
      }
      N[i] = Ni;
      Fo[i] = Fi;
      F[i] = sphere(X[i]!);
    }
    bi = F.indexOf(Math.min(...F));
    if (F[bi]! < bestF) { bestF = F[bi]!; best = [...X[bi]!]; hooks.onImprove?.(bestF, best); }
    hooks.onIter?.(it, bestF);
  }
  hooks.onDone?.(bestF, best);
  return { best, fit: bestF };
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { krillHerd } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Krill sphere 2D', en: 'Krill sphere 2D' })
    .setBars(Array.from({length:8},(_,i)=>({value: 8-i*0.7, role:'default' as BarRole, label:'k'+i}))).commit();
  krillHerd(2, 8, 30, 0.5, 0.3, 0.2, 53, {
    onIter: (it, bf) => rec.begin({ zh: \`iter \${it} best=\${bf.toFixed(3)}\`, en: \`iter \${it} best=\${bf.toFixed(3)}\` })
      .setBars(Array.from({length:8},()=>({value: Math.round(bf*100)/100, role:'swap' as BarRole})))
      .setAux([{ label: 'best', value: bf.toFixed(3), role: 'final' as BarRole }]).commit(),
    onDone: (bf, b) => rec.begin({ zh: '完成', en: 'done' })
      .setAux([{ label: 'pos', value: JSON.stringify(b.map((v)=>Math.round(v*100)/100)), role: 'final' as BarRole }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { krillHerd } from '../../src/algorithms/ai-search/ais-krill-herd/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-krill-herd/trace.ts';

test('Krill 在 sphere 上改进', () => {
  const r = krillHerd(2, 12, 40, 0.5, 0.3, 0.2, 53);
  assert.ok(r.fit < 10, 'fit=' + r.fit);
});
test('Krill 同种子可复现', () => {
  const a = krillHerd(2, 8, 20, 0.5, 0.3, 0.2, 5);
  const b = krillHerd(2, 8, 20, 0.5, 0.3, 0.2, 5);
  assert.deepEqual(a.best, b.best);
});
test('Krill trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// ========================================================================
// 22. ais-differential-evol
// ========================================================================
{
  id: 'ais-differential-evol',
  titleZh: '差分进化', titleEn: 'Differential Evolution',
  summaryZh: 'DE/rand/1/bin：差分变异 + 二项交叉 + 贪心选择。',
  summaryEn: 'DE/rand/1/bin: difference-vector mutation + binomial crossover + greedy selection.',
  descZh: '差分进化（Storn & Price 1997）：变异 v = x_r1 + F·(x_r2 − x_r3)；与父代二项交叉 u；若 sphere(u) < sphere(x) 则替换。本实现最小化 Sphere。',
  descEn: 'DE (Storn & Price 1997): mutation v = x_r1 + F·(x_r2 − x_r3); binomial crossover with parent gives u; replace if sphere(u) < sphere(x). Minimizes Sphere.',
  tags: ['ai-search','evolutionary','optimization','de'],
  time: 'O(iter × pop × d)', space: 'O(pop × d)',
  impl: `// 差分进化 · 实现
export interface DeHooks {
  onIter?: (iter: number, bestFit: number) => void;
  onImprove?: (bestFit: number, best: number[]) => void;
  onDone?: (bestFit: number, best: number[]) => void;
}
export function sphere(x: number[]): number { return x.reduce((s, v) => s + v * v, 0); }
function makeRng(seed: number): () => number {
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}
export function differentialEvolution(
  dim: number, pop: number, iters: number, F: number, CR: number, lb: number, ub: number, seed = 59,
  hooks: DeHooks = {},
): { best: number[]; fit: number } {
  const rng = makeRng(seed);
  const X: number[][] = Array.from({ length: pop }, () =>
    Array.from({ length: dim }, () => lb + (ub - lb) * rng()));
  let fit: number[] = X.map((x) => sphere(x));
  let bi = fit.indexOf(Math.min(...fit));
  let best = [...X[bi]!]; let bestF = fit[bi]!;
  for (let it = 0; it < iters; it++) {
    for (let i = 0; i < pop; i++) {
      // 选 3 个互不相同的随机个体
      const idxs = [0,1,2].map(() => {
        let k = Math.floor(rng() * pop);
        while (k === i) k = Math.floor(rng() * pop);
        return k;
      });
      let r1 = idxs[0]!; let r2 = idxs[1]!; let r3 = idxs[2]!;
      while (r2 === r1 || r2 === i) r2 = Math.floor(rng() * pop);
      while (r3 === r1 || r3 === r2 || r3 === i) r3 = Math.floor(rng() * pop);
      const mutant = X[r1]!.map((v, d) => v + F * (X[r2]![d]! - X[r3]![d]!));
      // 二项交叉
      const jrand = Math.floor(rng() * dim);
      const u = X[i]!.map((v, d) => {
        if (d === jrand || rng() < CR) return Math.max(lb, Math.min(ub, mutant[d]!));
        return v;
      });
      const fu = sphere(u);
      if (fu < fit[i]!) { X[i] = u; fit[i] = fu; }
    }
    bi = fit.indexOf(Math.min(...fit));
    if (fit[bi]! < bestF) { bestF = fit[bi]!; best = [...X[bi]!]; hooks.onImprove?.(bestF, best); }
    hooks.onIter?.(it, bestF);
  }
  hooks.onDone?.(bestF, best);
  return { best, fit: bestF };
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { differentialEvolution } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'DE sphere 2D', en: 'DE sphere 2D' })
    .setBars(Array.from({length:10},(_,i)=>({value: 10-i, role:'default' as BarRole, label:'p'+i}))).commit();
  differentialEvolution(2, 10, 30, 0.7, 0.9, -5, 5, 59, {
    onIter: (it, bf) => rec.begin({ zh: \`iter \${it} best=\${bf.toFixed(3)}\`, en: \`iter \${it} best=\${bf.toFixed(3)}\` })
      .setBars(Array.from({length:10},()=>({value: Math.round(bf*100)/100, role:'swap' as BarRole})))
      .setAux([{ label: 'best', value: bf.toFixed(3), role: 'final' as BarRole }]).commit(),
    onDone: (bf, b) => rec.begin({ zh: '完成', en: 'done' })
      .setAux([{ label: 'pos', value: JSON.stringify(b.map((v)=>Math.round(v*100)/100)), role: 'final' as BarRole }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { differentialEvolution } from '../../src/algorithms/ai-search/ais-differential-evol/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-differential-evol/trace.ts';

test('DE 在 sphere 上收敛', () => {
  const r = differentialEvolution(2, 15, 40, 0.7, 0.9, -5, 5, 59);
  assert.ok(r.fit < 1, 'fit=' + r.fit);
});
test('DE 同种子可复现', () => {
  const a = differentialEvolution(2, 10, 20, 0.7, 0.9, -5, 5, 5);
  const b = differentialEvolution(2, 10, 20, 0.7, 0.9, -5, 5, 5);
  assert.deepEqual(a.best, b.best);
});
test('DE trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// ========================================================================
// 23. ais-grey-wolf
// ========================================================================
{
  id: 'ais-grey-wolf',
  titleZh: '灰狼优化', titleEn: 'Grey Wolf Optimizer',
  summaryZh: 'α、β、δ 三阶首领引导狼群包围猎物（Sphere 目标）。',
  summaryEn: 'α, β, δ leaders guide wolves to encircle prey (Sphere target).',
  descZh: '灰狼优化（Mirjalili 2014）：α、β、δ 是当前最优三个解；其余 ω 狼按三者平均位置更新。系数 A、C 随机以平衡探索与开发。本实现最小化 Sphere。',
  descEn: 'GWO (Mirjalili 2014): α, β, δ are the three best solutions; remaining ω wolves update using their average position. Random A, C balance exploration/exploitation. Minimizes Sphere.',
  tags: ['ai-search','swarm','optimization','gwo'],
  time: 'O(iter × wolves × d)', space: 'O(wolves × d)',
  impl: `// 灰狼优化 · 实现
export interface GwoHooks {
  onIter?: (iter: number, bestFit: number) => void;
  onImprove?: (bestFit: number, best: number[]) => void;
  onDone?: (bestFit: number, best: number[]) => void;
}
export function sphere(x: number[]): number { return x.reduce((s, v) => s + v * v, 0); }
function makeRng(seed: number): () => number {
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}
export function greyWolf(
  dim: number, n: number, iters: number, seed = 61,
  hooks: GwoHooks = {},
): { best: number[]; fit: number } {
  const rng = makeRng(seed);
  const X: number[][] = Array.from({ length: n }, () =>
    Array.from({ length: dim }, () => (rng() - 0.5) * 10));
  let F: number[] = X.map((x) => sphere(x));
  const order = [...Array(n).keys()].sort((a, b) => F[a]! - F[b]!);
  let alpha = [...X[order[0]!]!]; let beta = [...X[order[1]!]!]; let delta = [...X[order[2]!]!];
  let bestF = F[order[0]!]!;
  let best = [...alpha];
  for (let it = 0; it < iters; it++) {
    const a = 2 - 2 * (it / iters);
    for (let i = 0; i < n; i++) {
      const newP: number[] = [];
      for (let d = 0; d < dim; d++) {
        const A1 = 2 * a * rng() - a; const C1 = 2 * rng();
        const A2 = 2 * a * rng() - a; const C2 = 2 * rng();
        const A3 = 2 * a * rng() - a; const C3 = 2 * rng();
        const Dalpha = Math.abs(C1 * alpha[d]! - X[i]![d]!);
        const Dbeta = Math.abs(C2 * beta[d]! - X[i]![d]!);
        const Ddelta = Math.abs(C3 * delta[d]! - X[i]![d]!);
        const x1 = alpha[d]! - A1 * Dalpha;
        const x2 = beta[d]! - A2 * Dbeta;
        const x3 = delta[d]! - A3 * Ddelta;
        newP.push((x1 + x2 + x3) / 3);
      }
      X[i] = newP;
      F[i] = sphere(X[i]!);
    }
    const order2 = [...Array(n).keys()].sort((a, b) => F[a]! - F[b]!);
    alpha = [...X[order2[0]!]!];
    beta = [...X[order2[1]!]!];
    delta = [...X[order2[2]!]!];
    if (F[order2[0]!]! < bestF) { bestF = F[order2[0]!]!; best = [...alpha]; hooks.onImprove?.(bestF, best); }
    hooks.onIter?.(it, bestF);
  }
  hooks.onDone?.(bestF, best);
  return { best, fit: bestF };
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { greyWolf } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'GWO sphere 2D', en: 'GWO sphere 2D' })
    .setBars(Array.from({length:8},(_,i)=>({value: 8-i*0.7, role:'default' as BarRole, label:'w'+i}))).commit();
  greyWolf(2, 8, 30, 61, {
    onIter: (it, bf) => rec.begin({ zh: \`iter \${it} best=\${bf.toFixed(3)}\`, en: \`iter \${it} best=\${bf.toFixed(3)}\` })
      .setBars(Array.from({length:8},()=>({value: Math.round(bf*100)/100, role:'swap' as BarRole})))
      .setAux([{ label: 'best', value: bf.toFixed(3), role: 'final' as BarRole }]).commit(),
    onDone: (bf, b) => rec.begin({ zh: '完成', en: 'done' })
      .setAux([{ label: 'pos', value: JSON.stringify(b.map((v)=>Math.round(v*100)/100)), role: 'final' as BarRole }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greyWolf } from '../../src/algorithms/ai-search/ais-grey-wolf/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-grey-wolf/trace.ts';

test('GWO 在 sphere 上收敛', () => {
  const r = greyWolf(2, 12, 40, 61);
  assert.ok(r.fit < 1, 'fit=' + r.fit);
});
test('GWO 同种子可复现', () => {
  const a = greyWolf(2, 8, 20, 5);
  const b = greyWolf(2, 8, 20, 5);
  assert.deepEqual(a.best, b.best);
});
test('GWO trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// ========================================================================
// 24. ais-whale-opt
// ========================================================================
{
  id: 'ais-whale-opt',
  titleZh: '鲸鱼优化', titleEn: 'Whale Optimization Algorithm',
  summaryZh: '模拟座头鲸气泡网捕食：收缩包围与螺旋更新切换。',
  summaryEn: 'Mimics humpback bubble-net feeding: shrink-encircling and spiral update switch.',
  descZh: '鲸鱼优化算法（Mirjalili & Lewis 2016）：以 0.5 概率选收缩包围（朝最佳鲸靠近）或螺旋更新。|A|>1 时随机探索。本实现最小化 Sphere。',
  descEn: 'WOA (Mirjalili & Lewis 2016): with probability 0.5 use shrink-encircling (move toward best whale) or spiral update. When |A|>1 random exploration. Minimizes Sphere.',
  tags: ['ai-search','swarm','optimization','woa'],
  time: 'O(iter × whales × d)', space: 'O(whales × d)',
  impl: `// 鲸鱼优化算法 · 实现
export interface WoaHooks {
  onIter?: (iter: number, bestFit: number) => void;
  onImprove?: (bestFit: number, best: number[]) => void;
  onDone?: (bestFit: number, best: number[]) => void;
}
export function sphere(x: number[]): number { return x.reduce((s, v) => s + v * v, 0); }
function makeRng(seed: number): () => number {
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}
export function whaleOpt(
  dim: number, n: number, iters: number, b: number, seed = 67,
  hooks: WoaHooks = {},
): { best: number[]; fit: number } {
  const rng = makeRng(seed);
  const X: number[][] = Array.from({ length: n }, () =>
    Array.from({ length: dim }, () => (rng() - 0.5) * 10));
  let F: number[] = X.map((x) => sphere(x));
  let bi = F.indexOf(Math.min(...F));
  let best = [...X[bi]!]; let bestF = F[bi]!;
  for (let it = 0; it < iters; it++) {
    const a = 2 - 2 * (it / iters);
    for (let i = 0; i < n; i++) {
      const A = 2 * a * rng() - a;
      const C = 2 * rng();
      const p = rng();
      const cand = [...X[i]!];
      if (p < 0.5) {
        if (Math.abs(A) < 1) {
          // 收缩包围
          for (let d = 0; d < dim; d++) {
            const D = Math.abs(C * best[d]! - X[i]![d]!);
            cand[d] = best[d]! - A * D;
          }
        } else {
          // 随机探索
          const xr = X[Math.floor(rng() * n)]!;
          for (let d = 0; d < dim; d++) {
            const D = Math.abs(C * xr[d]! - X[i]![d]!);
            cand[d] = xr[d]! - A * D;
          }
        }
      } else {
        // 螺旋更新
        let D2 = 0;
        for (let d = 0; d < dim; d++) D2 += (best[d]! - X[i]![d]!) ** 2;
        const l = (rng() - 0.5) * 2;
        for (let d = 0; d < dim; d++) {
          cand[d] = D2 * Math.exp(b * l) * Math.cos(2 * Math.PI * l) + best[d]!;
        }
      }
      X[i] = cand;
      F[i] = sphere(X[i]!);
    }
    bi = F.indexOf(Math.min(...F));
    if (F[bi]! < bestF) { bestF = F[bi]!; best = [...X[bi]!]; hooks.onImprove?.(bestF, best); }
    hooks.onIter?.(it, bestF);
  }
  hooks.onDone?.(bestF, best);
  return { best, fit: bestF };
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { whaleOpt } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'WOA sphere 2D', en: 'WOA sphere 2D' })
    .setBars(Array.from({length:8},(_,i)=>({value: 8-i*0.7, role:'default' as BarRole, label:'w'+i}))).commit();
  whaleOpt(2, 8, 30, 1, 67, {
    onIter: (it, bf) => rec.begin({ zh: \`iter \${it} best=\${bf.toFixed(3)}\`, en: \`iter \${it} best=\${bf.toFixed(3)}\` })
      .setBars(Array.from({length:8},()=>({value: Math.round(bf*100)/100, role:'swap' as BarRole})))
      .setAux([{ label: 'best', value: bf.toFixed(3), role: 'final' as BarRole }]).commit(),
    onDone: (bf, b) => rec.begin({ zh: '完成', en: 'done' })
      .setAux([{ label: 'pos', value: JSON.stringify(b.map((v)=>Math.round(v*100)/100)), role: 'final' as BarRole }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { whaleOpt } from '../../src/algorithms/ai-search/ais-whale-opt/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-whale-opt/trace.ts';

test('WOA 在 sphere 上收敛', () => {
  const r = whaleOpt(2, 12, 40, 1, 67);
  assert.ok(r.fit < 5, 'fit=' + r.fit);
});
test('WOA 同种子可复现', () => {
  const a = whaleOpt(2, 8, 20, 1, 5);
  const b = whaleOpt(2, 8, 20, 1, 5);
  assert.deepEqual(a.best, b.best);
});
test('WOA trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

// ========================================================================
// 25. ais-moth-flame
// ========================================================================
{
  id: 'ais-moth-flame',
  titleZh: '飞蛾扑火', titleEn: 'Moth-Flame Optimization',
  summaryZh: '飞蛾横向绕火焰螺旋飞行，火焰数随代递减。',
  summaryEn: 'Moths spiral transversely around flames; flame count decreases over generations.',
  descZh: '飞蛾扑火优化（Mirjalili 2015）：飞蛾按螺旋公式更新 M_i = D_i·e^{bt}·cos(2πt) + F_j。火焰数火焰每代线性递减，平衡探索与开发。本实现最小化 Sphere。',
  descEn: 'MFO (Mirjalili 2015): moths update by M_i = D_i·e^{bt}·cos(2πt) + F_j. Flame count decreases linearly per generation to balance exploration/exploitation. Minimizes Sphere.',
  tags: ['ai-search','swarm','optimization','moth-flame'],
  time: 'O(iter × moths × d)', space: 'O(moths × d)',
  impl: `// 飞蛾扑火优化 · 实现
export interface MfoHooks {
  onIter?: (iter: number, bestFit: number, flameN: number) => void;
  onImprove?: (bestFit: number, best: number[]) => void;
  onDone?: (bestFit: number, best: number[]) => void;
}
export function sphere(x: number[]): number { return x.reduce((s, v) => s + v * v, 0); }
function makeRng(seed: number): () => number {
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}
export function mothFlame(
  dim: number, n: number, iters: number, b: number, seed = 71,
  hooks: MfoHooks = {},
): { best: number[]; fit: number } {
  const rng = makeRng(seed);
  const M: number[][] = Array.from({ length: n }, () =>
    Array.from({ length: dim }, () => (rng() - 0.5) * 10));
  let best: number[] = [...M[0]!];
  let bestF = sphere(best);
  for (let it = 0; it < iters; it++) {
    const flameN = Math.max(1, Math.round(n - it * (n - 1) / iters));
    // 排序得到当前火焰（最优 flameN 个飞蛾）
    const F = M.map((x, i) => ({ x: [...x], f: sphere(x), i }))
      .sort((a, b) => a.f - b.f).slice(0, flameN);
    const a = -1 + it * (-1 / iters); // -1 → 0
    for (let i = 0; i < n; i++) {
      const fj = F[Math.min(i, flameN - 1)]!;
      const t = (a + 1) * rng() + a; // [-1, 1]
      for (let d = 0; d < dim; d++) {
        const D = Math.abs(fj.x[d]! - M[i]![d]!);
        M[i]![d] = D * Math.exp(b * t) * Math.cos(2 * Math.PI * t) + fj.x[d]!;
      }
      const f = sphere(M[i]!);
      if (f < bestF) { bestF = f; best = [...M[i]!]; hooks.onImprove?.(bestF, best); }
    }
    hooks.onIter?.(it, bestF, flameN);
  }
  hooks.onDone?.(bestF, best);
  return { best, fit: bestF };
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { mothFlame } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'MFO sphere 2D', en: 'MFO sphere 2D' })
    .setBars(Array.from({length:8},(_,i)=>({value: 8-i*0.7, role:'default' as BarRole, label:'m'+i}))).commit();
  mothFlame(2, 8, 30, 1, 71, {
    onIter: (it, bf, fn) => rec.begin({ zh: \`iter \${it} best=\${bf.toFixed(3)} flame=\${fn}\`, en: \`iter \${it} best=\${bf.toFixed(3)} flame=\${fn}\` })
      .setBars(Array.from({length:8},()=>({value: Math.round(bf*100)/100, role:'swap' as BarRole})))
      .setAux([{ label: 'best', value: bf.toFixed(3), role: 'final' as BarRole }, { label: 'flame', value: String(fn), role: 'compare' as BarRole }]).commit(),
    onDone: (bf, b) => rec.begin({ zh: '完成', en: 'done' })
      .setAux([{ label: 'pos', value: JSON.stringify(b.map((v)=>Math.round(v*100)/100)), role: 'final' as BarRole }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mothFlame } from '../../src/algorithms/ai-search/ais-moth-flame/impl.ts';
import { buildTrace } from '../../src/algorithms/ai-search/ais-moth-flame/trace.ts';

test('MFO 在 sphere 上改进', () => {
  const r = mothFlame(2, 12, 40, 1, 71);
  assert.ok(r.fit < 10, 'fit=' + r.fit);
});
test('MFO 同种子可复现', () => {
  const a = mothFlame(2, 8, 20, 1, 5);
  const b = mothFlame(2, 8, 20, 1, 5);
  assert.deepEqual(a.best, b.best);
});
test('MFO trace 非空', () => assert.ok(buildTrace().length > 0));
`,
},

];
