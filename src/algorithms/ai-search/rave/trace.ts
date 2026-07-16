// =============================================================================
// RAVE / AMAF · 录制帧序列
// =============================================================================

import type { BarRole, Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import {
  rave,
  makeLcg,
  defaultDomain,
  DEFAULT_RAVE_CONFIG,
  type Domain,
  type RaveConfig,
  type RaveNode,
  type Rng,
} from './impl.ts';

export const DEFAULT_ARMS = 3;
export const DEFAULT_ITERATIONS = 30;
export const DEFAULT_SEED = 42;

let vizCounter = 0;
function vizId(): string {
  vizCounter += 1;
  return `v${vizCounter}`;
}

function toViz(node: RaveNode, highlight: Set<string>): TreeNode {
  const id = `a${node.state}_${node.parent?.state ?? 'r'}`;
  const avg = node.visits > 0 ? (node.totalReward / node.visits).toFixed(2) : '—';
  const amafAvg = node.amafVisits > 0 ? (node.amafTotal / node.amafVisits).toFixed(2) : '—';
  let role: BarRole = 'default';
  if (highlight.has(id)) role = 'final';
  else if (node.visits > 0) role = 'frontier';
  else if (node.amafVisits > 0) role = 'warn';
  const label = node.parent === null ? 'root' : `a=${node.state}`;
  return {
    id: vizId(),
    value: `${label}\nv=${node.visits} μ=${avg}\nAMAF=${amafAvg}(${node.amafVisits})`,
    role,
    children: node.children.map((c) => toViz(c, highlight)),
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
  const config: RaveConfig = { ...DEFAULT_RAVE_CONFIG, iterations };

  const highlight = new Set<string>();
  let amafUpdates = 0;

  // 先渲染初始帧（空）
  rec
    .begin({
      zh: `根有 ${arms} 动作，RAVE 迭代预算 ${iterations}，K=${config.equivalenceParameter}`,
      en: `${arms} actions at root, RAVE budget ${iterations}, K=${config.equivalenceParameter}`,
    })
    .setAux([
      { label: '迭代', value: `0/${iterations}`, role: 'pivot' },
      { label: 'AMAF 更新', value: '0', role: 'warn' },
    ])
    .commit();

  // 真实运行
  const result = rave(domain, config, rng, {
    onIter: () => {
      // 迭代次数通过阶段帧另算，这里不累计
    },
    onAmafUpdate: () => {
      amafUpdates += 1;
    },
  });

  // 渲染若干阶段帧：每 1/4 进度一帧
  const phases = [
    Math.floor(iterations / 4),
    Math.floor(iterations / 2),
    Math.floor((3 * iterations) / 4),
  ];
  for (const phase of phases) {
    // 重新跑一次到 phase 步
    const sub = rave(domain, { ...config, iterations: phase }, makeLcg(seed));
    highlight.clear();
    const bestIdx = sub.root.children.findIndex(
      (c) => c.visits > 0 && c.visits === Math.max(...sub.root.children.map((x) => x.visits)),
    );
    if (bestIdx >= 0) {
      const id = `a${sub.root.children[bestIdx]!.state}_-1`;
      highlight.add(id);
    }
    vizCounter = 0;
    rec
      .begin({
        zh: `进度：${phase}/${iterations} 次迭代`,
        en: `Progress: ${phase}/${iterations} iterations`,
      })
      .setTree(toViz(sub.root, highlight))
      .setAux([
        { label: '迭代', value: `${phase}/${iterations}`, role: 'pivot' },
        { label: 'AMAF 更新（累计）', value: String(amafUpdates), role: 'warn' },
      ])
      .commit();
  }

  // 终态
  highlight.clear();
  const bestChild = result.root.children.find((c) => c.state === result.bestAction);
  if (bestChild) {
    const id = `a${bestChild.state}_-1`;
    highlight.add(id);
  }
  const bestAvg =
    bestChild && bestChild.visits > 0 ? (bestChild.totalReward / bestChild.visits).toFixed(3) : '—';
  vizCounter = 0;
  rec
    .begin({
      zh: `完成：推荐动作 = ${result.bestAction}（MCTS 平均 ${bestAvg}）`,
      en: `Done: best action = ${result.bestAction} (MCTS avg ${bestAvg})`,
    })
    .setTree(toViz(result.root, highlight))
    .setAux([
      { label: '推荐', value: `动作 ${result.bestAction}`, role: 'final' },
      { label: 'MCTS 平均', value: String(bestAvg), role: 'final' },
      { label: 'AMAF 更新', value: String(amafUpdates), role: 'final' },
    ])
    .commit();

  return rec.build();
}
