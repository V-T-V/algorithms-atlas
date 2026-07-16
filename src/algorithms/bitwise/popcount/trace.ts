// =============================================================================
// 位计数 · 录制帧序列
// 通过 popcountKernighan 的钩子，把逐位清除过程录成 Frame[]。
// 可视化：setArray 渲染二进制位（每位 0/1），pointers 标当前被清的位；
// setAux 展示当前 n、其二进制、已清掉 1 的个数。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { popcountKernighan, popcountTable, toBinaryString, type PopcountHooks } from './impl.ts';

export const DEFAULT_INPUT = 182; // 10110110 → 5 个 1

/** 录制演示帧序列。 */
export function buildTrace(n: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const binStr = toBinaryString(n);
  const width = binStr.length;

  /** 用一个 length=width 的「位值数组」(每位 0/1) 渲染当前状态。
   *  currentBitIndex：当前正在清除的位（从右起 0-based 低位下标）。 */
  const renderBits = (curN: number, clearedLowBitIndex?: number, pointerLabel?: string): void => {
    const curBin = toBinaryString(curN).padStart(width, '0');
    // values：从高位到低位，每位 0/1
    const values: number[] = [];
    const roles: BarRole[] = [];
    for (let i = 0; i < width; i++) {
      const bit = Number(curBin[i]!);
      values.push(bit);
      roles.push(bit === 1 ? 'frontier' : 'default');
    }
    const pointers: Array<{ index: number; label: string }> = [];
    if (clearedLowBitIndex !== undefined && pointerLabel) {
      // clearedLowBitIndex 是从右起（低位 0-based），数组是从左（高位）排
      pointers.push({ index: width - 1 - clearedLowBitIndex, label: pointerLabel });
    }
    rec
      .begin({
        zh: `当前 n = ${curN}（二进制 ${curBin}）`,
        en: `Current n = ${curN} (binary ${curBin})`,
      })
      .setArray(values, roles, pointers)
      .setAux([
        { label: 'n（十进制）', value: String(curN), role: 'pivot' },
        { label: 'n（二进制）', value: curBin, role: 'pivot' },
        {
          label: 'n & -n',
          value: clearedLowBitIndex !== undefined ? String(Math.pow(2, clearedLowBitIndex)) : '-',
          role: 'compare',
        },
      ])
      .commit();
  };

  rec
    .begin({
      zh: `目标：统计 ${n} 的二进制 ${binStr} 中 1 的个数`,
      en: `Goal: count the 1-bits of ${n} (binary ${binStr})`,
    })
    .setAux([
      { label: '输入 n', value: String(n), role: 'pivot' },
      { label: '二进制', value: binStr, role: 'pivot' },
      { label: '位数', value: String(width) },
    ])
    .commit();

  // —— Brian Kernighan 法：逐位清除 ——
  rec
    .begin({
      zh: '方法一：Brian Kernighan 法 —— n & (n-1) 每次清掉最低位的 1',
      en: 'Method 1: Brian Kernighan — n & (n-1) clears the lowest set bit each time',
    })
    .setAux([{ label: '方法', value: "Brian Kernighan's", role: 'pivot' }])
    .commit();

  const hooks: PopcountHooks = {
    onBit: (curN, lowValue) => {
      // lowValue = 1 << 低位下标；算出低位下标
      const lowIndex = Math.log2(lowValue);
      renderBits(curN, lowIndex, '最低位1 low-bit');
    },
    onClear: (clearedN) => {
      renderBits(clearedN, undefined);
    },
  };

  const kCount = popcountKernighan(n, hooks);

  rec
    .begin({
      zh: `Kernighan 法完成：共清除了 ${kCount} 个 1`,
      en: `Kernighan done: cleared ${kCount} one-bit(s)`,
    })
    .setAux([
      { label: '方法一结果', value: String(kCount), role: 'final' },
      { label: '循环次数', value: String(kCount), role: 'final' },
    ])
    .commit();

  // —— 查表法：直接给出结果（对比） ——
  const tCount = popcountTable(n);
  rec
    .begin({
      zh: `方法二：查表法（256 项表，每字节查表累加）→ 同样得到 ${tCount}`,
      en: `Method 2: lookup table (256-entry, per byte) → also yields ${tCount}`,
    })
    .setAux([
      { label: '方法二结果', value: String(tCount), role: 'final' },
      { label: '查表次数', value: String(Math.ceil(width / 8)), role: 'final' },
      { label: '两种方法一致', value: kCount === tCount ? '✓' : '✗', role: 'final' },
    ])
    .commit();

  // 终态
  rec
    .begin({ zh: `完成：${n} 共有 ${kCount} 个 1`, en: `Done: ${n} has ${kCount} one-bit(s)` })
    .setAux([{ label: 'popcount', value: String(kCount), role: 'final' }])
    .commit();

  return rec.build();
}
