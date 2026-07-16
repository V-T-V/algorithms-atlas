// Generator for the remaining game algorithms with distinct logic.
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = 'D:/M_X_M/algorithms-atlas';
const CAT = 'game';
const INDEX = `import type { Demo } from '../../../types.ts';
import { buildTrace } from './trace.ts';
export { meta } from './meta.ts';
export async function createDemo(): Promise<Demo> {
  const { meta } = await import('./meta.ts');
  return { meta, buildTrace };
}
`;

function writeAlg(id, meta, impl, trace, test) {
  const dir = join(ROOT, 'src/algorithms', CAT, id);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'meta.ts'), meta);
  writeFileSync(join(dir, 'impl.ts'), impl);
  writeFileSync(join(dir, 'trace.ts'), trace);
  writeFileSync(join(dir, 'index.ts'), INDEX);
  const testDir = join(ROOT, 'test', CAT);
  mkdirSync(testDir, { recursive: true });
  writeFileSync(join(testDir, `${id}.test.ts`), test);
}

// --- Vickrey auction (sealed second-price, truthful bidding is dominant) ---
writeAlg(
  'game-vickrey',
  `// 维克里拍卖 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'game-vickrey',
  categoryId: 'game',
  title: { zh: '维克里拍卖', en: 'Vickrey Auction' },
  summary: { zh: '密封二价拍卖：最高出价者中标但付次高价，诚实出价是占优策略。', en: 'Sealed second-price auction: highest bidder wins but pays the second-highest bid; truthful bidding is dominant.' },
  description: { zh: '维克里拍卖（Vickrey 1961）：单物品、密封投标、最高出价中标、支付次高。在私人估值下，如实报自己的估值是（弱）占优策略，机制是激励相容的。', en: 'Vickrey auction (Vickrey 1961): single item, sealed bids, highest bidder wins, pays second-highest. With private values, truthful bidding is a (weakly) dominant strategy; the mechanism is incentive compatible.' },
  tags: ['game', 'auction', 'mechanism-design'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};`,
  `// 维克里拍卖 · 实现（密封二价）
export interface VickreyHooks {
  onWinner?: (winnerIdx: number, winningBid: number, price: number) => void;
  onPayoff?: (idx: number, payoff: number) => void;
}
export interface VickreyResult { winnerIdx: number; price: number; payoffs: number[]; }
export function gameVickrey(bids: readonly number[], values: readonly number[], hooks: VickreyHooks = {}): VickreyResult {
  if (bids.length < 2) throw new Error('至少需要 2 位竞拍者 / need at least 2 bidders');
  let winnerIdx = 0;
  let highest = bids[0]!;
  let second = -Infinity;
  for (let i = 1; i < bids.length; i++) {
    if (bids[i]! > highest) { second = highest; highest = bids[i]!; winnerIdx = i; }
    else if (bids[i]! > second) second = bids[i]!;
  }
  if (second === -Infinity) second = highest;
  const price = second;
  hooks.onWinner?.(winnerIdx, highest, price);
  const payoffs = bids.map((_, i) => (i === winnerIdx ? values[i]! - price : 0));
  payoffs.forEach((p, i) => hooks.onPayoff?.(i, p));
  return { winnerIdx, price, payoffs };
}`,
  `// 维克里拍卖 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { gameVickrey } from './impl.ts';
export const DEFAULT_INPUT = { bids: [12, 25, 18], values: [12, 25, 18] };
export function buildTrace(input: { bids?: number[]; values?: number[] } = {}): Frame[] {
  const { bids = DEFAULT_INPUT.bids, values = DEFAULT_INPUT.values } = input;
  const rec = new TraceRecorder();
  rec.begin({ zh: '维克里拍卖：诚实出价占优', en: 'Vickrey auction: truthful bidding dominant' })
    .setBars(bids.map((b, i) => ({ value: b, role: 'default' as BarRole, label: \`b\${i}=\${b}\` }))).commit();
  const r = gameVickrey(bids, values);
  rec.begin({ zh: \`中标 #\${r.winnerIdx}，付次高 \${r.price}\`, en: \`Winner #\${r.winnerIdx}, pays second \${r.price}\` })
    .setBars(bids.map((b, i) => ({ value: b, role: (i === r.winnerIdx ? 'final' : 'default') as BarRole, label: \`p\${i}=\${r.payoffs[i]}\` })))
    .setAux([{ label: '成交价', value: String(r.price), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gameVickrey } from '../../src/algorithms/game/game-vickrey/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-vickrey/trace.ts';

test('维克里：诚实出价 → 中标者付次高价', () => {
  const r = gameVickrey([12, 25, 18], [12, 25, 18]);
  assert.equal(r.winnerIdx, 1);
  assert.equal(r.price, 18);
});

test('维克里：诚实出价收益非负', () => {
  const r = gameVickrey([12, 25, 18], [12, 25, 18]);
  for (const p of r.payoffs) assert.ok(p >= 0);
});

test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length >= 2);
});`,
);

