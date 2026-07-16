// 直线一般式转法线式 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { toNormalForm } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '输入 ax+by+c', en: 'ax+by+c' }).commit();
  rec
    .begin({ zh: '法线式', en: 'normal form' })
    .setAux([
      {
        label: '法线式',
        value: JSON.stringify(toNormalForm({ a: 3, b: 4, c: -10 })),
        role: 'final' as BarRole,
      },
    ])
    .commit();
  return rec.build();
}
