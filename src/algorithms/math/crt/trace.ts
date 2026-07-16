// =============================================================================
// 中国剩余定理 · 录制帧序列
// 用 setAux 展示迭代合并：每对同余式 (r1,m1)+(r2,m2) → (r, lcm)，最终 x (mod M)。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { crt, type CrtHooks } from './impl.ts';

// 经典「物不知数」：x ≡ 2 mod 3, x ≡ 3 mod 5, x ≡ 2 mod 7 → x = 23
export const DEFAULT_INPUT: {
  remainders: number[];
  moduli: number[];
} = {
  remainders: [2, 3, 2],
  moduli: [3, 5, 7],
};

/** 录制演示帧序列。 */
export function buildTrace(
  input: { remainders: number[]; moduli: number[] } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { remainders, moduli } = input;

  // 原始同余式列表（用于展示）
  const congs = remainders.map((a, i) => ({ a: BigInt(a), m: BigInt(moduli[i]!) }));
  // 当前累积解 (r, m)
  let curR = BigInt(remainders[0] ?? 0);
  let curM = BigInt(moduli[0] ?? 1);
  let mergeCount = 0;

  const auxRows = (note: { zh: string; en: string }, role: BarRole = 'default'): void => {
    const aux = [
      ...congs.map((c, i) => ({
        label: `x mod ${c.m}`,
        value: `≡ ${c.a}`,
        role: (i === 0 ? 'compare' : 'default') as BarRole,
      })),
      { label: '累积答案', value: `x ≡ ${curR} (mod ${curM})`, role },
    ];
    rec.begin(note).setAux(aux).commit();
  };

  rec
    .begin({
      zh: `求解：${congs.map((c) => `x ≡ ${c.a} (mod ${c.m})`).join('， ')}`,
      en: `Solve: ${congs.map((c) => `x ≡ ${c.a} (mod ${c.m})`).join(', ')}`,
    })
    .setAux(
      congs.map((c) => ({ label: `x mod ${c.m}`, value: `≡ ${c.a}`, role: 'compare' as BarRole })),
    )
    .commit();

  const hooks: CrtHooks = {
    onMerge: (r1, m1, r2, m2) => {
      mergeCount++;
      auxRows({
        zh: `第 ${mergeCount} 次合并：x ≡ ${r1} (mod ${m1}) 与 x ≡ ${r2} (mod ${m2})`,
        en: `Merge #${mergeCount}: x ≡ ${r1} (mod ${m1}) and x ≡ ${r2} (mod ${m2})`,
      });
    },
    onGcd: (m1, m2, g) => {
      auxRows({
        zh: `gcd(${m1}, ${m2}) = ${g}，lcm = ${(m1 / g) * m2}`,
        en: `gcd(${m1}, ${m2}) = ${g}, lcm = ${(m1 / g) * m2}`,
      });
    },
    onMerged: (r, m) => {
      curR = r;
      curM = m;
      auxRows(
        {
          zh: `合并后：x ≡ ${r} (mod ${m})`,
          en: `After merge: x ≡ ${r} (mod ${m})`,
        },
        'final',
      );
    },
    onDone: (value, modulus) => {
      rec
        .begin({
          zh: `答案：x = ${value} (mod ${modulus})`,
          en: `Answer: x = ${value} (mod ${modulus})`,
        })
        .setAux([
          { label: 'x', value: String(value), role: 'final' as BarRole },
          { label: 'M (modulus)', value: String(modulus), role: 'default' as BarRole },
          {
            label: '校验',
            value: congs.map((c) => `${value % c.m}≡${c.a}`).join(', '),
            role: 'default' as BarRole,
          },
        ])
        .commit();
    },
  };

  crt(remainders, moduli, hooks);

  return rec.build();
}
