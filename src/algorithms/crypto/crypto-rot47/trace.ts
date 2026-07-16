// ROT47 密码 · 录制帧序列
import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { rot47, type Rot47Hooks } from './impl.ts';

export const DEFAULT_INPUT = 'Hello, World! 123';

export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();

  rec
    .begin({ zh: `ROT47 处理 "${input}"`, en: `ROT47 on "${input}"` })
    .setAux([{ label: '区间', value: 'ASCII 33-126', role: 'pivot' }])
    .commit();

  const hooks: Rot47Hooks = {
    onChar: (i, original, shifted) => {
      rec
        .begin({
          zh: `位置 ${i}: ${original} → ${shifted}`,
          en: `Pos ${i}: ${original} → ${shifted}`,
        })
        .setAux([
          { label: '原', value: original, role: 'compare' },
          { label: '新', value: shifted, role: 'final' },
        ])
        .commit();
    },
  };

  const result = rot47(input, hooks);

  rec
    .begin({ zh: `完成：${result}`, en: `Done: ${result}` })
    .setAux([{ label: '密文', value: result, role: 'final' }])
    .commit();

  return rec.build();
}
