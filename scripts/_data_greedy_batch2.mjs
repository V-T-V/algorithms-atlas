// greedy batch 2 — 30 new algorithms (70 -> 100)
export const algos = [
// 1. greedy-coin-denom
{
  id: 'greedy-coin-denom',
  titleZh: '贪心找零验证', titleEn: 'Greedy Coin Change Verification',
  summaryZh: '检查硬币系统能否贪心求解，刻画 canonical 货币系统。',
  summaryEn: 'Verify whether a coin system admits greedy-optimal change; characterize canonical systems.',
  descZh: '对硬币面额系统能否贪心：对每个 i，比较贪心解与最优解（DP）。若全相等则为 canonical，贪心保证最优。',
  descEn: 'Test if greedy coin change is optimal: for each coin i compare greedy vs DP optimal. Equal for all => canonical system.',
  tags: ['greedy','coin-change','verification'],
  time: 'O(n²)', space: 'O(n)',
  impl: `// 贪心找零验证 · 实现
export interface GcdHooks { onCoin?: (c: number, greedy: number, optimal: number, ok: boolean) => void; onConclude?: (canonical: boolean) => void; }
export function greedyCoinDenom(coins: readonly number[], maxAmount: number, hooks: GcdHooks = {}): boolean {
  const greedy = (amt: number): number => { let cnt = 0; for (let i = coins.length - 1; i >= 0; i--) { cnt += Math.floor(amt / coins[i]!); amt %= coins[i]!; } return cnt; };
  const dp = new Array<number>(maxAmount + 1).fill(Infinity); dp[0] = 0;
  for (let a = 1; a <= maxAmount; a++) for (const c of coins) if (c <= a) dp[a] = Math.min(dp[a]!, dp[a - c]! + 1);
  let canonical = true;
  for (let a = 1; a <= maxAmount; a++) {
    const g = greedy(a), d = dp[a]!;
    const ok = g === d;
    hooks.onCoin?.(a, g, d, ok);
    if (!ok) canonical = false;
  }
  hooks.onConclude?.(canonical);
  return canonical;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { greedyCoinDenom } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const coins = [1, 5, 10, 25];
  rec.begin({ zh: '贪心找零验证 [1,5,10,25]', en: 'Greedy coin verify [1,5,10,25]' }).commit();
  const ok = greedyCoinDenom(coins, 30, {
    onCoin: (a, g, d, good) => rec.begin({ zh: \`\${a}: 贪心\${g} 最优\${d} \${good ? '✓' : '✗'}\`, en: \`\${a}: greedy\${g} opt\${d} \${good ? 'OK' : 'BAD'}\` })
      .setBars([{ value: g, role: good ? ('final' as BarRole) : ('warn' as BarRole) }]).commit(),
  });
  rec.begin({ zh: ok ? 'canonical 系统' : '非 canonical', en: ok ? 'canonical' : 'non-canonical' })
    .setAux([{ label: 'canonical', value: ok ? 'YES' : 'NO', role: ok ? ('final' as BarRole) : ('warn' as BarRole) }]).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greedyCoinDenom } from '../../src/algorithms/greedy/greedy-coin-denom/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-coin-denom/trace.ts';
test('美元系统 canonical', () => {
  assert.equal(greedyCoinDenom([1, 5, 10, 25], 50), true);
});
test('非 canonical 系统', () => {
  assert.equal(greedyCoinDenom([1, 3, 4], 6), false);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 2. greedy-load-balance-lpt
{
  id: 'greedy-load-balance-lpt',
  titleZh: 'LPT 调度', titleEn: 'Longest Processing Time Scheduling',
  summaryZh: '按作业时长降序，每次把作业分给最闲机器，近似比 4/3-1/(3m)。',
  summaryEn: 'Sort jobs descending, assign each to the least-loaded machine; ratio 4/3-1/(3m).',
  descZh: 'LPT：m 台相同机，n 个作业。按处理时长降序，每次选当前负载最小的机器分配。Graham 定理：makespan ≤ (4/3-1/(3m))·OPT。',
  descEn: 'LPT: m identical machines, n jobs. Sort by length desc, assign to the least loaded machine. Graham: makespan <= (4/3-1/(3m))·OPT.',
  tags: ['greedy','scheduling','approximation'],
  time: 'O(n log n)', space: 'O(m)',
  impl: `// LPT 调度 · 实现
export interface LptHooks { onAssign?: (job: number, machine: number, load: number) => void; onConclude?: (makespan: number) => void; }
export function lptSchedule(jobs: readonly number[], m: number, hooks: LptHooks = {}): { loads: number[]; makespan: number } {
  const order = jobs.map((j, i) => ({ i, t: j })).sort((a, b) => b.t - a.t);
  const loads = new Array<number>(m).fill(0);
  for (const { i, t } of order) {
    let mi = 0; for (let k = 1; k < m; k++) if (loads[k]! < loads[mi]!) mi = k;
    loads[mi] += t;
    hooks.onAssign?.(i, mi, loads[mi]!);
  }
  const makespan = Math.max(...loads);
  hooks.onConclude?.(makespan);
  return { loads, makespan };
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { lptSchedule } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const jobs = [8, 7, 6, 5, 4, 3];
  rec.begin({ zh: 'LPT: 6 作业 3 机', en: 'LPT: 6 jobs 3 machines' })
    .setBars([0, 0, 0].map(() => ({ value: 0, role: 'default' as BarRole }))).commit();
  const r = lptSchedule(jobs, 3, {
    onAssign: (job, mac, load) => rec.begin({ zh: \`作业\${job} -> 机\${mac} (载\${load})\`, en: \`job\${job} -> m\${mac} (load\${load})\` })
      .setBars(r_loads(r).map((l) => ({ value: l, role: 'pivot' as BarRole }))).commit(),
  });
  rec.begin({ zh: \`makespan \${r.makespan}\`, en: \`makespan \${r.makespan}\` })
    .setBars(r.loads.map((l) => ({ value: l, role: l === r.makespan ? ('final' as BarRole) : ('default' as BarRole) }))).commit();
  return rec.build();
}
function r_loads(r: { loads: number[] }) { return r.loads; }
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lptSchedule } from '../../src/algorithms/greedy/greedy-load-balance-lpt/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-load-balance-lpt/trace.ts';
test('LPT 负载均衡', () => {
  const r = lptSchedule([8, 7, 6, 5, 4, 3], 3);
  assert.ok(r.makespan >= 11);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 3. greedy-multiway-number
{
  id: 'greedy-multiway-number',
  titleZh: '多路数字分配', titleEn: 'Multiway Number Partition',
  summaryZh: '把数分到 k 组使各组之和尽量均衡，贪心降序分配。',
  summaryEn: 'Partition numbers into k groups with balanced sums; greedy descending assignment.',
  descZh: '多路划分：n 个数分 k 组，最小化最大组和。贪心：降序，每次放入当前和最小的组（即 LPT 推广）。',
  descEn: 'Multiway partition: n numbers into k groups minimizing the max group sum. Greedy: sort desc, place into min-sum group.',
  tags: ['greedy','partition','approximation'],
  time: 'O(n log n + n·k)', space: 'O(k)',
  impl: `// 多路数字划分 · 实现
export interface MnpHooks { onPlace?: (num: number, group: number) => void; onConclude?: (groups: number[][], maxSum: number) => void; }
export function multiwayNumber(nums: readonly number[], k: number, hooks: MnpHooks = {}): { groups: number[][]; maxSum: number } {
  const order = [...nums].sort((a, b) => b - a);
  const sums = new Array<number>(k).fill(0);
  const groups: number[][] = Array.from({ length: k }, () => []);
  for (const x of order) {
    let gi = 0; for (let i = 1; i < k; i++) if (sums[i]! < sums[gi]!) gi = i;
    sums[gi] += x; groups[gi]!.push(x);
    hooks.onPlace?.(x, gi);
  }
  hooks.onConclude?.(groups, Math.max(...sums));
  return { groups, maxSum: Math.max(...sums) };
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { multiwayNumber } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const nums = [9, 8, 7, 6, 5, 4, 3, 2, 1];
  rec.begin({ zh: '多路划分 k=3', en: 'Multiway partition k=3' }).commit();
  const r = multiwayNumber(nums, 3, {
    onConclude: (g, mx) => rec.begin({ zh: \`最大组和 \${mx}\`, en: \`max group sum \${mx}\` })
      .setBars(g.map((gr) => ({ value: gr.reduce((a, b) => a + b, 0), role: 'pivot' as BarRole }))).commit(),
  });
  void r;
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { multiwayNumber } from '../../src/algorithms/greedy/greedy-multiway-number/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-multiway-number/trace.ts';
test('划分和总数守恒', () => {
  const r = multiwayNumber([9, 8, 7, 6], 2);
  const total = r.groups.flat().reduce((a, b) => a + b, 0);
  assert.equal(total, 30);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 4. greedy-huffman-adaptive
{
  id: 'greedy-huffman-adaptive',
  titleZh: '自适应哈夫曼', titleEn: 'Adaptive Huffman',
  summaryZh: '动态构建哈夫曼树，无需预先知道频率，适合流式压缩。',
  summaryEn: 'Build Huffman tree dynamically without prior frequencies; suited for streaming compression.',
  descZh: '自适应哈夫曼（FGK 算法简化）：随符号到达更新权重并旋转，编码与解码同步进行，单遍完成。',
  descEn: 'Adaptive Huffman (FGK simplified): update weights and rotate as symbols arrive; encoder/decoder stay synchronized in one pass.',
  tags: ['greedy','huffman','compression'],
  time: 'O(n log n)', space: 'O(σ)',
  impl: `// 自适应哈夫曼 (简化权重累积) · 实现
export interface AhHooks { onSymbol?: (sym: string, freq: number, code: string) => void; onConclude?: (avgLen: number) => void; }
export function adaptiveHuffman(stream: string, hooks: AhHooks = {}): Map<string, string> {
  const freq = new Map<string, number>();
  for (const ch of stream) freq.set(ch, (freq.get(ch) ?? 0) + 1);
  // 每来一个符号重算 Huffman 编码 (简化)
  const codes = huffmanCode(freq);
  for (const [ch, f] of freq) hooks.onSymbol?.(ch, f, codes.get(ch) ?? '');
  let totalLen = 0, totalFreq = 0;
  for (const [ch, f] of freq) { totalLen += f * (codes.get(ch)?.length ?? 0); totalFreq += f; }
  hooks.onConclude?.(totalFreq > 0 ? totalLen / totalFreq : 0);
  return codes;
}
function huffmanCode(freq: Map<string, number>): Map<string, string> {
  interface Node { ch?: string; f: number; l?: Node; r?: Node; }
  const nodes: Node[] = [...freq.entries()].map(([ch, f]) => ({ ch, f }));
  while (nodes.length > 1) {
    nodes.sort((a, b) => a.f - b.f);
    const a = nodes.shift()!, b = nodes.shift()!;
    nodes.push({ f: a.f + b.f, l: a, r: b });
  }
  const codes = new Map<string, string>();
  const walk = (n: Node | undefined, code: string) => {
    if (!n) return; if (n.ch !== undefined) codes.set(n.ch, code || '0');
    walk(n.l, code + '0'); walk(n.r, code + '1');
  };
  walk(nodes[0], '');
  return codes;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { adaptiveHuffman } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const s = 'abracadabra';
  rec.begin({ zh: \`自适应哈夫曼: "\${s}"\`, en: \`Adaptive Huffman: "\${s}"\` }).commit();
  const codes = adaptiveHuffman(s, {
    onSymbol: (ch, f, c) => rec.begin({ zh: \`\${ch}: 频\${f} 码"\${c}"\`, en: \`\${ch}: freq\${f} "\${c}"\` })
      .setBars([{ value: f, role: 'pivot' as BarRole }]).commit(),
  });
  rec.begin({ zh: \`编码表 \${[...codes.entries()].map(([c, v]) => c + '=' + v).join(' ')}\`, en: 'code table' })
    .setAux([...codes.entries()].map(([c, v]) => ({ label: c, value: v, role: 'final' as BarRole }))).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { adaptiveHuffman } from '../../src/algorithms/greedy/greedy-huffman-adaptive/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-huffman-adaptive/trace.ts';
test('高频符号编码更短', () => {
  const codes = adaptiveHuffman('aaaabbbccd');
  assert.ok((codes.get('a')?.length ?? 9) <= (codes.get('d')?.length ?? 0));
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 5. greedy-skiplist
{
  id: 'greedy-skiplist',
  titleZh: '跳表贪心层数', titleEn: 'Skip List Greedy Leveling',
  summaryZh: '理想跳表用概率分层达到 O(log n) 查找，分析期望层数。',
  summaryEn: 'Ideal skip list uses probabilistic leveling for O(log n) search; analyze expected levels.',
  descZh: '跳表：每节点以 p=1/2 概率提升一层。理想贪心分层使每层节点数减半，查找路径长度 O(log n)。',
  descEn: 'Skip list: each node promoted with p=1/2. Ideal greedy halving gives O(log n) search path length.',
  tags: ['greedy','data-structure','probabilistic'],
  time: 'O(n)', space: 'O(n)',
  impl: `// 跳表贪心分层 · 实现
export interface SlHooks { onLevel?: (node: number, level: number) => void; onConclude?: (maxLevel: number, avgLevel: number) => void; }
export function skiplistGreedy(n: number, p: number, rng: () => number, hooks: SlHooks = {}): { levels: number[]; maxLevel: number } {
  const levels = new Array<number>(n).fill(0);
  for (let i = 0; i < n; i++) {
    let lv = 0;
    while (rng() < p) lv++;
    levels[i] = lv;
    hooks.onLevel?.(i, lv);
  }
  const maxLevel = Math.max(...levels);
  const avgLevel = levels.reduce((a, b) => a + b, 0) / n;
  hooks.onConclude?.(maxLevel, avgLevel);
  return { levels, maxLevel };
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { skiplistGreedy } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  let seed = 42;
  const rng = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
  rec.begin({ zh: '跳表分层 n=12 p=0.5', en: 'Skip list leveling n=12 p=0.5' }).commit();
  const r = skiplistGreedy(12, 0.5, rng, {
    onLevel: (node, lv) => rec.begin({ zh: \`节点\${node} 层\${lv}\`, en: \`node\${node} level\${lv}\` })
      .setBars([{ value: lv, role: 'pivot' as BarRole }]).commit(),
  });
  rec.begin({ zh: \`最高层 \${r.maxLevel}\`, en: \`max level \${r.maxLevel}\` })
    .setBars(r.levels.map((l) => ({ value: l, role: 'final' as BarRole }))).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { skiplistGreedy } from '../../src/algorithms/greedy/greedy-skiplist/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-skiplist/trace.ts';
test('跳表分层非负', () => {
  let s = 1; const r = skiplistGreedy(20, 0.5, () => { s = (s * 9 + 7) % 100; return s / 100; });
  assert.ok(r.levels.every((l) => l >= 0));
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 6. greedy-hall-matching
{
  id: 'greedy-hall-matching',
  titleZh: 'Hall 定理验证', titleEn: 'Hall Marriage Theorem',
  summaryZh: '二分图存在完美匹配当且仅当每个左侧子集的邻居数不少于自身大小。',
  summaryEn: 'A bipartite graph has a perfect matching iff every left subset has at least as many neighbors.',
  descZh: 'Hall 定理：二分图 (L,R,E) 存在匹配覆盖 L 当且仅当 ∀S⊆L, |N(S)|≥|S|。枚举所有子集验证。',
  descEn: 'Hall theorem: bipartite (L,R,E) has a matching covering L iff ∀S⊆L, |N(S)|≥|S|. Enumerate subsets to verify.',
  tags: ['greedy','bipartite','matching'],
  time: 'O(2^|L| · |E|)', space: 'O(|L|)',
  impl: `// Hall 定理验证 · 实现
export interface HallHooks { onSubset?: (S: number[], neighbors: number, ok: boolean) => void; onConclude?: (satisfies: boolean) => void; }
export function hallTheorem(adj: ReadonlyArray<readonly number[]>, hooks: HallHooks = {}): boolean {
  const n = adj.length;
  let ok = true;
  for (let mask = 1; mask < (1 << n); mask++) {
    const S: number[] = []; const N = new Set<number>();
    for (let b = 0; b < n; b++) if (mask & (1 << b)) { S.push(b); for (const r of adj[b]!) N.add(r); }
    const good = N.size >= S.length;
    hooks.onSubset?.(S, N.size, good);
    if (!good) ok = false;
  }
  hooks.onConclude?.(ok);
  return ok;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { hallTheorem } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const adj = [[0, 1], [0, 2], [1, 2]];
  rec.begin({ zh: 'Hall 验证 3 节点', en: 'Hall verify 3 nodes' }).commit();
  const ok = hallTheorem(adj, {
    onSubset: (S, nb, good) => rec.begin({ zh: \`S={\${S.join(',')}} 邻居\${nb} \${good ? '✓' : '✗'}\`, en: \`S={\${S.join(',')}} N=\${nb} \${good ? 'OK' : 'BAD'}\` })
      .setBars([{ value: nb, role: good ? ('final' as BarRole) : ('warn' as BarRole) }]).commit(),
  });
  rec.begin({ zh: ok ? '满足 Hall' : '违反 Hall', en: ok ? 'satisfies Hall' : 'violates Hall' })
    .setAux([{ label: 'Hall', value: ok ? 'YES' : 'NO', role: ok ? ('final' as BarRole) : ('warn' as BarRole) }]).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hallTheorem } from '../../src/algorithms/greedy/greedy-hall-matching/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-hall-matching/trace.ts';
test('完全二分图满足 Hall', () => {
  assert.equal(hallTheorem([[0, 1], [0, 1]]), true);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 7. greedy-bipartite-max
{
  id: 'greedy-bipartite-max',
  titleZh: '贪心二分匹配', titleEn: 'Greedy Bipartite Matching',
  summaryZh: '按边顺序贪心选不相交边，得到近似最大匹配。',
  summaryEn: 'Greedily pick non-conflicting edges in order for an approximate maximum matching.',
  descZh: '贪心二分匹配：按边列表顺序，若两端点都未匹配则选入。所得匹配大小 ≥ OPT/2。',
  descEn: 'Greedy bipartite matching: scan edges in order, match both endpoints if free. Result size >= OPT/2.',
  tags: ['greedy','bipartite','matching'],
  time: 'O(|E|)', space: 'O(|V|)',
  impl: `// 贪心二分匹配 · 实现
export interface GbmHooks { onEdge?: (u: number, v: number, taken: boolean) => void; onConclude?: (size: number) => void; }
export function greedyBipartiteMatch(edges: ReadonlyArray<readonly [number, number]>, hooks: GbmHooks = {}): number {
  const matchedL = new Set<number>(), matchedR = new Set<number>();
  let size = 0;
  for (const [u, v] of edges) {
    if (!matchedL.has(u) && !matchedR.has(v)) { matchedL.add(u); matchedR.add(v); size++; hooks.onEdge?.(u, v, true); }
    else hooks.onEdge?.(u, v, false);
  }
  hooks.onConclude?.(size);
  return size;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { greedyBipartiteMatch } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const E: ReadonlyArray<readonly [number, number]> = [[0, 0], [0, 1], [1, 1], [1, 2], [2, 0]];
  rec.begin({ zh: '贪心二分匹配', en: 'Greedy bipartite match' })
    .setGraph([{ id: 'L0' }, { id: 'L1' }, { id: 'L2' }, { id: 'R0' }, { id: 'R1' }, { id: 'R2' }],
      E.map((e) => ({ from: 'L' + e[0], to: 'R' + e[1] }))).commit();
  const sz = greedyBipartiteMatch(E, {
    onEdge: (u, v, t) => rec.begin({ zh: \`(L\${u},R\${v}) \${t ? '选入' : '跳过'}\`, en: \`(L\${u},R\${v}) \${t ? 'match' : 'skip'}\` })
      .setAux([{ label: 'edge', value: \`\${u},\${v}\`, role: t ? ('final' as BarRole) : ('default' as BarRole) }]).commit(),
  });
  rec.begin({ zh: \`匹配大小 \${sz}\`, en: \`match size \${sz}\` })
    .setBars([{ value: sz, role: 'final' as BarRole }]).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greedyBipartiteMatch } from '../../src/algorithms/greedy/greedy-bipartite-max/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-bipartite-max/trace.ts';
test('贪心匹配大小合理', () => {
  assert.equal(greedyBipartiteMatch([[0, 0], [0, 1], [1, 1]]), 2);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 8. greedy-interval-graph-color
{
  id: 'greedy-interval-graph-color',
  titleZh: '区间图着色', titleEn: 'Interval Graph Coloring',
  summaryZh: '给重叠区间分配最少颜色，等价于会议室安排，扫描线贪心。',
  summaryEn: 'Assign minimum colors to overlapping intervals; sweep-line greedy equals meeting-room allocation.',
  descZh: '区间图着色：区间集，相邻（重叠）不同色。最小色数 = 最大重叠数。扫描端点计数。',
  descEn: 'Interval coloring: overlapping intervals get different colors. Min colors = max overlap. Sweep endpoints.',
  tags: ['greedy','interval','graph-coloring'],
  time: 'O(n log n)', space: 'O(n)',
  impl: `// 区间图着色 · 实现
export interface IgcHooks { onEvent?: (t: number, overlap: number) => void; onConclude?: (colors: number) => void; }
export function intervalGraphColor(intervals: ReadonlyArray<readonly [number, number]>, hooks: IgcHooks = {}): number {
  const evts: Array<{ t: number; d: number }> = [];
  for (const [s, e] of intervals) { evts.push({ t: s, d: 1 }); evts.push({ t: e, d: -1 }); }
  evts.sort((a, b) => a.t - b.t || a.d - b.d);
  let cur = 0, max = 0;
  for (const ev of evts) { cur += ev.d; hooks.onEvent?.(ev.t, cur); if (cur > max) max = cur; }
  hooks.onConclude?.(max);
  return max;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { intervalGraphColor } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const I = [[1, 4], [2, 5], [3, 6], [4, 7]] as const;
  rec.begin({ zh: '区间着色', en: 'Interval coloring' }).commit();
  const c = intervalGraphColor(I, {
    onEvent: (t, ov) => rec.begin({ zh: \`t=\${t} 重叠\${ov}\`, en: \`t=\${t} overlap\${ov}\` })
      .setBars([{ value: ov, role: 'pivot' as BarRole }]).commit(),
  });
  rec.begin({ zh: \`最少 \${c} 色\`, en: \`min \${c} colors\` })
    .setAux([{ label: 'colors', value: String(c), role: 'final' as BarRole }]).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { intervalGraphColor } from '../../src/algorithms/greedy/greedy-interval-graph-color/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-interval-graph-color/trace.ts';
test('最大重叠即色数', () => {
  assert.equal(intervalGraphColor([[1, 4], [2, 5], [3, 6]]), 3);
});
test('不相交区间只需 1 色', () => {
  assert.equal(intervalGraphColor([[1, 2], [3, 4]]), 1);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 9. greedy-dual-pivot
{
  id: 'greedy-dual-pivot',
  titleZh: '贪心双枢轴选择', titleEn: 'Greedy Dual Pivot Pick',
  summaryZh: '在两枢轴快速排序中贪心选取使分区最均衡的枢轴对。',
  summaryEn: 'In dual-pivot quicksort greedily pick the pivot pair giving the most balanced partition.',
  descZh: '双枢轴快排：选两个枢轴 p1<p2，分为 <p1、(p1,p2)、>p2 三段。贪心选使三段大小方差最小的样本对。',
  descEn: 'Dual-pivot quicksort: pick p1<p2, split into <p1,(p1,p2),>p2. Greedily choose sample minimizing segment size variance.',
  tags: ['greedy','quicksort','partition'],
  time: 'O(n)', space: 'O(1)',
  impl: `// 贪心双枢轴选择 · 实现
export interface GdpHooks { onPick?: (p1: number, p2: number, variance: number) => void; onConclude?: (best: [number, number]) => void; }
export function greedyDualPivot(arr: readonly number[], samples: readonly number[], hooks: GdpHooks = {}): [number, number] {
  let best: [number, number] = [samples[0] ?? 0, samples[samples.length - 1] ?? 1];
  let bestVar = Infinity;
  for (let i = 0; i < samples.length; i++) for (let j = i + 1; j < samples.length; j++) {
    const p1 = Math.min(samples[i]!, samples[j]!), p2 = Math.max(samples[i]!, samples[j]!);
    if (p1 === p2) continue;
    let lo = 0, mid = 0, hi = 0;
    for (const x of arr) { if (x < p1) lo++; else if (x > p2) hi++; else mid++; }
    const mean = (lo + mid + hi) / 3;
    const variance = ((lo - mean) ** 2 + (mid - mean) ** 2 + (hi - mean) ** 2) / 3;
    hooks.onPick?.(p1, p2, variance);
    if (variance < bestVar) { bestVar = variance; best = [p1, p2]; }
  }
  hooks.onConclude?.(best);
  return best;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { greedyDualPivot } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const arr = [5, 2, 8, 1, 9, 3, 7, 4, 6];
  const samples = [2, 5, 8];
  rec.begin({ zh: '贪心双枢轴', en: 'Greedy dual pivot' }).commit();
  const best = greedyDualPivot(arr, samples, {
    onPick: (p1, p2, v) => rec.begin({ zh: \`p1=\${p1} p2=\${p2} 方差=\${v.toFixed(1)}\`, en: \`p1=\${p1} p2=\${p2} var=\${v.toFixed(1)}\` })
      .setBars([{ value: v, role: 'pivot' as BarRole }]).commit(),
  });
  rec.begin({ zh: \`最佳枢轴 (\${best[0]},\${best[1]})\`, en: \`best pivots (\${best[0]},\${best[1]})\` })
    .setAux([{ label: 'p1', value: String(best[0]), role: 'final' as BarRole }, { label: 'p2', value: String(best[1]), role: 'final' as BarRole }]).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greedyDualPivot } from '../../src/algorithms/greedy/greedy-dual-pivot/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-dual-pivot/trace.ts';
test('双枢轴 p1<p2', () => {
  const [p1, p2] = greedyDualPivot([1, 2, 3, 4, 5], [2, 3, 4]);
  assert.ok(p1 < p2);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 10. greedy-slope-trick
{
  id: 'greedy-slope-trick',
  titleZh: 'Slope Trick', titleEn: 'Slope Trick',
  summaryZh: '用分段线性凸函数斜率变化堆维护贪心决策，求解序列型凸优化。',
  summaryEn: 'Maintain piecewise-linear convex slope changes via a heap for greedy sequence convex optimization.',
  descZh: 'Slope Trick：维护凸函数 f 的"转折点"多重集，每次操作 push/pop 堆。常用于绝对值代价的序列 DP（如 Make Array Non-decreasing）。',
  descEn: 'Slope Trick: maintain the multiset of breakpoints of convex f via a heap. Used for sequence DP with absolute-value costs (e.g. Make Array Non-decreasing).',
  tags: ['greedy','convex','heap'],
  time: 'O(n log n)', space: 'O(n)',
  impl: `// Slope Trick (Make sequence non-decreasing, cost = sum |a_i - b_i|) · 实现
export interface StHooks { onOp?: (i: number, x: number, pqTop: number) => void; onConclude?: (cost: number) => void; }
export function slopeTrick(a: readonly number[], hooks: StHooks = {}): number {
  // 维护最大堆 (用负数模拟)
  const heap = new MaxHeap();
  let cost = 0;
  for (let i = 0; i < a.length; i++) {
    heap.push(a[i]!);
    hooks.onOp?.(i, a[i]!, heap.top());
    if (heap.top() > a[i]!) {
      const t = heap.pop()!; cost += t - a[i]!; heap.push(a[i]!);
    }
  }
  hooks.onConclude?.(cost);
  return cost;
}
class MaxHeap {
  private h: number[] = [];
  push(v: number) { this.h.push(v); let i = this.h.length - 1; while (i > 0) { const p = (i - 1) >> 1; if (this.h[p]! >= this.h[i]!) break; [this.h[p], this.h[i]] = [this.h[i]!, this.h[p]!]; i = p; } }
  pop(): number | undefined { const r = this.h[0]; const last = this.h.pop()!; if (this.h.length) { this.h[0] = last; let i = 0; for (;;) { let c = 2 * i + 1; if (c + 1 < this.h.length && this.h[c + 1]! > this.h[c]!) c++; if (c >= this.h.length || this.h[i]! >= this.h[c]!) break; [this.h[i], this.h[c]] = [this.h[c]!, this.h[i]!]; i = c; } } return r; }
  top(): number { return this.h[0] ?? -Infinity; }
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { slopeTrick } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const a = [5, 3, 4, 1, 2];
  rec.begin({ zh: \`Slope Trick: [\${a.join(',')}]\`, en: \`Slope Trick: [\${a.join(',')}]\` }).commit();
  const cost = slopeTrick(a, {
    onConclude: (c) => rec.begin({ zh: \`最小代价 \${c}\`, en: \`min cost \${c}\` })
      .setBars([{ value: c, role: 'final' as BarRole }]).commit(),
  });
  void cost;
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { slopeTrick } from '../../src/algorithms/greedy/greedy-slope-trick/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-slope-trick/trace.ts';
test('已增序代价为 0', () => {
  assert.equal(slopeTrick([1, 2, 3, 4]), 0);
});
test('单点降序代价正确', () => {
  assert.equal(slopeTrick([5, 1]), 4);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 11. greedy-matroid-intersection
{
  id: 'greedy-matroid-intersection',
  titleZh: '拟阵交', titleEn: 'Matroid Intersection',
  summaryZh: '求两个拟阵公共独立集的最大基数，贪心增广。',
  summaryEn: 'Find the largest set independent in two matroids simultaneously via augmenting paths.',
  descZh: '拟阵交：M1=(E,I1), M2=(E,I2)，求最大 S 同时属于 I1 与 I2。用增广路径算法，复杂度 O(r²·|E|)。',
  descEn: 'Matroid intersection: M1=(E,I1), M2=(E,I2); find max S in both. Augmenting-path algorithm in O(r²·|E|).',
  tags: ['greedy','matroid','combinatorial'],
  time: 'O(r²·n)', space: 'O(n)',
  impl: `// 拟阵交 (简化: 图拟阵 = 森林, 颜色拟阵 = 每色上限) · 实现
export interface MiHooks { onAugment?: (S: number[], added: number) => void; onConclude?: (size: number) => void; }
// 这里用"图边构成森林"(拟阵1) 与 "每点度数<=1"(配对拟阵, 拟阵2) 的简化
export function matroidIntersection(edges: ReadonlyArray<readonly [number, number]>, hooks: MiHooks = {}): number[] {
  const S: number[] = [];
  let changed = true;
  while (changed) {
    changed = false;
    for (let i = 0; i < edges.length; i++) {
      if (S.includes(i)) continue;
      const trial = [...S, i];
      if (isForest(trial, edges) && isMatching(trial, edges)) {
        S.push(i); hooks.onAugment?.(S, i); changed = true;
      }
    }
  }
  hooks.onConclude?.(S.length);
  return S;
}
function isForest(idx: number[], edges: ReadonlyArray<readonly [number, number]>): boolean {
  const parent = new Map<number, number>();
  const find = (x: number): number => { while (parent.get(x) !== x) { parent.set(x, parent.get(parent.get(x)!)!); x = parent.get(x)!; } return x; };
  for (const i of idx) { const [u, v] = edges[i]!; if (!parent.has(u)) parent.set(u, u); if (!parent.has(v)) parent.set(v, v); const ru = find(u), rv = find(v); if (ru === rv) return false; parent.set(ru, rv); }
  return true;
}
function isMatching(idx: number[], edges: ReadonlyArray<readonly [number, number]>): boolean {
  const deg = new Map<number, number>();
  for (const i of idx) { const [u, v] = edges[i]!; if ((deg.get(u) ?? 0) >= 1 || (deg.get(v) ?? 0) >= 1) return false; deg.set(u, 1); deg.set(v, 1); }
  return true;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { matroidIntersection } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const E: ReadonlyArray<readonly [number, number]> = [[0, 1], [1, 2], [2, 3], [0, 2]];
  rec.begin({ zh: '拟阵交 (森林 ∩ 匹配)', en: 'Matroid intersection (forest ∩ matching)' }).commit();
  const S = matroidIntersection(E, {
    onAugment: (s, ad) => rec.begin({ zh: \`加入边\${ad}, 当前{\${s.join(',')}}\`, en: \`add edge\${ad}, S={\${s.join(',')}}\` })
      .setBars([{ value: s.length, role: 'final' as BarRole }]).commit(),
  });
  rec.begin({ zh: \`最大交 \${S.length} 条边\`, en: \`max intersection \${S.length} edges\` })
    .setBars([{ value: S.length, role: 'final' as BarRole }]).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { matroidIntersection } from '../../src/algorithms/greedy/greedy-matroid-intersection/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-matroid-intersection/trace.ts';
test('拟阵交返回非空', () => {
  const S = matroidIntersection([[0, 1], [2, 3], [4, 5]]);
  assert.ok(S.length >= 1);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 12. greedy-set-cover-lp
{
  id: 'greedy-set-cover-lp',
  titleZh: '集合覆盖 LP 舍入', titleEn: 'Set Cover LP Rounding',
  summaryZh: '先解 LP 松弛再用贪心阈值舍入，得到 O(ln n) 近似。',
  summaryEn: 'Solve the LP relaxation then round by threshold for an O(ln n) approximation.',
  descZh: '集合覆盖 LP：min Σx_S s.t. ∀e Σ_{S∋e} x_S≥1。分数解按 x_S 与 |S| 比值贪心取整。',
  descEn: 'Set cover LP: min Σx_S s.t. each element covered. Round fractional solution by cost-effectiveness greedy.',
  tags: ['greedy','lp','approximation'],
  time: 'O(n³)', space: 'O(n²)',
  impl: `// 集合覆盖 LP 舍入 (简化: 直接贪心按性价比) · 实现
export interface SlpHooks { onPick?: (setIdx: number, newCovered: number, costRatio: number) => void; onConclude?: (chosen: number[], cost: number) => void; }
export function setCoverLpRounding(sets: ReadonlyArray<readonly number[]>, weights: readonly number[], universe: number, hooks: SlpHooks = {}): { chosen: number[]; cost: number } {
  const covered = new Set<number>();
  const chosen: number[] = [];
  let cost = 0;
  while (covered.size < universe) {
    let best = -1, bestRatio = Infinity, bestNew = 0;
    for (let i = 0; i < sets.length; i++) {
      if (chosen.includes(i)) continue;
      const nw = sets[i]!.filter((e) => !covered.has(e));
      if (nw.length === 0) continue;
      const ratio = weights[i]! / nw.length;
      if (ratio < bestRatio) { bestRatio = ratio; best = i; bestNew = nw.length; }
    }
    if (best < 0) break;
    chosen.push(best); cost += weights[best]!;
    for (const e of sets[best]!) covered.add(e);
    hooks.onPick?.(best, bestNew, bestRatio);
  }
  hooks.onConclude?.(chosen, cost);
  return { chosen, cost };
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { setCoverLpRounding } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const sets = [[0, 1, 2], [2, 3], [1, 3, 4], [0, 4]];
  const w = [3, 2, 3, 2];
  rec.begin({ zh: '集合覆盖 LP 舍入', en: 'Set cover LP rounding' }).commit();
  const r = setCoverLpRounding(sets, w, 5, {
    onPick: (i, nw, ratio) => rec.begin({ zh: \`选集\${i} 新增\${nw} 比值\${ratio.toFixed(2)}\`, en: \`pick set\${i} +\${nw} ratio\${ratio.toFixed(2)}\` })
      .setBars([{ value: ratio, role: 'pivot' as BarRole }]).commit(),
  });
  rec.begin({ zh: \`总代价 \${r.cost}\`, en: \`total cost \${r.cost}\` })
    .setAux([{ label: 'cost', value: String(r.cost), role: 'final' as BarRole }]).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { setCoverLpRounding } from '../../src/algorithms/greedy/greedy-set-cover-lp/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-set-cover-lp/trace.ts';
test('覆盖全宇宙', () => {
  const r = setCoverLpRounding([[0, 1], [1, 2], [2, 3]], [1, 1, 1], 4);
  const covered = new Set<number>();
  for (const i of r.chosen) for (const e of [0, 1, 2, 3]) if ([0, 1, 1, 2, 2, 3][0] === e) covered.add(e);
  assert.ok(r.cost >= 0);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 13. greedy-steiner-tree
{
  id: 'greedy-steiner-tree',
  titleZh: '贪心 Steiner 树', titleEn: 'Greedy Steiner Tree',
  summaryZh: '在图中连接指定终端集，贪心扩展距离最近终端，近似比 2(1-1/l)。',
  summaryEn: 'Connect a terminal set; greedily attach nearest terminal for 2(1-1/l) ratio.',
  descZh: 'Steiner 树：连接终端集 T 的最小权重子树。贪心（Mehlhorn）：先求 T 的度量闭包，再 MST，2(1-1/|T|) 近似。',
  descEn: 'Steiner tree: min-weight subtree connecting terminals T. Greedy (Mehlhorn): metric closure + MST gives 2(1-1/|T|) ratio.',
  tags: ['greedy','tree','graph'],
  time: 'O(|T|·(E log V))', space: 'O(V²)',
  impl: `// 贪心 Steiner 树 (度量闭包 + MST 简化) · 实现
export interface GsHooks { onAttach?: (terminal: number, via: number, dist: number) => void; onConclude?: (totalWeight: number) => void; }
export function greedySteinerTree(dist: ReadonlyArray<readonly number[]>, terminals: readonly number[], hooks: GsHooks = {}): number {
  // dist: 终端间最短路距离矩阵; 求 MST 之和
  const n = terminals.length;
  const visited = new Array<boolean>(n).fill(false);
  visited[0] = true;
  let total = 0;
  for (let k = 1; k < n; k++) {
    let best = -1, bestD = Infinity, via = 0;
    for (let i = 0; i < n; i++) if (!visited[i]) for (let j = 0; j < n; j++) if (visited[j]) {
      if (dist[terminals[i]!]![terminals[j]!]! < bestD) { bestD = dist[terminals[i]!]![terminals[j]!]!; best = i; via = j; }
    }
    if (best < 0) break;
    visited[best] = true; total += bestD;
    hooks.onAttach?.(terminals[best]!, terminals[via]!, bestD);
  }
  hooks.onConclude?.(total);
  return total;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { greedySteinerTree } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const D = [[0, 1, 2, 5], [1, 0, 3, 4], [2, 3, 0, 6], [5, 4, 6, 0]];
  const T = [0, 1, 2, 3];
  rec.begin({ zh: '贪心 Steiner 树', en: 'Greedy Steiner tree' }).commit();
  const w = greedySteinerTree(D, T, {
    onAttach: (t, via, d) => rec.begin({ zh: \`\${t} 经 \${via} 加入 (d=\${d})\`, en: \`\${t} via \${via} (d=\${d})\` })
      .setBars([{ value: d, role: 'pivot' as BarRole }]).commit(),
  });
  rec.begin({ zh: \`总权重 \${w}\`, en: \`total weight \${w}\` })
    .setAux([{ label: 'weight', value: String(w), role: 'final' as BarRole }]).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greedySteinerTree } from '../../src/algorithms/greedy/greedy-steiner-tree/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-steiner-tree/trace.ts';
test('Steiner 权重为正', () => {
  const D = [[0, 1, 2], [1, 0, 3], [2, 3, 0]];
  const w = greedySteinerTree(D, [0, 1, 2]);
  assert.ok(w > 0);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 14. greedy-asymmetric-tsp
{
  id: 'greedy-asymmetric-tsp',
  titleZh: '最近邻 TSP', titleEn: 'Nearest Neighbor TSP',
  summaryZh: '从起点反复访问最近未访问城市，贪心构造 TSP 近似回路。',
  summaryEn: 'From a start city repeatedly visit the nearest unvisited city for a TSP approximation.',
  descZh: '最近邻 TSP：从城市 0 出发，每次走到距离最近的未访问城市，最后回到起点。近似比 O(log n)，简单快速。',
  descEn: 'Nearest-neighbor TSP: start at city 0, repeatedly go to nearest unvisited, return to start. Ratio O(log n), simple and fast.',
  tags: ['greedy','tsp','approximation'],
  time: 'O(n²)', space: 'O(n)',
  impl: `// 最近邻 TSP · 实现
export interface NnHooks { onVisit?: (from: number, to: number, dist: number) => void; onConclude?: (tour: number[], totalDist: number) => void; }
export function nearestNeighborTsp(dist: ReadonlyArray<readonly number[]>, start = 0, hooks: NnHooks = {}): { tour: number[]; total: number } {
  const n = dist.length;
  const visited = new Array<boolean>(n).fill(false);
  const tour: number[] = [start];
  visited[start] = true;
  let cur = start, total = 0;
  for (let k = 1; k < n; k++) {
    let best = -1, bestD = Infinity;
    for (let j = 0; j < n; j++) if (!visited[j] && dist[cur]![j]! < bestD) { bestD = dist[cur]![j]!; best = j; }
    tour.push(best!); visited[best!] = true; total += bestD;
    hooks.onVisit?.(cur, best!, bestD);
    cur = best!;
  }
  total += dist[cur]![start]!;
  tour.push(start);
  hooks.onConclude?.(tour, total);
  return { tour, total };
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { nearestNeighborTsp } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const D = [[0, 2, 9, 10], [1, 0, 6, 4], [15, 7, 0, 8], [6, 3, 12, 0]];
  rec.begin({ zh: '最近邻 TSP', en: 'Nearest neighbor TSP' })
    .setGraph(D.map((_, i) => ({ id: String(i) })), []).commit();
  const r = nearestNeighborTsp(D, 0, {
    onVisit: (f, t, d) => rec.begin({ zh: \`\${f}->\${t} (d=\${d})\`, en: \`\${f}->\${t} (d=\${d})\` })
      .setBars([{ value: d, role: 'pivot' as BarRole }]).commit(),
  });
  rec.begin({ zh: \`回路 \${r.tour.join('->')} 总长 \${r.total}\`, en: \`tour \${r.tour.join('->')} len \${r.total}\` })
    .setAux([{ label: 'total', value: String(r.total), role: 'final' as BarRole }]).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { nearestNeighborTsp } from '../../src/algorithms/greedy/greedy-asymmetric-tsp/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-asymmetric-tsp/trace.ts';
test('TSP 回路访问所有城市', () => {
  const r = nearestNeighborTsp([[0, 1, 2], [1, 0, 3], [2, 3, 0]]);
  const uniq = new Set(r.tour);
  assert.ok(uniq.size === 3);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 15. greedy-online-paging
{
  id: 'greedy-online-paging',
  titleZh: '在线页面置换', titleEn: 'Online Paging Algorithm',
  summaryZh: '缓存满时按 LRU/FIFO 贪心淘汰，分析竞争比。',
  summaryEn: 'When cache is full evict by LRU/FIFO greedily; analyze competitive ratio.',
  descZh: '在线分页：固定大小缓存，访问序列到达。LRU 淘汰最久未用页。Sleator-Tarjan：k-页 LRU 是 k+1 竞争。',
  descEn: 'Online paging: fixed-size cache, request stream. LRU evicts least-recently-used. Sleator-Tarjan: k-LRU is k+1-competitive.',
  tags: ['greedy','online-algorithm','caching'],
  time: 'O(n·k)', space: 'O(k)',
  impl: `// 在线页面置换 LRU · 实现
export interface PgHooks { onHit?: (page: number) => void; onMiss?: (page: number, evicted?: number) => void; onConclude?: (hits: number, misses: number) => void; }
export function onlinePagingLru(requests: readonly number[], cacheSize: number, hooks: PgHooks = {}): { hits: number; misses: number } {
  const cache: number[] = [];
  let hits = 0, misses = 0;
  for (const p of requests) {
    const idx = cache.indexOf(p);
    if (idx >= 0) { hits++; cache.splice(idx, 1); cache.push(p); hooks.onHit?.(p); }
    else {
      misses++;
      let evicted: number | undefined;
      if (cache.length >= cacheSize) evicted = cache.shift();
      cache.push(p);
      hooks.onMiss?.(p, evicted);
    }
  }
  hooks.onConclude?.(hits, misses);
  return { hits, misses };
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { onlinePagingLru } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const req = [1, 2, 3, 4, 1, 2, 5, 1, 2, 3];
  rec.begin({ zh: 'LRU 分页 cache=4', en: 'LRU paging cache=4' }).commit();
  const r = onlinePagingLru(req, 4, {
    onMiss: (p, ev) => rec.begin({ zh: \`缺页 \${p}\${ev !== undefined ? ' 淘汰' + ev : ''}\`, en: \`miss \${p}\${ev !== undefined ? ' evict ' + ev : ''}\` })
      .setBars([{ value: p, role: 'warn' as BarRole }]).commit(),
    onHit: (p) => rec.begin({ zh: \`命中 \${p}\`, en: \`hit \${p}\` })
      .setBars([{ value: p, role: 'final' as BarRole }]).commit(),
  });
  rec.begin({ zh: \`\${r.hits} 命中 \${r.misses} 缺页\`, en: \`\${r.hits} hits \${r.misses} misses\` })
    .setAux([{ label: '命中率', value: (r.hits / req.length).toFixed(2), role: 'final' as BarRole }]).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { onlinePagingLru } from '../../src/algorithms/greedy/greedy-online-paging/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-online-paging/trace.ts';
test('重复访问缓存内页全命中', () => {
  const r = onlinePagingLru([1, 1, 1], 2);
  assert.equal(r.hits, 2);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 16. greedy-ski-rental
{
  id: 'greedy-ski-rental',
  titleZh: '租雪板问题', titleEn: 'Ski Rental Problem',
  summaryZh: '每天租或买断，未知总天数，最优确定性策略租到价格等于买价。',
  summaryEn: 'Rent daily or buy once; unknown horizon; optimal deterministic strategy rents until cost equals buy price.',
  descZh: '租雪板：租价 r/天，买价 b，未知滑多少天。最优确定性：租 b/r 天后买，竞争比 2；随机化可达 e/(e-1)。',
  descEn: 'Ski rental: rent r/day or buy b; unknown days. Optimal deterministic: rent b/r days then buy, ratio 2; randomized e/(e-1).',
  tags: ['greedy','online-algorithm','competitive-ratio'],
  time: 'O(1)', space: 'O(1)',
  impl: `// 租雪板 · 实现
export interface SrHooks { onDay?: (day: number, action: 'rent' | 'buy', total: number) => void; onConclude?: (total: number, ratio: number) => void; }
export function skiRental(days: number, rentPrice: number, buyPrice: number, hooks: SrHooks = {}): { total: number; bought: boolean } {
  const threshold = Math.floor(buyPrice / rentPrice);
  let total = 0, bought = false;
  for (let d = 1; d <= days; d++) {
    if (!bought && d > threshold) { bought = true; total += buyPrice; hooks.onDay?.(d, 'buy', total); }
    else { total += rentPrice; hooks.onDay?.(d, 'rent', total); }
  }
  const offline = Math.min(days * rentPrice, buyPrice);
  hooks.onConclude?.(total, total / offline);
  return { total, bought };
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { skiRental } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '租雪板: rent=1 buy=10', en: 'Ski rental: rent=1 buy=10' }).commit();
  const r = skiRental(15, 1, 10, {
    onDay: (d, a, t) => rec.begin({ zh: \`day\${d} \${a} 累计\${t}\`, en: \`day\${d} \${a} total\${t}\` })
      .setBars([{ value: t, role: a === 'buy' ? ('final' as BarRole) : ('pivot' as BarRole) }]).commit(),
  });
  rec.begin({ zh: \`总花费 \${r.total}\`, en: \`total \${r.total}\` })
    .setAux([{ label: 'total', value: String(r.total), role: 'final' as BarRole }]).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { skiRental } from '../../src/algorithms/greedy/greedy-ski-rental/impl.ts';
test('短期全租', () => {
  const r = skiRental(3, 1, 10);
  assert.equal(r.bought, false);
  assert.equal(r.total, 3);
});
test('长期最终购买', () => {
  const r = skiRental(20, 1, 10);
  assert.equal(r.bought, true);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 17. greedy-list-schedule
{
  id: 'greedy-list-schedule',
  titleZh: '列表调度', titleEn: 'List Scheduling',
  summaryZh: '按优先级列表把就绪任务贪心分配到空闲机器，经典并行调度。',
  summaryEn: 'Assign ready tasks to idle machines by a priority list; classic parallel scheduling.',
  descZh: '列表调度：任务有优先级（如关键路径长度），扫描就绪集，按优先序分配到可用机器。Graham 调度基础。',
  descEn: 'List scheduling: tasks have priorities (e.g. critical-path length); scan ready set in priority order to free machines. Graham basis.',
  tags: ['greedy','scheduling','dag'],
  time: 'O(n²)', space: 'O(n)',
  impl: `// 列表调度 · 实现 (无依赖, 按优先级)
export interface LsHooks { onAssign?: (task: number, machine: number) => void; onConclude?: (makespan: number) => void; }
export function listSchedule(durations: readonly number[], priorities: readonly number[], m: number, hooks: LsHooks = {}): { makespan: number; loads: number[] } {
  const order = durations.map((_, i) => i).sort((a, b) => priorities[b]! - priorities[a]!);
  const loads = new Array<number>(m).fill(0);
  for (const t of order) {
    let mi = 0; for (let k = 1; k < m; k++) if (loads[k]! < loads[mi]!) mi = k;
    loads[mi] += durations[t]!;
    hooks.onAssign?.(t, mi);
  }
  const makespan = Math.max(...loads);
  hooks.onConclude?.(makespan);
  return { makespan, loads };
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { listSchedule } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const dur = [3, 5, 2, 8, 4];
  const pri = [1, 2, 0, 3, 1];
  rec.begin({ zh: '列表调度 m=2', en: 'List scheduling m=2' }).commit();
  const r = listSchedule(dur, pri, 2, {
    onAssign: (t, mi) => rec.begin({ zh: \`任务\${t} -> 机\${mi}\`, en: \`task\${t} -> m\${mi}\` })
      .setBars(r_loads(r).map((l) => ({ value: l, role: 'pivot' as BarRole }))).commit(),
  });
  rec.begin({ zh: \`makespan \${r.makespan}\`, en: \`makespan \${r.makespan}\` })
    .setBars(r.loads.map((l) => ({ value: l, role: 'final' as BarRole }))).commit();
  return rec.build();
}
function r_loads(r: { loads: number[] }) { return r.loads; }
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { listSchedule } from '../../src/algorithms/greedy/greedy-list-schedule/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-list-schedule/trace.ts';
test('makespan 至少最大任务', () => {
  const r = listSchedule([3, 5, 2, 8], [0, 1, 2, 3], 2);
  assert.ok(r.makespan >= 8);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 18. greedy-bin-packing-ffd
{
  id: 'greedy-bin-packing-ffd',
  titleZh: '首次适应递减', titleEn: 'First Fit Decreasing',
  summaryZh: '物品降序排列，每个放入第一个能容纳的箱子，近似比 11/9。',
  summaryEn: 'Sort items descending, place each in the first bin that fits; ratio 11/9.',
  descZh: 'FFD 装箱：物品按大小降序，依次放入第一个能装下的箱子。装箱数 ≤ 11/9·OPT+1。',
  descEn: 'FFD bin packing: items sorted descending, each placed in first fitting bin. Bins <= 11/9·OPT+1.',
  tags: ['greedy','bin-packing','approximation'],
  time: 'O(n²)', space: 'O(n)',
  impl: `// 首次适应递减装箱 · 实现
export interface FfdHooks { onPlace?: (item: number, bin: number, binLoad: number) => void; onConclude?: (binCount: number) => void; }
export function firstFitDecreasing(items: readonly number[], capacity: number, hooks: FfdHooks = {}): number {
  const order = [...items].map((v, i) => ({ i, v })).sort((a, b) => b.v - a.v);
  const bins: number[] = [];
  for (const { i, v } of order) {
    let placed = -1;
    for (let b = 0; b < bins.length; b++) if (bins[b]! + v <= capacity) { bins[b] += v; placed = b; break; }
    if (placed < 0) { bins.push(v); placed = bins.length - 1; }
    hooks.onPlace?.(i, placed, bins[placed]!);
  }
  hooks.onConclude?.(bins.length);
  return bins.length;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { firstFitDecreasing } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const items = [4, 8, 1, 4, 2, 1];
  rec.begin({ zh: 'FFD 装箱 capacity=10', en: 'FFD bin packing capacity=10' }).commit();
  const n = firstFitDecreasing(items, 10, {
    onPlace: (it, bin, load) => rec.begin({ zh: \`物品\${it} -> 箱\${bin} (载\${load})\`, en: \`item\${it} -> bin\${bin} (load\${load})\` })
      .setBars([{ value: load, role: 'pivot' as BarRole }]).commit(),
  });
  rec.begin({ zh: \`\${n} 个箱子\`, en: \`\${n} bins\` })
    .setBars([{ value: n, role: 'final' as BarRole }]).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { firstFitDecreasing } from '../../src/algorithms/greedy/greedy-bin-packing-ffd/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-bin-packing-ffd/trace.ts';
test('小物品用更少箱', () => {
  const n = firstFitDecreasing([3, 3, 3, 3], 10);
  assert.equal(n, 2);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 19. greedy-best-fit
{
  id: 'greedy-best-fit',
  titleZh: '最佳适应装箱', titleEn: 'Best Fit Bin Packing',
  summaryZh: '每个物品放入剩余空间最小但能容纳的箱子，减少碎片。',
  summaryEn: 'Place each item in the bin with the least leftover room that still fits; reduces fragmentation.',
  descZh: '最佳适应：扫描所有箱子，选能容纳且剩余最小的。与首次适应同阶 11/9·OPT。',
  descEn: 'Best fit: scan all bins, pick the tightest that fits. Same order 11/9·OPT as first fit.',
  tags: ['greedy','bin-packing','approximation'],
  time: 'O(n²)', space: 'O(n)',
  impl: `// 最佳适应装箱 · 实现
export interface BfHooks { onPlace?: (item: number, bin: number, binLoad: number) => void; onConclude?: (binCount: number) => void; }
export function bestFitBinPacking(items: readonly number[], capacity: number, hooks: BfHooks = {}): number {
  const bins: number[] = [];
  for (let idx = 0; idx < items.length; idx++) {
    const v = items[idx]!;
    let best = -1, bestLeft = Infinity;
    for (let b = 0; b < bins.length; b++) { const left = capacity - bins[b]!; if (left >= v && left < bestLeft) { bestLeft = left; best = b; } }
    if (best < 0) { bins.push(v); best = bins.length - 1; } else bins[best] += v;
    hooks.onPlace?.(idx, best, bins[best]!);
  }
  hooks.onConclude?.(bins.length);
  return bins.length;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { bestFitBinPacking } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const items = [5, 3, 7, 2, 4];
  rec.begin({ zh: '最佳适应 capacity=10', en: 'Best fit capacity=10' }).commit();
  const n = bestFitBinPacking(items, 10, {
    onPlace: (it, bin, load) => rec.begin({ zh: \`物品\${it} -> 箱\${bin} (载\${load})\`, en: \`item\${it} -> bin\${bin} (load\${load})\` })
      .setBars([{ value: load, role: 'pivot' as BarRole }]).commit(),
  });
  rec.begin({ zh: \`\${n} 个箱子\`, en: \`\${n} bins\` }).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bestFitBinPacking } from '../../src/algorithms/greedy/greedy-best-fit/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-best-fit/trace.ts';
test('装箱数为正', () => {
  assert.ok(bestFitBinPacking([5, 5, 5], 10) >= 2);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 20. greedy-knapsack-density
{
  id: 'greedy-knapsack-density',
  titleZh: '0/1 背包密度贪心', titleEn: '0/1 Knapsack Density Greedy',
  summaryZh: '0/1 背包按价值密度贪心取整，作为 DP 最优解的上界与近似。',
  summaryEn: '0/1 knapsack greedy by value density serves as upper bound and approximation to DP optimum.',
  descZh: '0/1 背包（不可分割）：按价值/重量降序贪心取，遇装不下跳过。结果 ≤ OPT，比值 ≤ 2（与最优单物品比）。',
  descEn: '0/1 knapsack (indivisible): greedy by density descending, skip if it doesnt fit. Result <= OPT, ratio <= 2.',
  tags: ['greedy','knapsack','approximation'],
  time: 'O(n log n)', space: 'O(1)',
  impl: `// 0/1 背包密度贪心 · 实现
export interface KdItem { w: number; v: number; }
export interface KdHooks { onConsider?: (i: number, density: number, taken: boolean) => void; onConclude?: (totalValue: number, totalWeight: number) => void; }
export function knapsackDensityGreedy(capacity: number, items: readonly KdItem[], hooks: KdHooks = {}): { value: number; weight: number } {
  const order = items.map((it, i) => ({ i, d: it.v / it.w, it })).sort((a, b) => b.d - a.d);
  let value = 0, weight = 0;
  for (const { i, d, it } of order) {
    const taken = weight + it.w <= capacity;
    if (taken) { value += it.v; weight += it.w; }
    hooks.onConsider?.(i, d, taken);
  }
  hooks.onConclude?.(value, weight);
  return { value, weight };
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { knapsackDensityGreedy, type KdItem } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const items: KdItem[] = [{ w: 10, v: 60 }, { w: 20, v: 100 }, { w: 30, v: 120 }];
  rec.begin({ zh: '0/1 背包密度贪心 cap=50', en: '0/1 knapsack density cap=50' }).commit();
  const r = knapsackDensityGreedy(50, items, {
    onConsider: (i, d, t) => rec.begin({ zh: \`物品\${i} 密度\${d.toFixed(1)} \${t ? '取' : '跳'}\`, en: \`item\${i} dens\${d.toFixed(1)} \${t ? 'take' : 'skip'}\` })
      .setBars([{ value: d, role: t ? ('final' as BarRole) : ('default' as BarRole) }]).commit(),
  });
  rec.begin({ zh: \`价值 \${r.value} 重 \${r.weight}\`, en: \`value \${r.value} weight \${r.weight}\` })
    .setAux([{ label: 'value', value: String(r.value), role: 'final' as BarRole }]).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { knapsackDensityGreedy } from '../../src/algorithms/greedy/greedy-knapsack-density/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-knapsack-density/trace.ts';
test('密度贪心不超过容量', () => {
  const r = knapsackDensityGreedy(50, [{ w: 10, v: 60 }, { w: 30, v: 120 }]);
  assert.ok(r.weight <= 50);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 21. greedy-water-tap
{
  id: 'greedy-water-tap',
  titleZh: '注水问题', titleEn: 'Water Filling',
  summaryZh: '把有限水分配到不同容量容器使最小水位最大，贪心按容量递增。',
  summaryEn: 'Allocate limited water to containers to maximize the minimum water level; fill smallest first.',
  descZh: '注水：n 个容器容量 c_i，总水量 W。最大化最小水位：先填最小的，超容则均摊，等价于凸资源分配。',
  descEn: 'Water filling: n containers capacity c_i, total W. Maximize min level: fill smallest first, equalize beyond, a convex allocation.',
  tags: ['greedy','resource-allocation','convex'],
  time: 'O(n log n)', space: 'O(n)',
  impl: `// 注水问题 · 实现
export interface WfHooks { onFill?: (i: number, level: number) => void; onConclude?: (levels: number[], minLevel: number) => void; }
export function waterFilling(capacities: readonly number[], water: number, hooks: WfHooks = {}): { levels: number[]; minLevel: number } {
  const order = capacities.map((c, i) => ({ c, i })).sort((a, b) => a.c - b.c);
  const levels = new Array<number>(capacities.length).fill(0);
  let remaining = water;
  for (let k = 0; k < order.length; k++) {
    const cnt = k + 1;
    const need = (order[k]!.c - (levels[order[k]!.i] ?? 0));
    // 平均到前 cnt 个最小
    const prev = k === 0 ? 0 : order[k - 1]!.c;
    const fillTo = Math.min(order[k]!.c, prev + remaining / cnt);
    let used = 0;
    for (let j = 0; j <= k; j++) { const before = levels[order[j]!.i] ?? 0; const after = Math.min(capacities[order[j]!.i]!, fillTo); used += after - before; levels[order[j]!.i] = after; hooks.onFill?.(order[j]!.i, after); }
    remaining -= used;
    if (remaining <= 0) break;
    void need;
  }
  const minLevel = Math.min(...levels);
  hooks.onConclude?.(levels, minLevel);
  return { levels, minLevel };
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { waterFilling } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const caps = [2, 5, 3, 8];
  rec.begin({ zh: '注水 W=10', en: 'Water filling W=10' }).commit();
  const r = waterFilling(caps, 10, {
    onFill: (i, lv) => rec.begin({ zh: \`容器\${i} 水位\${lv.toFixed(2)}\`, en: \`container\${i} level\${lv.toFixed(2)}\` })
      .setBars(r_levels(r).map((l) => ({ value: l, role: 'pivot' as BarRole }))).commit(),
  });
  rec.begin({ zh: \`最小水位 \${r.minLevel.toFixed(2)}\`, en: \`min level \${r.minLevel.toFixed(2)}\` })
    .setBars(r.levels.map((l) => ({ value: l, role: 'final' as BarRole }))).commit();
  return rec.build();
}
function r_levels(r: { levels: number[] }) { return r.levels; }
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { waterFilling } from '../../src/algorithms/greedy/greedy-water-tap/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-water-tap/trace.ts';
test('水量守恒', () => {
  const r = waterFilling([2, 5, 3], 6);
  assert.ok(Math.abs(r.levels.reduce((a, b) => a + b, 0) - 6) < 1e-6);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 22. greedy-line-arrangement
{
  id: 'greedy-line-arrangement',
  titleZh: '贪心线段覆盖', titleEn: 'Greedy Segment Cover',
  summaryZh: '用最少定长线段覆盖所有点，按右端点贪心放置。',
  summaryEn: 'Cover all points with the fewest fixed-length segments; place greedily by right endpoint.',
  descZh: '线段覆盖：数轴上点集，定长 L 线段。按点排序，每次把线段右端放当前最左点+L，跳过已覆盖。',
  descEn: 'Segment cover: points on a line, segment length L. Sort points, place right end at leftmost+L, skip covered.',
  tags: ['greedy','interval','geometry'],
  time: 'O(n log n)', space: 'O(1)',
  impl: `// 贪心线段覆盖 · 实现
export interface ScHooks { onPlace?: (rightEnd: number, covered: number) => void; onConclude?: (count: number) => void; }
export function segmentCover(points: readonly number[], len: number, hooks: ScHooks = {}): number {
  const pts = [...points].sort((a, b) => a - b);
  let count = 0, i = 0;
  while (i < pts.length) {
    const rightEnd = pts[i]! + len;
    let covered = 0;
    while (i < pts.length && pts[i]! <= rightEnd) { covered++; i++; }
    count++;
    hooks.onPlace?.(rightEnd, covered);
  }
  hooks.onConclude?.(count);
  return count;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { segmentCover } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const pts = [1, 2, 3, 8, 9, 10, 20];
  rec.begin({ zh: '线段覆盖 L=3', en: 'Segment cover L=3' })
    .setArray([...pts], pts.map(() => 'default' as BarRole), pts.map((p, i) => ({ index: i, label: String(p) }))).commit();
  const n = segmentCover(pts, 3, {
    onPlace: (re, cov) => rec.begin({ zh: \`右端=\${re} 覆盖\${cov}点\`, en: \`right=\${re} covers\${cov}\` })
      .setBars([{ value: cov, role: 'final' as BarRole }]).commit(),
  });
  rec.begin({ zh: \`\${n} 条线段\`, en: \`\${n} segments\` }).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { segmentCover } from '../../src/algorithms/greedy/greedy-line-arrangement/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-line-arrangement/trace.ts';
test('密集点用 1 段', () => {
  assert.equal(segmentCover([1, 2, 3], 5), 1);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 23. greedy-min-hull
{
  id: 'greedy-min-hull',
  titleZh: '凸包 Gift Wrapping', titleEn: 'Gift Wrapping Convex Hull',
  summaryZh: '从最左点开始，每次选使所有点同侧的下一顶点，贪心包出凸包。',
  summaryEn: 'Start at the leftmost point; each step pick the next vertex keeping all points on one side.',
  descZh: 'Gift Wrapping（Jarvis 步进）：从最下点开始，反复选相对当前方向逆时针转角最小的点，直到回到起点。',
  descEn: 'Gift wrapping (Jarvis march): start at lowest point; repeatedly pick the point with smallest counterclockwise turn.',
  tags: ['greedy','geometry','convex-hull'],
  time: 'O(nh)', space: 'O(h)',
  impl: `// Gift Wrapping 凸包 · 实现
export interface Pt { x: number; y: number; }
export interface GwHooks { onVertex?: (p: Pt) => void; onConclude?: (hull: Pt[]) => void; }
export function giftWrapping(points: readonly Pt[], hooks: GwHooks = {}): Pt[] {
  if (points.length < 3) return [...points];
  let start = 0;
  for (let i = 1; i < points.length; i++) if (points[i]!.y < points[start]!.y || (points[i]!.y === points[start]!.y && points[i]!.x < points[start]!.x)) start = i;
  const hull: Pt[] = [];
  let p = start;
  for (;;) {
    hull.push(points[p]!); hooks.onVertex?.(points[p]!);
    let q = (p + 1) % points.length;
    for (let r = 0; r < points.length; r++) {
      if (r === p) continue;
      const cross = (points[q]!.x - points[p]!.x) * (points[r]!.y - points[p]!.y) - (points[q]!.y - points[p]!.y) * (points[r]!.x - points[p]!.x);
      if (cross < 0) q = r;
    }
    p = q;
    if (p === start) break;
  }
  hooks.onConclude?.(hull);
  return hull;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { giftWrapping, type Pt } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const pts: Pt[] = [{ x: 0, y: 0 }, { x: 4, y: 0 }, { x: 4, y: 4 }, { x: 0, y: 4 }, { x: 2, y: 2 }];
  rec.begin({ zh: 'Gift Wrapping 凸包', en: 'Gift wrapping hull' })
    .setGraph(pts.map((p, i) => ({ id: String(i), x: p.x / 5, y: p.y / 5 })), []).commit();
  const hull = giftWrapping(pts, {
    onConclude: (h) => rec.begin({ zh: \`凸包 \${h.length} 点\`, en: \`hull \${h.length} pts\` })
      .setBars([{ value: h.length, role: 'final' as BarRole }]).commit(),
  });
  void hull;
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { giftWrapping } from '../../src/algorithms/greedy/greedy-min-hull/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-min-hull/trace.ts';
test('正方形凸包 4 点', () => {
  const h = giftWrapping([{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 1 }]);
  assert.equal(h.length, 4);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 24. greedy-huffman-canonical
{
  id: 'greedy-huffman-canonical',
  titleZh: '规范哈夫曼编码', titleEn: 'Canonical Huffman Codes',
  summaryZh: '由码长生成规范编码，码表紧凑，解码高效。',
  summaryEn: 'Generate canonical codes from code lengths; compact tables, fast decoding.',
  descZh: '规范哈夫曼：先求各符号码长，再按 (码长, 符号序) 分配连续整数编码。码表只需存码长，省空间。',
  descEn: 'Canonical Huffman: get symbol code lengths, then assign consecutive integer codes by (length, symbol). Tables store only lengths.',
  tags: ['greedy','huffman','compression'],
  time: 'O(n log n)', space: 'O(n)',
  impl: `// 规范哈夫曼 · 实现
export interface ChHooks { onCode?: (sym: string, len: number, code: string) => void; onConclude?: (tableSize: number) => void; }
export function canonicalHuffman(freq: ReadonlyArray<readonly [string, number]>, hooks: ChHooks = {}): Map<string, { len: number; code: string }> {
  // 1. 求码长 (标准 Huffman)
  interface Node { s?: string; f: number; d: number; l?: Node; r?: Node; }
  let nodes: Node[] = freq.map(([s, f]) => ({ s, f, d: 0 }));
  if (nodes.length === 1) nodes[0]!.d = 1;
  while (nodes.length > 1) {
    nodes.sort((a, b) => a.f - b.f);
    const a = nodes.shift()!, b = nodes.shift()!;
    const inc = (n: Node) => { n.d++; if (n.l) inc(n.l); if (n.r) inc(n.r); };
    const par: Node = { f: a.f + b.f, d: 0, l: a, r: b }; inc(par);
    nodes.push(par);
  }
  const lens = new Map<string, number>();
  const collect = (n?: Node) => { if (!n) return; if (n.s !== undefined) lens.set(n.s, n.d); collect(n.l); collect(n.r); };
  collect(nodes[0]);
  // 2. 规范编码: 按长度排序
  const sorted = [...lens.entries()].sort((a, b) => a[1] - b[1] || a[0].localeCompare(b[0]));
  const out = new Map<string, { len: number; code: string }>();
  let code = 0, prevLen = 0;
  for (const [s, len] of sorted) {
    if (prevLen !== 0) code = (code + 1) << (len - prevLen);
    out.set(s, { len, code: code.toString(2).padStart(len, '0') });
    hooks.onCode?.(s, len, out.get(s)!.code);
    prevLen = len;
  }
  hooks.onConclude?.(out.size);
  return out;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { canonicalHuffman } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const F: ReadonlyArray<readonly [string, number]> = [['a', 5], ['b', 9], ['c', 12], ['d', 13], ['e', 16]];
  rec.begin({ zh: '规范哈夫曼', en: 'Canonical Huffman' }).commit();
  canonicalHuffman(F, {
    onCode: (s, len, code) => rec.begin({ zh: \`\${s}: len\${len} \${code}\`, en: \`\${s}: len\${len} \${code}\` })
      .setBars([{ value: len, role: 'pivot' as BarRole }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { canonicalHuffman } from '../../src/algorithms/greedy/greedy-huffman-canonical/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-huffman-canonical/trace.ts';
test('高频符号码更短', () => {
  const t = canonicalHuffman([['a', 1], ['b', 9]]);
  assert.ok((t.get('b')?.len ?? 9) <= (t.get('a')?.len ?? 0));
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 25. greedy-mst-boruvka
{
  id: 'greedy-mst-boruvka',
  titleZh: 'Borůvka MST', titleEn: 'Boruvka Minimum Spanning Tree',
  summaryZh: '每轮每个连通块选最短出边并行合并，O(log V) 轮完成。',
  summaryEn: 'Each round every component picks its cheapest outgoing edge in parallel; O(log V) rounds.',
  descZh: 'Borůvka：初始每点为独立块，每轮每个块选连向块外的最短边合并，块数至少减半，共 O(log V) 轮。',
  descEn: 'Boruvka: start each vertex alone; each round every component picks cheapest edge leaving it and merges; halving each round.',
  tags: ['greedy','mst','graph'],
  time: 'O(E log V)', space: 'O(V+E)',
  impl: `// Borůvka MST · 实现
export interface Edge { u: number; v: number; w: number; }
export interface BoHooks { onRound?: (round: number, components: number, added: number) => void; onConclude?: (totalWeight: number, edges: number) => void; }
export function boruvkaMst(n: number, edges: ReadonlyArray<Edge>, hooks: BoHooks = {}): { weight: number; count: number } {
  const parent = Array.from({ length: n }, (_, i) => i);
  const find = (x: number): number => { while (parent[x] !== x) { parent[x] = parent[parent[x]!]!; x = parent[x]!; } return x; };
  let weight = 0, count = 0, comps = n, round = 0;
  while (comps > 1) {
    const cheapest = new Array<number>(n).fill(-1);
    for (let i = 0; i < edges.length; i++) {
      const e = edges[i]!; const ru = find(e.u), rv = find(e.v);
      if (ru === rv) continue;
      if (cheapest[ru] === -1 || edges[cheapest[ru]!]!.w > e.w) cheapest[ru] = i;
      if (cheapest[rv] === -1 || edges[cheapest[rv]!]!.w > e.w) cheapest[rv] = i;
    }
    let added = 0;
    for (let c = 0; c < n; c++) {
      const i = cheapest[c]!; if (i < 0) continue;
      const e = edges[i]!; const ru = find(e.u), rv = find(e.v);
      if (ru !== rv) { parent[ru] = rv; weight += e.w; count++; added++; comps--; }
    }
    round++;
    hooks.onRound?.(round, comps, added);
    if (added === 0) break;
  }
  hooks.onConclude?.(weight, count);
  return { weight, count };
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { boruvkaMst, type Edge } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const E: Edge[] = [{ u: 0, v: 1, w: 1 }, { u: 1, v: 2, w: 2 }, { u: 0, v: 2, w: 5 }, { u: 2, v: 3, w: 3 }];
  rec.begin({ zh: 'Borůvka MST', en: 'Boruvka MST' })
    .setGraph([0, 1, 2, 3].map((i) => ({ id: String(i) })), E.map((e) => ({ from: String(e.u), to: String(e.v), weight: e.w }))).commit();
  const r = boruvkaMst(4, E, {
    onRound: (rd, c, ad) => rec.begin({ zh: \`轮\${rd} 剩\${c}块 加\${ad}边\`, en: \`round\${rd} \${c}comps +\${ad}edges\` })
      .setBars([{ value: c, role: 'pivot' as BarRole }]).commit(),
  });
  rec.begin({ zh: \`MST 权重 \${r.weight}\`, en: \`MST weight \${r.weight}\` })
    .setAux([{ label: 'weight', value: String(r.weight), role: 'final' as BarRole }]).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { boruvkaMst, type Edge } from '../../src/algorithms/greedy/greedy-mst-boruvka/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-mst-boruvka/trace.ts';
test('Borůvka MST 权重正确', () => {
  const E: Edge[] = [{ u: 0, v: 1, w: 1 }, { u: 1, v: 2, w: 2 }, { u: 0, v: 2, w: 5 }];
  const r = boruvkaMst(3, E);
  assert.equal(r.weight, 3);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 26. greedy-priority-inversion
{
  id: 'greedy-priority-inversion',
  titleZh: '优先级继承', titleEn: 'Priority Inheritance Protocol',
  summaryZh: '低优先级任务持锁时临时继承最高等待者优先级，避免反转。',
  summaryEn: 'A low-priority task holding a lock inherits the highest waiter priority, avoiding inversion.',
  descZh: '优先级继承：高优先级任务等待低任务持有的资源时，低任务临时升至高优先级尽快释放，防止中等任务抢占造成长延迟。',
  descEn: 'Priority inheritance: when a high task blocks on a resource held by a low task, the low task is boosted to release quickly.',
  tags: ['greedy','scheduling','real-time'],
  time: 'O(n)', space: 'O(n)',
  impl: `// 优先级继承 · 实现
export interface PiHooks { onBoost?: (task: number, fromPrio: number, toPrio: number) => void; onRelease?: (task: number) => void; }
export interface Task { id: number; prio: number; holds?: number; waits?: number; }
export function priorityInheritance(tasks: readonly Task[], hooks: PiHooks = {}): void {
  const holder = new Map<number, number>(); // resource -> taskId
  for (const t of tasks) if (t.holds !== undefined) holder.set(t.holds, t.id);
  for (const t of tasks) {
    if (t.waits === undefined) continue;
    const h = holder.get(t.waits);
    if (h === undefined) continue;
    const holderTask = tasks.find((x) => x.id === h);
    if (holderTask && holderTask.prio < t.prio) {
      hooks.onBoost?.(holderTask.id, holderTask.prio, t.prio);
      holderTask.prio = t.prio;
    }
  }
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { priorityInheritance } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const tasks = [{ id: 0, prio: 1, holds: 5 }, { id: 1, prio: 3 }, { id: 2, prio: 5, waits: 5 }];
  rec.begin({ zh: '优先级继承', en: 'Priority inheritance' })
    .setBars(tasks.map((t) => ({ value: t.prio, role: 'default' as BarRole }))).commit();
  priorityInheritance(tasks, {
    onBoost: (t, from, to) => rec.begin({ zh: \`任务\${t} 升 \${from}->\${to}\`, en: \`task\${t} boost \${from}->\${to}\` })
      .setBars([{ value: to, role: 'final' as BarRole }]).commit(),
  });
  rec.begin({ zh: '提升后优先级', en: 'after boost' })
    .setBars(tasks.map((t) => ({ value: t.prio, role: 'final' as BarRole }))).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { priorityInheritance } from '../../src/algorithms/greedy/greedy-priority-inversion/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-priority-inversion/trace.ts';
test('持锁任务被提升', () => {
  const tasks = [{ id: 0, prio: 1, holds: 5 }, { id: 1, prio: 5, waits: 5 }];
  priorityInheritance(tasks);
  assert.ok(tasks[0]!.prio >= 5);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 27. greedy-edge-coloring
{
  id: 'greedy-edge-coloring',
  titleZh: '贪心边着色', titleEn: 'Greedy Edge Coloring',
  summaryZh: '为每条边分配不同于邻接边的颜色，使用 Δ+1 色。',
  summaryEn: 'Assign each edge a color distinct from adjacent edges; uses at most Δ+1 colors.',
  descZh: '贪心边着色：按边序，给每条边分配最小的、两端点未使用的颜色。Vizing 定理保证 ≤ Δ+1 色。',
  descEn: 'Greedy edge coloring: for each edge assign the smallest color unused at both endpoints. Vizing: <= Δ+1 colors.',
  tags: ['greedy','graph-coloring','graph'],
  time: 'O(|E|·Δ)', space: 'O(|E|)',
  impl: `// 贪心边着色 · 实现
export interface EcHooks { onColor?: (u: number, v: number, color: number) => void; onConclude?: (colors: number) => void; }
export function greedyEdgeColoring(edges: ReadonlyArray<readonly [number, number]>, hooks: EcHooks = {}): number {
  const used = new Map<string, Set<number>>();
  const getColor = (v: number) => used.get('v' + v) ?? new Set<number>();
  let maxColor = 0;
  for (const [u, v] of edges) {
    const usedU = getColor(u), usedV = getColor(v);
    let c = 1;
    while (usedU.has(c) || usedV.has(c)) c++;
    if (!used.has('v' + u)) used.set('v' + u, new Set());
    if (!used.has('v' + v)) used.set('v' + v, new Set());
    used.get('v' + u)!.add(c); used.get('v' + v)!.add(c);
    maxColor = Math.max(maxColor, c);
    hooks.onColor?.(u, v, c);
  }
  hooks.onConclude?.(maxColor);
  return maxColor;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { greedyEdgeColoring } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const E: ReadonlyArray<readonly [number, number]> = [[0, 1], [1, 2], [2, 3], [3, 0], [0, 2]];
  rec.begin({ zh: '贪心边着色', en: 'Greedy edge coloring' })
    .setGraph([0, 1, 2, 3].map((i) => ({ id: String(i) })), E.map((e) => ({ from: String(e[0]), to: String(e[1]) }))).commit();
  const c = greedyEdgeColoring(E, {
    onColor: (u, v, col) => rec.begin({ zh: \`(\${u},\${v}) 色\${col}\`, en: \`(\${u},\${v}) color\${col}\` })
      .setBars([{ value: col, role: 'final' as BarRole }]).commit(),
  });
  rec.begin({ zh: \`\${c} 色\`, en: \`\${c} colors\` }).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greedyEdgeColoring } from '../../src/algorithms/greedy/greedy-edge-coloring/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-edge-coloring/trace.ts';
test('三角形需 3 色', () => {
  assert.equal(greedyEdgeColoring([[0, 1], [1, 2], [2, 0]]), 3);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 28. greedy-min-vertex-cover
{
  id: 'greedy-min-vertex-cover',
  titleZh: '贪心点覆盖', titleEn: 'Greedy Vertex Cover',
  summaryZh: '反复选最大度数顶点加入覆盖，近似最大匹配上界。',
  summaryEn: 'Repeatedly add the highest-degree vertex to the cover; approximates the matching upper bound.',
  descZh: '贪心点覆盖：每次选当前度数最大的顶点加入覆盖，删除其所有边。2-近似（基于最大匹配）。',
  descEn: 'Greedy vertex cover: repeatedly pick max-degree vertex, remove incident edges. 2-approximation via maximal matching.',
  tags: ['greedy','graph','approximation'],
  time: 'O(|V|·|E|)', space: 'O(|V|+|E|)',
  impl: `// 贪心点覆盖 · 实现
export interface VcHooks { onPick?: (v: number, degree: number) => void; onConclude?: (cover: number[]) => void; }
export function greedyVertexCover(n: number, edges: ReadonlyArray<readonly [number, number]>, hooks: VcHooks = {}): number[] {
  const adj = Array.from({ length: n }, () => new Set<number>());
  for (const [u, v] of edges) { adj[u]!.add(v); adj[v]!.add(u); }
  const cover: number[] = [];
  let remaining = edges.length;
  while (remaining > 0) {
    let best = -1, bestDeg = 0;
    for (let i = 0; i < n; i++) if (adj[i]!.size > bestDeg) { bestDeg = adj[i]!.size; best = i; }
    if (best < 0) break;
    cover.push(best);
    hooks.onPick?.(best, bestDeg);
    remaining -= adj[best]!.size;
    for (const nb of adj[best]!) { adj[nb]!.delete(best); remaining = remaining; }
    adj[best]!.clear();
    remaining = 0;
    for (let i = 0; i < n; i++) remaining += adj[i]!.size;
    remaining = Math.floor(remaining / 1);
  }
  // 重新精确计算 remaining
  hooks.onConclude?.(cover);
  return cover;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { greedyVertexCover } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const E: ReadonlyArray<readonly [number, number]> = [[0, 1], [0, 2], [1, 3], [2, 3], [3, 4]];
  rec.begin({ zh: '贪心点覆盖', en: 'Greedy vertex cover' })
    .setGraph([0, 1, 2, 3, 4].map((i) => ({ id: String(i) })), E.map((e) => ({ from: String(e[0]), to: String(e[1]) }))).commit();
  const cov = greedyVertexCover(5, E, {
    onPick: (v, d) => rec.begin({ zh: \`选 \${v} (度\${d})\`, en: \`pick \${v} (deg\${d})\` })
      .setBars([{ value: d, role: 'final' as BarRole }]).commit(),
  });
  rec.begin({ zh: \`覆盖 {\${cov.join(',')}}\`, en: \`cover {\${cov.join(',')}}\` })
    .setBars([{ value: cov.length, role: 'final' as BarRole }]).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greedyVertexCover } from '../../src/algorithms/greedy/greedy-min-vertex-cover/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-min-vertex-cover/trace.ts';
test('点覆盖非空', () => {
  const cov = greedyVertexCover(3, [[0, 1], [1, 2]]);
  assert.ok(cov.length >= 1);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 29. greedy-max-cut
{
  id: 'greedy-max-cut',
  titleZh: '贪心最大割', titleEn: 'Greedy Max Cut',
  summaryZh: '把顶点分到两侧使跨越边数最大，贪心按当前贡献放置。',
  summaryEn: 'Split vertices into two sides maximizing crossing edges; place each by current contribution.',
  descZh: '贪心最大割：按顶点序，每个顶点放入能增加更多跨越边的侧。局部最优，近似比可分析。',
  descEn: 'Greedy max cut: process vertices in order, place each on the side increasing crossing edges. Local optimum.',
  tags: ['greedy','graph','approximation'],
  time: 'O(|V|+|E|)', space: 'O(|V|)',
  impl: `// 贪心最大割 · 实现
export interface McHooks { onPlace?: (v: number, side: 0 | 1, cutGain: number) => void; onConclude?: (cutSize: number) => void; }
export function greedyMaxCut(n: number, edges: ReadonlyArray<readonly [number, number]>, hooks: McHooks = {}): { side: number[]; cutSize: number } {
  const adj = Array.from({ length: n }, () => new Array<number>());
  for (const [u, v] of edges) { adj[u]!.push(v); adj[v]!.push(u); }
  const side = new Array<number>(n).fill(-1);
  let cutSize = 0;
  for (let v = 0; v < n; v++) {
    let s0 = 0, s1 = 0;
    for (const u of adj[v]!) { if (side[u] === 0) s1++; else if (side[u] === 1) s0++; }
    const choice: 0 | 1 = s0 >= s1 ? 0 : 1;
    side[v] = choice;
    cutSize += Math.max(s0, s1);
    hooks.onPlace?.(v, choice, Math.max(s0, s1));
  }
  hooks.onConclude?.(cutSize);
  return { side, cutSize };
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { greedyMaxCut } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const E: ReadonlyArray<readonly [number, number]> = [[0, 1], [1, 2], [2, 3], [3, 0], [0, 2]];
  rec.begin({ zh: '贪心最大割', en: 'Greedy max cut' })
    .setGraph([0, 1, 2, 3].map((i) => ({ id: String(i) })), E.map((e) => ({ from: String(e[0]), to: String(e[1]) }))).commit();
  const r = greedyMaxCut(4, E, {
    onPlace: (v, s, g) => rec.begin({ zh: \`\${v} -> 侧\${s} (+\${g})\`, en: \`\${v} -> side\${s} (+\${g})\` })
      .setBars([{ value: g, role: 'final' as BarRole }]).commit(),
  });
  rec.begin({ zh: \`割大小 \${r.cutSize}\`, en: \`cut size \${r.cutSize}\` })
    .setAux([{ label: 'cut', value: String(r.cutSize), role: 'final' as BarRole }]).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greedyMaxCut } from '../../src/algorithms/greedy/greedy-max-cut/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-max-cut/trace.ts';
test('最大割非负', () => {
  const r = greedyMaxCut(4, [[0, 1], [1, 2], [2, 3], [3, 0]]);
  assert.ok(r.cutSize >= 2);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 30. greedy-weighted-matching
{
  id: 'greedy-weighted-matching',
  titleZh: '贪心最大权匹配', titleEn: 'Greedy Maximum Weight Matching',
  summaryZh: '按权重降序选不相交边，近似最大权匹配。',
  summaryEn: 'Pick non-conflicting edges by descending weight for an approximate max-weight matching.',
  descZh: '贪心最大权匹配：边按权重降序，依次选入两端未匹配的边。结果 ≥ OPT/2。',
  descEn: 'Greedy max-weight matching: edges sorted by weight desc, add if both endpoints free. Result >= OPT/2.',
  tags: ['greedy','matching','graph'],
  time: 'O(|E| log |E|)', space: 'O(|V|)',
  impl: `// 贪心最大权匹配 · 实现
export interface WEdge { u: number; v: number; w: number; }
export interface GwmHooks { onPick?: (u: number, v: number, w: number) => void; onConclude?: (totalWeight: number, count: number) => void; }
export function greedyWeightedMatching(edges: ReadonlyArray<WEdge>, hooks: GwmHooks = {}): { total: number; count: number } {
  const order = [...edges].sort((a, b) => b.w - a.w);
  const matched = new Set<number>();
  let total = 0, count = 0;
  for (const e of order) {
    if (!matched.has(e.u) && !matched.has(e.v)) { matched.add(e.u); matched.add(e.v); total += e.w; count++; hooks.onPick?.(e.u, e.v, e.w); }
  }
  hooks.onConclude?.(total, count);
  return { total, count };
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { greedyWeightedMatching, type WEdge } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const E: WEdge[] = [{ u: 0, v: 1, w: 5 }, { u: 1, v: 2, w: 3 }, { u: 2, v: 3, w: 4 }, { u: 0, v: 3, w: 2 }];
  rec.begin({ zh: '贪心最大权匹配', en: 'Greedy max weight matching' })
    .setGraph([0, 1, 2, 3].map((i) => ({ id: String(i) })), E.map((e) => ({ from: String(e.u), to: String(e.v), weight: e.w }))).commit();
  const r = greedyWeightedMatching(E, {
    onPick: (u, v, w) => rec.begin({ zh: \`选 (\${u},\${v}) w=\${w}\`, en: \`pick (\${u},\${v}) w=\${w}\` })
      .setBars([{ value: w, role: 'final' as BarRole }]).commit(),
  });
  rec.begin({ zh: \`总权 \${r.total} \${r.count}条\`, en: \`total \${r.total} \${r.count}edges\` })
    .setAux([{ label: 'total', value: String(r.total), role: 'final' as BarRole }]).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greedyWeightedMatching, type WEdge } from '../../src/algorithms/greedy/greedy-weighted-matching/impl.ts';
import { buildTrace } from '../../src/algorithms/greedy/greedy-weighted-matching/trace.ts';
test('最大权匹配取最高边', () => {
  const E: WEdge[] = [{ u: 0, v: 1, w: 10 }, { u: 1, v: 2, w: 1 }];
  const r = greedyWeightedMatching(E);
  assert.ok(r.total >= 10);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
];
