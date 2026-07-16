import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { tabulationHash } from './impl.ts';

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
  let finalHash = 0n;
  const hooks = {
    onByte: (position: number, byte: number, partialHash: bigint) =>
      rec
        .begin({
          zh: `位置 ${position}（字节 ${byte}）后部分 hash = ${hex16(partialHash)}`,
          en: `After pos ${position} (byte ${byte}) partial = ${hex16(partialHash)}`,
        })
        .setAux([{ label: '部分 hash', value: hex16(partialHash), role: 'compare' as BarRole }])
        .commit(),
    onResult: (hash: bigint) => {
      finalHash = hash;
    },
  };
  tabulationHash(input, hooks);
  rec
    .begin({ zh: `最终 hash = ${hex16(finalHash)}`, en: `Final hash = ${hex16(finalHash)}` })
    .setAux([{ label: 'hash', value: hex16(finalHash), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
