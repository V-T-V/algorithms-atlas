import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { jenkins, type JenkinsHooks } from './impl.ts';

export const DEFAULT_INPUT = 'hello';
function hex8(n: number): string {
  return '0x' + (n >>> 0).toString(16).padStart(8, '0');
}

export function buildTrace(input: string | readonly number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const disp = typeof input === 'string' ? `"${input}"` : `[${input.join(',')}]`;
  const steps: Array<{ i: number; c: number; hash: number }> = [];
  let finalHash = 0;
  rec
    .begin({ zh: `输入 ${disp}`, en: `Input ${disp}` })
    .setAux([{ label: '初始', value: '0', role: 'frontier' as BarRole }])
    .commit();
  const hooks: JenkinsHooks = {
    onByte: (i, c, hash) => steps.push({ i, c, hash }),
    onFinalize: (h) => {
      finalHash = h;
    },
  };
  const result = jenkins(input, hooks);
  for (const s of steps) {
    rec
      .begin({
        zh: `byte[${s.i}]='${String.fromCharCode(s.c)}' → ${hex8(s.hash)}`,
        en: `byte[${s.i}] → ${hex8(s.hash)}`,
      })
      .setAux([{ label: 'hash', value: hex8(s.hash), role: 'final' as BarRole }])
      .commit();
  }
  void finalHash;
  rec
    .begin({ zh: `终态混合后 hash = ${hex8(result)}`, en: `Finalized hash = ${hex8(result)}` })
    .setAux([{ label: 'hash', value: hex8(result), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
