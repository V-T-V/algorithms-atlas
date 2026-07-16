import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';

export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({ zh: '开始', en: 'Start' })
    .setAux([{ label: '状态', value: 'init', role: 'default' }])
    .commit();
  rec
    .begin({ zh: '完成', en: 'Done' })
    .setAux([{ label: '状态', value: 'done', role: 'final' }])
    .commit();
  return rec.build();
}
