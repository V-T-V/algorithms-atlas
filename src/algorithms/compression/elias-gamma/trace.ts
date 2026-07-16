// =============================================================================
// Elias Gamma 编码 · 录制帧序列
// setArray 展示位串（每位 0/1）+ 指针；setAux 展示当前数值与其编码。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { eliasGammaEncode, type EliasGammaHooks } from './impl.ts';

export const DEFAULT_INPUT = [1, 2, 3, 5, 8];

export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const allBits: string[] = [];

  const renderBits = (
    pointerAt?: number,
  ): { values: number[]; roles: BarRole[]; pointers: Array<{ index: number; label: string }> } => {
    const s = allBits.join('');
    const values: number[] = [];
    const roles: BarRole[] = [];
    for (let i = 0; i < s.length; i++) {
      const bit = Number(s[i]!);
      values.push(bit);
      roles.push(bit === 1 ? 'frontier' : 'default');
    }
    const pointers: Array<{ index: number; label: string }> = [];
    if (pointerAt !== undefined && pointerAt < s.length) {
      pointers.push({ index: pointerAt, label: '新位' });
    }
    return { values, roles, pointers };
  };

  rec
    .begin({ zh: `编码 ${input.length} 个正整数`, en: `Encode ${input.length} positive integers` })
    .setAux([{ label: '说明', value: 'k 个 0 + (k+1) 位二进制', role: 'pivot' }])
    .commit();

  for (const v of input) {
    const before = allBits.length;
    const hooks: EliasGammaHooks = {
      onEncode: (_n, bits) => {
        for (const ch of bits) allBits.push(ch);
        const { values, roles, pointers } = renderBits(before);
        rec
          .begin({
            zh: `${_n} = ${bits.length - (_n.toString(2).length - 1)} 个 0 + ${_n.toString(2)} → "${bits}"`,
            en: `${_n} = ${bits.length - (_n.toString(2).length - 1)} zeros + ${_n.toString(2)} -> "${bits}"`,
          })
          .setArray(values, roles, pointers)
          .setAux([
            { label: '当前值', value: String(_n), role: 'pivot' as BarRole },
            { label: '二进制', value: _n.toString(2), role: 'compare' as BarRole },
            { label: '编码', value: bits, role: 'final' as BarRole },
            { label: '累计位串', value: allBits.join(''), role: 'frontier' as BarRole },
          ])
          .commit();
      },
    };
    eliasGammaEncode(v, hooks);
  }

  rec
    .begin({ zh: `完成：累计 ${allBits.length} 位`, en: `Done: ${allBits.length} bits total` })
    .setMap([
      { key: '输入', value: input.join(','), role: 'default' as BarRole },
      { key: '位串', value: allBits.join(''), role: 'final' as BarRole },
    ])
    .commit();

  return rec.build();
}
