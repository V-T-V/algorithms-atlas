// =============================================================================
// 并行 MCTS · 录制帧序列
// 用单一并行 MCTS 运行 + worker 阶段性快照（基于实际 worker rollout）。
// =============================================================================

import type { BarRole, Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import {
  parallelMcts,
  makeLcg,
  defaultDomain,
  DEFAULT_PM_CONFIG,
  type Domain,
  type PMCNode,
  type ParallelMctsConfig,
  type Rng,
} from './impl.ts';

export const DEFAULT_ARMS = 3;
export const DEFAULT_ITERATIONS = 40;
export const DEFAULT_WORKERS = 4;
export const DEFAULT_SEED = 42;

let vizCounter = 0;
function vizId(): string {
  vizCounter += 1;
  return `v${vizCounter}`;
}

function toViz(node: PMCNode, highlight: Set<string>, vlSet: Set<string>): TreeNode {
  const id = String((node as PMCNode & { __id?: number }).__id ?? -1);
  const avg = node.visits > 0 ? (node.totalReward / node.visits).toFixed(2) : '—';
  let role: BarRole = 'default';
  if (highlight.has(id)) role = 'final';
  else if (vlSet.has(id)) role = 'warn';
  else if (node.visits > 0) role = 'frontier';
  const label = node.parent === null ? 'root' : `a=${node.state}`;
  const vlTag = node.virtualLoss > 0 ? `\nvl=${node.virtualLoss}` : '';
  return {
    id: vizId(),
    value: `${label}\nv=${node.visits} μ=${avg}${vlTag}`,
    role,
    children: node.children.map((c) => toViz(c, highlight, vlSet)),
  };
}

function assignIds(root: PMCNode): void {
  let counter = 0;
  const visit = (n: PMCNode): void => {
    for (const ch of n.children) {
      counter += 1;
      (ch as PMCNode & { __id: number }).__id = counter;
      visit(ch);
    }
  };
  visit(root);
}

export function buildTrace(
  arms: number = DEFAULT_ARMS,
  iterations: number = DEFAULT_ITERATIONS,
  workers: number = DEFAULT_WORKERS,
  seed: number = DEFAULT_SEED,
): Frame[] {
  const rec = new TraceRecorder();
  vizCounter = 0;

  const domain: Domain = defaultDomain(arms);
  const rng: Rng = makeLcg(seed);
  const config: ParallelMctsConfig = { ...DEFAULT_PM_CONFIG, workers, iterations };

  // 跟踪实时虚拟损失集合
  const vlSet = new Set<string>();
  let vlEvents = 0;
  let undoEvents = 0;

  const hooks = {
    onVirtualLoss: (id: number) => {
      vlSet.add(String(id));
      vlEvents += 1;
    },
    onUndoVirtualLoss: (id: number) => {
      vlSet.delete(String(id));
      undoEvents += 1;
    },
    onWorkerIter: () => {
      // 迭代计数（用于展示；当前实现仅跟踪虚拟损失事件）
    },
  };

  // 初始帧（空树）
  rec
    .begin({
      zh: `根有 ${arms} 动作，${workers} worker，预算 ${iterations}，virtual-loss 模拟树并行`,
      en: `${arms} actions, ${workers} workers, ${iterations} budget, virtual-loss tree parallel`,
    })
    .setAux([
      { label: '迭代', value: `0/${iterations}`, role: 'pivot' },
      { label: 'worker 数', value: String(workers), role: 'frontier' },
      { label: '虚拟损失', value: '0', role: 'warn' },
    ])
    .commit();

  // 真实运行
  const result = parallelMcts(domain, config, rng, hooks);
  const finalRoot = result.root;
  assignIds(finalRoot);

  // 每个 worker 完成时渲染一帧
  for (let w = 0; w < workers; w++) {
    vizCounter = 0;
    rec
      .begin({
        zh: `worker ${w} 完成 ${result.workerRollouts[w]} 次 rollout`,
        en: `worker ${w} finished ${result.workerRollouts[w]} rollouts`,
      })
      .setTree(toViz(finalRoot, new Set(), vlSet))
      .setAux([
        { label: 'worker', value: String(w), role: 'pivot' },
        { label: 'rollout', value: String(result.workerRollouts[w] ?? 0), role: 'frontier' },
        { label: '虚拟损失事件', value: String(vlEvents), role: 'warn' },
      ])
      .commit();
  }

  // 终态：高亮推荐动作
  const highlight = new Set<string>();
  const bestChildIdx = finalRoot.children.findIndex((c) => c.state === result.bestAction);
  if (bestChildIdx >= 0) highlight.add(String(bestChildIdx + 1));
  const bestAvg = (() => {
    const ch = finalRoot.children.find((c) => c.state === result.bestAction);
    return ch && ch.visits > 0 ? (ch.totalReward / ch.visits).toFixed(3) : '—';
  })();
  vizCounter = 0;
  rec
    .begin({
      zh: `完成：推荐动作 = ${result.bestAction}（平均奖励 ${bestAvg}）`,
      en: `Done: best action = ${result.bestAction} (avg reward ${bestAvg})`,
    })
    .setTree(toViz(finalRoot, highlight, new Set()))
    .setAux([
      { label: '推荐', value: `动作 ${result.bestAction}`, role: 'final' },
      { label: '平均奖励', value: String(bestAvg), role: 'final' },
      { label: '虚拟损失事件', value: String(vlEvents), role: 'final' },
      { label: '撤销事件', value: String(undoEvents), role: 'final' },
      ...result.workerRollouts.map((r, i) => ({
        label: `W${i}`,
        value: String(r),
        role: 'final' as BarRole,
      })),
    ])
    .commit();

  return rec.build();
}
