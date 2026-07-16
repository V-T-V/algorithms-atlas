import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildTree, findTilt } from './impl.ts';
export const DEFAULT_INPUT = [1, 2, 3];
export function buildTrace(input: Array<number | null> = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const root = buildTree(input);
  rec.begin({ zh: '求坡度', en: 'Find tilt' }).commit();
  const t = findTilt(root, {
    onNode: (v, tilt) =>
      rec
        .begin({ zh: '节点 ' + v + ' 坡度 ' + tilt, en: 'node ' + v + ' tilt ' + tilt })
        .setAux([{ label: 'tilt', value: String(tilt), role: 'pivot' as BarRole }])
        .commit(),
  });
  rec
    .begin({ zh: '总坡度 = ' + t, en: 'total tilt = ' + t })
    .setAux([{ label: 'total', value: String(t), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
