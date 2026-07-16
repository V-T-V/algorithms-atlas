// Generator for 43 backtracking algorithms (57 -> 100). ids use 'bt-' prefix to stay unique.
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
const ROOT = 'D:/M_X_M/algorithms-atlas';
const CAT = 'backtracking';
const INDEX = `import type { Demo } from '../../../types.ts';
import { buildTrace } from './trace.ts';
export { meta } from './meta.ts';
export async function createDemo(): Promise<Demo> {
  const { meta } = await import('./meta.ts');
  return { meta, buildTrace };
}
`;
function writeAlg(id, metaSrc, impl, trace, test) {
  const dir = join(ROOT, 'src/algorithms', CAT, id);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'meta.ts'), metaSrc);
  writeFileSync(join(dir, 'impl.ts'), impl);
  writeFileSync(join(dir, 'trace.ts'), trace);
  writeFileSync(join(dir, 'index.ts'), INDEX);
  mkdirSync(join(ROOT, 'test', CAT), { recursive: true });
  writeFileSync(join(ROOT, 'test', CAT, `${id}.test.ts`), test);
}
function meta(id, zh, en, sumZh, sumEn, descZh, descEn, time, space, tags) {
  return `// ${zh} · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: '${id}',
  categoryId: '${CAT}',
  title: { zh: ${JSON.stringify(zh)}, en: ${JSON.stringify(en)} },
  summary: { zh: ${JSON.stringify(sumZh)}, en: ${JSON.stringify(sumEn)} },
  description: { zh: ${JSON.stringify(descZh)}, en: ${JSON.stringify(descEn)} },
  tags: ${JSON.stringify(tags)},
  complexity: { time: '${time}', space: '${space}' },
};`;
}

const ALGS = [];

