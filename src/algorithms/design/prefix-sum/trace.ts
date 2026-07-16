// =============================================================================
// 前缀和 · 录制帧序列
// 用 setArray 展示原数组与 prefix，pointers 标 l/r；
// 构建阶段高亮累计点，查询阶段高亮 l..r 区间。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { PrefixSum, type PrefixSumHooks } from './impl.ts';

export const DEFAULT_INPUT = [3, 1, 4, 1, 5, 9, 2, 6];
/** 默认查询区间 [2, 5] = 4+1+5+9 = 19。 */
export const DEFAULT_QUERY: [number, number] = [2, 5];

interface TraceOptions {
  arr: number[];
  query: [number, number];
}

/** 录制演示帧序列。 */
export function buildTrace(opts: Partial<TraceOptions> = {}): Frame[] {
  const arr = opts.arr ?? DEFAULT_INPUT;
  const query = opts.query ?? DEFAULT_QUERY;
  const rec = new TraceRecorder();

  // 构建阶段：用 setArray 展示原数组，逐步标注 prefix 累计
  let buildIdx = -1;
  let highlight: BarRole = 'swap';

  const buildSnapshot = (note: { zh: string; en: string }): void => {
    const values = [...arr];
    const roles: BarRole[] = new Array(arr.length).fill('default');
    if (buildIdx >= 0) roles[buildIdx] = highlight;
    const pointers =
      buildIdx >= 0
        ? [
            {
              index: buildIdx,
              label: `prefix[${buildIdx + 1}]=${values.slice(0, buildIdx + 1).reduce((a, b) => a + b, 0)}`,
            },
          ]
        : [];
    rec.begin(note).setArray(values, roles, pointers).commit();
    highlight = 'swap';
  };

  buildSnapshot({
    zh: `初始数组：[${arr.join(', ')}]`,
    en: `Initial array: [${arr.join(', ')}]`,
  });

  const buildHooks: PrefixSumHooks = {
    onBuild: (i, sum) => {
      buildIdx = i;
      highlight = 'compare';
      buildSnapshot({
        zh: `prefix[${i + 1}] = sum(a[0..${i}]) = ${sum}`,
        en: `prefix[${i + 1}] = sum(a[0..${i}]) = ${sum}`,
      });
    },
  };

  const ps = new PrefixSum(arr, buildHooks);

  // 构建完成：展示完整 prefix
  const prefixArr = ps.prefix;
  rec
    .begin({
      zh: `构建完成：prefix = [${prefixArr.join(', ')}]（长度 ${prefixArr.length}）`,
      en: `Built: prefix = [${prefixArr.join(', ')}] (length ${prefixArr.length})`,
    })
    .setAux(
      prefixArr.map((v, i) => ({
        label: `prefix[${i}]`,
        value: String(v),
        role: 'final' as BarRole,
      })),
    )
    .commit();

  // 查询阶段：高亮 l..r 区间
  const [l, r] = query;
  const result = ps.rangeSum(l, r, {
    onQuery: (ql, qr, res) => {
      const values = [...arr];
      const roles: BarRole[] = arr.map((_, i) => (i >= ql && i <= qr ? 'final' : 'default'));
      const pointers = [
        { index: ql, label: 'l' },
        { index: qr, label: 'r' },
      ];
      rec
        .begin({
          zh: `查询 [${ql}, ${qr}]：prefix[${qr + 1}] - prefix[${ql}] = ${prefixArr[qr + 1]} - ${prefixArr[ql]} = ${res}`,
          en: `Query [${ql}, ${qr}]: prefix[${qr + 1}] - prefix[${ql}] = ${prefixArr[qr + 1]} - ${prefixArr[ql]} = ${res}`,
        })
        .setArray(values, roles, pointers)
        .commit();
    },
  });

  // 终态
  rec
    .begin({
      zh: `sum(a[${l}..${r}]) = ${result}`,
      en: `sum(a[${l}..${r}]) = ${result}`,
    })
    .setArray(
      [...arr],
      arr.map((_, i) => (i >= l && i <= r ? ('final' as BarRole) : 'default')),
      [
        { index: l, label: 'l' },
        { index: r, label: 'r' },
      ],
    )
    .setAux([{ label: '区间和', value: String(result), role: 'final' as BarRole }])
    .commit();

  return rec.build();
}
