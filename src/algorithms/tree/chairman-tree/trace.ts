// 主席树 · 录制帧序列
// 演示：对数组建主席树，查询区间第 k 小。用 setBars 展示原数组，setAux 展示版本/查询状态。

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { ChairmanTree, type ChairmanHooks } from './impl.ts';

export const DEFAULT_INPUT = {
  data: [5, 2, 8, 1, 9, 3, 7, 4, 6],
  ql: 1,
  qr: 9,
  k: 3,
};

function inRangeRoles(n: number, ql: number, qr: number): BarRole[] {
  return Array.from({ length: n }, (_, i) => (i + 1 >= ql && i + 1 <= qr ? 'final' : 'default'));
}

export function buildTrace(
  input: { data?: number[]; ql?: number; qr?: number; k?: number } = {},
): Frame[] {
  const { data = [5, 2, 8, 1, 9, 3, 7, 4, 6], ql = 1, qr = 9, k = 3 } = input;
  const rec = new TraceRecorder();

  rec
    .begin({
      zh: `数组 ${JSON.stringify(data)}，查询区间 [${ql}, ${qr}] 第 ${k} 小`,
      en: `Array ${JSON.stringify(data)}, query k-th (${k}) smallest in [${ql}, ${qr}]`,
    })
    .setBars(rec.barsFrom(data))
    .commit();

  rec
    .begin({
      zh: '阶段 1：构建持久化版本（每插入一个元素新建一棵权值线段树）',
      en: 'Phase 1: build persistent versions (new value-segment tree per insertion)',
    })
    .setBars(rec.barsFrom(data))
    .commit();

  let versionCount = 0;
  const buildHooks: ChairmanHooks = {
    onVersion: (ver, val) => {
      versionCount = ver;
      const roles = Array.from({ length: data.length }, (_, i) =>
        i + 1 === ver ? ('compare' as BarRole) : 'default',
      );
      rec
        .begin({
          zh: `插入 a[${ver}]=${val} → 新版本 v${ver}（共享未改子树）`,
          en: `Insert a[${ver}]=${val} -> new version v${ver} (shares unchanged subtrees)`,
        })
        .setBars(
          rec.barsFrom(
            data,
            Object.fromEntries(data.map((_, i) => [i, roles[i]!])) as Record<number, BarRole>,
          ),
        )
        .commit();
    },
  };

  // 建主席树（构造过程触发 onVersion 钩子录制各版本）；结果本身不使用
  void new ChairmanTree(data, buildHooks);

  rec
    .begin({
      zh: `共建 ${versionCount} 个版本，开始查询区间 [${ql}, ${qr}] 第 ${k} 小`,
      en: `Built ${versionCount} versions, start querying k-th (${k}) smallest in [${ql}, ${qr}]`,
    })
    .setBars(
      rec.barsFrom(
        data,
        Object.fromEntries(
          data.map((_, i) => [i, inRangeRoles(data.length, ql, qr)[i]!]),
        ) as Record<number, BarRole>,
      ),
    )
    .setAux([{ label: 'versions', value: String(versionCount), role: 'final' }])
    .commit();

  const queryHooks: ChairmanHooks = {
    onQueryStep: (leftCount, kk, goLeft) => {
      rec
        .begin({
          zh: `左子树差 = ${leftCount}，k=${kk} → ${goLeft ? '进入左子树' : `进入右子树，k 减为 ${kk - leftCount}`}`,
          en: `Left diff = ${leftCount}, k=${kk} -> ${goLeft ? 'go left' : `go right, k becomes ${kk - leftCount}`}`,
        })
        .setAux([
          { label: 'leftCount', value: String(leftCount), role: 'compare' },
          { label: 'k', value: String(kk), role: 'pivot' },
          { label: 'direction', value: goLeft ? 'left' : 'right', role: goLeft ? 'final' : 'warn' },
        ])
        .commit();
    },
  };
  const tree2 = new ChairmanTree(data, queryHooks);
  const answer = tree2.kth(ql, qr, k);

  rec
    .begin({
      zh: `第 ${k} 小 = ${answer}`,
      en: `The ${k}-th smallest = ${answer}`,
    })
    .setBars(
      rec.barsFrom(
        data,
        Object.fromEntries(
          data.map((_, i) => [i, inRangeRoles(data.length, ql, qr)[i]!]),
        ) as Record<number, BarRole>,
      ),
    )
    .commit();

  return rec.build();
}
