// =============================================================================
// 扩展欧几里得 · 录制帧序列
// 用 setAux 展示每轮滚动变量 (a/b/q/r/s/t)，用 setMap 展示 Bézout 算式链。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { extGcd, type ExtGcdHooks } from './impl.ts';

export const DEFAULT_INPUT: { a: number; b: number } = { a: 252, b: 105 };

/** 录制演示帧序列。 */
export function buildTrace(input: { a: number; b: number } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { a, b } = input;

  // Bézout 算式链（每轮一行）
  const lines: Array<{ key: string; value: string; role?: BarRole }> = [];
  // 滚动展示的当前值（随 hook 推进）
  let curQ = 0;
  let curOldR = a;
  let curR = b;
  let curOldS = 1;
  let curS = 0;
  let curOldT = 0;
  let curT = 1;

  const auxRows = (note: { zh: string; en: string }): void => {
    const aux = [
      { label: 'a (被除)', value: String(curOldR), role: 'compare' as BarRole },
      { label: 'b (除数)', value: String(curR), role: 'frontier' as BarRole },
      { label: 'q = ⌊a/b⌋', value: curR === 0 ? '—' : String(curQ), role: 'pivot' as BarRole },
      {
        label: 'r = a-q·b',
        value: curR === 0 ? '0' : String(curOldR - curQ * curR),
        role: 'warn' as BarRole,
      },
      { label: 'x (s)', value: `${curOldS} / ${curS}`, role: 'default' as BarRole },
      { label: 'y (t)', value: `${curOldT} / ${curT}`, role: 'default' as BarRole },
    ];
    rec.begin(note).setAux(aux).setMap(lines.slice()).commit();
  };

  lines.push({
    key: '初始',
    value: `gcd(${a}, ${b})，求 x,y 使 ${a}·x + ${b}·y = gcd`,
    role: 'default',
  });
  auxRows({
    zh: `求 gcd(${a}, ${b}) 与 Bézout 系数`,
    en: `Compute gcd(${a}, ${b}) and Bézout coeffs`,
  });

  let steps = 0;
  const hooks: ExtGcdHooks = {
    onStep: (q, oldR, r, oldS, s, oldT, t) => {
      steps++;
      curQ = q;
      curOldR = oldR;
      curR = r;
      curOldS = oldS;
      curS = s;
      curOldT = oldT;
      curT = t;
      lines.push({
        key: `第 ${steps} 轮`,
        value: `${oldR} = ${q}·${r} + ${oldR - q * r}`,
        role: 'default',
      });
      auxRows({
        zh: `${oldR} ÷ ${r} = ${q} 余 ${oldR - q * r}；滚动更新 s,t`,
        en: `${oldR} ÷ ${r} = ${q} r ${oldR - q * r}; roll s,t forward`,
      });
    },
    onDone: (g, x, y) => {
      lines.push({
        key: '结果',
        value: `gcd = ${g}，Bézout：${a}·(${x}) + ${b}·(${y}) = ${g}`,
        role: 'final',
      });
      rec
        .begin({ zh: `GCD = ${g}，x=${x}, y=${y}`, en: `GCD = ${g}, x=${x}, y=${y}` })
        .setAux([
          { label: 'gcd', value: String(g), role: 'final' as BarRole },
          { label: 'x', value: String(x), role: 'final' as BarRole },
          { label: 'y', value: String(y), role: 'final' as BarRole },
          {
            label: '校验',
            value: `${a}·${x} + ${b}·${y} = ${a * x + b * y}`,
            role: 'default' as BarRole,
          },
        ])
        .setMap(lines.slice())
        .commit();
    },
  };

  extGcd(a, b, hooks);

  return rec.build();
}
