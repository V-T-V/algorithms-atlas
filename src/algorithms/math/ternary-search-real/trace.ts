// =============================================================================
// 三分查找 · 录制帧序列
// 在区间 [lo, hi] 上采样 f，用 setBars 展示函数值（条形高度），用 pointers 标注
// 当前 lo / m1 / m2 / hi 的位置。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { ternarySearch, type RealFn, type TernarySearchHooks } from './impl.ts';

export const DEFAULT_INPUT = {
  // f(x) = -(x-3)^2 + 9：在 x=3 处取极大值 9
  f: ((x: number) => -(x - 3) * (x - 3) + 9) as RealFn,
  lo: -2,
  hi: 8,
  samples: 60,
};

/** 录制演示帧序列。 */
export function buildTrace(
  input: {
    f?: RealFn;
    lo?: number;
    hi?: number;
    samples?: number;
  } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const f = input.f ?? DEFAULT_INPUT.f;
  const loStart = input.lo ?? DEFAULT_INPUT.lo;
  const hiStart = input.hi ?? DEFAULT_INPUT.hi;
  const S = input.samples ?? DEFAULT_INPUT.samples;

  // 预采样：在 [loStart, hiStart] 上均匀取 S 个点，作为可视化条形
  const xs: number[] = [];
  const ys: number[] = [];
  for (let i = 0; i < S; i++) {
    const x = loStart + ((hiStart - loStart) * i) / (S - 1);
    xs.push(x);
    ys.push(f(x));
  }
  // 把 x 映射到条形下标
  const xToIdx = (x: number): number => {
    const t = (x - loStart) / (hiStart - loStart);
    return Math.max(0, Math.min(S - 1, Math.round(t * (S - 1))));
  };

  let curLo = loStart;
  let curHi = hiStart;
  let curM1 = -1;
  let curM2 = -1;
  let phase: 'probe' | 'shrink' = 'probe';

  const snapshot = (note: { zh: string; en: string }): void => {
    const roles: Record<number, BarRole> = {};
    const loIdx = xToIdx(curLo);
    const hiIdx = xToIdx(curHi);
    // 区间外的条淡化
    for (let i = 0; i < S; i++) {
      if (i < loIdx || i > hiIdx) roles[i] = 'default';
    }
    if (curM1 >= loStart && curM1 <= hiStart) roles[xToIdx(curM1)] = 'compare';
    if (curM2 >= loStart && curM2 <= hiStart) roles[xToIdx(curM2)] = 'swap';
    roles[loIdx] = phase === 'shrink' ? 'frontier' : (roles[loIdx] ?? 'frontier');
    roles[hiIdx] = phase === 'shrink' ? 'frontier' : (roles[hiIdx] ?? 'frontier');

    const pointers: Array<{ index: number; label: string }> = [
      { index: loIdx, label: 'lo' },
      { index: hiIdx, label: 'hi' },
    ];
    if (curM1 >= loStart && curM1 <= hiStart) pointers.push({ index: xToIdx(curM1), label: 'm1' });
    if (curM2 >= loStart && curM2 <= hiStart) pointers.push({ index: xToIdx(curM2), label: 'm2' });

    rec
      .begin(note)
      .setBars(rec.barsFrom(ys, roles))
      .setAux([
        { label: '区间', value: `[${curLo.toFixed(3)}, ${curHi.toFixed(3)}]`, role: 'frontier' },
        {
          label: 'm1',
          value: curM1 < 0 ? '—' : `${curM1.toFixed(3)} → f=${f(curM1).toFixed(3)}`,
          role: 'compare',
        },
        {
          label: 'm2',
          value: curM2 < 0 ? '—' : `${curM2.toFixed(3)} → f=${f(curM2).toFixed(3)}`,
          role: 'swap',
        },
      ])
      .commit();
  };

  snapshot({
    zh: `在 [${loStart}, ${hiStart}] 上求 f 的极大值`,
    en: `Maximize f on [${loStart}, ${hiStart}]`,
  });

  const hooks: TernarySearchHooks = {
    onProbe: (lo, hi, m1, m2, f1, f2) => {
      curLo = lo;
      curHi = hi;
      curM1 = m1;
      curM2 = m2;
      phase = 'probe';
      snapshot({
        zh: `探针 m1=${m1.toFixed(3)} f(m1)=${f1.toFixed(3)}；m2=${m2.toFixed(3)} f(m2)=${f2.toFixed(3)}`,
        en: `Probe m1=${m1.toFixed(3)} f=${f1.toFixed(3)}; m2=${m2.toFixed(3)} f=${f2.toFixed(3)}`,
      });
    },
    onShrink: (lo, hi, reason) => {
      curLo = lo;
      curHi = hi;
      phase = 'shrink';
      snapshot({
        zh: `缩小区间 → [${lo.toFixed(3)}, ${hi.toFixed(3)}]（${reason}）`,
        en: `Shrink → [${lo.toFixed(3)}, ${hi.toFixed(3)}]`,
      });
    },
  };

  const result = ternarySearch(f, loStart, hiStart, hooks);

  // 终态：高亮极值点
  const peakIdx = xToIdx(result.x);
  const roles: BarRole[] = new Array(S).fill('default');
  roles[peakIdx] = 'final';
  rec
    .begin({
      zh: `极大值点 x* ≈ ${result.x.toFixed(4)}，f(x*) ≈ ${result.fx.toFixed(4)}（${result.iterations} 次迭代）`,
      en: `Argmax x* ≈ ${result.x.toFixed(4)}, f(x*) ≈ ${result.fx.toFixed(4)} (${result.iterations} iters)`,
    })
    .setBars(ys.map((v, i) => ({ value: v, role: roles[i]! })))
    .setAux([
      { label: 'x*', value: result.x.toFixed(6), role: 'final' },
      { label: 'f(x*)', value: result.fx.toFixed(6), role: 'final' },
    ])
    .commit();

  return rec.build();
}
