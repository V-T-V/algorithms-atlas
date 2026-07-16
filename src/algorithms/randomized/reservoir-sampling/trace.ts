// =============================================================================
// 水库采样 · 录制帧序列
// 用 setBars 展示「流」和「蓄水池」，固定种子保证可复现。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { reservoirSampling, makeLcg, type ReservoirHooks } from './impl.ts';

export const DEFAULT_INPUT = [5, 2, 8, 1, 9, 3, 7, 4, 6, 0, 4, 7];
export const DEFAULT_K = 4;
export const DEFAULT_SEED = 7;

interface SnapshotState {
  streamIdx: number; // 当前读到的流位置（-1 表示初始）
  reservoir: number[]; // 当前蓄水池
  k: number;
  filled: boolean;
  flash: { replaceSlot: number; newIdx: number } | null;
}

/** 录制演示帧序列。 */
export function buildTrace(
  input: number[] = DEFAULT_INPUT,
  k: number = DEFAULT_K,
  seed: number = DEFAULT_SEED,
): Frame[] {
  const rec = new TraceRecorder();
  const reservoir: number[] = new Array(Math.min(k, input.length)).fill(NaN);
  const st: SnapshotState = { streamIdx: -1, reservoir, k, filled: false, flash: null };

  const snapshot = (note: { zh: string; en: string }): void => {
    // 流的 bars：已读 = sorted，当前流元素 = pivot/compare，蓄水池内来源 = final
    const streamRoles: Record<number, BarRole> = {};
    for (let s = 0; s <= st.streamIdx; s++) streamRoles[s] = 'sorted';
    if (st.streamIdx >= 0) streamRoles[st.streamIdx] = 'compare';

    // 蓄水池用 aux 区展示，每条标注来源流下标
    const aux = st.reservoir.map((v, slot) => {
      let role: BarRole = 'final';
      if (st.flash && st.flash.replaceSlot === slot) role = 'swap';
      else if (!st.filled && Number.isNaN(v)) role = 'default';
      else if (!st.filled) role = 'frontier';
      return { label: `slot ${slot}`, value: Number.isNaN(v) ? '—' : String(v), role };
    });

    rec.begin(note).setBars(rec.barsFrom(input, streamRoles)).setAux(aux).commit();
    st.flash = null;
  };

  snapshot({
    zh: `流大小 n=${input.length}，蓄水池容量 k=${Math.min(k, input.length)}`,
    en: `Stream size n=${input.length}, reservoir capacity k=${Math.min(k, input.length)}`,
  });

  const hooks: ReservoirHooks = {
    onStream: (i) => {
      st.streamIdx = i;
      if (i < st.k) {
        st.reservoir[i] = input[i]!;
        snapshot({
          zh: `读取第 ${i} 个元素 ${input[i]}，直接填入蓄水池 slot ${i}`,
          en: `Read #${i} = ${input[i]}, fill reservoir slot ${i}`,
        });
      } else {
        snapshot({
          zh: `读取第 ${i} 个元素 ${input[i]}`,
          en: `Read #${i} = ${input[i]}`,
        });
      }
    },
    onFill: () => {
      st.filled = true;
      snapshot({
        zh: `蓄水池已满（k=${st.k}）`,
        en: `Reservoir filled (k=${st.k})`,
      });
    },
    onTryReplace: (i, slot) => {
      st.reservoir[slot] = input[i]!;
      st.flash = { replaceSlot: slot, newIdx: i };
      snapshot({
        zh: `随机 j=${slot} < k，用第 ${i} 个元素 ${input[i]} 替换 slot ${slot}`,
        en: `Random j=${slot} < k, replace slot ${slot} with #${i} = ${input[i]}`,
      });
    },
  };

  reservoirSampling(input, k, makeLcg(seed), hooks);

  // 终态
  const finalAux = st.reservoir.map((v, slot) => ({
    label: `slot ${slot}`,
    value: String(v),
    role: 'final' as BarRole,
  }));
  rec
    .begin({ zh: '采样完成', en: 'Sampling complete' })
    .setBars(input.map((_, idx) => ({ value: input[idx]!, role: 'sorted' as BarRole })))
    .setAux(finalAux)
    .commit();

  return rec.build();
}
