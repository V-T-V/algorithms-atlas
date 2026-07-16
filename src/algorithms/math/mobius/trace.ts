// =============================================================================
// 莫比乌斯函数 · 录制帧序列
// 用 setBars 展示 1..N 的 μ 值（高度用 μ+2 避免负值显示问题），用 setAux 展示当前
// 扫描数与素数表。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { mobiusSieve, type MobiusHooks } from './impl.ts';

export const DEFAULT_INPUT = { N: 20 };

/** 录制演示帧序列。 */
export function buildTrace(input: { N: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const N = Math.max(1, input.N);

  const mu = new Array<number>(N + 1).fill(0);
  mu[1] = 1;
  const primes: number[] = [];
  let curI = -1;
  let roleI: BarRole = 'frontier';

  const snapshot = (note: { zh: string; en: string }): void => {
    const values: number[] = [];
    const roles: Record<number, BarRole> = {};
    for (let i = 1; i <= N; i++) {
      // μ 取值 {-1,0,1}；条形用 μ+2 做可视化高度（避免负数显示问题）
      values.push(mu[i]! + 2);
      if (i === curI) roles[i - 1] = roleI;
      if (primes.includes(i)) roles[i - 1] = roles[i - 1] ?? 'pivot';
    }
    rec
      .begin(note)
      .setBars(rec.barsFrom(values, roles))
      .setAux([
        { label: 'N', value: String(N), role: 'default' },
        {
          label: '图例',
          value: '高度=μ+2：1→3，−1→1，0→2',
          role: 'default',
        },
        { label: 'primes', value: `[${primes.join(', ')}]`, role: 'pivot' },
        {
          label: 'μ 表',
          value: `[${mu.slice(1).join(', ')}]`,
          role: 'compare',
        },
      ])
      .commit();
    roleI = 'frontier';
  };

  snapshot({
    zh: `线性筛求 μ(1..${N})，μ(1)=1`,
    en: `Linear sieve for μ(1..${N}); μ(1)=1`,
  });

  const hooks: MobiusHooks = {
    onSievePrime: (p) => {
      primes.push(p);
      curI = p;
      roleI = 'pivot';
      mu[p] = -1;
      snapshot({
        zh: `${p} 是素数，μ(${p}) = −1`,
        en: `${p} is prime, μ(${p}) = −1`,
      });
    },
    onSieveValue: (i, v) => {
      mu[i] = v;
      curI = i;
      if (i > 2 && !primes.includes(i)) {
        snapshot({
          zh: `μ(${i}) = ${v === 0 ? '0（含平方因子）' : v}`,
          en: `μ(${i}) = ${v}`,
        });
      }
    },
  };

  mobiusSieve(N, hooks);

  // 终态
  const values: number[] = [];
  for (let i = 1; i <= N; i++) values.push(mu[i]! + 2);
  rec
    .begin({ zh: '完成', en: 'Done' })
    .setBars(values.map((v) => ({ value: v, role: 'final' as BarRole })))
    .setAux([{ label: 'μ(1..N)', value: `[${mu.slice(1).join(', ')}]`, role: 'final' }])
    .commit();

  return rec.build();
}
