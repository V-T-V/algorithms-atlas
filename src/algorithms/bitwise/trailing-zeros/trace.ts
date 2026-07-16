// =============================================================================
// ctz · 录制帧序列
// setArray 展示 32 位二进制；setAux 展示最低位 1 与查表索引。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { ctz, toBinary32, type CtzHooks } from './impl.ts';

export const DEFAULT_INPUT = 0b00000000_00000000_00000000_01011000; // 88 → ctz=3

export function buildTrace(n: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const width = 32;
  const binStr = toBinary32(n);

  const renderBits = (highlightBit?: number): void => {
    const values: number[] = [];
    const roles: BarRole[] = [];
    for (let i = 0; i < width; i++) {
      const bit = Number(binStr[i]!);
      values.push(bit);
      let role: BarRole = 'default';
      if (bit === 1) role = 'frontier';
      if (highlightBit !== undefined && i === highlightBit) role = 'pivot';
      roles.push(role);
    }
    rec
      .begin({
        zh: `n = ${n}（0b${binStr.slice(-16)}…）`,
        en: `n = ${n} (0b${binStr.slice(-16)}…)`,
      })
      .setArray(values, roles, [])
      .commit();
  };

  rec
    .begin({ zh: `目标：求 ${n} 的 ctz`, en: `Goal: ctz of ${n}` })
    .setAux([
      { label: '输入 n', value: String(n), role: 'pivot' },
      { label: '二进制', value: binStr, role: 'pivot' },
    ])
    .commit();
  renderBits();

  const hooks: CtzHooks = {
    onLowestBit: (_x, lowestBit) => {
      // 最低位 1 在数组里的下标（高位在前）
      const bitIndex = width - 1 - Math.log2(lowestBit);
      rec
        .begin({
          zh: `隔离最低位 1：0b${toBinary32(lowestBit).slice(-8)}`,
          en: `Isolate lowest bit: 0b${toBinary32(lowestBit).slice(-8)}`,
        })
        .setAux([{ label: '最低位 1', value: String(lowestBit), role: 'compare' }])
        .commit();
      renderBits(bitIndex);
    },
    onLookup: (index, ctzVal) => {
      rec
        .begin({
          zh: `查表 index=${index} → ctz = ${ctzVal}`,
          en: `Lookup index=${index} -> ctz = ${ctzVal}`,
        })
        .setAux([
          { label: 'de Bruijn index', value: String(index), role: 'frontier' },
          { label: 'ctz', value: String(ctzVal), role: 'final' },
        ])
        .commit();
    },
  };

  const result = ctz(n, hooks);

  rec
    .begin({ zh: `完成：ctz = ${result}`, en: `Done: ctz = ${result}` })
    .setAux([{ label: 'ctz', value: String(result), role: 'final' }])
    .commit();

  return rec.build();
}
