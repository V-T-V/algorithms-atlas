// =============================================================================
// 布谷鸟哈希 · 录制帧序列
// 用 setArray 展示表0（主表，放置='final'，踢出='swap'），
// setAux 展示表1 内容 + 踢出统计（次数/最大链）。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { cuckoo, hash1, hash2Int, type CuckooHooks, type Slot } from './impl.ts';

export const DEFAULT_INPUT = [20, 50, 53, 30, 23, 26, 17, 13];
export const DEFAULT_SIZE = 11; // 素数槽位，演示踢出

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT, size: number = DEFAULT_SIZE): Frame[] {
  const rec = new TraceRecorder();
  const table0: Slot[] = new Array(size).fill(null);
  const table1: Slot[] = new Array(size).fill(null);
  let kicks = 0;
  let maxChain = 0;
  let curChain = 0;
  let highlight0 = -1;
  let highlight1 = -1;
  let kickedSlot = -1;
  let kickedTable: 0 | 1 = 0;

  const renderTable0 = (): { values: number[]; roles: BarRole[] } => {
    const values = table0.map((s) => (s === null ? -1 : s));
    const roles: BarRole[] = table0.map((s, i) => {
      if (i === kickedSlot && kickedTable === 0) return 'swap';
      if (s !== null && i === highlight0) return 'final';
      if (s !== null) return 'sorted';
      return 'default';
    });
    return { values, roles };
  };

  const renderTable1 = () =>
    table1.map((s, i) => ({
      label: `T1[${i}]`,
      value: s === null ? '∅' : String(s),
      role: (i === kickedSlot && kickedTable === 1
        ? 'swap'
        : s !== null && i === highlight1
          ? 'final'
          : s !== null
            ? 'sorted'
            : 'default') as BarRole,
    }));

  const snapshot = (note: { zh: string; en: string }): void => {
    const { values, roles } = renderTable0();
    const pointers: Array<{ index: number; label: string }> = [];
    if (highlight0 >= 0) pointers.push({ index: highlight0, label: 'h1' });
    else if (kickedSlot >= 0 && kickedTable === 0)
      pointers.push({ index: kickedSlot, label: '踢' });
    const aux = [
      ...renderTable1(),
      { label: '总踢出次数', value: String(kicks), role: 'pivot' as BarRole },
      { label: '当前链长', value: String(curChain), role: 'compare' as BarRole },
      { label: '最大踢出链', value: String(maxChain), role: 'warn' as BarRole },
    ];
    rec.begin(note).setArray(values, roles, pointers).setAux(aux).commit();
    highlight0 = -1;
    highlight1 = -1;
    kickedSlot = -1;
  };

  snapshot({
    zh: `布谷鸟哈希：两张表各 ${size} 槽，插入序列 ${input.join(', ')}`,
    en: `Cuckoo hash: two tables of ${size} slots, insert ${input.join(', ')}`,
  });

  const hooks: CuckooHooks = {
    onHash: (key, h1, h2) => {
      curChain = 0;
      highlight0 = h1;
      highlight1 = h2;
      snapshot({
        zh: `插入 ${key}：h1=${h1}, h2=${h2}`,
        en: `Insert ${key}: h1=${h1}, h2=${h2}`,
      });
    },
    onPlace: (t, slot, key) => {
      if (t === 0) {
        table0[slot] = key;
        highlight0 = slot;
      } else {
        table1[slot] = key;
        highlight1 = slot;
      }
      snapshot({
        zh: `${key} 放入 T${t}[${slot}]`,
        en: `${key} placed at T${t}[${slot}]`,
      });
    },
    onKick: (t, slot, key) => {
      kicks++;
      curChain++;
      if (curChain > maxChain) maxChain = curChain;
      kickedSlot = slot;
      kickedTable = t;
      snapshot({
        zh: `踢出 ${key}（从 T${t}[${slot}]），换表重试`,
        en: `Kick ${key} (from T${t}[${slot}]), retry other table`,
      });
    },
  };

  const result = cuckoo(input, size, hooks);
  kicks = result.kicks;
  maxChain = result.maxChain;

  // 终态：两表全展示
  const values0 = table0.map((s) => (s === null ? -1 : s));
  const roles0: BarRole[] = table0.map((s) => (s === null ? 'default' : 'final'));
  rec
    .begin({
      zh: `完成：插入 ${input.length} 键，踢出 ${result.kicks} 次，最大链 ${result.maxChain}${result.failed.length ? `，失败 ${result.failed.length}` : ''}`,
      en: `Done: ${input.length} keys, ${result.kicks} kicks, max chain ${result.maxChain}${result.failed.length ? `, ${result.failed.length} failed` : ''}`,
    })
    .setArray(values0, roles0, [])
    .setAux([
      ...table1.map((s, i) => ({
        label: `T1[${i}]`,
        value: s === null ? '∅' : String(s),
        role: (s === null ? 'default' : 'final') as BarRole,
      })),
      { label: '总踢出次数', value: String(result.kicks), role: 'final' as BarRole },
      { label: '最大踢出链', value: String(result.maxChain), role: 'final' as BarRole },
    ])
    .commit();

  return rec.build();
}

/** 暴露哈希函数便于外部校验。 */
export { hash1, hash2Int };
