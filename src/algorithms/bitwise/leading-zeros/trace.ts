// =============================================================================
// clz · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { clz, toBinary32, type ClzHooks } from './impl.ts';

export const DEFAULT_INPUT = 0b00000000_00000000_00010000_00000000; // clz=15

export function buildTrace(n: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const width = 32;
  const binStr = toBinary32(n);

  const renderBits = (highlightFrom?: number): void => {
    const values: number[] = [];
    const roles: BarRole[] = [];
    for (let i = 0; i < width; i++) {
      const bit = Number(binStr[i]!);
      values.push(bit);
      let role: BarRole = 'default';
      if (bit === 1) role = 'frontier';
      if (highlightFrom !== undefined && i < highlightFrom) role = 'final';
      roles.push(role);
    }
    rec
      .begin({ zh: `n = ${n}`, en: `n = ${n}` })
      .setArray(values, roles, [])
      .commit();
  };

  rec
    .begin({ zh: `目标：求 ${n} 的 clz`, en: `Goal: clz of ${n}` })
    .setAux([
      { label: '输入 n', value: String(n), role: 'pivot' },
      { label: '二进制', value: binStr, role: 'pivot' },
    ])
    .commit();
  renderBits();

  const hooks: ClzHooks = {
    onStage: (stage, mask, isZero, acc) => {
      rec
        .begin({
          zh: `阶段 ${stage}：检查高 ${mask} 位 → ${isZero ? '全 0（累加 ' + mask + '）' : '非全 0'}，当前 clz=${acc}`,
          en: `Stage ${stage}: top ${mask} bits ${isZero ? 'all zero (+' + mask + ')' : 'nonzero'}, clz=${acc}`,
        })
        .setAux([
          { label: '检查位宽', value: String(mask), role: 'compare' },
          { label: '是否全 0', value: String(isZero), role: 'frontier' },
          { label: '当前 clz', value: String(acc), role: 'final' },
        ])
        .commit();
    },
  };

  const result = clz(n, hooks);
  renderBits(result);

  rec
    .begin({ zh: `完成：clz = ${result}`, en: `Done: clz = ${result}` })
    .setAux([{ label: 'clz', value: String(result), role: 'final' }])
    .commit();

  return rec.build();
}
