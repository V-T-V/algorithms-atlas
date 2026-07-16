import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { rollingHash } from './impl.ts';

export const DEFAULT_INPUT = 'abrabadabra';

export function buildTrace(input: string | readonly number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const windowSize = 3;
  const disp = typeof input === 'string' ? `"${input}"` : `[${input.join(',')}]`;
  rec
    .begin({ zh: `输入 ${disp}，窗口 ${windowSize}`, en: `Input ${disp}, window ${windowSize}` })
    .setAux([{ label: '窗口', value: String(windowSize), role: 'pivot' as BarRole }])
    .commit();
  let finalHash = 0;
  const hooks = {
    onInit: (hash: number) =>
      rec
        .begin({ zh: `初始 hash = ${hash}`, en: `Initial hash = ${hash}` })
        .setAux([{ label: 'hash', value: String(hash), role: 'frontier' as BarRole }])
        .commit(),
    onRoll: (oldByte: number, newByte: number, hash: number, position: number) =>
      rec
        .begin({
          zh: `位置 ${position}：滑出 ${oldByte}，滑入 ${newByte}，hash = ${hash}`,
          en: `Pos ${position}: out ${oldByte}, in ${newByte}, hash = ${hash}`,
        })
        .setAux([{ label: 'hash', value: String(hash), role: 'compare' as BarRole }])
        .commit(),
    onResult: (hash: number) => {
      finalHash = hash;
    },
  };
  rollingHash(input, windowSize, hooks);
  rec
    .begin({ zh: `最终 hash = ${finalHash}`, en: `Final hash = ${finalHash}` })
    .setAux([{ label: 'hash', value: String(finalHash), role: 'final' as BarRole }])
    .commit();
  return rec.build();
}
