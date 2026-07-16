// =============================================================================
// 连分数渐近分数 · 录制帧序列
// 用 map 展示每一步新算出的 h_k、k_k 及当前渐近分数 h_k/k_k。
// =============================================================================
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { continuedFractionConvergents, type ConvergentHooks } from './impl.ts';

export const DEFAULT_INPUT = [3, 7, 15, 1]; // π 的连分数近似 [3;7,15,1]

/** 录制演示帧序列。 */
export function buildTrace(input: readonly number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const a = input;

  rec
    .begin({
      zh: `给定连分数系数 [${a.join(', ')}]，逐项求渐近分数 h_k/k_k`,
      en: `Given CF coefficients [${a.join(', ')}], compute convergents h_k/k_k`,
    })
    .setMap([
      { key: '递推', value: 'h_k = a_k·h_{k-1} + h_{k-2}', role: 'pivot' },
      { key: '初值', value: 'h_{-2}=0, h_{-1}=1; k_{-2}=1, k_{-1}=0', role: 'default' },
    ])
    .commit();

  const rows: Array<{ key: string; value: string; role?: BarRole }> = [];
  const snapshot = (note: { zh: string; en: string }): void => {
    rec.begin(note).setMap(rows.slice()).commit();
  };

  const hooks: ConvergentHooks = {
    onConvergent: (k, h, kk) => {
      rows.push({
        key: `k=${k}`,
        value: `a=${a[k]!} → ${h}/${kk} ≈ ${(h / kk).toFixed(8)}`,
        role: 'frontier',
      });
      // 把上一格的强调去掉
      if (rows.length >= 2) rows[rows.length - 2]!.role = 'default';
      snapshot({
        zh: `a[${k}]=${a[k]!}：h_${k}=${h}, k_${k}=${kk}，渐近分数 ${h}/${kk}`,
        en: `a[${k}]=${a[k]!}: h_${k}=${h}, k_${k}=${kk}, convergent ${h}/${kk}`,
      });
    },
    onResult: (convs) => {
      const last = convs[convs.length - 1];
      rows.push({
        key: '结果',
        value: last ? `${last.h}/${last.k} ≈ ${(last.h / last.k).toFixed(8)}` : '∅',
        role: 'final',
      });
      if (rows.length >= 2) rows[rows.length - 2]!.role = 'default';
      snapshot({
        zh: `共 ${convs.length} 个渐近分数，最终为 ${last ? `${last.h}/${last.k}` : '∅'}`,
        en: `${convs.length} convergents; final = ${last ? `${last.h}/${last.k}` : '∅'}`,
      });
    },
  };

  continuedFractionConvergents(a, hooks);
  return rec.build();
}
