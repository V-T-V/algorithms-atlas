// 种子扩展（多个独立子流）· 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { extendSeeds } from './impl.ts';

export const DEFAULT_INPUT = { master: '12345', count: 6 };

export function buildTrace(input: { master: string; count: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const master = BigInt(input.master);

  rec
    .begin({
      zh: `扩展 ${input.count} 个子种子（master=${input.master}）`,
      en: `Extend ${input.count} subseeds (master=${input.master})`,
    })
    .setAux([{ label: 'master', value: input.master, role: 'pivot' }])
    .commit();

  const seeds = extendSeeds(master, input.count, 0x9e3779b97f4a7c15n, {
    onDerive: (i, sub) => {
      rec
        .begin({
          zh: `子种子[${i}] = ${sub.toString(16).slice(0, 8)}…`,
          en: `sub[${i}] = ${sub.toString(16).slice(0, 8)}…`,
        })
        .setBars(seedsView(master, input.count, i))
        .setAux([
          { label: `子 ${i}`, value: sub.toString(16).slice(0, 8), role: 'final' as BarRole },
        ])
        .commit();
    },
  });

  const finalSeeds = extendSeeds(master, input.count);
  rec
    .begin({ zh: `完成`, en: `Done` })
    .setBars(finalSeeds.map((s) => ({ value: Number(s & 0xffffn), role: 'sorted' as BarRole })))
    .commit();

  return rec.build();
}

function seedsView(
  master: bigint,
  count: number,
  highlight: number,
): Array<{ value: number; role: BarRole }> {
  const all = extendSeeds(master, count);
  return all.map((s, i) => ({
    value: Number(s & 0xffffn),
    role: (i === highlight ? 'compare' : 'default') as BarRole,
  }));
}
