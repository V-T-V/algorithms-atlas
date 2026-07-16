// =============================================================================
// 分块数组 · 录制帧序列
// 用 setBars 展示数组元素（每块起始处标 B#），setAux 展示每个块的懒标记。
// 区间加时整块标 'frontier'、散块标 'compare'，查询点标 'pivot'。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { BlockArray, type BlockArrayHooks } from './impl.ts';

export const DEFAULT_INPUT = {
  values: [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5, 8],
  ops: [
    { l: 0, r: 11, v: 10 }, // 全覆盖
    { l: 2, r: 6, v: 100 }, // 跨块（左散 + 整 + 右散）
    { l: 4, r: 4, v: 1 }, // 单点
  ] as Array<{ l: number; r: number; v: number }>,
  query: [4, 6],
};

/** 录制演示帧序列。 */
export function buildTrace(
  input: {
    values: readonly number[];
    ops?: Array<{ l: number; r: number; v: number }>;
    query?: readonly number[];
  } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const ba = new BlockArray(input.values);
  const n = input.values.length;

  /** 每块的 [start, end]。 */
  const blockRanges = (): Array<[number, number]> => {
    const res: Array<[number, number]> = [];
    for (let b = 0; b < ba.blockCount; b++) {
      res.push([b * ba.blockSize, Math.min(n - 1, (b + 1) * ba.blockSize - 1)]);
    }
    return res;
  };

  const blockLabels = (): Record<number, string> => {
    const labels: Record<number, string> = {};
    for (const [b, [s]] of blockRanges().entries()) labels[s] = `B${b}`;
    return labels;
  };

  let wholeBlocks = new Set<number>(); // 整块高亮
  let partialIdx = new Set<number>(); // 散块下标
  let queryIdx = -1;

  const render = (note: { zh: string; en: string }): void => {
    const arr = ba.toArray();
    const roles: Record<number, BarRole> = {};
    // 整块高亮 frontier，散块 compare，查询点 pivot（优先级最高）
    for (const b of wholeBlocks) {
      const [s, e] = blockRanges()[b]!;
      for (let i = s; i <= e; i++) roles[i] = 'frontier';
    }
    for (const i of partialIdx) roles[i] = 'compare';
    if (queryIdx >= 0) roles[queryIdx] = 'pivot';
    rec
      .begin(note)
      .setBars(rec.barsFrom(arr, roles, blockLabels()))
      .setAux(
        ba.blockTag.map((tag, b) => ({
          label: `块${b}`,
          value: `tag=${tag}`,
          role: (wholeBlocks.has(b) ? 'frontier' : 'default') as BarRole,
        })),
      )
      .commit();
  };

  render({
    zh: `建块：n=${n}，B=${ba.blockSize}，共 ${ba.blockCount} 块`,
    en: `Built: n=${n}, B=${ba.blockSize}, ${ba.blockCount} blocks`,
  });

  const hooks: BlockArrayHooks = {
    onAddRangeStart: (l, r, v) => {
      wholeBlocks = new Set();
      partialIdx = new Set();
      queryIdx = -1;
      render({ zh: `区间加 [${l}, ${r}] += ${v}`, en: `Range add [${l}, ${r}] += ${v}` });
    },
    onVisit: (i) => {
      partialIdx.add(i);
    },
    onBlockTag: (b) => {
      wholeBlocks.add(b);
    },
    onQuery: () => {},
  };

  for (const op of input.ops ?? []) {
    wholeBlocks = new Set();
    partialIdx = new Set();
    queryIdx = -1;
    ba.addRange(op.l, op.r, op.v, hooks);
    render({
      zh: `完成 [${op.l}, ${op.r}] += ${op.v}：散块 ${partialIdx.size} 个，整块 ${wholeBlocks.size} 个`,
      en: `Done [${op.l}, ${op.r}] += ${op.v}: ${partialIdx.size} partial, ${wholeBlocks.size} whole`,
    });
  }

  for (const i of input.query ?? []) {
    wholeBlocks = new Set();
    partialIdx = new Set();
    queryIdx = i;
    const value = ba.query(i, hooks);
    render({ zh: `查询下标 ${i} = ${value}`, en: `Query index ${i} = ${value}` });
  }

  // 终态
  queryIdx = -1;
  const arr = ba.toArray();
  rec
    .begin({ zh: `最终数组：[${arr.join(', ')}]`, en: `Final array: [${arr.join(', ')}]` })
    .setBars(arr.map((v) => ({ value: v, role: 'final' as BarRole })))
    .setAux(
      ba.blockTag.map((tag, b) => ({
        label: `块${b}`,
        value: `tag=${tag}`,
        role: 'final' as BarRole,
      })),
    )
    .commit();

  return rec.build();
}
