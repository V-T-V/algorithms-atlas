import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { cowPath } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  const target = 3;
  rec
    .begin({ zh: `奶牛路径：目标在右侧距离 ${target}`, en: `Cow path: target right at ${target}` })
    .setAux([{ label: 'target', value: String(target), role: 'pivot' as BarRole }])
    .commit();
  const r = cowPath(target, {
    onProbe: (d, dist, total) =>
      rec
        .begin({
          zh: `${d > 0 ? '右' : '左'}探 ${dist}，累计 ${total}`,
          en: `${d > 0 ? 'R' : 'L'} probe ${dist}, total ${total}`,
        })
        .setAux([
          { label: '方向', value: d > 0 ? 'R' : 'L', role: 'compare' as BarRole },
          { label: '累计', value: String(total), role: 'pivot' as BarRole },
        ])
        .commit(),
    onFound: (d, total) =>
      rec
        .begin({
          zh: `找到！方向 ${d > 0 ? '右' : '左'}，总 ${total}`,
          en: `Found! dir ${d > 0 ? 'R' : 'L'}, total ${total}`,
        })
        .setAux([{ label: '总步数', value: String(total), role: 'final' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: `竞争比 ${r.ratio.toFixed(2)}`, en: `Competitive ratio ${r.ratio.toFixed(2)}` })
    .setAux([{ label: '竞争比', value: r.ratio.toFixed(2), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
