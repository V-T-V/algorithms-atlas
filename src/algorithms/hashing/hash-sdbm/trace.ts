import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { sdbm, type SdbmHooks } from './impl.ts';

export const DEFAULT_INPUT = 'hello';
function hex8(n: number): string {
  return '0x' + (n >>> 0).toString(16).padStart(8, '0');
}

export function buildTrace(input: string | readonly number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const bytes = typeof input === 'string' ? Array.from(new TextEncoder().encode(input)) : input;
  const disp = typeof input === 'string' ? `"${input}"` : `[${input.join(',')}]`;
  const steps: Array<{ i: number; c: number; hash: number }> = [];
  rec
    .begin({
      zh: `输入 ${disp}（${bytes.length} 字节）`,
      en: `Input ${disp} (${bytes.length} bytes)`,
    })
    .setAux([{ label: '初始', value: '0', role: 'frontier' as BarRole }])
    .commit();
  const hooks: SdbmHooks = { onByte: (i, c, hash) => steps.push({ i, c, hash }) };
  const result = sdbm(input, hooks);
  for (const s of steps) {
    rec
      .begin({
        zh: `byte[${s.i}]='${String.fromCharCode(s.c)}' → ${hex8(s.hash)}`,
        en: `byte[${s.i}]='${String.fromCharCode(s.c)}' → ${hex8(s.hash)}`,
      })
      .setAux([{ label: 'hash', value: hex8(s.hash), role: 'final' as BarRole }])
      .commit();
  }
  rec
    .begin({
      zh: `最终 hash = ${hex8(result)} (${result})`,
      en: `Final hash = ${hex8(result)} (${result})`,
    })
    .setAux([
      { label: 'hash', value: hex8(result), role: 'final' as BarRole },
      { label: '十进制', value: String(result), role: 'default' as BarRole },
    ])
    .commit();
  return rec.build();
}
