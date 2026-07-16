// =============================================================================
// 组合数模素数 · 录制帧序列
// =============================================================================

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { precomputeFactorials, nCrLucas, type NCrModPrimeHooks } from './impl.ts';

export const DEFAULT_INPUT: { n: number; r: number; p: number } = { n: 20, r: 10, p: 1000000007 };

export function buildTrace(input: { n: number; r: number; p: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { n, r, p } = input;

  const ctx = precomputeFactorials(Math.min(n, p - 1), p);
  const lucasDigits: Array<{ ni: string; ri: string }> = [];
  let ans = 0n;

  rec
    .begin({ zh: `计算 C(${n}, ${r}) mod ${p}`, en: `Compute C(${n}, ${r}) mod ${p}` })
    .setAux([
      { label: 'n', value: String(n), role: 'frontier' },
      { label: 'r', value: String(r), role: 'frontier' },
      { label: 'p', value: String(p), role: 'frontier' },
    ])
    .commit();

  const hooks: NCrModPrimeHooks = {
    onPrecompute: () => {
      rec
        .begin({ zh: `预处理阶乘 mod ${p}`, en: `Precompute factorials mod ${p}` })
        .setAux([
          {
            label: 'fact',
            value:
              ctx.fact
                .slice(0, 6)
                .map((x) => x.toString())
                .join(',') + '...',
            role: 'compare',
          },
        ])
        .commit();
    },
    onLucas: (digits) => {
      for (const d of digits) {
        lucasDigits.push({ ni: String(d.ni), ri: String(d.ri) });
      }
      rec
        .begin({
          zh: `Lucas 分解为 ${digits.length} 位`,
          en: `Lucas decomposed into ${digits.length} digits`,
        })
        .setAux(
          digits.map((d, i) => ({
            label: `第${i}位`,
            value: `C(${d.ni},${d.ri})`,
            role: 'compare',
          })),
        )
        .commit();
    },
  };

  hooks.onPrecompute?.(Math.min(n, p - 1), BigInt(p));
  ans = nCrLucas(ctx, n, r, hooks);

  rec
    .begin({ zh: `C(${n}, ${r}) mod ${p} = ${ans}`, en: `C(${n}, ${r}) mod ${p} = ${ans}` })
    .setAux([{ label: '答案', value: ans.toString(), role: 'final' }])
    .commit();

  return rec.build();
}
