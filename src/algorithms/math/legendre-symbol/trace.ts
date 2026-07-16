// =============================================================================
// Legendre 符号 · 录制帧序列
// =============================================================================

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { legendre, type LegendreHooks } from './impl.ts';

export const DEFAULT_INPUT: { a: bigint; p: bigint } = { a: 5n, p: 11n };

export function buildTrace(
  input: { a: bigint | number; p: bigint | number } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const a = typeof input.a === 'number' ? BigInt(input.a) : input.a;
  const p = typeof input.p === 'number' ? BigInt(input.p) : input.p;

  let raw = 0n;

  rec
    .begin({
      zh: `判定 ${a} 是否为模 ${p} 的二次剩余`,
      en: `Test if ${a} is a quadratic residue mod ${p}`,
    })
    .setAux([
      { label: 'a', value: a.toString(), role: 'frontier' },
      { label: 'p', value: p.toString(), role: 'frontier' },
    ])
    .commit();

  const hooks: LegendreHooks = {
    onPow: (r) => {
      raw = r;
      rec
        .begin({
          zh: `由欧拉判别法：a^((p-1)/2) mod p = ${r}`,
          en: `Euler criterion: a^((p-1)/2) mod p = ${r}`,
        })
        .setAux([{ label: '原始值', value: r.toString(), role: 'compare' }])
        .commit();
    },
  };

  const v = legendre(a, p, hooks);

  const label = v === 1 ? '二次剩余' : v === -1 ? '二次非剩余' : 'p 整除 a';
  rec
    .begin({
      zh: `(a|p) = ${v}：${label}`,
      en: `(a|p) = ${v}: ${v === 1 ? 'residue' : v === -1 ? 'non-residue' : 'p divides a'}`,
    })
    .setAux([
      { label: '符号值', value: String(v), role: 'final' },
      { label: '原始值', value: raw.toString(), role: 'default' },
    ])
    .commit();

  return rec.build();
}
