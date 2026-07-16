// 递减字符串拆分 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { greedySplit2 } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 's="1234"', en: 's="1234"' }).commit();
  const r = greedySplit2('1234', {
    onPick: (i, v) => rec.begin({ zh: `取到 ${i}：${v}`, en: `Up to ${i}: ${v}` }).commit(),
  });
  rec
    .begin({
      zh: `ok=${r.ok} pieces=${r.pieces.map(String).join(',')}`,
      en: `ok=${r.ok} pieces=${r.pieces.map(String).join(',')}`,
    })
    .setAux([{ label: '答案', value: r.pieces.map(String).join(','), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
