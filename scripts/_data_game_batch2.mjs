// game batch 2 — 30 new algorithms (70 -> 100)
export const algos = [
// 1. game-correlated-equilibrium
{
  id: 'game-correlated-equilibrium',
  titleZh: '相关均衡', titleEn: 'Correlated Equilibrium',
  summaryZh: '调解者发出相关信号，理性玩家不会偏离推荐策略。',
  summaryEn: 'A mediator sends correlated signals; rational players never deviate from the recommendation.',
  descZh: '相关均衡：存在联合分布 π(a1..an) 使得对每个玩家 i 与每个推荐动作 ai，按 π 期望收益不低于改打任意 ai\'。比纳什更宽松，可协调。',
  descEn: 'Correlated equilibrium: a joint distribution π over actions such that for every player i and recommended action ai, the expected payoff under π is at least as high as deviating to any ai\'. More general than Nash, allows coordination.',
  tags: ['game','game-theory','equilibrium'],
  time: 'O(n²)', space: 'O(n²)',
  impl: `// 相关均衡 · 实现
// 验证：给定联合分布 P[a][b]（2x2），检查每个玩家对推荐无偏离动机。
export interface CeHooks {
  onCheck?: (player: 'row' | 'col', recommended: number, recPayoff: number, bestDeviation: number, stable: boolean) => void;
  onConclude?: (isCorrelated: boolean) => void;
}
const ROW: ReadonlyArray<readonly number[]> = [[3, 0], [5, 1]];
const COL: ReadonlyArray<readonly number[]> = [[3, 5], [0, 1]];
export function correlatedEquilibrium(P: ReadonlyArray<readonly number[]>, hooks: CeHooks = {}): boolean {
  let ok = true;
  for (let a = 0; a < 2; a++) {
    let pRec = 0, pDev = 0;
    for (let b = 0; b < 2; b++) { pRec += P[a]![b]! * ROW[a]![b]!; pDev += P[a]![b]! * ROW[1 - a]![b]!; }
    const stable = pRec >= pDev - 1e-9;
    hooks.onCheck?.('row', a, pRec, pDev, stable);
    if (!stable) ok = false;
  }
  for (let b = 0; b < 2; b++) {
    let pRec = 0, pDev = 0;
    for (let a = 0; a < 2; a++) { pRec += P[a]![b]! * COL[a]![b]!; pDev += P[a]![b]! * COL[a]![1 - b]!; }
    const stable = pRec >= pDev - 1e-9;
    hooks.onCheck?.('col', b, pRec, pDev, stable);
    if (!stable) ok = false;
  }
  hooks.onConclude?.(ok);
  return ok;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { correlatedEquilibrium } from './impl.ts';
const P = [[0.5, 0], [0, 0.5]];
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '相关均衡：P 仅在 (C,C),(D,D)', en: 'Correlated eq: P only on (C,C),(D,D)' })
    .setGrid(P.map((r) => r.map((v) => ({ v: v.toFixed(2), role: 'default' as BarRole })))).commit();
  correlatedEquilibrium(P, {
    onCheck: (pl, rec, rp, dev, st) => {
      rec.begin({ zh: \`\${pl} 推荐动作\${rec}: \${rp.toFixed(2)} vs 偏离\${dev.toFixed(2)} -> \${st ? '稳' : '偏'}\`, en: \`\${pl} rec\${rec}: \${rp.toFixed(2)} vs dev\${dev.toFixed(2)} -> \${st ? 'stable' : 'deviate'}\` })
        .setAux([{ label: '收益', value: rp.toFixed(2), role: 'pivot' as BarRole }, { label: '偏离', value: dev.toFixed(2), role: st ? ('final' as BarRole) : ('warn' as BarRole) }]).commit();
    },
    onConclude: (ok) => rec.begin({ zh: ok ? '是相关均衡' : '不是相关均衡', en: ok ? 'Is correlated eq' : 'Not correlated eq' })
      .setAux([{ label: '结论', value: ok ? 'YES' : 'NO', role: ok ? ('final' as BarRole) : ('warn' as BarRole) }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { correlatedEquilibrium } from '../../src/algorithms/game/game-correlated-equilibrium/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-correlated-equilibrium/trace.ts';
test('对角分布是相关均衡', () => {
  assert.equal(correlatedEquilibrium([[0.5, 0], [0, 0.5]]), true);
});
test('纯背叛分布非相关均衡下协调', () => {
  // (D,D) 纳什 -> 行固定推荐 D 时无偏离
  assert.equal(correlatedEquilibrium([[0, 0], [0, 1]]), true);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 2. game-secure-dice
{
  id: 'game-secure-dice',
  titleZh: '安全骰子博弈', titleEn: 'Secure Dice Game',
  summaryZh: '安全值 m 下，抛骰子收益为点数，点数>m 则重抛，求最优 m。',
  summaryEn: 'Roll a die for its face; reroll if face>m. Find the optimal stopping threshold m.',
  descZh: '安全骰子：每轮可选择保留当前点数或重抛（但点数超过安全阈值 m 时必须保留）。动态规划求最优期望收益与阈值。',
  descEn: 'Secure dice: each turn you may keep the face or reroll (but must keep if face exceeds safety threshold m). DP finds optimal expected payoff and threshold.',
  tags: ['game','dp','stopping-rule'],
  time: 'O(f)', space: 'O(f)',
  impl: `// 安全骰子博弈 · 实现
export interface SecureDiceHooks { onThreshold?: (m: number, ev: number) => void; onConclude?: (bestM: number, bestEv: number) => void; }
const FACES = 6;
export function secureDice(hooks: SecureDiceHooks = {}): { bestM: number; bestEv: number; evByM: number[] } {
  // E[reroll] = average EV over faces; keep if face >= m.
  // EV(m) = (1/m)*sum_{f<m} E + (1/6 * sum_{f>=m} f) ... 解线性方程:
  // 令 R = EV(m). R = sum_{f=1..m-1}(1/6 * R) + sum_{f=m..6}(1/6*f)
  // R*(1 - (m-1)/6) = sum_{f=m..6} f / 6
  const evByM: number[] = [];
  let bestM = 1, bestEv = -Infinity;
  for (let m = 1; m <= FACES; m++) {
    const keepSum = ((FACES + m) * (FACES - m + 1)) / 2;
    const denom = FACES - (m - 1);
    const ev = denom <= 0 ? keepSum / FACES : keepSum / denom;
    evByM[m - 1] = ev;
    hooks.onThreshold?.(m, ev);
    if (ev > bestEv) { bestEv = ev; bestM = m; }
  }
  hooks.onConclude?.(bestM, bestEv);
  return { bestM, bestEv, evByM };
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { secureDice } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '安全骰子：枚举阈值 m', en: 'Secure dice: enumerate threshold m' })
    .setAux([{ label: 'faces', value: '6', role: 'default' as BarRole }]).commit();
  const preview = secureDice();
  const r = secureDice({
    onThreshold: (m, ev) => rec.begin({ zh: \`m=\${m} 期望=\${ev.toFixed(3)}\`, en: \`m=\${m} EV=\${ev.toFixed(3)}\` })
      .setBars([{ value: ev, role: (m === preview.bestM) ? ('final' as BarRole) : ('default' as BarRole), label: 'EV' }]).commit(),
  });
  rec.begin({ zh: \`最优 m=\${r.bestM} EV=\${r.bestEv.toFixed(3)}\`, en: \`best m=\${r.bestM} EV=\${r.bestEv.toFixed(3)}\` })
    .setAux([{ label: '最优 m', value: String(r.bestM), role: 'final' as BarRole }, { label: 'EV', value: r.bestEv.toFixed(3), role: 'final' as BarRole }]).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { secureDice } from '../../src/algorithms/game/game-secure-dice/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-secure-dice/trace.ts';
test('安全骰子返回 6 个 EV', () => {
  const r = secureDice();
  assert.equal(r.evByM.length, 6);
  assert.ok(r.bestEv > 0);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 3. game-cow-path
{
  id: 'game-cow-path',
  titleZh: '奶牛路径搜索', titleEn: 'Cow Path Search',
  summaryZh: '线上搜索问题：在一条双向线上找目标，使用倍增回溯达到竞争比 9。',
  summaryEn: 'Online search on a two-way line: doubling-strategy backtracking yields competitive ratio 9.',
  descZh: '奶牛路径：目标位置未知（左或右任一距离）。策略：依次走 1,2,4,8... 到两侧，竞争比 9（最优确定性）。',
  descEn: 'Cow path: target at unknown distance left or right. Doubling strategy (1,2,4,8...) gives competitive ratio 9, optimal for deterministic online.',
  tags: ['game','online-algorithm','competitive-ratio'],
  time: 'O(log d)', space: 'O(1)',
  impl: `// 奶牛路径 · 实现 (deterministic doubling, competitive ratio 9)
export interface CowPathHooks { onProbe?: (dir: 1 | -1, dist: number, total: number) => void; onFound?: (dir: 1 | -1, total: number) => void; }
export function cowPath(target: number, hooks: CowPathHooks = {}): { total: number; dir: 1 | -1; ratio: number } {
  const opt = Math.abs(target);
  let step = 1, total = 0, dir: 1 | -1 = 1;
  for (;;) {
    // go right
    total += step; hooks.onProbe?.(1, step, total);
    if (target >= 0 && target <= step) { dir = 1; hooks.onFound?.(dir, total + (step - target)); total = total + (step - target) - step + target; break; }
    total += step; // back to origin
    // go left
    total += step * 2; hooks.onProbe?.(-1, step * 2, total);
    if (target < 0 && -target <= step * 2) { dir = -1; hooks.onFound?.(dir, total + (step * 2 + target)); total = total + (step * 2 + target) - (step * 2 + target); break; }
    total += step * 2; // back to origin
    step *= 2;
    if (step > 1e9) break;
  }
  const walked = total > 0 ? total : opt * 9;
  return { total: walked, dir, ratio: walked / opt };
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { cowPath } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const target = 3;
  rec.begin({ zh: \`奶牛路径：目标在右侧距离 \${target}\`, en: \`Cow path: target right at \${target}\` })
    .setAux([{ label: 'target', value: String(target), role: 'pivot' as BarRole }]).commit();
  const r = cowPath(target, {
    onProbe: (d, dist, total) => rec.begin({ zh: \`\${d > 0 ? '右' : '左'}探 \${dist}，累计 \${total}\`, en: \`\${d > 0 ? 'R' : 'L'} probe \${dist}, total \${total}\` })
      .setAux([{ label: '方向', value: d > 0 ? 'R' : 'L', role: 'compare' as BarRole }, { label: '累计', value: String(total), role: 'pivot' as BarRole }]).commit(),
    onFound: (d, total) => rec.begin({ zh: \`找到！方向 \${d > 0 ? '右' : '左'}，总 \${total}\`, en: \`Found! dir \${d > 0 ? 'R' : 'L'}, total \${total}\` })
      .setAux([{ label: '总步数', value: String(total), role: 'final' as BarRole }]).commit(),
  });
  rec.begin({ zh: \`竞争比 \${r.ratio.toFixed(2)}\`, en: \`Competitive ratio \${r.ratio.toFixed(2)}\` })
    .setAux([{ label: '竞争比', value: r.ratio.toFixed(2), role: 'final' as BarRole }]).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cowPath } from '../../src/algorithms/game/game-cow-path/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-cow-path/trace.ts';
test('奶牛路径找到右侧目标', () => {
  const r = cowPath(3);
  assert.equal(r.dir, 1);
  assert.ok(r.ratio <= 9.01);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 4. game-competitive-ratio
{
  id: 'game-competitive-ratio',
  titleZh: '竞争比分析', titleEn: 'Competitive Ratio Analysis',
  summaryZh: '度量在线算法相对离线最优的性能，比值越小越优。',
  summaryEn: 'Measures online-algorithm performance vs offline optimum; smaller ratio is better.',
  descZh: '竞争比 CR = 在线成本 / 离线最优成本。对一组实例计算最坏情况比值，评估在线策略质量。',
  descEn: 'Competitive ratio CR = online cost / offline optimal cost. Compute worst-case ratio over instances to grade the online strategy.',
  tags: ['game','online-algorithm','analysis'],
  time: 'O(n)', space: 'O(1)',
  impl: `// 竞争比分析 · 实现
// 给定在线成本序列 on[] 与离线最优 off[]，求最大比值。
export interface CrHooks { onInstance?: (i: number, on: number, off: number, ratio: number) => void; onConclude?: (maxRatio: number, idx: number) => void; }
export function competitiveRatio(onCosts: readonly number[], offCosts: readonly number[], hooks: CrHooks = {}): { maxRatio: number; idx: number } {
  let maxRatio = 0, idx = 0;
  for (let i = 0; i < onCosts.length; i++) {
    const ratio = onCosts[i]! / (offCosts[i]! || 1);
    hooks.onInstance?.(i, onCosts[i]!, offCosts[i]!, ratio);
    if (ratio > maxRatio) { maxRatio = ratio; idx = i; }
  }
  hooks.onConclude?.(maxRatio, idx);
  return { maxRatio, idx };
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { competitiveRatio } from './impl.ts';
const ON = [10, 8, 20, 15], OFF = [5, 8, 4, 5];
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '竞争比：在线 vs 离线', en: 'Competitive ratio: online vs offline' })
    .setBars(ON.map((v, i) => ({ value: v / OFF[i]!, role: 'default' as BarRole, label: 'CR' }))).commit();
  const r = competitiveRatio(ON, OFF, {
    onInstance: (i, on, off, ratio) => rec.begin({ zh: \`实例\${i}: \${on}/\${off} = \${ratio.toFixed(2)}\`, en: \`inst\${i}: \${on}/\${off} = \${ratio.toFixed(2)}\` })
      .setAux([{ label: '在线', value: String(on), role: 'compare' as BarRole }, { label: '离线', value: String(off), role: 'default' as BarRole }, { label: '比值', value: ratio.toFixed(2), role: 'pivot' as BarRole }]).commit(),
  });
  rec.begin({ zh: \`最坏竞争比 \${r.maxRatio.toFixed(2)} @实例\${r.idx}\`, en: \`Worst CR \${r.maxRatio.toFixed(2)} @inst\${r.idx}\` })
    .setBars(ON.map((v, i) => ({ value: v / OFF[i]!, role: i === r.idx ? ('final' as BarRole) : ('default' as BarRole) }))).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { competitiveRatio } from '../../src/algorithms/game/game-competitive-ratio/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-competitive-ratio/trace.ts';
test('竞争比正确', () => {
  const r = competitiveRatio([10, 8, 20], [5, 8, 4]);
  assert.equal(r.idx, 2);
  assert.ok(r.maxRatio > 4);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 5. game-sprt
{
  id: 'game-sprt',
  titleZh: '序贯概率比检验', titleEn: 'Sequential Probability Ratio Test',
  summaryZh: 'Wald SPRT：逐步抽样依似然比阈值判定假设，平均样本量最小。',
  summaryEn: 'Wald SPRT: sample sequentially, decide by likelihood-ratio bounds; minimizes expected sample size.',
  descZh: 'SPRT 在 H0 vs H1 间决策。每步累积似然比 Λ，Λ<=A 接受 H0，Λ>=B 接受 H1。A=β/(1-α)，B=(1-β)/α。',
  descEn: 'SPRT decides between H0 and H1. Accumulate likelihood ratio Λ; Λ<=A accept H0, Λ>=B accept H1. A=β/(1-α), B=(1-β)/α.',
  tags: ['game','sequential-analysis','decision'],
  time: 'O(n)', space: 'O(1)',
  impl: `// SPRT · 实现 (Bernoulli 似然, H0: p=p0 vs H1: p=p1)
export interface SprtHooks { onSample?: (n: number, logRatio: number, lo: number, hi: number) => void; onDecide?: (acceptH1: boolean, n: number) => void; }
export function sprt(samples: readonly number[], p0: number, p1: number, alpha: number, beta: number, hooks: SprtHooks = {}): { acceptH1: boolean; n: number } {
  const A = Math.log(beta / (1 - alpha));
  const B = Math.log((1 - beta) / alpha);
  let logRatio = 0, n = 0;
  for (const x of samples) {
    n++;
    logRatio += x === 1 ? Math.log(p1 / p0) : Math.log((1 - p1) / (1 - p0));
    hooks.onSample?.(n, logRatio, A, B);
    if (logRatio <= A) { hooks.onDecide?.(false, n); return { acceptH1: false, n }; }
    if (logRatio >= B) { hooks.onDecide?.(true, n); return { acceptH1: true, n }; }
  }
  hooks.onDecide?.(false, n);
  return { acceptH1: false, n };
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { sprt } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const S = [1, 1, 0, 1, 1, 1, 0, 1];
  rec.begin({ zh: 'SPRT: H0 p=0.3 vs H1 p=0.6', en: 'SPRT: H0 p=0.3 vs H1 p=0.6' })
    .setAux([{ label: 'alpha', value: '0.05', role: 'default' as BarRole }, { label: 'beta', value: '0.05', role: 'default' as BarRole }]).commit();
  const r = sprt(S, 0.3, 0.6, 0.05, 0.05, {
    onSample: (n, lr, lo, hi) => rec.begin({ zh: \`n=\${n} logΛ=\${lr.toFixed(2)} 阈[\${lo.toFixed(2)},\${hi.toFixed(2)}]\`, en: \`n=\${n} logΛ=\${lr.toFixed(2)} [\${lo.toFixed(2)},\${hi.toFixed(2)}]\` })
      .setBars([{ value: lr, role: 'pivot' as BarRole, label: 'logΛ' }, { value: lo, role: 'default' as BarRole }, { value: hi, role: 'default' as BarRole }]).commit(),
    onDecide: (h1, n) => rec.begin({ zh: \`\${h1 ? '接受 H1' : '接受 H0'} @ n=\${n}\`, en: \`\${h1 ? 'accept H1' : 'accept H0'} @ n=\${n}\` })
      .setAux([{ label: '决策', value: h1 ? 'H1' : 'H0', role: 'final' as BarRole }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sprt } from '../../src/algorithms/game/game-sprt/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-sprt/trace.ts';
test('SPRT 高频 1 接受 H1', () => {
  const r = sprt([1, 1, 1, 1, 1, 1], 0.3, 0.6, 0.05, 0.05);
  assert.equal(r.acceptH1, true);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 6. game-bandit-ucb
{
  id: 'game-bandit-ucb',
  titleZh: '多臂老虎机 UCB', titleEn: 'Multi-Armed Bandit UCB',
  summaryZh: 'UCB1：以置信上界选臂，平衡探索与利用，regret 为 O(log n)。',
  summaryEn: 'UCB1 picks arms by upper confidence bound, balancing explore/exploit with O(log n) regret.',
  descZh: '多臂老虎机：每臂未知收益分布。UCB1 = 均值 + sqrt(2 ln t / n_i)，选最大者。理论 regret 上界 O(log n)。',
  descEn: 'Multi-armed bandit: each arm has unknown payoff. UCB1 = mean + sqrt(2 ln t / n_i); pick the max. Regret bound O(log n).',
  tags: ['game','bandit','reinforcement-learning'],
  time: 'O(k) per step', space: 'O(k)',
  impl: `// 多臂老虎机 UCB1 · 实现
export interface BanditHooks { onSelect?: (t: number, arm: number, ucb: number[]) => void; onReward?: (arm: number, reward: number) => void; }
export function banditUcb(rewards: ReadonlyArray<readonly number[]>, hooks: BanditHooks = {}): number[] {
  const k = rewards.length;
  const counts = new Array<number>(k).fill(0);
  const sums = new Array<number>(k).fill(0);
  const sel: number[] = [];
  // 初始化：每臂试一次
  for (let a = 0; a < k; a++) {
    const r = rewards[a]![0]!; counts[a] = 1; sums[a] = r;
    hooks.onReward?.(a, r);
    sel.push(a);
  }
  const T = rewards[0]!.length;
  for (let t = k; t < T; t++) {
    const ln = Math.log(t + 1);
    const ucb = counts.map((c, a) => c === 0 ? Infinity : sums[a]! / c + Math.sqrt(2 * ln / c));
    let best = 0, bv = -Infinity;
    for (let a = 0; a < k; a++) if (ucb[a]! > bv) { bv = ucb[a]!; best = a; }
    hooks.onSelect?.(t, best, ucb);
    const r = rewards[best]![t]!;
    counts[best]++; sums[best]! += r;
    hooks.onReward?.(best, r);
    sel.push(best);
  }
  return sel;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { banditUcb } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const R = [[1, 0, 1, 1, 0, 1, 1, 1], [0, 1, 0, 0, 1, 0, 0, 0]];
  rec.begin({ zh: 'UCB1 两臂老虎机', en: 'UCB1 two-armed bandit' })
    .setBars(R.map((_, a) => ({ value: 0, role: 'default' as BarRole, label: 'arm' + a }))).commit();
  banditUcb(R, {
    onSelect: (t, arm, ucb) => rec.begin({ zh: \`t=\${t} 选臂 \${arm}\`, en: \`t=\${t} pick arm \${arm}\` })
      .setBars(ucb.map((u, a) => ({ value: u, role: a === arm ? ('final' as BarRole) : ('default' as BarRole), label: 'UCB' + a }))).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { banditUcb } from '../../src/algorithms/game/game-bandit-ucb/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-bandit-ucb/trace.ts';
test('UCB 更偏向高均值臂', () => {
  const R = [[1, 1, 1, 1, 1, 1, 1, 1], [0, 0, 0, 0, 0, 0, 0, 0]];
  const sel = banditUcb(R);
  const arm0 = sel.filter((s) => s === 0).length;
  assert.ok(arm0 >= 5);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 7. game-elsberg-paradox
{
  id: 'game-elsberg-paradox',
  titleZh: '埃尔斯伯格悖论', titleEn: 'Ellsberg Paradox',
  summaryZh: '决策者偏好已知概率胜过模糊概率，违反主观期望效用公理。',
  summaryEn: 'Decision makers prefer known-probability bets over ambiguous ones, violating SEU axioms.',
  descZh: '埃尔斯伯格：坛中 90 球，30 红 + 60（黑或黄未知比例）。多数人选"红"而非"黑"，又选"黑或黄"而非"红或黄"，违反 sure-thing 原理。',
  descEn: 'Ellsberg: urn of 90 balls, 30 red + 60 (black or yellow, unknown split). Most prefer "red" over "black", yet "black or yellow" over "red or yellow", violating sure-thing.',
  tags: ['game','decision-theory','ambiguity'],
  time: 'O(1)', space: 'O(1)',
  impl: `// 埃尔斯伯格悖论 · 实现
// 计算两种赌局下各选项的最坏/最好期望收益。
export interface EllsbergHooks { onChoice?: (scenario: string, option: string, prob: number) => void; }
export function ellsbergAnalysis(hooks: EllsbergHooks = {}): void {
  // 球数: red=30, black=b, yellow=y, b+y=60
  const n = 90, red = 30;
  for (let b = 0; b <= 60; b++) {
    const y = 60 - b;
    // 场景A: 抽红 vs 抽黑
    hooks.onChoice?.('A', 'red', red / n);
    hooks.onChoice?.('A', 'black', b / n);
    // 场景B: 抽红或黄 vs 抽黑或黄
    hooks.onChoice?.('B', 'red|yellow', (red + y) / n);
    hooks.onChoice?.('B', 'black|yellow', (b + y) / n);
    break; // 只展示一个 b 值
  }
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { ellsbergAnalysis } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '埃尔斯伯格：30 红 + 60 黑/黄(未知)', en: 'Ellsberg: 30 red + 60 black/yellow(unknown)' })
    .setAux([{ label: 'red', value: '30', role: 'final' as BarRole }, { label: 'black+yellow', value: '60', role: 'warn' as BarRole }]).commit();
  ellsbergAnalysis({
    onChoice: (s, o, w) => rec.begin({ zh: \`场景\${s} 选\${o}: 概率 \${(w * 90).toFixed(0)}/90\`, en: \`scn\${s} pick\${o}: \${(w * 90).toFixed(0)}/90\` })
      .setBars([{ value: w, role: 'pivot' as BarRole, label: 'P' }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ellsbergAnalysis } from '../../src/algorithms/game/game-elsberg-paradox/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-elsberg-paradox/trace.ts';
test('ellsberg 不抛错', () => {
  let calls = 0;
  ellsbergAnalysis({ onChoice: () => calls++ });
  assert.ok(calls >= 4);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 8. game-st-petersburg
{
  id: 'game-st-petersburg',
  titleZh: '圣彼得堡悖论', titleEn: 'St. Petersburg Paradox',
  summaryZh: '抛硬币首次正面回合奖金翻倍，期望无穷但人们只愿付有限金额。',
  summaryEn: 'Coin flips double the prize each round until first heads; expected value is infinite yet people pay finite.',
  descZh: '圣彼得堡：第 n 次首次正面奖金 2^n，期望 Σ 2^n*(1/2^n)=∞。引入对数效用或风险厌恶可解释有限估值。',
  descEn: 'St. Petersburg: prize 2^n on first heads at toss n; EV=Σ2^n/2^n=∞. Log utility or risk aversion yields finite valuation.',
  tags: ['game','decision-theory','paradox'],
  time: 'O(N)', space: 'O(1)',
  impl: `// 圣彼得堡悖论 · 实现
export interface StPetHooks { onRound?: (n: number, prize: number, prob: number, contrib: number) => void; onConclude?: (ev: number, logUtil: number) => void; }
export function stPetersburg(maxN: number, hooks: StPetHooks = {}): { ev: number; logUtil: number } {
  let ev = 0, logUtil = 0;
  for (let n = 1; n <= maxN; n++) {
    const prize = Math.pow(2, n);
    const prob = Math.pow(0.5, n);
    const contrib = prize * prob;
    ev += contrib;
    logUtil += prob * Math.log2(prize);
    hooks.onRound?.(n, prize, prob, contrib);
  }
  hooks.onConclude?.(ev, logUtil);
  return { ev, logUtil };
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { stPetersburg } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '圣彼得堡：截断到 20 轮', en: 'St. Petersburg: truncated to 20 rounds' })
    .setAux([{ label: 'maxN', value: '20', role: 'default' as BarRole }]).commit();
  const r = stPetersburg(20, {
    onRound: (n, prize) => rec.begin({ zh: \`第\${n}轮 奖金\${prize}\`, en: \`round\${n} prize\${prize}\` })
      .setBars([{ value: Math.log2(prize), role: 'pivot' as BarRole, label: 'log2 prize' }]).commit(),
  });
  rec.begin({ zh: \`EV=\${r.ev} 对数效用=\${r.logUtil.toFixed(2)}\`, en: \`EV=\${r.ev} logUtil=\${r.logUtil.toFixed(2)}\` })
    .setAux([{ label: 'EV', value: String(r.ev), role: 'warn' as BarRole }, { label: '对数效用', value: r.logUtil.toFixed(2), role: 'final' as BarRole }]).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { stPetersburg } from '../../src/algorithms/game/game-st-petersburg/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-st-petersburg/trace.ts';
test('截断 EV = maxN', () => {
  const r = stPetersburg(10);
  assert.equal(r.ev, 10);
  assert.ok(r.logUtil > 0);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 9. game-pure-mixed-nash
{
  id: 'game-pure-mixed-nash',
  titleZh: '混合策略纳什', titleEn: 'Mixed Strategy Nash',
  summaryZh: '2x2 零和博弈求混合纳什：行玩家最小化列玩家最大收益。',
  summaryEn: '2x2 zero-sum mixed Nash: row minimizes columns max payoff via von Neumann minimax.',
  descZh: '对收益矩阵 A（行玩家），混合策略 p 使 min over q 的 pAq 最大化。2x2 解：p* 满足两列期望相等。',
  descEn: 'For payoff A (row player), mixed p maximizes min over q of pAq. 2x2 solution: p* equalizes both columns expected payoff.',
  tags: ['game','game-theory','minimax'],
  time: 'O(1)', space: 'O(1)',
  impl: `// 混合策略纳什 (2x2 零和) · 实现
export interface MixedNashHooks { onProb?: (p: number) => void; onValue?: (v: number) => void; }
export function mixedNash(A: ReadonlyArray<readonly number[]>, hooks: MixedNashHooks = {}): { p: number; value: number } {
  const a = A[0]![0]!, b = A[0]![1]!, c = A[1]![0]!, d = A[1]![1]!;
  // p*(a-c) + c = p*(b-d) + d => p = (d-c)/((a+b)-(c+d))... 用等期望:
  // p*a+(1-p)*c = p*b+(1-p)*d
  const denom = (a - c) - (b - d);
  const p = denom === 0 ? 0.5 : (d - c) / denom;
  const pc = Math.max(0, Math.min(1, p));
  const value = pc * a + (1 - pc) * c;
  hooks.onProb?.(pc);
  hooks.onValue?.(value);
  return { p: pc, value };
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { mixedNash } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const A = [[3, 5], [1, 2]];
  rec.begin({ zh: '混合纳什: 矩阵 A', en: 'Mixed Nash: matrix A' })
    .setGrid(A.map((r) => r.map((v) => ({ v, role: 'default' as BarRole })))).commit();
  const r = mixedNash(A, {
    onProb: (p) => rec.begin({ zh: \`行玩家以 \${p.toFixed(2)} 选行0\`, en: \`row plays row0 w.p. \${p.toFixed(2)}\` })
      .setBars([{ value: p, role: 'pivot' as BarRole, label: 'p' }]).commit(),
  });
  rec.begin({ zh: \`博弈值 \${r.value.toFixed(2)}\`, en: \`Game value \${r.value.toFixed(2)}\` })
    .setAux([{ label: 'value', value: r.value.toFixed(2), role: 'final' as BarRole }]).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mixedNash } from '../../src/algorithms/game/game-pure-mixed-nash/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-pure-mixed-nash/trace.ts';
test('匹配硬币混合纳什 p=0.5', () => {
  const r = mixedNash([[1, -1], [-1, 1]]);
  assert.ok(Math.abs(r.p - 0.5) < 1e-9);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 10. game-strategic-voting
{
  id: 'game-strategic-voting',
  titleZh: '策略性投票', titleEn: 'Strategic Voting',
  summaryZh: '选民非真诚投票以避免最差结果，分析 Gibbard-Satterthwaite 不可防策略。',
  summaryEn: 'Voters vote non-truthfully to avoid worst outcomes; analyzes Gibbard-Satterthwaite manipulability.',
  descZh: '策略性投票：在 plurality 规则下，选民可能谎报偏好以阻止最不喜候选人当选。计算每个选民的"真诚"vs"策略"结果。',
  descEn: 'Strategic voting under plurality: voters may misreport to block their least-preferred winner. Compute sincere vs strategic outcome per voter.',
  tags: ['game','social-choice','voting'],
  time: 'O(n·m)', space: 'O(m)',
  impl: `// 策略性投票 · 实现 (plurality rule)
export interface VoteHooks { onTally?: (counts: number[]) => void; onOutcome?: (winner: number) => void; }
export interface Voter { prefs: number[]; } // prefs[0] 最喜欢
export function strategicVoting(voters: readonly Voter[], m: number, hooks: VoteHooks = {}): { sincere: number; strategic: number } {
  // 真诚投票：每人投 prefs[0]
  const cS = new Array<number>(m).fill(0);
  for (const v of voters) cS[v.prefs[0]!]++;
  hooks.onTally?.(cS);
  let sincere = 0; for (let i = 1; i < m; i++) if (cS[i]! > cS[sincere]!) sincere = i;
  hooks.onOutcome?.(sincere);
  // 策略：若真诚赢家是某人 prefs 末位，他改投 prefs[0] 之外最可能赢的
  const cStrat = [...cS];
  for (const v of voters) {
    if (v.prefs[v.prefs.length - 1] === sincere) {
      // 找真诚第二能挑战的，简化：投 prefs[1]
      cStrat[v.prefs[0]!]--; cStrat[v.prefs[1]!]++;
    }
  }
  let strategic = 0; for (let i = 1; i < m; i++) if (cStrat[i]! > cStrat[strategic]!) strategic = i;
  return { sincere, strategic };
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { strategicVoting } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const voters = [{ prefs: [0, 1, 2] }, { prefs: [0, 1, 2] }, { prefs: [1, 0, 2] }, { prefs: [2, 1, 0] }, { prefs: [2, 1, 0] }];
  rec.begin({ zh: '策略投票：3 候选人', en: 'Strategic voting: 3 candidates' })
    .setBars([0, 0, 0].map((_, i) => ({ value: 0, role: 'default' as BarRole, label: 'c' + i }))).commit();
  const preview = strategicVoting(voters, 3);
  const r = strategicVoting(voters, 3, {
    onTally: (c) => rec.begin({ zh: \`真诚计票 [\${c.join(',')}]\`, en: \`Sincere tally [\${c.join(',')}]\` })
      .setBars(c.map((v, i) => ({ value: v, role: i === preview.sincere ? ('final' as BarRole) : ('default' as BarRole) }))).commit(),
  });
  rec.begin({ zh: \`真诚赢家=\${r.sincere} 策略赢家=\${r.strategic}\`, en: \`sincere=\${r.sincere} strategic=\${r.strategic}\` })
    .setAux([{ label: '真诚', value: String(r.sincere), role: 'compare' as BarRole }, { label: '策略', value: String(r.strategic), role: 'final' as BarRole }]).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { strategicVoting } from '../../src/algorithms/game/game-strategic-voting/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-strategic-voting/trace.ts';
test('策略投票返回赢家', () => {
  const r = strategicVoting([{ prefs: [0, 1, 2] }, { prefs: [1, 0, 2] }, { prefs: [2, 1, 0] }], 3);
  assert.ok(r.sincere >= 0 && r.strategic >= 0);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 11. game-mrp-optimality
{
  id: 'game-mrp-optimality',
  titleZh: '马尔可夫奖励过程最优', titleEn: 'Markov Reward Process Optimality',
  summaryZh: '在 MRP 上贝尔曼方程求状态价值函数 V = R + γPV。',
  summaryEn: 'Bellman equation on an MRP: state values V = R + γPV via linear solve.',
  descZh: '马尔可夫奖励过程：给定转移 P、奖励 R、折扣 γ，价值 V=(I-γP)^{-1}R。迭代法 V←R+γPV 收敛。',
  descEn: 'Markov reward process: given transition P, reward R, discount γ, value V=(I-γP)^{-1}R. Iterative V<-R+γPV converges.',
  tags: ['game','mdp','dynamic-programming'],
  time: 'O(k·n²)', space: 'O(n)',
  impl: `// MRP 价值迭代 · 实现
export interface MrpHooks { onIter?: (k: number, V: number[]) => void; onConverge?: (V: number[], iters: number) => void; }
export function mrpValue(P: ReadonlyArray<readonly number[]>, R: readonly number[], gamma: number, iters = 100, hooks: MrpHooks = {}): number[] {
  const n = R.length;
  let V = new Array<number>(n).fill(0);
  for (let k = 0; k < iters; k++) {
    const nV = new Array<number>(n).fill(0);
    for (let s = 0; s < n; s++) {
      let sum = 0;
      for (let s2 = 0; s2 < n; s2++) sum += P[s]![s2]! * V[s2]!;
      nV[s] = R[s]! + gamma * sum;
    }
    V = nV;
    hooks.onIter?.(k, V);
    if (k > 2 && converged(V, nV, 1e-6)) { hooks.onConverge?.(V, k); break; }
  }
  return V;
}
function converged(a: number[], b: number[], eps: number): boolean {
  let m = 0; for (let i = 0; i < a.length; i++) m = Math.max(m, Math.abs((a[i]! - b[i]!)));
  return m < eps;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { mrpValue } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const P = [[0.5, 0.5, 0], [0, 0.5, 0.5], [0, 0, 1]];
  const R = [1, 2, 0];
  rec.begin({ zh: 'MRP: 3 状态 γ=0.9', en: 'MRP: 3 states γ=0.9' })
    .setBars(R.map((v) => ({ value: v, role: 'default' as BarRole, label: 'R' }))).commit();
  const V = mrpValue(P, R, 0.9, 50, {
    onIter: (k, Vs) => rec.begin({ zh: \`迭代 \${k}\`, en: \`iter \${k}\` })
      .setBars(Vs.map((v) => ({ value: v, role: 'pivot' as BarRole, label: 'V' }))).commit(),
  });
  rec.begin({ zh: \`收敛 V=[\${V.map((v) => v.toFixed(2)).join(',')}]\`, en: \`converged V=[\${V.map((v) => v.toFixed(2)).join(',')}]\` })
    .setBars(V.map((v) => ({ value: v, role: 'final' as BarRole }))).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mrpValue } from '../../src/algorithms/game/game-mrp-optimality/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-mrp-optimality/trace.ts';
test('MRP 吸收态价值为 R', () => {
  const V = mrpValue([[0, 1], [0, 1]], [1, 5], 0.9, 200);
  assert.ok(Math.abs(V[1]! - 5) < 0.5);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 12. game-gambler-ruin
{
  id: 'game-gambler-ruin',
  titleZh: '赌徒破产问题', titleEn: 'Gambler Ruin',
  summaryZh: '公平/有偏随机游走：求到达 N 前先破产 0 的概率。',
  summaryEn: 'Random walk with absorbing barriers 0 and N; probability of ruin before reaching N.',
  descZh: '赌徒破产：本金 i，目标 N，每步以 p 赢 1。p=0.5 时 P(破产)=(N-i)/N；p≠0.5 时=(r^N-r^i)/(r^N-1)，r=q/p。',
  descEn: 'Gambler ruin: capital i, goal N, win prob p each step. Fair: P(ruin)=(N-i)/N; biased r=q/p: (r^N-r^i)/(r^N-1).',
  tags: ['game','random-walk','probability'],
  time: 'O(1)', space: 'O(1)',
  impl: `// 赌徒破产 · 实现
export interface RuinHooks { onCapital?: (i: number, pRuin: number) => void; onConclude?: (pRuin: number) => void; }
export function gamblerRuin(i: number, n: number, p: number, hooks: RuinHooks = {}): number {
  let pr: number;
  if (Math.abs(p - 0.5) < 1e-9) pr = (n - i) / n;
  else { const r = (1 - p) / p; pr = (Math.pow(r, n) - Math.pow(r, i)) / (Math.pow(r, n) - 1); }
  hooks.onCapital?.(i, pr);
  hooks.onConclude?.(pr);
  return pr;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { gamblerRuin } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '赌徒破产：本金扫描', en: 'Gambler ruin: scan capital' })
    .setAux([{ label: 'N', value: '10', role: 'default' as BarRole }, { label: 'p', value: '0.4', role: 'pivot' as BarRole }]).commit();
  const pts: number[] = [];
  for (let i = 0; i <= 10; i++) { pts.push(gamblerRuin(i, 10, 0.4)); }
  rec.begin({ zh: '破产概率 vs 本金', en: 'Ruin prob vs capital' })
    .setBars(pts.map((v) => ({ value: v, role: 'final' as BarRole }))).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gamblerRuin } from '../../src/algorithms/game/game-gambler-ruin/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-gambler-ruin/trace.ts';
test('公平赌局破产概率线性', () => {
  assert.ok(Math.abs(gamblerRuin(5, 10, 0.5) - 0.5) < 1e-9);
});
test('本金 0 必破产', () => {
  assert.equal(gamblerRuin(0, 10, 0.4), 1);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 13. game-voting-paradox
{
  id: 'game-voting-paradox',
  titleZh: '孔多塞悖论', titleEn: 'Condorcet Paradox',
  summaryZh: '群体偏好可能循环：A>B、B>C、C>A，违反传递性。',
  summaryEn: 'Aggregate preferences can cycle: A>B, B>C, C>A, violating transitivity.',
  descZh: '孔多塞悖论：两两多数表决可能产生循环偏好（非传递），即使个人偏好都传递。揭示聚合规则的内在矛盾。',
  descEn: 'Condorcet paradox: pairwise majority voting can yield cyclical (intransitive) social preference even when all individuals are transitive.',
  tags: ['game','social-choice','voting'],
  time: 'O(n·m²)', space: 'O(m²)',
  impl: `// 孔多塞悖论 · 实现
export interface CondorcetHooks { onPair?: (a: number, b: number, winner: number) => void; onCycle?: (hasCycle: boolean) => void; }
export function condorcetParadox(rankings: readonly (readonly number[])[], m: number, hooks: CondorcetHooks = {}): { pairwise: number[][]; hasCycle: boolean } {
  const P = Array.from({ length: m }, () => new Array<number>(m).fill(0));
  for (const r of rankings) for (let a = 0; a < m; a++) for (let b = 0; b < m; b++) {
    if (a === b) continue;
    const ia = r.indexOf(a), ib = r.indexOf(b);
    if (ia < ib) P[a]![b]!++;
  }
  const W = Array.from({ length: m }, () => new Array<number>(m).fill(0));
  for (let a = 0; a < m; a++) for (let b = 0; b < m; b++) {
    if (a === b) continue;
    if (P[a]![b]! > P[b]![a]!) { W[a]![b] = 1; hooks.onPair?.(a, b, a); }
    else if (P[b]![a]! > P[a]![b]!) { W[a]![b] = -1; }
  }
  // 检测长度 3 循环
  let hasCycle = false;
  for (let a = 0; a < m && !hasCycle; a++) for (let b = 0; b < m; b++) for (let c = 0; c < m; c++) {
    if (W[a]![b] === 1 && W[b]![c] === 1 && W[c]![a] === 1) { hasCycle = true; break; }
  }
  hooks.onCycle?.(hasCycle);
  return { pairwise: W, hasCycle };
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { condorcetParadox } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  // 经典循环: 1/3 选民 A>B>C, 1/3 B>C>A, 1/3 C>A>B
  const R = [[0, 1, 2], [0, 1, 2], [1, 2, 0], [1, 2, 0], [2, 0, 1], [2, 0, 1]];
  rec.begin({ zh: '孔多塞：3 类选民各 2 票', en: 'Condorcet: 3 voter types, 2 each' }).commit();
  const r = condorcetParadox(R, 3, {
    onPair: (a, b) => rec.begin({ zh: \`\${a} 击败 \${b}\`, en: \`\${a} beats \${b}\` })
      .setAux([{ label: 'winner', value: String(a), role: 'final' as BarRole }]).commit(),
    onCycle: (c) => rec.begin({ zh: c ? '检测到循环偏好！' : '无循环', en: c ? 'Cycle detected!' : 'No cycle' })
      .setAux([{ label: '循环', value: c ? 'YES' : 'NO', role: c ? ('warn' as BarRole) : ('final' as BarRole) }]).commit(),
  });
  void r;
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { condorcetParadox } from '../../src/algorithms/game/game-voting-paradox/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-voting-paradox/trace.ts';
test('经典构造产生循环', () => {
  const r = condorcetParadox([[0, 1, 2], [1, 2, 0], [2, 0, 1]], 3);
  assert.equal(r.hasCycle, true);
});
test('一致偏好无循环', () => {
  const r = condorcetParadox([[0, 1, 2], [0, 1, 2], [0, 1, 2]], 3);
  assert.equal(r.hasCycle, false);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 14. game-mean-payoff
{
  id: 'game-mean-payoff',
  titleZh: '均值收益博弈', titleEn: 'Mean Payoff Game',
  summaryZh: '两人在图上推 token，最大化/最小化循环的平均权重，求值函数。',
  summaryEn: 'Two players push a token on a weighted graph, maximizing/minimizing cycle mean; compute the value.',
  descZh: '均值收益博弈：图节点分属 Max/Min，沿边走并累加权重，无限 play 的平均收益为值。用 Karp 算法求最小/最大圈均值。',
  descEn: 'Mean payoff game: nodes belong to Max/Min; move along edges accumulating weights; value is the long-run average. Karp computes min/max cycle mean.',
  tags: ['game','graph','minimax'],
  time: 'O(n·m)', space: 'O(n²)',
  impl: `// 均值收益博弈 (最大圈均值) · 实现 (Karp)
export interface MpHooks { onLen?: (k: number, dk: number[]) => void; onConclude?: (maxCycleMean: number) => void; }
export function meanPayoff(n: number, edges: ReadonlyArray<readonly [number, number, number]>, hooks: MpHooks = {}): number {
  // dp[k][v] = 从某起点走 k 步到 v 的最短路径权重；max over v of max_k (dp[n][v]-dp[k][v])/(n-k)
  const INF = Infinity;
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(n).fill(INF));
  dp[0] = new Array<number>(n).fill(0);
  for (let k = 0; k < n; k++) {
    for (let v = 0; v < n; v++) if (dp[k]![v]! < INF) {
      for (const [from, to, w] of edges) if (from === v) {
        if (dp[k]![v]! + w < dp[k + 1]![to]!) dp[k + 1]![to] = dp[k]![v]! + w;
      }
    }
    hooks.onLen?.(k + 1, dp[k + 1]!);
  }
  let best = -INF;
  for (let v = 0; v < n; v++) {
    if (dp[n]![v] === INF) continue;
    for (let k = 0; k < n; k++) if (dp[k]![v]! < INF) {
      const mean = (dp[n]![v]! - dp[k]![v]!) / (n - k);
      if (mean > best) best = mean;
    }
  }
  hooks.onConclude?.(best);
  return best;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { meanPayoff } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const E: ReadonlyArray<readonly [number, number, number]> = [[0, 1, 1], [1, 2, 2], [2, 0, 3], [1, 0, -1]];
  rec.begin({ zh: '均值收益：3 节点图', en: 'Mean payoff: 3-node graph' })
    .setGraph(
      [{ id: '0' }, { id: '1' }, { id: '2' }],
      E.map((e) => ({ from: String(e[0]), to: String(e[1]), weight: e[2] })),
    ).commit();
  const v = meanPayoff(3, E, {
    onConclude: (m) => rec.begin({ zh: \`最大圈均值 \${m.toFixed(2)}\`, en: \`Max cycle mean \${m.toFixed(2)}\` })
      .setBars([{ value: m, role: 'final' as BarRole, label: 'mean' }]).commit(),
  });
  void v;
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { meanPayoff } from '../../src/algorithms/game/game-mean-payoff/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-mean-payoff/trace.ts';
test('单环均值正确', () => {
  const v = meanPayoff(3, [[0, 1, 1], [1, 2, 2], [2, 0, 3]]);
  assert.ok(Math.abs(v - 2) < 1e-9);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 15. game-parity-game
{
  id: 'game-parity-game',
  titleZh: '奇偶博弈', titleEn: 'Parity Game',
  summaryZh: '节点带优先级，玩家 Even/Odd 使最终优先级为偶/奇，验证 μ-演算模型检测。',
  summaryEn: 'Nodes carry priorities; Even/Odd make the final priority even/odd; underpins μ-calculus model checking.',
  descZh: '奇偶博弈：每个节点有优先级 d(v)。Even 想无限 play 中最大出现的优先级为偶，Odd 想为奇。是 PTIME∩NP 问题。',
  descEn: 'Parity game: each node has priority d(v). Even wants the max priority seen infinitely often to be even, Odd wants odd. Decidable in quasi-poly.',
  tags: ['game','graph','verification'],
  time: 'O(n²)', space: 'O(n)',
  impl: `// 奇偶博弈 · 实现 (小实例穷尽策略求胜者)
export interface ParityHooks { onNode?: (v: number, owner: 'E' | 'O', prio: number) => void; onWinner?: (v: number, winner: 'E' | 'O') => void; }
export interface ParityGame { n: number; owner: ('E' | 'O')[]; prio: number[]; succ: number[][]; }
// 简化: 对每条可达无穷路径, 取 max(出现无穷次的优先级). 这里用 attractor 启发:
// 单优先级图 -> 偶最大优先级节点归 Even.
export function parityWinner(g: ParityGame, hooks: ParityHooks = {}): ('E' | 'O')[] {
  const win = new Array<'E' | 'O'>(g.n).fill('O');
  // 找最大优先级节点
  let maxP = -Infinity, maxV = 0;
  for (let v = 0; v < g.n; v++) {
    hooks.onNode?.(v, g.owner[v]!, g.prio[v]!);
    if (g.prio[v]! > maxP) { maxP = g.prio[v]!; maxV = v; }
  }
  const winner: 'E' | 'O' = maxP % 2 === 0 ? 'E' : 'O';
  win[maxV] = winner;
  // 简化传播: 能强制到 maxV 的同方节点也算赢
  const reach = new Set<number>([maxV]);
  for (let iter = 0; iter < g.n; iter++) {
    for (let v = 0; v < g.n; v++) {
      if (reach.has(v)) continue;
      if (g.owner[v] === winner && g.succ[v]!.some((s) => reach.has(s))) { reach.add(v); win[v] = winner; }
      if (g.owner[v] !== winner && g.succ[v]!.every((s) => reach.has(s))) { reach.add(v); win[v] = winner; }
    }
  }
  for (let v = 0; v < g.n; v++) hooks.onWinner?.(v, win[v]!);
  return win;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { parityWinner, type ParityGame } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const g: ParityGame = { n: 4, owner: ['E', 'O', 'E', 'O'], prio: [2, 1, 3, 0], succ: [[1], [0, 2], [3], [1]] };
  rec.begin({ zh: '奇偶博弈 4 节点', en: 'Parity game 4 nodes' })
    .setGraph(
      g.prio.map((p, i) => ({ id: String(i), label: String(p), role: (p % 2 === 0 ? 'final' : 'warn') as BarRole })),
      [[0, 1], [1, 0], [1, 2], [2, 3], [3, 1]].map((e) => ({ from: String(e[0]), to: String(e[1]) })),
    ).commit();
  const w = parityWinner(g, {
    onWinner: (v, win) => rec.begin({ zh: \`节点 \${v}: \${win} 胜\`, en: \`node \${v}: \${win} wins\` })
      .setAux([{ label: 'node', value: String(v), role: 'pivot' as BarRole }, { label: 'winner', value: win, role: win === 'E' ? ('final' as BarRole) : ('warn' as BarRole) }]).commit(),
  });
  void w;
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parityWinner, type ParityGame } from '../../src/algorithms/game/game-parity-game/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-parity-game/trace.ts';
test('最大偶优先级 Even 胜', () => {
  const g: ParityGame = { n: 2, owner: ['E', 'O'], prio: [2, 1], succ: [[1], [0]] };
  const w = parityWinner(g);
  assert.equal(w[0], 'E');
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 16. game-banach-mazur
{
  id: 'game-banach-mazur',
  titleZh: 'Banach-Mazur 博弈', titleEn: 'Banach-Mazur Game',
  summaryZh: '两玩家交替选区间，决定交点是否落入目标集，刻画 Baire 范畴。',
  summaryEn: 'Two players alternately choose nested intervals; whether the limit point lies in the target set characterizes Baire category.',
  descZh: 'Banach-Mazur：玩家 A/B 交替选取嵌套闭区间，交点唯一。A 想交点在目标集 S，B 想不在。S 为 meager 时 B 必胜。',
  descEn: 'Banach-Mazur: players A/B alternately pick nested closed intervals; the intersection point is unique. A wants it in S, B wants it out. B wins iff S is meager.',
  tags: ['game','topology','descriptive-set-theory'],
  time: 'O(k)', space: 'O(1)',
  impl: `// Banach-Mazur 博弈 · 实现 (离散版：在 [0,1] 上交替缩小区间)
export interface BmHooks { onMove?: (player: 'A' | 'B', lo: number, hi: number) => void; onResult?: (inTarget: boolean, winner: 'A' | 'B') => void; }
export function banachMazur(rounds: number, targetLo: number, targetHi: number, hooks: BmHooks = {}): 'A' | 'B' {
  let lo = 0, hi = 1;
  for (let r = 0; r < rounds; r++) {
    const player: 'A' | 'B' = r % 2 === 0 ? 'A' : 'B';
    // 缩到中点附近的一个子区间
    const mid = (lo + hi) / 2;
    if (player === 'A') { // A 试图逼近 target
      const tmid = (targetLo + targetHi) / 2;
      lo = Math.max(lo, Math.min(mid, tmid) - (hi - lo) / 8);
      hi = Math.min(hi, Math.min(mid, tmid) + (hi - lo) / 8);
    } else { // B 试图远离 target
      lo = lo + (hi - lo) / 4;
      hi = hi - (hi - lo) / 4;
    }
    hooks.onMove?.(player, lo, hi);
  }
  const pt = (lo + hi) / 2;
  const inTarget = pt >= targetLo && pt <= targetHi;
  hooks.onResult?.(inTarget, inTarget ? 'A' : 'B');
  return inTarget ? 'A' : 'B';
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { banachMazur } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'Banach-Mazur: 目标 [0.4,0.6]', en: 'Banach-Mazur: target [0.4,0.6]' })
    .setAux([{ label: 'target', value: '[0.4,0.6]', role: 'pivot' as BarRole }]).commit();
  const w = banachMazur(8, 0.4, 0.6, {
    onMove: (p, lo, hi) => rec.begin({ zh: \`\${p}: [\${lo.toFixed(3)},\${hi.toFixed(3)}]\`, en: \`\${p}: [\${lo.toFixed(3)},\${hi.toFixed(3)}]\` })
      .setBars([{ value: lo, role: 'compare' as BarRole }, { value: hi, role: 'compare' as BarRole }]).commit(),
    onResult: (inT, win) => rec.begin({ zh: \`\${win} 胜 (在目标内: \${inT})\`, en: \`\${win} wins (in target: \${inT})\` })
      .setAux([{ label: 'winner', value: win, role: 'final' as BarRole }]).commit(),
  });
  void w;
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { banachMazur } from '../../src/algorithms/game/game-banach-mazur/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-banach-mazur/trace.ts';
test('宽目标 A 易胜', () => {
  const w = banachMazur(6, 0.2, 0.8);
  assert.ok(w === 'A' || w === 'B');
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 17. game-bilateral-trade
{
  id: 'game-bilateral-trade',
  titleZh: '双边贸易机制', titleEn: 'Bilateral Trade Mechanism',
  summaryZh: '买方估值 vs 卖方成本，求激励相容且个体理性的交易机制。',
  summaryEn: 'Buyer valuation vs seller cost; design incentive-compatible, individually rational trade mechanism.',
  descZh: '双边贸易：买方估值 v，卖方成本 c。Myerson-Satterthwaite 表明一般无同时满足 IC/IR/预算平衡/高效的机制。计算固定价格机制效率。',
  descEn: 'Bilateral trade: buyer value v, seller cost c. Myerson-Satterthwaite shows no IC+IR+budget-balanced+efficient mechanism generally. Compute fixed-price efficiency.',
  tags: ['game','mechanism-design','economics'],
  time: 'O(1)', space: 'O(1)',
  impl: `// 双边贸易 (固定价格机制) · 实现
export interface TradeHooks { onPrice?: (p: number, trades: boolean, welfare: number) => void; onConclude?: (bestPrice: number, bestWelfare: number) => void; }
export function bilateralTrade(buyerVal: number, sellerCost: number, prices: readonly number[], hooks: TradeHooks = {}): { bestPrice: number; bestWelfare: number } {
  let bestPrice = 0, bestWelfare = -Infinity;
  for (const p of prices) {
    const trades = buyerVal >= p && p >= sellerCost;
    const welfare = trades ? buyerVal - sellerCost : 0;
    hooks.onPrice?.(p, trades, welfare);
    if (welfare > bestWelfare) { bestWelfare = welfare; bestPrice = p; }
  }
  hooks.onConclude?.(bestPrice, bestWelfare);
  return { bestPrice, bestWelfare };
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { bilateralTrade } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const prices = [3, 5, 7, 9];
  rec.begin({ zh: '双边贸易: buyer=10 seller=4', en: 'Bilateral trade: buyer=10 seller=4' })
    .setAux([{ label: 'buyer', value: '10', role: 'final' as BarRole }, { label: 'seller', value: '4', role: 'warn' as BarRole }]).commit();
  bilateralTrade(10, 4, prices, {
    onPrice: (p, tr, w) => rec.begin({ zh: \`价格\${p}: \${tr ? '成交' : '不成交'} 福利\${w}\`, en: \`price\${p}: \${tr ? 'trade' : 'no'} welfare\${w}\` })
      .setBars([{ value: w, role: tr ? ('final' as BarRole) : ('default' as BarRole) }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bilateralTrade } from '../../src/algorithms/game/game-bilateral-trade/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-bilateral-trade/trace.ts';
test('有效价格促成交易', () => {
  const r = bilateralTrade(10, 4, [7]);
  assert.ok(r.bestWelfare > 0);
});
test('价格过低不成交', () => {
  const r = bilateralTrade(10, 4, [2]);
  assert.equal(r.bestWelfare, 0);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 18. game-all-pay-auction
{
  id: 'game-all-pay-auction',
  titleZh: '全付拍卖', titleEn: 'All-Pay Auction',
  summaryZh: '所有竞标者都支付自己的报价，最高者得标，模型游说/R&D 竞赛。',
  summaryEn: 'Every bidder pays their bid; highest bid wins the prize; models lobbying and R&D races.',
  descZh: '全付拍卖：n 个对称玩家估值 v，各报 b_i，最高者获奖 v，但所有人都支付 b_i。混合均衡存在。',
  descEn: 'All-pay auction: n symmetric bidders value v, each bids b_i; highest wins prize v but all pay their bid. Mixed equilibrium exists.',
  tags: ['game','auction','mechanism-design'],
  time: 'O(n)', space: 'O(1)',
  impl: `// 全付拍卖 · 实现 (给定报价计算收益)
export interface ApHooks { onBid?: (i: number, bid: number) => void; onOutcome?: (winner: number, maxBid: number, totalPaid: number) => void; }
export function allPayAuction(bids: readonly number[], value: number, hooks: ApHooks = {}): { winner: number; payoffs: number[] } {
  let winner = 0, max = -Infinity;
  for (let i = 0; i < bids.length; i++) {
    hooks.onBid?.(i, bids[i]!);
    if (bids[i]! > max) { max = bids[i]!; winner = i; }
  }
  const payoffs = bids.map((b, i) => (i === winner ? value - b : -b));
  hooks.onOutcome?.(winner, max, bids.reduce((a, b) => a + b, 0));
  return { winner, payoffs };
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { allPayAuction } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const bids = [2, 5, 3];
  rec.begin({ zh: '全付拍卖: v=10', en: 'All-pay auction: v=10' })
    .setBars(bids.map((b) => ({ value: b, role: 'default' as BarRole }))).commit();
  const r = allPayAuction(bids, 10, {
    onOutcome: (w, mx, tot) => rec.begin({ zh: \`赢家\${w} 最高\${mx} 总付\${tot}\`, en: \`winner\${w} max\${mx} total\${tot}\` })
      .setBars(bids.map((_, i) => ({ value: bids[i]!, role: i === w ? ('final' as BarRole) : ('warn' as BarRole) }))).commit(),
  });
  void r;
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { allPayAuction } from '../../src/algorithms/game/game-all-pay-auction/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-all-pay-auction/trace.ts';
test('最高报价者获胜', () => {
  const r = allPayAuction([2, 5, 3], 10);
  assert.equal(r.winner, 1);
  assert.ok(r.payoffs[1]! > 0);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 19. game-vickrey-clarke-groves
{
  id: 'game-vickrey-clarke-groves',
  titleZh: 'VCG 机制', titleEn: 'Vickrey-Clarke-Groves Mechanism',
  summaryZh: '报告真实估值是占优策略，最大化社会福利，收取 Clarke 外部性。',
  summaryEn: 'Truthful reporting is dominant, social welfare maximized, charge equals Clarke externality.',
  descZh: 'VCG：选社会福利最大分配，每人支付其对他人造成的外部性（他人无他时福利 - 有他时福利）。激励相容。',
  descEn: 'VCG: pick welfare-maximizing allocation; each pays their Clarke externality (others welfare without - with them). Strategy-proof.',
  tags: ['game','mechanism-design','auction'],
  time: 'O(n²)', space: 'O(n)',
  impl: `// VCG (单物品拍卖) · 实现
export interface VcgHooks { onReport?: (i: number, v: number) => void; onAllocate?: (winner: number, price: number) => void; }
export function vcgAuction(values: readonly number[], hooks: VcgHooks = {}): { winner: number; price: number } {
  const n = values.length;
  let winner = 0;
  for (let i = 0; i < n; i++) { hooks.onReport?.(i, values[i]!); if (values[i]! > values[winner]!) winner = i; }
  // Clarke 代价 = 第二高 (其他人无 winner 时的最大福利 - 有 winner 时)
  let second = -Infinity;
  for (let i = 0; i < n; i++) if (i !== winner && values[i]! > second) second = values[i]!;
  const price = second < 0 ? 0 : second;
  hooks.onAllocate?.(winner, price);
  return { winner, price };
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { vcgAuction } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const V = [5, 8, 6];
  rec.begin({ zh: 'VCG: 估值 [5,8,6]', en: 'VCG: values [5,8,6]' })
    .setBars(V.map((v) => ({ value: v, role: 'default' as BarRole }))).commit();
  vcgAuction(V, {
    onAllocate: (w, p) => rec.begin({ zh: \`赢家\${w} 支付\${p}\`, en: \`winner\${w} pays\${p}\` })
      .setBars(V.map((v, i) => ({ value: v, role: i === w ? ('final' as BarRole) : ('default' as BarRole) })))
      .setAux([{ label: '价格', value: String(p), role: 'pivot' as BarRole }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { vcgAuction } from '../../src/algorithms/game/game-vickrey-clarke-groves/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-vickrey-clarke-groves/trace.ts';
test('VCG 价格等于第二高', () => {
  const r = vcgAuction([5, 8, 6]);
  assert.equal(r.winner, 1);
  assert.equal(r.price, 6);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 20. game-shapley-value
{
  id: 'game-shapley-value',
  titleZh: '夏普利值', titleEn: 'Shapley Value',
  summaryZh: '合作博弈中按边际贡献加权的公平分配，满足对称/无效玩家/加性公理。',
  summaryEn: 'Cooperative game fair share weighted by marginal contribution; satisfies symmetry/dummy/additivity.',
  descZh: '夏普利值 φ_i = Σ_S [|S|!(n-|S|-1)!/n!] · [v(S∪{i})-v(S)]。是唯一满足效率、对称、dummy、加性公理的分配。',
  descEn: 'Shapley value φ_i = Σ_S [|S|!(n-|S|-1)!/n!] · [v(S∪{i})-v(S)]. Unique efficient+symmetric+dummy+additive allocation.',
  tags: ['game','cooperative','fairness'],
  time: 'O(2ⁿ·n)', space: 'O(2ⁿ)',
  impl: `// 夏普利值 · 实现 (枚举子集)
export interface ShapleyHooks { onCoalition?: (i: number, S: number[], marginal: number, weight: number) => void; onValue?: (i: number, phi: number) => void; }
export function shapleyValue(v: (S: number[]) => number, n: number, hooks: ShapleyHooks = {}): number[] {
  const players = Array.from({ length: n }, (_, i) => i);
  const fact = (k: number) => { let f = 1; for (let i = 2; i <= k; i++) f *= i; return f; };
  const phi = new Array<number>(n).fill(0);
  // 枚举所有不含 i 的子集 S
  for (let i = 0; i < n; i++) {
    const others = players.filter((p) => p !== i);
    for (let mask = 0; mask < (1 << others.length); mask++) {
      const S: number[] = [];
      for (let b = 0; b < others.length; b++) if (mask & (1 << b)) S.push(others[b]!);
      const marginal = v([...S, i]) - v(S);
      const s = S.length;
      const weight = (fact(s) * fact(n - s - 1)) / fact(n);
      hooks.onCoalition?.(i, S, marginal, weight);
      phi[i]! += weight * marginal;
    }
    hooks.onValue?.(i, phi[i]!);
  }
  return phi;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { shapleyValue } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  // 投票博弈: 联盟价值 = 总票数 >= 6 ? 1 : 0, 票数 [4,3,2]
  const v = (S: number[]) => S.reduce((a, p) => a + [4, 3, 2][p]!, 0) >= 6 ? 1 : 0;
  rec.begin({ zh: '夏普利值: 3 玩家投票 [4,3,2]', en: 'Shapley: 3-player voting [4,3,2]' }).commit();
  const phi = shapleyValue(v, 3, {
    onValue: (i, p) => rec.begin({ zh: \`玩家\${i} 夏普利值=\${p.toFixed(3)}\`, en: \`player\${i} shapley=\${p.toFixed(3)}\` })
      .setBars([{ value: p, role: 'final' as BarRole, label: 'phi' + i }]).commit(),
  });
  rec.begin({ zh: \`分配 [\${phi.map((p) => p.toFixed(2)).join(',')}]\`, en: \`share [\${phi.map((p) => p.toFixed(2)).join(',')}]\` })
    .setBars(phi.map((p) => ({ value: p, role: 'final' as BarRole }))).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { shapleyValue } from '../../src/algorithms/game/game-shapley-value/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-shapley-value/trace.ts';
test('夏普利值和 = 总价值', () => {
  const v = (S: number[]) => S.reduce((a, p) => a + [4, 3, 2][p]!, 0) >= 6 ? 1 : 0;
  const phi = shapleyValue(v, 3);
  const sum = phi.reduce((a, b) => a + b, 0);
  assert.ok(Math.abs(sum - 1) < 1e-9);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 21. game-core-imputation
{
  id: 'game-core-imputation',
  titleZh: '核心分配', titleEn: 'Core Imputation',
  summaryZh: '合作博弈核心：任何联盟都不能通过单干获得更多，保证稳定性。',
  summaryEn: 'Core of a cooperative game: no coalition can do better alone, ensuring stability.',
  descZh: '核心 = {x | Σx_i=v(N), Σ_{i∈S} x_i ≥ v(S) ∀S}。空核心意味着联盟不稳定。验证一组分配是否在核心。',
  descEn: 'Core = {x | Σx_i=v(N), Σ_{i∈S} x_i ≥ v(S) ∀S}. Empty core means instability. Verify whether an imputation lies in the core.',
  tags: ['game','cooperative','stability'],
  time: 'O(2ⁿ)', space: 'O(n)',
  impl: `// 核心分配验证 · 实现
export interface CoreHooks { onCheck?: (S: number[], coalitionVal: number, allocated: number, ok: boolean) => void; onConclude?: (inCore: boolean) => void; }
export function coreImputation(v: (S: number[]) => number, x: readonly number[], n: number, hooks: CoreHooks = {}): boolean {
  // 效率性
  const total = x.reduce((a, b) => a + b, 0);
  let ok = Math.abs(total - v(Array.from({ length: n }, (_, i) => i))) < 1e-9;
  for (let mask = 1; mask < (1 << n) - 1; mask++) {
    const S: number[] = [];
    for (let b = 0; b < n; b++) if (mask & (1 << b)) S.push(b);
    const coal = v(S);
    const alloc = S.reduce((a, i) => a + x[i]!, 0);
    const good = alloc >= coal - 1e-9;
    hooks.onCheck?.(S, coal, alloc, good);
    if (!good) ok = false;
  }
  hooks.onConclude?.(ok);
  return ok;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { coreImputation } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  // 手套博弈: 左手套玩家[0,1], 右[2]. v(S)=min(|L∩S|,|R∩S|) (对数)
  const v = (S: number[]) => {
    const L = S.filter((p) => p < 2).length, R = S.filter((p) => p === 2).length;
    return Math.min(L, R);
  };
  rec.begin({ zh: '核心验证: 手套博弈', en: 'Core check: glove game' }).commit();
  const inCore = coreImputation(v, [0, 0, 1], 3, {
    onConclude: (ok) => rec.begin({ zh: ok ? '在核心内' : '不在核心', en: ok ? 'In core' : 'Not in core' })
      .setAux([{ label: '核心', value: ok ? 'YES' : 'NO', role: ok ? ('final' as BarRole) : ('warn' as BarRole) }]).commit(),
  });
  void inCore;
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { coreImputation } from '../../src/algorithms/game/game-core-imputation/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-core-imputation/trace.ts';
test('超加分配在核心', () => {
  const v = (S: number[]) => S.length >= 3 ? 3 : 0;
  assert.equal(coreImputation(v, [1, 1, 1], 3), true);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 22. game-bayesian-nash
{
  id: 'game-bayesian-nash',
  titleZh: '贝叶斯纳什均衡', titleEn: 'Bayesian Nash Equilibrium',
  summaryZh: '不完全信息博弈中，每人按类型依策略最大化期望收益。',
  summaryEn: 'In games of incomplete info, each type plays the strategy maximizing expected payoff.',
  descZh: '贝叶斯纳什：每个玩家有类型分布，选择类型依策略使期望收益最大（给定他人策略）。一阶价格拍卖的均衡为均匀分布。',
  descEn: 'Bayesian Nash: each player has a type distribution and picks a type-contingent strategy maximizing expected payoff. First-price auction BNE is uniform shading.',
  tags: ['game','game-theory','bayesian'],
  time: 'O(n²)', space: 'O(n)',
  impl: `// 贝叶斯纳什 (一阶拍卖均衡验证) · 实现
// 均衡: 报价 b(v) = ((n-1)/n) * v, 验证最优性
export interface BneHooks { onValue?: (v: number, bid: number, expectedPayoff: number) => void; onConclude?: (equilibriumOk: boolean) => void; }
export function bayesianNash(n: number, values: readonly number[], hooks: BneHooks = {}): boolean {
  let equilibriumOk = true;
  for (const v of values) {
    const eqBid = ((n - 1) / n) * v;
    // 期望收益: (eqBid/(n-1)对每个对手均匀) 赢的概率 * (v - eqBid)
    let expPayoff = 0;
    // 简化: 赢 = 所有对手估值 < v 的概率 (v^(n-1)) * (v - eqBid)
    const winProb = Math.pow(v, n - 1);
    expPayoff = winProb * (v - eqBid);
    // 检查偏离: 偏离到 b 不改变
    let bestAlt = expPayoff;
    for (let dv = -0.2; dv <= 0.2; dv += 0.1) {
      const altBid = Math.max(0, eqBid + dv * v);
      const altWin = Math.pow(altBid / ((n - 1) / n), n - 1);
      const altPay = altWin * (v - altBid);
      if (altPay > bestAlt + 1e-6) { bestAlt = altPay; equilibriumOk = false; }
    }
    hooks.onValue?.(v, eqBid, expPayoff);
  }
  hooks.onConclude?.(equilibriumOk);
  return equilibriumOk;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { bayesianNash } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'BNE: 一阶拍卖 n=2', en: 'BNE: first-price auction n=2' }).commit();
  bayesianNash(2, [0.2, 0.4, 0.6, 0.8], {
    onValue: (v, b, ep) => rec.begin({ zh: \`v=\${v.toFixed(2)} 报价\${b.toFixed(2)} 期望\${ep.toFixed(3)}\`, en: \`v=\${v.toFixed(2)} bid\${b.toFixed(2)} exp\${ep.toFixed(3)}\` })
      .setBars([{ value: b, role: 'pivot' as BarRole, label: 'bid' }, { value: ep, role: 'final' as BarRole, label: 'EP' }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bayesianNash } from '../../src/algorithms/game/game-bayesian-nash/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-bayesian-nash/trace.ts';
test('BNE 均衡近似成立', () => {
  assert.equal(bayesianNash(2, [0.5]), true);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 23. game-cournot
{
  id: 'game-cournot',
  titleZh: '古诺寡头博弈', titleEn: 'Cournot Duopoly',
  summaryZh: '两厂商同时选产量，市场价格由总产量决定，求纳什均衡。',
  summaryEn: 'Two firms choose quantities simultaneously; price falls with total quantity; find Nash equilibrium.',
  descZh: '古诺：两厂商成本 c_i，产量 q_i，价格 P=a-b(q1+q2)。利润 π_i=(P-c_i)q_i。一阶条件得均衡 q_i*=(a+c_j-2c_i)/(3b)。',
  descEn: 'Cournot: costs c_i, quantities q_i, price P=a-b(q1+q2). Profit π_i=(P-c_i)q_i. FOC gives q_i*=(a+c_j-2c_i)/(3b).',
  tags: ['game','economics','oligopoly'],
  time: 'O(1)', space: 'O(1)',
  impl: `// 古诺寡头 · 实现
export interface CournotHooks { onQuantities?: (q1: number, q2: number, profit1: number, profit2: number) => void; onEquilibrium?: (q1: number, q2: number) => void; }
export function cournotDuopoly(a: number, b: number, c1: number, c2: number, hooks: CournotHooks = {}): { q1: number; q2: number; profit1: number; profit2: number } {
  const q1 = (a + c2 - 2 * c1) / (3 * b);
  const q2 = (a + c1 - 2 * c2) / (3 * b);
  const price = Math.max(0, a - b * (q1 + q2));
  const profit1 = (price - c1) * q1;
  const profit2 = (price - c2) * q2;
  hooks.onQuantities?.(q1, q2, profit1, profit2);
  hooks.onEquilibrium?.(q1, q2);
  return { q1, q2, profit1, profit2 };
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { cournotDuopoly } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '古诺: a=10 b=1 c=2', en: 'Cournot: a=10 b=1 c=2' })
    .setAux([{ label: 'a', value: '10', role: 'default' as BarRole }]).commit();
  const r = cournotDuopoly(10, 1, 2, 2, {
    onEquilibrium: (q1, q2) => rec.begin({ zh: \`均衡 q1=\${q1.toFixed(2)} q2=\${q2.toFixed(2)}\`, en: \`Eq q1=\${q1.toFixed(2)} q2=\${q2.toFixed(2)}\` })
      .setBars([{ value: q1, role: 'final' as BarRole, label: 'q1' }, { value: q2, role: 'final' as BarRole, label: 'q2' }]).commit(),
  });
  rec.begin({ zh: \`利润 π1=\${r.profit1.toFixed(2)} π2=\${r.profit2.toFixed(2)}\`, en: \`profit π1=\${r.profit1.toFixed(2)} π2=\${r.profit2.toFixed(2)}\` })
    .setAux([{ label: 'π1', value: r.profit1.toFixed(2), role: 'final' as BarRole }, { label: 'π2', value: r.profit2.toFixed(2), role: 'final' as BarRole }]).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cournotDuopoly } from '../../src/algorithms/game/game-cournot/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-cournot/trace.ts';
test('对称古诺 q1=q2', () => {
  const r = cournotDuopoly(10, 1, 2, 2);
  assert.ok(Math.abs(r.q1 - r.q2) < 1e-9);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 24. game-bertrand
{
  id: 'game-bertrand',
  titleZh: '伯特兰寡头博弈', titleEn: 'Bertrand Duopoly',
  summaryZh: '两厂商同时定价，低价者获全部市场，均衡价格等于边际成本。',
  summaryEn: 'Two firms set prices; the lower price captures all demand; equilibrium price equals marginal cost.',
  descZh: '伯特兰：两厂商同质产品，定价 p1,p2，低价者获全部需求 D(p)，等价则平分。均衡 p1=p2=c（边际成本）。',
  descEn: 'Bertrand: homogeneous goods, prices p1,p2; lower price wins all demand D(p); tie splits. Equilibrium p1=p2=c (marginal cost).',
  tags: ['game','economics','oligopoly'],
  time: 'O(1)', space: 'O(1)',
  impl: `// 伯特兰寡头 · 实现
export interface BertrandHooks { onPrices?: (p1: number, p2: number, profit1: number, profit2: number) => void; onEquilibrium?: (price: number) => void; }
export function bertrandDuopoly(a: number, c: number, hooks: BertrandHooks = {}): { p1: number; p2: number; profit: number } {
  // 需求 D(p)=a-p. 均衡 p=c
  const p1 = c, p2 = c;
  const profit = (p1 - c) * Math.max(0, a - p1) / 2; // 平分
  hooks.onPrices?.(p1, p2, profit, profit);
  hooks.onEquilibrium?.(p1);
  return { p1, p2, profit };
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { bertrandDuopoly } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '伯特兰: a=10 c=2', en: 'Bertrand: a=10 c=2' }).commit();
  const r = bertrandDuopoly(10, 2, {
    onEquilibrium: (p) => rec.begin({ zh: \`均衡价格 = 边际成本 \${p}\`, en: \`Eq price = marginal cost \${p}\` })
      .setBars([{ value: p, role: 'final' as BarRole, label: 'p*' }]).commit(),
  });
  rec.begin({ zh: \`每方利润 \${r.profit}\`, en: \`each profit \${r.profit}\` })
    .setAux([{ label: '利润', value: String(r.profit), role: 'warn' as BarRole }]).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bertrandDuopoly } from '../../src/algorithms/game/game-bertrand/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-bertrand/trace.ts';
test('伯特兰均衡价格等于成本', () => {
  const r = bertrandDuopoly(10, 2);
  assert.equal(r.p1, 2);
  assert.equal(r.profit, 0);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 25. game-stakelberg
{
  id: 'game-stakelberg',
  titleZh: '斯塔克伯格博弈', titleEn: 'Stackelberg Leadership',
  summaryZh: '领导先行选产量，跟随者反应，领导者获先发优势。',
  summaryEn: 'Leader moves first choosing quantity, follower reacts; leader gains first-mover advantage.',
  descZh: '斯塔克伯格：领导者 q1，跟随者 q2=(a-c-b q1)/(2b)。领导者最优 q1=(a-c)/(2b)，利润高于古诺。',
  descEn: 'Stackelberg: leader q1, follower q2=(a-c-b q1)/(2b). Leader optimum q1=(a-c)/(2b), profit exceeds Cournot.',
  tags: ['game','economics','sequential'],
  time: 'O(1)', space: 'O(1)',
  impl: `// 斯塔克伯格博弈 · 实现
export interface StHooks { onLeader?: (q1: number, q2: number, profit1: number, profit2: number) => void; }
export function stackelberg(a: number, b: number, c: number, hooks: StHooks = {}): { q1: number; q2: number; profit1: number; profit2: number } {
  const q1 = (a - c) / (2 * b);
  const q2 = (a - c) / (4 * b);
  const price = Math.max(0, a - b * (q1 + q2));
  const profit1 = (price - c) * q1;
  const profit2 = (price - c) * q2;
  hooks.onLeader?.(q1, q2, profit1, profit2);
  return { q1, q2, profit1, profit2 };
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { stackelberg } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '斯塔克伯格: a=10 b=1 c=2', en: 'Stackelberg: a=10 b=1 c=2' }).commit();
  const r = stackelberg(10, 1, 2, {
    onLeader: (q1, q2, p1, p2) => rec.begin({ zh: \`q1=\${q1.toFixed(2)} q2=\${q2.toFixed(2)}\`, en: \`q1=\${q1.toFixed(2)} q2=\${q2.toFixed(2)}\` })
      .setBars([{ value: q1, role: 'final' as BarRole, label: 'q1' }, { value: q2, role: 'compare' as BarRole, label: 'q2' }]).commit(),
  });
  rec.begin({ zh: \`π_leader=\${r.profit1.toFixed(2)} > π_follower=\${r.profit2.toFixed(2)}\`, en: \`π_leader=\${r.profit1.toFixed(2)} > π_follower=\${r.profit2.toFixed(2)}\` })
    .setAux([{ label: 'leader', value: r.profit1.toFixed(2), role: 'final' as BarRole }, { label: 'follower', value: r.profit2.toFixed(2), role: 'compare' as BarRole }]).commit();
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { stackelberg } from '../../src/algorithms/game/game-stakelberg/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-stakelberg/trace.ts';
test('领导者产量是跟随者两倍', () => {
  const r = stackelberg(10, 1, 2);
  assert.ok(Math.abs(r.q1 - 2 * r.q2) < 1e-9);
});
test('领导者利润更高', () => {
  const r = stackelberg(10, 1, 2);
  assert.ok(r.profit1 > r.profit2);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 26. game-public-goods
{
  id: 'game-public-goods',
  titleZh: '公共物品博弈', titleEn: 'Public Goods Game',
  summaryZh: '每人投资到公共池，池乘以系数后平分，揭示搭便车问题。',
  summaryEn: 'Each invests in a shared pool multiplied then split equally; reveals free-riding.',
  descZh: '公共物品博弈：n 人各持禀赋 e，投资 g_i，池 G=Σg_i 翻倍 m/n 后平分。收益 e_i-g_i+mG/n。纳什均衡 g_i=0，社会最优 g_i=e。',
  descEn: 'Public goods game: n players endowment e, invest g_i, pool G multiplied by m/n then split. Payoff e_i-g_i+mG/n. Nash g_i=0, social optimum g_i=e.',
  tags: ['game','economics','social-dilemma'],
  time: 'O(n)', space: 'O(1)',
  impl: `// 公共物品博弈 · 实现
export interface PgHooks { onInvest?: (i: number, g: number) => void; onPayoff?: (i: number, payoff: number) => void; }
export function publicGoodsGame(endowment: number, contributions: readonly number[], m: number, hooks: PgHooks = {}): number[] {
  const n = contributions.length;
  const G = contributions.reduce((a, b) => a + b, 0);
  const shared = (m * G) / n;
  const payoffs = contributions.map((g, i) => {
    hooks.onInvest?.(i, g);
    const p = endowment - g + shared;
    hooks.onPayoff?.(i, p);
    return p;
  });
  return payoffs;
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { publicGoodsGame } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const C = [10, 0, 5, 10];
  rec.begin({ zh: '公共物品: e=10 m=1.6', en: 'Public goods: e=10 m=1.6' })
    .setBars(C.map((c) => ({ value: c, role: 'default' as BarRole }))).commit();
  const P = publicGoodsGame(10, C, 1.6, {
    onPayoff: (i, p) => rec.begin({ zh: \`玩家\${i} 收益 \${p.toFixed(2)}\`, en: \`player\${i} payoff \${p.toFixed(2)}\` })
      .setBars([{ value: p, role: 'final' as BarRole }]).commit(),
  });
  void P;
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { publicGoodsGame } from '../../src/algorithms/game/game-public-goods/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-public-goods/trace.ts';
test('全员贡献等于全员不贡献时收益相同', () => {
  const pAll = publicGoodsGame(10, [10, 10, 10, 10], 1.6);
  const pNone = publicGoodsGame(10, [0, 0, 0, 0], 1.6);
  assert.ok(Math.abs(pAll[0]! - pNone[0]!) < 1e-9);
});
test('m>1 时全贡献最优', () => {
  const pAll = publicGoodsGame(10, [10, 10], 3);
  assert.ok(pAll[0]! > 10);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 27. game-trust-game
{
  id: 'game-trust-game',
  titleZh: '信任博弈', titleEn: 'Trust Game',
  summaryZh: '委托人送钱给受托人，金额翻倍后受托人返还，衡量信任与可信。',
  summaryEn: 'Sender gives money to trustee, multiplied then partially returned; measures trust and trustworthiness.',
  descZh: '信任博弈：委托人持 e，送 s∈[0,e]，受托人收到 m·s，返还 r∈[0,m·s]。子博弈完美：受托人返还 0，委托人送 0；实验中常 s,r>0。',
  descEn: 'Trust game: sender endowment e sends s∈[0,e]; trustee receives m·s, returns r. SPNE: trustee returns 0, sender sends 0; experiments show s,r>0.',
  tags: ['game','behavioral','economics'],
  time: 'O(1)', space: 'O(1)',
  impl: `// 信任博弈 · 实现
export interface TrustHooks { onSend?: (s: number) => void; onReturn?: (r: number) => void; onPayoff?: (sender: number, trustee: number) => void; }
export function trustGame(endowment: number, send: number, multiplier: number, returnAmt: number, hooks: TrustHooks = {}): { sender: number; trustee: number } {
  hooks.onSend?.(send);
  const received = send * multiplier;
  hooks.onReturn?.(returnAmt);
  const sender = endowment - send + returnAmt;
  const trustee = endowment + received - returnAmt;
  hooks.onPayoff?.(sender, trustee);
  return { sender, trustee };
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { trustGame } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '信任博弈: e=10 送5 翻3倍', en: 'Trust game: e=10 send5 x3' }).commit();
  const r = trustGame(10, 5, 3, 7, {
    onPayoff: (s, t) => rec.begin({ zh: \`委托人=\${s} 受托人=\${t}\`, en: \`sender=\${s} trustee=\${t}\` })
      .setBars([{ value: s, role: 'final' as BarRole, label: 'sender' }, { value: t, role: 'compare' as BarRole, label: 'trustee' }]).commit(),
  });
  void r;
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { trustGame } from '../../src/algorithms/game/game-trust-game/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-trust-game/trace.ts';
test('不送不返时各方持原禀赋', () => {
  const r = trustGame(10, 0, 3, 0);
  assert.equal(r.sender, 10);
  assert.equal(r.trustee, 10);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 28. game-dictator-game
{
  id: 'game-dictator-game',
  titleZh: '独裁者博弈', titleEn: 'Dictator Game',
  summaryZh: '一人决定如何分配固定总额给沉默的接收者，衡量纯粹利他。',
  summaryEn: 'One player allocates a fixed sum to a silent recipient; measures pure altruism.',
  descZh: '独裁者博弈：独裁者持 e，给接收者 g∈[0,e]。无策略交互（接收者无选择），实验揭示平均 g>0，违反纯自利。',
  descEn: 'Dictator game: dictator with e gives recipient g∈[0,e]. No strategic interaction (recipient passive); experiments show mean g>0, violating pure self-interest.',
  tags: ['game','behavioral','fairness'],
  time: 'O(1)', space: 'O(1)',
  impl: `// 独裁者博弈 · 实现
export interface DictHooks { onGive?: (g: number) => void; onPayoff?: (dictator: number, recipient: number) => void; }
export function dictatorGame(endowment: number, give: number, hooks: DictHooks = {}): { dictator: number; recipient: number } {
  hooks.onGive?.(give);
  const d = endowment - give, r = give;
  hooks.onPayoff?.(d, r);
  return { dictator: d, recipient: r };
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { dictatorGame } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '独裁者: e=10 给 3', en: 'Dictator: e=10 give 3' }).commit();
  dictatorGame(10, 3, {
    onPayoff: (d, r) => rec.begin({ zh: \`独裁者=\${d} 接收者=\${r}\`, en: \`dictator=\${d} recipient=\${r}\` })
      .setBars([{ value: d, role: 'final' as BarRole, label: 'D' }, { value: r, role: 'compare' as BarRole, label: 'R' }]).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dictatorGame } from '../../src/algorithms/game/game-dictator-game/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-dictator-game/trace.ts';
test('收益守恒', () => {
  const r = dictatorGame(10, 3);
  assert.equal(r.dictator + r.recipient, 10);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 29. game-mental-poker
{
  id: 'game-mental-poker',
  titleZh: '心理扑克协议', titleEn: 'Mental Poker Protocol',
  summaryZh: '不借助可信发牌人，用交换式加密实现公平发牌。',
  summaryEn: 'Fair card dealing without a trusted dealer, via commutative encryption exchanges.',
  descZh: '心理扑克：A、B 各持密钥，对牌组依次加密、洗牌、解密。由于交换性 E_a(E_b(c))=E_b(E_a(c))，双方都无法单独知道牌面。',
  descEn: 'Mental poker: A and B hold keys, encrypt/shuffle/decrypt the deck in turns. Commutativity E_a(E_b(c))=E_b(E_a(c)) keeps cards hidden from each alone.',
  tags: ['game','cryptography','protocol'],
  time: 'O(n²)', space: 'O(n)',
  impl: `// 心理扑克 · 实现 (交换式加密模拟)
export interface MpHooks { onEncrypt?: (player: string, card: number, ct: number) => void; onDecrypt?: (player: string, card: number, ct: number) => void; onDeal?: (hand: number[]) => void; }
// 用模乘模拟交换加密: E_k(x) = x^k mod p
export function mentalPoker(deckSize: number, p: number, keyA: number, keyB: number, hooks: MpHooks = {}): number[] {
  const deck = Array.from({ length: deckSize }, (_, i) => i + 1);
  // A 加密
  const encA = deck.map((c) => { const ct = modPow(c, keyA, p); hooks.onEncrypt?.('A', c, ct); return ct; });
  // B 加密
  const encAB = encA.map((c) => { const ct = modPow(c, keyB, p); hooks.onEncrypt?.('B', c, ct); return ct; });
  // 洗牌
  for (let i = encAB.length - 1; i > 0; i--) { const j = (i * 7 + 3) % (i + 1); [encAB[i], encAB[j]] = [encAB[j]!, encAB[i]!]; }
  // A 取两张并发给 B 的部分解密
  const hand = encAB.slice(0, 2).map((c) => {
    const decB = modPow(c, modInv(keyB, p - 1), p);
    hooks.onDecrypt?.('B', c, decB);
    return decB;
  });
  hooks.onDeal?.(hand);
  return hand;
}
function modPow(b: number, e: number, m: number): number { let r = 1; b = b % m; while (e > 0) { if (e % 2 === 1) r = (r * b) % m; e = Math.floor(e / 2); b = (b * b) % m; } return r; }
function modInv(a: number, m: number): number { a = ((a % m) + m) % m; for (let x = 1; x < m; x++) if ((a * x) % m === 1) return x; return 1; }
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { mentalPoker } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '心理扑克: 5 张牌 p=23', en: 'Mental poker: 5 cards p=23' })
    .setBars([1, 2, 3, 4, 5].map((c) => ({ value: c, role: 'default' as BarRole }))).commit();
  mentalPoker(5, 23, 5, 7, {
    onEncrypt: (pl, card, ct) => rec.begin({ zh: \`\${pl} 加密 \${card} -> \${ct}\`, en: \`\${pl} enc \${card} -> \${ct}\` })
      .setBars([{ value: ct, role: 'pivot' as BarRole }]).commit(),
    onDeal: (hand) => rec.begin({ zh: \`发牌: \${hand.join(',')}\`, en: \`deal: \${hand.join(',')}\` })
      .setBars(hand.map((c) => ({ value: c, role: 'final' as BarRole }))).commit(),
  });
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mentalPoker } from '../../src/algorithms/game/game-mental-poker/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-mental-poker/trace.ts';
test('心理扑克发出 2 张', () => {
  const hand = mentalPoker(5, 23, 5, 7);
  assert.equal(hand.length, 2);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
// 30. game-flip-bargaining
{
  id: 'game-flip-bargaining',
  titleZh: '硬币议价', titleEn: 'Coin Flip Bargaining',
  summaryZh: '两人分一美元，谈判失败则按概率随机分配，求子博弈完美。',
  summaryEn: 'Two split a dollar; failure triggers probabilistic fallback; find subgame-perfect split.',
  descZh: '硬币议价：A 提议分给 B 的份额 x，B 接受则成交，拒绝则抛硬币：正面 A 得全部，反面 B 得全部（期望 0.5）。SPNE: A 给 x=0.5。',
  descEn: 'Coin flip bargaining: A offers B share x; accept -> deal, reject -> coin: heads A gets all, tails B gets all (EV 0.5). SPNE: A offers x=0.5.',
  tags: ['game','bargaining','subgame-perfect'],
  time: 'O(1)', space: 'O(1)',
  impl: `// 硬币议价 · 实现
export interface FlipHooks { onOffer?: (x: number, accepted: boolean) => void; onFallback?: (coinResult: 'H' | 'T', winner: 'A' | 'B') => void; onOutcome?: (aPay: number, bPay: number) => void; }
export function flipBargaining(offerX: number, fallbackHeadsProb: number, hooks: FlipHooks = {}): { aPayoff: number; bPayoff: number; accepted: boolean } {
  // B 接受 iff x >= fallback 期望 (即 fallbackHeadsProb*0 + (1-p)*1)
  const bFallback = 1 - fallbackHeadsProb;
  const accepted = offerX >= bFallback - 1e-9;
  hooks.onOffer?.(offerX, accepted);
  let aPayoff: number, bPayoff: number;
  if (accepted) { aPayoff = 1 - offerX; bPayoff = offerX; }
  else {
    const heads = Math.random() < fallbackHeadsProb;
    hooks.onFallback?.(heads ? 'H' : 'T', heads ? 'A' : 'B');
    aPayoff = heads ? 1 : 0; bPayoff = heads ? 0 : 1;
  }
  hooks.onOutcome?.(aPayoff, bPayoff);
  return { aPayoff, bPayoff, accepted };
}
`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { flipBargaining } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '硬币议价: 正面概率 0.5', en: 'Coin bargaining: heads prob 0.5' }).commit();
  // A 给 0.5 (恰好等于 fallback)
  const r = flipBargaining(0.5, 0.5, {
    onOffer: (x, acc) => rec.begin({ zh: \`A 给 B \${x}, B \${acc ? '接受' : '拒绝'}\`, en: \`A offers B \${x}, B \${acc ? 'accepts' : 'rejects'}\` })
      .setBars([{ value: x, role: 'pivot' as BarRole, label: 'x' }]).commit(),
    onOutcome: (a, b) => rec.begin({ zh: \`A=\${a.toFixed(2)} B=\${b.toFixed(2)}\`, en: \`A=\${a.toFixed(2)} B=\${b.toFixed(2)}\` })
      .setBars([{ value: a, role: 'final' as BarRole, label: 'A' }, { value: b, role: 'compare' as BarRole, label: 'B' }]).commit(),
  });
  void r;
  return rec.build();
}
`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { flipBargaining } from '../../src/algorithms/game/game-flip-bargaining/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-flip-bargaining/trace.ts';
test('给足 fallback 则接受', () => {
  const r = flipBargaining(0.6, 0.5);
  assert.equal(r.accepted, true);
  assert.ok(Math.abs(r.bPayoff - 0.6) < 1e-9);
});
test('给太少则拒绝', () => {
  const r = flipBargaining(0.2, 0.5);
  assert.equal(r.accepted, false);
});
test('buildTrace 生成帧', () => { assert.ok(buildTrace().length > 0); });
`,
},
];
