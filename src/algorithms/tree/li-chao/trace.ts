// 李超树 · 录制帧序列
// 演示：插入几条直线，逐个 x 查询当前最大值。用 setBars 展示每个查询点的最优 y。

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { LiChaoTree, type Line, type LiChaoHooks } from './impl.ts';

export const DEFAULT_INPUT = {
  lo: -5,
  hi: 5,
  lines: [
    { m: 1, b: 0 }, // y = x
    { m: -1, b: 4 }, // y = -x + 4
    { m: 0, b: 2 }, // y = 2
  ] as Line[],
  queries: [-4, -2, 0, 2, 4],
};

function fmt(line: Line): string {
  return `y=${line.m}x+${line.b}`;
}

export function buildTrace(
  input: {
    lo?: number;
    hi?: number;
    lines?: Line[];
    queries?: number[];
  } = {},
): Frame[] {
  const { lo = -5, hi = 5, lines = DEFAULT_INPUT.lines, queries = DEFAULT_INPUT.queries } = input;
  const rec = new TraceRecorder();

  rec
    .begin({
      zh: `定义域 [${lo}, ${hi}]，待插入 ${lines.length} 条直线`,
      en: `Domain [${lo}, ${hi}], inserting ${lines.length} lines`,
    })
    .setAux([{ label: 'phase', value: 'insert', role: 'compare' }])
    .commit();

  const compares: Array<{ l: number; r: number }> = [];
  const hooks: LiChaoHooks = {
    onInsert: (line) => {
      rec
        .begin({
          zh: `插入直线 ${fmt(line)}`,
          en: `Insert line ${fmt(line)}`,
        })
        .setAux([{ label: 'insert', value: fmt(line), role: 'final' }])
        .commit();
    },
    onCompare: (l, r, kept, dropped, mid) => {
      compares.push({ l, r });
      rec
        .begin({
          zh: `节点 [${l},${r}] 中点 ${mid}：保留 ${fmt(kept)}，下放 ${fmt(dropped)}`,
          en: `Node [${l},${r}] mid ${mid}: keep ${fmt(kept)}, drop ${fmt(dropped)}`,
        })
        .setAux([
          { label: 'kept', value: fmt(kept), role: 'final' },
          { label: 'dropped', value: fmt(dropped), role: 'warn' },
        ])
        .commit();
    },
  };

  const tree = new LiChaoTree(lo, hi, hooks);
  for (const ln of lines) tree.insert(ln);

  // 查询阶段
  const answers: number[] = [];
  for (const x of queries) {
    const v = tree.query(x);
    answers.push(v);
    rec
      .begin({
        zh: `query(x=${x}) = ${v}`,
        en: `query(x=${x}) = ${v}`,
      })
      .setBars(rec.barsFrom(answers, { [answers.length - 1]: 'compare' as BarRole }))
      .setAux([{ label: `x=${x}`, value: String(v), role: 'final' }])
      .commit();
  }

  rec
    .begin({
      zh: `所有查询完成：[${answers.join(', ')}]`,
      en: `All queries done: [${answers.join(', ')}]`,
    })
    .setBars(
      rec.barsFrom(answers, Object.fromEntries(answers.map((_, i) => [i, 'final' as BarRole]))),
    )
    .commit();

  return rec.build();
}
