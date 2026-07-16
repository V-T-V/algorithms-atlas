// =============================================================================
// Tonelli-Shanks · 录制帧序列
// =============================================================================

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { tonelliShanks, type TonelliShanksHooks } from './impl.ts';

export const DEFAULT_INPUT: { n: bigint; p: bigint } = { n: 10n, p: 13n };

export function buildTrace(
  input: { n: bigint | number; p: bigint | number } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const n = typeof input.n === 'number' ? BigInt(input.n) : input.n;
  const p = typeof input.p === 'number' ? BigInt(input.p) : input.p;

  let ans: bigint | null = null;

  rec
    .begin({ zh: `求 x² ≡ ${n} (mod ${p})`, en: `Solve x² ≡ ${n} (mod ${p})` })
    .setAux([
      { label: 'n', value: n.toString(), role: 'frontier' },
      { label: 'p', value: p.toString(), role: 'frontier' },
    ])
    .commit();

  const hooks: TonelliShanksHooks = {
    onDecompose: (q, k) => {
      rec
        .begin({ zh: `p-1 = ${q}·2^${k}`, en: `p-1 = ${q}·2^${k}` })
        .setAux([
          { label: 'q', value: q.toString(), role: 'compare' },
          { label: 'k', value: String(k), role: 'compare' },
        ])
        .commit();
    },
    onNonResidue: (z) => {
      rec
        .begin({ zh: `二次非剩余 z = ${z}`, en: `Quadratic non-residue z = ${z}` })
        .setAux([{ label: 'z', value: z.toString(), role: 'warn' }])
        .commit();
    },
    onIter: (M, i, r) => {
      rec
        .begin({ zh: `迭代：i=${i}, M=${M}, r=${r}`, en: `Iter: i=${i}, M=${M}, r=${r}` })
        .setAux([
          { label: 'i', value: String(i), role: 'compare' },
          { label: 'M', value: String(M), role: 'compare' },
          { label: 'r', value: r.toString(), role: 'frontier' },
        ])
        .commit();
    },
  };

  ans = tonelliShanks(n, p, hooks);

  rec
    .begin({
      zh: ans === null ? '无解' : `解 x = ${ans}（验证 ${ans}² mod ${p} = ${(ans * ans) % p}）`,
      en:
        ans === null
          ? 'No solution'
          : `Solution x = ${ans} (verify ${ans}² mod ${p} = ${(ans * ans) % p})`,
    })
    .setAux([{ label: '答案', value: ans === null ? '无解' : ans.toString(), role: 'final' }])
    .commit();

  return rec.build();
}
