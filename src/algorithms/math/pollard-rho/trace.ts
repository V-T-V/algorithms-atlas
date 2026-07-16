// =============================================================================
// Pollard-Rho 整数分解 · 录制帧序列
// 用 setAux 展示龟兔游标 (x/y)、累积 gcd、已发现因子；用 setMap 展示因子链。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { factorize, type PollardRhoHooks } from './impl.ts';

export const DEFAULT_INPUT: { n: number } = { n: 8051 }; // 8051 = 83 · 97

/** 录制演示帧序列。 */
export function buildTrace(input: { n: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { n } = input;

  let curX = 2n;
  let curY = 2n;
  let curGcd = 1n;
  let factors: bigint[] = [];
  const lines: Array<{ key: string; value: string; role?: BarRole }> = [];

  const auxRows = (note: { zh: string; en: string }, gcdRole: BarRole = 'default'): void => {
    const aux = [
      { label: 'n', value: String(n), role: 'pivot' as BarRole },
      { label: '龟 x', value: String(curX), role: 'compare' as BarRole },
      { label: '兔 y', value: String(curY), role: 'frontier' as BarRole },
      { label: '|x-y| 与 n 的 gcd', value: String(curGcd), role: gcdRole },
      {
        label: '已发现因子',
        value: factors.length ? factors.map(String).join(' · ') : '—',
        role: 'final' as BarRole,
      },
    ];
    rec.begin(note).setAux(aux).setMap(lines.slice()).commit();
  };

  lines.push({ key: '初始', value: `分解 ${n}`, role: 'default' });
  auxRows({ zh: `分解 n=${n}（Pollard-Rho）`, en: `Factor n=${n} (Pollard-Rho)` });

  const hooks: PollardRhoHooks = {
    onRestart: (c) => {
      auxRows({
        zh: `陷入循环，换参数 c=${c} 重启`,
        en: `Cycle hit, restart with c=${c}`,
      });
    },
    onStep: (x, y, g) => {
      curX = x;
      curY = y;
      curGcd = g;
      const role: BarRole = g > 1n && g < BigInt(n) ? 'final' : 'default';
      auxRows(
        {
          zh: `推进：x=${x}, y=${y}, gcd=${g}${g > 1n && g < BigInt(n) ? ' → 命中因子' : ''}`,
          en: `Step: x=${x}, y=${y}, gcd=${g}${g > 1n && g < BigInt(n) ? ' → factor found' : ''}`,
        },
        role,
      );
    },
    onFactor: (d) => {
      factors = [...factors, d];
      lines.push({ key: `因子`, value: String(d), role: 'final' });
      auxRows(
        {
          zh: `发现因子 ${d}`,
          en: `Found factor ${d}`,
        },
        'final',
      );
    },
    onDone: (all) => {
      factors = all;
      const prod = all.reduce((acc, f) => acc * f, 1n);
      lines.push({
        key: '结果',
        value: `${n} = ${all.map(String).join(' · ')} （校验乘积=${prod}）`,
        role: 'final',
      });
      rec
        .begin({
          zh: `完成：${n} = ${all.map(String).join(' · ')}`,
          en: `Done: ${n} = ${all.map(String).join(' · ')}`,
        })
        .setAux([
          { label: '因子分解', value: all.map(String).join(' · '), role: 'final' as BarRole },
          { label: '乘积校验', value: String(prod), role: 'default' as BarRole },
        ])
        .setMap(lines.slice())
        .commit();
    },
  };

  factorize(n, hooks);

  return rec.build();
}
