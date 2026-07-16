// =============================================================================
// Fisher-Yates 洗牌 · 录制帧序列
// 通过 fisherYates 的钩子，把执行过程录成 Frame[]。使用固定种子保证可复现。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { fisherYates, makeLcg, type FisherYatesHooks } from './impl.ts';

export const DEFAULT_INPUT = [5, 2, 8, 1, 9, 3, 7, 4, 6];
/** 固定种子：演示与单测都可据此断言同一输出。 */
export const DEFAULT_SEED = 42;

/** 录制演示帧序列。 */
export function buildTrace(input: number[] = DEFAULT_INPUT, seed: number = DEFAULT_SEED): Frame[] {
  const rec = new TraceRecorder();
  const a = [...input];
  // 「已洗」区下标集合（i 及其右侧）
  const shuffled = new Set<number>();
  let pickI = -1;
  let pickJ = -1;
  let swapPair: [number, number] | null = null;

  const snapshot = (note: { zh: string; en: string }): void => {
    const roles: Record<number, BarRole> = {};
    for (const s of shuffled) roles[s] = 'sorted';
    if (swapPair) {
      roles[swapPair[0]] = 'swap';
      roles[swapPair[1]] = 'swap';
    } else if (pickI >= 0) {
      roles[pickI] = 'pivot';
      if (pickJ >= 0 && pickJ !== pickI) roles[pickJ] = 'compare';
    }
    rec.begin(note).setBars(rec.barsFrom(a, roles)).commit();
    swapPair = null;
  };

  snapshot({ zh: `初始数组：${a.join(', ')}`, en: `Initial array: ${a.join(', ')}` });

  const hooks: FisherYatesHooks = {
    onPick: (i, j) => {
      pickI = i;
      pickJ = j;
      snapshot({
        zh: `处理下标 ${i}，从 [0, ${i}] 中随机抽到下标 ${j}（值 ${a[j]}）`,
        en: `Process index ${i}, random pick ${j} from [0, ${i}] (value ${a[j]})`,
      });
    },
    onSwap: (i, j) => {
      if (i !== j) {
        const t = a[i]!;
        a[i] = a[j]!;
        a[j] = t;
        swapPair = [i, j];
        snapshot({
          zh: `交换 a[${i}] 与 a[${j}]`,
          en: `Swap a[${i}] and a[${j}]`,
        });
      } else {
        snapshot({
          zh: `随机选中自身 a[${i}]，无需交换`,
          en: `Random pick is itself a[${i}], no swap needed`,
        });
      }
      shuffled.add(i);
      pickI = -1;
      pickJ = -1;
    },
  };

  fisherYates(input, makeLcg(seed), hooks);

  // 终态：全部就位
  rec
    .begin({ zh: '洗牌完成', en: 'Shuffle complete' })
    .setBars(a.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();

  return rec.build();
}
