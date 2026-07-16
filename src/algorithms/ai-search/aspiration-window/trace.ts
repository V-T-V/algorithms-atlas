// =============================================================================
// 渴望窗口 · 录制帧序列
// 用 setAux 展示窗口 [α,β]、中心 prevBest、命中/失败与重搜；setBars 展示访问节点数对比。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import {
  aspirationSearch,
  buildTree,
  fullWindowSearch,
  type AwHooks,
  type AwNode,
} from './impl.ts';

export const DEFAULT_UTILITIES: number[] = [3, 5, 2, 9, 1, 7, 4, 6];
export const DEFAULT_BRANCHING: number = 2;

export function buildTrace(
  utilities: number[] = DEFAULT_UTILITIES,
  branching: number = DEFAULT_BRANCHING,
): Frame[] {
  const rec = new TraceRecorder();

  const root = buildTree(utilities, branching);
  const depth = Math.round(Math.log(utilities.length) / Math.log(branching));

  // 先用全宽求真实值与「上一轮最佳」
  const rootFull = buildTree([...utilities], branching);
  const trueValue = fullWindowSearch(rootFull, depth);
  // 假设上一轮最佳与真实值接近（±1 模拟迭代加深场景）
  const prevBest = trueValue;
  const window = 1;

  rec
    .begin({
      zh: `树搜索：上一轮最佳=${prevBest}，窗口=${window}，窄窗口 [${prevBest - window}, ${prevBest + window}]`,
      en: `Search: prev best=${prevBest}, window=${window}, narrow window [${prevBest - window}, ${prevBest + window}]`,
    })
    .setAux([
      { label: 'prevBest', value: String(prevBest), role: 'pivot' },
      { label: '窗口', value: String(window), role: 'frontier' },
      { label: 'α', value: String(prevBest - window), role: 'frontier' },
      { label: 'β', value: String(prevBest + window), role: 'frontier' },
    ])
    .commit();

  let visits = 0;
  let lastWide = false;

  const hooks: AwHooks = {
    onVisit: () => visits++,
    onSearch: (alpha, beta, wide) => {
      lastWide = wide;
      rec
        .begin({
          zh: `${wide ? '全宽重搜' : '窄窗口搜索'} [${alpha === -Infinity ? '−∞' : alpha}, ${beta === Infinity ? '+∞' : beta}]`,
          en: `${wide ? 'Full-window re-search' : 'Narrow-window search'} [${alpha === -Infinity ? '-inf' : alpha}, ${beta === Infinity ? '+inf' : beta}]`,
        })
        .setAux([
          { label: '访问', value: String(visits), role: 'pivot' },
          { label: 'α', value: alpha === -Infinity ? '−∞' : String(alpha), role: 'frontier' },
          { label: 'β', value: beta === Infinity ? '+∞' : String(beta), role: 'frontier' },
          {
            label: '窗口',
            value: lastWide ? '全宽' : '窄',
            role: lastWide ? ('warn' as BarRole) : ('frontier' as BarRole),
          },
        ])
        .commit();
    },
    onFail: (kind, value) => {
      rec
        .begin({
          zh: `${kind === 'high' ? 'fail-high' : 'fail-low'}（值=${value} 越界）→ 需重搜`,
          en: `${kind === 'high' ? 'fail-high' : 'fail-low'} (value=${value} out of bounds) → re-search needed`,
        })
        .setAux([
          { label: '失败', value: kind, role: 'warn' },
          { label: '越界值', value: String(value), role: 'warn' },
        ])
        .commit();
    },
  };

  const result = aspirationSearch(root, depth, prevBest, window, hooks);

  // 终态帧：对比窄窗口访问数 vs 全宽节点数。
  // 全宽节点数 = 树的总节点数（递归计数）。
  const countNodes = (n: AwNode): number => {
    if (!n.children || n.children.length === 0) return 1;
    return 1 + n.children.reduce((s, c) => s + countNodes(c), 0);
  };
  const fullVisits = countNodes(rootFull);

  rec
    .begin({
      zh: `完成：值=${result.value}，${result.hit ? '窗口命中 ✓' : `失败(${result.failKind})，重搜 ${result.researches} 次`}，访问 ${visits} 节点`,
      en: `Done: value=${result.value}, ${result.hit ? 'window hit' : `failed (${result.failKind}), ${result.researches} re-searches`}, visited ${visits} nodes`,
    })
    .setBars([
      { value: visits, role: (result.hit ? 'final' : 'warn') as BarRole, label: '渴望' },
      { value: fullVisits, role: 'sorted' as BarRole, label: '全宽' },
    ])
    .setAux([
      { label: '值', value: String(result.value), role: 'final' },
      {
        label: '命中',
        value: result.hit ? '是' : '否',
        role: result.hit ? ('final' as BarRole) : ('warn' as BarRole),
      },
      { label: '重搜', value: String(result.researches), role: 'warn' },
      { label: '渴望访问', value: String(visits), role: 'final' },
      { label: '全宽节点', value: String(fullVisits), role: 'sorted' },
    ])
    .commit();

  return rec.build();
}