// --- First-price sealed-bid auction ---
writeAlg(
  'game-first-price',
  `// 第一价格密封拍卖 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'game-first-price',
  categoryId: 'game',
  title: { zh: '第一价格密封拍卖', en: 'First-Price Sealed-Bid Auction' },
  summary: { zh: '最高出价者中标并付自己的出价；理性出价需低于估值（bid shading）。', en: 'Highest bidder wins and pays their own bid; rational bidding is below valuation (bid shading).' },
  description: { zh: '第一价格密封拍卖：中标者付最高价（自己的出价）。纳什均衡下，出价 = 估值 × (n-1)/n（n 个对称风险中性竞拍者、均匀估值）。', en: 'First-price sealed-bid: winner pays the top bid. Nash equilibrium bid = valuation × (n-1)/n for n symmetric risk-neutral bidders with uniform valuations.' },
  tags: ['game', 'auction'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};`,
  `// 第一价格密封拍卖 · 实现
export interface FirstPriceHooks {
  onWinner?: (winnerIdx: number, bid: number) => void;
  onPayoff?: (idx: number, payoff: number) => void;
}
export interface FirstPriceResult { winnerIdx: number; payment: number; payoffs: number[]; }
export function gameFirstPrice(bids: readonly number[], values: readonly number[], hooks: FirstPriceHooks = {}): FirstPriceResult {
  if (bids.length === 0) throw new Error('bids 不能为空 / bids must be non-empty');
  let winnerIdx = 0;
  let highest = bids[0]!;
  for (let i = 1; i < bids.length; i++) if (bids[i]! > highest) { highest = bids[i]!; winnerIdx = i; }
  hooks.onWinner?.(winnerIdx, highest);
  const payoffs = bids.map((_, i) => (i === winnerIdx ? values[i]! - highest : 0));
  payoffs.forEach((p, i) => hooks.onPayoff?.(i, p));
  return { winnerIdx, payment: highest, payoffs };
}
/** 对称风险中性竞拍者的均衡出价（n 人均匀估值）：v*(n-1)/n。 */
export function firstPriceEquilibriumBid(v: number, n: number): number {
  return v * (n - 1) / n;
}`,
  `// 第一价格密封拍卖 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { gameFirstPrice, firstPriceEquilibriumBid } from './impl.ts';
export const DEFAULT_INPUT = { bids: [8, 12, 10], values: [10, 15, 12] };
export function buildTrace(input: { bids?: number[]; values?: number[] } = {}): Frame[] {
  const { bids = DEFAULT_INPUT.bids, values = DEFAULT_INPUT.values } = input;
  const rec = new TraceRecorder();
  rec.begin({ zh: '第一价格密封拍卖', en: 'First-price sealed-bid auction' })
    .setBars(bids.map((b, i) => ({ value: b, role: 'default' as BarRole, label: \`b\${i}=\${b}\` }))).commit();
  const r = gameFirstPrice(bids, values);
  const eq = bids.map((_, i) => firstPriceEquilibriumBid(values[i]!, bids.length));
  rec.begin({ zh: \`中标 #\${r.winnerIdx}，付 \${r.payment}\`, en: \`Winner #\${r.winnerIdx}, pays \${r.payment}\` })
    .setBars(bids.map((b, i) => ({ value: b, role: (i === r.winnerIdx ? 'final' : 'default') as BarRole, label: \`eq\${i}=\${eq[i]!.toFixed(1)}\` })))
    .setAux([{ label: '成交价', value: String(r.payment), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gameFirstPrice, firstPriceEquilibriumBid } from '../../src/algorithms/game/game-first-price/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-first-price/trace.ts';

test('第一价格：中标者付自己的最高出价', () => {
  const r = gameFirstPrice([8, 12, 10], [10, 15, 12]);
  assert.equal(r.winnerIdx, 1);
  assert.equal(r.payment, 12);
});

test('均衡出价公式 v*(n-1)/n', () => {
  assert.equal(firstPriceEquilibriumBid(10, 2), 5);
  assert.equal(firstPriceEquilibriumBid(10, 3), 10 * 2 / 3);
});

test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length >= 2);
});`,
);

