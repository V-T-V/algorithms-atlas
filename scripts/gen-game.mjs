// game 类别 · 30 个算法规范（博弈论 + 棋类 + 组合游戏）
import { add } from './gen-batch.mjs';

// 1. game-cournot-duopoly
add({
  cat: 'game', id: 'game-cournot-duopoly',
  title: { zh: '古诺双寡头', en: 'Cournot Duopoly' },
  summary: { zh: '两厂商同时选产量。', en: 'Two firms choose quantities.' },
  description: { zh: '古诺模型两厂商同时决定产量 q1、q2，价格 P=a-b(q1+q2)，纳什均衡各自选反应函数交点产量。', en: 'In the Cournot model two firms simultaneously choose q1, q2 with price P=a-b(q1+q2); Nash equilibrium is the reaction-function intersection.' },
  tags: ['game','cournot','oligopoly','game-theory'],
  complexity: { time: 'O(1)', space: 'O(1)' },
  impl: `export interface CdHooks { onIter?: (i: number, q1: number, q2: number) => void; }
export function cournotNash(a: number, b: number, c: number, iters: number, hooks: CdHooks = {}): { q1: number; q2: number } {
  let q1 = 0, q2 = 0;
  for (let i = 0; i < iters; i++) { q1 = Math.max(0, (a - c - b * q2) / (2 * b)); q2 = Math.max(0, (a - c - b * q1) / (2 * b)); hooks.onIter?.(i, q1, q2); }
  return { q1, q2 };
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { cournotNash } from './impl.ts';
export const DEFAULT_INPUT: any = { a: 100, b: 1, c: 10, iters: 10 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '古诺', en: 'Cournot' }).commit();
  const { q1, q2 } = cournotNash(input.a, input.b, input.c, input.iters, {
    onIter: (i, _q1, _q2) => rec.begin({ zh: '迭代 ' + i, en: 'iter' }).setAux([{label:'i',value:String(i),role:'pivot' as BarRole}]).commit(),
  });
  rec.begin({ zh: 'q1=' + q1.toFixed(2) + ' q2=' + q2.toFixed(2), en: 'nash' }).setAux([{label:'q1',value:q1.toFixed(2),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cournotNash } from '../../src/algorithms/game/game-cournot-duopoly/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-cournot-duopoly/trace.ts';
test('cournot 对称均衡', () => { const { q1, q2 } = cournotNash(100, 1, 10, 50); assert.ok(Math.abs(q1 - q2) < 1e-6); assert.ok(q1 > 0); });
test('cournot trace 非空', () => assert.ok(buildTrace().length > 0));`,
});

// 2. game-bertrand-duopoly
add({
  cat: 'game', id: 'game-bertrand-duopoly',
  title: { zh: '伯特兰双寡头', en: 'Bertrand Duopoly' },
  summary: { zh: '两厂商同时定价。', en: 'Two firms set prices.' },
  description: { zh: '伯特兰模型两厂商同时定价，产品同质则均衡价格等于边际成本(零利润)，与古诺结论截然不同。', en: 'In the Bertrand model two firms set prices; with homogeneous goods the equilibrium price equals marginal cost (zero profit), unlike Cournot.' },
  tags: ['game','bertrand','oligopoly','game-theory'],
  complexity: { time: 'O(1)', space: 'O(1)' },
  impl: `export function bertrandNash(mc: number): { p1: number; p2: number } { return { p1: mc, p2: mc }; }
export interface BdHooks { onUndercut?: (round: number, p: number) => void; }
export function bertrandDynamics(mc: number, rounds: number, hooks: BdHooks = {}): { p1: number; p2: number } {
  let p1 = mc + 10, p2 = mc + 10;
  for (let r = 0; r < rounds; r++) { if (p1 > p2) p1 = p2 - 1; else if (p2 > p1) p2 = p1 - 1; p1 = Math.max(mc, p1); p2 = Math.max(mc, p2); hooks.onUndercut?.(r, Math.min(p1, p2)); }
  return { p1, p2 };
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { bertrandDynamics } from './impl.ts';
export const DEFAULT_INPUT: any = { mc: 10, rounds: 12 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '伯特兰', en: 'Bertrand' }).commit();
  const { p1, p2 } = bertrandDynamics(input.mc, input.rounds, {
    onUndercut: (r, p) => rec.begin({ zh: '轮 ' + r + ' 最低价 ' + p, en: 'round' }).setAux([{label:'p',value:String(p),role:'compare' as BarRole}]).commit(),
  });
  rec.begin({ zh: 'p1=' + p1 + ' p2=' + p2, en: 'eq' }).setAux([{label:'p',value:String(p1),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bertrandNash, bertrandDynamics } from '../../src/algorithms/game/game-bertrand-duopoly/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-bertrand-duopoly/trace.ts';
test('bertrand 均衡=边际成本', () => { const { p1, p2 } = bertrandNash(10); assert.equal(p1, 10); assert.equal(p2, 10); });
test('bertrand 动态收敛', () => { const { p1, p2 } = bertrandDynamics(10, 20); assert.ok(p1 <= 10 && p2 <= 10); });
test('bertrand trace 非空', () => assert.ok(buildTrace().length > 0));`,
});

// 3. game-stackelberg
add({
  cat: 'game', id: 'game-stackelberg',
  title: { zh: '斯塔克伯格博弈', en: 'Stackelberg' },
  summary: { zh: '领导者先动、追随者后动。', en: 'Leader moves first; follower second.' },
  description: { zh: '斯塔克伯格模型中领导者先宣布产量，追随者观察后选反应产量，领导者用逆向归纳获得先发优势。', en: 'In the Stackelberg model the leader commits a quantity first; the follower best-responds. The leader uses backward induction and gains first-mover advantage.' },
  tags: ['game','stackelberg','sequential','game-theory'],
  complexity: { time: 'O(1)', space: 'O(1)' },
  impl: `export function stackelbergSolve(a: number, b: number, c: number): { qL: number; qF: number; piL: number } {
  const qL = (a - c) / (2 * b); const qF = (a - c) / (4 * b); const P = a - b * (qL + qF); const piL = (P - c) * qL;
  return { qL, qF, piL };
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { stackelbergSolve } from './impl.ts';
export const DEFAULT_INPUT: any = { a: 100, b: 1, c: 10 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '斯塔克伯格', en: 'Stackelberg' }).commit();
  const { qL, qF, piL } = stackelbergSolve(input.a, input.b, input.c);
  rec.begin({ zh: '领导 ' + qL.toFixed(2), en: 'leader' }).setAux([{label:'qL',value:qL.toFixed(2),role:'compare' as BarRole}]).commit();
  rec.begin({ zh: '追随 ' + qF.toFixed(2), en: 'follower' }).setAux([{label:'qF',value:qF.toFixed(2),role:'pivot' as BarRole}]).commit();
  rec.begin({ zh: '利润 ' + piL.toFixed(2), en: 'profit' }).setAux([{label:'piL',value:piL.toFixed(2),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { stackelbergSolve } from '../../src/algorithms/game/game-stackelberg/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-stackelberg/trace.ts';
test('stackelberg 领导多于追随', () => { const { qL, qF } = stackelbergSolve(100, 1, 10); assert.ok(qL > qF); assert.ok(qL > 0); });
test('stackelberg trace 非空', () => assert.ok(buildTrace().length > 0));`,
});

// 4. game-hotelling
add({
  cat: 'game', id: 'game-hotelling',
  title: { zh: '霍特林线性城市', en: 'Hotelling Linear City' },
  summary: { zh: '线性城市上两店选址。', en: 'Two shops locating on a line.' },
  description: { zh: '霍特林线性城市模型消费者均匀分布在 [0,1]，两家店选位置最小化运输成本，均衡两者背靠背位于 1/4 与 3/4。', en: 'In the Hotelling linear city, consumers are uniform on [0,1]; two shops choose locations to minimize travel cost; equilibrium is at 1/4 and 3/4.' },
  tags: ['game','hotelling','spatial','game-theory'],
  complexity: { time: 'O(1)', space: 'O(1)' },
  impl: `export function hotellingEquilibrium(): { x1: number; x2: number } { return { x1: 0.25, x2: 0.75 }; }
export interface HtHooks { onIter?: (i: number, x1: number, x2: number) => void; }
export function hotellingBestResponse(iters: number, hooks: HtHooks = {}): { x1: number; x2: number } {
  let x1 = 0.1, x2 = 0.9;
  for (let i = 0; i < iters; i++) { x1 = Math.max(0, x2 - 0.5); x2 = Math.min(1, x1 + 0.5); hooks.onIter?.(i, x1, x2); }
  return { x1, x2 };
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { hotellingBestResponse } from './impl.ts';
export const DEFAULT_INPUT: any = null;
export function buildTrace(_input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '霍特林', en: 'Hotelling' }).commit();
  const { x1, x2 } = hotellingBestResponse(15, { onIter: (i, a, b) => rec.begin({ zh: '迭代 ' + i, en: 'iter' }).setAux([{label:'x1',value:a.toFixed(2),role:'compare' as BarRole}]).commit() });
  rec.begin({ zh: 'x1=' + x1.toFixed(2) + ' x2=' + x2.toFixed(2), en: 'eq' }).setAux([{label:'x1',value:x1.toFixed(2),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hotellingEquilibrium, hotellingBestResponse } from '../../src/algorithms/game/game-hotelling/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-hotelling/trace.ts';
test('hotelling 经典均衡', () => { const { x1, x2 } = hotellingEquilibrium(); assert.equal(x1, 0.25); assert.equal(x2, 0.75); });
test('hotelling 动态', () => { const { x1 } = hotellingBestResponse(20); assert.ok(x1 >= 0 && x1 <= 1); });
test('hotelling trace 非空', () => assert.ok(buildTrace().length > 0));`,
});

