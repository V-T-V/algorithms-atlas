// =============================================================================
// 块状链表 · 录制帧序列
// 用 setBars 展示展平后的元素序列（块边界用 label B#），
// 操作点标 'pivot'，被定位/改动的块标 'frontier'，分裂/合并标 'swap'。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { ChunkList, type ChunkListHooks } from './impl.ts';

export const DEFAULT_INPUT = {
  values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  ops: [
    { op: 'insert' as const, pos: 5, v: 99 },
    { op: 'insert' as const, pos: 0, v: 88 },
    { op: 'erase' as const, pos: 7 },
    { op: 'push' as const, v: 77 },
  ],
};

/** 录制演示帧序列。 */
export function buildTrace(
  input: {
    values: readonly number[];
    ops?: Array<{ op: 'insert' | 'erase' | 'push'; pos?: number; v?: number }>;
  } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const cl = new ChunkList(input.values);

  let hotPos = -1; // 当前操作逻辑下标
  let hotBlock = -1; // 当前定位到的块
  let eventBlock = -1; // 分裂/合并的块

  /** 计算每个逻辑下标属于哪块，返回 label 表（块起始处写 B#）。 */
  const blockStartLabels = (): { labels: Record<number, string>; blockOfIdx: number[] } => {
    const labels: Record<number, string> = {};
    const blockOfIdx: number[] = [];
    let off = 0;
    const sizes = cl.blockSizes();
    for (let b = 0; b < sizes.length; b++) {
      labels[off] = `B${b}`;
      for (let k = 0; k < sizes[b]!; k++) blockOfIdx[off + k] = b;
      off += sizes[b]!;
    }
    return { labels, blockOfIdx };
  };

  const render = (note: { zh: string; en: string }): void => {
    const arr = cl.toArray();
    const { labels, blockOfIdx } = blockStartLabels();
    const roles: Record<number, BarRole> = {};
    for (let i = 0; i < arr.length; i++) {
      const b = blockOfIdx[i];
      if (b === hotBlock) roles[i] = 'frontier';
      if (b === eventBlock && roles[i] !== 'frontier') roles[i] = 'swap';
    }
    if (hotPos >= 0 && hotPos < arr.length) roles[hotPos] = 'pivot';
    rec
      .begin(note)
      .setBars(rec.barsFrom(arr, roles, labels))
      .setAux(
        cl.blockSizes().map((sz, b) => ({
          label: `块${b}`,
          value: `${sz} 项`,
          role: (b === eventBlock ? 'swap' : b === hotBlock ? 'frontier' : 'default') as BarRole,
        })),
      )
      .commit();
  };

  render({
    zh: `建块：n=${input.values.length}，B=${cl.blockCap}，共 ${cl.blockCount()} 块`,
    en: `Built: n=${input.values.length}, B=${cl.blockCap}, ${cl.blockCount()} blocks`,
  });

  const hooks: ChunkListHooks = {
    onVisitBlock: () => {},
    onModify: (bi) => {
      hotBlock = bi;
    },
    onSplit: (bi) => {
      eventBlock = bi;
    },
    onMerge: (a) => {
      eventBlock = a;
    },
  };

  for (const op of input.ops ?? []) {
    hotPos = -1;
    hotBlock = -1;
    eventBlock = -1;
    if (op.op === 'push') {
      cl.insert(cl.size(), op.v ?? 0, hooks);
      render({ zh: `末尾插入 ${op.v}`, en: `Push ${op.v} at tail` });
    } else if (op.op === 'insert') {
      hotPos = op.pos ?? 0;
      render({ zh: `在下标 ${op.pos} 处插入 ${op.v}`, en: `Insert ${op.v} at index ${op.pos}` });
      cl.insert(op.pos ?? 0, op.v ?? 0, hooks);
      render({ zh: `插入完成`, en: `Insert done` });
    } else if (op.op === 'erase' && op.pos !== undefined) {
      hotPos = op.pos;
      render({ zh: `删除下标 ${op.pos}`, en: `Erase index ${op.pos}` });
      cl.erase(op.pos, hooks);
      render({ zh: `删除完成`, en: `Erase done` });
    }
  }

  // 终态
  hotPos = -1;
  hotBlock = -1;
  eventBlock = -1;
  const arr = cl.toArray();
  rec
    .begin({
      zh: `最终：[${arr.join(', ')}]，${cl.blockCount()} 块`,
      en: `Final: [${arr.join(', ')}], ${cl.blockCount()} blocks`,
    })
    .setBars(arr.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();

  return rec.build();
}
