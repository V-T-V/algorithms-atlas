// =============================================================================
// Packrat 解析 · 录制帧序列
// 用 setGrid 展示记忆表（行=位置，列=规则，值=结果），aux 展示当前操作。
// =============================================================================

import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import {
  packratParse,
  SAMPLE_GRAMMAR,
  type PegGrammar,
  type PegResult,
  type PackratHooks,
} from './impl.ts';

export const DEFAULT_INPUT = 'aaab';

function resultStr(r: PegResult | undefined): string {
  if (r === undefined) return '·';
  if (r.ok) return `→${r.pos}`;
  return '✗';
}

/** 录制演示帧序列。 */
export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const g = SAMPLE_GRAMMAR;
  const n = input.length;
  const ruleNames = g.rules.map((r) => r.name);

  // 实时记忆表（随钩子填充）
  const liveMemo = new Map<string, Map<string, PegResult>>();

  const renderGrid = (curPos: number, curRule: string): Cell[][] => {
    const header: Cell[] = [{ v: 'rule\\pos', role: 'default' }];
    for (let i = 0; i <= n; i++) {
      header.push({ v: `${i}${i < n ? `:'${input[i]}'` : ':$'}`, role: 'pivot' });
    }
    const rows: Cell[][] = [header];
    for (const rn of ruleNames) {
      const row: Cell[] = [{ v: rn, role: 'pivot' }];
      for (let i = 0; i <= n; i++) {
        const r = liveMemo.get(rn)?.get(String(i));
        let role: BarRole = 'default';
        if (rn === curRule && i === curPos) role = 'swap';
        else if (r !== undefined) role = r.ok ? 'sorted' : 'warn';
        row.push({ v: resultStr(r), role });
      }
      rows.push(row);
    }
    return rows;
  };

  rec
    .begin({
      zh: `Packrat 解析：输入 "${input}"（${n} 字符）。规则：${ruleNames.join(', ')}。`,
      en: `Packrat parse: input "${input}" (${n} chars). Rules: ${ruleNames.join(', ')}.`,
    })
    .setGrid(renderGrid(-1, ''))
    .setAux([
      { label: '起始规则', value: g.start, role: 'pivot' as BarRole },
      { label: '规则数', value: String(ruleNames.length), role: 'default' as BarRole },
      ...g.rules.map((r) => ({
        label: r.name,
        value: exprStr(r.expr),
        role: 'compare' as BarRole,
      })),
    ])
    .commit();

  const hooks: PackratHooks = {
    onResult: (pos, ruleName, result) => {
      // 写入实时记忆表
      let pm = liveMemo.get(ruleName);
      if (pm === undefined) {
        pm = new Map();
        liveMemo.set(ruleName, pm);
      }
      pm.set(String(pos), result);

      rec
        .begin({
          zh: `位置 ${pos} 规则 ${ruleName}：${result.ok ? `成功，消耗到位置 ${result.pos}` : '失败'}。写入记忆表。`,
          en: `Pos ${pos} rule ${ruleName}: ${result.ok ? `succeeded, consumed to ${result.pos}` : 'failed'}. Memoized.`,
        })
        .setGrid(renderGrid(pos, ruleName))
        .setAux([
          { label: '规则', value: ruleName, role: 'pivot' as BarRole },
          { label: '位置', value: String(pos), role: 'frontier' as BarRole },
          {
            label: '结果',
            value: resultStr(result),
            role: (result.ok ? 'final' : 'warn') as BarRole,
          },
          {
            label: '新位置',
            value: result.ok ? String(result.pos) : '-',
            role: 'default' as BarRole,
          },
        ])
        .commit();
    },
  };

  const result = packratParse(input, g, hooks);

  // 终态：完整记忆表
  rec
    .begin({
      zh: result.accepted ? `完成：输入被接受（记忆表已填满）` : `完成：输入被拒绝`,
      en: result.accepted ? `Done: input accepted (memo table filled)` : `Done: input rejected`,
    })
    .setGrid(renderGrid(-1, ''))
    .setAux([
      {
        label: '结果',
        value: result.accepted ? 'ACCEPT' : 'REJECT',
        role: (result.accepted ? 'final' : 'warn') as BarRole,
      },
      {
        label: '记忆条目数',
        value: String([...liveMemo.values()].reduce((a, m) => a + m.size, 0)),
        role: 'default' as BarRole,
      },
    ])
    .commit();

  return rec.build();
}

function exprStr(e: import('./impl.ts').PegExpr): string {
  switch (e.kind) {
    case 'lit':
      return `"${e.value}"`;
    case 'ref':
      return e.name;
    case 'seq':
      return e.parts.map(exprStr).join(' ');
    case 'choice':
      return e.alts.map(exprStr).join(' / ');
    case 'star':
      return `${exprStr(e.expr)}*`;
    case 'opt':
      return `${exprStr(e.expr)}?`;
  }
}

export { SAMPLE_GRAMMAR };
export type { PegGrammar };
