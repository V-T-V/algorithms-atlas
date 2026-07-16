// =============================================================================
// 模平方根 · 录制
import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { modSqrt, type ModSqrtHooks } from './impl.ts';

export const DEFAULT_INPUT = { n: 2, p: 7 }; // 3²=9≡2 mod 7

export function buildTrace(
  input: { n: number | bigint; p: number | bigint } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  let residue: boolean | null = null;
  const iters: bigint[] = [];

  const snap = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setBars(iters.map((x) => ({ value: Number(x), role: 'frontier' })))
      .setAux([
        { label: 'n', value: String(input.n), role: 'frontier' },
        { label: 'p', value: String(input.p), role: 'pivot' },
        {
          label: '二次剩余?',
          value: residue === null ? '?' : String(residue),
          role: residue === false ? 'warn' : 'final',
        },
      ])
      .commit();
  };

  snap({ zh: `求 x²≡${input.n} mod ${input.p}`, en: `Solve x²≡${input.n} mod ${input.p}` });

  const hooks: ModSqrtHooks = {
    onResidue: (r) => {
      residue = r;
      snap({ zh: `二次剩余判定：${r}`, en: `Residue: ${r}` });
    },
    onIter: (_i, x) => {
      iters.push(x);
      snap({ zh: `迭代逼近 x=${x}`, en: `Iterate x=${x}` });
    },
  };

  const r = modSqrt(input.n, input.p, hooks);

  rec
    .begin({
      zh:
        r === null
          ? '无解'
          : `x=${r} 或 ${typeof input.p === 'bigint' ? input.p : BigInt(input.p) - r!}`,
      en: r === null ? 'no solution' : `x=${r}`,
    })
    .setAux([{ label: '答案', value: r === null ? '无' : r.toString(), role: 'final' }])
    .commit();

  return rec.build();
}