// --- Second-price auction (general, IPVP) ---
writeAlg(
  'game-second-price',
  `// 第二价格拍卖 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'game-second-price',
  categoryId: 'game',
  title: { zh: '第二价格拍卖', en: 'Second-Price Auction' },
  summary: { zh: '最高出价中标、付次高价；占优策略是诚实出价。', en: 'Highest bid wins and pays the second-highest; truthful bidding is dominant.' },
  description: { zh: '第二价格密封拍卖（与维克里拍卖同义）。在独立私人估值 (IPV) 下，诚实出价是（弱）占优策略，使分配有效率。', en: 'Second-price sealed-bid auction (synonymous with Vickrey). Under independent private values, truthful bidding is a (weakly) dominant strategy and the allocation is efficient.' },
  tags: ['game', 'auction'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};`,
  `// 第二价格拍卖 · 实现（与 game-auction-2 second-price 等价但独立、强调占优策略）
export interface SecondPriceHooks {
  onWinner?: (winnerIdx: number, price: number) => void;
  onPayoff?: (idx: number, payoff: number) => void;
}
export interface SecondPriceResult { winnerIdx: number; price: number; payoffs: number[]; }
export function gameSecondPrice(bids: readonly number[], values: readonly number[], hooks: SecondPriceHooks = {}): SecondPriceResult {
  if (bids.length < 1) throw new Error('bids 不能为空 / bids must be non-empty');
  let winnerIdx = 0;
  let highest = bids[0]!;
  let second = -Infinity;
  for (let i = 1; i < bids.length; i++) {
    if (bids[i]! > highest) { second = highest; highest = bids[i]!; winnerIdx = i; }
    else if (bids[i]! > second) second = bids[i]!;
  }
  const price = second === -Infinity ? 0 : second;
  hooks.onWinner?.(winnerIdx, price);
  const payoffs = bids.map((_, i) => (i === winnerIdx ? values[i]! - price : 0));
  payoffs.forEach((p, i) => hooks.onPayoff?.(i, p));
  return { winnerIdx, price, payoffs };
}
/** 单人中标的支付为 0（次高价=自身，退化情形按 0 处理）。 */`,
  `// 第二价格拍卖 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { gameSecondPrice } from './impl.ts';
export const DEFAULT_INPUT = { bids: [12, 25, 18], values: [12, 25, 18] };
export function buildTrace(input: { bids?: number[]; values?: number[] } = {}): Frame[] {
  const { bids = DEFAULT_INPUT.bids, values = DEFAULT_INPUT.values } = input;
  const rec = new TraceRecorder();
  rec.begin({ zh: '第二价格拍卖（诚实占优）', en: 'Second-price auction (truthful)' })
    .setBars(bids.map((b, i) => ({ value: b, role: 'default' as BarRole, label: \`b\${i}\` }))).commit();
  const r = gameSecondPrice(bids, values);
  rec.begin({ zh: \`中标 #\${r.winnerIdx}，付 \${r.price}\`, en: \`Winner #\${r.winnerIdx}, pays \${r.price}\` })
    .setBars(bids.map((b, i) => ({ value: b, role: (i === r.winnerIdx ? 'final' : 'default') as BarRole, label: \`p\${i}=\${r.payoffs[i]}\` })))
    .setAux([{ label: '成交价', value: String(r.price), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gameSecondPrice } from '../../src/algorithms/game/game-second-price/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-second-price/trace.ts';

test('第二价格：付次高价', () => {
  const r = gameSecondPrice([12, 25, 18], [12, 25, 18]);
  assert.equal(r.winnerIdx, 1);
  assert.equal(r.price, 18);
});

test('诚实出价收益非负', () => {
  const r = gameSecondPrice([12, 25, 18], [12, 25, 18]);
  for (const p of r.payoffs) assert.ok(p >= 0);
});

test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length >= 2);
});`,
);

// --- All-pay auction ---
writeAlg(
  'game-all-pay',
  `// 全付拍卖 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'game-all-pay',
  categoryId: 'game',
  title: { zh: '全付拍卖', en: 'All-Pay Auction' },
  summary: { zh: '所有竞拍者都付自己的出价，无论是否中标；常用于游说/竞赛建模。', en: 'All bidders pay their bid regardless of winning; models lobbying and contests.' },
  description: { zh: '全付拍卖：最高出价者中标，但每个人都付自己的出价（典型例子是政治游说、R&D 竞赛）。对称均衡下出价 = v^n × (n-1)/n 的期望（均匀估值）。', en: 'All-pay auction: highest bidder wins, but everyone pays their own bid (classic model for lobbying and R&D races). Symmetric equilibrium bid has closed form under uniform valuations.' },
  tags: ['game', 'auction', 'contest'],
  complexity: { time: 'O(n)', space: 'O(1)' },
};`,
  `// 全付拍卖 · 实现
export interface AllPayHooks {
  onWinner?: (winnerIdx: number, highestBid: number) => void;
  onPayoff?: (idx: number, payoff: number) => void;
}
export interface AllPayResult { winnerIdx: number; payoffs: number[]; totalPaid: number; }
export function gameAllPay(bids: readonly number[], values: readonly number[], hooks: AllPayHooks = {}): AllPayResult {
  if (bids.length === 0) throw new Error('bids 不能为空 / bids must be non-empty');
  let winnerIdx = 0;
  let highest = bids[0]!;
  for (let i = 1; i < bids.length; i++) if (bids[i]! > highest) { highest = bids[i]!; winnerIdx = i; }
  hooks.onWinner?.(winnerIdx, highest);
  const payoffs = bids.map((b, i) => (i === winnerIdx ? values[i]! - b : -b));
  let totalPaid = 0;
  payoffs.forEach((p, i) => { hooks.onPayoff?.(i, p); totalPaid += bids[i]!; });
  return { winnerIdx, payoffs, totalPaid };
}`,
  `// 全付拍卖 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { gameAllPay } from './impl.ts';
export const DEFAULT_INPUT = { bids: [5, 8, 6], values: [10, 15, 12] };
export function buildTrace(input: { bids?: number[]; values?: number[] } = {}): Frame[] {
  const { bids = DEFAULT_INPUT.bids, values = DEFAULT_INPUT.values } = input;
  const rec = new TraceRecorder();
  rec.begin({ zh: '全付拍卖：每人都要付', en: 'All-pay auction: everyone pays' })
    .setBars(bids.map((b, i) => ({ value: b, role: 'default' as BarRole, label: \`b\${i}=\${b}\` }))).commit();
  const r = gameAllPay(bids, values);
  rec.begin({ zh: \`中标 #\${r.winnerIdx}，总付出 \${r.totalPaid}\`, en: \`Winner #\${r.winnerIdx}, total paid \${r.totalPaid}\` })
    .setBars(bids.map((b, i) => ({ value: b, role: (i === r.winnerIdx ? 'final' : 'warn') as BarRole, label: \`p\${i}=\${r.payoffs[i]}\` })))
    .setAux([
      { label: '总付出', value: String(r.totalPaid), role: 'final' as BarRole },
      { label: '中标者', value: \`#\${r.winnerIdx}\`, role: 'compare' as BarRole },
    ]).commit();
  return rec.build();
}`,
  `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gameAllPay } from '../../src/algorithms/game/game-all-pay/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-all-pay/trace.ts';

test('全付：中标者得估值-出价，失败者付 -出价', () => {
  const r = gameAllPay([5, 8, 6], [10, 15, 12]);
  assert.equal(r.winnerIdx, 1);
  assert.equal(r.payoffs[0], -5);
  assert.equal(r.payoffs[1], 15 - 8);
  assert.equal(r.payoffs[2], -6);
});

test('全付：总付出 = 所有出价之和', () => {
  const r = gameAllPay([5, 8, 6], [10, 15, 12]);
  assert.equal(r.totalPaid, 19);
});

test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length >= 2);
});`,
);

