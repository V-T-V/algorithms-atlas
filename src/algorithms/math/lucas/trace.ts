// =============================================================================
// 卢卡斯定理 · 录制帧序列
// 用 setAux 展示 (n, m) 的 p 进制分解与各位的 C(n_i, m_i) mod p，用 setMap 展示
// 逐层累积的乘积。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { lucas, type LucasHooks } from './impl.ts';

export const DEFAULT_INPUT = { n: 100, m: 30, p: 5 };

/** 录制演示帧序列。 */
export function buildTrace(input: { n: number; m: number; p: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { n, m, p } = input;

  // 当前累积乘积
  let acc = 1;
  // 各层的 p 进制位记录
  const digits: Array<{ ni: number; mi: number; comb: number }> = [];

  // 把 n, m 转成 p 进制字符串
  const toBaseP = (x: number): string => {
    if (x === 0) return '0';
    const d: number[] = [];
    let t = x;
    while (t > 0) {
      d.push(t % p);
      t = Math.floor(t / p);
    }
    return d.reverse().join('');
  };

  const auxRows = (note: { zh: string; en: string }): void => {
    const aux: Array<{ label: string; value: string; role?: BarRole }> = [
      { label: 'C(n,m) mod p', value: `C(${n},${m}) mod ${p}`, role: 'default' },
      { label: 'n (p 进制)', value: `${toBaseP(n)} (=${n})`, role: 'compare' },
      { label: 'm (p 进制)', value: `${toBaseP(m)} (=${m})`, role: 'compare' },
      { label: '当前累积', value: String(acc), role: 'frontier' },
    ];
    for (const d of digits) {
      aux.push({
        label: `C(${d.ni},${d.mi})`,
        value: String(d.comb),
        role: 'default',
      });
    }
    const map = digits.map((d) => ({
      key: `C(${d.ni},${d.mi})`,
      value: String(d.comb),
      role: 'pivot' as BarRole,
    }));
    rec.begin(note).setAux(aux).setMap(map).commit();
  };

  auxRows({
    zh: `求 C(${n},${m}) mod ${p}：把 n, m 写成 p=${p} 进制`,
    en: `Compute C(${n},${m}) mod ${p}: write n, m in base ${p}`,
  });

  const hooks: LucasHooks = {
    onDigit: (_nn, _mm, n0, m0, _p) => {
      digits.push({ ni: n0, mi: m0, comb: -1 });
    },
    onComb: (n0, m0, _p, value) => {
      // 找到最后一个未填的位
      for (let i = digits.length - 1; i >= 0; i--) {
        if (digits[i]!.comb < 0) {
          digits[i]!.comb = value;
          break;
        }
      }
      acc = (acc * value) % p;
      auxRows({
        zh: `C(${n0},${m0}) mod ${p} = ${value}，累积 = ${acc}`,
        en: `C(${n0},${m0}) mod ${p} = ${value}, running = ${acc}`,
      });
    },
    onDone: (result) => {
      acc = result;
    },
  };

  lucas(n, m, p, hooks);

  // 终态
  rec
    .begin({
      zh: `结果：C(${n},${m}) ≡ ${acc} (mod ${p})`,
      en: `Result: C(${n},${m}) ≡ ${acc} (mod ${p})`,
    })
    .setAux([
      { label: '答案', value: String(acc), role: 'final' },
      { label: '位数', value: String(digits.length), role: 'default' },
      {
        label: '各 C(n_i,m_i)',
        value: digits.map((d) => d.comb).join(' · '),
        role: 'final',
      },
    ])
    .commit();

  return rec.build();
}
