// 椭圆周长 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { ellipsePerimeter } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '输入半长轴 a 与半短轴 b', en: 'semi-axes a, b' }).commit();
  rec
    .begin({ zh: '拉马努金近似周长', en: 'Ramanujan perimeter' })
    .setAux([{ label: '周长', value: ellipsePerimeter(5, 3).toFixed(3), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
