// =============================================================================
// 模平方根 Tonelli–Shanks · 录制帧序列
// 通过 modSqrt 的钩子，把求解过程录成 Frame[]。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { modSqrt, type ModSqrtHooks } from './impl.ts';

export const DEFAULT_INPUT = { n: 10, p: 13 };

/** 录制演示帧序列。 */
export function buildTrace(input: { n: number; p: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { n, p } = input;
  const lines: Array<{ key: string; value: string; role?: BarRole }> = [];

  const aux = (
    note: { zh: string; en: string },
    rows: Array<{ label: string; value: string; role?: BarRole }>,
  ): void => {
    rec.begin(note).setAux(rows).setMap(lines.slice()).commit();
  };

  lines.push({ key: '问题', value: `求 x 使 x² ≡ ${n} (mod ${p})`, role: 'default' });
  aux({ zh: `求 x 使 x² ≡ ${n} (mod ${p})`, en: `Solve x² ≡ ${n} (mod ${p})` }, [
    { label: 'n', value: String(n), role: 'compare' as BarRole },
    { label: 'p', value: String(p), role: 'frontier' as BarRole },
  ]);

  const hooks: ModSqrtHooks = {
    onDecompose: (qq, kk) => {
      lines.push({ key: '分解', value: `p−1 = ${qq} · 2^${kk}`, role: 'default' });
      aux({ zh: `p−1 = ${qq}·2^${kk}`, en: `p−1 = ${qq}·2^${kk}` }, [
        { label: 'q', value: String(qq), role: 'default' as BarRole },
        { label: 'k', value: String(kk), role: 'default' as BarRole },
      ]);
    },
    onNonResidue: (z) => {
      lines.push({ key: '非剩余 z', value: String(z), role: 'warn' });
      aux({ zh: `找到二次非剩余 z = ${z}`, en: `Found quadratic non-residue z = ${z}` }, [
        { label: 'z', value: String(z), role: 'warn' as BarRole },
      ]);
    },
    onCandidate: (r) => {
      lines.push({ key: '候选 r', value: String(r), role: 'compare' });
      aux(
        {
          zh: `候选根 r = ${r}（${(r * r) % p} ≡ ${n} mod ${p}）`,
          en: `Candidate r = ${r} (${(r * r) % p} ≡ ${n} mod ${p})`,
        },
        [
          { label: 'r', value: String(r), role: 'compare' as BarRole },
          { label: 'r² mod p', value: String((r * r) % p), role: 'final' as BarRole },
        ],
      );
    },
    onResult: (r) => {
      lines.push({ key: '结果', value: r === null ? '无解' : `${r}`, role: 'final' });
      aux(
        {
          zh: r === null ? `${n} 是 ${p} 的二次非剩余，无解` : `x = ${r}（另一根 ${p - r}）`,
          en:
            r === null
              ? `${n} is a non-residue mod ${p}; no solution`
              : `x = ${r} (other root ${p - r})`,
        },
        [
          {
            label: 'x',
            value: r === null ? '无解' : String(r),
            role: r === null ? ('warn' as BarRole) : ('final' as BarRole),
          },
        ],
      );
    },
  };

  modSqrt(n, p, hooks);
  return rec.build();
}
