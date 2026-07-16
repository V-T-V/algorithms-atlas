// =============================================================================
// 蒙特卡洛树搜索 · 录制帧序列
// 用 setTree 展示搜索树（节点 value 显示访问次数与平均奖励），setAux 显示统计。
// 固定种子保证可复现。
// =============================================================================

import type { BarRole, Frame, TreeNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { mcts, makeLcg, defaultDomain, type Domain, type MCNode, type Rng } from './impl.ts';

export const DEFAULT_ARMS = 3;
export const DEFAULT_ITERATIONS = 30;
export const DEFAULT_SEED = 42;

/** 把内部 MCNode 树转成可视化 TreeNode。 */
function toViz(node: MCNode, highlightPath: Set<string>, pathId: string): TreeNode {
  const avg = node.visits > 0 ? (node.totalReward / node.visits).toFixed(2) : '—';
  const role: BarRole = highlightPath.has(pathId)
    ? 'final'
    : node.visits > 0
      ? 'frontier'
      : 'default';
  const label = node.parent === null ? 'root' : `a=${node.state}`;
  return {
    id: pathId || 'root',
    value: `${label}\nv=${node.visits} μ=${avg}`,
    role,
    children: node.children.map((c, i) => toViz(c, highlightPath, `${pathId}/${i}`)),
  };
}

/** 收集每条根→子节点的统计到 aux。 */
function statsAux(root: MCNode): Array<{ label: string; value: string; role?: BarRole }> {
  const out = root.children.map((ch, i) => {
    const avg = ch.visits > 0 ? (ch.totalReward / ch.visits).toFixed(3) : '—';
    return {
      label: `动作 ${i}`,
      value: `v=${ch.visits} μ=${avg}`,
      role: (ch.visits > 0 ? 'frontier' : 'default') as BarRole,
    };
  });
  return out;
}

/** 录制演示帧序列。 */
export function buildTrace(
  arms: number = DEFAULT_ARMS,
  iterations: number = DEFAULT_ITERATIONS,
  seed: number = DEFAULT_SEED,
): Frame[] {
  const rec = new TraceRecorder();
  const domain: Domain = defaultDomain(arms);
  const rng: Rng = makeLcg(seed);

  // 先做一棵空树，逐步重建以便每帧渲染当前树
  const root: MCNode = {
    state: -1,
    parent: null,
    children: [],
    visits: 0,
    totalReward: 0,
    untriedActions: [...domain.rootActions],
  };

  const highlight: Set<string> = new Set();
  let iterCounter = 0;

  const snapshot = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setTree(toViz(root, highlight, ''))
      .setAux([
        { label: '迭代', value: `${iterCounter}/${iterations}`, role: 'pivot' },
        ...statsAux(root),
      ])
      .commit();
    highlight.clear();
  };

  snapshot({
    zh: `根节点有 ${arms} 个可选动作，预算 ${iterations} 次迭代，种子 ${seed}`,
    en: `${arms} actions at root, ${iterations} iterations budget, seed ${seed}`,
  });

  // 为了能逐帧渲染，我们重新实现一遍迭代循环，但每步调 snapshot。
  // 这里复用 mcts 的钩子来驱动渲染——但 mcts 内部会建自己的树。
  // 因此我们直接用 mcts 跑完后渲染若干「阶段」帧，并在过程中用钩子记录高亮路径。
  // 为获得逐步树，改为：自己跑迭代（与 impl 逻辑一致），每步 snapshot。
  const exploreC = Math.SQRT2;
  const pathOf = (node: MCNode): number[] => {
    const p: number[] = [];
    let cur: MCNode | null = node;
    while (cur && cur.parent !== null) {
      p.unshift(cur.state);
      cur = cur.parent;
    }
    return p;
  };

  for (iterCounter = 1; iterCounter <= iterations; iterCounter++) {
    // 1. Selection
    let node = root;
    const selPath: number[] = [];
    while (node.untriedActions.length === 0 && node.children.length > 0) {
      let best = node.children[0]!;
      let bestScore = -Infinity;
      let bestIdx = 0;
      node.children.forEach((ch, i) => {
        let s: number;
        if (ch.visits === 0) s = Infinity;
        else {
          const exploit = ch.totalReward / ch.visits;
          const explore = exploreC * Math.sqrt(Math.log(node.visits || 1) / ch.visits);
          s = exploit + explore;
        }
        if (s > bestScore) {
          bestScore = s;
          best = ch;
          bestIdx = i;
        }
      });
      node = best;
      selPath.push(bestIdx);
    }
    // 标记选中路径
    {
      let id = '';
      highlight.add(id);
      for (const idx of selPath) {
        id += `/${idx}`;
        highlight.add(id);
      }
    }

    // 2. Expansion
    if (node.untriedActions.length > 0) {
      const action = node.untriedActions.shift()!;
      const childPath = pathOf(node).concat(action);
      const childActions = domain.nextActions(childPath);
      const child: MCNode = {
        state: action,
        parent: node,
        children: [],
        visits: 0,
        totalReward: 0,
        untriedActions: [...childActions],
      };
      node.children.push(child);
      node = child;
      // 标记新扩展节点
      highlight.add(selPath.concat(node.parent ? [] : []).join('/'));
    }

    // 3. Simulation
    const simPath = pathOf(node);
    const reward = domain.simulate(simPath, rng);

    // 4. Backprop
    let cur: MCNode | null = node;
    while (cur !== null) {
      cur.visits++;
      cur.totalReward += reward;
      cur = cur.parent;
    }

    snapshot({
      zh: `迭代 ${iterCounter}：选中路径 [${selPath.join(',')}]，扩展新节点，rollout 奖励 ${reward.toFixed(2)}`,
      en: `Iter ${iterCounter}: selected [${selPath.join(',')}], expanded a node, rollout reward ${reward.toFixed(2)}`,
    });
  }

  // 终态：用 mcts 跑一遍得到推荐动作（与上面的手动迭代等价，这里用于最终统计）
  const finalResult = mcts(domain, iterations, makeLcg(seed));
  const bestAvg = (() => {
    let best = finalResult.root.children[0] ?? null;
    for (const ch of finalResult.root.children) {
      if (!best || ch.visits > best.visits) best = ch;
    }
    return best && best.visits > 0 ? (best.totalReward / best.visits).toFixed(3) : '—';
  })();

  rec
    .begin({
      zh: `完成：推荐动作 = ${finalResult.bestAction}（平均奖励 ${bestAvg}）`,
      en: `Done: best action = ${finalResult.bestAction} (avg reward ${bestAvg})`,
    })
    .setTree(
      toViz(
        finalResult.root,
        new Set([
          `/${finalResult.root.children.findIndex((c) => c.state === finalResult.bestAction)}`,
        ]),
        '',
      ),
    )
    .setAux([
      { label: '推荐', value: `动作 ${finalResult.bestAction}`, role: 'final' },
      { label: '平均奖励', value: String(bestAvg), role: 'final' },
      ...statsAux(finalResult.root),
    ])
    .commit();

  return rec.build();
}
