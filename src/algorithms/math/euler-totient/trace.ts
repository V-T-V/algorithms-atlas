// =============================================================================
// 欧拉函数 · 录制帧序列
// 用 setBars 展示 1..N 的 φ 值（条形高度），用 setAux 展示当前扫描数与素数表。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { eulerTotientSieve, type EulerTotientHooks } from './impl.ts';

export const DEFAULT_INPUT = { N: 16 };

/** 录制演示帧序列。 */
export function buildTrace(input: { N: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const N = Math.max(1, input.N);

  // φ 值表（下标 1..N，0 占位）
  const phi = new Array<number>(N + 1).fill(0);
  phi[1] = 1;
  const primes: number[] = [];
  // 当前高亮的扫描下标 i、刚筛出的 ip
  let curI = -1;
  let curIp = -1;
  let roleI: BarRole = 'frontier';

  const snapshot = (note: { zh: string; en: string }): void => {
    const values: number[] = [];
    const roles: Record<number, BarRole> = {};
    for (let i = 1; i <= N; i++) {
      values.push(phi[i]!);
      if (i === curI) roles[i - 1] = roleI;
      if (i === curIp) roles[i - 1] = 'swap';
      if (primes.includes(i)) roles[i - 1] = roles[i - 1] ?? 'pivot';
    }
    rec
      .begin(note)
      .setBars(rec.barsFrom(values, roles))
      .setAux([
        { label: 'N', value: String(N), role: 'default' },
        { label: 'primes', value: `[${primes.join(', ')}]`, role: 'pivot' },
        {
          label: 'φ 表',
          value: `[${phi.slice(1).join(', ')}]`,
          role: 'default',
        },
      ])
      .commit();
    roleI = 'frontier';
  };

  snapshot({
    zh: `线性筛求 φ(1..${N})，初始 φ[1]=1`,
    en: `Linear sieve for φ(1..${N}); φ[1]=1`,
  });

  const hooks: EulerTotientHooks = {
    onSievePrime: (p) => {
      primes.push(p);
      curI = p;
      roleI = 'pivot';
      snapshot({
        zh: `${p} 是素数，φ(${p}) = ${p - 1}`,
        en: `${p} is prime, φ(${p}) = ${p - 1}`,
      });
    },
    onSieveValue: (i, v) => {
      if (i === 1) return; // 初始已展示
      curI = i;
      curIp = i;
      // 不每个 ip 都 commit（太密），只在素数和关键步进由上层 note 驱动
      phi[i] = v;
    },
    onSieveDone: (phis) => {
      for (let i = 1; i <= N; i++) phi[i] = phis[i]!;
    },
  };

  eulerTotientSieve(N, hooks);

  // 重放一次以便逐 i 落地（简单做法：直接展示终态前再补一帧扫描态）
  snapshot({
    zh: '扫描完成，φ 表已填满',
    en: 'Sweep done, φ table filled',
  });

  // 终态：全部 final
  const values: number[] = [];
  for (let i = 1; i <= N; i++) values.push(phi[i]!);
  rec
    .begin({ zh: '完成', en: 'Done' })
    .setBars(values.map((v) => ({ value: v, role: 'final' as BarRole })))
    .setAux([{ label: 'φ(1..N)', value: `[${phi.slice(1).join(', ')}]`, role: 'final' }])
    .commit();

  return rec.build();
}
