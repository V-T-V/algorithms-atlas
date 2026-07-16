// 位图索引 · 录制帧序列

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { BitmapIndex, type BitmapIndexHooks } from './impl.ts';

export const DEFAULT_INPUT = {
  size: 16,
  addValues: [3, 1, 7, 5, 1, 12],
  queryValues: [1, 2, 7, 12],
  removeValues: [5, 9],
};

export function buildTrace(
  input: {
    size: number;
    addValues: number[];
    queryValues: number[];
    removeValues: number[];
  } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { size, addValues, queryValues, removeValues } = input;
  // 用 size 个柱子表示每个值的位（0/1）
  const bits: number[] = new Array(size).fill(0);
  let highlight = -1;
  let action = '';

  const render = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = bits.map((b, i) => {
      if (i === highlight)
        return action === 'query' ? 'compare' : action === 'remove' ? 'warn' : 'final';
      return b === 1 ? 'sorted' : 'default';
    });
    rec
      .begin(note)
      .setBars(bits.map((b, i) => ({ value: b, role: roles[i]!, label: String(i) })))
      .setAux([
        { label: '位图大小', value: String(size), role: 'pivot' as BarRole },
        {
          label: '已置 1 个数',
          value: String(bits.reduce((s, x) => s + x, 0)),
          role: 'frontier' as BarRole,
        },
        {
          label: '当前高亮',
          value: highlight >= 0 ? `位 ${highlight}` : '-',
          role: 'compare' as BarRole,
        },
      ])
      .commit();
    highlight = -1;
  };

  render({ zh: `构造位图，值域 0..${size - 1}`, en: `Build bitmap, range 0..${size - 1}` });

  const hooks: BitmapIndexHooks = {
    onAdd: (v) => {
      bits[v] = 1;
      highlight = v;
      action = 'add';
      render({ zh: `add(${v})：第 ${v} 位置 1`, en: `add(${v}): set bit ${v}` });
    },
    onQuery: (v, present) => {
      highlight = v;
      action = 'query';
      render({
        zh: `has(${v}) → ${present ? '存在' : '不存在'}`,
        en: `has(${v}) → ${present ? 'present' : 'absent'}`,
      });
    },
    onRemove: (v) => {
      bits[v] = 0;
      highlight = v;
      action = 'remove';
      render({ zh: `remove(${v})：第 ${v} 位置 0`, en: `remove(${v}): clear bit ${v}` });
    },
  };

  const bm = new BitmapIndex(size, hooks);
  addValues.forEach((v) => bm.add(v));
  queryValues.forEach((v) => bm.has(v));
  removeValues.forEach((v) => bm.remove(v));

  rec
    .begin({
      zh: `完成：剩余元素 [${bm.toArray().join(', ')}]`,
      en: `Done: remaining [${bm.toArray().join(', ')}]`,
    })
    .setBars(
      bits.map((b, i) => ({
        value: b,
        role: (b === 1 ? 'final' : 'default') as BarRole,
        label: String(i),
      })),
    )
    .setAux([{ label: '集合', value: `[${bm.toArray().join(', ')}]`, role: 'final' as BarRole }])
    .commit();

  return rec.build();
}
