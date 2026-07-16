// =============================================================================
// 编辑距离（带操作回溯）· 录制帧序列
// 回溯出操作序列后，用 setArray 展示 a，pointers 标注当前处理位置；
// setAux 逐步展示「已对齐」的操作。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { editDistance2, type EditOp } from './impl.ts';

export const DEFAULT_INPUT: { a: string; b: string } = {
  a: 'sunday',
  b: 'saturday',
};

const CODE = (s: string): number[] => Array.from(s, (c) => c.charCodeAt(0));

const opZh: Record<EditOp, string> = {
  keep: '保留',
  replace: '替换',
  insert: '插入',
  delete: '删除',
};
const opEn: Record<EditOp, string> = {
  keep: 'keep',
  replace: 'replace',
  insert: 'insert',
  delete: 'delete',
};

/** 录制演示帧序列。 */
export function buildTrace(input: { a: string; b: string } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { a, b } = input;
  const n = a.length;

  // 先跑一遍拿到 ops
  const { distance, ops } = editDistance2(a, b);

  rec
    .begin({
      zh: `把 "${a}" 变成 "${b}"，编辑距离 = ${distance}`,
      en: `Turn "${a}" into "${b}", edit distance = ${distance}`,
    })
    .setArray(CODE(a), new Array(n).fill('default'), [])
    .setAux([
      { label: 'a', value: a, role: 'default' },
      { label: 'b', value: b, role: 'default' },
      { label: '距离 / distance', value: `${distance}`, role: 'frontier' },
    ])
    .commit();

  // 按操作序列回放（ops 与 a 的字符按位置对齐推进）
  const applied: string[] = [];
  let ai = 0; // a 的消费指针
  const replay = (idx: number, op: EditOp): void => {
    const roles: BarRole[] = new Array(n).fill('default');
    if (ai < n) roles[ai] = op === 'delete' ? 'swap' : op === 'replace' ? 'warn' : 'compare';
    const pointers: Array<{ index: number; label: string }> =
      ai < n ? [{ index: ai, label: 'a' }] : [];
    applied.push(opEn[op]);
    rec
      .begin({
        zh: `${opZh[op]}：a[${ai}]（操作 ${idx + 1}/${ops.length}）`,
        en: `${opEn[op]}: a[${ai}] (step ${idx + 1}/${ops.length})`,
      })
      .setArray(CODE(a), roles, pointers)
      .setAux([
        { label: 'a', value: a, role: 'default' },
        { label: 'b', value: b, role: 'default' },
        { label: '已执行 / ops', value: applied.join(' → '), role: 'frontier' },
      ])
      .commit();
    if (op !== 'insert') ai++;
  };

  ops.forEach((op, idx) => replay(idx, op));

  // 终态
  rec
    .begin({
      zh: `完成：共 ${ops.length} 步，距离 ${distance}`,
      en: `Done: ${ops.length} steps, distance ${distance}`,
    })
    .setArray(CODE(a), new Array(n).fill('final'), [])
    .setAux([
      { label: 'a', value: a, role: 'default' },
      { label: 'b', value: b, role: 'final' },
      { label: '操作序列 / ops', value: applied.join(' → '), role: 'final' },
    ])
    .commit();

  return rec.build();
}
