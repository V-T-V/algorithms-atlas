// =============================================================================
// 快速幂 · 录制帧序列
// 用 setAux 展示 result、base、剩余 exp（及二进制），逐位演示平方与累乘。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { fastPower, type FastPowerHooks } from './impl.ts';

export const DEFAULT_INPUT: { base: number; exp: number; mod?: number } = {
  base: 2,
  exp: 13,
  mod: 1000,
};

const toBin = (x: number): string => (x === 0 ? '0' : x.toString(2));

/** 录制演示帧序列。 */
export function buildTrace(
  input: { base: number; exp: number; mod?: number } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { base, exp, mod } = input;

  let result = 1;
  if (mod !== undefined) result %= Math.abs(mod);
  let curBase = base;
  let curExp = exp;
  let lastAction: 'bit0' | 'bit1' | 'square' | 'multiply' | null = null;

  const auxRows = (note: { zh: string; en: string }): void => {
    const modStr = mod === undefined ? '（无 / none）' : String(Math.abs(mod));
    const resultRole: BarRole = lastAction === 'multiply' ? 'final' : 'default';
    const baseRole: BarRole = lastAction === 'square' ? 'compare' : 'default';
    rec
      .begin(note)
      .setAux([
        { label: 'result', value: String(result), role: resultRole },
        { label: 'base', value: String(curBase), role: baseRole },
        { label: 'exp (剩余)', value: `${curExp}  (=${toBin(curExp)})`, role: 'frontier' },
        { label: 'mod', value: modStr, role: 'default' },
      ])
      .commit();
    lastAction = null;
  };

  auxRows({
    zh: `计算 ${base}^${exp}${mod !== undefined ? ` mod ${mod}` : ''}（指数二进制 = ${toBin(exp)}）`,
    en: `Compute ${base}^${exp}${mod !== undefined ? ` mod ${mod}` : ''} (exp in binary = ${toBin(exp)})`,
  });

  const hooks: FastPowerHooks = {
    onBit: (bit) => {
      lastAction = bit === 1 ? 'bit1' : 'bit0';
      auxRows({
        zh: `看指数最低位 = ${bit}${bit === 1 ? '（累乘 result *= base）' : '（不累乘）'}`,
        en: `Inspect lowest bit = ${bit}${bit === 1 ? ' (result *= base)' : ' (skip)'}`,
      });
    },
    onMultiply: (r) => {
      result = r;
      lastAction = 'multiply';
      auxRows({
        zh: `该位为 1：result = ${r}`,
        en: `Bit is 1: result = ${r}`,
      });
    },
    onSquare: (nb) => {
      curBase = nb;
      curExp = Math.floor(curExp / 2);
      lastAction = 'square';
      auxRows({
        zh: `base 自乘平方 → ${nb}；指数右移一位`,
        en: `Square base → ${nb}; shift exp right`,
      });
    },
  };

  const ans = fastPower(base, exp, mod, hooks);

  // 终态
  rec
    .begin({
      zh: `结果：${base}^${exp}${mod !== undefined ? ` mod ${mod}` : ''} = ${ans}`,
      en: `Result: ${base}^${exp}${mod !== undefined ? ` mod ${mod}` : ''} = ${ans}`,
    })
    .setAux([
      { label: '答案', value: String(ans), role: 'final' },
      { label: 'exp (二进制)', value: toBin(exp), role: 'default' },
    ])
    .commit();

  return rec.build();
}