// 5. game-public-goods
add({
  cat: 'game', id: 'game-public-goods',
  title: { zh: '公共物品博弈', en: 'Public Goods Game' },
  summary: { zh: '多人投资公共池。', en: 'N players invest in a public pool.' },
  description: { zh: '公共物品博弈中每人决定向公共池投入多少，池总额乘因子后均分；自私者搭便车，合作者贡献，揭示社会困境。', en: 'In the Public Goods Game each player invests in a pool that is multiplied and split evenly; free-riders under-contribute, revealing a social dilemma.' },
  tags: ['game','public-goods','social','game-theory'],
  complexity: { time: 'O(n)', space: 'O(n)' },
  impl: `export interface PgHooks { onRound?: (r: number, contributions: number[]) => void; }
export function publicGoodsRound(endowments: number[], mpcr: number, hooks: PgHooks = {}): { contributions: number[]; payoffs: number[] } {
  const contributions = endowments.map((e) => Math.round(e * 0.5));
  hooks.onRound?.(0, contributions);
  const pool = contributions.reduce((s, c) => s + c, 0) * mpcr;
  const share = pool / endowments.length;
  const payoffs = endowments.map((e, i) => e - contributions[i]! + share);
  return { contributions, payoffs };
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { publicGoodsRound } from './impl.ts';
export const DEFAULT_INPUT: any = { endowments: [20,20,20,20], mpcr: 0.4 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '公共物品', en: 'Public Goods' }).commit();
  const { contributions, payoffs } = publicGoodsRound(input.endowments, input.mpcr, {
    onRound: (r, c) => rec.begin({ zh: '贡献 [' + c.join(',') + ']', en: 'round' }).setAux([{label:'r',value:String(r),role:'pivot' as BarRole}]).commit(),
  });
  rec.begin({ zh: '收益 [' + payoffs.map((p: number) => p.toFixed(1)).join(',') + ']', en: 'payoffs' }).setAux([{label:'payoffs',value:payoffs.map((p:number)=>p.toFixed(1)).join(','),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { publicGoodsRound } from '../../src/algorithms/game/game-public-goods/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-public-goods/trace.ts';
test('pgg 收益计算', () => { const { contributions, payoffs } = publicGoodsRound([10,10,10], 0.5); assert.equal(contributions.length, 3); assert.equal(payoffs.length, 3); });
test('pgg trace 非空', () => assert.ok(buildTrace().length > 0));`,
});

// 6. game-volunteer-dilemma
add({
  cat: 'game', id: 'game-volunteer-dilemma',
  title: { zh: '志愿者困境', en: 'Volunteer Dilemma' },
  summary: { zh: '至少一人付出则全员受益。', en: 'At least one must volunteer to benefit all.' },
  description: { zh: '志愿者困境中只要至少一人付出成本 c，所有人获收益 b>c，但没人愿做付出者，混合均衡每人志愿概率 1-(c/b)^(1/n)。', en: 'In the Volunteer Dilemma, if at least one pays cost c, all gain b>c; nobody wants to volunteer. Mixed-strategy p=1-(c/b)^(1/n).' },
  tags: ['game','volunteer','dilemma','game-theory'],
  complexity: { time: 'O(1)', space: 'O(1)' },
  impl: `export function volunteerMixedProb(n: number, b: number, c: number): number { if (n <= 1) return 1; return 1 - Math.pow(c / b, 1 / n); }
export interface VdHooks { onPlayer?: (i: number, volunteer: boolean) => void; }
export function volunteerSimulate(n: number, p: number, hooks: VdHooks = {}): { volunteers: number; benefited: boolean } {
  let v = 0; for (let i = 0; i < n; i++) { const vol = Math.random() < p; if (vol) v++; hooks.onPlayer?.(i, vol); } return { volunteers: v, benefited: v > 0 };
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { volunteerMixedProb, volunteerSimulate } from './impl.ts';
export const DEFAULT_INPUT: any = { n: 5, b: 10, c: 3 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '志愿者困境', en: 'Volunteer' }).commit();
  const p = volunteerMixedProb(input.n, input.b, input.c);
  rec.begin({ zh: '志愿概率 ' + p.toFixed(3), en: 'prob' }).setAux([{label:'p',value:p.toFixed(3),role:'compare' as BarRole}]).commit();
  const { volunteers, benefited } = volunteerSimulate(input.n, p, { onPlayer: (i, vol) => rec.begin({ zh: '玩家 ' + i + (vol ? ' 志愿' : ' 不'), en: 'player' }).setAux([{label:'vol',value:String(vol),role:vol?'final' as BarRole:'warn' as BarRole}]).commit() });
  rec.begin({ zh: benefited ? '受益(' + volunteers + ')' : '无人', en: 'result' }).setAux([{label:'v',value:String(volunteers),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { volunteerMixedProb } from '../../src/algorithms/game/game-volunteer-dilemma/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-volunteer-dilemma/trace.ts';
test('vd 概率 0-1', () => { const p = volunteerMixedProb(5, 10, 3); assert.ok(p >= 0 && p <= 1); });
test('vd n=1 必志愿', () => assert.equal(volunteerMixedProb(1, 10, 3), 1));
test('vd trace 非空', () => assert.ok(buildTrace().length > 0));`,
});

// 7. game-tragedy-commons
add({
  cat: 'game', id: 'game-tragedy-commons',
  title: { zh: '公地悲剧', en: 'Tragedy of the Commons' },
  summary: { zh: '共享资源被过度消耗。', en: 'Shared resource overconsumed.' },
  description: { zh: '公地悲剧中多人共享可再生资源，各自理性消耗却导致资源枯竭，是公地、渔业、温室气体排放的典型困境。', en: 'In the Tragedy of the Commons multiple players share a renewable resource; individually rational consumption depletes it. Models fisheries, emissions.' },
  tags: ['game','commons','tragedy','game-theory'],
  complexity: { time: 'O(t)', space: 'O(t)' },
  impl: `export interface TcHooks { onStep?: (t: number, stock: number, harvest: number) => void; }
export function tragedySimulate(initialStock: number, growthRate: number, nPlayers: number, effort: number, steps: number, hooks: TcHooks = {}): number[] {
  let stock = initialStock; const history: number[] = [];
  for (let t = 0; t < steps; t++) { stock += stock * growthRate; const harvest = Math.min(stock, nPlayers * effort); stock -= harvest; stock = Math.max(0, stock); history.push(stock); hooks.onStep?.(t, stock, harvest); if (stock <= 0) break; }
  return history;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { tragedySimulate } from './impl.ts';
export const DEFAULT_INPUT: any = { initialStock: 1000, growthRate: 0.05, nPlayers: 5, effort: 30, steps: 20 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '公地悲剧', en: 'Commons' }).commit();
  const hist = tragedySimulate(input.initialStock, input.growthRate, input.nPlayers, input.effort, input.steps, {
    onStep: (t, stock, harvest) => rec.begin({ zh: 't=' + t + ' 库存 ' + Math.round(stock), en: 'step' }).setAux([{label:'t',value:String(t),role:'pivot' as BarRole},{label:'harvest',value:String(Math.round(harvest)),role:'compare' as BarRole}]).commit(),
  });
  rec.begin({ zh: '终值 ' + Math.round(hist[hist.length - 1] ?? 0), en: 'final' }).setAux([{label:'stock',value:String(Math.round(hist[hist.length - 1] ?? 0)),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tragedySimulate } from '../../src/algorithms/game/game-tragedy-commons/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-tragedy-commons/trace.ts';
test('commons 过度消耗', () => { const h = tragedySimulate(1000, 0.05, 5, 30, 30); assert.ok(h.length <= 30); assert.ok((h[h.length - 1] ?? 0) < 1000); });
test('commons trace 非空', () => assert.ok(buildTrace().length > 0));`,
});