// --- War of Attrition ---
writeAlg(
  'game-war-of-attrition',
  `// 消耗战博弈 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'game-war-of-attrition',
  categoryId: 'game',
  title: { zh: '消耗战博弈', en: 'War of Attrition' },
  summary: { zh: '两玩家争资源持续到一方退出；坚持成本随时间线性增长。', en: 'Two players contest a resource until one quits; persistence cost grows with time.' },
  description: { zh: '消耗战（生物学经典）：每单位时间成本 1，胜者得资源价值 V，败者付出坚持到的时间。对称混合均衡：每个玩家以一定概率坚持到任意时间 t。', en: 'War of attrition (biology classic): per-unit-time cost 1, winner earns V, loser pays up to their persistence time. Symmetric mixed equilibrium exists.' },
  tags: ['game', 'game-theory', 'biology'],
  complexity: { time: 'O(1)', space: 'O(1)' },
};`,
  `// 消耗战 · 实现
// 两玩家各坚持时间 t1, t2；min(t1,t2) 为败者退出时间，胜者得 V，败者付出该时间；并列则平分 V。
export interface WarOfAttritionHooks {
  onResolve?: (winner: 0 | 1 | -1, duration: number) => void;
  onPayoff?: (p0: number, p1: number) => void;
}
export interface WarOfAttritionResult { winner: 0 | 1 | -1; duration: number; payoffs: [number, number]; }
export function gameWarOfAttrition(
  t1: number, t2: number, V: number, hooks: WarOfAttritionHooks = {},
): WarOfAttritionResult {
  if (t1 < 0 || t2 < 0) throw new Error('时间必须 >= 0 / times must be non-negative');
  let winner: 0 | 1 | -1;
  let duration: number;
  let p0: number;
  let p1: number;
  if (t1 === t2) {
    winner = -1;
    duration = t1;
    p0 = V / 2 - t1;
    p1 = V / 2 - t2;
  } else if (t1 > t2) {
    winner = 0;
    duration = t2;
    p0 = V - t2;
    p1 = -t2;
  } else {
    winner = 1;
    duration = t1;
    p0 = -t1;
    p1 = V - t1;
  }
  hooks.onResolve?.(winner, duration);
  hooks.onPayoff?.(p0, p1);
  return { winner, duration, payoffs: [p0, p1] };
}`,
  `// 消耗战 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { gameWarOfAttrition } from './impl.ts';
export const DEFAULT_INPUT = { t1: 3, t2: 5, V: 8 };
export function buildTrace(input: { t1?: number; t2?: number; V?: number } = {}): Frame[] {
  const { t1 = DEFAULT_INPUT.t1, t2 = DEFAULT_INPUT.t2, V = DEFAULT_INPUT.V } = input;
  const rec = new TraceRecorder();
  rec.begin({ zh: \`消耗战：玩家1坚持 \${t1}，玩家2坚持 \${t2}，资源 V=\${V}\`, en: \`War of attrition: p1 holds \${t1}, p2 holds \${t2}, V=\${V}\` })
    .setBars([
      { value: t1, role: 'compare' as BarRole, label: 'p1' },
      { value: t2, role: 'compare' as BarRole, label: 'p2' },
    ]).commit();
  const r = gameWarOfAttrition(t1, t2, V);
  const w = r.winner === -1 ? '并列' : \`玩家 \${r.winner + 1}\`;
  rec.begin({ zh: \`\${w} 胜，耗时 \${r.duration}，收益 (\${r.payoffs[0]}, \${r.payoffs[1]})\`, en: \`\${r.winner === -1 ? 'tie' : 'p' + (r.winner + 1)} wins after \${r.duration}, payoffs (\${r.payoffs[0]}, \${r.payoffs[1]})\` })
    .setBars([
      { value: r.payoffs[0]!, role: 'final' as BarRole, label: 'u1' },
      { value: r.payoffs[1]!, role: 'final' as BarRole, label: 'u2' },
    ]).commit();
  return rec.build();
}`,
  `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gameWarOfAttrition } from '../../src/algorithms/game/game-war-of-attrition/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-war-of-attrition/trace.ts';

test('玩家1坚持更久则胜', () => {
  const r = gameWarOfAttrition(5, 3, 8);
  assert.equal(r.winner, 0);
  assert.equal(r.payoffs[0], 8 - 3);
  assert.equal(r.payoffs[1], -3);
});

test('并列则平分 V', () => {
  const r = gameWarOfAttrition(3, 3, 8);
  assert.equal(r.winner, -1);
  assert.equal(r.payoffs[0], 4 - 3);
  assert.equal(r.payoffs[1], 4 - 3);
});

test('负时间拒绝', () => {
  assert.throws(() => gameWarOfAttrition(-1, 2, 5));
});

test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length >= 2);
});`,
);

