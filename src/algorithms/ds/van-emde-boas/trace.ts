// =============================================================================
// vEB树 · 录制帧序列
// 用 setArray 展示 {0..U-1} 的位图（1=存在），setAux 展示 min/max 与簇状态。
// 操作元素标 'pivot'，存在元素标 'final'，新增/删除过渡标 'compare'。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { VanEmdeBoas, type VEBHooks } from './impl.ts';

export const DEFAULT_INPUT = {
  universe: 16,
  insert: [5, 2, 8, 1, 9, 3, 12, 7],
  delete: [3, 8],
  query: ['successor' as const, 'predecessor' as const],
  queryVal: [4, 9],
};

/** 录制演示帧序列。 */
export function buildTrace(
  input: {
    universe: number;
    insert?: readonly number[];
    delete?: readonly number[];
    query?: Array<'successor' | 'predecessor'>;
    queryVal?: readonly number[];
  } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const U = input.universe;
  const t = new VanEmdeBoas(U);

  /** 当前集合位图。 */
  const present = new Array<boolean>(U).fill(false);
  let hotIdx = -1;

  const render = (note: { zh: string; en: string }): void => {
    const values = Array.from({ length: U }, (_, i) => i);
    const roles: BarRole[] = values.map((_, i) => (present[i] ? 'final' : 'default'));
    if (hotIdx >= 0) roles[hotIdx] = 'pivot';
    const pointers: Array<{ index: number; label: string }> = [];
    if (t.min() >= 0) pointers.push({ index: t.min(), label: 'min' });
    if (t.max() >= 0 && t.max() !== t.min()) pointers.push({ index: t.max(), label: 'max' });
    rec
      .begin(note)
      .setArray(values, roles, pointers)
      .setAux([
        { label: 'min', value: t.min() >= 0 ? String(t.min()) : '∅', role: 'frontier' as BarRole },
        { label: 'max', value: t.max() >= 0 ? String(t.max()) : '∅', role: 'frontier' as BarRole },
        { label: 'size', value: String(present.filter(Boolean).length), role: 'final' as BarRole },
      ])
      .commit();
  };

  render({ zh: `建 vEB 树，全域 U=${U}`, en: `Build vEB tree, universe U=${U}` });

  const hooks: VEBHooks = {
    onResult: () => {},
  };

  for (const v of input.insert ?? []) {
    hotIdx = v;
    render({ zh: `插入 ${v}`, en: `Insert ${v}` });
    t.insert(v, hooks);
    present[v] = true;
    render({ zh: `已插入 ${v}`, en: `Inserted ${v}` });
  }

  for (const v of input.delete ?? []) {
    hotIdx = v;
    render({ zh: `删除 ${v}`, en: `Delete ${v}` });
    t.delete(v, hooks);
    present[v] = false;
    render({ zh: `已删除 ${v}`, en: `Deleted ${v}` });
  }

  const queries = input.query ?? [];
  for (let i = 0; i < queries.length; i++) {
    const kind = queries[i]!;
    const val = input.queryVal?.[i] ?? 0;
    hotIdx = val;
    if (kind === 'successor') {
      const s = t.successor(val, hooks);
      render({
        zh: `successor(${val}) = ${s >= 0 ? s : '∅'}`,
        en: `successor(${val}) = ${s >= 0 ? s : '∅'}`,
      });
    } else {
      const p = t.predecessor(val, hooks);
      render({
        zh: `predecessor(${val}) = ${p >= 0 ? p : '∅'}`,
        en: `predecessor(${val}) = ${p >= 0 ? p : '∅'}`,
      });
    }
  }

  // 终态
  hotIdx = -1;
  rec
    .begin({
      zh: `完成，集合 ${present.filter(Boolean).length} 个元素`,
      en: `Done, ${present.filter(Boolean).length} elements`,
    })
    .setArray(
      Array.from({ length: U }, (_, i) => i),
      Array.from({ length: U }, (_, i) => (present[i] ? 'final' : 'default') as BarRole),
      [],
    )
    .commit();

  return rec.build();
}
