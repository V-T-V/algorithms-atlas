// =============================================================================
// 扩展 CRT · 录制帧序列
// 用 setAux 展示当前累积的 (value, modulus) 与正在合并的同余式。
// =============================================================================

import type { Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { crtExtended, type Crt2Hooks } from './impl.ts';

export const DEFAULT_INPUT: { remainders: bigint[]; moduli: bigint[] } = {
  remainders: [2n, 3n, 2n],
  moduli: [3n, 5n, 7n],
};

export function buildTrace(
  input: { remainders: bigint[]; moduli: bigint[] } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { remainders, moduli } = input;

  let curValue = 0n;
  let curMod = 1n;
  let infeasible = false;

  const auxRows = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setAux([
        { label: '当前 x', value: curValue.toString(), role: 'frontier' },
        { label: '当前 mod', value: curMod.toString(), role: 'default' },
        {
          label: '是否无解',
          value: infeasible ? '是' : '否',
          role: infeasible ? 'warn' : 'default',
        },
      ])
      .commit();
  };

  const eqs = remainders.map((r, i) => `x ≡ ${r} (mod ${moduli[i]})`).join(', ');
  auxRows({ zh: `方程组：${eqs}`, en: `System: ${eqs}` });

  const hooks: Crt2Hooks = {
    onMerged: (r, m) => {
      curValue = r;
      curMod = m;
      auxRows({ zh: `合并后：x ≡ ${r} (mod ${m})`, en: `Merged: x ≡ ${r} (mod ${m})` });
    },
    onInfeasible: () => {
      infeasible = true;
      auxRows({
        zh: `差值不能被 gcd 整除，无解`,
        en: `Difference not divisible by gcd; infeasible`,
      });
    },
  };

  const ans = crtExtended(remainders, moduli, hooks);

  rec
    .begin({
      zh: ans ? `解：x ≡ ${ans.value} (mod ${ans.modulus})` : '无解',
      en: ans ? `Solution: x ≡ ${ans.value} (mod ${ans.modulus})` : 'No solution',
    })
    .setAux([
      { label: '答案', value: ans ? ans.value.toString() : '无解', role: 'final' },
      { label: '模数', value: ans ? ans.modulus.toString() : '-', role: 'default' },
    ])
    .commit();

  return rec.build();
}
