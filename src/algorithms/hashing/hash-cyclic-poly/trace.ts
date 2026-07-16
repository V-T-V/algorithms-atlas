import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { cyclicPoly } from './impl.ts';

export const DEFAULT_INPUT = 'abrabadabra';
function hex16(n: bigint): string {
  return '0x' + n.toString(16).padStart(16, '0');
}

export function buildTrace(input: string | readonly number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const windowSize = 3;
  const disp = typeof input === 'string' ? `"${input}"` : `[${input.join(',')}]`;
  rec
    .begin({ zh: `输入 ${disp}，窗口 ${windowSize}`, en: `Input ${disp}, window ${windowSize}` })
    .setAux([{ label: '窗口', value: String(windowSize), role: 'pivot' as BarRole }])
    .commit();
  let finalHash = 0n;
  const hooks = {
    onInit: (hash: bigint) =>
      rec
        .begin({ zh: `初始 hash = ${hex16(hash)}`, en: `Initial hash = ${hex16(hash)}` })
        .setAux([{ label: 'hash', value: hex16(hash), role: 'frontier' as BarRole }])
        .commit(),
    onRoll: (oldByte: number, newByte: number, hash: bigint, position: number) =>
      rec
        .begin({
          zh: `位置 ${position}：滑出 ${oldByte}，滑入 ${newByte}`,
          en: `Pos ${position}: out ${oldByte}, in ${newByte}`,
        })
        .setAux([{ label: 'hash', value: hex16(hash), role: 'compare' as BarRole }])
        .commit(),
    onResult: (hash: bigint) => {
      finalHash = hash;
    },
  };
  cyclicPoly(input, windowSize, hooks);
  rec
    .begin({ zh: `最终 hash = ${hex16(finalHash)}`, en: `Final hash = ${hex16(finalHash)}` })
    .setAux([{ label: 'hash', value: hex16(finalHash), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
