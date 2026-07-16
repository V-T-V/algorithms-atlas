// 分块（√n 分解）· 录制帧序列

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { SqrtDecomposition, type SqrtDecompHooks } from './impl.ts';

export const DEFAULT_INPUT = {
  arr: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  queryL: 2,
  queryR: 9,
  updateIdx: 5,
  updateVal: 20,
};

export function buildTrace(
  input: {
    arr: number[];
    queryL: number;
    queryR: number;
    updateIdx: number;
    updateVal: number;
  } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const { arr, queryL, queryR, updateIdx, updateVal } = input;
  let blockSize = 1;
  let numBlocks = 1;
  let blockSum: number[] = [];
  let highlightIdx = new Set<number>();
  let highlightBlocks = new Set<number>();

  const render = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = arr.map((_, i) => {
      if (highlightIdx.has(i)) return 'compare';
      if (highlightBlocks.has(Math.floor(i / blockSize))) return 'frontier';
      return 'default';
    });
    rec
      .begin(note)
      .setArray([...arr], roles, [])
      .setAux([
        { label: '块大小 √n', value: String(blockSize), role: 'pivot' as BarRole },
        { label: '块数', value: String(numBlocks), role: 'pivot' as BarRole },
        ...blockSum.map((s, b) => ({
          label: `块 ${b}`,
          value: `sum=${s}`,
          role: (highlightBlocks.has(b) ? 'frontier' : 'default') as BarRole,
        })),
      ])
      .commit();
    highlightIdx = new Set();
    highlightBlocks = new Set();
  };

  render({ zh: `构建分块结构，n=${arr.length}`, en: `Build blocks, n=${arr.length}` });

  const hooks: SqrtDecompHooks = {
    onBuilt: (bs, nb, sums) => {
      blockSize = bs;
      numBlocks = nb;
      blockSum = [...sums];
      render({
        zh: `建块完成：块大小=${bs}，块数=${nb}`,
        en: `Built: blockSize=${bs}, numBlocks=${nb}`,
      });
    },
    onQueryBlock: (b, _s) => {
      highlightBlocks.add(b);
      render({
        zh: `查询整块 ${b}，和=${blockSum[b]}`,
        en: `Query full block ${b}, sum=${blockSum[b]}`,
      });
    },
    onQueryIndex: (i) => {
      highlightIdx.add(i);
      render({ zh: `枚举零散下标 ${i}`, en: `Enumerate partial index ${i}` });
    },
    onUpdate: (i, oldV, newV, b) => {
      arr[i] = newV;
      // 重算该块 sum 展示
      const lo = b * blockSize;
      const hi = Math.min(arr.length - 1, (b + 1) * blockSize - 1);
      let s = 0;
      for (let k = lo; k <= hi; k++) s += arr[k]!;
      blockSum[b] = s;
      highlightIdx.add(i);
      render({
        zh: `更新 a[${i}]：${oldV} → ${newV}，块 ${b} 重算`,
        en: `Update a[${i}]: ${oldV} → ${newV}, recompute block ${b}`,
      });
    },
  };

  const sd = new SqrtDecomposition(arr, hooks);
  const q = sd.rangeSum(queryL, queryR);
  render({
    zh: `区间 [${queryL},${queryR}] 求和 = ${q}`,
    en: `Range [${queryL},${queryR}] sum = ${q}`,
  });

  sd.update(updateIdx, updateVal);

  rec
    .begin({
      zh: `完成：区间和=${q}，已更新 a[${updateIdx}]=${updateVal}`,
      en: `Done: range sum=${q}, updated a[${updateIdx}]=${updateVal}`,
    })
    .setArray(
      [...arr],
      arr.map(() => 'sorted' as BarRole),
      [],
    )
    .setAux([{ label: '结果', value: `sum[${queryL}..${queryR}]=${q}`, role: 'final' as BarRole }])
    .commit();

  return rec.build();
}
