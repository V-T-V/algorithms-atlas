// =============================================================================
// 差分数组 · 录制帧序列
// 用 setArray 展示差分数组 diff 的变化，高亮被更新的 l 与 r+1 端点；
// 还原阶段用 setBars 展示最终原数组。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { DifferenceArray, type DiffUpdate, type DifferenceArrayHooks } from './impl.ts';

export const DEFAULT_N = 8;
/** 默认更新序列：演示区间加。 */
export function defaultUpdates(): DiffUpdate[] {
  return [
    { l: 1, r: 4, val: 3 },
    { l: 3, r: 6, val: -2 },
    { l: 0, r: 7, val: 1 },
  ];
}

interface TraceOptions {
  n: number;
  updates: DiffUpdate[];
}

/** 录制演示帧序列。 */
export function buildTrace(opts: Partial<TraceOptions> = {}): Frame[] {
  const n = opts.n ?? DEFAULT_N;
  const updates = opts.updates ?? defaultUpdates();
  const rec = new TraceRecorder();

  // 初始：全 0 的 diff 数组（长度 n+1）
  let diffView: number[] = new Array(n + 1).fill(0);
  let endpoints: { l: number; rp1: number } = { l: -1, rp1: -1 };
  let phase: BarRole = 'swap';

  const diffSnapshot = (note: { zh: string; en: string }): void => {
    const values = [...diffView];
    const roles: BarRole[] = diffView.map((_, i) => {
      if (i === endpoints.l) return phase;
      if (i === endpoints.rp1) return phase;
      return 'default';
    });
    const pointers: Array<{ index: number; label: string }> = [];
    if (endpoints.l >= 0) pointers.push({ index: endpoints.l, label: 'l' });
    if (endpoints.rp1 >= 0 && endpoints.rp1 < values.length) {
      pointers.push({ index: endpoints.rp1, label: 'r+1' });
    }
    rec.begin(note).setArray(values, roles, pointers).commit();
    phase = 'swap';
  };

  diffSnapshot({
    zh: `初始差分数组：长度 ${n + 1}（diff[n] 用于吸收右端），全 0`,
    en: `Init difference array: length ${n + 1} (diff[n] absorbs right end), all zeros`,
  });

  const da = new DifferenceArray(n);

  const updateHooks: DifferenceArrayHooks = {
    onUpdate: (l, r, val, d) => {
      diffView = [...d];
      endpoints = { l, rp1: r + 1 };
      phase = 'compare';
      diffSnapshot({
        zh: `a[${l}..${r}] += ${val}：diff[${l}] += ${val}，diff[${r + 1}] -= ${val}`,
        en: `a[${l}..${r}] += ${val}: diff[${l}] += ${val}, diff[${r + 1}] -= ${val}`,
      });
    },
  };

  for (const u of updates) da.update(u.l, u.r, u.val, updateHooks);

  // 还原阶段
  let restored: number[] = new Array(n).fill(0);
  const restoredArr = da.restore({
    onRestore: (arr) => {
      restored = [...arr];
    },
  });

  rec
    .begin({
      zh: `还原：对 diff 求前缀和，得原数组 [${restoredArr.join(', ')}]`,
      en: `Restore: prefix-sum over diff → [${restoredArr.join(', ')}]`,
    })
    .setBars(
      restoredArr.map((v, i) => ({ value: v, role: 'final' as BarRole, label: `a[${i}]=${v}` })),
    )
    .commit();

  // 终态
  rec
    .begin({
      zh: `完成：${updates.length} 次区间更新后原数组 = [${restored.join(', ')}]`,
      en: `Done: after ${updates.length} range updates, array = [${restored.join(', ')}]`,
    })
    .setBars(
      restored.map((v, i) => ({ value: v, role: 'final' as BarRole, label: `a[${i}]=${v}` })),
    )
    .setAux([
      { label: '更新次数', value: String(updates.length), role: 'default' as BarRole },
      { label: '数组长度', value: String(n), role: 'default' as BarRole },
      {
        label: '总和',
        value: String(restored.reduce((a, b) => a + b, 0)),
        role: 'frontier' as BarRole,
      },
    ])
    .commit();

  return rec.build();
}
