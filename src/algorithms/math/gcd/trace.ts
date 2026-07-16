// =============================================================================
// 辗转相除法 · 录制帧序列
// 用 setAux 展示每轮 a, b, a % b 的变化；用 setMap 展示算式链。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { gcd, type GcdHooks } from './impl.ts';

export const DEFAULT_INPUT: { a: number; b: number } = { a: 252, b: 105 };

/** 录制演示帧序列。 */
export function buildTrace(input: { a: number; b: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { a, b } = input;

  // 算式行列表（每轮一行：a = q·b + r）
  const lines: Array<{ key: string; value: string; role?: BarRole }> = [];
  // 当前高亮的 a / b / r
  let curA = Math.abs(a);
  let curB = Math.abs(b);

  const auxRows = (note: { zh: string; en: string }, resultRole: BarRole = 'compare'): void => {
    const aux = [
      { label: 'a', value: String(curA), role: 'compare' as BarRole },
      { label: 'b', value: String(curB), role: 'frontier' as BarRole },
      { label: 'a % b', value: curB === 0 ? '—' : String(curA % curB), role: resultRole },
    ];
    rec.begin(note).setAux(aux).setMap(lines.slice()).commit();
  };

  lines.push({ key: '初始', value: `gcd(${a}, ${b})`, role: 'default' });
  auxRows({ zh: `求 gcd(${a}, ${b})`, en: `Compute gcd(${a}, ${b})` });

  let steps = 0;
  const hooks: GcdHooks = {
    onStep: (aa, bb, r) => {
      steps++;
      const q = Math.floor(aa / bb);
      lines.push({
        key: `第 ${steps} 轮`,
        value: `${aa} = ${q}·${bb} + ${r}  →  gcd(${aa}, ${bb}) = gcd(${bb}, ${r})`,
        role: 'default',
      });
      curA = bb;
      curB = r;
      auxRows({
        zh: `${aa} ÷ ${bb} = ${q} 余 ${r}，转为 gcd(${bb}, ${r})`,
        en: `${aa} ÷ ${bb} = ${q} r ${r}, reduce to gcd(${bb}, ${r})`,
      });
    },
    onDone: (g) => {
      lines.push({ key: '结果', value: `gcd = ${g}`, role: 'final' });
      rec
        .begin({ zh: `余数为 0，GCD = ${g}`, en: `Remainder is 0, GCD = ${g}` })
        .setAux([
          { label: 'a', value: String(g), role: 'final' as BarRole },
          { label: 'b', value: '0', role: 'default' as BarRole },
          { label: 'a % b', value: '—', role: 'default' as BarRole },
        ])
        .setMap(lines.slice())
        .commit();
    },
  };

  gcd(a, b, hooks);

  return rec.build();
}
