// =============================================================================
// 数据流中位数 · 录制帧序列
// 通过 MedianFinder 的钩子，把 addNum/findMedian 过程录成 Frame[]。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { MedianFinder, type MedianFinderHooks } from './impl.ts';

export const DEFAULT_INPUT = [5, 2, 8, 1, 9, 3, 7, 4, 6];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  // 记录历史：每次 addNum 后的元素序列与当时的 median
  const history: number[] = [];
  let loSnap: number[] = [];
  let hiSnap: number[] = [];

  const render = (note: { zh: string; en: string }): void => {
    const loStr = loSnap.length ? loSnap.join(', ') : '—';
    const hiStr = hiSnap.length ? hiSnap.join(', ') : '—';
    rec
      .begin(note)
      .setBars(history.map((v) => ({ value: v, role: 'default' as BarRole })))
      .setAux([
        { label: '大顶堆 lo（较小半）', value: loStr, role: 'pivot' as BarRole },
        { label: '小顶堆 hi（较大半）', value: hiStr, role: 'frontier' as BarRole },
      ])
      .commit();
  };

  render({ zh: '初始：空数据流', en: 'Init: empty stream' });

  const hooks: MedianFinderHooks = {
    onBalance: (loSize, hiSize) => {
      void loSize;
      void hiSize;
    },
    onQuery: () => {},
  };

  const mf = new MedianFinder(hooks);

  for (let i = 0; i < input.length; i++) {
    const n = input[i]!;
    mf.addNum(n);
    history.push(n);
    loSnap = mf.loSnapshot();
    hiSnap = mf.hiSnapshot();
    const med = mf.findMedian();
    render({
      zh: `加入 ${n}（共 ${mf.total} 个），当前中位数 = ${med}`,
      en: `Add ${n} (${mf.total} total), median = ${med}`,
    });
  }

  const finalMedian = mf.findMedian();
  rec
    .begin({ zh: `完成：最终中位数 = ${finalMedian}`, en: `Done: final median = ${finalMedian}` })
    .setBars(history.map((v) => ({ value: v, role: 'final' as BarRole })))
    .setAux([{ label: '最终中位数', value: String(finalMedian), role: 'final' as BarRole }])
    .commit();

  return rec.build();
}
