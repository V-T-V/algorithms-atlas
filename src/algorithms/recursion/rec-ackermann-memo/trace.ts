import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { AckermannMemo } from './impl.ts';

export const DEFAULT_M = 2;
export const DEFAULT_N = 3;

export function buildTrace(opts: { m?: number; n?: number } = {}): Frame[] {
  const m = opts.m ?? DEFAULT_M;
  const n = opts.n ?? DEFAULT_N;
  const rec = new TraceRecorder();

  rec
    .begin({ zh: `初始化 A(${m},${n})`, en: `Init A(${m},${n})` })
    .setAux([{ label: '输入', value: `A(${m},${n})`, role: 'compare' as BarRole }])
    .commit();

  const ack = new AckermannMemo({
    onMemoHit: (mm, nn) => {
      rec
        .begin({ zh: `缓存命中 A(${mm},${nn})`, en: `cache hit A(${mm},${nn})` })
        .setAux([{ label: '命中', value: `A(${mm},${nn})`, role: 'final' as BarRole }])
        .commit();
    },
  });
  const result = ack.compute(m, BigInt(n));

  rec
    .begin({ zh: `完成 A(${m},${n})=${result}`, en: `Done A(${m},${n})=${result}` })
    .setAux([
      { label: '结果', value: result.toString(), role: 'final' as BarRole },
      { label: '调用数', value: String(ack.stats.calls), role: 'compare' as BarRole },
      { label: '命中数', value: String(ack.stats.hits), role: 'compare' as BarRole },
    ])
    .commit();
  return rec.build();
}
