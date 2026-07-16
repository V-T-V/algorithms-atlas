// =============================================================================
// Pollard Rho 随机化因数分解 · 录制帧序列
// 用 setAux 展示每轮 Rho 搜索的 c、快慢指针值、gcd 与找到的因子。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { factorize, type PollardRhoHooks } from './impl.ts';

export const DEFAULT_INPUT = {
  // 8051 = 83 · 97
  n: 8051n,
};

interface BuildTraceInput {
  n?: bigint;
}

export function buildTrace(input: BuildTraceInput = {}): Frame[] {
  const n = input.n ?? DEFAULT_INPUT.n;

  const rec = new TraceRecorder();
  const foundFactors: bigint[] = [];

  rec
    .begin({
      zh: `Pollard Rho 分解 n=${n}`,
      en: `Pollard Rho factor n=${n}`,
    })
    .setAux([
      { label: 'n', value: String(n), role: 'pivot' as BarRole },
      { label: '迭代', value: 'x → x² + c (mod n)', role: 'frontier' as BarRole },
      { label: '环检测', value: 'Floyd 快慢指针', role: 'default' as BarRole },
      { label: '期望步数', value: 'O(n^(1/4))', role: 'default' as BarRole },
    ])
    .commit();

  const hooks: PollardRhoHooks = {
    onStart: (_m, c) => {
      rec
        .begin({
          zh: `启动 Rho：常数 c=${c}，x₀=2`,
          en: `Start Rho: constant c=${c}, x₀=2`,
        })
        .setAux([
          { label: 'c', value: String(c), role: 'swap' as BarRole },
          { label: 'x₀', value: '2', role: 'compare' as BarRole },
        ])
        .commit();
    },
    onStep: (xSlow, xFast, g) => {
      rec
        .begin({
          zh: `快慢指针：x_slow=${xSlow}, x_fast=${xFast}, gcd=${g}`,
          en: `Pointers: x_slow=${xSlow}, x_fast=${xFast}, gcd=${g}`,
        })
        .setAux([
          { label: 'x_slow', value: String(xSlow), role: 'compare' as BarRole },
          { label: 'x_fast', value: String(xFast), role: 'compare' as BarRole },
          {
            label: 'gcd(|Δ|,n)',
            value: String(g),
            role: (g > 1n ? 'final' : 'default') as BarRole,
          },
        ])
        .commit();
    },
    onFactor: (d) => {
      foundFactors.push(d);
      rec
        .begin({
          zh: `找到非平凡因子 ${d}`,
          en: `Found non-trivial factor ${d}`,
        })
        .setAux([
          { label: '因子', value: String(d), role: 'final' as BarRole },
          { label: 'n/因子', value: String(n / d), role: 'pivot' as BarRole },
        ])
        .commit();
    },
    onResult: (m, factor) => {
      // 仅在 top-level 完成（factor 为 n 的因子）记录；素因子收集在 onFactor
      if (factor !== null) return;
    },
  };

  const factors = factorize(n, hooks);

  // 终态
  rec
    .begin({
      zh: `完成：${n} = ${factors.join(' · ')}`,
      en: `Done: ${n} = ${factors.join(' · ')}`,
    })
    .setAux([
      { label: 'n', value: String(n), role: 'pivot' as BarRole },
      { label: '素因子', value: factors.map(String).join(', '), role: 'final' as BarRole },
      { label: '因子数', value: String(factors.length), role: 'default' as BarRole },
    ])
    .commit();

  return rec.build();
}
