// =============================================================================
// Floyd 环检测 · 录制帧序列
// 用 setArray 展示序列（节点值），pointers 标 slow / fast 指针。
// 通过 next[] 函数图构造一个带环的序列做演示。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { floydCycle, type FloydHooks, type NextFn } from './impl.ts';

/**
 * 默认演示：一个「函数图」风格的序列。
 * 节点下标 0..6，每个节点带值；next[i] 指向下一个节点。
 * 构造环：0 → 1 → 2 → 3 → 4 → 5 → 6 → 3（6 指回 3，形成 3→4→5→6→3 的环）。
 */
export const DEFAULT_VALUES = [10, 20, 30, 40, 50, 60, 70];
export const DEFAULT_NEXT = [1, 2, 3, 4, 5, 6, 3];

interface TraceOptions {
  values: number[];
  next: number[];
}

/** 录制演示帧序列。 */
export function buildTrace(opts: Partial<TraceOptions> = {}): Frame[] {
  const values = opts.values ?? DEFAULT_VALUES;
  const nextArr = opts.next ?? DEFAULT_NEXT;
  const next: NextFn = (p: number) => nextArr[p] ?? -1;

  const rec = new TraceRecorder();
  let slow = -1;
  let fast = -1;
  let entry = -1;
  let met = false;

  const snapshot = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = values.map(() => 'default');
    if (entry >= 0) roles[entry] = 'final';
    if (slow >= 0 && roles[slow] === 'default') roles[slow] = 'compare';
    if (fast >= 0 && roles[fast] === 'default') roles[fast] = met ? 'compare' : 'swap';
    else if (slow === fast && slow >= 0) roles[slow] = 'pivot';

    const pointers: Array<{ index: number; label: string }> = [];
    if (slow >= 0) pointers.push({ index: slow, label: 'slow' });
    if (fast >= 0 && fast !== slow) pointers.push({ index: fast, label: 'fast' });
    if (entry >= 0) pointers.push({ index: entry, label: 'entry' });

    rec.begin(note).setArray(values, roles, pointers).commit();
  };

  snapshot({
    zh: `序列值：${values.join(', ')}，next = [${nextArr.join(', ')}]`,
    en: `Values: ${values.join(', ')}, next = [${nextArr.join(', ')}]`,
  });

  const hooks: FloydHooks = {
    onStep: (s, f) => {
      slow = s;
      fast = f;
      snapshot({
        zh: met
          ? `阶段二：slow=${s} fast=${f}（同速前进寻找入口）`
          : `阶段一：slow=${s}（走1步） fast=${f}（走2步）`,
        en: met
          ? `Phase 2: slow=${s} fast=${f} (same pace to find entry)`
          : `Phase 1: slow=${s} (1 step) fast=${f} (2 steps)`,
      });
    },
    onMeet: (m) => {
      slow = fast = m;
      met = true;
      snapshot({
        zh: `相遇！slow 与 fast 在下标 ${m}（值 ${values[m]}）碰头 → 存在环`,
        en: `Meet! slow and fast collide at index ${m} (value ${values[m]}) → cycle exists`,
      });
    },
    onEntry: (e) => {
      entry = e;
      snapshot({
        zh: `环入口为下标 ${e}（值 ${values[e]}）`,
        en: `Cycle entry is index ${e} (value ${values[e]})`,
      });
    },
  };

  floydCycle(0, next, hooks);

  // 终态：标记环入口为 final
  if (entry < 0) {
    rec
      .begin({ zh: '无环', en: 'No cycle' })
      .setArray(
        values,
        values.map(() => 'final'),
        [],
      )
      .commit();
  } else {
    const roles: BarRole[] = values.map(() => 'default');
    roles[entry] = 'final';
    rec
      .begin({ zh: `检测完成：环入口 = ${entry}`, en: `Done: cycle entry = ${entry}` })
      .setArray(values, roles, [{ index: entry, label: 'entry' }])
      .commit();
  }

  return rec.build();
}
