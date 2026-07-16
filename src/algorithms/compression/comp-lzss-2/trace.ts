import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { lzssEncode } from './impl.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const input = 'ABABABABABC';
  const codes = input.split('').map((c) => c.charCodeAt(0));
  rec
    .begin({ zh: 'LZSS', en: 'LZSS' })
    .setArray(
      codes,
      codes.map(() => 'default' as BarRole),
      [{ index: 0, label: 'pos' }],
    )
    .commit();
  let pos = 0;
  lzssEncode(input, 8, 3, {
    onEmit: (t) => {
      rec
        .begin({
          zh: t.flag ? `emit match d=${t.distance} l=${t.length}` : `emit literal ${t.literal}`,
          en: '',
        })
        .setArray(
          codes,
          codes.map(
            (_, i) =>
              (i >= pos && (t.flag ? i < pos + (t.length ?? 0) : i === pos)
                ? 'swap'
                : 'default') as BarRole,
          ),
          [{ index: pos, label: 'pos' }],
        )
        .commit();
      pos += t.flag ? (t.length ?? 0) : 1;
    },
  });
  return rec.build();
}
