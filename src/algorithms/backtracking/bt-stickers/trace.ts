import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { minStickers } from './impl.ts';
export const DEFAULT_INPUT = { stickers: ['with', 'example', 'science'], target: 'thehat' };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '贴纸拼 "' + input.target + '"', en: 'Spell "' + input.target + '"' }).commit();
  const m = minStickers(input.stickers, input.target, {
    onUse: (i) =>
      rec
        .begin({ zh: '用第 ' + i + ' 张', en: 'use sticker ' + i })
        .setAux([{ label: 'sticker', value: String(i), role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '最少 = ' + m, en: 'min = ' + m })
    .setAux([{ label: 'min', value: String(m), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
