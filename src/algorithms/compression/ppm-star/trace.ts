// =============================================================================
// PPM* 风格变体 · 录制帧序列
// setArray 展示输入码点流 + 当前指针；setAux 展示当前符号、阶、概率、累计 bit。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { ppmStar, toCodePoints, type PpmHooks } from './impl.ts';

export const DEFAULT_INPUT = 'AABABC';

function vis(c: number): string {
  if (c < 32 || c > 126) return `·${c}`;
  return String.fromCodePoint(c);
}

export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const data = toCodePoints(input);
  let pos = 0;
  let accBits = 0;

  const snapshot = (
    note: { zh: string; en: string },
    extra?: Array<{ label: string; value: string; role?: BarRole }>,
  ): void => {
    const roles: BarRole[] = data.map((_, i) =>
      i < pos ? 'final' : i === pos ? 'pivot' : 'default',
    );
    const pointers: Array<{ index: number; label: string }> = [];
    if (pos < data.length) pointers.push({ index: pos, label: 'pos' });
    const aux: Array<{ label: string; value: string; role?: BarRole }> = [
      { label: '累计 bit', value: accBits.toFixed(3), role: 'pivot' as BarRole },
    ];
    if (extra) aux.push(...extra);
    rec
      .begin(note)
      .setArray([...data], roles, pointers)
      .setAux(aux)
      .commit();
  };

  rec
    .begin({ zh: `输入「${input}」，最大阶 2`, en: `Input "${input}", maxOrder=2` })
    .setAux([{ label: '说明', value: 'order-2 PPM with escape', role: 'pivot' }])
    .commit();

  const hooks: PpmHooks = {
    onPredict: (p, symbol, order, probability, bits) => {
      pos = p;
      accBits += bits;
      snapshot(
        {
          zh: `符号 '${vis(symbol)}'：阶 ${order}，p=${probability.toFixed(3)}，${bits.toFixed(3)} bit`,
          en: `Symbol '${vis(symbol)}': order ${order}, p=${probability.toFixed(3)}, ${bits.toFixed(3)} bit`,
        },
        [
          { label: '符号', value: vis(symbol), role: 'compare' as BarRole },
          { label: '阶 / order', value: String(order), role: 'frontier' as BarRole },
          { label: 'p', value: probability.toFixed(3), role: 'compare' as BarRole },
          { label: '本步 bit', value: bits.toFixed(3), role: 'final' as BarRole },
        ],
      );
      pos = p + 1;
    },
    onEscape: () => {
      // 退避事件不单独出帧（合并在 predict 里）
    },
  };

  const result = ppmStar(input, 2, hooks);

  rec
    .begin({
      zh: `完成：累计 ${result.totalBits.toFixed(3)} bit`,
      en: `Done: ${result.totalBits.toFixed(3)} bits total`,
    })
    .setAux([
      { label: '总 bit', value: result.totalBits.toFixed(3), role: 'final' as BarRole },
      {
        label: '每符号平均',
        value: (result.totalBits / Math.max(1, data.length)).toFixed(3),
        role: 'final' as BarRole,
      },
    ])
    .commit();

  return rec.build();
}
