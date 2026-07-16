// =============================================================================
// CDQ 分治 · 录制
import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { cdq3d, type Triple } from './impl.ts';

export const DEFAULT_INPUT: Triple[] = [
  { a: 1, b: 1, c: 1 },
  { a: 2, b: 2, c: 2 },
  { a: 3, b: 3, c: 3 },
  { a: 1, b: 2, c: 1 },
  { a: 2, b: 1, c: 2 },
];

export function buildTrace(input: Triple[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  const bars = input.map((t) => ({ value: t.a * 100 + t.b * 10 + t.c, role: 'default' as const }));
  rec.begin({ zh: '输入（编码 abc）', en: 'Input (encoded as abc)' }).setBars(bars).commit();

  let total = 0;
  total = cdq3d(input, {
    onMerge: (l, r, c) => {
      rec
        .begin({ zh: `合并 [${l},${r}]：新增 ${c} 对`, en: `Merge [${l},${r}]: +${c} pairs` })
        .setBars(
          input.map((_, idx) => ({
            value: idx,
            role: idx >= l && idx <= r ? 'swap' : 'default',
          })),
        )
        .setAux([{ label: 'pairs', value: String(c), role: 'frontier' }])
        .commit();
    },
  });

  rec
    .begin({ zh: `三维偏序对数 = ${total}`, en: `3D partial-order pairs = ${total}` })
    .setBars(bars.map((b) => ({ value: b.value, role: 'final' as const })))
    .setAux([{ label: 'total', value: String(total), role: 'final' }])
    .commit();

  return rec.build();
}
