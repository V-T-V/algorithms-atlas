// =============================================================================
// 组合数 Combinatorics · 录制帧序列
// 用 setGrid 展示杨辉三角（前 N 行），用 setAux 展示阶乘表与逆元表。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import {
  buildCombTable,
  comb,
  pascalTriangle,
  COMB_MOD,
  type CombinatoricsHooks,
  type CombTable,
} from './impl.ts';

export const DEFAULT_INPUT = { rows: 7, query: { n: 6, k: 3 } };

const cap = (n: bigint): number => {
  // 超过 number 精度时取低位用于可视化高度
  const x = n % 1000000000n;
  return Number(x);
};

/** 录制演示帧序列。 */
export function buildTrace(
  input: { rows: number; query?: { n: number; k: number } } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const rows = Math.max(1, input.rows);
  const query = input.query;

  // 杨辉三角（精确整数）
  const tri = pascalTriangle(rows);
  let table: CombTable | null = null;
  let highlightCell: { r: number; c: number } | null = null;

  const snapshot = (note: { zh: string; en: string }): void => {
    // 把杨辉三角渲染成左对齐网格（每行长度递增）
    const gridRows = tri.map((row, r) =>
      row.map((v, c) => {
        const role: BarRole =
          highlightCell && highlightCell.r === r && highlightCell.c === c ? 'compare' : 'default';
        return { v: v.toString(), role };
      }),
    );
    const aux: Array<{ label: string; value: string; role?: BarRole }> = [
      { label: 'rows', value: String(rows), role: 'pivot' },
      { label: 'mod', value: COMB_MOD.toString(), role: 'default' },
    ];
    if (table) {
      // 只显示前若干位
      aux.push({
        label: 'fact',
        value: `[${table.fact
          .slice(0, rows + 1)
          .map((x) => x.toString())
          .join(', ')}]`,
        role: 'frontier',
      });
      aux.push({
        label: 'invFact',
        value: `[${table.invFact
          .slice(0, rows + 1)
          .map((x) => x.toString())
          .join(', ')}]`,
        role: 'frontier',
      });
    }
    rec.begin(note).setGrid(gridRows).setAux(aux).commit();
  };

  snapshot({
    zh: `杨辉三角前 ${rows} 行（递推 C(n,k)=C(n-1,k-1)+C(n-1,k)）`,
    en: `First ${rows} rows of Pascal's triangle (C(n,k)=C(n-1,k-1)+C(n-1,k))`,
  });

  // 预处理阶乘表
  table = buildCombTable(rows, COMB_MOD, {
    onFact: (i, value) => {
      void value;
      highlightCell = null;
      if (i <= rows) {
        snapshot({
          zh: `预处理 fact[${i}] = ${i}! mod p`,
          en: `Precompute fact[${i}] = ${i}! mod p`,
        });
      }
    },
    onInvFact: (i) => {
      highlightCell = null;
      if (i <= rows) {
        snapshot({
          zh: `预处理 invFact[${i}] = (${i}!)^(-1) mod p`,
          en: `Precompute invFact[${i}] = (${i}!)^(-1) mod p`,
        });
      }
    },
  });
  highlightCell = null;

  // 查询演示
  if (query && query.n <= rows && query.k <= query.n) {
    const hooks: CombinatoricsHooks = {
      onQuery: (n, k, v) => {
        highlightCell = { r: n, c: k };
        rec
          .begin({
            zh: `查询 C(${query.n}, ${query.k}) = fact·invFact·invFact mod p = ${v}`,
            en: `Query C(${query.n}, ${query.k}) = fact·invFact·invFact mod p = ${v}`,
          })
          .setGrid(
            tri.map((row, r) =>
              row.map((vv, c) => ({
                v: vv.toString(),
                role:
                  r === query.n && c === query.k ? ('final' as BarRole) : ('default' as BarRole),
              })),
            ),
          )
          .setAux([
            {
              label: `C(${query.n},${query.k})`,
              value: comb(table!, query.n, query.k).toString(),
              role: 'final',
            },
            { label: 'mod', value: COMB_MOD.toString(), role: 'default' },
          ])
          .commit();
      },
    };
    comb(table, query.n, query.k, hooks);
  }

  // 终态：杨辉三角全部 final
  rec
    .begin({
      zh: `完成：前 ${rows} 行杨辉三角 + 阶乘表`,
      en: `Done: first ${rows} rows of Pascal's triangle + factorial tables`,
    })
    .setGrid(tri.map((row) => row.map((v) => ({ v: v.toString(), role: 'final' as BarRole }))))
    .setAux([
      { label: 'fact', value: `[${table.fact.map((x) => cap(x)).join(', ')}]`, role: 'final' },
    ])
    .commit();

  return rec.build();
}