// --- Repeated game (Tit-for-Tat vs Always Defect) ---
writeAlg(
  'game-repeated-game',
  `// 重复博弈 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'game-repeated-game',
  categoryId: 'game',
  title: { zh: '重复博弈', en: 'Repeated Game' },
  summary: { zh: '把单次囚徒困境重复 T 轮；触发策略（如 Tit-for-Tat）可维持合作。', en: 'Repeat a stage game (PD) for T rounds; trigger strategies (Tit-for-Tat) can sustain cooperation.' },
  description: { zh: '重复博弈：每轮玩一次阶段博弈。在无限/足够长有限重复中，子博弈完美均衡可支持合作，只要贴现因子 δ 足够大使未来报复威慑足够强。本实现模拟 Tit-for-Tat 对 Always-Defect 的轨迹。', en: 'Repeated game: play a stage game each round. With infinite or long finite repetition, subgame-perfect equilibria can sustain cooperation if discount δ is high enough. This simulates Tit-for-Tat vs Always-Defect.' },
  tags: ['game', 'game-theory', 'repeated'],
  complexity: { time: 'O(T)', space: 'O(T)' },
};`,
  `// 重复博弈 · 实现（囚徒困境阶段，Tit-for-Tat vs AllD）
export type Strategy = (oppLastMove: 'C' | 'D' | null) => 'C' | 'D';
export interface RepeatedGameHooks {
  onRound?: (round: number, a1: 'C' | 'D', a2: 'C' | 'D', u1: number, u2: number) => void;
  onConclude?: (totalU1: number, totalU2: number) => void;
}
export interface RepeatedGameResult { totalU1: number; totalU2: number; history: Array<{ a1: 'C' | 'D'; a2: 'C' | 'D' }>; }
export const TIT_FOR_TAT: Strategy = (opp) => (opp === null ? 'C' : opp);
export const ALWAYS_DEFECT: Strategy = () => 'D';
export const ALWAYS_COOPERATE: Strategy = () => 'C';
// PD 收益：T=5, R=3, P=1, S=0
const PD: Record<string, [number, number]> = {
  'CC': [3, 3], 'CD': [0, 5], 'DC': [5, 0], 'DD': [1, 1],
};
export function gameRepeatedGame(
  s1: Strategy, s2: Strategy, rounds: number, hooks: RepeatedGameHooks = {},
): RepeatedGameResult {
  let last1: 'C' | 'D' | null = null;
  let last2: 'C' | 'D' | null = null;
  let totalU1 = 0;
  let totalU2 = 0;
  const history: Array<{ a1: 'C' | 'D'; a2: 'C' | 'D' }> = [];
  for (let r = 1; r <= rounds; r++) {
    const a1 = s1(last2);
    const a2 = s2(last1);
    const [u1, u2] = PD[\`\${a1}\${a2}\`]!;
    totalU1 += u1;
    totalU2 += u2;
    history.push({ a1, a2 });
    hooks.onRound?.(r, a1, a2, u1, u2);
    last1 = a1;
    last2 = a2;
  }
  hooks.onConclude?.(totalU1, totalU2);
  return { totalU1, totalU2, history };
}`,
  `// 重复博弈 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { gameRepeatedGame, TIT_FOR_TAT, ALWAYS_DEFECT } from './impl.ts';
export const DEFAULT_INPUT = { rounds: 6 };
export function buildTrace(input: { rounds?: number } = {}): Frame[] {
  const { rounds = DEFAULT_INPUT.rounds } = input;
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Tit-for-Tat vs Always-Defect（6 轮）', en: 'Tit-for-Tat vs Always-Defect (6 rounds)' })
    .setAux([{ label: '说明', value: 'TFT 首轮合作随后模仿对手', role: 'pivot' as BarRole }]).commit();
  let cum1 = 0;
  let cum2 = 0;
  gameRepeatedGame(TIT_FOR_TAT, ALWAYS_DEFECT, rounds, {
    onRound: (r, a1, a2, u1, u2) => {
      cum1 += u1;
      cum2 += u2;
      rec.begin({ zh: \`第 \${r} 轮：TFT=\${a1}, AllD=\${a2}，累计 (\${cum1},\${cum2})\`, en: \`Round \${r}: TFT=\${a1}, AllD=\${a2}, cum (\${cum1},\${cum2})\` })
        .setAux([
          { label: 'TFT 本轮', value: a1, role: 'compare' as BarRole },
          { label: 'AllD 本轮', value: a2, role: 'warn' as BarRole },
          { label: 'TFT 累计', value: String(cum1), role: 'final' as BarRole },
          { label: 'AllD 累计', value: String(cum2), role: 'final' as BarRole },
        ]).commit();
    },
  });
  return rec.build();
}`,
  `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gameRepeatedGame, TIT_FOR_TAT, ALWAYS_DEFECT, ALWAYS_COOPERATE } from '../../src/algorithms/game/game-repeated-game/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-repeated-game/trace.ts';

test('TFT vs AllD：TFT 第 1 轮 C，之后全部 D', () => {
  const r = gameRepeatedGame(TIT_FOR_TAT, ALWAYS_DEFECT, 5);
  assert.equal(r.history[0]!.a1, 'C');
  for (let i = 1; i < r.history.length; i++) assert.equal(r.history[i]!.a1, 'D');
});

test('TFT vs AlwaysC：双方全程合作', () => {
  const r = gameRepeatedGame(TIT_FOR_TAT, ALWAYS_COOPERATE, 5);
  for (const h of r.history) { assert.equal(h.a1, 'C'); assert.equal(h.a2, 'C'); }
  assert.equal(r.totalU1, 15);
});

test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length >= 5);
});`,
);

