import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { simHash, hammingDistance } from './impl.ts';

export const DEFAULT_INPUT = [1, 2, 3, 4, 5];

export function buildTrace(input: readonly number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec
    .begin({
      zh: `输入 ${input.length} 维向量 [\u00d7${input.join(',')}]`,
      en: `Input ${input.length}-dim vector [${input.join(',')}]`,
    })
    .setAux([{ label: '维度', value: String(input.length), role: 'pivot' as BarRole }])
    .commit();
  let finalHash = 0n;
  const hooks = {
    onDim: (i: number, value: number, projection: number, accum: number) => {
      if (i === input.length - 1) {
        rec
          .begin({ zh: `投影后累加 = ${accum}`, en: `After projection accum = ${accum}` })
          .setAux([{ label: 'accum', value: String(accum), role: 'compare' as BarRole }])
          .commit();
      }
    },
    onResult: (hash: bigint) => {
      finalHash = hash;
    },
  };
  simHash(input, 16, hooks);
  rec
    .begin({
      zh: `最终 SimHash = 0x${finalHash.toString(16)}`,
      en: `Final SimHash = 0x${finalHash.toString(16)}`,
    })
    .setAux([{ label: 'hash', value: '0x' + finalHash.toString(16), role: 'final' as BarRole }])
    .commit();
  const h2 = simHash(
    input.map((v) => v + 1),
    16,
  );
  const d = hammingDistance(finalHash, h2);
  rec
    .begin({ zh: `扰动后海明距离 = ${d}`, en: `Perturbed Hamming distance = ${d}` })
    .setAux([{ label: 'dist', value: String(d), role: 'sorted' as BarRole }])
    .commit();
  return rec.build();
}
