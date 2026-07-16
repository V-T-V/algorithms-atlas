// =============================================================================
// Hopscotch 哈希 · 录制帧序列
// 用 setArray 展示哈希槽，setAux 展示每槽的 hop 位图（H 位）。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { hopscotch, hash, type HopscotchHooks, type Slot } from './impl.ts';
import { DEFAULT_H } from './impl.ts';

export const DEFAULT_INPUT = [10, 22, 31, 4, 15, 28, 17];
export const DEFAULT_SIZE = 11;

function render(
  slots: Slot[],
  bitmap: number[],
  H: number,
  curHome: number,
  freeSlot: number | null,
  placeSlot: number | null,
  moveFrom: number | null,
  moveTo: number | null,
): { values: number[]; roles: BarRole[] } {
  const values = slots.map((s) => (s === null ? -1 : s.key));
  const roles: BarRole[] = slots.map(() => 'default');
  // 标记 curHome 的窗口
  if (curHome >= 0) {
    for (let off = 0; off < H; off++) {
      const idx = (curHome + off) % slots.length;
      if (roles[idx] === 'default') roles[idx] = 'frontier';
    }
    roles[curHome] = 'pivot';
  }
  if (freeSlot !== null && roles[freeSlot] === 'frontier') roles[freeSlot] = 'compare';
  if (moveFrom !== null) roles[moveFrom] = 'swap';
  if (moveTo !== null) roles[moveTo] = 'swap';
  if (placeSlot !== null) roles[placeSlot] = 'final';
  return { values, roles };
}

function hopStr(bitmap: number[], i: number, H: number): string {
  let s = '';
  for (let b = 0; b < H; b++) s += ((bitmap[i]! >> b) & 1).toString();
  return s.split('').reverse().join('');
}

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT, size: number = DEFAULT_SIZE): Frame[] {
  const rec = new TraceRecorder();
  const H = DEFAULT_H;
  const slots: Slot[] = new Array(size).fill(null);
  const bitmap: number[] = new Array(size).fill(0);
  let curHome = -1;
  let freeSlot: number | null = null;
  let placeSlot: number | null = null;
  let moveFrom: number | null = null;
  let moveTo: number | null = null;

  const snapshot = (note: { zh: string; en: string }): void => {
    const { values, roles } = render(
      slots,
      bitmap,
      H,
      curHome,
      freeSlot,
      placeSlot,
      moveFrom,
      moveTo,
    );
    const pointers: Array<{ index: number; label: string }> = [];
    if (placeSlot !== null) pointers.push({ index: placeSlot, label: '落地' });
    else if (moveFrom !== null) pointers.push({ index: moveFrom, label: '移出' });
    if (moveTo !== null) pointers.push({ index: moveTo, label: '移入' });
    if (freeSlot !== null && !pointers.some((p) => p.index === freeSlot)) {
      pointers.push({ index: freeSlot, label: '空槽' });
    }
    if (curHome >= 0 && !pointers.some((p) => p.index === curHome)) {
      pointers.push({ index: curHome, label: 'home' });
    }
    const aux: Array<{ label: string; value: string; role?: BarRole }> = [
      { label: '邻域 H', value: String(H), role: 'pivot' },
      { label: '表大小', value: String(size), role: 'default' },
    ];
    for (let i = 0; i < size; i++) {
      aux.push({ label: `hop[${i}]`, value: hopStr(bitmap, i, H), role: 'compare' });
    }
    rec.begin(note).setArray(values, roles, pointers).setAux(aux).commit();
    freeSlot = null;
    placeSlot = null;
    moveFrom = null;
    moveTo = null;
  };

  snapshot({
    zh: `Hopscotch 哈希表大小 ${size}，邻域 H=${H}，插入序列：${input.join(', ')}`,
    en: `Hopscotch table size ${size}, neighborhood H=${H}, insert: ${input.join(', ')}`,
  });

  const hooks: HopscotchHooks = {
    onHash: (key, home) => {
      curHome = home;
      snapshot({
        zh: `插入 ${key}：hash = ${home}，窗口 [${home}..${home}+${H})`,
        en: `Insert ${key}: hash = ${home}, window [${home}..${home}+${H})`,
      });
    },
    onFreeSlot: (slot) => {
      freeSlot = slot;
      snapshot({
        zh: `线性探测找到空槽 ${slot}`,
        en: `Linear probe found free slot ${slot}`,
      });
    },
    onMove: (key, from, to) => {
      // impl 已在调用 hook 前完成移动，这里只记录高亮
      moveFrom = from;
      moveTo = to;
      snapshot({
        zh: `挪动 ${key}：槽 ${from} → 槽 ${to}（仍在它的窗口内）`,
        en: `Move ${key}: slot ${from} → slot ${to} (still within its window)`,
      });
    },
    onPlace: (key, slot, home) => {
      slots[slot] = { key, home };
      placeSlot = slot;
      snapshot({
        zh: `${key} 落地槽 ${slot}（home=${home}，在窗口内）`,
        en: `${key} placed at slot ${slot} (home=${home}, within window)`,
      });
      curHome = -1;
    },
    onFail: (key) => {
      snapshot({
        zh: `插入 ${key} 失败：窗口内无法腾位`,
        en: `Insert ${key} failed: cannot make room within window`,
      });
      curHome = -1;
    },
  };

  const result = hopscotch(input, size, H, hooks);

  // 终态
  const values = slots.map((s) => (s === null ? -1 : s.key));
  const roles: BarRole[] = slots.map((s) => (s === null ? 'default' : 'final'));
  const aux: Array<{ label: string; value: string; role?: BarRole }> = [
    { label: '已插入', value: String(slots.filter((s) => s !== null).length), role: 'final' },
    { label: '失败数', value: String(result.failed.length), role: 'warn' },
  ];
  for (let i = 0; i < size; i++) {
    aux.push({ label: `hop[${i}]`, value: hopStr(bitmap, i, H), role: 'final' });
  }
  rec
    .begin({
      zh: `完成：插入 ${input.length} 键${result.failed.length ? `，失败 ${result.failed.length}` : ''}`,
      en: `Done: ${input.length} keys inserted${result.failed.length ? `, ${result.failed.length} failed` : ''}`,
    })
    .setArray(values, roles, [])
    .setAux(aux)
    .commit();

  return rec.build();
}

export { hash };