// --- Stochastic game (Shapley 1953 toy MDP-style) ---
writeAlg(
  'game-stochastic-game',
  `// 随机博弈 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'game-stochastic-game',
  categoryId: 'game',
  title: { zh: '随机博弈', en: 'Stochastic Game' },
  summary: { zh: '状态间转移依赖双方行动；Shapley 1953 的两人零和随机博弈。', en: 'State transitions depend on both players\\' actions; Shapley 1953 two-player zero-sum stochastic game.' },
  description: { zh: '随机博弈 = 多智能体 MDP。每个状态是矩阵博弈，动作组合决定即时收益与下一状态。值迭代求解：V(s) = val( A(s) + γ·P(s,a,s\\')V(s\\') )。本实现演示单状态自环的两步值迭代。', en: 'Stochastic game = multi-agent MDP. Each state is a matrix game whose action profile yields reward and a transition. Value iteration: V(s) = val( A(s) + γ·P(s,a,s\\')V(s\\') ). This demo shows single self-loop state value iteration.' },
  tags: ['game', 'game-theory', 'mdp'],
  complexity: { time: 'O(k·m²·n²)', space: 'O(m·n)' },
};`,
  `// 随机博弈 · 实现（单状态自环 + γ 折扣，求矩阵博弈值的不动点）
// 收益矩阵 A（行玩家），状态自环：V = val(A + γ·V·ones)
// 不动点：V = (max_row min_col (A + γV)) = max_i min_j A[i][j] + γV
//   => V*(1-γ) = max_i min_j A[i][j] => V* = (max_i min_j A[i][j]) / (1-γ)
export interface StochasticGameHooks {
  onIter?: (iter: number, V: number) => void;
  onConclude?: (Vstar: number) => void;
}
export interface StochasticGameResult { value: number; iterations: number; }
export function gameStochasticGame(
  A: ReadonlyArray<readonly number[]>, gamma: number, maxIter = 1000, tol = 1e-9,
  hooks: StochasticGameHooks = {},
): StochasticGameResult {
  if (gamma <= 0 || gamma >= 1) throw new Error('gamma 必须 ∈ (0,1)');
  // maximin of A
  let maximin = -Infinity;
  for (const row of A) {
    let rowMin = Infinity;
    for (const v of row) rowMin = Math.min(rowMin, v);
    maximin = Math.max(maximin, rowMin);
  }
  let V = maximin;
  let iterations = 0;
  for (let it = 1; it <= maxIter; it++) {
    iterations = it;
    const next = maximin + gamma * V;
    hooks.onIter?.(it, next);
    if (Math.abs(next - V) < tol) { V = next; break; }
    V = next;
  }
  hooks.onConclude?.(V);
  return { value: V, iterations };
}`,
  `// 随机博弈 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { gameStochasticGame } from './impl.ts';
export const DEFAULT_INPUT = { A: [[2, 0], [0, 1]], gamma: 0.9 };
export function buildTrace(input: { A?: number[][]; gamma?: number } = {}): Frame[] {
  const { A = DEFAULT_INPUT.A, gamma = DEFAULT_INPUT.gamma } = input;
  const rec = new TraceRecorder();
  rec.begin({ zh: '随机博弈：单状态自环值迭代', en: 'Stochastic game: single-state self-loop value iteration' })
    .setAux([{ label: 'γ', value: String(gamma), role: 'pivot' as BarRole }]).commit();
  const r = gameStochasticGame(A, gamma, 50, 1e-6, {
    onIter: (it, V) => {
      rec.begin({ zh: \`迭代 \${it}：V=\${V.toFixed(6)}\`, en: \`Iter \${it}: V=\${V.toFixed(6)}\` })
        .setAux([{ label: 'V', value: V.toFixed(6), role: 'compare' as BarRole }]).commit();
    },
  });
  rec.begin({ zh: \`收敛 V*=\${r.value.toFixed(6)}（\${r.iterations} 步）\`, en: \`Converged V*=\${r.value.toFixed(6)} in \${r.iterations} steps\` })
    .setAux([{ label: 'V*', value: r.value.toFixed(6), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gameStochasticGame } from '../../src/algorithms/game/game-stochastic-game/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-stochastic-game/trace.ts';

test('单状态自环：V* = maximin / (1-γ)', () => {
  const r = gameStochasticGame([[2, 0], [0, 1]], 0.9);
  // maximin = max(min(2,0), min(0,1)) = max(0, 0) = 0；V* = 0/(1-0.9) = 0
  assert.ok(Math.abs(r.value - 0) < 1e-6);
});

test('maximin=1, γ=0.5 → V*=2', () => {
  const r = gameStochasticGame([[1, 1], [1, 1]], 0.5);
  assert.ok(Math.abs(r.value - 2) < 1e-6);
});

test('γ 越界拒绝', () => {
  assert.throws(() => gameStochasticGame([[1]], 1.5));
  assert.throws(() => gameStochasticGame([[1]], 0));
});

test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length >= 2);
});`,
);

