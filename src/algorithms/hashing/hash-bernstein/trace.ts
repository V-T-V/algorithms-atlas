import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { bernstein, type BernsteinHooks } from './impl.ts';

export const DEFAULT_INPUT = 'hello';
function hex8(n: number): string {
  return '0x' + (n >>> 0).toString(16).padStart(8, '0');
}

export function buildTrace(input: string | readonly number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const disp = typeof input === 'string' ? `"${input}"` : `[${input.join(',')}]`;
  const steps: Array<{ i: number; c: number; hash: number }> = [];
  rec
    .begin({ zh: `输入 ${disp}`, en: `Input ${disp}` })
    .setAux([{ label: '初始', value: '5381', role: 'frontier' as BarRole }])
    .commit();
  const hooks: BernsteinHooks = { onByte: (i, c, hash) => steps.push({ i, c, hash }) };
  const result = bernstein(input, hooks);
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
    .begin({ zh: `最终 hash = ${hex8(result)}`, en: `Final hash = ${hex8(result)}` })
    .setAux([{ label: 'hash', value: hex8(result), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
