// =============================================================================
// 离散对数 BSGS · 录制帧序列
// 通过 discreteLog 的钩子，把 baby/giant 步骤录成 Frame[]。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { discreteLog, type DiscreteLogHooks } from './impl.ts';

export const DEFAULT_INPUT = { g: 3, t: 13, m: 17 }; // 3^x ≡ 13 mod 17

/** 录制演示帧序列。 */
export function buildTrace(input: { g: number; t: number; m: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { g, t, m } = input;
  const lines: Array<{ key: string; value: string; role?: BarRole }> = [];

  const snapshot = (note: { zh: string; en: string }): void => {
    rec.begin(note).setMap(lines.slice()).commit();
  };

  lines.push({ key: '问题', value: `求 x 使 ${g}^x ≡ ${t} (mod ${m})`, role: 'default' });
  rec
    .begin({ zh: `BSGS 求 ${g}^x ≡ ${t} (mod ${m})`, en: `BSGS: solve ${g}^x ≡ ${t} (mod ${m})` })
    .setMap(lines.slice())
    .commit();

  const hooks: DiscreteLogHooks = {
    onBabyStep: (j, value) => {
      lines.push({ key: `baby g^${j}`, value: `${value}`, role: 'frontier' });
      if (j === 0 || j === Math.ceil(Math.sqrt(m)) - 1) {
        snapshot({
          zh: `baby-step：预计算 g^0..g^(n-1)`,
          en: `Baby-step: precompute g^0..g^(n-1)`,
        });
      }
    },
    onGiantStep: (i, value, hit) => {
      lines.push({
        key: `giant i=${i}`,
        value: `γ = ${value}${hit ? ' ✓命中' : ''}`,
        role: hit ? 'final' : 'compare',
      });
      snapshot({
        zh: `giant-step i=${i}：γ=${value}${hit ? ' 命中 baby 表' : ''}`,
        en: `Giant-step i=${i}: γ=${value}${hit ? ' hit' : ''}`,
      });
    },
    onResult: (x) => {
      lines.push({ key: '结果', value: x === null ? '无解' : `${x}`, role: 'final' });
      snapshot({
        zh: x === null ? '无解' : `x = ${x}（验证：${g}^${x} mod ${m} = ${t}）`,
        en: x === null ? 'No solution' : `x = ${x} (check: ${g}^${x} mod ${m} = ${t})`,
      });
    },
  };

  discreteLog(g, t, m, hooks);
  return rec.build();
}
