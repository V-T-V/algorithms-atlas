// =============================================================================
// 环入口 · 录制帧序列
// 用 setArray 展示链表（节点值），pointers 标 slow / fast 指针；
// setAux 标注当前阶段（检测 / 找入口）。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { collectNodes, detectCycleStart, listFromValues, type CycleListNode } from './impl.ts';

/**
 * 默认演示：1 → 2 → 3 → 4 → 5 → 6 → 3（6 指回 3，形成 3→4→5→6→3 的环）。
 * 环入口为值为 3 的节点（下标 2）。
 */
export const DEFAULT_VALUES = [1, 2, 3, 4, 5, 6];
export const DEFAULT_CYCLE_AT = 2; // 尾节点 next 指向下标 2（值 3）

interface TraceOptions {
  values: number[];
  /** 尾节点指向的下标（环入口）；-1 表示无环。 */
  cycleAt: number;
}

/** 构造带环链表。 */
function buildList(values: number[], cycleAt: number): CycleListNode | null {
  const head = listFromValues(values);
  if (!head || cycleAt < 0 || cycleAt >= values.length) return head;
  const nodes = collectNodes(head);
  const tail = nodes[nodes.length - 1]!;
  tail.next = nodes[cycleAt]!;
  return head;
}

/** 录制演示帧序列。 */
export function buildTrace(opts: Partial<TraceOptions> = {}): Frame[] {
  const values = opts.values ?? DEFAULT_VALUES;
  const cycleAt = opts.cycleAt ?? DEFAULT_CYCLE_AT;
  const head = buildList(values, cycleAt);
  const nodes = collectNodes(head);
  const nodeValues = nodes.map((n) => n.value);

  const rec = new TraceRecorder();
  let slowIdx = -1;
  let fastIdx = -1;
  let entryIdx = -1;
  let phase = 'detect';
  let met = false;

  const snapshot = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = nodeValues.map(() => 'default');
    if (entryIdx >= 0) roles[entryIdx] = 'final';
    if (slowIdx >= 0 && roles[slowIdx] === 'default') roles[slowIdx] = 'compare';
    if (fastIdx >= 0 && fastIdx !== slowIdx && roles[fastIdx] === 'default') {
      roles[fastIdx] = met ? 'compare' : 'swap';
    } else if (slowIdx >= 0 && slowIdx === fastIdx) {
      roles[slowIdx] = 'pivot';
    }
    const pointers: Array<{ index: number; label: string }> = [];
    if (slowIdx >= 0) pointers.push({ index: slowIdx, label: 'slow' });
    if (fastIdx >= 0 && fastIdx !== slowIdx) pointers.push({ index: fastIdx, label: 'fast' });
    if (entryIdx >= 0) pointers.push({ index: entryIdx, label: 'entry' });
    rec
      .begin(note)
      .setArray(nodeValues, roles, pointers)
      .setAux([
        {
          label: '阶段',
          value: phase === 'detect' ? '检测 / Detect' : '找入口 / Find entry',
          role: (phase === 'detect' ? 'pivot' : 'frontier') as BarRole,
        },
        {
          label: '环入口',
          value: entryIdx >= 0 ? `下标 ${entryIdx}（值 ${nodeValues[entryIdx]}）` : '尚未确定',
          role: (entryIdx >= 0 ? 'final' : 'default') as BarRole,
        },
      ])
      .commit();
  };

  snapshot({
    zh:
      cycleAt >= 0
        ? `链表：${nodeValues.join('→')}，尾节点回指下标 ${cycleAt}（值 ${nodeValues[cycleAt]}）`
        : `链表：${nodeValues.join('→')}（无环）`,
    en:
      cycleAt >= 0
        ? `List: ${nodeValues.join('→')}, tail points back to index ${cycleAt} (value ${nodeValues[cycleAt]})`
        : `List: ${nodeValues.join('→')} (no cycle)`,
  });

  detectCycleStart(head, {
    onPhase: (p) => {
      phase = p;
    },
    onStepDetect: (s, f) => {
      slowIdx = s;
      fastIdx = f;
      snapshot({
        zh: `阶段一：slow 走到下标 ${s}，fast 走到下标 ${f}`,
        en: `Phase 1: slow at index ${s}, fast at index ${f}`,
      });
    },
    onStepFind: (s, f) => {
      slowIdx = s;
      fastIdx = f;
      snapshot({
        zh: `阶段二：slow=${s}、fast=${f} 同速前进寻找入口`,
        en: `Phase 2: slow=${s}, fast=${f} advancing at same pace to find entry`,
      });
    },
    onMeet: (m) => {
      slowIdx = fastIdx = m;
      met = true;
      snapshot({
        zh: `相遇！slow 与 fast 在下标 ${m}（值 ${nodeValues[m]}）碰头 → 存在环`,
        en: `Meet! slow and fast collide at index ${m} (value ${nodeValues[m]}) → cycle exists`,
      });
    },
    onEntry: (e) => {
      entryIdx = e;
      if (e >= 0) {
        snapshot({
          zh: `环入口为下标 ${e}（值 ${nodeValues[e]}）`,
          en: `Cycle entry is index ${e} (value ${nodeValues[e]})`,
        });
      }
    },
  });

  // 终态
  if (entryIdx < 0) {
    rec
      .begin({ zh: '无环', en: 'No cycle' })
      .setArray(
        nodeValues,
        nodeValues.map(() => 'final'),
        [],
      )
      .setAux([
        { label: '阶段', value: '完成 / Done', role: 'final' },
        { label: '环入口', value: '无 / None', role: 'default' },
      ])
      .commit();
  } else {
    const roles: BarRole[] = nodeValues.map(() => 'default');
    roles[entryIdx] = 'final';
    rec
      .begin({
        zh: `检测完成：环入口 = 下标 ${entryIdx}`,
        en: `Done: cycle entry = index ${entryIdx}`,
      })
      .setArray(nodeValues, roles, [{ index: entryIdx, label: 'entry' }])
      .setAux([
        { label: '阶段', value: '完成 / Done', role: 'final' },
        {
          label: '环入口',
          value: `下标 ${entryIdx}（值 ${nodeValues[entryIdx]}）`,
          role: 'final',
        },
      ])
      .commit();
  }

  return rec.build();
}