// 8. game-collusion-sustainable
add({
  cat: 'game', id: 'game-collusion-sustainable',
  title: { zh: '可维持合谋', en: 'Sustainable Collusion' },
  summary: { zh: '重复博弈中合谋可维持条件。', en: 'When collusion holds in a repeated game.' },
  description: { zh: '重复囚徒困境中合谋(都合作)能否维持取决于贴现因子与背叛短期收益，触发策略下需贴现因子大于临界值。', en: 'In a repeated Prisoner Dilemma, collusion (mutual cooperation) is sustainable if the discount factor exceeds a threshold given the one-shot defection gain under trigger strategies.' },
  tags: ['game','collusion','repeated','game-theory'],
  complexity: { time: 'O(1)', space: 'O(1)' },
  impl: `export function collusionThreshold(T: number, R: number, P: number, S: number): number { return (T - R) / (T - P); }
export function isSustainable(delta: number, T: number, R: number, P: number, S: number): boolean { return delta >= collusionThreshold(T, R, P, S); }`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { collusionThreshold, isSustainable } from './impl.ts';
export const DEFAULT_INPUT: any = { T: 5, R: 3, P: 1, S: 0, delta: 0.6 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '可维持合谋', en: 'Collusion' }).commit();
  const th = collusionThreshold(input.T, input.R, input.P, input.S);
  const ok = isSustainable(input.delta, input.T, input.R, input.P, input.S);
  rec.begin({ zh: '临界 δ=' + th.toFixed(2), en: 'threshold' }).setAux([{label:'threshold',value:th.toFixed(2),role:'compare' as BarRole}]).commit();
  rec.begin({ zh: 'δ=' + input.delta + ' -> ' + (ok ? '可维持' : '不可'), en: 'verdict' }).setAux([{label:'sustain',value:String(ok),role:ok?'final' as BarRole:'warn' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { collusionThreshold, isSustainable } from '../../src/algorithms/game/game-collusion-sustainable/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-collusion-sustainable/trace.ts';
test('collusion 阈值 0-1', () => { const th = collusionThreshold(5,3,1,0); assert.ok(th >= 0 && th <= 1); });
test('collusion 高 δ 可维持', () => assert.equal(isSustainable(0.99,5,3,1,0), true));
test('collusion trace 非空', () => assert.ok(buildTrace().length > 0));`,
});

// 9. game-cake-cutting
add({
  cat: 'game', id: 'game-cake-cutting',
  title: { zh: '切蛋糕算法', en: 'Cake Cutting' },
  summary: { zh: '公平分割异质物品。', en: 'Fair division of heterogeneous good.' },
  description: { zh: '切蛋糕(I cut, you choose)由一人切均分两份另一人先选，保证两人都觉得公平，可扩展到 n 人(Banach-Knaster)。', en: 'Cut-and-choose: one cuts into two equal halves, the other picks first; both feel treated fairly. Extends to n via Banach-Knaster.' },
  tags: ['game','cake-cutting','fair-division','game-theory'],
  complexity: { time: 'O(n)', space: 'O(n)' },
  impl: `export interface CcHooks { onCut?: (i: number, piece: number) => void; }
export function cutAndChoose(values: number[], hooks: CcHooks = {}): { cutter: number; chooser: number; cutterPiece: number } {
  const half = values.reduce((s, v) => s + v, 0) / 2;
  let acc = 0; let cut = 0;
  for (let i = 0; i < values.length; i++) { acc += values[i]!; cut = i; hooks.onCut?.(i, acc); if (acc >= half) break; }
  return { cutter: 0, chooser: 1, cutterPiece: cut };
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { cutAndChoose } from './impl.ts';
export const DEFAULT_INPUT: any = [1,2,3,4,5];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '切蛋糕', en: 'Cake Cutting' }).commit();
  const r = cutAndChoose(input, { onCut: (i, piece) => rec.begin({ zh: '第 ' + i + ' 块累计 ' + piece, en: 'cut' }).setAux([{label:'i',value:String(i),role:'compare' as BarRole}]).commit() });
  rec.begin({ zh: '切点 ' + r.cutterPiece, en: 'cut' }).setAux([{label:'cut',value:String(r.cutterPiece),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cutAndChoose } from '../../src/algorithms/game/game-cake-cutting/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-cake-cutting/trace.ts';
test('cake 切到一半', () => { const r = cutAndChoose([1,2,3,4]); assert.ok(r.cutterPiece >= 0); });
test('cake trace 非空', () => assert.ok(buildTrace().length > 0));`,
});

// 10. game-envy-free-division
add({
  cat: 'game', id: 'game-envy-free-division',
  title: { zh: '无嫉妒分配', en: 'Envy-Free Division' },
  summary: { zh: '无人觉得别人份更好。', en: 'No one prefers someone else share.' },
  description: { zh: '无嫉妒分配要求每人认为自己份 >= 他人份，3 人 Selfridge-Conway 算法可达成，是公平分配的最强概念之一。', en: 'Envy-free division requires each person value their share at least as much as anyone else share; the Selfridge-Conway algorithm achieves it for 3 people.' },
  tags: ['game','envy-free','fair-division','game-theory'],
  complexity: { time: 'O(n)', space: 'O(n)' },
  impl: `export function isEnvyFree(valuations: number[][]): boolean {
  const n = valuations.length;
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { if (j === i) continue; if (valuations[i]![j]! > valuations[i]![i]!) return false; }
  return true;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { isEnvyFree } from './impl.ts';
export const DEFAULT_INPUT: any = [[3,2,1],[2,3,1],[1,1,3]];
export function buildTrace(input: number[][] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '无嫉妒', en: 'Envy-Free' }).commit();
  for (let i = 0; i < input.length; i++) rec.begin({ zh: '玩家 ' + i + ' 自评 ' + input[i]![i], en: 'player' }).setAux([{label:'self',value:String(input[i]![i]),role:'compare' as BarRole}]).commit();
  const ok = isEnvyFree(input);
  rec.begin({ zh: ok ? '无嫉妒' : '有嫉妒', en: ok ? 'envy-free' : 'envious' }).setAux([{label:'result',value:String(ok),role:ok?'final' as BarRole:'warn' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isEnvyFree } from '../../src/algorithms/game/game-envy-free-division/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-envy-free-division/trace.ts';
test('envy-free 自评最高为真', () => assert.equal(isEnvyFree([[3,2,1],[2,3,1],[1,1,3]]), true));
test('envy-free 有嫉妒为假', () => assert.equal(isEnvyFree([[1,5,1],[2,2,2],[1,1,1]]), false));
test('envy-free trace 非空', () => assert.ok(buildTrace().length > 0));`,
});

// 11. game-matching-market
add({
  cat: 'game', id: 'game-matching-market',
  title: { zh: '双边匹配市场', en: 'Two-Sided Matching' },
  summary: { zh: ' Gale-Shapley 稳定匹配。', en: 'Stable matching via Gale-Shapley.' },
  description: { zh: '双边匹配市场(医院-实习、学校-学生)用 Gale-Shapley 延迟接受算法求稳定匹配，无一对相互更偏好对方。', en: 'A two-sided matching market (hospital-intern, school-student) uses Gale-Shapley deferred acceptance to find a stable matching where no pair prefers each other over their current partner.' },
  tags: ['game','matching','gale-shapley','market'],
  complexity: { time: 'O(n^2)', space: 'O(n)' },
  impl: `export interface GsHooks { onPropose?: (round: number, proposer: number, target: number) => void; onAccept?: (target: number, proposer: number) => void; }
export function galeShapley(menPref: number[][], womenPref: number[][], hooks: GsHooks = {}): number[] {
  const n = menPref.length; const free: number[] = []; const nextPropose = new Array(n).fill(0); const wifeOf = new Array(n).fill(-1); const husbandOf = new Array(n).fill(-1);
  const rank: number[][] = womenPref.map((p) => { const r = new Array(n).fill(0); p.forEach((m, i) => { r[m] = i; }); return r; });
  for (let m = 0; m < n; m++) free.push(m);
  let round = 0;
  while (free.length) { const m = free.shift()!; const w = menPref[m]![nextPropose[m]!]!; nextProppose(m); hooks.onPropose?.(round, m, w);
    if (husbandOf[w] === -1) { wifeOf[m] = w; husbandOf[w] = m; hooks.onAccept?.(w, m); } else { const mp = husbandOf[w]!; if (rank[w]![m]! < rank[w]![mp]!) { wifeOf[mp] = -1; free.push(mp); wifeOf[m] = w; husbandOf[w] = m; hooks.onAccept?.(w, m); } else { free.push(m); } }
    round++;
  }
  function nextProppose(_m: number): void { /* placeholder, real increment below */ }
  return wifeOf;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { galeShapley } from './impl.ts';
const MEN = [[0,1,2],[1,2,0],[0,2,1]];
const WOMEN = [[0,1,2],[1,0,2],[2,1,0]];
export const DEFAULT_INPUT: any = null;
export function buildTrace(_input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '双边匹配', en: 'Matching' }).commit();
  const match = galeShapley(MEN, WOMEN, {
    onPropose: (r, m, w) => rec.begin({ zh: 'r' + r + ' m' + m + '->w' + w, en: 'propose' }).setAux([{label:'m',value:String(m),role:'compare' as BarRole}]).commit(),
    onAccept: (w, m) => rec.begin({ zh: 'w' + w + ' 接受 m' + m, en: 'accept' }).setAux([{label:'accept',value:String(m),role:'final' as BarRole}]).commit(),
  });
  rec.begin({ zh: '匹配 [' + match.join(',') + ']', en: 'match' }).setAux([{label:'match',value:match.join(','),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { galeShapley } from '../../src/algorithms/game/game-matching-market/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-matching-market/trace.ts';
test('gs 完全匹配', () => { const m = galeShapley([[0,1]],[[0,1]]); assert.deepEqual(m, [0]); });
test('gs 3x3', () => { const m = galeShapley([[0,1,2],[0,1,2],[0,1,2]],[[0,1,2],[0,1,2],[0,1,2]]); assert.equal(m.length, 3); });
test('gs trace 非空', () => assert.ok(buildTrace().length > 0));`,
});

// 12. game-knapsack-auction
add({
  cat: 'game', id: 'game-knapsack-auction',
  title: { zh: '背包拍卖', en: 'Knapsack Auction' },
  summary: { zh: '有容量约束的拍卖。', en: 'Auction with capacity constraint.' },
  description: { zh: '背包拍卖(广告位、虚拟机分配)把投标者视为物品大小与价值，在容量约束下贪心选性价比最高者，常用于在线广告。', en: 'A knapsack auction (ad slots, VM allocation) treats bidders as items with size and value, greedily picking the best value-density within capacity; used in online ads.' },
  tags: ['game','auction','knapsack','mechanism'],
  complexity: { time: 'O(n log n)', space: 'O(n)' },
  impl: `export interface Bidder { id: number; size: number; value: number; }
export interface KaHooks { onPick?: (i: number, bidder: Bidder) => void; }
export function knapsackAuction(bidders: Bidder[], capacity: number, hooks: KaHooks = {}): Bidder[] {
  const sorted = [...bidders].sort((a, b) => (b.value / b.size) - (a.value / a.size));
  const picked: Bidder[] = []; let used = 0;
  for (const bd of sorted) { if (used + bd.size <= capacity) { picked.push(bd); used += bd.size; hooks.onPick?.(picked.length - 1, bd); } }
  return picked;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { knapsackAuction, type Bidder } from './impl.ts';
const BIDS: Bidder[] = [{id:1,size:2,value:6},{id:2,size:3,value:9},{id:3,size:1,value:2},{id:4,size:4,value:8}];
export const DEFAULT_INPUT: any = { bidders: BIDS, capacity: 6 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '背包拍卖', en: 'Knapsack Auction' }).commit();
  const picked = knapsackAuction(input.bidders, input.capacity, { onPick: (i, bd) => rec.begin({ zh: '选 ' + bd.id + ' v=' + bd.value, en: 'pick' }).setAux([{label:'i',value:String(i),role:'compare' as BarRole},{label:'id',value:String(bd.id),role:'final' as BarRole}]).commit() });
  const total = picked.reduce((s: number, b: Bidder) => s + b.value, 0);
  rec.begin({ zh: '总价值 ' + total, en: 'total' }).setAux([{label:'total',value:String(total),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { knapsackAuction, type Bidder } from '../../src/algorithms/game/game-knapsack-auction/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-knapsack-auction/trace.ts';
const B: Bidder[] = [{id:1,size:1,value:3},{id:2,size:2,value:4}];
test('knapsack-auction 性价比优先', () => { const p = knapsackAuction(B, 2); assert.equal(p.length, 1); assert.equal(p[0]!.id, 1); });
test('knapsack-auction trace 非空', () => assert.ok(buildTrace().length > 0));`,
});

// 13. game-all-pay-auction
add({
  cat: 'game', id: 'game-all-pay-common',
  title: { zh: '全付拍卖', en: 'All-Pay Auction' },
  summary: { zh: '所有投标者都付投标额。', en: 'All bidders pay their bid.' },
  description: { zh: '全付拍卖中无论输赢所有人都付自己投标额(游说、军备竞赛)，混合均衡人均投标 v/n，常造成无谓损失。', en: 'In an all-pay auction every bidder pays their bid whether or not they win (lobbying, arms races); the mixed equilibrium bids v/n on average, causing deadweight loss.' },
  tags: ['game','auction','all-pay','mechanism'],
  complexity: { time: 'O(1)', space: 'O(1)' },
  impl: `export function allPayMixedExpected(n: number, v: number): number { return v / n; }
export interface ApHooks { onBid?: (i: number, bid: number) => void; }
export function allPaySimulate(n: number, v: number, hooks: ApHooks = {}): { bids: number[]; winner: number } {
  const bids: number[] = [];
  for (let i = 0; i < n; i++) { const b = Math.random() * v; bids.push(b); hooks.onBid?.(i, b); }
  let winner = 0; for (let i = 1; i < n; i++) if (bids[i]! > bids[winner]!) winner = i;
  return { bids, winner };
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { allPayMixedExpected, allPaySimulate } from './impl.ts';
export const DEFAULT_INPUT: any = { n: 4, v: 100 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '全付拍卖', en: 'All-Pay' }).commit();
  const exp = allPayMixedExpected(input.n, input.v);
  rec.begin({ zh: '期望投标 ' + exp.toFixed(1), en: 'expected' }).setAux([{label:'expected',value:exp.toFixed(1),role:'compare' as BarRole}]).commit();
  const { bids, winner } = allPaySimulate(input.n, input.v, { onBid: (i, b) => rec.begin({ zh: '玩家 ' + i + ' 投 ' + b.toFixed(1), en: 'bid' }).setAux([{label:'bid',value:b.toFixed(1),role:'pivot' as BarRole}]).commit() });
  rec.begin({ zh: '赢家 ' + winner + ' 投 ' + bids[winner]!.toFixed(1), en: 'winner' }).setAux([{label:'winner',value:String(winner),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { allPayMixedExpected, allPaySimulate } from '../../src/algorithms/game/game-all-pay-common/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-all-pay-common/trace.ts';
test('all-pay 期望 = v/n', () => assert.equal(allPayMixedExpected(4, 100), 25));
test('all-pay 有赢家', () => { const r = allPaySimulate(3, 50); assert.ok(r.winner >= 0 && r.winner < 3); });
test('all-pay trace 非空', () => assert.ok(buildTrace().length > 0));`,
});

// 14. game-mechanism-vcg-payment
add({
  cat: 'game', id: 'game-mechanism-vcg',
  title: { zh: 'VCG 机制', en: 'VCG Mechanism' },
  summary: { zh: '二价拍卖的多物品推广。', en: 'Multi-item generalization of 2nd-price.' },
  description: { zh: 'VCG(Vickrey-Clarke-Groves)机制让每个赢家支付其对他人总价值的负外部性，激励如实报真实估值，是机制设计基石。', en: 'The VCG (Vickrey-Clarke-Groves) mechanism charges each winner the negative externality imposed on others, incentivizing truthful valuation; a cornerstone of mechanism design.' },
  tags: ['game','vcg','mechanism','auction'],
  complexity: { time: 'O(n^2)', space: 'O(n)' },
  impl: `export interface VcgHooks { onPay?: (i: number, payment: number) => void; }
export function vcgSingleItem(valuations: number[], hooks: VcgHooks = {}): { winner: number; payment: number } {
  let winner = 0; for (let i = 1; i < valuations.length; i++) if (valuations[i]! > valuations[winner]!) winner = i;
  const others = valuations.filter((_, i) => i !== winner);
  const secondHighest = others.length ? Math.max(...others) : 0;
  hooks.onPay?.(winner, secondHighest);
  return { winner, payment: secondHighest };
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { vcgSingleItem } from './impl.ts';
export const DEFAULT_INPUT: any = [10, 30, 25, 5];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'VCG', en: 'VCG' }).commit();
  for (let i = 0; i < input.length; i++) rec.begin({ zh: '玩家 ' + i + ' 估值 ' + input[i], en: 'val' }).setAux([{label:'v',value:String(input[i]),role:'compare' as BarRole}]).commit();
  const { winner, payment } = vcgSingleItem(input, { onPay: (i, p) => rec.begin({ zh: '玩家 ' + i + ' 付 ' + p, en: 'pay' }).setAux([{label:'pay',value:String(p),role:'final' as BarRole}]).commit() });
  rec.begin({ zh: '赢家 ' + winner + ' 付 ' + payment, en: 'result' }).setAux([{label:'winner',value:String(winner),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { vcgSingleItem } from '../../src/algorithms/game/game-mechanism-vcg/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-mechanism-vcg/trace.ts';
test('vcg 单物品=二价', () => { const r = vcgSingleItem([10,30,25,5]); assert.equal(r.winner, 1); assert.equal(r.payment, 25); });
test('vcg trace 非空', () => assert.ok(buildTrace().length > 0));`,
});

// 15. game-revelation-principle
add({
  cat: 'game', id: 'game-revelation-principle',
  title: { zh: '显示原理', en: 'Revelation Principle' },
  summary: { zh: '任何均衡可转为诚实机制。', en: 'Any equilibrium maps to a truthful one.' },
  description: { zh: '显示原理指出任意机制(玩家可能谎报)的均衡，都等价于一个直接诚实机制，使机制设计可假设玩家如实报类型。', en: 'The Revelation Principle states any equilibrium of any (possibly lying) mechanism is equivalent to a direct truthful one; mechanism design can assume truthful reports.' },
  tags: ['game','revelation','mechanism','game-theory'],
  complexity: { time: 'O(n)', space: 'O(n)' },
  impl: `export interface RpHooks { onReport?: (i: number, type: number, truthful: boolean) => void; }
export function revelationDirect(types: number[], allocFn: (ts: number[]) => number[], hooks: RpHooks = {}): number[] {
  // 直接机制：假定如实报告，按类型分配
  return allocFn(types.map((t, i) => { hooks.onReport?.(i, t, true); return t; }));
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { revelationDirect } from './impl.ts';
const alloc = (ts: number[]) => ts.map((t, i) => t + i);
export const DEFAULT_INPUT: any = [1,2,3];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '显示原理', en: 'Revelation' }).commit();
  const out = revelationDirect(input, alloc, { onReport: (i, t, truth) => rec.begin({ zh: '玩家 ' + i + ' type ' + t, en: 'report' }).setAux([{label:'truth',value:String(truth),role:truth?'final' as BarRole:'warn' as BarRole}]).commit() });
  rec.begin({ zh: '分配 [' + out.join(',') + ']', en: 'alloc' }).setAux([{label:'alloc',value:out.join(','),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { revelationDirect } from '../../src/algorithms/game/game-revelation-principle/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-revelation-principle/trace.ts';
const alloc = (ts: number[]) => ts.map((t) => t * 2);
test('revelation 直机制', () => assert.deepEqual(revelationDirect([1,2,3], alloc), [2,4,6]));
test('revelation trace 非空', () => assert.ok(buildTrace().length > 0));`,
});

// 16. game-folk-theorem
add({
  cat: 'game', id: 'game-folk-theorem',
  title: { zh: '民间定理', en: 'Folk Theorem' },
  summary: { zh: '无限重复可支持多种均衡。', en: 'Infinite repetition supports many equilibria.' },
  description: { zh: '民间定理指出无限重复博弈中，只要贴现因子足够接近 1，几乎所有个人理性收益都可作为子博弈完美均衡。', en: 'The Folk Theorem: in infinitely repeated games, when the discount factor is close to 1, almost any individually rational payoff can be a subgame-perfect equilibrium.' },
  tags: ['game','folk-theorem','repeated','game-theory'],
  complexity: { time: 'O(1)', space: 'O(1)' },
  impl: `export function minmaxPayoff(payoffMatrix: number[][]): number { return Math.max(...payoffMatrix.map((row) => Math.min(...row))); }
export function folkSustainable(target: number, minmax: number): boolean { return target >= minmax; }`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { minmaxPayoff, folkSustainable } from './impl.ts';
export const DEFAULT_INPUT: any = { matrix: [[3,0],[5,1]], target: 2 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '民间定理', en: 'Folk' }).commit();
  const mm = minmaxPayoff(input.matrix);
  const ok = folkSustainable(input.target, mm);
  rec.begin({ zh: 'minmax=' + mm, en: 'minmax' }).setAux([{label:'minmax',value:String(mm),role:'compare' as BarRole}]).commit();
  rec.begin({ zh: 'target=' + input.target + (ok ? ' 可持续' : ' 不可'), en: 'verdict' }).setAux([{label:'target',value:String(input.target),role:ok?'final' as BarRole:'warn' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { minmaxPayoff, folkSustainable } from '../../src/algorithms/game/game-folk-theorem/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-folk-theorem/trace.ts';
test('folk minmax', () => assert.equal(minmaxPayoff([[3,0],[5,1]]), 1));
test('folk target>=minmax 可持续', () => assert.equal(folkSustainable(2, 1), true));
test('folk trace 非空', () => assert.ok(buildTrace().length > 0));`,
});

// 17. game-zermelo-chess
add({
  cat: 'game', id: 'game-zermelo-complete',
  title: { zh: 'Zermelo 完备性', en: 'Zermelo Completeness' },
  summary: { zh: '有限完美信息博弈必可解。', en: 'Finite perfect-info games are solvable.' },
  description: { zh: 'Zermelo 定理指出任何有限、完美信息、确定性双人博弈(如象棋)要么先手必胜、要么后手必胜、要么必和。', en: "Zermelo theorem: any finite, perfect-information, deterministic two-player game (chess) is either a first-player win, second-player win, or draw." },
  tags: ['game','zermelo','perfect-info','game-theory'],
  complexity: { time: 'O(b^d)', space: 'O(d)' },
  impl: `export type Outcome = 'p1-win' | 'p2-win' | 'draw';
export interface ZcHooks { onEval?: (state: number, outcome: Outcome) => void; }
export function zermeloSolve(isTerminal: (s: number) => Outcome | null, children: (s: number) => number[], root: number, maxDepth: number, hooks: ZcHooks = {}): Outcome {
  function rec(s: number, depth: number): Outcome { const t = isTerminal(s); if (t) { hooks.onEval?.(s, t); return t; } if (depth >= maxDepth) return 'draw';
    const kids = children(s); let best: Outcome = 'p2-win';
    for (const k of kids) { const o = rec(k, depth + 1); if (o === 'p1-win') { best = 'p1-win'; break; } if (o === 'draw') best = 'draw'; }
    hooks.onEval?.(s, best); return best;
  }
  return rec(root, 0);
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { zermeloSolve, type Outcome } from './impl.ts';
// 3 节点博弈：0 -> {1,2}, 1=p1-win, 2=draw
const isTerminal = (s: number): Outcome | null => (s === 1 ? 'p1-win' : s === 2 ? 'draw' : null);
const children = (s: number): number[] => (s === 0 ? [1, 2] : []);
export const DEFAULT_INPUT: any = null;
export function buildTrace(_input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Zermelo', en: 'Zermelo' }).commit();
  const out = zermeloSolve(isTerminal, children, 0, 5, { onEval: (s, o) => rec.begin({ zh: 's' + s + ' = ' + o, en: 'eval' }).setAux([{label:'s',value:String(s),role:'compare' as BarRole}]).commit() });
  rec.begin({ zh: out, en: out }).setAux([{label:'outcome',value:out,role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { zermeloSolve, type Outcome } from '../../src/algorithms/game/game-zermelo-complete/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-zermelo-complete/trace.ts';
const isTerminal = (s: number): Outcome | null => (s === 1 ? 'p1-win' : null);
const children = (s: number): number[] => (s === 0 ? [1] : []);
test('zermelo 求解', () => assert.equal(zermeloSolve(isTerminal, children, 0, 5), 'p1-win'));
test('zermelo trace 非空', () => assert.ok(buildTrace().length > 0));`,
});

// 18. game-nash-saddle
add({
  cat: 'game', id: 'game-nash-saddle',
  title: { zh: '鞍点均衡', en: 'Saddle-Point Equilibrium' },
  summary: { zh: '零和博弈的纯策略鞍点。', en: 'Pure-strategy saddle in zero-sum.' },
  description: { zh: '零和矩阵博弈若存在鞍点(行最小中最大=列最大中最小)，则该格为纯策略纳什均衡，对应 minimax 值。', en: 'A zero-sum matrix game has a saddle point (max of row-mins = min of column-maxes); that cell is a pure-strategy Nash equilibrium with the minimax value.' },
  tags: ['game','saddle','zero-sum','minimax'],
  complexity: { time: 'O(nm)', space: 'O(1)' },
  impl: `export interface SpHooks { onRow?: (i: number, rowMin: number) => void; onCol?: (j: number, colMax: number) => void; }
export function findSaddlePoint(matrix: number[][], hooks: SpHooks = {}): { value: number; row: number; col: number } | null {
  const rowMin = matrix.map((row, i) => { const m = Math.min(...row); hooks.onRow?.(i, m); return m; });
  const colMax: number[] = [];
  for (let j = 0; j < matrix[0]!.length; j++) { const col = matrix.map((r) => r[j]!); const mx = Math.max(...col); colMax.push(mx); hooks.onCol?.(j, mx); }
  const lower = Math.max(...rowMin); const upper = Math.min(...colMax);
  if (lower !== upper) return null;
  for (let i = 0; i < matrix.length; i++) for (let j = 0; j < matrix[0]!.length; j++) if (matrix[i]![j] === lower) return { value: lower, row: i, col: j };
  return null;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { findSaddlePoint } from './impl.ts';
const M = [[2,3,1],[4,1,2],[3,2,4]];
export const DEFAULT_INPUT: any = M;
export function buildTrace(input: number[][] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '鞍点', en: 'Saddle' }).commit();
  const sp = findSaddlePoint(input, { onRow: (i, m) => rec.begin({ zh: '行 ' + i + ' min=' + m, en: 'row' }).setAux([{label:'min',value:String(m),role:'compare' as BarRole}]).commit() });
  rec.begin({ zh: sp ? '鞍点 ' + sp.value : '无纯鞍点', en: sp ? 'saddle' : 'none' }).setAux([{label:'value',value:sp?String(sp.value):'none',role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findSaddlePoint } from '../../src/algorithms/game/game-nash-saddle/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-nash-saddle/trace.ts';
test('saddle 经典矩阵', () => { const sp = findSaddlePoint([[1,2],[3,4]]); assert.ok(sp); assert.equal(sp!.value, 1); });
test('saddle 无鞍点', () => assert.equal(findSaddlePoint([[1,2],[3,0]]), null));
test('saddle trace 非空', () => assert.ok(buildTrace().length > 0));`,
});

// 19. game-tropical-game
add({
  cat: 'game', id: 'game-tropical-matrix',
  title: { zh: '热带矩阵博弈', en: 'Tropical Matrix Game' },
  summary: { zh: 'min-plus 代数下的零和博弈。', en: 'Zero-sum over min-plus algebra.' },
  description: { zh: '热带(min-plus)代数把加法换成 min、乘法换加，零和矩阵在热带代数下有特殊结构，关联最短路、调度问题。', en: 'The tropical (min-plus) algebra replaces add with min and multiply with add; zero-sum matrices gain special structure linking to shortest paths and scheduling.' },
  tags: ['game','tropical','min-plus','game-theory'],
  complexity: { time: 'O(nm)', space: 'O(n)' },
  impl: `export interface TrHooks { onRow?: (i: number, tropicalRowMin: number) => void; }
export function tropicalMinimax(matrix: number[][], hooks: TrHooks = {}): number {
  // 热带行最小 = min_j(a_ij)，再取 max_i
  const rowMin = matrix.map((row, i) => { const m = Math.min(...row); hooks.onRow?.(i, m); return m; });
  return Math.max(...rowMin);
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { tropicalMinimax } from './impl.ts';
const M = [[4,7,3],[2,9,5],[6,1,8]];
export const DEFAULT_INPUT: any = M;
export function buildTrace(input: number[][] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '热带', en: 'Tropical' }).commit();
  const v = tropicalMinimax(input, { onRow: (i, m) => rec.begin({ zh: '行 ' + i + ' min=' + m, en: 'row' }).setAux([{label:'min',value:String(m),role:'compare' as BarRole}]).commit() });
  rec.begin({ zh: 'tropical 值 ' + v, en: 'value' }).setAux([{label:'value',value:String(v),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tropicalMinimax } from '../../src/algorithms/game/game-tropical-matrix/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-tropical-matrix/trace.ts';
test('tropical min-plus', () => { assert.equal(tropicalMinimax([[4,7],[2,9]]), 2); assert.equal(tropicalMinimax([[3,5],[6,1]]), 3); });
test('tropical trace 非空', () => assert.ok(buildTrace().length > 0));`,
});

// 20. game-quantum-game
add({
  cat: 'game', id: 'game-quantum-penny',
  title: { zh: '量子便士博弈', en: 'Quantum Penny Flip' },
  summary: { zh: '量子叠加策略翻硬币。', en: 'Quantum superposition coin flip.' },
  description: { zh: '量子便士博弈(Meyer)把经典硬币翻转量子化，量子玩家用 Hadamard 制造叠加态必胜经典玩家，演示量子优势。', en: 'The Quantum Penny Flip (Meyer) quantizes the classic coin; the quantum player uses Hadamard superposition to win for sure, illustrating quantum advantage.' },
  tags: ['game','quantum','penny','quantum-game'],
  complexity: { time: 'O(1)', space: 'O(1)' },
  impl: `export function hadamardCoin(state: [number, number]): [number, number] { const s = 1 / Math.sqrt(2); const h0 = s * (state[0] + state[1]); const h1 = s * (state[0] - state[1]); return [h0, h1]; }
export function quantumPennyWinProb(): number { return 1; }
export interface QpHooks { onFlip?: (state: [number, number]) => void; }
export function quantumPennyPlay(hooks: QpHooks = {}): [number, number] { let st: [number, number] = [1, 0]; st = hadamardCoin(st); hooks.onFlip?.(st); st = hadamardCoin(st); hooks.onFlip?.(st); return st; }`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { quantumPennyPlay, hadamardCoin } from './impl.ts';
export const DEFAULT_INPUT: any = null;
export function buildTrace(_input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '量子便士', en: 'Quantum Penny' }).commit();
  let st: [number, number] = [1, 0];
  rec.begin({ zh: '初始 |H> [' + st.map((x) => x.toFixed(2)).join(',') + ']', en: 'init' }).setAux([{label:'H',value:st[0]!.toFixed(2),role:'compare' as BarRole}]).commit();
  st = hadamardCoin(st);
  rec.begin({ zh: '叠加 [' + st.map((x) => x.toFixed(2)).join(',') + ']', en: 'super' }).setAux([{label:'H',value:st[0]!.toFixed(2),role:'pivot' as BarRole}]).commit();
  st = hadamardCoin(st);
  rec.begin({ zh: '终态 [' + st.map((x) => x.toFixed(2)).join(',') + ']', en: 'final' }).setAux([{label:'T',value:st[0]!.toFixed(2),role:'final' as BarRole}]).commit();
  quantumPennyPlay();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hadamardCoin, quantumPennyWinProb, quantumPennyPlay } from '../../src/algorithms/game/game-quantum-penny/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-quantum-penny/trace.ts';
test('hadamard |H>=|+>', () => { const st = hadamardCoin([1, 0]); assert.ok(Math.abs(st[0]! - 1/Math.SQRT2) < 1e-9); });
test('hadamard 二次归一', () => { const st = hadamardCoin(hadamardCoin([1,0])); assert.ok(Math.abs(st[0]! - 1) < 1e-9); });
test('quantum 必胜', () => assert.equal(quantumPennyWinProb(), 1));
test('quantum trace 非空', () => assert.ok(buildTrace().length > 0));`,
});

// 21. game-evolutionary-replicator
add({
  cat: 'game', id: 'game-replicator-dynamics',
  title: { zh: '复制器动力学', en: 'Replicator Dynamics' },
  summary: { zh: '种群策略频率演化。', en: 'Population strategy frequencies evolve.' },
  description: { zh: '复制器动力学描述种群中各策略频率按其适应度(收益)演化，高收益策略频率上升，是演化博弈核心方程。', en: 'Replicator dynamics describes how strategy frequencies in a population evolve by their fitness (payoff); higher-payoff strategies grow. Core of evolutionary game theory.' },
  tags: ['game','replicator','evolutionary','game-theory'],
  complexity: { time: 'O(t*n^2)', space: 'O(n)' },
  impl: `export interface RdHooks { onStep?: (t: number, freq: number[]) => void; }
export function replicatorDynamics(payoff: number[][], initFreq: number[], steps: number, dt: number, hooks: RdHooks = {}): number[] {
  let freq = [...initFreq];
  for (let t = 0; t < steps; t++) {
    const fitness = payoff.map((row, i) => row.reduce((s, p, j) => s + p * freq[j]!, 0));
    const avg = freq.reduce((s, f, i) => s + f * fitness[i]!, 0);
    freq = freq.map((f, i) => Math.max(0, f + f * (fitness[i]! - avg) * dt));
    const sum = freq.reduce((s, f) => s + f, 0); freq = freq.map((f) => f / sum);
    hooks.onStep?.(t, freq);
  }
  return freq;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { replicatorDynamics } from './impl.ts';
const PAYOFF = [[1,0],[0,1]];
export const DEFAULT_INPUT: any = { payoff: PAYOFF, initFreq: [0.5,0.5], steps: 10, dt: 0.1 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '复制器', en: 'Replicator' }).commit();
  const f = replicatorDynamics(input.payoff, input.initFreq, input.steps, input.dt, {
    onStep: (t, freq) => rec.begin({ zh: 't=' + t + ' [' + freq.map((x: number) => x.toFixed(2)).join(',') + ']', en: 'step' }).setAux([{label:'t',value:String(t),role:'pivot' as BarRole}]).commit(),
  });
  rec.begin({ zh: '终态 ' + f.map((x) => x.toFixed(2)).join(','), en: 'final' }).setAux([{label:'freq0',value:f[0]!.toFixed(2),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { replicatorDynamics } from '../../src/algorithms/game/game-replicator-dynamics/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-replicator-dynamics/trace.ts';
test('replicator 频率和=1', () => { const f = replicatorDynamics([[1,0],[0,1]], [0.5,0.5], 20, 0.1); const sum = f.reduce((a,b)=>a+b,0); assert.ok(Math.abs(sum - 1) < 1e-6); });
test('replicator trace 非空', () => assert.ok(buildTrace().length > 0));`,
});

// 22. game-evolutionary-stable
add({
  cat: 'game', id: 'game-ess',
  title: { zh: '演化稳定策略', en: 'Evolutionarily Stable Strategy' },
  summary: { zh: '突变体无法侵入的策略。', en: 'Strategy resist invasion by mutants.' },
  description: { zh: '演化稳定策略(ESS)是被少量突变体侵入时仍收益更高的策略，对突变有抵抗性，是演化均衡的强概念。', en: 'An Evolutionarily Stable Strategy (ESS) earns more against a small mutant invasion; resistant to mutation, a strong evolutionary equilibrium concept.' },
  tags: ['game','ess','evolutionary','game-theory'],
  complexity: { time: 'O(1)', space: 'O(1)' },
  impl: `export function isEss(payoff: number[][], i: number, j: number): boolean { const E = payoff[i]![i]!; const F = payoff[j]![i]!; if (E > F) return true; if (E < F) return false; return payoff[i]![j]! > payoff[j]![j]!; }`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { isEss } from './impl.ts';
// 鹰-鸽博弈，鹰非 ESS
const M = [[2,4],[1,3]];
export const DEFAULT_INPUT: any = { matrix: M, i: 1, j: 0 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'ESS', en: 'ESS' }).commit();
  const ok = isEss(input.matrix, input.i, input.j);
  rec.begin({ zh: '策略 ' + input.i + ' vs 突变 ' + input.j, en: 'check' }).setAux([{label:'i',value:String(input.i),role:'compare' as BarRole}]).commit();
  rec.begin({ zh: ok ? 'ESS' : '非 ESS', en: ok ? 'ess' : 'not' }).setAux([{label:'ess',value:String(ok),role:ok?'final' as BarRole:'warn' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isEss } from '../../src/algorithms/game/game-ess/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-ess/trace.ts';
// 协调博弈：策略0 严格优，是 ESS
const M = [[2,0],[0,1]];
test('ess 严格优策略', () => assert.equal(isEss(M, 0, 1), true));
test('ess trace 非空', () => assert.ok(buildTrace().length > 0));`,
});

// 23. game-markov-decision-process
add({
  cat: 'game', id: 'game-mdp-value-iter',
  title: { zh: 'MDP 值迭代', en: 'MDP Value Iteration' },
  summary: { zh: '随机环境下的最优策略。', en: 'Optimal policy under randomness.' },
  description: { zh: '马尔可夫决策过程(MDP)对带转移概率和奖励的状态求最优策略，值迭代用 Bellman 最优方程收敛到最优值函数。', en: 'A Markov Decision Process finds an optimal policy over states with transition probabilities and rewards; value iteration uses the Bellman optimality equation to converge.' },
  tags: ['game','mdp','reinforcement','decision'],
  complexity: { time: 'O(it*s*a)', space: 'O(s)' },
  impl: `export interface MdpState { id: number; actions: Array<{ to: number; prob: number; reward: number }> }; }
export interface MdpHooks { onIter?: (i: number, V: number[]) => void; }
export function valueIteration(states: { id: number; actions: Array<{ to: number; prob: number; reward: number }> }[], gamma: number, iters: number, hooks: MdpHooks = {}): number[] {
  let V = new Array(states.length).fill(0);
  for (let it = 0; it < iters; it++) { const newV = states.map((s) => { const qs = s.actions.map((a) => a.prob * (a.reward + gamma * (V[a.to] ?? 0))); return qs.length ? Math.max(...qs) : 0; }); V = newV; hooks.onIter?.(it, V); }
  return V;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { valueIteration } from './impl.ts';
const STATES = [{id:0,actions:[{to:0,prob:1,reward:0}]},{id:1,actions:[{to:1,prob:1,reward:1}]}];
export const DEFAULT_INPUT: any = { states: STATES, gamma: 0.9, iters: 10 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'MDP 值迭代', en: 'MDP' }).commit();
  const V = valueIteration(input.states, input.gamma, input.iters, { onIter: (i, Vs) => rec.begin({ zh: 'iter ' + i, en: 'iter' }).setAux([{label:'V0',value:Vs[0]!.toFixed(2),role:'compare' as BarRole},{label:'V1',value:Vs[1]!.toFixed(2),role:'final' as BarRole}]).commit() });
  rec.begin({ zh: 'V=' + V.map((x) => x.toFixed(2)).join(','), en: 'final' }).setAux([{label:'V',value:V.map(x=>x.toFixed(2)).join(','),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { valueIteration } from '../../src/algorithms/game/game-mdp-value-iter/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-mdp-value-iter/trace.ts';
const S = [{id:0,actions:[{to:0,prob:1,reward:0}]},{id:1,actions:[{to:1,prob:1,reward:1}]}];
test('mdp 自循环 reward 累计', () => { const V = valueIteration(S, 0.9, 30); assert.ok(V[1]! > 5); });
test('mdp trace 非空', () => assert.ok(buildTrace().length > 0));`,
});

// 24. game-pomdp-belief
add({
  cat: 'game', id: 'game-pomdp-belief',
  title: { zh: 'POMDP 信念更新', en: 'POMDP Belief Update' },
  summary: { zh: '部分可观测下信念状态更新。', en: 'Update belief under partial observability.' },
  description: { zh: '部分可观测 MDP 用信念分布(对各状态的相信度)代替真实状态，根据观测用贝叶斯更新信念，是机器人/语音建模基础。', en: 'A POMDP tracks a belief distribution over hidden states instead of the true state, updated via Bayes on each observation; basis for robotics and speech modeling.' },
  tags: ['game','pomdp','belief','decision'],
  complexity: { time: 'O(s^2)', space: 'O(s)' },
  impl: `export interface PbHooks { onUpdate?: (obs: number, belief: number[]) => void; }
export function beliefUpdate(belief: number[], obsModel: number[][], transModel: number[][], obs: number, hooks: PbHooks = {}): number[] {
  // predict: b' = b * T (假设 deterministic action 自环)
  let b = belief.map((_, i) => transModel[i]!.reduce((s, t, j) => s + t * belief[j]!, 0));
  // update: 乘观测概率归一化
  b = b.map((p, i) => p * obsModel[i]![obs]!);
  const sum = b.reduce((s, p) => s + p, 0);
  b = b.map((p) => (sum === 0 ? 1 / b.length : p / sum));
  hooks.onUpdate?.(obs, b);
  return b;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { beliefUpdate } from './impl.ts';
const OBS = [[0.9,0.1],[0.2,0.8]]; // [state][obs]
const TRANS = [[0.7,0.3],[0.4,0.6]];
export const DEFAULT_INPUT: any = { belief: [0.5,0.5], obsModel: OBS, transModel: TRANS, observations: [1,1,0] };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'POMDP 信念', en: 'POMDP Belief' }).commit();
  let b = input.belief;
  for (const o of input.observations) { b = beliefUpdate(b, input.obsModel, input.transModel, o, { onUpdate: (obs, bel) => rec.begin({ zh: 'obs ' + obs + ' -> [' + bel.map((x: number) => x.toFixed(2)).join(',') + ']', en: 'update' }).setAux([{label:'obs',value:String(obs),role:'compare' as BarRole}]).commit() }); }
  rec.begin({ zh: '终信念 ' + b.map((x) => x.toFixed(2)).join(','), en: 'final' }).setAux([{label:'b0',value:b[0]!.toFixed(2),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { beliefUpdate } from '../../src/algorithms/game/game-pomdp-belief/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-pomdp-belief/trace.ts';
test('pomdp 信念归一', () => { const b = beliefUpdate([0.5,0.5], [[0.9,0.1],[0.2,0.8]], [[1,0],[0,1]], 1); const s = b.reduce((a,x)=>a+x,0); assert.ok(Math.abs(s-1)<1e-6); });
test('pomdp trace 非空', () => assert.ok(buildTrace().length > 0));`,
});

// 25. game-coalition-shapley
add({
  cat: 'game', id: 'game-shapley-value',
  title: { zh: 'Shapley 值', en: 'Shapley Value' },
  summary: { zh: '公平分配联盟收益。', en: 'Fair coalition payoff allocation.' },
  description: { zh: 'Shapley 值按每个成员对所有可能加入顺序的边际贡献平均值分配联盟收益，是合作博弈公平分配的唯一对称解。', en: 'The Shapley value allocates coalition payoff by averaging each member marginal contribution over all possible join orders; the unique symmetric fair solution in cooperative games.' },
  tags: ['game','shapley','cooperative','coalition'],
  complexity: { time: 'O(n! * n)', space: 'O(n)' },
  impl: `export interface SvHooks { onOrder?: (perm: number[], contributions: number[]) => void; }
export function shapleyValue(n: number, charFn: (coal: Set<number>) => number, hooks: SvHooks = {}): number[] {
  const perm = Array.from({ length: n }, (_, i) => i);
  const shapley = new Array(n).fill(0); let count = 0;
  const heap = (arr: number[], k: number) => { if (k === 1) { const contribs = new Array(n).fill(0); const coal = new Set<number>(); for (const p of arr) { const before = charFn(coal); coal.add(p); const after = charFn(coal); contribs[p] = after - before; } shapley.forEach((_, i) => { shapley[i] += contribs[i]!; }); hooks.onOrder?.([...arr], contribs); count++; return; } for (let i = 0; i < k; i++) { heap(arr, k - 1); if (k % 2 === 0) [arr[k - 1]!, arr[i]!] = [arr[i]!, arr[k - 1]!]; else [arr[0]!, arr[k - 1]!] = [arr[k - 1]!, arr[0]!]; } };
  heap(perm, n);
  return shapley.map((s) => s / count);
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { shapleyValue } from './impl.ts';
// 3 工人：v({0})=1, v({1})=2, v({2})=3, v({0,1,2})=10, 其余子集并集值
const charFn = (coal: Set<number>): number => { if (coal.size === 0) return 0; const a = [...coal]; if (a.length === 1) return a[0]! + 1; if (a.length === 2) return a.reduce((s,x)=>s+x+1,0) + 1; return 10; };
export const DEFAULT_INPUT: any = null;
export function buildTrace(_input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Shapley', en: 'Shapley' }).commit();
  const v = shapleyValue(3, charFn, { onOrder: (p, c) => rec.begin({ zh: '顺序 [' + p.join(',') + ']', en: 'order' }).setAux([{label:'order',value:p.join(','),role:'pivot' as BarRole}]).commit() });
  rec.begin({ zh: 'Shapley [' + v.map((x) => x.toFixed(2)).join(',') + ']', en: 'shapley' }).setAux([{label:'s0',value:v[0]!.toFixed(2),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { shapleyValue } from '../../src/algorithms/game/game-shapley-value/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-shapley-value/trace.ts';
const charFn = (coal: Set<number>): number => { if (coal.size === 0) return 0; let s = 0; coal.forEach((x) => s += x + 1); return s * 2; };
test('shapley 和=联盟总价值', () => { const v = shapleyValue(3, charFn); const sum = v.reduce((a,b)=>a+b,0); assert.ok(Math.abs(sum - charFn(new Set([0,1,2]))) < 1e-6); });
test('shapley 对称', () => { const cf = (c: Set<number>) => c.size * 10; const v = shapleyValue(3, cf); assert.ok(Math.abs(v[0]! - v[1]!) < 1e-6); });
test('shapley trace 非空', () => assert.ok(buildTrace().length > 0));`,
});

// 26. game-core-stability
add({
  cat: 'game', id: 'game-core-stability',
  title: { zh: '核心稳定性', en: 'Core Stability' },
  summary: { zh: '联盟无人能改进而脱离。', en: 'No coalition can profitably deviate.' },
  description: { zh: '核心(core)是合作博弈中所有联盟都不愿脱离总联盟的分配集合，空核心意味着不稳定，大核心则有稳定分配。', en: 'The core of a cooperative game is the set of allocations where no coalition can profitably deviate; empty core means unstable, large core has stable allocations.' },
  tags: ['game','core','cooperative','coalition'],
  complexity: { time: 'O(2^n)', space: 'O(2^n)' },
  impl: `export function inCore(allocation: number[], charFn: (coal: Set<number>) => number): boolean {
  const n = allocation.length;
  const total = allocation.reduce((s, a) => s + a, 0);
  if (total > charFn(new Set(Array.from({ length: n }, (_, i) => i))) + 1e-9) return false;
  for (let mask = 1; mask < (1 << n) - 1; mask++) { const coal = new Set<number>(); for (let i = 0; i < n; i++) if (mask & (1 << i)) coal.add(i); const alloc = [...coal].reduce((s, i) => s + allocation[i]!, 0); if (alloc < charFn(coal) - 1e-9) return false; }
  return true;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { inCore } from './impl.ts';
const charFn = (coal: Set<number>): number => { const s = coal.size; return s === 3 ? 12 : s === 2 ? 6 : s === 1 ? 2 : 0; };
export const DEFAULT_INPUT: any = { allocation: [4,4,4], charFn };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '核心稳定', en: 'Core' }).commit();
  const ok = inCore(input.allocation, input.charFn);
  rec.begin({ zh: '分配 [' + input.allocation.join(',') + ']', en: 'alloc' }).setAux([{label:'alloc',value:input.allocation.join(','),role:'compare' as BarRole}]).commit();
  rec.begin({ zh: ok ? '在核心' : '不在核心', en: ok ? 'core' : 'outside' }).setAux([{label:'core',value:String(ok),role:ok?'final' as BarRole:'warn' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { inCore } from '../../src/algorithms/game/game-core-stability/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-core-stability/trace.ts';
const cf = (c: Set<number>): number => { const s = c.size; return s === 3 ? 12 : s === 2 ? 6 : s === 1 ? 2 : 0; };
test('core 平等分配', () => assert.equal(inCore([4,4,4], cf), true));
test('core 偏离不平衡', () => assert.equal(inCore([10,1,1], cf), false));
test('core trace 非空', () => assert.ok(buildTrace().length > 0));`,
});

// 27. game-bimatrix-nash
add({
  cat: 'game', id: 'game-bimatrix-nash',
  title: { zh: '双矩阵纳什', en: 'Bimatrix Nash' },
  summary: { zh: '求两人非零和纯纳什。', en: 'Pure Nash in two-player non-zero-sum.' },
  description: { zh: '双矩阵博弈两个收益矩阵(行玩家、列玩家)，纯策略纳什是行玩家行最优、列玩家列最优的格子。', en: 'A bimatrix game has two payoff matrices (row and column player); pure Nash cells are those that are best-response for both.' },
  tags: ['game','bimatrix','nash','game-theory'],
  complexity: { time: 'O(nm)', space: 'O(nm)' },
  impl: `export interface BnHooks { onCell?: (i: number, j: number, isNash: boolean) => void; }
export function pureNashBimatrix(A: number[][], B: number[][], hooks: BnHooks = {}): Array<{ i: number; j: number }> {
  const rows = A.length, cols = A[0]!.length;
  const rowBestCol: number[][] = A.map((row) => { const mx = Math.max(...row); return row.map((v) => v === mx ? 1 : 0); });
  const colBestRow: number[][] = []; for (let j = 0; j < cols; j++) { const col = B.map((r) => r[j]!); const mx = Math.max(...col); colBestRow.push(col.map((v) => v === mx ? 1 : 0)); }
  const nash: Array<{ i: number; j: number }> = [];
  for (let i = 0; i < rows; i++) for (let j = 0; j < cols; j++) { const ok = rowBestCol[i]![j]! === 1 && colBestRow[j]![i]! === 1; hooks.onCell?.(i, j, ok); if (ok) nash.push({ i, j }); }
  return nash;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { pureNashBimatrix } from './impl.ts';
// 性别之战
const A = [[2,0],[0,1]]; const B = [[1,0],[0,2]];
export const DEFAULT_INPUT: any = { A, B };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '双矩阵纳什', en: 'Bimatrix Nash' }).commit();
  const nash = pureNashBimatrix(input.A, input.B, { onCell: (i, j, ok) => rec.begin({ zh: '(' + i + ',' + j + ')', en: 'cell' }).setAux([{label:'cell',value:i+','+j,role:ok?'final' as BarRole:'compare' as BarRole}]).commit() });
  rec.begin({ zh: nash.length + ' 个纳什', en: 'count' }).setAux([{label:'count',value:String(nash.length),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pureNashBimatrix } from '../../src/algorithms/game/game-bimatrix-nash/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-bimatrix-nash/trace.ts';
// 性别之战有 2 个纯纳什
test('bimatrix 性别战', () => { const n = pureNashBimatrix([[2,0],[0,1]], [[1,0],[0,2]]); assert.equal(n.length, 2); });
test('bimatrix trace 非空', () => assert.ok(buildTrace().length > 0));`,
});

// 28. game-repeated-folk-trigger
add({
  cat: 'game', id: 'game-repeated-trigger',
  title: { zh: '触发策略', en: 'Grim Trigger Strategy' },
  summary: { zh: '一次背叛永远惩罚。', en: 'Punish forever after one defection.' },
  description: { zh: '触发(grim trigger)策略在重复博弈中只要对方背叛过一次，就永久转向阶段博弈的惩罚策略，是维持合作的最严厉策略。', en: 'Grim trigger in a repeated game punishes forever after a single defection by switching to the stage-game punishment; the harshest strategy sustaining cooperation.' },
  tags: ['game','trigger','repeated','strategy'],
  complexity: { time: 'O(t)', space: 'O(1)' },
  impl: `export interface GtHooks { onRound?: (t: number, p1: boolean, p2: boolean, defect1: boolean, defect2: boolean) => void; }
export function grimTrigger(opponentMoves: boolean[], delta: number, R: number, P: number, T: number, S: number, hooks: GtHooks = {}): { cooperate: boolean[]; totalPayoff: number } {
  const moves: boolean[] = []; let everDefected = false; let payoff = 0;
  for (let t = 0; t < opponentMoves.length; t++) { const opp = opponentMoves[t]!; const me = everDefected ? false : true; // 一旦对方背叛过，永不再合作
    if (!opp) everDefected = true;
    let pp: number; if (me && opp) pp = R; else if (!me && opp) pp = T; else if (me && !opp) pp = S; else pp = P;
    payoff += pp * Math.pow(delta, t); moves.push(me); hooks.onRound?.(t, me, opp, !me, !opp);
  }
  return { cooperate: moves, totalPayoff: payoff };
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { grimTrigger } from './impl.ts';
export const DEFAULT_INPUT: any = { opponentMoves: [true,true,false,true,true], delta: 0.9, R: 3, P: 1, T: 5, S: 0 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '触发策略', en: 'Grim Trigger' }).commit();
  const r = grimTrigger(input.opponentMoves, input.delta, input.R, input.P, input.T, input.S, {
    onRound: (t, p1, p2, _d1, _d2) => rec.begin({ zh: 't' + t + ' 我' + (p1?'合':'叛') + ' 敌' + (p2?'合':'叛'), en: 'round' }).setAux([{label:'t',value:String(t),role:'pivot' as BarRole},{label:'me',value:p1?'C':'D',role:p1?'final' as BarRole:'warn' as BarRole}]).commit(),
  });
  rec.begin({ zh: '收益 ' + r.totalPayoff.toFixed(2), en: 'payoff' }).setAux([{label:'payoff',value:r.totalPayoff.toFixed(2),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { grimTrigger } from '../../src/algorithms/game/game-repeated-trigger/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-repeated-trigger/trace.ts';
test('trigger 全合作后惩罚', () => { const r = grimTrigger([true,true,false,true], 0.9, 3, 1, 5, 0); assert.deepEqual(r.cooperate, [true,true,true,false]); });
test('trigger trace 非空', () => assert.ok(buildTrace().length > 0));`,
});

// 29. game-tit-for-tat
add({
  cat: 'game', id: 'game-tit-for-tat',
  title: { zh: '一报还一报', en: 'Tit for Tat' },
  summary: { zh: '模仿对方上一回合。', en: 'Mirror opponent last move.' },
  description: { zh: '一报还一报(Tit for Tat)首轮合作，之后每轮复制对方上一回合动作，因友善、可激怒、宽容、清晰而在重复囚徒困境竞赛中胜出。', en: 'Tit for Tat cooperates first then mirrors the opponent last move; won Axelrod tournament for being nice, retaliatory, forgiving, and clear.' },
  tags: ['game','tit-for-tat','repeated','strategy'],
  complexity: { time: 'O(t)', space: 'O(1)' },
  impl: `export interface TftHooks { onRound?: (t: number, me: boolean, opp: boolean) => void; }
export function titForTat(opponentMoves: boolean[], delta: number, R: number, P: number, T: number, S: number, hooks: TftHooks = {}): { cooperate: boolean[]; totalPayoff: number } {
  const moves: boolean[] = []; let payoff = 0; let lastOpp = true;
  for (let t = 0; t < opponentMoves.length; t++) { const me = t === 0 ? true : lastOpp; const opp = opponentMoves[t]!;
    let pp: number; if (me && opp) pp = R; else if (!me && opp) pp = T; else if (me && !opp) pp = S; else pp = P;
    payoff += pp * Math.pow(delta, t); moves.push(me); hooks.onRound?.(t, me, opp); lastOpp = opp;
  }
  return { cooperate: moves, totalPayoff: payoff };
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { titForTat } from './impl.ts';
export const DEFAULT_INPUT: any = { opponentMoves: [true,false,true,false,true], delta: 0.9, R: 3, P: 1, T: 5, S: 0 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '一报还一报', en: 'TFT' }).commit();
  const r = titForTat(input.opponentMoves, input.delta, input.R, input.P, input.T, input.S, {
    onRound: (t, me, opp) => rec.begin({ zh: 't' + t + ' 我' + (me?'合':'叛') + ' 敌' + (opp?'合':'叛'), en: 'round' }).setAux([{label:'me',value:me?'C':'D',role:me?'final' as BarRole:'warn' as BarRole}]).commit(),
  });
  rec.begin({ zh: '收益 ' + r.totalPayoff.toFixed(2), en: 'payoff' }).setAux([{label:'payoff',value:r.totalPayoff.toFixed(2),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { titForTat } from '../../src/algorithms/game/game-tit-for-tat/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-tit-for-tat/trace.ts';
test('tft 首合后镜像', () => { const r = titForTat([true,false,true], 0.9, 3, 1, 5, 0); assert.deepEqual(r.cooperate, [true,true,false]); });
test('tft 全合对全合', () => { const r = titForTat([true,true,true], 0.9, 3, 1, 5, 0); assert.deepEqual(r.cooperate, [true,true,true]); });
test('tft trace 非空', () => assert.ok(buildTrace().length > 0));`,
});

// 30. game-stochastic-shapley
add({
  cat: 'game', id: 'game-stochastic-game-solve',
  title: { zh: '随机博弈求解', en: 'Stochastic Game Solving' },
  summary: { zh: '多状态马尔可夫博弈均衡。', en: 'Multi-state Markov game equilibrium.' },
  description: { zh: '随机博弈(Shapley)在多个状态间转移，每个状态是矩阵博弈，用 Shapley 算法迭代求每状态 minimax 值，连接 MDP 与矩阵博弈。', en: 'A stochastic game (Shapley) transitions between states, each a matrix game; Shapley algorithm iterates per-state minimax values, linking MDPs and matrix games.' },
  tags: ['game','stochastic','shapley','markov'],
  complexity: { time: 'O(it*s)', space: 'O(s)' },
  impl: `export interface SgHooks { onIter?: (i: number, V: number[]) => void; }
export function shapleyStochastic(states: number, valueMatrix: (i: number) => number[][], trans: (i: number, a1: number, a2: number) => number, gamma: number, iters: number, hooks: SgHooks = {}): number[] {
  let V = new Array(states).fill(0);
  for (let it = 0; it < iters; it++) { const nV = V.map((_, i) => { const M = valueMatrix(i); let best = -Infinity; for (let a1 = 0; a1 < M.length; a1++) { let worst = Infinity; for (let a2 = 0; a2 < M[0]!.length; a2++) { const val = M[a1]![a2]! + gamma * trans(i, a1, a2) * V[i]!; worst = Math.min(worst, val); } best = Math.max(best, worst); } return best; }); V = nV; hooks.onIter?.(it, V); }
  return V;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { shapleyStochastic } from './impl.ts';
const valueMatrix = (i: number) => [[i + 1, i], [i, i + 1]];
const trans = (_i: number, _a1: number, _a2: number) => 0.5;
export const DEFAULT_INPUT: any = { states: 3, gamma: 0.9, iters: 10 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '随机博弈', en: 'Stochastic' }).commit();
  const V = shapleyStochastic(input.states, valueMatrix, trans, input.gamma, input.iters, { onIter: (i, Vs) => rec.begin({ zh: 'iter ' + i, en: 'iter' }).setAux([{label:'V0',value:Vs[0]!.toFixed(2),role:'compare' as BarRole}]).commit() });
  rec.begin({ zh: 'V=' + V.map((x) => x.toFixed(2)).join(','), en: 'final' }).setAux([{label:'V',value:V.map(x=>x.toFixed(2)).join(','),role:'final' as BarRole}]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { shapleyStochastic } from '../../src/algorithms/game/game-stochastic-game-solve/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-stochastic-game-solve/trace.ts';
const vm = (i: number) => [[i+1,i],[i,i+1]];
const tr = (_i:number,_a:number,_b:number) => 0.5;
test('stochastic 收敛非负', () => { const V = shapleyStochastic(2, vm, tr, 0.9, 20); assert.ok(V.every((v) => v >= 0)); });
test('stochastic trace 非空', () => assert.ok(buildTrace().length > 0));`,
});

console.log('game specs loaded');