// --- Bayesian game (two types, Bayesian-Nash best response) ---
writeAlg(
  'game-bayesian-game',
  `// 贝叶斯博弈 · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'game-bayesian-game',
  categoryId: 'game',
  title: { zh: '贝叶斯博弈', en: 'Bayesian Game' },
  summary: { zh: '玩家有不完全信息（私有类型），按类型先验最大化期望收益。', en: 'Players have incomplete information (private types) and maximize expected payoff given priors.' },
  description: { zh: '贝叶斯博弈：每个玩家有类型 θ_i，按联合先验分布抽取。策略是「类型 → 动作」的映射。贝叶斯纳什均衡：给定对手策略与类型先验，每类玩家最优。本实现演示两人的两类型博弈，求行玩家的最佳响应。', en: 'Bayesian game: each player has a type θ_i drawn from a joint prior. A strategy maps types to actions. Bayesian-Nash equilibrium: each type best-responds given the prior and others\\' strategies. This solves player 1\\'s best response in a 2-type, 2-player setting.' },
  tags: ['game', 'game-theory', 'bayesian'],
  complexity: { time: 'O(T²·A²)', space: 'O(1)' },
};`,
  `// 贝叶斯博弈 · 实现
// 简化：玩家1 有 2 个类型（strong/weak），先验 p；玩家2 类型固定。
// 给定玩家2 的固定策略 a2，求玩家1 各类型的最佳响应及其期望收益。
export interface BayesianHooks {
  onBestResponse?: (type1: number, bestAction: number, expectedPayoff: number) => void;
  onConclude?: (totalExpected: number) => void;
}
export interface BayesianResult {
  bestActions: number[]; // 每个类型玩家1的最佳动作
  expectedPayoffs: number[]; // 各类型下的期望收益
  totalExpected: number;
}
// payoff1[type1][a1][a2]: 玩家1 收益
export function gameBayesianGame(
  payoff1: ReadonlyArray<ReadonlyArray<readonly number[]>>, // [type1][a1][a2]
  prior1: readonly number[], // 玩家1 各类型概率
  a2: number, // 玩家2 的固定动作
  hooks: BayesianHooks = {},
): BayesianResult {
  const nTypes = payoff1.length;
  const nActions = payoff1[0]!.length;
  const bestActions: number[] = [];
  const expectedPayoffs: number[] = [];
  let totalExpected = 0;
  for (let t = 0; t < nTypes; t++) {
    let bestA = 0;
    let bestU = -Infinity;
    for (let a = 0; a < nActions; a++) {
      const u = payoff1[t]![a]![a2]!;
      if (u > bestU) { bestU = u; bestA = a; }
    }
    bestActions.push(bestA);
    expectedPayoffs.push(bestU);
    totalExpected += prior1[t]! * bestU;
    hooks.onBestResponse?.(t, bestA, bestU);
  }
  hooks.onConclude?.(totalExpected);
  return { bestActions, expectedPayoffs, totalExpected };
}`,
  `// 贝叶斯博弈 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { gameBayesianGame } from './impl.ts';
// 玩家1 类型 0 (strong)：A→(3,0) vs a2=0/1; 类型 1 (weak)
const P1: ReadonlyArray<ReadonlyArray<readonly number[]>> = [
  [[3, 0], [0, 1]],
  [[2, 0], [0, 2]],
];
const PRIOR = [0.6, 0.4];
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '贝叶斯博弈：玩家1 有 2 类型，玩家2 动作 a2=0', en: 'Bayesian game: player1 has 2 types, player2 action a2=0' })
    .setAux([{ label: '先验', value: PRIOR.join(','), role: 'pivot' as BarRole }]).commit();
  const r = gameBayesianGame(P1, PRIOR, 0, {
    onConclude: (te) => {
      rec.begin({ zh: \`总期望收益 \${te.toFixed(2)}\`, en: \`Total expected payoff \${te.toFixed(2)}\` })
        .setAux(r.expectedPayoffs.map((p, t) => ({ label: \`类型\${t} 最佳动作\`, value: String(r.bestActions[t]), role: 'final' as BarRole }))
          .concat([{ label: '总期望', value: te.toFixed(2), role: 'compare' as BarRole }]))
        .commit();
    },
  });
  return rec.build();
}`,
  `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gameBayesianGame } from '../../src/algorithms/game/game-bayesian-game/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-bayesian-game/trace.ts';

test('给定 a2=0，每类型选收益最大的动作', () => {
  const P1 = [[[3, 0], [0, 1]], [[2, 0], [0, 2]]];
  const r = gameBayesianGame(P1, [0.5, 0.5], 0);
  assert.deepEqual(r.bestActions, [0, 0]);
  assert.deepEqual(r.expectedPayoffs, [3, 2]);
});

test('总期望按先验加权', () => {
  const P1 = [[[3, 0], [0, 1]], [[2, 0], [0, 2]]];
  const r = gameBayesianGame(P1, [0.6, 0.4], 0);
  assert.ok(Math.abs(r.totalExpected - (0.6 * 3 + 0.4 * 2)) < 1e-9);
});

test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length >= 2);
});`,
);

