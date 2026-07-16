// =============================================================================
// Robin Hood 哈希 · 录制帧序列
// 用 setArray 展示哈希槽（key:psl），role 标 空/占用/探测/抢占/落地。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { robinHood, hash, type RobinHoodHooks, type Slot } from './impl.ts';

export const DEFAULT_INPUT = [10, 22, 31, 4, 15, 28, 17];
export const DEFAULT_SIZE = 7; // 素数，便于产生冲突

function render(
  slots: Slot[],
  curHash: number,
  probeSlots: Set<number>,
  placeSlot: number | null,
  evictSlot: number | null,
): { values: number[]; roles: BarRole[]; labels: string[] } {
  const values = slots.map((s) => (s === null ? -1 : s.key));
  const roles: BarRole[] = slots.map(() => 'default');
  const labels = slots.map((s) => (s === null ? '∅' : `${s.key}:psl${s.psl}`));
  for (const p of probeSlots) {
    if (slots[p] !== null) roles[p] = 'warn';
    else roles[p] = 'compare';
  }
  if (curHash >= 0 && roles[curHash] === 'default') roles[curHash] = 'frontier';
  if (evictSlot !== null) roles[evictSlot] = 'swap';
  if (placeSlot !== null) roles[placeSlot] = 'final';
  return { values, roles, labels };
}

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT, size: number = DEFAULT_SIZE): Frame[] {
  const rec = new TraceRecorder();
  const slots: Slot[] = new Array(size).fill(null);
  let curHash = -1;
  let probeSlots = new Set<number>();
  let placeSlot: number | null = null;
  let evictSlot: number | null = null;
  let maxPsl = 0;

  const snapshot = (note: { zh: string; en: string }): void => {
    const { values, roles, labels } = render(slots, curHash, probeSlots, placeSlot, evictSlot);
    const pointers: Array<{ index: number; label: string }> = [];
    if (placeSlot !== null) pointers.push({ index: placeSlot, label: '落地' });
    else if (evictSlot !== null) pointers.push({ index: evictSlot, label: '抢占' });
    else if (probeSlots.size > 0) {
      const last = [...probeSlots].pop()!;
      pointers.push({ index: last, label: '探测' });
    }
    if (curHash >= 0 && !pointers.some((p) => p.index === curHash)) {
      pointers.push({ index: curHash, label: 'hash' });
    }
    rec
      .begin(note)
      .setArray(values, roles, pointers)
      .setAux([
        { label: '表大小', value: String(size), role: 'pivot' as BarRole },
        { label: '当前最大 PSL', value: String(maxPsl), role: 'warn' as BarRole },
        {
          label: '已插入',
          value: String(slots.filter((s) => s !== null).length),
          role: 'default' as BarRole,
        },
        ...labels
          .map((l, i) => ({ l, i }))
          .filter((x) => slots[x.i] !== null)
          .map((x) => ({
            label: `[${x.i}]`,
            value: x.l,
            role: 'sorted' as BarRole,
          })),
      ])
      .commit();
    probeSlots = new Set();
    placeSlot = null;
    evictSlot = null;
  };

  snapshot({
    zh: `Robin Hood 哈希表大小 ${size}（hash = key % ${size}），插入序列：${input.join(', ')}`,
    en: `Robin Hood table size ${size} (hash = key % ${size}), insert: ${input.join(', ')}`,
  });

  const hooks: RobinHoodHooks = {
    onHash: (key, slot) => {
      curHash = slot;
      probeSlots = new Set();
      snapshot({
        zh: `插入 ${key}：hash = ${key} % ${size} = ${slot}`,
        en: `Insert ${key}: hash = ${key} % ${size} = ${slot}`,
      });
    },
    onProbe: (slot, step, residentPsl) => {
      probeSlots.add(slot);
      snapshot({
        zh: `探测槽 ${slot}（psl=${step}），resident psl=${residentPsl}`,
        en: `Probe slot ${slot} (psl=${step}), resident psl=${residentPsl}`,
      });
    },
    onEvict: (residentKey, slot, residentPsl) => {
      evictSlot = slot;
      snapshot({
        zh: `抢占：踢出 ${residentKey}（psl=${residentPsl} < 当前），换位继续`,
        en: `Displace: evict ${residentKey} (psl=${residentPsl} < current), continue`,
      });
    },
    onPlace: (key, slot, psl) => {
      slots[slot] = { key, psl };
      if (psl > maxPsl) maxPsl = psl;
      placeSlot = slot;
      snapshot({
        zh: `${key} 落地槽 ${slot}（psl=${psl}）`,
        en: `${key} placed at slot ${slot} (psl=${psl})`,
      });
    },
  };

  const result = robinHood(input, size, hooks);
  maxPsl = result.maxPsl;

  // 终态
  const values = slots.map((s) => (s === null ? -1 : s.key));
  const roles: BarRole[] = slots.map((s) => (s === null ? 'default' : 'final'));
  rec
    .begin({
      zh: `完成：插入 ${input.length} 键，最大 PSL = ${result.maxPsl}${result.failed.length ? `，失败 ${result.failed.length}` : ''}`,
      en: `Done: ${input.length} keys, max PSL = ${result.maxPsl}${result.failed.length ? `, ${result.failed.length} failed` : ''}`,
    })
    .setArray(values, roles, [])
    .setAux([
      { label: '最大 PSL', value: String(result.maxPsl), role: 'final' as BarRole },
      {
        label: '已插入数',
        value: String(slots.filter((s) => s !== null).length),
        role: 'final' as BarRole,
      },
      ...slots
        .map((s, i) => ({ s, i }))
        .filter((x) => x.s !== null)
        .map((x) => ({
          label: `[${x.i}]`,
          value: `${x.s!.key}:psl${x.s!.psl}`,
          role: 'final' as BarRole,
        })),
    ])
    .commit();

  return rec.build();
}

export { hash };