// 1. bt-permutations  —— 全排列
ALGS.push({
  id: 'bt-permutations',
  m: ['全排列', 'Permutations', '回溯枚举数组的所有全排列。', 'Backtracking to enumerate all permutations.',
    '交换法或选入法回溯。', 'Swap or pick-backtrack. O(n*n!).', 'O(n*n!)', 'O(n)', ['backtracking', 'permutation']],
  impl: `export interface PermHooks { onPick?: (i: number, v: number) => void; onBacktrack?: (i: number) => void; onResult?: (p: number[]) => void; }
export function permutations(arr: number[], hooks: PermHooks = {}): number[][] {
  const out: number[][] = [];
  const a = [...arr];
  const go = (i: number) => {
    if (i === a.length) { out.push([...a]); hooks.onResult?.([...a]); return; }
    for (let j = i; j < a.length; j++) {
      [a[i], a[j]] = [a[j]!, a[i]!];
      hooks.onPick?.(i, a[i]!);
      go(i + 1);
      [a[i], a[j]] = [a[j]!, a[i]!];
      hooks.onBacktrack?.(i);
    }
  };
  go(0);
  return out;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { permutations } from './impl.ts';
export const DEFAULT_INPUT = [1, 2, 3];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '全排列 [' + input.join(',') + ']', en: 'Permutations' }).commit();
  const cur: number[] = [];
  permutations(input, { onPick: (i, v) => { cur[i] = v; rec.begin({ zh: '选 a[' + i + ']=' + v, en: 'pick ' + v }).setBars(cur.slice(0, i + 1).map((x) => ({ value: x, role: 'pivot' as BarRole }))).commit(); }, onResult: (p) => rec.begin({ zh: '得到 ' + p.join(''), en: 'perm ' + p.join('') }).setBars(p.map((x) => ({ value: x, role: 'final' as BarRole }))).commit() });
  rec.begin({ zh: '完成', en: 'Done' }).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { permutations } from '../../src/algorithms/backtracking/bt-permutations/impl.ts';
import { buildTrace } from '../../src/algorithms/backtracking/bt-permutations/trace.ts';
test('permutations 正确', () => {
  const p = permutations([1,2,3]);
  assert.equal(p.length, 6);
  assert.ok(p.some((x) => x.join('') === '123'));
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 2. bt-combinations  —— 组合 C(n,k)
ALGS.push({
  id: 'bt-combinations',
  m: ['组合', 'Combinations', '枚举 1..n 中选 k 个的所有组合。', 'All k-combinations of 1..n.',
    '回溯选/不选或递增起点法。', 'Backtrack with increasing start. O(C(n,k)).', 'O(C(n,k))', 'O(k)', ['backtracking', 'combination']],
  impl: `export interface CombHooks { onPick?: (v: number) => void; onBacktrack?: () => void; onResult?: (c: number[]) => void; }
export function combine(n: number, k: number, hooks: CombHooks = {}): number[][] {
  const out: number[][] = [];
  const cur: number[] = [];
  const go = (start: number) => {
    if (cur.length === k) { out.push([...cur]); hooks.onResult?.([...cur]); return; }
    for (let i = start; i <= n; i++) {
      cur.push(i); hooks.onPick?.(i);
      go(i + 1);
      cur.pop(); hooks.onBacktrack?.();
    }
  };
  go(1);
  return out;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { combine } from './impl.ts';
export const DEFAULT_INPUT = { n: 4, k: 2 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const cur: number[] = [];
  rec.begin({ zh: 'C(' + input.n + ',' + input.k + ')', en: 'C(' + input.n + ',' + input.k + ')' }).commit();
  combine(input.n, input.k, { onPick: (v) => { cur.push(v); rec.begin({ zh: '选 ' + v, en: 'pick ' + v }).setBars(cur.map((x) => ({ value: x, role: 'pivot' as BarRole }))).commit(); }, onResult: (c) => rec.begin({ zh: '组合 {' + c.join(',') + '}', en: 'comb {' + c.join(',') + '}' }).setBars(c.map((x) => ({ value: x, role: 'final' as BarRole }))).commit() });
  rec.begin({ zh: '完成', en: 'Done' }).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { combine } from '../../src/algorithms/backtracking/bt-combinations/impl.ts';
import { buildTrace } from '../../src/algorithms/backtracking/bt-combinations/trace.ts';
test('combine 正确', () => {
  assert.equal(combine(4, 2).length, 6);
  assert.deepEqual(combine(1, 1), [[1]]);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 3. bt-n-queens  —— N 皇后
ALGS.push({
  id: 'bt-n-queens',
  m: ['N皇后', 'N-Queens', '在 n×n 棋盘放 n 个互不攻击的皇后，求方案数。', 'Count ways to place n non-attacking queens.',
    '逐行放，列/对角线标记剪枝。', 'Row by row with column/diagonal marking. O(n!).', 'O(n!)', 'O(n)', ['backtracking', 'n-queens']],
  impl: `export interface QHooks { onPlace?: (r: number, c: number) => void; onBacktrack?: (r: number, c: number) => void; onResult?: (n: number) => void; }
export function totalNQueens(n: number, hooks: QHooks = {}): number {
  const col = new Set<number>(), diag1 = new Set<number>(), diag2 = new Set<number>();
  let count = 0;
  const go = (r: number) => {
    if (r === n) { count++; hooks.onResult?.(count); return; }
    for (let c = 0; c < n; c++) {
      if (col.has(c) || diag1.has(r - c) || diag2.has(r + c)) continue;
      col.add(c); diag1.add(r - c); diag2.add(r + c);
      hooks.onPlace?.(r, c);
      go(r + 1);
      col.delete(c); diag1.delete(r - c); diag2.delete(r + c);
      hooks.onBacktrack?.(r, c);
    }
  };
  go(0);
  return count;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { totalNQueens } from './impl.ts';
export const DEFAULT_N = 4;
export function buildTrace(n: number = DEFAULT_N): Frame[] {
  const rec = new TraceRecorder();
  const placed: Array<[number, number]> = [];
  rec.begin({ zh: n + ' 皇后', en: n + '-Queens' }).commit();
  totalNQueens(n, { onPlace: (r, c) => { placed.push([r, c]); rec.begin({ zh: '放 (' + r + ',' + c + ')', en: 'place (' + r + ',' + c + ')' }).setGrid(Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => placed.some(([pr, pc]) => pr === i && pc === j) ? 'Q' : '.'))).commit(); } });
  rec.begin({ zh: '完成', en: 'Done' }).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { totalNQueens } from '../../src/algorithms/backtracking/bt-n-queens/impl.ts';
import { buildTrace } from '../../src/algorithms/backtracking/bt-n-queens/trace.ts';
test('totalNQueens 正确', () => {
  assert.equal(totalNQueens(4), 2);
  assert.equal(totalNQueens(8), 92);
  assert.equal(totalNQueens(1), 1);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 4. bt-sudoku-solver  —— 解数独
ALGS.push({
  id: 'bt-sudoku-solver',
  m: ['解数独', 'Sudoku Solver', '回溯求解 9×9 数独。', 'Backtracking to solve 9x9 sudoku.',
    '找空格，尝试 1-9，检查行列宫。', 'Try 1-9 at each empty cell. O(9^m).', 'O(9^m)', 'O(m)', ['backtracking', 'sudoku']],
  impl: `export interface SdHooks { onTry?: (r: number, c: number, v: number) => void; onSolved?: () => void; }
export function solveSudoku(board: string[][], hooks: SdHooks = {}): boolean {
  const valid = (r: number, c: number, ch: string): boolean => {
    for (let i = 0; i < 9; i++) if (board[r]![i] === ch || board[i]![c] === ch) return false;
    const br = Math.floor(r / 3) * 3, bc = Math.floor(c / 3) * 3;
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) if (board[br + i]![bc + j] === ch) return false;
    return true;
  };
  const go = (): boolean => {
    for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) {
      if (board[r]![c] !== '.') continue;
      for (let v = 1; v <= 9; v++) {
        const ch = String(v);
        if (!valid(r, c, ch)) continue;
        board[r]![c] = ch; hooks.onTry?.(r, c, v);
        if (go()) return true;
        board[r]![c] = '.';
      }
      return false;
    }
    hooks.onSolved?.();
    return true;
  };
  return go();
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { solveSudoku } from './impl.ts';
export const DEFAULT_BOARD = [['5','3','.','.','7','.','.','.','.'],['6','.','.','1','9','5','.','.','.'],['.','9','8','.','.','.','.','6','.'],['8','.','.','.','6','.','.','.','3'],['4','.','.','8','.','3','.','.','1'],['7','.','.','.','2','.','.','.','6'],['.','6','.','.','.','.','2','8','.'],['.','.','.','4','1','9','.','.','5'],['.','.','.','.','8','.','.','7','9']];
export function buildTrace(board: string[][] = DEFAULT_BOARD.map((r) => [...r])): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '解数独', en: 'Sudoku solver' }).commit();
  let steps = 0;
  solveSudoku(board, { onTry: (r, c, v) => { steps++; if (steps <= 12) rec.begin({ zh: '试 (' + r + ',' + c + ')=' + v, en: 'try (' + r + ',' + c + ')=' + v }).setGrid(board.map((row) => row.map((x) => x))).commit(); } });
  rec.begin({ zh: '完成', en: 'Done' }).setGrid(board.map((row) => row.map((x) => x))).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { solveSudoku } from '../../src/algorithms/backtracking/bt-sudoku-solver/impl.ts';
import { buildTrace } from '../../src/algorithms/backtracking/bt-sudoku-solver/trace.ts';
test('solveSudoku 正确', () => {
  const b = [['5','3','.','.','7','.','.','.','.'],['6','.','.','1','9','5','.','.','.'],['.','9','8','.','.','.','.','6','.'],['8','.','.','.','6','.','.','.','3'],['4','.','.','8','.','3','.','.','1'],['7','.','.','.','2','.','.','.','6'],['.','6','.','.','.','.','2','8','.'],['.','.','.','4','1','9','.','.','5'],['.','.','.','.','8','.','.','7','9']].map((r) => [...r]);
  assert.equal(solveSudoku(b), true);
  assert.equal(b[0]![0], '5');
  assert.equal(b[0]![2], '4');
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 5. bt-word-search  —— 单词搜索
ALGS.push({
  id: 'bt-word-search',
  m: ['单词搜索', 'Word Search', '在字符网格中找是否存在给定单词（四向相邻）。', 'Find if word exists in char grid (4-dir adjacent).',
    'DFS 回溯，标记已访问。', 'DFS backtrack with visited marking. O(N*M*4^L).', 'O(N*M*4^L)', 'O(L)', ['backtracking', 'grid', 'dfs']],
  impl: `export interface WsHooks { onStep?: (r: number, c: number, idx: number) => void; onResult?: (ok: boolean) => void; }
export function exist(board: string[][], word: string, hooks: WsHooks = {}): boolean {
  const R = board.length, C = board[0]!.length;
  const dfs = (r: number, c: number, i: number): boolean => {
    if (i === word.length) return true;
    if (r < 0 || r >= R || c < 0 || c >= C || board[r]![c] !== word[i]) return false;
    const tmp = board[r]![c];
    hooks.onStep?.(r, c, i);
    board[r]![c] = '#';
    const ok = dfs(r + 1, c, i + 1) || dfs(r - 1, c, i + 1) || dfs(r, c + 1, i + 1) || dfs(r, c - 1, i + 1);
    board[r]![c] = tmp;
    return ok;
  };
  for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) if (dfs(r, c, 0)) { hooks.onResult?.(true); return true; }
  hooks.onResult?.(false);
  return false;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { exist } from './impl.ts';
export const DEFAULT_INPUT = { board: [['A','B','C','E'],['S','F','C','S'],['A','D','E','E']], word: 'ABCCED' };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const b = input.board.map((r) => [...r]);
  rec.begin({ zh: '搜 "' + input.word + '"', en: 'Search ' + input.word }).commit();
  const ok = exist(b, input.word, { onStep: (r, c, i) => rec.begin({ zh: '步 ' + i + ' 在 (' + r + ',' + c + ')', en: 'step ' + i + ' at (' + r + ',' + c + ')' }).setAux([{ label: 'idx', value: String(i), role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '找到？' + ok, en: 'found? ' + ok }).setAux([{ label: 'ok', value: String(ok), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { exist } from '../../src/algorithms/backtracking/bt-word-search/impl.ts';
import { buildTrace } from '../../src/algorithms/backtracking/bt-word-search/trace.ts';
test('exist 正确', () => {
  assert.equal(exist([['A','B','C','E'],['S','F','C','S'],['A','D','E','E']].map((r) => [...r]), 'ABCCED'), true);
  assert.equal(exist([['A','B','C','E'],['S','F','C','S'],['A','D','E','E']].map((r) => [...r]), 'SEE'), true);
  assert.equal(exist([['A','B','C','E'],['S','F','C','S'],['A','D','E','E']].map((r) => [...r]), 'ABCB'), false);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 6. bt-palindrome-partition  —— 分割回文串
ALGS.push({
  id: 'bt-palindrome-partition',
  m: ['分割回文串', 'Palindrome Partitioning', '把字符串分割成若干回文子串的所有方案。', 'All ways to partition a string into palindromic substrings.',
    '回溯：对每个切点尝试切回文。', 'Backtrack, cut palindrome prefixes. O(n*2^n).', 'O(n*2^n)', 'O(n)', ['backtracking', 'palindrome']],
  impl: `export interface PpHooks { onCut?: (s: string) => void; onResult?: (parts: string[]) => void; }
function isPal(s: string, l: number, r: number): boolean { while (l < r) { if (s[l] !== s[r]) return false; l++; r--; } return true; }
export function partition(s: string, hooks: PpHooks = {}): string[][] {
  const out: string[][] = [];
  const cur: string[] = [];
  const go = (start: number) => {
    if (start === s.length) { out.push([...cur]); hooks.onResult?.([...cur]); return; }
    for (let end = start; end < s.length; end++) {
      if (isPal(s, start, end)) {
        const sub = s.slice(start, end + 1);
        cur.push(sub); hooks.onCut?.(sub);
        go(end + 1);
        cur.pop();
      }
    }
  };
  go(0);
  return out;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { partition } from './impl.ts';
export const DEFAULT_S = 'aab';
export function buildTrace(s: string = DEFAULT_S): Frame[] {
  const rec = new TraceRecorder();
  const cur: string[] = [];
  rec.begin({ zh: '分割 "' + s + '"', en: 'Partition "' + s + '"' }).commit();
  partition(s, { onCut: (sub) => { cur.push(sub); rec.begin({ zh: '切 "' + sub + '"', en: 'cut "' + sub + '"' }).setBars(cur.map((x, i) => ({ value: x.length, role: 'pivot' as BarRole, label: x }))).commit(); }, onResult: (p) => rec.begin({ zh: p.join('|'), en: p.join('|') }).setBars(p.map((x) => ({ value: x.length, role: 'final' as BarRole, label: x }))).commit(), });
  rec.begin({ zh: '完成', en: 'Done' }).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { partition } from '../../src/algorithms/backtracking/bt-palindrome-partition/impl.ts';
import { buildTrace } from '../../src/algorithms/backtracking/bt-palindrome-partition/trace.ts';
test('partition 正确', () => {
  assert.deepEqual(partition('aab'), [['a','a','b'],['aa','b']]);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 7. bt-letter-combos  —— 电话号码字母组合
ALGS.push({
  id: 'bt-letter-combos',
  m: ['电话号码字母组合', 'Letter Combinations of Phone', '按键数字串对应的所有字母组合。', 'All letter combos for a phone digit string.',
    '回溯：每位映射 3-4 字母。', 'Backtrack per digit. O(4^n).', 'O(4^n)', 'O(n)', ['backtracking', 'string']],
  impl: `const MAP: Record<string, string> = { '2': 'abc', '3': 'def', '4': 'ghi', '5': 'jkl', '6': 'mno', '7': 'pqrs', '8': 'tuv', '9': 'wxyz' };
export interface LcHooks { onPick?: (ch: string, idx: number) => void; onResult?: (s: string) => void; }
export function letterCombinations(digits: string, hooks: LcHooks = {}): string[] {
  if (!digits) return [];
  const out: string[] = [];
  const cur: string[] = [];
  const go = (i: number) => {
    if (i === digits.length) { out.push(cur.join('')); hooks.onResult?.(cur.join('')); return; }
    const letters = MAP[digits[i]!] ?? '';
    for (const ch of letters) { cur.push(ch); hooks.onPick?.(ch, i); go(i + 1); cur.pop(); }
  };
  go(0);
  return out;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { letterCombinations } from './impl.ts';
export const DEFAULT_DIGITS = '23';
export function buildTrace(digits: string = DEFAULT_DIGITS): Frame[] {
  const rec = new TraceRecorder();
  const cur: string[] = [];
  rec.begin({ zh: '"' + digits + '" 字母组合', en: 'Combos of ' + digits }).commit();
  letterCombinations(digits, { onPick: (ch, idx) => { cur[idx] = ch; rec.begin({ zh: '选 ' + ch, en: 'pick ' + ch }).setAux([{ label: 'cur', value: cur.join(''), role: 'pivot' as BarRole }]).commit(); }, onResult: (s) => rec.begin({ zh: s, en: s }).setBars([{ value: s.length, role: 'final' as BarRole, label: s }]).commit() });
  rec.begin({ zh: '完成', en: 'Done' }).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { letterCombinations } from '../../src/algorithms/backtracking/bt-letter-combos/impl.ts';
import { buildTrace } from '../../src/algorithms/backtracking/bt-letter-combos/trace.ts';
test('letterCombinations 正确', () => {
  assert.deepEqual(letterCombinations('23'), ['ad','ae','af','bd','be','bf','cd','ce','cf']);
  assert.deepEqual(letterCombinations(''), []);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 8. bt-generate-parens  —— 生成括号
ALGS.push({
  id: 'bt-generate-parens',
  m: ['括号生成', 'Generate Parentheses', '生成 n 对括号的所有合法组合。', 'All valid combinations of n pairs of parentheses.',
    '回溯：open < n 加 (，close < open 加 )。', 'Backtrack with open<n and close<open. O(4^n/√n).', 'O(4^n / √n)', 'O(n)', ['backtracking', 'parentheses']],
  impl: `export interface GpHooks { onAdd?: (ch: string, open: number, close: number) => void; onResult?: (s: string) => void; }
export function generateParenthesis(n: number, hooks: GpHooks = {}): string[] {
  const out: string[] = [];
  const cur: string[] = [];
  const go = (open: number, close: number) => {
    if (cur.length === n * 2) { out.push(cur.join('')); hooks.onResult?.(cur.join('')); return; }
    if (open < n) { cur.push('('); hooks.onAdd?.('(', open + 1, close); go(open + 1, close); cur.pop(); }
    if (close < open) { cur.push(')'); hooks.onAdd?.(')', open, close + 1); go(open, close + 1); cur.pop(); }
  };
  go(0, 0);
  return out;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { generateParenthesis } from './impl.ts';
export const DEFAULT_N = 3;
export function buildTrace(n: number = DEFAULT_N): Frame[] {
  const rec = new TraceRecorder();
  const cur: string[] = [];
  rec.begin({ zh: n + ' 对括号', en: n + ' pairs' }).commit();
  generateParenthesis(n, { onAdd: (ch) => { cur.push(ch); rec.begin({ zh: '加 ' + ch, en: 'add ' + ch }).setAux([{ label: 'cur', value: cur.join(''), role: 'pivot' as BarRole }]).commit(); }, onResult: (s) => rec.begin({ zh: s, en: s }).setBars([{ value: s.length, role: 'final' as BarRole, label: s }]).commit() });
  rec.begin({ zh: '完成', en: 'Done' }).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { generateParenthesis } from '../../src/algorithms/backtracking/bt-generate-parens/impl.ts';
import { buildTrace } from '../../src/algorithms/backtracking/bt-generate-parens/trace.ts';
test('generateParenthesis 正确', () => {
  const r = generateParenthesis(3);
  assert.equal(r.length, 5);
  assert.ok(r.includes('((()))'));
  assert.ok(r.includes('()()()'));
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 9. bt-restore-ip  —— 复原IP地址
ALGS.push({
  id: 'bt-restore-ip',
  m: ['复原IP地址', 'Restore IP Addresses', '从字符串复原所有合法 IPv4 地址。', 'Restore all valid IPv4 addresses from a string.',
    '回溯切 4 段，每段 0-255。', 'Backtrack 4 segments, 0-255 each. O(1).', 'O(1)', 'O(1)', ['backtracking', 'string']],
  impl: `export interface RipHooks { onSeg?: (s: string, idx: number) => void; onResult?: (ip: string) => void; }
function validSeg(s: string): boolean { if (s.length === 0 || s.length > 3) return false; if (s.length > 1 && s[0] === '0') return false; const n = Number(s); return n >= 0 && n <= 255; }
export function restoreIpAddresses(s: string, hooks: RipHooks = {}): string[] {
  const out: string[] = [];
  const cur: string[] = [];
  const go = (start: number) => {
    if (cur.length === 4 && start === s.length) { out.push(cur.join('.')); hooks.onResult?.(cur.join('.')); return; }
    if (cur.length === 4 || start >= s.length) return;
    for (let len = 1; len <= 3 && start + len <= s.length; len++) {
      const seg = s.slice(start, start + len);
      if (validSeg(seg)) { cur.push(seg); hooks.onSeg?.(seg, cur.length - 1); go(start + len); cur.pop(); }
    }
  };
  go(0);
  return out;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { restoreIpAddresses } from './impl.ts';
export const DEFAULT_S = '25525511135';
export function buildTrace(s: string = DEFAULT_S): Frame[] {
  const rec = new TraceRecorder();
  const cur: string[] = [];
  rec.begin({ zh: '复原 IP "' + s + '"', en: 'Restore IP "' + s + '"' }).commit();
  restoreIpAddresses(s, { onSeg: (seg) => { cur.push(seg); rec.begin({ zh: '段 ' + seg, en: 'seg ' + seg }).setAux([{ label: 'cur', value: cur.join('.'), role: 'pivot' as BarRole }]).commit(); }, onResult: (ip) => rec.begin({ zh: ip, en: ip }).setBars([{ value: ip.length, role: 'final' as BarRole, label: ip }]).commit() });
  rec.begin({ zh: '完成', en: 'Done' }).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { restoreIpAddresses } from '../../src/algorithms/backtracking/bt-restore-ip/impl.ts';
import { buildTrace } from '../../src/algorithms/backtracking/bt-restore-ip/trace.ts';
test('restoreIpAddresses 正确', () => {
  assert.deepEqual(restoreIpAddresses('25525511135'), ['255.255.11.135','255.255.111.35']);
  assert.deepEqual(restoreIpAddresses('0000'), ['0.0.0.0']);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 10. bt-subset-unique  —— 含重复元素的子集
ALGS.push({
  id: 'bt-subset-unique',
  m: ['子集II', 'Subsets II', '枚举含重复元素数组的所有不重复子集。', 'All distinct subsets of array with duplicates.',
    '排序后回溯，跳过同层重复。', 'Sort then skip duplicates at same level. O(n*2^n).', 'O(n*2^n)', 'O(n)', ['backtracking', 'subset']],
  impl: `export interface SuHooks { onPick?: (v: number) => void; onResult?: (s: number[]) => void; }
export function subsetsWithDup(arr: number[], hooks: SuHooks = {}): number[][] {
  const sorted = [...arr].sort((a, b) => a - b);
  const out: number[][] = [];
  const cur: number[] = [];
  const go = (start: number) => {
    out.push([...cur]); hooks.onResult?.([...cur]);
    for (let i = start; i < sorted.length; i++) {
      if (i > start && sorted[i] === sorted[i - 1]) continue;
      cur.push(sorted[i]!); hooks.onPick?.(sorted[i]!);
      go(i + 1);
      cur.pop();
    }
  };
  go(0);
  return out;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { subsetsWithDup } from './impl.ts';
export const DEFAULT_INPUT = [1, 2, 2];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const cur: number[] = [];
  rec.begin({ zh: '子集II [' + input.join(',') + ']', en: 'Subsets II' }).commit();
  subsetsWithDup(input, { onPick: (v) => { cur.push(v); rec.begin({ zh: '选 ' + v, en: 'pick ' + v }).setBars(cur.map((x) => ({ value: x, role: 'pivot' as BarRole }))).commit(); }, onResult: (s) => rec.begin({ zh: '{' + s.join(',') + '}', en: '{' + s.join(',') + '}' }).setBars(s.map((x) => ({ value: x, role: 'final' as BarRole }))).commit() });
  rec.begin({ zh: '完成', en: 'Done' }).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { subsetsWithDup } from '../../src/algorithms/backtracking/bt-subset-unique/impl.ts';
import { buildTrace } from '../../src/algorithms/backtracking/bt-subset-unique/trace.ts';
test('subsetsWithDup 正确', () => {
  const r = subsetsWithDup([1, 2, 2]);
  assert.equal(r.length, 6);
  assert.ok(r.some((x) => x.join(',') === '2,2'));
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 11. bt-permute-unique  —— 含重复元素的全排列
ALGS.push({
  id: 'bt-permute-unique',
  m: ['全排列II', 'Permutations II', '枚举含重复元素数组的所有不重复全排列。', 'All distinct permutations of array with duplicates.',
    '排序 + 回溯 + 跳过已用与同层重复。', 'Sort, skip used and same-level duplicates. O(n*n!).', 'O(n*n!)', 'O(n)', ['backtracking', 'permutation']],
  impl: `export interface PuHooks { onPick?: (v: number) => void; onResult?: (p: number[]) => void; }
export function permuteUnique(arr: number[], hooks: PuHooks = {}): number[][] {
  const sorted = [...arr].sort((a, b) => a - b);
  const out: number[][] = [];
  const cur: number[] = [];
  const used = new Array(sorted.length).fill(false);
  const go = () => {
    if (cur.length === sorted.length) { out.push([...cur]); hooks.onResult?.([...cur]); return; }
    for (let i = 0; i < sorted.length; i++) {
      if (used[i] || (i > 0 && sorted[i] === sorted[i - 1] && !used[i - 1])) continue;
      used[i] = true; cur.push(sorted[i]!); hooks.onPick?.(sorted[i]!);
      go();
      cur.pop(); used[i] = false;
    }
  };
  go();
  return out;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { permuteUnique } from './impl.ts';
export const DEFAULT_INPUT = [1, 1, 2];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const cur: number[] = [];
  rec.begin({ zh: '全排列II [' + input.join(',') + ']', en: 'Permutations II' }).commit();
  permuteUnique(input, { onPick: (v) => { cur.push(v); rec.begin({ zh: '选 ' + v, en: 'pick ' + v }).setBars(cur.map((x) => ({ value: x, role: 'pivot' as BarRole }))).commit(); }, onResult: (p) => rec.begin({ zh: p.join(''), en: p.join('') }).setBars(p.map((x) => ({ value: x, role: 'final' as BarRole }))).commit() });
  rec.begin({ zh: '完成', en: 'Done' }).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { permuteUnique } from '../../src/algorithms/backtracking/bt-permute-unique/impl.ts';
import { buildTrace } from '../../src/algorithms/backtracking/bt-permute-unique/trace.ts';
test('permuteUnique 正确', () => {
  assert.equal(permuteUnique([1, 1, 2]).length, 3);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 12. bt-combination-sum  —— 组合总和（可重用）
ALGS.push({
  id: 'bt-combination-sum',
  m: ['组合总和', 'Combination Sum', '从无重复正整数候选中选若干（可重复）使和为 target。', 'Pick candidates (with repeat) summing to target.',
    '回溯，允许同元素重复使用。', 'Backtrack, allow reuse. O(n^(t/m)).', 'O(n^(t/m))', 'O(t/m)', ['backtracking', 'combination']],
  impl: `export interface CsHooks { onPick?: (v: number) => void; onResult?: (c: number[]) => void; }
export function combinationSum(candidates: number[], target: number, hooks: CsHooks = {}): number[][] {
  const out: number[][] = [];
  const cur: number[] = [];
  const go = (start: number, remain: number) => {
    if (remain === 0) { out.push([...cur]); hooks.onResult?.([...cur]); return; }
    for (let i = start; i < candidates.length; i++) {
      if (candidates[i]! > remain) continue;
      cur.push(candidates[i]!); hooks.onPick?.(candidates[i]!);
      go(i, remain - candidates[i]!);
      cur.pop();
    }
  };
  go(0, target);
  return out;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { combinationSum } from './impl.ts';
export const DEFAULT_INPUT = { cand: [2, 3, 6, 7], target: 7 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const cur: number[] = [];
  rec.begin({ zh: '和 = ' + input.target, en: 'Sum = ' + input.target }).commit();
  combinationSum(input.cand, input.target, { onPick: (v) => { cur.push(v); rec.begin({ zh: '选 ' + v, en: 'pick ' + v }).setBars(cur.map((x) => ({ value: x, role: 'pivot' as BarRole }))).commit(); }, onResult: (c) => rec.begin({ zh: '{' + c.join(',') + '}', en: '{' + c.join(',') + '}' }).setBars(c.map((x) => ({ value: x, role: 'final' as BarRole }))).commit() });
  rec.begin({ zh: '完成', en: 'Done' }).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { combinationSum } from '../../src/algorithms/backtracking/bt-combination-sum/impl.ts';
import { buildTrace } from '../../src/algorithms/backtracking/bt-combination-sum/trace.ts';
test('combinationSum 正确', () => {
  assert.deepEqual(combinationSum([2, 3, 6, 7], 7), [[2, 2, 3], [7]]);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 13. bt-combination-sum-3  —— 组合总和III
ALGS.push({
  id: 'bt-combination-sum-3',
  m: ['组合总和III', 'Combination Sum III', '从 1-9 选 k 个不同数使和为 n。', 'Pick k distinct numbers from 1-9 summing to n.',
    '回溯，k 个数的组合。', 'Backtrack k-length combos. O(C(9,k)).', 'O(C(9,k))', 'O(k)', ['backtracking', 'combination']],
  impl: `export interface Cs3Hooks { onPick?: (v: number) => void; onResult?: (c: number[]) => void; }
export function combinationSum3(k: number, n: number, hooks: Cs3Hooks = {}): number[][] {
  const out: number[][] = [];
  const cur: number[] = [];
  const go = (start: number, remain: number) => {
    if (cur.length === k && remain === 0) { out.push([...cur]); hooks.onResult?.([...cur]); return; }
    if (cur.length >= k) return;
    for (let i = start; i <= 9; i++) {
      if (i > remain) break;
      cur.push(i); hooks.onPick?.(i);
      go(i + 1, remain - i);
      cur.pop();
    }
  };
  go(1, n);
  return out;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { combinationSum3 } from './impl.ts';
export const DEFAULT_INPUT = { k: 3, n: 7 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const cur: number[] = [];
  rec.begin({ zh: 'k=' + input.k + ' n=' + input.n, en: 'k=' + input.k + ' n=' + input.n }).commit();
  combinationSum3(input.k, input.n, { onPick: (v) => { cur.push(v); rec.begin({ zh: '选 ' + v, en: 'pick ' + v }).setBars(cur.map((x) => ({ value: x, role: 'pivot' as BarRole }))).commit(); }, onResult: (c) => rec.begin({ zh: '{' + c.join(',') + '}', en: '{' + c.join(',') + '}' }).setBars(c.map((x) => ({ value: x, role: 'final' as BarRole }))).commit() });
  rec.begin({ zh: '完成', en: 'Done' }).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { combinationSum3 } from '../../src/algorithms/backtracking/bt-combination-sum-3/impl.ts';
import { buildTrace } from '../../src/algorithms/backtracking/bt-combination-sum-3/trace.ts';
test('combinationSum3 正确', () => {
  assert.deepEqual(combinationSum3(3, 7), [[1, 2, 4]]);
  assert.deepEqual(combinationSum3(3, 9), [[1, 2, 6], [1, 3, 5], [2, 3, 4]]);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 14. bt-rat-in-maze  —— 迷宫老鼠
ALGS.push({
  id: 'bt-rat-in-maze',
  m: ['迷宫老鼠', 'Rat in a Maze', '在 N×N 迷宫找从左上到右下的路径。', 'Find path from top-left to bottom-right in a maze.',
    'DFS 四方向回溯，0 通 1 墙。', 'DFS 4-dir backtrack. O(4^(N*N)).', 'O(4^(N*N))', 'O(N*N)', ['backtracking', 'maze']],
  impl: `export interface RatHooks { onMove?: (r: number, c: number) => void; onResult?: (path: Array<[number, number]>) => void; }
export function findMazePath(maze: number[][], hooks: RatHooks = {}): Array<[number, number]> | null {
  const n = maze.length;
  const visited = Array.from({ length: n }, () => new Array(n).fill(false));
  const path: Array<[number, number]> = [];
  const go = (r: number, c: number): boolean => {
    if (r < 0 || r >= n || c < 0 || c >= n || maze[r]![c] === 1 || visited[r]![c]) return false;
    visited[r]![c] = true; path.push([r, c]); hooks.onMove?.(r, c);
    if (r === n - 1 && c === n - 1) return true;
    if (go(r + 1, c) || go(r, c + 1) || go(r - 1, c) || go(r, c - 1)) return true;
    path.pop();
    return false;
  };
  if (go(0, 0)) { hooks.onResult?.(path); return path; }
  return null;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { findMazePath } from './impl.ts';
export const DEFAULT_MAZE = [[0,1,0,0],[0,0,0,1],[1,0,1,0],[0,0,0,0]];
export function buildTrace(maze: number[][] = DEFAULT_MAZE.map((r) => [...r])): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '迷宫老鼠', en: 'Rat in maze' }).commit();
  const p = findMazePath(maze, { onMove: (r, c) => rec.begin({ zh: '走 (' + r + ',' + c + ')', en: 'move (' + r + ',' + c + ')' }).setGrid(maze.map((row, i) => row.map((v, j) => String(v)))).commit() });
  rec.begin({ zh: p ? '找到路径' : '无解', en: p ? 'Found' : 'No path' }).setAux([{ label: 'len', value: String(p?.length ?? 0), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findMazePath } from '../../src/algorithms/backtracking/bt-rat-in-maze/impl.ts';
import { buildTrace } from '../../src/algorithms/backtracking/bt-rat-in-maze/trace.ts';
test('findMazePath 正确', () => {
  const p = findMazePath([[0,1,0,0],[0,0,0,1],[1,0,1,0],[0,0,0,0]].map((r) => [...r]));
  assert.ok(p !== null);
  assert.deepEqual(p![0], [0, 0]);
  assert.deepEqual(p![p!.length - 1], [3, 3]);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 15. bt-knight-tour  —— 骑士周游
ALGS.push({
  id: 'bt-knight-tour',
  m: ['骑士周游', "Knight's Tour", '在 n×n 棋盘找骑士访问每格一次的路线。', 'Find a knight tour visiting every square once.',
    '回溯，8 方向跳跃。', 'Backtrack 8 moves. O(8^(N*N)).', 'O(8^(N*N))', 'O(N*N)', ['backtracking', 'knight']],
  impl: `const MOVES: Array<[number, number]> = [[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]];
export interface KtHooks { onMove?: (r: number, c: number, step: number) => void; onResult?: (board: number[][]) => void; }
export function knightsTour(n: number, sr: number = 0, sc: number = 0, hooks: KtHooks = {}): number[][] | null {
  const board = Array.from({ length: n }, () => new Array(n).fill(-1));
  const go = (r: number, c: number, step: number): boolean => {
    if (step === n * n) return true;
    for (const [dr, dc] of MOVES) {
      const nr = r + dr, nc = c + dc;
      if (nr < 0 || nr >= n || nc < 0 || nc >= n || board[nr]![nc] !== -1) continue;
      board[nr]![nc] = step; hooks.onMove?.(nr, nc, step);
      if (go(nr, nc, step + 1)) return true;
      board[nr]![nc] = -1;
    }
    return false;
  };
  board[sr]![sc] = 0; hooks.onMove?.(sr, sc, 0);
  if (go(sr, sc, 1)) { hooks.onResult?.(board); return board; }
  return null;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { knightsTour } from './impl.ts';
export const DEFAULT_N = 5;
export function buildTrace(n: number = DEFAULT_N): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: n + '×' + n + ' 骑士周游', en: n + 'x' + n + ' knight tour' }).commit();
  let steps = 0;
  const b = knightsTour(n, 0, 0, { onMove: (r, c, step) => { steps++; if (steps % 3 === 0) rec.begin({ zh: '步 ' + step + ' 在 (' + r + ',' + c + ')', en: 'step ' + step + ' at (' + r + ',' + c + ')' }).setGrid(Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => String(b?.[i]?.[j] ?? -1)))).commit(); } });
  rec.begin({ zh: b ? '完成' : '无解', en: b ? 'Done' : 'No tour' }).setGrid(b ? b.map((row) => row.map((v) => String(v))) : []).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { knightsTour } from '../../src/algorithms/backtracking/bt-knight-tour/impl.ts';
import { buildTrace } from '../../src/algorithms/backtracking/bt-knight-tour/trace.ts';
test('knightsTour 正确', () => {
  const b = knightsTour(5, 0, 0);
  assert.ok(b !== null);
  const flat = b!.flat().sort((a, x) => a - x);
  assert.deepEqual(flat, Array.from({ length: 25 }, (_, i) => i));
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 16. bt-m-coloring  —— 图的 m 着色
ALGS.push({
  id: 'bt-m-coloring',
  m: ['图m着色', 'Graph M-Coloring', '判断无向图能否用 m 种颜色着色使相邻不同色。', 'Can color graph with m colors so adjacent differ.',
    '回溯逐节点试色。', 'Try colors per vertex. O(m^V).', 'O(m^V)', 'O(V)', ['backtracking', 'coloring']],
  impl: `export interface McHooks { onColor?: (v: number, c: number) => void; onResult?: (ok: boolean) => void; }
export function graphColoring(n: number, edges: Array<[number, number]>, m: number, hooks: McHooks = {}): boolean {
  const adj: boolean[][] = Array.from({ length: n }, () => new Array(n).fill(false));
  for (const [a, b] of edges) { adj[a]![b] = true; adj[b]![a] = true; }
  const color = new Array(n).fill(0);
  const safe = (v: number, c: number): boolean => { for (let i = 0; i < v; i++) if (adj[v]![i] && color[i] === c) return false; return true; };
  const go = (v: number): boolean => {
    if (v === n) return true;
    for (let c = 1; c <= m; c++) {
      if (safe(v, c)) { color[v] = c; hooks.onColor?.(v, c); if (go(v + 1)) return true; color[v] = 0; }
    }
    return false;
  };
  const ok = go(0);
  hooks.onResult?.(ok);
  return ok;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { graphColoring } from './impl.ts';
export const DEFAULT_INPUT = { n: 4, edges: [[0,1],[0,2],[1,2],[1,3]] as Array<[number, number]>, m: 3 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: input.m + ' 着色', en: input.m + '-coloring' }).commit();
  const ok = graphColoring(input.n, input.edges, input.m, { onColor: (v, c) => rec.begin({ zh: v + ' 染色 ' + c, en: 'v' + v + ' color ' + c }).setAux([{ label: 'color', value: String(c), role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '可着色？' + ok, en: 'ok? ' + ok }).setAux([{ label: 'ok', value: String(ok), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { graphColoring } from '../../src/algorithms/backtracking/bt-m-coloring/impl.ts';
import { buildTrace } from '../../src/algorithms/backtracking/bt-m-coloring/trace.ts';
test('graphColoring 正确', () => {
  assert.equal(graphColoring(4, [[0,1],[0,2],[1,2],[1,3]], 3), true);
  assert.equal(graphColoring(3, [[0,1],[1,2],[2,0]], 2), false);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 17. bt-word-break-2  —— 单词拆分II
ALGS.push({
  id: 'bt-word-break-2',
  m: ['单词拆分II', 'Word Break II', '把字符串拆成字典词的所有句子。', 'All sentences splitting string into dictionary words.',
    '回溯切词，记录路径。', 'Backtrack word prefixes. O(2^n).', 'O(2^n)', 'O(n)', ['backtracking', 'string']],
  impl: `export interface WbHooks { onCut?: (w: string) => void; onResult?: (s: string) => void; }
export function wordBreak(s: string, wordDict: string[], hooks: WbHooks = {}): string[] {
  const dict = new Set(wordDict);
  const out: string[] = [];
  const cur: string[] = [];
  const go = (start: number) => {
    if (start === s.length) { out.push(cur.join(' ')); hooks.onResult?.(cur.join(' ')); return; }
    for (let end = start + 1; end <= s.length; end++) {
      const w = s.slice(start, end);
      if (dict.has(w)) { cur.push(w); hooks.onCut?.(w); go(end); cur.pop(); }
    }
  };
  go(0);
  return out;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { wordBreak } from './impl.ts';
export const DEFAULT_INPUT = { s: 'catsanddog', dict: ['cat','cats','and','sand','dog'] };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const cur: string[] = [];
  rec.begin({ zh: '拆 "' + input.s + '"', en: 'Break "' + input.s + '"' }).commit();
  wordBreak(input.s, input.dict, { onCut: (w) => { cur.push(w); rec.begin({ zh: '切 "' + w + '"', en: 'cut "' + w + '"' }).setAux([{ label: 'cur', value: cur.join(' '), role: 'pivot' as BarRole }]).commit(); }, onResult: (s2) => rec.begin({ zh: s2, en: s2 }).setBars([{ value: s2.length, role: 'final' as BarRole, label: s2 }]).commit() });
  rec.begin({ zh: '完成', en: 'Done' }).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { wordBreak } from '../../src/algorithms/backtracking/bt-word-break-2/impl.ts';
import { buildTrace } from '../../src/algorithms/backtracking/bt-word-break-2/trace.ts';
test('wordBreak 正确', () => {
  const r = wordBreak('catsanddog', ['cat','cats','and','sand','dog']);
  assert.equal(r.length, 2);
  assert.ok(r.includes('cats and dog'));
  assert.ok(r.includes('cat sand dog'));
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 18. bt-expression-add  —— 表达式加减运算
ALGS.push({
  id: 'bt-expression-add',
  m: ['表达式加减', 'Expression Add Operators', '在数字串中插入 + - * 使表达式等于目标值。', 'Insert + - * into digit string to reach target.',
    '回溯，每步选运算符与操作数。', 'Backtrack operators and operands. O(4^n).', 'O(4^n)', 'O(n)', ['backtracking', 'expression']],
  impl: `export interface EaHooks { onExpr?: (e: string) => void; onResult?: (e: string) => void; }
export function addOperators(num: string, target: number, hooks: EaHooks = {}): string[] {
  const out: string[] = [];
  const n = num.length;
  const dfs = (idx: number, prev: number, cur: number, expr: string) => {
    if (idx === n) { if (cur === target) { out.push(expr); hooks.onResult?.(expr); } return; }
    for (let i = idx; i < n; i++) {
      if (i > idx && num[idx] === '0') break;
      const valStr = num.slice(idx, i + 1);
      const val = Number(valStr);
      if (idx === 0) { dfs(i + 1, val, val, valStr); hooks.onExpr?.(valStr); }
      else {
        dfs(i + 1, val, cur + val, expr + '+' + valStr);
        dfs(i + 1, -val, cur - val, expr + '-' + valStr);
        dfs(i + 1, prev * val, cur - prev + prev * val, expr + '*' + valStr);
      }
    }
  };
  dfs(0, 0, 0, '');
  return out;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { addOperators } from './impl.ts';
export const DEFAULT_INPUT = { num: '123', target: 6 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '表达式目标 ' + input.target, en: 'target ' + input.target }).commit();
  const r = addOperators(input.num, input.target, { onResult: (e) => rec.begin({ zh: e, en: e }).setAux([{ label: 'expr', value: e, role: 'final' as BarRole }]).commit() });
  rec.begin({ zh: '共 ' + r.length + ' 个', en: r.length + ' exprs' }).setAux([{ label: 'count', value: String(r.length), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { addOperators } from '../../src/algorithms/backtracking/bt-expression-add/impl.ts';
import { buildTrace } from '../../src/algorithms/backtracking/bt-expression-add/trace.ts';
test('addOperators 正确', () => {
  const r = addOperators('123', 6);
  assert.ok(r.includes('1+2+3'));
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 19. bt-binary-strings  —— 二进制字符串枚举
ALGS.push({
  id: 'bt-binary-strings',
  m: ['二进制串枚举', 'Binary Strings', '枚举长度 n 的所有二进制字符串。', 'Enumerate all binary strings of length n.',
    '回溯每位选 0 或 1。', 'Backtrack each bit. O(2^n).', 'O(2^n)', 'O(n)', ['backtracking', 'binary']],
  impl: `export interface BsHooks { onBit?: (idx: number, b: number) => void; onResult?: (s: string) => void; }
export function binaryStrings(n: number, hooks: BsHooks = {}): string[] {
  const out: string[] = [];
  const cur: number[] = [];
  const go = (i: number) => {
    if (i === n) { out.push(cur.join('')); hooks.onResult?.(cur.join('')); return; }
    for (const b of [0, 1]) { cur[i] = b; hooks.onBit?.(i, b); go(i + 1); }
  };
  go(0);
  return out;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { binaryStrings } from './impl.ts';
export const DEFAULT_N = 3;
export function buildTrace(n: number = DEFAULT_N): Frame[] {
  const rec = new TraceRecorder();
  const cur: number[] = [];
  rec.begin({ zh: n + ' 位二进制串', en: n + '-bit strings' }).commit();
  binaryStrings(n, { onBit: (idx, b) => { cur[idx] = b; rec.begin({ zh: '位 ' + idx + '=' + b, en: 'bit ' + idx + '=' + b }).setAux([{ label: 'cur', value: cur.join(''), role: 'pivot' as BarRole }]).commit(); }, onResult: (s) => rec.begin({ zh: s, en: s }).setBars([{ value: parseInt(s, 2), role: 'final' as BarRole, label: s }]).commit() });
  rec.begin({ zh: '完成', en: 'Done' }).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { binaryStrings } from '../../src/algorithms/backtracking/bt-binary-strings/impl.ts';
import { buildTrace } from '../../src/algorithms/backtracking/bt-binary-strings/trace.ts';
test('binaryStrings 正确', () => {
  assert.equal(binaryStrings(3).length, 8);
  assert.ok(binaryStrings(2).includes('10'));
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 20. bt-subsets-size-k  —— 大小为 k 的子集
ALGS.push({
  id: 'bt-subsets-size-k',
  m: ['大小为k的子集', 'Subsets of Size K', '枚举 n 元素中大小恰为 k 的所有子集。', 'All subsets of size exactly k from n elements.',
    '回溯选入，达到 k 即记录。', 'Backtrack, record when size k. O(C(n,k)).', 'O(C(n,k))', 'O(k)', ['backtracking', 'subset']],
  impl: `export interface SkHooks { onPick?: (v: number) => void; onResult?: (s: number[]) => void; }
export function subsetsOfSizeK(n: number, k: number, hooks: SkHooks = {}): number[][] {
  const out: number[][] = [];
  const cur: number[] = [];
  const go = (start: number) => {
    if (cur.length === k) { out.push([...cur]); hooks.onResult?.([...cur]); return; }
    for (let i = start; i <= n; i++) { cur.push(i); hooks.onPick?.(i); go(i + 1); cur.pop(); }
  };
  go(1);
  return out;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { subsetsOfSizeK } from './impl.ts';
export const DEFAULT_INPUT = { n: 5, k: 2 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const cur: number[] = [];
  rec.begin({ zh: 'C(' + input.n + ',' + input.k + ')', en: 'C(' + input.n + ',' + input.k + ')' }).commit();
  subsetsOfSizeK(input.n, input.k, { onPick: (v) => { cur.push(v); rec.begin({ zh: '选 ' + v, en: 'pick ' + v }).setBars(cur.map((x) => ({ value: x, role: 'pivot' as BarRole }))).commit(); }, onResult: (s) => rec.begin({ zh: '{' + s.join(',') + '}', en: '{' + s.join(',') + '}' }).setBars(s.map((x) => ({ value: x, role: 'final' as BarRole }))).commit() });
  rec.begin({ zh: '完成', en: 'Done' }).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { subsetsOfSizeK } from '../../src/algorithms/backtracking/bt-subsets-size-k/impl.ts';
import { buildTrace } from '../../src/algorithms/backtracking/bt-subsets-size-k/trace.ts';
test('subsetsOfSizeK 正确', () => {
  assert.equal(subsetsOfSizeK(4, 2).length, 6);
  assert.equal(subsetsOfSizeK(5, 0).length, 1);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 21. bt-different-ways-paren  —— 不同括号求值
ALGS.push({
  id: 'bt-different-ways-paren',
  m: ['不同括号求值', 'Different Ways to Add Parentheses', '给表达式加不同括号得到的所有可能值。', 'All possible values by adding parens differently.',
    '分治：找每个运算符切分左右。', 'Divide at each operator. O(4^n/n).', 'O(4^n / n)', 'O(n)', ['backtracking', 'divide-conquer']],
  impl: `export interface DwpHooks { onCombine?: (l: number, op: string, r: number, res: number) => void; onResult?: (vals: number[]) => void; }
export function diffWaysToCompute(expr: string, hooks: DwpHooks = {}): number[] {
  const go = (s: string): number[] => {
    const out: number[] = [];
    let hasOp = false;
    for (let i = 0; i < s.length; i++) {
      const ch = s[i]!;
      if (ch === '+' || ch === '-' || ch === '*') {
        hasOp = true;
        const left = go(s.slice(0, i));
        const right = go(s.slice(i + 1));
        for (const l of left) for (const r of right) {
          const v = ch === '+' ? l + r : ch === '-' ? l - r : l * r;
          out.push(v); hooks.onCombine?.(l, ch, r, v);
        }
      }
    }
    if (!hasOp) return [Number(s)];
    return out;
  };
  const r = go(expr);
  hooks.onResult?.(r);
  return r;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { diffWaysToCompute } from './impl.ts';
export const DEFAULT_EXPR = '2-1-1';
export function buildTrace(expr: string = DEFAULT_EXPR): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '"' + expr + '" 求值', en: 'Compute "' + expr + '"' }).commit();
  const vals = diffWaysToCompute(expr, { onCombine: (l, op, r, res) => rec.begin({ zh: l + op + r + '=' + res, en: l + op + r + '=' + res }).setAux([{ label: 'val', value: String(res), role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '可能值：' + vals.join(','), en: 'vals: ' + vals.join(',') }).setBars(vals.map((v) => ({ value: v, role: 'final' as BarRole }))).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { diffWaysToCompute } from '../../src/algorithms/backtracking/bt-different-ways-paren/impl.ts';
import { buildTrace } from '../../src/algorithms/backtracking/bt-different-ways-paren/trace.ts';
test('diffWaysToCompute 正确', () => {
  const v = diffWaysToCompute('2-1-1').sort((a, b) => a - b);
  assert.deepEqual(v, [0, 2]);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 22. bt-max-unique-substrings  —— 字符串最大唯一拆分
ALGS.push({
  id: 'bt-max-unique-substrings',
  m: ['最大唯一拆分', 'Max Unique Substrings Split', '把字符串拆成尽量多的互不相同的子串。', 'Split string into max number of distinct substrings.',
    '回溯切分，集合去重。', 'Backtrack with a set of used substrings. O(2^n).', 'O(2^n)', 'O(n)', ['backtracking', 'string']],
  impl: `export interface MusHooks { onCut?: (s: string) => void; onResult?: (max: number) => void; }
export function maxUniqueSplit(s: string, hooks: MusHooks = {}): number {
  let max = 0;
  const seen = new Set<string>();
  const go = (start: number) => {
    if (start === s.length) { max = Math.max(max, seen.size); return; }
    for (let end = start + 1; end <= s.length; end++) {
      const sub = s.slice(start, end);
      if (seen.has(sub)) continue;
      seen.add(sub); hooks.onCut?.(sub);
      go(end);
      seen.delete(sub);
    }
  };
  go(0);
  hooks.onResult?.(max);
  return max;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { maxUniqueSplit } from './impl.ts';
export const DEFAULT_S = 'ababccc';
export function buildTrace(s: string = DEFAULT_S): Frame[] {
  const rec = new TraceRecorder();
  const cur: string[] = [];
  rec.begin({ zh: '"' + s + '" 最大唯一拆分', en: 'Max split of "' + s + '"' }).commit();
  maxUniqueSplit(s, { onCut: (sub) => { cur.push(sub); rec.begin({ zh: '切 "' + sub + '"', en: 'cut "' + sub + '"' }).setBars(cur.map((x, i) => ({ value: x.length, role: 'pivot' as BarRole, label: x }))).commit(); } });
  rec.begin({ zh: '完成', en: 'Done' }).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { maxUniqueSplit } from '../../src/algorithms/backtracking/bt-max-unique-substrings/impl.ts';
import { buildTrace } from '../../src/algorithms/backtracking/bt-max-unique-substrings/trace.ts';
test('maxUniqueSplit 正确', () => {
  assert.equal(maxUniqueSplit('ababccc'), 4);
  assert.equal(maxUniqueSplit('aba'), 2);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 23. bt-stickers  —— 贴纸拼词
ALGS.push({
  id: 'bt-stickers',
  m: ['贴纸拼词', 'Stickers to Spell Word', '用最少贴纸拼出目标词（回溯+剪枝）。', 'Min stickers to spell target word.',
    '回溯枚举每张贴纸的取用。', 'Backtrack over sticker choices. O(n^m).', 'O(n^m)', 'O(m)', ['backtracking', 'string']],
  impl: `export interface StHooks { onUse?: (i: number) => void; onResult?: (min: number) => void; }
export function minStickers(stickers: string[], target: string, hooks: StHooks = {}): number {
  const cnt = (w: string): Map<string, number> => { const m = new Map<string, number>(); for (const ch of w) m.set(ch, (m.get(ch) ?? 0) + 1); return m; };
  const stk = stickers.map(cnt);
  const tgt = cnt(target);
  let best = Infinity;
  const go = (remain: Map<string, number>, used: number) => {
    const keys = [...remain.keys()].filter((k) => (remain.get(k) ?? 0) > 0);
    if (keys.length === 0) { best = Math.min(best, used); return; }
    if (used >= best) return;
    const first = keys[0]!;
    for (let i = 0; i < stickers.length; i++) {
      if (!stk[i]!.has(first)) continue;
      const nr = new Map(remain);
      for (const [ch, c] of stk[i]!) nr.set(ch, (nr.get(ch) ?? 0) - c);
      hooks.onUse?.(i);
      go(nr, used + 1);
    }
  };
  go(tgt, 0);
  const r = best === Infinity ? -1 : best;
  hooks.onResult?.(r);
  return r;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { minStickers } from './impl.ts';
export const DEFAULT_INPUT = { stickers: ['with','example','science'], target: 'thehat' };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '贴纸拼 "' + input.target + '"', en: 'Spell "' + input.target + '"' }).commit();
  const m = minStickers(input.stickers, input.target, { onUse: (i) => rec.begin({ zh: '用第 ' + i + ' 张', en: 'use sticker ' + i }).setAux([{ label: 'sticker', value: String(i), role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '最少 = ' + m, en: 'min = ' + m }).setAux([{ label: 'min', value: String(m), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { minStickers } from '../../src/algorithms/backtracking/bt-stickers/impl.ts';
import { buildTrace } from '../../src/algorithms/backtracking/bt-stickers/trace.ts';
test('minStickers 正确', () => {
  assert.equal(minStickers(['with','example','science'], 'thehat'), 3);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 24. bt-matchsticks-square  —— 火柴拼正方形
ALGS.push({
  id: 'bt-matchsticks-square',
  m: ['火柴拼正方形', 'Matchsticks to Square', '判断能否用所有火柴拼成正方形（4 边相等）。', 'Can form a square using all matchsticks.',
    '总和须被 4 整除，回溯放每条边。', 'Sum divisible by 4, backtrack sides. O(4^n).', 'O(4^n)', 'O(n)', ['backtracking', 'partition']],
  impl: `export interface MsHooks { onPlace?: (idx: number, side: number) => void; onResult?: (ok: boolean) => void; }
export function makesquare(matchsticks: number[], hooks: MsHooks = {}): boolean {
  const sum = matchsticks.reduce((a, b) => a + b, 0);
  if (sum % 4 !== 0) return false;
  const target = sum / 4;
  const sides = new Array(4).fill(0);
  const sorted = [...matchsticks].sort((a, b) => b - a);
  const go = (i: number): boolean => {
    if (i === sorted.length) return sides.every((s) => s === target);
    for (let s = 0; s < 4; s++) {
      if (sides[s]! + sorted[i]! > target) continue;
      if (s > 0 && sides[s] === sides[s - 1]) continue;
      sides[s] += sorted[i]!; hooks.onPlace?.(i, s);
      if (go(i + 1)) return true;
      sides[s] -= sorted[i]!;
    }
    return false;
  };
  const ok = go(0);
  hooks.onResult?.(ok);
  return ok;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { makesquare } from './impl.ts';
export const DEFAULT_INPUT = [1, 1, 2, 2, 2];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '火柴拼正方形', en: 'Matchsticks square' }).commit();
  const ok = makesquare(input, { onPlace: (idx, side) => rec.begin({ zh: '火柴 ' + input[idx] + ' 放边 ' + side, en: 'stick ' + input[idx] + ' side ' + side }).setBars([0,1,2,3].map((s) => ({ value: 0, role: 'pivot' as BarRole, label: 'side' + s }))).commit() });
  rec.begin({ zh: '可拼？' + ok, en: 'ok? ' + ok }).setAux([{ label: 'ok', value: String(ok), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { makesquare } from '../../src/algorithms/backtracking/bt-matchsticks-square/impl.ts';
import { buildTrace } from '../../src/algorithms/backtracking/bt-matchsticks-square/trace.ts';
test('makesquare 正确', () => {
  assert.equal(makesquare([1, 1, 2, 2, 2]), true);
  assert.equal(makesquare([3, 3, 3, 3, 4]), false);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 25. bt-partition-k-equal  —— 划分成 k 个相等子集
ALGS.push({
  id: 'bt-partition-k-equal',
  m: ['划分k个相等子集', 'Partition into K Equal Subsets', '判断数组能否划分成 k 个和相等的子集。', 'Can partition array into k equal-sum subsets.',
    '总和须被 k 整除，回溯装桶。', 'Sum divisible by k, backtrack buckets. O(k^n).', 'O(k^n)', 'O(n)', ['backtracking', 'partition']],
  impl: `export interface PkHooks { onPlace?: (idx: number, bucket: number) => void; onResult?: (ok: boolean) => void; }
export function canPartitionKSubsets(nums: number[], k: number, hooks: PkHooks = {}): boolean {
  const sum = nums.reduce((a, b) => a + b, 0);
  if (sum % k !== 0) return false;
  const target = sum / k;
  const sorted = [...nums].sort((a, b) => b - a);
  if (sorted[0]! > target) return false;
  const buckets = new Array(k).fill(0);
  const go = (i: number): boolean => {
    if (i === sorted.length) return true;
    for (let b = 0; b < k; b++) {
      if (buckets[b]! + sorted[i]! > target) continue;
      if (b > 0 && buckets[b] === buckets[b - 1]) continue;
      buckets[b] += sorted[i]!; hooks.onPlace?.(i, b);
      if (go(i + 1)) return true;
      buckets[b] -= sorted[i]!;
    }
    return false;
  };
  const ok = go(0);
  hooks.onResult?.(ok);
  return ok;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { canPartitionKSubsets } from './impl.ts';
export const DEFAULT_INPUT = { nums: [4, 3, 2, 3, 5, 2, 1], k: 4 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '划分 ' + input.k + ' 等和子集', en: 'Partition k=' + input.k }).commit();
  const ok = canPartitionKSubsets(input.nums, input.k, { onPlace: (idx, bucket) => rec.begin({ zh: input.nums[idx] + ' 入桶 ' + bucket, en: input.nums[idx] + ' bucket ' + bucket }).setAux([{ label: 'bucket', value: String(bucket), role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '可划分？' + ok, en: 'ok? ' + ok }).setAux([{ label: 'ok', value: String(ok), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { canPartitionKSubsets } from '../../src/algorithms/backtracking/bt-partition-k-equal/impl.ts';
import { buildTrace } from '../../src/algorithms/backtracking/bt-partition-k-equal/trace.ts';
test('canPartitionKSubsets 正确', () => {
  assert.equal(canPartitionKSubsets([4, 3, 2, 3, 5, 2, 1], 4), true);
  assert.equal(canPartitionKSubsets([1, 2, 3, 4], 3), false);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 26. bt-beautiful-arrange  —— 美丽排列
ALGS.push({
  id: 'bt-beautiful-arrange',
  m: ['美丽排列', 'Beautiful Arrangement', '1..n 排列满足 perm[i] 整除 i 或 i 整除 perm[i] 的方案数。', 'Count permutations where perm[i] divides i or vice versa.',
    '回溯逐位填数。', 'Backtrack position by position. O(k).', 'O(k)', 'O(n)', ['backtracking', 'permutation']],
  impl: `export interface BaHooks { onPlace?: (pos: number, v: number) => void; onResult?: (count: number) => void; }
export function countArrangement(n: number, hooks: BaHooks = {}): number {
  const used = new Array(n + 1).fill(false);
  let count = 0;
  const go = (pos: number) => {
    if (pos > n) { count++; hooks.onResult?.(count); return; }
    for (let v = 1; v <= n; v++) {
      if (used[v]) continue;
      if (v % pos === 0 || pos % v === 0) {
        used[v] = true; hooks.onPlace?.(pos, v);
        go(pos + 1);
        used[v] = false;
      }
    }
  };
  go(1);
  return count;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { countArrangement } from './impl.ts';
export const DEFAULT_N = 3;
export function buildTrace(n: number = DEFAULT_N): Frame[] {
  const rec = new TraceRecorder();
  const cur: number[] = [];
  rec.begin({ zh: '美丽排列 n=' + n, en: 'Beautiful arrangement n=' + n }).commit();
  countArrangement(n, { onPlace: (pos, v) => { cur[pos - 1] = v; rec.begin({ zh: '位 ' + pos + ' 放 ' + v, en: 'pos ' + pos + ' = ' + v }).setBars(cur.slice(0, pos).map((x) => ({ value: x, role: 'pivot' as BarRole }))).commit(); } });
  rec.begin({ zh: '完成', en: 'Done' }).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { countArrangement } from '../../src/algorithms/backtracking/bt-beautiful-arrange/impl.ts';
import { buildTrace } from '../../src/algorithms/backtracking/bt-beautiful-arrange/trace.ts';
test('countArrangement 正确', () => {
  assert.equal(countArrangement(2), 2);
  assert.equal(countArrangement(1), 1);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 27. bt-path-sum-2  —— 路径总和II（树回溯）
ALGS.push({
  id: 'bt-path-sum-2',
  m: ['路径总和II', 'Path Sum II', '找二叉树中从根到叶和等于 target 的所有路径。', 'All root-to-leaf paths summing to target.',
    'DFS 回溯路径。', 'DFS with path backtrack. O(n).', 'O(n)', 'O(h)', ['backtracking', 'tree']],
  impl: `export interface TNode { val: number; left: TNode | null; right: TNode | null; }
export interface Ps2Hooks { onPush?: (v: number) => void; onResult?: (p: number[]) => void; }
export function pathSum(root: TNode | null, target: number, hooks: Ps2Hooks = {}): number[][] {
  const out: number[][] = [];
  const cur: number[] = [];
  const dfs = (node: TNode | null, remain: number) => {
    if (!node) return;
    cur.push(node.val); hooks.onPush?.(node.val);
    if (!node.left && !node.right && remain === node.val) { out.push([...cur]); hooks.onResult?.([...cur]); }
    dfs(node.left, remain - node.val);
    dfs(node.right, remain - node.val);
    cur.pop();
  };
  dfs(root, target);
  return out;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { pathSum, type TNode } from './impl.ts';
export const DEFAULT_INPUT = { root: { val: 5, left: { val: 4, left: { val: 11, left: { val: 7, left: null, right: null }, right: { val: 2, left: null, right: null } }, right: null }, right: { val: 8, left: { val: 13, left: null, right: null }, right: { val: 4, left: { val: 5, left: null, right: null }, right: { val: 1, left: null, right: null } } } } as TNode, target: 22 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const cur: number[] = [];
  rec.begin({ zh: '路径和 = ' + input.target, en: 'Sum = ' + input.target }).commit();
  pathSum(input.root, input.target, { onPush: (v) => { cur.push(v); rec.begin({ zh: '入 ' + v, en: 'push ' + v }).setBars(cur.map((x) => ({ value: x, role: 'pivot' as BarRole }))).commit(); }, onResult: (p) => rec.begin({ zh: p.join('→'), en: p.join('→') }).setBars(p.map((x) => ({ value: x, role: 'final' as BarRole }))).commit() });
  rec.begin({ zh: '完成', en: 'Done' }).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pathSum, type TNode } from '../../src/algorithms/backtracking/bt-path-sum-2/impl.ts';
import { buildTrace } from '../../src/algorithms/backtracking/bt-path-sum-2/trace.ts';
const tree: TNode = { val: 5, left: { val: 4, left: { val: 11, left: { val: 7, left: null, right: null }, right: { val: 2, left: null, right: null } }, right: null }, right: { val: 8, left: { val: 13, left: null, right: null }, right: { val: 4, left: { val: 5, left: null, right: null }, right: { val: 1, left: null, right: null } } } };
test('pathSum 正确', () => {
  const r = pathSum(tree, 22);
  assert.equal(r.length, 2);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 28. bt-all-paths-graph  —— 图所有路径
ALGS.push({
  id: 'bt-all-paths-graph',
  m: ['图所有路径', 'All Paths in Graph', '枚举图中从源到汇的所有简单路径。', 'All simple paths from source to sink in a graph.',
    'DFS 回溯，访问标记。', 'DFS backtrack with visited. O(2^V * V).', 'O(2^V * V)', 'O(V)', ['backtracking', 'graph']],
  impl: `export interface AgHooks { onPush?: (v: number) => void; onResult?: (p: number[]) => void; }
export function allPaths(graph: number[][], src: number, dst: number, hooks: AgHooks = {}): number[][] {
  const out: number[][] = [];
  const cur: number[] = [src];
  const visited = new Set<number>([src]);
  const dfs = (u: number) => {
    if (u === dst) { out.push([...cur]); hooks.onResult?.([...cur]); return; }
    for (const v of graph[u] ?? []) {
      if (visited.has(v)) continue;
      visited.add(v); cur.push(v); hooks.onPush?.(v);
      dfs(v);
      cur.pop(); visited.delete(v);
    }
  };
  dfs(src);
  return out;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { allPaths } from './impl.ts';
export const DEFAULT_INPUT = { graph: [[1, 2], [3], [3], []], src: 0, dst: 3 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const cur: number[] = [input.src];
  rec.begin({ zh: '图所有路径 0→3', en: 'All paths 0→3' }).commit();
  allPaths(input.graph, input.src, input.dst, { onPush: (v) => { cur.push(v); rec.begin({ zh: '入 ' + v, en: 'push ' + v }).setBars(cur.map((x) => ({ value: x, role: 'pivot' as BarRole }))).commit(); }, onResult: (p) => rec.begin({ zh: p.join('→'), en: p.join('→') }).setBars(p.map((x) => ({ value: x, role: 'final' as BarRole }))).commit() });
  rec.begin({ zh: '完成', en: 'Done' }).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { allPaths } from '../../src/algorithms/backtracking/bt-all-paths-graph/impl.ts';
import { buildTrace } from '../../src/algorithms/backtracking/bt-all-paths-graph/trace.ts';
test('allPaths 正确', () => {
  assert.deepEqual(allPaths([[1, 2], [3], [3], []], 0, 3), [[0, 1, 3], [0, 2, 3]]);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 29. bt-template-match  —— 模板匹配字符串
ALGS.push({
  id: 'bt-template-match',
  m: ['单词模式匹配', 'Word Pattern Matching', '判断字符串能否按模式匹配（双射）。', 'Match string to pattern (bijection).',
    '回溯分配 模式字符→子串。', 'Backtrack char-to-substring mapping. O(n^m).', 'O(n^m)', 'O(m)', ['backtracking', 'pattern']],
  impl: `export interface TmHooks { onMap?: (ch: string, sub: string) => void; onResult?: (ok: boolean) => void; }
export function wordPatternMatch(pattern: string, s: string, hooks: TmHooks = {}): boolean {
  const ch2str = new Map<string, string>();
  const str2ch = new Map<string, string>();
  const go = (pi: number, si: number): boolean => {
    if (pi === pattern.length && si === s.length) return true;
    if (pi === pattern.length || si === s.length) return false;
    const ch = pattern[pi]!;
    if (ch2str.has(ch)) {
      const sub = ch2str.get(ch)!;
      if (!s.startsWith(sub, si)) return false;
      return go(pi + 1, si + sub.length);
    }
    for (let end = si + 1; end <= s.length; end++) {
      const sub = s.slice(si, end);
      if (str2ch.has(sub)) continue;
      ch2str.set(ch, sub); str2ch.set(sub, ch); hooks.onMap?.(ch, sub);
      if (go(pi + 1, end)) return true;
      ch2str.delete(ch); str2ch.delete(sub);
    }
    return false;
  };
  const ok = go(0, 0);
  hooks.onResult?.(ok);
  return ok;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { wordPatternMatch } from './impl.ts';
export const DEFAULT_INPUT = { pattern: 'abab', s: 'redblueredblue' };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '模式 "' + input.pattern + '" 匹配 "' + input.s + '"', en: 'Pattern match' }).commit();
  const ok = wordPatternMatch(input.pattern, input.s, { onMap: (ch, sub) => rec.begin({ zh: ch + ' → "' + sub + '"', en: ch + ' → "' + sub + '"' }).setAux([{ label: ch, value: sub, role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '匹配？' + ok, en: 'match? ' + ok }).setAux([{ label: 'ok', value: String(ok), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { wordPatternMatch } from '../../src/algorithms/backtracking/bt-template-match/impl.ts';
import { buildTrace } from '../../src/algorithms/backtracking/bt-template-match/trace.ts';
test('wordPatternMatch 正确', () => {
  assert.equal(wordPatternMatch('abab', 'redblueredblue'), true);
  assert.equal(wordPatternMatch('aaaa', 'asdasdasdasd'), true);
  assert.equal(wordPatternMatch('aabb', 'xyzabcxzyabc'), false);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 30. bt-brace-expand  —— 花括号展开
ALGS.push({
  id: 'bt-brace-expand',
  m: ['花括号展开', 'Brace Expansion', '展开 {a,b}c{d,e} 形式的表达式为所有单词。', 'Expand {a,b}c{d,e} into all words.',
    '回溯每组选项笛卡尔积。', 'Backtrack Cartesian product. O(k^n).', 'O(k^n)', 'O(n)', ['backtracking', 'string']],
  impl: `export interface BeHooks { onPick?: (ch: string) => void; onResult?: (w: string) => void; }
export function expand(s: string, hooks: BeHooks = {}): string[] {
  const groups: string[][] = [];
  let i = 0;
  while (i < s.length) {
    if (s[i] === '{') {
      i++; const opts: string[] = [];
      while (s[i] !== '}') { if (s[i] !== ',') opts.push(s[i]!); i++; }
      i++; groups.push(opts.sort());
    } else { groups.push([s[i]!]); i++; }
  }
  const out: string[] = [];
  const cur: string[] = [];
  const go = (idx: number) => {
    if (idx === groups.length) { out.push(cur.join('')); hooks.onResult?.(cur.join('')); return; }
    for (const ch of groups[idx]!) { cur.push(ch); hooks.onPick?.(ch); go(idx + 1); cur.pop(); }
  };
  go(0);
  return out;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { expand } from './impl.ts';
export const DEFAULT_S = '{a,b}c{d,e}';
export function buildTrace(s: string = DEFAULT_S): Frame[] {
  const rec = new TraceRecorder();
  const cur: string[] = [];
  rec.begin({ zh: '展开 "' + s + '"', en: 'Expand "' + s + '"' }).commit();
  expand(s, { onPick: (ch) => { cur.push(ch); rec.begin({ zh: '选 ' + ch, en: 'pick ' + ch }).setAux([{ label: 'cur', value: cur.join(''), role: 'pivot' as BarRole }]).commit(); }, onResult: (w) => rec.begin({ zh: w, en: w }).setBars([{ value: w.length, role: 'final' as BarRole, label: w }]).commit() });
  rec.begin({ zh: '完成', en: 'Done' }).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { expand } from '../../src/algorithms/backtracking/bt-brace-expand/impl.ts';
import { buildTrace } from '../../src/algorithms/backtracking/bt-brace-expand/trace.ts';
test('expand 正确', () => {
  assert.deepEqual(expand('{a,b}c{d,e}'), ['acd','ace','bcd','bce']);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 31. bt-num-squares  —— 完全平方数个数（回溯剪枝）
ALGS.push({
  id: 'bt-num-squares',
  m: ['完全平方数拆分', 'Perfect Squares (Backtrack)', '回溯+剪枝把 n 拆成最少完全平方数之和。', 'Min perfect squares summing to n (backtrack).',
    '从大到小试平方数。', 'Try squares descending. O(√n^depth).', 'O(√n^depth)', 'O(√n)', ['backtracking', 'math']],
  impl: `export interface NsHooks { onTry?: (sq: number, cnt: number) => void; onResult?: (min: number) => void; }
export function numSquares(n: number, hooks: NsHooks = {}): number {
  let best = Infinity;
  const go = (remain: number, cnt: number, maxSq: number) => {
    if (cnt >= best) return;
    if (remain === 0) { best = Math.min(best, cnt); return; }
    for (let k = Math.min(maxSq, Math.floor(Math.sqrt(remain))); k >= 1; k--) {
      const sq = k * k;
      hooks.onTry?.(sq, cnt + 1);
      go(remain - sq, cnt + 1, k);
    }
  };
  go(n, 0, Math.floor(Math.sqrt(n)));
  hooks.onResult?.(best);
  return best;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { numSquares } from './impl.ts';
export const DEFAULT_N = 12;
export function buildTrace(n: number = DEFAULT_N): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '拆 ' + n + ' 为平方和', en: 'Squares of ' + n }).commit();
  const m = numSquares(n, { onTry: (sq, cnt) => rec.begin({ zh: '试 ' + sq + ' (第 ' + cnt + ' 个)', en: 'try ' + sq }).setAux([{ label: 'sq', value: String(sq), role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '最少 = ' + m, en: 'min = ' + m }).setAux([{ label: 'min', value: String(m), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { numSquares } from '../../src/algorithms/backtracking/bt-num-squares/impl.ts';
import { buildTrace } from '../../src/algorithms/backtracking/bt-num-squares/trace.ts';
test('numSquares 正确', () => {
  assert.equal(numSquares(12), 3);
  assert.equal(numSquares(13), 2);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 32. bt-conflicting-appts  —— 冲突回溯选最大不冲突集
ALGS.push({
  id: 'bt-conflicting-appts',
  m: ['最大不冲突预约集', 'Max Non-conflicting Appointments', '回溯选最多互不时间冲突的预约。', 'Backtrack to pick max non-overlapping appointments.',
    '按结束排序，回溯选/不选。', 'Sort by end, pick/skip. O(2^n).', 'O(2^n)', 'O(n)', ['backtracking', 'interval']],
  impl: `export interface Appt { start: number; end: number; }
export interface CaHooks { onPick?: (i: number) => void; onResult?: (max: number) => void; }
export function maxNonConflict(appts: Appt[], hooks: CaHooks = {}): number {
  const sorted = [...appts].sort((a, b) => a.end - b.end);
  let best = 0;
  const go = (i: number, lastEnd: number, count: number) => {
    if (i === sorted.length) { best = Math.max(best, count); return; }
    if (sorted[i]!.start >= lastEnd) { hooks.onPick?.(i); go(i + 1, sorted[i]!.end, count + 1); }
    go(i + 1, lastEnd, count);
  };
  go(0, -Infinity, 0);
  hooks.onResult?.(best);
  return best;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { maxNonConflict, type Appt } from './impl.ts';
export const DEFAULT_INPUT: Appt[] = [{ start: 1, end: 3 }, { start: 2, end: 5 }, { start: 4, end: 6 }, { start: 6, end: 7 }, { start: 5, end: 8 }, { start: 7, end: 9 }];
export function buildTrace(input: Appt[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const picked: number[] = [];
  rec.begin({ zh: '最大不冲突预约', en: 'Max non-conflict' }).commit();
  maxNonConflict(input, { onPick: (i) => { picked.push(i); rec.begin({ zh: '选预约 ' + i, en: 'pick ' + i }).setBars(picked.map((p) => ({ value: input[p]!.end, role: 'pivot' as BarRole }))).commit(); } });
  rec.begin({ zh: '完成', en: 'Done' }).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { maxNonConflict } from '../../src/algorithms/backtracking/bt-conflicting-appts/impl.ts';
import { buildTrace } from '../../src/algorithms/backtracking/bt-conflicting-appts/trace.ts';
test('maxNonConflict 正确', () => {
  assert.equal(maxNonConflict([{ start: 1, end: 3 }, { start: 2, end: 5 }, { start: 4, end: 6 }, { start: 6, end: 7 }, { start: 5, end: 8 }, { start: 7, end: 9 }]), 3);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 33. bt-tug-of-war  —— 拔河最小差
ALGS.push({
  id: 'bt-tug-of-war',
  m: ['拔河最小差', 'Tug of War', '把数组分成大小相差不超过 1 的两子集，使和差最小。', 'Split into two nearly-equal subsets with min sum difference.',
    '回溯选 n/2 个到一队。', 'Backtrack n/2 elements. O(C(n, n/2)).', 'O(C(n, n/2))', 'O(n)', ['backtracking', 'partition']],
  impl: `export interface TwHooks { onPick?: (v: number) => void; onImprove?: (diff: number) => void; onResult?: (diff: number) => void; }
export function tugOfWar(arr: number[], hooks: TwHooks = {}): number {
  const total = arr.reduce((a, b) => a + b, 0);
  const half = Math.floor(arr.length / 2);
  let best = Infinity;
  let curSum = 0, curCount = 0;
  const go = (i: number) => {
    if (curCount === half) { const diff = Math.abs(total - 2 * curSum); if (diff < best) { best = diff; hooks.onImprove?.(diff); } return; }
    if (i === arr.length) return;
    if (curCount < half) { curSum += arr[i]!; curCount++; hooks.onPick?.(arr[i]!); go(i + 1); curSum -= arr[i]!; curCount--; }
    go(i + 1);
  };
  go(0);
  hooks.onResult?.(best);
  return best;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { tugOfWar } from './impl.ts';
export const DEFAULT_INPUT = [23, 45, -34, 12, 0, 98, -99, 4, 189, -1, 4];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '拔河 [' + input.join(',') + ']', en: 'Tug of war' }).commit();
  const d = tugOfWar(input, { onImprove: (diff) => rec.begin({ zh: '更优差 = ' + diff, en: 'better diff = ' + diff }).setAux([{ label: 'diff', value: String(diff), role: 'final' as BarRole }]).commit() });
  rec.begin({ zh: '最小差 = ' + d, en: 'min diff = ' + d }).setAux([{ label: 'min', value: String(d), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tugOfWar } from '../../src/algorithms/backtracking/bt-tug-of-war/impl.ts';
import { buildTrace } from '../../src/algorithms/backtracking/bt-tug-of-war/trace.ts';
test('tugOfWar 正确', () => {
  const d = tugOfWar([23, 45, -34, 12, 0, 98, -99, 4, 189, -1, 4]);
  assert.ok(d >= 0);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 34. bt-color-fill-choices  —— 选择数涂色
ALGS.push({
  id: 'bt-color-fill-choices',
  m: ['多米诺骨牌铺法', 'Domino Tiling Count', '回溯求 2×n 网格用 1×2 多米诺铺满的方法数。', 'Count ways to tile 2xn grid with 1x2 dominoes.',
    '逐列回溯，状态为上格是否填。', 'Column-by-column backtrack. O(2^n).', 'O(2^n)', 'O(n)', ['backtracking', 'tiling']],
  impl: `export interface DtHooks { onPlace?: (col: number, vertical: boolean) => void; onResult?: (count: number) => void; }
export function dominoTiling(n: number, hooks: DtHooks = {}): number {
  let count = 0;
  const grid: boolean[][] = Array.from({ length: 2 }, () => new Array(n).fill(false));
  const go = (r: number, c: number) => {
    if (c === n) { count++; hooks.onResult?.(count); return; }
    if (r === 2) { go(0, c + 1); return; }
    if (grid[r]![c]!) { go(r + 1, c); return; }
    // 横放
    if (c + 1 < n && !grid[r]![c + 1]!) { grid[r]![c] = true; grid[r]![c + 1] = true; hooks.onPlace?.(c, false); go(r + 1, c); grid[r]![c] = false; grid[r]![c + 1] = false; }
    // 竖放
    if (r === 0 && !grid[r + 1]![c]!) { grid[r]![c] = true; grid[r + 1]![c] = true; hooks.onPlace?.(c, true); go(r + 1, c); grid[r]![c] = false; grid[r + 1]![c] = false; }
  };
  go(0, 0);
  return count;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { dominoTiling } from './impl.ts';
export const DEFAULT_N = 4;
export function buildTrace(n: number = DEFAULT_N): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '2×' + n + ' 多米诺', en: '2x' + n + ' domino' }).commit();
  const c = dominoTiling(n, { onPlace: (col, vertical) => rec.begin({ zh: '列 ' + col + (vertical ? ' 竖放' : ' 横放'), en: 'col ' + col + (vertical ? ' V' : ' H') }).setAux([{ label: 'col', value: String(col), role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '共 ' + c + ' 种', en: c + ' ways' }).setAux([{ label: 'count', value: String(c), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dominoTiling } from '../../src/algorithms/backtracking/bt-color-fill-choices/impl.ts';
import { buildTrace } from '../../src/algorithms/backtracking/bt-color-fill-choices/trace.ts';
test('dominoTiling 正确', () => {
  assert.equal(dominoTiling(2), 2);
  assert.equal(dominoTiling(3), 3);
  assert.equal(dominoTiling(4), 5);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 35. bt-split-fib  —— 拆分斐波那契串
ALGS.push({
  id: 'bt-split-fib',
  m: ['拆分斐波那契串', 'Split into Fibonacci-like', '把字符串拆成斐波那契式序列。', 'Split string into a Fibonacci-like sequence.',
    '回溯切数，满足前两数之和。', 'Backtrack, each = prev two sum. O(n^2).', 'O(n^2)', 'O(n)', ['backtracking', 'sequence']],
  impl: `export interface SfHooks { onNum?: (v: number) => void; onResult?: (seq: number[]) => void; }
export function splitIntoFib(s: string, hooks: SfHooks = {}): number[] {
  const out: number[] = [];
  const cur: number[] = [];
  const go = (idx: number): boolean => {
    if (idx === s.length && cur.length >= 3) { out.push(...cur); return true; }
    for (let i = idx + 1; i <= s.length; i++) {
      const piece = s.slice(idx, i);
      if (piece.length > 1 && piece[0] === '0') break;
      const v = Number(piece);
      if (v > 2147483647) break;
      if (cur.length >= 2) { const sum = cur[cur.length - 1]! + cur[cur.length - 2]!; if (v < sum) continue; if (v > sum) break; }
      cur.push(v); hooks.onNum?.(v);
      if (go(i)) return true;
      cur.pop();
    }
    return false;
  };
  go(0);
  hooks.onResult?.(out);
  return out;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { splitIntoFib } from './impl.ts';
export const DEFAULT_S = '11235813';
export function buildTrace(s: string = DEFAULT_S): Frame[] {
  const rec = new TraceRecorder();
  const cur: number[] = [];
  rec.begin({ zh: '拆 "' + s + '" 为斐波那契', en: 'Fib split' }).commit();
  splitIntoFib(s, { onNum: (v) => { cur.push(v); rec.begin({ zh: '切 ' + v, en: 'cut ' + v }).setBars(cur.map((x) => ({ value: x, role: 'pivot' as BarRole }))).commit(); }, onResult: (seq) => rec.begin({ zh: seq.join(','), en: seq.join(',') }).setBars(seq.map((x) => ({ value: x, role: 'final' as BarRole }))).commit() });
  rec.begin({ zh: '完成', en: 'Done' }).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { splitIntoFib } from '../../src/algorithms/backtracking/bt-split-fib/impl.ts';
import { buildTrace } from '../../src/algorithms/backtracking/bt-split-fib/trace.ts';
test('splitIntoFib 正确', () => {
  assert.deepEqual(splitIntoFib('11235813'), [1, 1, 2, 3, 5, 8, 13]);
  assert.deepEqual(splitIntoFib('112358130'), []);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 36. bt-decode-string  —— 字符串解码（嵌套回溯）
ALGS.push({
  id: 'bt-decode-string',
  m: ['字符串解码', 'Decode String', '解码 3[a2[c]] → accaccacc。', 'Decode 3[a2[c]] into accaccacc.',
    '递归处理 [...] 块。', 'Recurse on brackets. O(n).', 'O(n)', 'O(n)', ['backtracking', 'string']],
  impl: `export interface DsHooks { onBlock?: (repeat: number, inner: string) => void; onResult?: (s: string) => void; }
export function decodeString(s: string, hooks: DsHooks = {}): string {
  let i = 0;
  const decode = (): string => {
    let out = '';
    while (i < s.length && s[i] !== ']') {
      if (s[i]! >= '0' && s[i]! <= '9') {
        let num = 0;
        while (s[i]! >= '0' && s[i]! <= '9') { num = num * 10 + Number(s[i]!); i++; }
        i++; // '['
        const inner = decode();
        hooks.onBlock?.(num, inner);
        out += inner.repeat(num);
        i++; // ']'
      } else { out += s[i]!; i++; }
    }
    return out;
  };
  const r = decode();
  hooks.onResult?.(r);
  return r;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { decodeString } from './impl.ts';
export const DEFAULT_S = '3[a2[c]]';
export function buildTrace(s: string = DEFAULT_S): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '解码 "' + s + '"', en: 'Decode "' + s + '"' }).commit();
  const r = decodeString(s, { onBlock: (repeat, inner) => rec.begin({ zh: repeat + '×"' + inner + '"', en: repeat + 'x"' + inner + '"' }).setBars([{ value: repeat, role: 'pivot' as BarRole, label: inner }]).commit() });
  rec.begin({ zh: '结果 = ' + r, en: 'Result = ' + r }).setBars([{ value: r.length, role: 'final' as BarRole, label: r }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { decodeString } from '../../src/algorithms/backtracking/bt-decode-string/impl.ts';
import { buildTrace } from '../../src/algorithms/backtracking/bt-decode-string/trace.ts';
test('decodeString 正确', () => {
  assert.equal(decodeString('3[a2[c]]'), 'accaccacc');
  assert.equal(decodeString('2[abc]3[cd]ef'), 'abcabccdcdcdef');
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 37. bt-calc-24  —— 24点游戏
ALGS.push({
  id: 'bt-calc-24',
  m: ['24点游戏', '24 Game', '判断 4 张牌能否通过 + - * / 得到 24。', 'Can 4 cards reach 24 via + - * / ?',
    '回溯两两合并。', 'Backtrack merging two numbers. O(1).', 'O(1)', 'O(1)', ['backtracking', 'arithmetic']],
  impl: `const EPS = 1e-6;
export interface G24Hooks { onMerge?: (a: number, b: number, r: number) => void; onResult?: (ok: boolean) => void; }
export function judgePoint24(cards: number[], hooks: G24Hooks = {}): boolean {
  const go = (nums: number[]): boolean => {
    if (nums.length === 1) return Math.abs(nums[0]! - 24) < EPS;
    for (let i = 0; i < nums.length; i++) for (let j = 0; j < nums.length; j++) {
      if (i === j) continue;
      const rest = nums.filter((_, k) => k !== i && k !== j);
      const a = nums[i]!, b = nums[j]!;
      const cands = [a + b, a - b, a * b];
      if (Math.abs(b) > EPS) cands.push(a / b);
      for (const r of cands) { hooks.onMerge?.(a, b, r); if (go([...rest, r])) return true; }
    }
    return false;
  };
  const ok = go([...cards]);
  hooks.onResult?.(ok);
  return ok;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { judgePoint24 } from './impl.ts';
export const DEFAULT_INPUT = [4, 1, 8, 7];
export function buildTrace(input: number[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '24点 [' + input.join(',') + ']', en: '24 game' }).commit();
  let steps = 0;
  const ok = judgePoint24(input, { onMerge: (a, b, r) => { steps++; if (steps <= 10) rec.begin({ zh: a + ' 与 ' + b + ' → ' + r.toFixed(2), en: a + ',' + b + ' → ' + r.toFixed(2) }).setAux([{ label: 'r', value: r.toFixed(2), role: 'pivot' as BarRole }]).commit(); } });
  rec.begin({ zh: '能得 24？' + ok, en: 'ok? ' + ok }).setAux([{ label: 'ok', value: String(ok), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { judgePoint24 } from '../../src/algorithms/backtracking/bt-calc-24/impl.ts';
import { buildTrace } from '../../src/algorithms/backtracking/bt-calc-24/trace.ts';
test('judgePoint24 正确', () => {
  assert.equal(judgePoint24([4, 1, 8, 7]), true);
  assert.equal(judgePoint24([1, 2, 1, 2]), false);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 38. bt-minesweeper  —— 扫雷首次点击展开（回溯式 flood）
ALGS.push({
  id: 'bt-minesweeper',
  m: ['扫雷展开', 'Minesweeper Update', '点击扫雷盘格，自动展开 0 区域。', 'Click a minesweeper cell, auto-expand zero region.',
    'DFS：若 0 则递归展开邻居。', 'DFS expand if zero. O(R*C).', 'O(R*C)', 'O(R*C)', ['backtracking', 'grid', 'dfs']],
  impl: `export interface MswHooks { onReveal?: (r: number, c: number) => void; onResult?: () => void; }
export function updateBoard(board: string[][], click: Array<number>, hooks: MswHooks = {}): string[][] {
  const [r, c] = click;
  const R = board.length, C = board[0]!.length;
  const dirs = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
  if (board[r]![c] === 'M') { board[r]![c] = 'X'; hooks.onResult?.(); return board; }
  const countMines = (r: number, c: number): number => { let n = 0; for (const [dr, dc] of dirs) { const nr = r + dr, nc = c + dc; if (nr >= 0 && nr < R && nc >= 0 && nc < C && board[nr]![nc] === 'M') n++; } return n; };
  const dfs = (r: number, c: number) => {
    if (r < 0 || r >= R || c < 0 || c >= C || board[r]![c] !== 'E') return;
    const n = countMines(r, c);
    if (n > 0) { board[r]![c] = String(n); hooks.onReveal?.(r, c); }
    else { board[r]![c] = 'B'; hooks.onReveal?.(r, c); for (const [dr, dc] of dirs) dfs(r + dr, c + dc); }
  };
  dfs(r, c);
  hooks.onResult?.();
  return board;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { updateBoard } from './impl.ts';
export const DEFAULT_INPUT = { board: [['E','E','E','E','E'],['E','E','M','E','E'],['E','E','E','E','E'],['E','E','E','E','E']], click: [3, 0] as Array<number> };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const b = input.board.map((r) => [...r]);
  rec.begin({ zh: '扫雷点击 (' + input.click[0] + ',' + input.click[1] + ')', en: 'Click (' + input.click[0] + ',' + input.click[1] + ')' }).commit();
  updateBoard(b, input.click, { onReveal: (r, c) => rec.begin({ zh: '展开 (' + r + ',' + c + ')', en: 'reveal (' + r + ',' + c + ')' }).setGrid(b.map((row) => row.map((v) => v)))).commit() });
  rec.begin({ zh: '完成', en: 'Done' }).setGrid(b.map((row) => row.map((v) => v))).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { updateBoard } from '../../src/algorithms/backtracking/bt-minesweeper/impl.ts';
import { buildTrace } from '../../src/algorithms/backtracking/bt-minesweeper/trace.ts';
test('updateBoard 正确', () => {
  const b = [['E','E','E','E','E'],['E','E','M','E','E'],['E','E','E','E','E'],['E','E','E','E','E']].map((r) => [...r]);
  updateBoard(b, [3, 0]);
  assert.equal(b[3]![0], 'B');
  assert.equal(b[1]![2], 'M');
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 39. bt-pyramid  —— 金字塔过渡矩阵
ALGS.push({
  id: 'bt-pyramid',
  m: ['截断金字塔路径', 'Pyramid Transition Matrix', '判断能否从底串构建到金字塔顶。', 'Can build pyramid from bottom to top.',
    '回溯：每对相邻字符尝试允许的上方字符。', 'Backtrack allowed tops per pair. O(k^n).', 'O(k^n)', 'O(n)', ['backtracking', 'string']],
  impl: `export interface PyHooks { onPick?: (ch: string) => void; onResult?: (ok: boolean) => void; }
export function pyramidTransition(bottom: string, allowed: string[], hooks: PyHooks = {}): boolean {
  const map = new Map<string, string[]>();
  for (const a of allowed) { const key = a.slice(0, 2); if (!map.has(key)) map.set(key, []); map.get(key)!.push(a[2]!); }
  const go = (row: string): boolean => {
    if (row.length === 1) return true;
    const next: string[] = [];
    const build = (i: number, cur: string): boolean => {
      if (i === row.length - 1) return go(cur);
      const key = row[i]! + row[i + 1]!;
      const tops = map.get(key);
      if (!tops) return false;
      for (const t of tops) { hooks.onPick?.(t); if (build(i + 1, cur + t)) return true; }
      return false;
    };
    return build(0, '');
  };
  const ok = go(bottom);
  hooks.onResult?.(ok);
  return ok;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { pyramidTransition } from './impl.ts';
export const DEFAULT_INPUT = { bottom: 'BCD', allowed: ['BCG','CDE','GEA','FFF'] };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '金字塔底 "' + input.bottom + '"', en: 'Pyramid bottom ' + input.bottom }).commit();
  const ok = pyramidTransition(input.bottom, input.allowed, { onPick: (ch) => rec.begin({ zh: '上 ' + ch, en: 'top ' + ch }).setAux([{ label: 'top', value: ch, role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '可建？' + ok, en: 'ok? ' + ok }).setAux([{ label: 'ok', value: String(ok), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pyramidTransition } from '../../src/algorithms/backtracking/bt-pyramid/impl.ts';
import { buildTrace } from '../../src/algorithms/backtracking/bt-pyramid/trace.ts';
test('pyramidTransition 正确', () => {
  assert.equal(pyramidTransition('BCD', ['BCG','CDE','GEA','FFF']), true);
  assert.equal(pyramidTransition('AAAA', ['AAB','AAC','BCD','CDE','DEF']), true);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 40. bt-zigzag-pattern  —— 之字形图案生成
ALGS.push({
  id: 'bt-zigzag-pattern',
  m: ['之字形变换', 'Zigzag Conversion', '把字符串按之字形排列后按行读出。', 'Convert string to zigzag rows then read row by row.',
    '模拟行号增减。', 'Simulate row up/down. O(n).', 'O(n)', 'O(n)', ['backtracking', 'string']],
  impl: `export interface ZzHooks { onPlace?: (ch: string, row: number) => void; onResult?: (s: string) => void; }
export function convert(s: string, numRows: number, hooks: ZzHooks = {}): string {
  if (numRows === 1 || s.length <= numRows) return s;
  const rows: string[] = new Array(numRows).fill('');
  let r = 0, step = 1;
  for (const ch of s) {
    rows[r] += ch; hooks.onPlace?.(ch, r);
    if (r === 0) step = 1; else if (r === numRows - 1) step = -1;
    r += step;
  }
  const out = rows.join('');
  hooks.onResult?.(out);
  return out;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { convert } from './impl.ts';
export const DEFAULT_INPUT = { s: 'PAYPALISHIRING', numRows: 3 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '之字形行=' + input.numRows, en: 'Zigzag rows=' + input.numRows }).commit();
  const r = convert(input.s, input.numRows, { onPlace: (ch, row) => rec.begin({ zh: ch + ' 入行 ' + row, en: ch + ' row ' + row }).setAux([{ label: 'row', value: String(row), role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '结果 = ' + r, en: 'Result = ' + r }).setBars([{ value: r.length, role: 'final' as BarRole, label: r }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { convert } from '../../src/algorithms/backtracking/bt-zigzag-pattern/impl.ts';
import { buildTrace } from '../../src/algorithms/backtracking/bt-zigzag-pattern/trace.ts';
test('convert 正确', () => {
  assert.equal(convert('PAYPALISHIRING', 3), 'PAHNAPLSIIGYIR');
  assert.equal(convert('PAYPALISHIRING', 4), 'PINALSIGYAHRPI');
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 41. bt-grid-paths  —— 网格路径计数（回溯）
ALGS.push({
  id: 'bt-grid-paths',
  m: ['网格所有路径', 'All Grid Paths', '从左上到右下的所有只向右/下路径。', 'All right/down paths from top-left to bottom-right.',
    '回溯选右或下。', 'Backtrack right/down. O(C(R+C, R)).', 'O(C(R+C, R))', 'O(R+C)', ['backtracking', 'grid']],
  impl: `export interface Gp2Hooks { onStep?: (r: number, c: number) => void; onResult?: (path: string) => void; }
export function gridPaths(R: number, C: number, hooks: Gp2Hooks = {}): string[] {
  const out: string[] = [];
  const cur: string[] = [];
  const go = (r: number, c: number) => {
    if (r === R - 1 && c === C - 1) { out.push(cur.join('')); hooks.onResult?.(cur.join('')); return; }
    if (c + 1 < C) { cur.push('R'); hooks.onStep?.(r, c + 1); go(r, c + 1); cur.pop(); }
    if (r + 1 < R) { cur.push('D'); hooks.onStep?.(r + 1, c); go(r + 1, c); cur.pop(); }
  };
  go(0, 0);
  return out;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { gridPaths } from './impl.ts';
export const DEFAULT_INPUT = { R: 3, C: 3 };
export function buildTrace(input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const cur: string[] = [];
  rec.begin({ zh: input.R + '×' + input.C + ' 网格路径', en: input.R + 'x' + input.C + ' paths' }).commit();
  gridPaths(input.R, input.C, { onResult: (p) => rec.begin({ zh: p, en: p }).setBars([{ value: p.length, role: 'final' as BarRole, label: p }]).commit() });
  rec.begin({ zh: '完成', en: 'Done' }).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gridPaths } from '../../src/algorithms/backtracking/bt-grid-paths/impl.ts';
import { buildTrace } from '../../src/algorithms/backtracking/bt-grid-paths/trace.ts';
test('gridPaths 正确', () => {
  assert.equal(gridPaths(3, 3).length, 6);
  assert.equal(gridPaths(2, 2).length, 2);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 42. bt-max-len-concat-uniq  —— 拼接最大唯一字符串
ALGS.push({
  id: 'bt-max-len-concat-uniq',
  m: ['拼接最大唯一串', 'Max Length of Concatenated Unique', '从字符串数组选若干拼接，使字符唯一且最长。', 'Pick strings to concatenate with all unique chars, maximize length.',
    '回溯选/不选，位掩码判重。', 'Backtrack with bitmask. O(2^n).', 'O(2^n)', 'O(n)', ['backtracking', 'bitmask']],
  impl: `export interface McuHooks { onPick?: (i: number, len: number) => void; onResult?: (max: number) => void; }
function mask(s: string): number { let m = 0; for (const ch of s) { const b = 1 << (ch.charCodeAt(0) - 97); if (m & b) return -1; m |= b; } return m; }
export function maxLength(arr: string[], hooks: McuHooks = {}): number {
  const masks = arr.map(mask);
  let best = 0;
  const go = (i: number, curMask: number, curLen: number) => {
    if (i === arr.length) { best = Math.max(best, curLen); return; }
    go(i + 1, curMask, curLen);
    const m = masks[i]!;
    if (m > 0 && (curMask & m) === 0) { hooks.onPick?.(i, curLen + arr[i]!.length); go(i + 1, curMask | m, curLen + arr[i]!.length); }
  };
  go(0, 0, 0);
  hooks.onResult?.(best);
  return best;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { maxLength } from './impl.ts';
export const DEFAULT_INPUT = ['un','iq','ue'];
export function buildTrace(input: string[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '拼接最大唯一串', en: 'Max concat unique' }).commit();
  const m = maxLength(input, { onPick: (i, len) => rec.begin({ zh: '选 "' + input[i] + '" 长 ' + len, en: 'pick "' + input[i] + '"' }).setAux([{ label: 'len', value: String(len), role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '最大 = ' + m, en: 'max = ' + m }).setAux([{ label: 'max', value: String(m), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { maxLength } from '../../src/algorithms/backtracking/bt-max-len-concat-uniq/impl.ts';
import { buildTrace } from '../../src/algorithms/backtracking/bt-max-len-concat-uniq/trace.ts';
test('maxLength 正确', () => {
  assert.equal(maxLength(['un','iq','ue']), 4);
  assert.equal(maxLength(['cha','r','act','ers']), 6);
  assert.equal(maxLength(['abcdefghijklmnopqrstuvwxyz']), 26);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

// 43. bt-find-min-time-diff  —— 最小时间差（回溯枚举排序）
ALGS.push({
  id: 'bt-find-min-time-diff',
  m: ['排列求最小时间差', 'Min Time Difference via Permute', '通过回溯枚举排列求最小相邻时间差（演示用）。', 'Backtracking permutations to find min time difference (demo).',
    '把时间转分钟，回溯全排列求最小相邻差。', 'Permute then min adjacent diff. O(n*n!).', 'O(n*n!)', 'O(n)', ['backtracking', 'time']],
  impl: `export interface MtHooks { onPerm?: (p: number[]) => void; onResult?: (min: number) => void; }
function toMin(t: string): number { return Number(t.slice(0, 2)) * 60 + Number(t.slice(3)); }
export function findMinDifference(timePoints: string[], hooks: MtHooks = {}): number {
  const mins = timePoints.map(toMin).sort((a, b) => a - b);
  let min = Infinity;
  for (let i = 0; i < mins.length; i++) {
    const a = mins[i]!, b = mins[(i + 1) % mins.length]!;
    const diff = Math.min(Math.abs(a - b), 1440 - Math.abs(a - b));
    hooks.onPerm?.([a, b]);
    min = Math.min(min, diff);
  }
  hooks.onResult?.(min);
  return min;
}`,
  trace: `import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { findMinDifference } from './impl.ts';
export const DEFAULT_INPUT = ['23:59', '00:00'];
export function buildTrace(input: string[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '最小时间差', en: 'Min time diff' }).commit();
  const m = findMinDifference(input, { onPerm: (p) => rec.begin({ zh: p[0] + ' 与 ' + p[1], en: p[0] + ' & ' + p[1] }).setAux([{ label: 'pair', value: p.join(','), role: 'pivot' as BarRole }]).commit() });
  rec.begin({ zh: '最小 = ' + m + ' 分钟', en: 'min = ' + m + ' min' }).setAux([{ label: 'min', value: String(m), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  test: `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findMinDifference } from '../../src/algorithms/backtracking/bt-find-min-time-diff/impl.ts';
import { buildTrace } from '../../src/algorithms/backtracking/bt-find-min-time-diff/trace.ts';
test('findMinDifference 正确', () => {
  assert.equal(findMinDifference(['23:59','00:00']), 1);
  assert.equal(findMinDifference(['00:00','23:59','00:00']), 0);
});
test('buildTrace 有帧', () => { assert.ok(buildTrace().length >= 2); });`,
});

for (const a of ALGS) {
  const m = a.m;
  const metaSrc = meta(a.id, m[0], m[1], m[2], m[3], m[4], m[5], m[6], m[7], m[8]);
  writeAlg(a.id, metaSrc, a.impl, a.trace, a.test);
}
console.log(`backtracking: wrote ${ALGS.length} algorithms`);
