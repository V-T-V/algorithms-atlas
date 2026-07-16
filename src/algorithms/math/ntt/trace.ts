// =============================================================================
// 数论变换 NTT · 录制帧序列
// 用 setBars 展示各级系数（条形高度 = 模意义下的值），用 setAux 展示当前级 /
// 旋转因子 / 频谱数组。整数运算无浮点，故直接展示 BigInt → number。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { nttInPlace, NTT_MOD, type NttHooks } from './impl.ts';

export const DEFAULT_INPUT = { reals: [1, 2, 3, 4, 0, 0, 0, 0] };

const cap = (n: bigint): number => Number(n % 1000000000n);

/** 录制演示帧序列。 */
export function buildTrace(input: { reals: number[] } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const reals = input.reals;
  const n = reals.length;

  let work: bigint[] = reals.map((x) => BigInt(x));
  let curStage = -1;

  const snapshot = (note: { zh: string; en: string }): void => {
    const values: number[] = work.map((z) => cap(z));
    const roles: Record<number, BarRole> = {};
    rec
      .begin(note)
      .setBars(rec.barsFrom(values, roles))
      .setAux([
        {
          label: 'stage',
          value: curStage < 0 ? '—' : String(curStage),
          role: 'frontier',
        },
        {
          label: 'mod',
          value: NTT_MOD.toString(),
          role: 'pivot',
        },
        {
          label: 'A[k]',
          value: `[${work.map((z) => z.toString()).join(', ')}]`,
          role: 'compare',
        },
      ])
      .commit();
  };

  snapshot({
    zh: `输入序列（n=${n}），先做位反转重排`,
    en: `Input (n=${n}); bit-reversal reordering first`,
  });

  const hooks: NttHooks = {
    onStage: (stage) => {
      curStage = stage;
    },
    onButterfly: (stage, _k, w) => {
      void _k;
      snapshot({
        zh: `第 ${stage} 级蝶形，旋转因子 w=${w.toString().slice(0, 12)}…`,
        en: `Stage ${stage} butterfly, twiddle w=${w.toString().slice(0, 12)}...`,
      });
    },
    onDone: (result) => {
      work = result;
    },
  };

  nttInPlace(work, false, hooks);

  // 终态
  rec
    .begin({ zh: '变换完成；柱状图为模意义下的频谱', en: 'Done; bars = spectrum mod p' })
    .setBars(work.map((z) => ({ value: cap(z), role: 'final' as BarRole })))
    .setAux([
      {
        label: 'A[k]',
        value: `[${work.map((z) => z.toString()).join(', ')}]`,
        role: 'final',
      },
    ])
    .commit();

  return rec.build();
}
