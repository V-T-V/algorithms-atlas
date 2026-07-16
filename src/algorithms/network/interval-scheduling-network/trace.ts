// =============================================================================
// 区间调度转网络流 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { intervalScheduling, type IntervalInput, type IsnHooks } from './impl.ts';

export const DEFAULT_INPUT = {
  intervals: [
    { start: 0, end: 3 },
    { start: 1, end: 4 },
    { start: 2, end: 5 },
    { start: 3, end: 6 },
    { start: 4, end: 7 },
    { start: 0, end: 2 },
    { start: 5, end: 8 },
  ] as IntervalInput[],
  k: 2,
};

export function buildTrace(
  input: { intervals: IntervalInput[]; k: number } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { intervals, k } = input;

  const selected = new Set<number>();
  let step = 0;

  // 把区间转成 bars 显示
  const toBars = () =>
    intervals.map((it, i) => ({
      value: it.end - it.start,
      role: (selected.has(i) ? 'final' : 'default') as BarRole,
      label: `[${it.start},${it.end})`,
    }));

  const render = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setBars(toBars())
      .setAux([
        { label: '步数', value: String(step), role: 'pivot' as BarRole },
        { label: 'k（容量）', value: String(k), role: 'frontier' as BarRole },
        { label: '已选区间', value: String(selected.size), role: 'final' as BarRole },
      ])
      .commit();
  };

  render({
    zh: `初始 ${intervals.length} 个区间，每时刻最多选 ${k} 个`,
    en: `${intervals.length} intervals, k=${k}`,
  });

  const hooks: IsnHooks = {
    onBuildNetwork: (edges, nodeCount, source, sink) => {
      step += 1;
      const chainCount = edges.filter((e) => e.type === 'chain').length;
      const intervalEdgeCount = edges.filter((e) => e.type === 'interval').length;
      rec
        .begin({
          zh: `构造流网络：${nodeCount} 节点（源 ${source}，汇 ${sink}），链边 ${chainCount}（cap=${k}），区间边 ${intervalEdgeCount}（cap=1）`,
          en: `Build network: ${nodeCount} nodes, ${chainCount} chain edges (cap=${k}), ${intervalEdgeCount} interval edges (cap=1)`,
        })
        .setBars(toBars())
        .setAux([
          { label: '步数', value: String(step), role: 'pivot' as BarRole },
          { label: '节点数', value: String(nodeCount), role: 'frontier' as BarRole },
          { label: '链边', value: String(chainCount), role: 'frontier' as BarRole },
          { label: '区间边', value: String(intervalEdgeCount), role: 'frontier' as BarRole },
        ])
        .commit();
    },
    onAugment: (path, flow, total, sel) => {
      step += 1;
      selected.clear();
      sel.forEach((i) => selected.add(i));
      render({
        zh: `增广 ${path.length} 跳：流量 ${flow}（选中区#${sel[sel.length - 1] ?? '?'}），累计 ${total}`,
        en: `Augment ${path.length} hops: flow ${flow}, total ${total}`,
      });
    },
  };

  const result = intervalScheduling(intervals, k, hooks);
  selected.clear();
  result.forEach((i) => selected.add(i));

  rec
    .begin({
      zh: `完成：最多可选 ${result.length} 个区间`,
      en: `Done: max ${result.length} intervals selectable`,
    })
    .setBars(toBars())
    .setAux([
      { label: '最大选择数', value: String(result.length), role: 'final' as BarRole },
      { label: '选中索引', value: result.join(','), role: 'final' as BarRole },
    ])
    .commit();

  return rec.build();
}
