// =============================================================================
// 原根 Primitive Root · 录制帧序列
// 用 setAux 展示候选 g 的验证过程：对 p-1 的每个质因子 qi 检查 g^((p-1)/qi) mod p。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { minPrimitiveRoot, distinctPrimeFactors, type PrimitiveRootHooks } from './impl.ts';

export const DEFAULT_INPUT = { p: 998244353 };

/** 录制演示帧序列。 */
export function buildTrace(input: { p: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { p } = input;

  let factors: number[] = distinctPrimeFactors(p - 1);
  let curG = -1;
  let curChecks: Array<{ qi: number; value: number; ok: boolean }> = [];
  const rejected: Array<{ g: number; reason: string }> = [];
  let foundG = -1;

  const auxRows = (): Array<{ label: string; value: string; role?: BarRole }> => {
    const rows: Array<{ label: string; value: string; role?: BarRole }> = [
      { label: 'p', value: String(p), role: 'pivot' },
      { label: 'p-1', value: String(p - 1), role: 'default' },
      { label: 'prime factors of p-1', value: `[${factors.join(', ')}]`, role: 'frontier' },
      { label: '候选 g', value: curG < 0 ? '—' : String(curG), role: 'compare' },
    ];
    for (const c of curChecks) {
      rows.push({
        label: `g^((p-1)/${c.qi})`,
        value: `${c.value} ${c.ok ? '≠ 1 ✓' : '= 1 ✗'}`,
        role: c.ok ? 'sorted' : 'warn',
      });
    }
    if (rejected.length > 0) {
      const last = rejected[rejected.length - 1]!;
      rows.push({ label: '上一否决', value: `g=${last.g}: ${last.reason}`, role: 'warn' });
    }
    if (foundG >= 0) {
      rows.push({ label: '最小原根', value: String(foundG), role: 'final' });
    }
    return rows;
  };

  const snapshot = (note: { zh: string; en: string }): void => {
    rec.begin(note).setAux(auxRows()).commit();
  };

  snapshot({
    zh: `求素数 p=${p} 的最小原根；先分解 p-1=${p - 1}`,
    en: `Find smallest primitive root of prime p=${p}; factor p-1=${p - 1} first`,
  });

  const hooks: PrimitiveRootHooks = {
    onFactors: (_p, fs) => {
      factors = fs;
      snapshot({
        zh: `p-1 的不同质因子：[${factors.join(', ')}]`,
        en: `Distinct prime factors of p-1: [${factors.join(', ')}]`,
      });
    },
    onCandidate: (g) => {
      curG = g;
      curChecks = [];
      snapshot({
        zh: `尝试候选 g=${g}`,
        en: `Try candidate g=${g}`,
      });
    },
    onCheck: (g, qi, value, ok) => {
      curG = g;
      curChecks.push({ qi, value, ok });
      snapshot({
        zh: `验证 g=${g}：g^((p-1)/${qi}) mod p = ${value} ${ok ? '≠ 1 ✓' : '= 1 ✗'}`,
        en: `Check g=${g}: g^((p-1)/${qi}) mod p = ${value} ${ok ? '≠ 1 ✓' : '= 1 ✗'}`,
      });
    },
    onReject: (g, reason) => {
      rejected.push({ g, reason });
      snapshot({
        zh: `否决 g=${g}（${reason}）`,
        en: `Reject g=${g} (${reason})`,
      });
    },
    onFound: (g) => {
      foundG = g;
      snapshot({
        zh: `找到最小原根 g=${g}`,
        en: `Found smallest primitive root g=${g}`,
      });
    },
  };

  const g = minPrimitiveRoot(p, hooks);

  // 终态
  rec
    .begin({
      zh: `完成：${p} 的最小原根 = ${g}`,
      en: `Done: smallest primitive root of ${p} is ${g}`,
    })
    .setAux([{ label: '最小原根', value: String(g), role: 'final' }, ...auxRows()])
    .commit();

  return rec.build();
}
