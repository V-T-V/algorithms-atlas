// 区间置位 · 轨迹录制

import { TraceRecorder } from '../../../core/recorder.ts';
import type { BarRole } from '../../../types.ts';
import { setBitsRange, toBinaryString } from './impl.ts';

export function buildTrace() {
  const rec = new TraceRecorder();
  const value = 0b00000000_00000000_00000000_00000000; // 从全 0 开始
  const lo = 4;
  const hi = 9; // 置位 [4, 9] 共 6 位
  const width = 16;

  rec
    .begin({ zh: `输入值（区间 [${lo}, ${hi}]）`, en: `Input (range [${lo}, ${hi}])` })
    .setBars(rec.barsFrom(splitBits(value, width)))
    .setAux([{ label: `值`, value: toBinaryString(value, width) }])
    .commit();

  let shiftedMask = 0;
  setBitsRange(value, lo, hi, {
    onMask: (m) => (shiftedMask = m),
  });

  // 展示掩码
  const maskRoles: Record<number, BarRole> = {};
  for (let i = lo; i <= hi; i++) maskRoles[i] = 'compare';
  rec
    .begin({ zh: `构造区间掩码`, en: `Build range mask` })
    .setBars(rec.barsFrom(splitBits(shiftedMask, width), maskRoles))
    .setAux([
      { label: `掩码`, value: toBinaryString(shiftedMask, width) },
      { label: `区间长`, value: String(hi - lo + 1) },
    ])
    .commit();

  const result = setBitsRange(value, lo, hi);
  rec
    .begin({ zh: `value | mask 得到结果`, en: `value | mask → result` })
    .setBars(rec.barsFrom(splitBits(result, width)))
    .setAux([
      { label: `原值`, value: toBinaryString(value, width) },
      { label: `结果`, value: toBinaryString(result, width) },
    ])
    .commit();

  return rec.build();
}

/** 把整数拆成定宽位列表，最低位在 index 0。 */
function splitBits(n: number, width: number): number[] {
  const out: number[] = [];
  let x = n >>> 0;
  for (let i = 0; i < width; i++) {
    out.push(x & 1);
    x = x >>> 1;
  }
  return out;
}
