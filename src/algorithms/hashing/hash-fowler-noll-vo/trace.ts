import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { fnv1a64, type Fnv64Hooks } from './impl.ts';

export const DEFAULT_INPUT = 'hello';
function hex16(n: bigint): string {
  return '0x' + n.toString(16).padStart(16, '0');
}

export function buildTrace(input: string | readonly number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const bytes = typeof input === 'string' ? Array.from(new TextEncoder().encode(input)) : input;
  const disp = typeof input === 'string' ? `"${input}"` : `[${input.join(',')}]`;
  rec
    .begin({
      zh: `输入 ${disp}（${bytes.length} 字节）`,
      en: `Input ${disp} (${bytes.length} bytes)`,
    })
    .setAux([{ label: '字节', value: String(bytes.length), role: 'pivot' as BarRole }])
    .commit();
  const steps: Array<{ i: number; c: number; hash: bigint }> = [];
  const hooks: Fnv64Hooks = { onByte: (i, c, hash) => steps.push({ i, c, hash }) };
  const result = fnv1a64(input, hooks);
  for (const s of steps) {
    rec
      .begin({
        zh: `byte[${s.i}]='${String.fromCharCode(s.c)}' → ${hex16(s.hash)}`,
        en: `byte[${s.i}]='${String.fromCharCode(s.c)}' → ${hex16(s.hash)}`,
      })
      .setAux([
        { label: '字符', value: String.fromCharCode(s.c), role: 'compare' as BarRole },
        { label: 'hash', value: hex16(s.hash), role: 'final' as BarRole },
      ])
      .commit();
  }
  rec
    .begin({ zh: `最终 hash = ${hex16(result)}`, en: `Final hash = ${hex16(result)}` })
    .setAux([
      { label: 'hash', value: hex16(result), role: 'final' as BarRole },
      { label: '十进制', value: result.toString(), role: 'default' as BarRole },
    ])
    .commit();
  return rec.build();
}
