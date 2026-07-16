// 解锁模式数 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { btNumberOfPatterns, type BtNumberOfPatternsHooks } from './impl.ts';

export const DEFAULT_INPUT = { m: 1, n: 2 };

export function buildTrace(input: { m: number; n: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { m, n } = input;

  rec
    .begin({
      zh: `统计长度 [${m},${n}] 的解锁模式数`,
      en: `Count unlock patterns of length [${m},${n}]`,
    })
    .setAux([{ label: 'range', value: `[${m},${n}]`, role: 'pivot' }])
    .commit();

  const hooks: BtNumberOfPatternsHooks = {
    onCount: (len, c) => {
      rec
        .begin({ zh: `长度 ${len} 发现第 ${c} 个`, en: `Length ${len}: #${c} found` })
        .setAux([{ label: `len=${len}`, value: String(c), role: 'final' as BarRole }])
        .commit();
    },
  };

  const result = btNumberOfPatterns(m, n, hooks);

  rec
    .begin({ zh: `完成：共 ${result} 个模式`, en: `Done: ${result} patterns` })
    .setBars([{ value: result, role: 'final' as BarRole }])
    .setAux([{ label: '总数', value: String(result), role: 'final' }])
    .commit();

  return rec.build();
}
