// =============================================================================
// 混合背包 · 录制帧序列
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { mixedKnapsack, type MixedItem, type MixedKnapsackHooks } from './impl.ts';

export const DEFAULT_ITEMS: MixedItem[] = [
  { weight: 2, value: 3, type: '01', count: 1 },
  { weight: 3, value: 4, type: 'complete', count: Infinity },
  { weight: 4, value: 5, type: 'bounded', count: 2 },
];
export const DEFAULT_CAPACITY = 10;

export function buildTrace(
  items: readonly MixedItem[] = DEFAULT_ITEMS,
  capacity: number = DEFAULT_CAPACITY,
): Frame[] {
  const rec = new TraceRecorder();
  const dp = new Array<number>(capacity + 1).fill(0);
  let curIdx = -1;
  let lastCap = -1;
  let ans = 0;

  const snap = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = dp.map((_, c) =>
      c === lastCap ? 'compare' : c === capacity ? 'pivot' : 'default',
    );
    rec
      .begin(note)
      .setArray([...dp], roles, [{ index: lastCap < 0 ? 0 : lastCap, label: 'c' }])
      .setAux([
        {
          label: '当前物品',
          value:
            curIdx < 0
              ? '-'
              : `${items[curIdx]!.type} w${items[curIdx]!.weight} v${items[curIdx]!.value}`,
          role: 'frontier',
        },
        { label: 'dp', value: dp.map((v) => `${v}`).join(' '), role: 'pivot' },
      ])
      .commit();
  };

  snap({ zh: `容量=${capacity}`, en: `capacity=${capacity}` });

  const hooks: MixedKnapsackHooks = {
    onItem: (i) => {
      curIdx = i;
      snap({ zh: `处理物品 ${i}: ${items[i]!.type}`, en: `Item ${i}: ${items[i]!.type}` });
    },
    onUpdate: (c, val) => {
      dp[c] = val;
      lastCap = c;
    },
    onDone: (b) => {
      ans = b;
      lastCap = -1;
      snap({ zh: `最优=${b}`, en: `best=${b}` });
    },
  };

  mixedKnapsack(items, capacity, hooks);

  rec
    .begin({ zh: `完成：${ans}`, en: `Done: ${ans}` })
    .setBars(items.map((it) => ({ value: it.value, role: 'final' as BarRole })))
    .setAux([{ label: '最大价值', value: String(ans), role: 'final' }])
    .commit();

  return rec.build();
}
