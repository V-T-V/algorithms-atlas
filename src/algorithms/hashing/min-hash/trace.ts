// =============================================================================
// MinHash · 录制帧序列
// 用 setArray 展示当前签名（k 个最小哈希值），setAux 展示估计 Jaccard。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { MinHash, exactJaccard, type MinHashHooks } from './impl.ts';

export const DEFAULT_INPUT = {
  setA: ['apple', 'banana', 'cherry', 'date', 'elderberry', 'fig', 'grape', 'honeydew'],
  setB: ['apple', 'banana', 'cherry', 'date', 'kiwi', 'lemon', 'mango', 'nectarine'],
  k: 32,
};

interface BuildTraceInput {
  setA?: string[];
  setB?: string[];
  k?: number;
}

/** 录制演示帧序列。 */
export function buildTrace(input: BuildTraceInput = {}): Frame[] {
  const setA = input.setA ?? DEFAULT_INPUT.setA;
  const setB = input.setB ?? DEFAULT_INPUT.setB;
  const k = input.k ?? DEFAULT_INPUT.k;

  const rec = new TraceRecorder();
  let updatedIdx = -1;

  const renderSig = (sig: number[], label: string): { values: number[]; roles: BarRole[] } => {
    const values = sig.map((v) => Math.round((v / 0x100000000) * 100));
    const roles: BarRole[] = sig.map((_, i) => (i === updatedIdx ? 'swap' : 'sorted'));
    void label;
    return { values, roles };
  };

  const sigA = new MinHash(k);
  const sigB = new MinHash(k);
  const realJ = exactJaccard(setA, setB);

  rec
    .begin({
      zh: `MinHash：k=${k} 个哈希。集 A=${setA.length} 元素，集 B=${setB.length} 元素。真实 Jaccard=${realJ.toFixed(3)}`,
      en: `MinHash: k=${k} hashes. Set A=${setA.length} items, B=${setB.length} items. Exact Jaccard=${realJ.toFixed(3)}`,
    })
    .setAux([
      { label: 'k（哈希数）', value: String(k), role: 'pivot' as BarRole },
      { label: '当前阶段', value: '集 A', role: 'frontier' as BarRole },
      { label: '真实 Jaccard', value: realJ.toFixed(3), role: 'compare' as BarRole },
    ])
    .commit();

  // —— 处理集 A ——
  const hooksA: MinHashHooks = {
    onElement: (item, i, _hv, updated) => {
      updatedIdx = i;
      if (!updated) return; // 仅在更新时录帧，避免过多
      const { values, roles } = renderSig(sigA.signature, 'A');
      rec
        .begin({
          zh: `集 A 加 "${item}"：h${i} 更新最小值`,
          en: `Set A add "${item}": h${i} updated min`,
        })
        .setArray(values, roles, [{ index: i, label: '更新' }])
        .setAux([
          { label: 'k（哈希数）', value: String(k), role: 'pivot' as BarRole },
          { label: '当前元素', value: item, role: 'swap' as BarRole },
          { label: '阶段', value: '集 A', role: 'frontier' as BarRole },
        ])
        .commit();
    },
  };
  sigA.addAll(setA, hooksA);
  sigA.finalize('A');

  // A 完成帧
  rec
    .begin({
      zh: `集 A 签名完成（k=${k} 个最小哈希值）`,
      en: `Set A signature complete (${k} min-hash values)`,
    })
    .setArray(
      renderSig(sigA.signature, 'A').values,
      sigA.signature.map(() => 'final' as BarRole),
      [],
    )
    .setAux([
      { label: '阶段', value: '集 A 完成', role: 'final' as BarRole },
      { label: 'k', value: String(k), role: 'pivot' as BarRole },
    ])
    .commit();

  // —— 处理集 B ——
  const hooksB: MinHashHooks = {
    onElement: (item, i, _hv, updated) => {
      updatedIdx = i;
      if (!updated) return;
      const { values, roles } = renderSig(sigB.signature, 'B');
      rec
        .begin({
          zh: `集 B 加 "${item}"：h${i} 更新最小值`,
          en: `Set B add "${item}": h${i} updated min`,
        })
        .setArray(values, roles, [{ index: i, label: '更新' }])
        .setAux([
          { label: 'k', value: String(k), role: 'pivot' as BarRole },
          { label: '当前元素', value: item, role: 'swap' as BarRole },
          { label: '阶段', value: '集 B', role: 'frontier' as BarRole },
        ])
        .commit();
    },
  };
  sigB.addAll(setB, hooksB);
  sigB.finalize('B');

  // —— 估计 Jaccard ——
  const estJ = MinHash.jaccardEstimate(sigA.signature, sigB.signature);
  const errPct = Math.abs(estJ - realJ);

  // 标记匹配位
  const matchRoles: BarRole[] = sigA.signature.map((v, i) =>
    v === sigB.signature[i] ? 'final' : 'default',
  );
  rec
    .begin({
      zh: `比较签名：匹配 ${sigA.signature.filter((v, i) => v === sigB.signature[i]).length}/${k} → 估计 Jaccard=${estJ.toFixed(3)}（真实 ${realJ.toFixed(3)}）`,
      en: `Compare signatures: ${sigA.signature.filter((v, i) => v === sigB.signature[i]).length}/${k} match → est Jaccard=${estJ.toFixed(3)} (exact ${realJ.toFixed(3)})`,
    })
    .setArray(
      sigA.signature.map((v) => Math.round((v / 0x100000000) * 100)),
      matchRoles,
      [],
    )
    .setAux([
      { label: '估计 Jaccard', value: estJ.toFixed(3), role: 'final' as BarRole },
      { label: '真实 Jaccard', value: realJ.toFixed(3), role: 'compare' as BarRole },
      {
        label: '绝对误差',
        value: errPct.toFixed(3),
        role: (errPct < 0.15 ? 'final' : 'warn') as BarRole,
      },
      {
        label: '匹配位数',
        value: String(sigA.signature.filter((v, i) => v === sigB.signature[i]).length),
        role: 'pivot' as BarRole,
      },
    ])
    .commit();

  return rec.build();
}

export { exactJaccard };
export const DEFAULT_K = DEFAULT_INPUT.k;
