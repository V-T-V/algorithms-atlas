// =============================================================================
// 迭代加深搜索 · 录制帧序列
// 用 setAux 以表格形式展示每层的 {深度, 值, 节点数, 最佳走法}；
// 用 setBars 展示每层访问节点数（随深度指数增长）。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildTree, iterativeDeepening, type IdHooks } from './impl.ts';

export const DEFAULT_UTILITIES: number[] = [3, 5, 2, 9, 1, 7, 4, 6, 8];
export const DEFAULT_BRANCHING: number = 3;
export const DEFAULT_MAX_DEPTH: number = 2;

export function buildTrace(
  utilities: number[] = DEFAULT_UTILITIES,
  branching: number = DEFAULT_BRANCHING,
  maxDepth: number = DEFAULT_MAX_DEPTH,
): Frame[] {
  const rec = new TraceRecorder();
  const root = buildTree(utilities, branching);

  rec
    .begin({
      zh: `初始博弈树（${utilities.length} 叶，分支 ${branching}），将从深度 1 加深到 ${maxDepth}`,
      en: `Game tree (${utilities.length} leaves, branching ${branching}), deepening from 1 to ${maxDepth}`,
    })
    .setAux([{ label: '待搜', value: `${maxDepth} 层`, role: 'pivot' }])
    .commit();

  const history: Array<{ depth: number; value: number; nodes: number; bestMove: number }> = [];

  const renderFrame = (note: { zh: string; en: string }): void => {
    const bars = history.map((h) => ({
      value: h.nodes,
      role: (h.depth === history[history.length - 1]?.depth ? 'final' : 'sorted') as BarRole,
      label: `d=${h.depth}`,
    }));
    const aux = history.map((h) => ({
      label: `深度 ${h.depth}`,
      value: `值=${h.value} 节点=${h.nodes} 走法=${h.bestMove}`,
      role: (h.depth === history[history.length - 1]?.depth ? 'final' : 'frontier') as BarRole,
    }));
    rec.begin(note).setBars(bars).setAux(aux).commit();
  };

  const hooks: IdHooks = {
    onDepthEnd: (depth, value, nodes) => {
      // 这里 bestMove 我们从结果里取不到，重新算一次（简单：遍历根子节点取深 d-1）
      // 为简洁，trace 内部用一个本地最佳走法：取 history 上一层后再补
      // 这里改为：在 onDepthEnd 之后由外层结果填。简化：先记 0，最终覆盖。
      history.push({ depth, value, nodes, bestMove: -1 });
      renderFrame({
        zh: `深度 ${depth} 完成：值=${value}，访问节点 ${nodes}`,
        en: `Depth ${depth} done: value=${value}, nodes visited ${nodes}`,
      });
    },
  };

  const result = iterativeDeepening(root, maxDepth, undefined, hooks);

  // 用最终结果覆盖每层 bestMove
  for (let i = 0; i < result.history.length; i++) {
    history[i]!.bestMove = result.history[i]!.bestMove;
  }

  // 终态帧
  const finalBars = history.map((h) => ({
    value: h.nodes,
    role: 'final' as BarRole,
    label: `d=${h.depth}`,
  }));
  rec
    .begin({
      zh: `完成：达到深度 ${result.depth}，最终值=${result.score}，最佳走法=${result.bestMove}${result.timedOut ? '（超时）' : ''}`,
      en: `Done: reached depth ${result.depth}, final value=${result.score}, best move=${result.bestMove}${result.timedOut ? ' (timed out)' : ''}`,
    })
    .setBars(finalBars)
    .setAux(
      history.map((h) => ({
        label: `深度 ${h.depth}`,
        value: `值=${h.value} 节点=${h.nodes} 走法=${h.bestMove}`,
        role: 'final' as BarRole,
      })),
    )
    .commit();

  return rec.build();
}
