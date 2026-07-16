// 扩展埃特巴什密码 · 录制帧序列
import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { atbashExtended, type AtbashExtHooks } from './impl.ts';

export const DEFAULT_INPUT = 'Hello Z3!';

export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  rec
    .begin({ zh: `Atbash 扩展处理 "${input}"`, en: `Extended Atbash on "${input}"` })
    .setAux([{ label: '映射', value: 'A↔Z 0↔9', role: 'pivot' }])
    .commit();

  const hooks: AtbashExtHooks = {
    onChar: (i, original, mapped) => {
      rec
        .begin({
          zh: `位置 ${i}: ${original} → ${mapped}`,
          en: `Pos ${i}: ${original} → ${mapped}`,
        })
        .setAux([
          { label: '原', value: original, role: 'compare' },
          { label: '新', value: mapped, role: 'final' },
        ])
        .commit();
    },
  };

  const result = atbashExtended(input, hooks);

  rec
    .begin({ zh: `完成：${result}`, en: `Done: ${result}` })
    .setAux([{ label: '密文', value: result, role: 'final' }])
    .commit();

  return rec.build();
}
