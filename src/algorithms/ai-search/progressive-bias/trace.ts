// =============================================================================
// 渐进偏置（Progressive Bias）· 录制帧序列
// =============================================================================

import type { BarRole, Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import {
  progressiveBias,
  makeLcg,
  defaultDomain,
  DEFAULT_PB_CONFIG,
  type Domain,
  type PbConfig,
  type PbHooks,
  type PbNode,
  type Rng,
} from './impl.ts';

export const DEFAULT_ARMS = 3;
export const DEFAULT_ITERATIONS = 30;
export const DEFAULT_SEED = 42;
/** 领域启发式 H(a)：取一个与真实期望接近的先验。 */
export const DEFAULT_HEURISTIC = (a: number): number => Math.max(0, 1 - a * 0.2);

let vizCounter = 0;
function vizId(): string {
  vizCounter += 1;
  return `v${vizCounter}`;
}

function toViz(node: PbNode, highlight: Set<string>, heuristic: (a: number) => number): TreeNode {
  const id = `a${node.state}_${node.parent?.state ?? 'r'}`;
  const avg = node.visits > 0 ? (node.totalReward / node.visits).toFixed(2) : '—';
  const h = node.parent === null ? '' : `\nH=${heuristic(node.state).toFixed(2)}`;
  let role: BarRole = 'default';
  if (highlight.has(id)) role = 'final';
  else if (node.visits > 0) role = 'frontier';
  const label = node.parent === null ? 'root' : `a=${node.state}`;
  return {
    id: vizId(),
    value: `${label}\nv=${node.visits} μ=${avg}${h}`,
    role,
    children: node.children.map((c) => toViz(c, highlight, heuristic)),
  };
}

export function buildTrace(
  arms: number = DEFAULT_ARMS,
  iterations: number = DEFAULT_ITERATIONS,
  seed: number = DEFAULT_SEED,
): Frame[] {
  const rec = new TraceRecorder();
  vizCounter = 0;

  const domain: Domain = defaultDomain(arms);
  const rng: Rng = makeLcg(seed);
  const config: PbConfig = { ...DEFAULT_PB_CONFIG, iterations, heuristic: DEFAULT_HEURISTIC };

  const highlight = new Set<string>();
  let totalBias = 0;

  // 初始帧
  rec
    .begin({
      zh: `根有 ${arms} 动作，渐进偏置 W=${config.biasWeight}，迭代 ${iterations}`,
      en: `${arms} actions at root, progressive bias W=${config.biasWeight}, ${iterations} iters`,
    })
    .setAux([
      { label: '迭代', value: `0/${iterations}`, role: 'pivot' },
      { label: '累计偏置', value: '0', role: 'warn' },
    ])
    .commit();

  const hooks: PbHooks = {
    onIter: () => {
      // 迭代计数（统计已在 aux 中展示）
    },
    onSelect: (_a, bias) => {
      totalBias += bias;
    },
  };

  const result = progressiveBias(domain, config, rng, hooks);

  // 渲染若干阶段（每 1/4 一帧）
  const phases = [
    Math.floor(iterations / 4),
    Math.floor(iterations / 2),
    Math.floor((3 * iterations) / 4),
  ];
  for (const phase of phases) {
    const sub = progressiveBias(domain, { ...config, iterations: phase }, makeLcg(seed));
    highlight.clear();
    const bestIdx = sub.root.children.findIndex(
      (c) => c.visits === Math.max(...sub.root.children.map((x) => x.visits)),
    );
    if (bestIdx >= 0) highlight.add(`a${sub.root.children[bestIdx]!.state}_-1`);
    vizCounter = 0;
    rec
      .begin({
        zh: `进度：${phase}/${iterations}（初期偏置项较大，后期衰减）`,
        en: `Progress: ${phase}/${iterations} (bias dominant early, decays later)`,
      })
      .setTree(toViz(sub.root, highlight, config.heuristic))
      .setAux([
        { label: '迭代', value: `${phase}/${iterations}`, role: 'pivot' },
        { label: '累计偏置', value: totalBias.toFixed(2), role: 'warn' },
      ])
      .commit();
  }

  // 终态
  highlight.clear();
  const bestChild = result.root.children.find((c) => c.state === result.bestAction);
  if (bestChild) highlight.add(`a${bestChild.state}_-1`);
  const bestAvg =
    bestChild && bestChild.visits > 0 ? (bestChild.totalReward / bestChild.visits).toFixed(3) : '—';
  vizCounter = 0;
  rec
    .begin({
      zh: `完成：推荐动作 = ${result.bestAction}（平均 ${bestAvg}）`,
      en: `Done: best action = ${result.bestAction} (avg ${bestAvg})`,
    })
    .setTree(toViz(result.root, highlight, config.heuristic))
    .setAux([
      { label: '推荐', value: `动作 ${result.bestAction}`, role: 'final' },
      { label: '平均', value: String(bestAvg), role: 'final' },
      { label: '累计偏置', value: totalBias.toFixed(2), role: 'final' },
    ])
    .commit();

  return rec.build();
}
