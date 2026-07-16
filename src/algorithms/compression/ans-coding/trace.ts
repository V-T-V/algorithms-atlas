// =============================================================================
// 非对称数制编码 rANS · 录制帧序列
// setArray 展示输入符号流 + 当前指针；setAux 展示当前状态 x 与频率表。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { buildModel, ransDecode, ransEncode, type AnsHooks } from './impl.ts';

export const DEFAULT_INPUT = [0, 1, 0, 0, 1, 0, 2];

function vis(c: number): string {
  return String(c);
}

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  // 静态频率表（从输入统计）
  const freq = new Map<number, number>();
  for (const s of input) freq.set(s, (freq.get(s) ?? 0) + 1);
  // 至少给 0/1/2 各一份非零频率，便于演示
  for (const s of [0, 1, 2]) if (!freq.has(s)) freq.set(s, 1);
  const model = buildModel(freq);

  let pos = 0;
  const x = model.M;
  const xs: number[] = [model.M];

  const snapshot = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = input.map((_, i) =>
      i < pos ? 'final' : i === pos ? 'pivot' : 'default',
    );
    const pointers: Array<{ index: number; label: string }> = [];
    if (pos < input.length) pointers.push({ index: pos, label: 'i' });
    rec
      .begin(note)
      .setArray([...input], roles, pointers)
      .setAux([
        { label: '状态 x', value: String(x), role: 'pivot' as BarRole },
        { label: 'M (总频率)', value: String(model.M), role: 'frontier' as BarRole },
        {
          label: '频率表',
          value: model.symbols.map((s) => `${vis(s)}:${model.freq.get(s)}`).join(' '),
          role: 'sorted' as BarRole,
        },
      ])
      .commit();
  };

  rec
    .begin({
      zh: `输入符号流 [${input.join(',')}]，初始 x = M = ${model.M}`,
      en: `Symbols [${input.join(',')}], x0 = M = ${model.M}`,
    })
    .setAux([{ label: '说明', value: 'rANS (no renorm)', role: 'pivot' }])
    .commit();

  snapshot({ zh: `开始编码`, en: `Start encoding` });

  const encHooks: AnsHooks = {
    onEncode: (symbol, xBefore, xAfter) => {
      xs.push(xAfter);
      snapshot({
        zh: `编码符号 ${vis(symbol)}：x ${xBefore} → ${xAfter}`,
        en: `Encode ${vis(symbol)}: x ${xBefore} -> ${xAfter}`,
      });
      pos++;
    },
  };
  const finalX = ransEncode(input, model, encHooks);

  // 解码验证
  const decoded = ransDecode(finalX, input.length, model);

  rec
    .begin({ zh: `完成：最终 x = ${finalX}`, en: `Done: final x = ${finalX}` })
    .setMap([
      { key: '输入', value: input.join(','), role: 'default' as BarRole },
      { key: '最终 x', value: String(finalX), role: 'final' as BarRole },
      {
        key: '解码还原',
        value: decoded.join(','),
        role: decoded.join(',') === input.join(',') ? ('final' as BarRole) : ('warn' as BarRole),
      },
    ])
    .commit();

  return rec.build();
}
