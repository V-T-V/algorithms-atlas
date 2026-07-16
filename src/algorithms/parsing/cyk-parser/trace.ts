// =============================================================================
// CYK 算法 · 录制帧序列
// 用 setGrid 展示 n×n 上三角 DP 表，每格填入可推导的非终结符集合。
// =============================================================================

import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { cykParse, SAMPLE_GRAMMAR, type CnfGrammar, type CykHooks } from './impl.ts';

export { SAMPLE_GRAMMAR } from './impl.ts';
export const DEFAULT_INPUT = 'aabb';

interface BuildTraceInput {
  input: string;
  grammar: CnfGrammar;
}

/** 录制演示帧序列。 */
export function buildTrace(
  inputOrObj: string | BuildTraceInput = DEFAULT_INPUT,
  grammar: CnfGrammar = SAMPLE_GRAMMAR,
): Frame[] {
  const actualInput = typeof inputOrObj === 'string' ? inputOrObj : inputOrObj.input;
  const actualGrammar = typeof inputOrObj === 'string' ? grammar : inputOrObj.grammar;
  const n = actualInput.length;
  const rec = new TraceRecorder();

  // cellDisplay[i][len-1] = 可推导的非终结符字符串
  const display: string[][] = [];
  for (let i = 0; i < n; i++) {
    display.push(new Array<string>(n).fill(''));
  }
  let curI = -1;
  let curLen = -1;

  const renderGrid = (): Cell[][] => {
    const header: Cell[] = [{ v: 'i\\len', role: 'default' }];
    for (let len = 1; len <= n; len++) header.push({ v: len, role: 'pivot' });
    const rows: Cell[][] = [header];
    for (let i = 0; i < n; i++) {
      const row: Cell[] = [{ v: `${i}:${actualInput[i]}`, role: 'pivot' }];
      for (let len = 1; len <= n; len++) {
        let role: BarRole = 'default';
        if (i === curI && len === curLen) role = 'compare';
        row.push({ v: display[i]![len - 1] ?? '', role });
      }
      rows.push(row);
    }
    return rows;
  };

  if (n === 0) {
    rec
      .begin({
        zh: `空输入：CNF 下一般不接受空串`,
        en: `Empty input: generally rejected under CNF`,
      })
      .setAux([{ label: '结果', value: 'REJECT', role: 'warn' as BarRole }])
      .commit();
    cykParse('', actualGrammar);
    return rec.build();
  }

  rec
    .begin({
      zh: `CYK 解析 "${actualInput}"（n=${n}）。按子串长度递增填上三角表。`,
      en: `CYK parse "${actualInput}" (n=${n}). Fill the upper-triangular table by increasing substring length.`,
    })
    .setGrid(renderGrid())
    .setAux([
      { label: '文法起始符', value: actualGrammar.start, role: 'pivot' as BarRole },
      {
        label: '终结符规则',
        value: Object.entries(actualGrammar.terminalRules)
          .map(([nt, ts]) => `${nt}→${ts.join('|')}`)
          .join('  '),
        role: 'compare' as BarRole,
      },
      {
        label: '二元规则',
        value: actualGrammar.binaryRules.map((r) => `${r.lhs}→${r.rhs1}${r.rhs2}`).join('  '),
        role: 'default' as BarRole,
      },
    ])
    .commit();

  const hooks: CykHooks = {
    onCell: (i, len, nonterminals) => {
      curI = i;
      curLen = len;
      display[i]![len - 1] = nonterminals.length ? `{${nonterminals.join(',')}}` : '∅';
      rec
        .begin({
          zh: `cell[${i}][len=${len}]：子串 "${actualInput.slice(
            i,
            i + len,
          )}" 可由 {${nonterminals.join(',')}} 推导`,
          en: `cell[${i}][len=${len}]: substring "${actualInput.slice(
            i,
            i + len,
          )}" derivable from {${nonterminals.join(',')}}`,
        })
        .setGrid(renderGrid())
        .setAux([
          { label: '当前格', value: `[${i}][${len}]`, role: 'pivot' as BarRole },
          {
            label: '子串',
            value: actualInput.slice(i, i + len),
            role: 'compare' as BarRole,
          },
          {
            label: '可推导',
            value: nonterminals.length ? nonterminals.join(',') : '∅',
            role: nonterminals.length ? ('final' as BarRole) : ('warn' as BarRole),
          },
        ])
        .commit();
    },
    onResult: (accepted) => {
      curI = -1;
      curLen = -1;
      rec
        .begin({
          zh: accepted
            ? `接受：起始符 ${actualGrammar.start} ∈ cell[0][${n}]`
            : `拒绝：起始符 ${actualGrammar.start} ∉ cell[0][${n}]`,
          en: accepted
            ? `Accept: start ${actualGrammar.start} ∈ cell[0][${n}]`
            : `Reject: start ${actualGrammar.start} ∉ cell[0][${n}]`,
        })
        .setGrid(renderGrid())
        .setAux([
          {
            label: '结果',
            value: accepted ? 'ACCEPT' : 'REJECT',
            role: (accepted ? 'final' : 'warn') as BarRole,
          },
          { label: 'cell[0][n]', value: display[0]![n - 1] ?? '∅', role: 'compare' as BarRole },
        ])
        .commit();
    },
  };

  cykParse(actualInput, actualGrammar, hooks);

  return rec.build();
}
