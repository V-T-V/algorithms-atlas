// =============================================================================
// 哈希聚合 · 录制帧序列
// 用 setMap 展示分组累加结果；用 setAux 展示当前行。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { hashAggregate, sumAcc } from './impl.ts';

export interface Row {
  dept: string;
  salary: number;
}

export const DEFAULT_INPUT: Row[] = [
  { dept: 'A', salary: 100 },
  { dept: 'B', salary: 200 },
  { dept: 'A', salary: 150 },
  { dept: 'C', salary: 300 },
  { dept: 'B', salary: 250 },
  { dept: 'A', salary: 120 },
];

interface TraceOptions {
  rows: Row[];
}

export function buildTrace(input: Partial<TraceOptions> = {}): Frame[] {
  const rows = input.rows ?? DEFAULT_INPUT;
  const rec = new TraceRecorder();

  const groups = new Map<string, number>();
  let curRowIdx = -1;

  const render = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setMap(
        Array.from(groups.entries()).map(([k, v]) => ({
          key: k,
          value: String(v),
          role: 'compare' as BarRole,
        })),
      )
      .setAux([
        {
          label: '当前行',
          value: curRowIdx >= 0 ? `${rows[curRowIdx]!.dept}:${rows[curRowIdx]!.salary}` : '-',
          role: 'swap' as BarRole,
        },
        {
          label: '已处理',
          value: `${Math.max(0, curRowIdx + 1)}/${rows.length}`,
          role: 'frontier' as BarRole,
        },
      ])
      .commit();
  };

  render({
    zh: `初始化：${rows.length} 行待按 dept 分组求 salary 之和`,
    en: `Init: ${rows.length} rows, group by dept summing salary`,
  });

  hashAggregate<Row, string, number>(
    rows,
    (r) => r.dept,
    (r) => r.salary,
    sumAcc,
    {
      onNewGroup: (key) => {
        groups.set(key, 0);
      },
      onUpdate: (key, v) => {
        groups.set(key, (groups.get(key) ?? 0) + v);
      },
      onEmit: () => {
        // 结果由 render 时统一展示
      },
    },
  );

  // 为了逐行展示，再跑一次带逐行钩子的版本
  groups.clear();
  for (let i = 0; i < rows.length; i++) {
    curRowIdx = i;
    const r = rows[i]!;
    const k = r.dept;
    groups.set(k, (groups.get(k) ?? 0) + r.salary);
    render({
      zh: `第 ${i + 1} 行 ${k}:${r.salary} → 组 ${k} 累计 ${groups.get(k)}`,
      en: `Row ${i + 1} ${k}:${r.salary} → group ${k} sum ${groups.get(k)}`,
    });
  }

  rec
    .begin({ zh: '完成：各组 salary 之和', en: 'Done: salary sum per dept' })
    .setMap(
      Array.from(groups.entries()).map(([k, v]) => ({
        key: k,
        value: String(v),
        role: 'final' as BarRole,
      })),
    )
    .setAux([
      { label: '组数', value: String(groups.size), role: 'final' as BarRole },
      {
        label: '总和',
        value: String(Array.from(groups.values()).reduce((a, b) => a + b, 0)),
        role: 'final' as BarRole,
      },
    ])
    .commit();

  return rec.build();
}
