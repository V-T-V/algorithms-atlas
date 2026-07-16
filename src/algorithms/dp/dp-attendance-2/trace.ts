// =============================================================================
// 学生出勤记录 II · 录制
import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { checkRecord, type AttendanceHooks } from './impl.ts';

export const DEFAULT_INPUT = 4;

export function buildTrace(n: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  let total = 1;

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setBars([{ value: total, role: 'frontier' }])
      .setAux([{ label: '合法方案数', value: String(total), role: 'pivot' }])
      .commit();
  };

  snap({ zh: `n=${n}`, en: `n=${n}` });

  const hooks: AttendanceHooks = {
    onDay: (i, t) => {
      total = t;
      snap({ zh: `i=${i + 1} 总方案=${t}`, en: `len=${i + 1} ways=${t}` });
    },
  };

  const ans = checkRecord(n, hooks);

  rec
    .begin({ zh: `答案=${ans}`, en: `ans=${ans}` })
    .setBars([{ value: ans, role: 'final' }])
    .setAux([{ label: '答案', value: String(ans), role: 'final' }])
    .commit();

  return rec.build();
}
