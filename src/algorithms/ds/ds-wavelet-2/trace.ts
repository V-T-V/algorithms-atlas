// =============================================================================
// 小波树 · 录制
import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { WaveletTree2 } from './impl.ts';

export const DEFAULT_INPUT = [5, 2, 8, 1, 9, 3, 7];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const wt = new WaveletTree2(input);

  rec
    .begin({ zh: '小波树构建完成', en: 'Wavelet tree built' })
    .setBars(input.map((x) => ({ value: x, role: 'default' })))
    .commit();

  // 查询区间第 1, 2, 3 小
  for (const k of [1, 4, 7]) {
    const v = wt.kth(0, input.length - 1, k);
    rec
      .begin({ zh: `全局第 ${k} 小 = ${v}`, en: `${k}-th smallest = ${v}` })
      .setBars(input.map((x) => ({ value: x, role: x === v ? 'pivot' : 'default' })))
      .setAux([{ label: `k=${k}`, value: String(v), role: 'pivot' }])
      .commit();
  }

  rec
    .begin({ zh: '查询结束', en: 'Done' })
    .setBars(input.map((x) => ({ value: x, role: 'final' })))
    .commit();

  return rec.build();
}
