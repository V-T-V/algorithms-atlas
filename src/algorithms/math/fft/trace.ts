// =============================================================================
// 快速傅里叶变换 · 录制帧序列
// 用 setBars 展示各蝶形级的实部（条形高度），用 setAux 展示当前级 / 旋转因子 /
// 复数频谱的实部与虚部。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { fftInPlace, cx, type Complex, type FftHooks } from './impl.ts';

export const DEFAULT_INPUT = { reals: [1, 2, 3, 4, 0, 0, 0, 0] };

/** 录制演示帧序列。 */
export function buildTrace(input: { reals: number[] } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const reals = input.reals;
  const n = reals.length;

  // 当前工作数组（复数），跟踪每帧
  let work: Complex[] = reals.map((x) => cx.fromReal(x));
  let curStage = -1;

  const fmt = (z: Complex): string => {
    const r = z.re.toFixed(2);
    const sign = z.im >= 0 ? '+' : '−';
    return `${r}${sign}${Math.abs(z.im).toFixed(2)}i`;
  };

  const snapshot = (note: { zh: string; en: string }): void => {
    const values: number[] = work.map((z) => Math.round(z.re * 1000) / 1000);
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
          label: 'Re',
          value: `[${work.map((z) => z.re.toFixed(2)).join(', ')}]`,
          role: 'compare',
        },
        {
          label: 'Im',
          value: `[${work.map((z) => z.im.toFixed(2)).join(', ')}]`,
          role: 'default',
        },
      ])
      .commit();
  };

  snapshot({
    zh: `输入序列（n=${n}），先做位反转重排`,
    en: `Input (n=${n}); bit-reversal reordering first`,
  });

  const hooks: FftHooks = {
    onStage: (stage) => {
      curStage = stage;
    },
    onButterfly: (stage, _k, w) => {
      snapshot({
        zh: `第 ${stage} 级蝶形，旋转因子 w=${fmt(w)}`,
        en: `Stage ${stage} butterfly, twiddle w=${fmt(w)}`,
      });
    },
    onDone: (result) => {
      work = result;
    },
  };

  fftInPlace(work, false, hooks);

  // 终态：展示幅度谱（|X[k]|）
  const mags = work.map((z) => Math.sqrt(z.re * z.re + z.im * z.im));
  rec
    .begin({ zh: '变换完成；柱状图为幅度谱 |X[k]|', en: 'Done; bars = magnitude |X[k]|' })
    .setBars(mags.map((v) => ({ value: Math.round(v * 1000) / 1000, role: 'final' as BarRole })))
    .setAux([
      {
        label: 'X[k]',
        value: `[${work.map(fmt).join(', ')}]`,
        role: 'final',
      },
    ])
    .commit();

  return rec.build();
}
