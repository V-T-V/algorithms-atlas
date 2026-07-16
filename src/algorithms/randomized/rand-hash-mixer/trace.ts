// 哈希随机混合器 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { splitMixStream } from './impl.ts';

export const DEFAULT_INPUT = { seed: '1', n: 8 };

export function buildTrace(input: { seed: string; n: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const seed = BigInt(input.seed);
  const stream = splitMixStream(seed, input.n);
  // 取每个值的低 16 位作为可视化
  const low = stream.map((v) => Number(v & 0xffffn));

  rec
    .begin({
      zh: `splitMix64 流（seed=${input.seed}, n=${input.n}）`,
      en: `splitMix64 stream (seed=${input.seed}, n=${input.n})`,
    })
    .setBars(low.map((v) => ({ value: v, role: 'pivot' as BarRole })))
    .setAux([{ label: 'seed', value: input.seed, role: 'frontier' as BarRole }])
    .commit();

  // 累计显示
  for (let k = 1; k <= stream.length; k++) {
    rec
      .begin({ zh: `前 ${k} 个值`, en: `First ${k} values` })
      .setBars(
        low
          .slice(0, k)
          .map((v, i) => ({ value: v, role: (i === k - 1 ? 'compare' : 'sorted') as BarRole })),
      )
      .commit();
  }

  rec
    .begin({ zh: `完成（共 ${stream.length}）`, en: `Done (${stream.length})` })
    .setBars(low.map((v) => ({ value: v, role: 'sorted' as BarRole })))
    .commit();

  return rec.build();
}