// --- Mechanism design (VCG for single item) ---
writeAlg(
  'game-mechanism-design',
  `// 机制设计（VCG）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'game-mechanism-design',
  categoryId: 'game',
  title: { zh: '机制设计（VCG）', en: 'Mechanism Design (VCG)' },
  summary: { zh: 'Vickrey-Clarke-Groves 机制：分配最大化社会福利，收费等于外部性。', en: 'VCG mechanism: allocate to maximize social welfare, charge each player their externality.' },
  description: { zh: 'VCG 是最经典的激励相容机制：要求每个人报告估值，把物品分给估值最高者，收费 = （没有此人时他人的最大社会福利）−（有此人时他人的社会福利之和）。如实报告是占优策略。', en: 'VCG is the canonical incentive-compatible mechanism: collect valuation reports, allocate to the highest, and charge the externality = (others\\' welfare without this player) − (others\\' welfare with this player). Truthful reporting is dominant.' },
  tags: ['game', 'mechanism-design', 'auction'],
  complexity: { time: 'O(n²)', space: 'O(n)' },
};`,
  `// 机制设计（VCG 单物品）· 实现
export interface VCGHooks {
  onAllocate?: (winnerIdx: number, winningValue: number) => void;
  onExternality?: (idx: number, payment: number) => void;
  onConclude?: (allocations: number[], payments: number[]) => void;
}
export interface VCGResult { winnerIdx: number; payments: number[]; }
export function gameMechanismDesign(
  bids: readonly number[], hooks: VCGHooks = {},
): VCGResult {
  const n = bids.length;
  if (n === 0) throw new Error('bids 不能为空 / bids must be non-empty');
  // 分配：最高者中标
  let winnerIdx = 0;
  let top = bids[0]!;
  for (let i = 1; i < n; i++) if (bids[i]! > top) { top = bids[i]!; winnerIdx = i; }
  hooks.onAllocate?.(winnerIdx, top);
  // 第二高 = 没有 winner 时最大社会福利
  let second = -Infinity;
  for (let i = 0; i < n; i++) if (i !== winnerIdx) second = Math.max(second, bids[i]!);
  if (second === -Infinity) second = 0;
  // 只有中标者付费 = 外部性 = second（他人因他存在损失的福利）
  const payments = new Array(n).fill(0);
  payments[winnerIdx] = second;
  for (let i = 0; i < n; i++) hooks.onExternality?.(i, payments[i]!);
  hooks.onConclude?.([winnerIdx], payments);
  return { winnerIdx, payments };
}`,
  `// 机制设计（VCG）· 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { gameMechanismDesign } from './impl.ts';
export const DEFAULT_INPUT = [10, 25, 18];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'VCG 单物品拍卖', en: 'VCG single-item auction' })
    .setBars(input.map((b, i) => ({ value: b, role: 'default' as BarRole, label: \`b\${i}=\${b}\` }))).commit();
  const r = gameMechanismDesign(input);
  rec.begin({ zh: \`中标 #\${r.winnerIdx}，付 \${r.payments[r.winnerIdx]}\`, en: \`Winner #\${r.winnerIdx}, pays \${r.payments[r.winnerIdx]}\` })
    .setBars(input.map((b, i) => ({ value: b, role: (i === r.winnerIdx ? 'final' : 'default') as BarRole, label: \`p\${i}=\${r.payments[i]}\` })))
    .setAux([{ label: 'VCG 收费', value: String(r.payments[r.winnerIdx]!), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gameMechanismDesign } from '../../src/algorithms/game/game-mechanism-design/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-mechanism-design/trace.ts';

test('VCG 中标者付次高（外部性）', () => {
  const r = gameMechanismDesign([10, 25, 18]);
  assert.equal(r.winnerIdx, 1);
  assert.equal(r.payments[1], 18);
});

test('VCG 失败者不付费', () => {
  const r = gameMechanismDesign([10, 25, 18]);
  assert.equal(r.payments[0], 0);
  assert.equal(r.payments[2], 0);
});

test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length >= 2);
});`,
);

console.log('generated remaining game algorithms');
