// ROT-N 旋转密码 · 录制帧序列
import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { rotN, type RotNHooks } from './impl.ts';

export const DEFAULT_INPUT = { text: 'Hello, World!', n: 13 };

export function buildTrace(input: { text: string; n: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { text, n } = input;

  rec
    .begin({ zh: `ROT-${n} 处理 "${text}"`, en: `ROT-${n} on "${text}"` })
    .setAux([{ label: '位移', value: String(n), role: 'pivot' }])
    .commit();

  const hooks: RotNHooks = {
    onChar: (i, original, shifted) => {
      rec
        .begin({
          zh: `位置 ${i}: ${original} → ${shifted}`,
          en: `Pos ${i}: ${original} → ${shifted}`,
        })
        .setAux([
          { label: '原字符', value: original, role: 'compare' },
          { label: '结果', value: shifted, role: 'final' },
        ])
        .commit();
    },
  };

  const result = rotN(text, n, hooks);

  rec
    .begin({ zh: `完成：${result}`, en: `Done: ${result}` })
    .setAux([{ label: '密文', value: result, role: 'final' }])
    .commit();

  return rec.build();
}
