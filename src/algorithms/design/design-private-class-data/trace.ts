import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { Circle, CircleData } from './impl.ts';
export const DEFAULT_INPUT: any = { radius: 3, color: 'red' };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '私有数据', en: 'Private Data' }).commit();
  const c = new Circle(new CircleData(input.radius, input.color));
  rec
    .begin({ zh: c.describe(), en: 'describe' })
    .setAux([{ label: 'desc', value: c.describe(), role: 'compare' as BarRole }])
    .commit();
  const a = c.area();
  rec
    .begin({ zh: '面积 ' + a.toFixed(2), en: 'area' })
    .setAux([{ label: 'area', value: a.toFixed(2), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
