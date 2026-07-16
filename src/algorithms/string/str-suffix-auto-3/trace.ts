// =============================================================================
// SAM · 录制
import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { SuffixAutomaton3 } from './impl.ts';

export const DEFAULT_INPUT = 'abcbc';

export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const sam = new SuffixAutomaton3();

  for (let i = 0; i < input.length; i++) {
    sam.extend(input[i]!);
    rec
      .begin({
        zh: `加入 '${input[i]}'，状态数=${sam.size}`,
        en: `Add '${input[i]}', states=${sam.size}`,
      })
      .setBars(
        input.split('').map((ch, idx) => ({
          value: ch.charCodeAt(0),
          role: idx <= i ? 'compare' : 'default',
        })),
      )
      .setAux([
        { label: 'states', value: String(sam.size), role: 'pivot' },
        { label: 'last', value: String(sam.last), role: 'frontier' },
      ])
      .commit();
  }

  // 检查若干子串
  const checks = ['bc', 'abc', 'cbc', 'xyz'];
  for (const sub of checks) {
    const ok = sam.contains(sub);
    rec
      .begin({
        zh: `子串 '${sub}' ${ok ? '存在' : '不存在'}`,
        en: `Substring '${sub}' ${ok ? 'exists' : 'missing'}`,
      })
      .setBars(
        input.split('').map((ch) => ({ value: ch.charCodeAt(0), role: ok ? 'final' : 'default' })),
      )
      .setAux([{ label: `contains('${sub}')`, value: String(ok), role: ok ? 'final' : 'warn' }])
      .commit();
  }

  return rec.build();
}
