// =============================================================================
// 单词搜索 II · 录制帧序列
// 可视化：setGrid 渲染棋盘，DFS 路径标 pivot，命中标 final，剪枝标 warn。
// =============================================================================

import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { wordSearch2, type WordSearch2Hooks } from './impl.ts';

export interface Ws2Input {
  board: string[][];
  words: string[];
}
export const DEFAULT_INPUT: Ws2Input = {
  board: [
    ['o', 'a', 'a', 'n'],
    ['e', 't', 'a', 'e'],
    ['i', 'h', 'k', 'r'],
    ['i', 'f', 'l', 'v'],
  ],
  words: ['oath', 'pea', 'eat', 'rain'],
};

function renderBoard(
  board: string[][],
  path: Array<readonly [number, number]>,
  marks: Record<string, BarRole>,
): Cell[][] {
  const pathSet = new Map<string, BarRole>();
  for (const [r, c] of path) pathSet.set(`${r},${c}`, 'pivot');
  return board.map((row, r) =>
    row.map((ch, c) => ({
      v: ch,
      role: marks[`${r},${c}`] ?? pathSet.get(`${r},${c}`) ?? 'default',
    })),
  );
}

/** 录制演示帧序列。 */
export function buildTrace(input: Ws2Input = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { board, words } = input;
  const path: Array<readonly [number, number]> = [];
  const marks: Record<string, BarRole> = {};
  const found: string[] = [];

  rec
    .begin({
      zh: `在 ${board.length}×${board[0]!.length} 网格上搜索单词：[${words.join(', ')}]`,
      en: `Search words [${words.join(', ')}] on grid`,
    })
    .setGrid(renderBoard(board, path, marks))
    .setAux([{ label: '词典', value: words.join(', '), role: 'default' }])
    .commit();

  const hooks: WordSearch2Hooks = {
    onVisit: (r, c, p) => {
      path.push([r, c]);
      rec
        .begin({ zh: `访问 (${r},${c})，路径 "${p}"`, en: `Visit (${r},${c}), path "${p}"` })
        .setGrid(renderBoard(board, path, marks))
        .setAux([
          { label: '当前路径', value: p, role: 'pivot' },
          { label: '已找到', value: found.join(', ') || '∅', role: 'final' },
        ])
        .commit();
    },
    onPrune: (r, c, ch) => {
      marks[`${r},${c}`] = 'warn';
      rec
        .begin({
          zh: `剪枝：(${r},${c})='${ch}' 不是任何前缀`,
          en: `Prune: (${r},${c})='${ch}' is no prefix`,
        })
        .setGrid(renderBoard(board, path, marks))
        .commit();
      delete marks[`${r},${c}`];
    },
    onBacktrack: (r, c) => {
      // 弹出 path 末尾
      const idx = path.findIndex(([pr, pc]) => pr === r && pc === c);
      if (idx >= 0) path.splice(idx, 1);
    },
    onFound: (word) => {
      found.push(word);
      // 命中：把当前路径全标 final
      for (const [r, c] of path) marks[`${r},${c}`] = 'final';
      rec
        .begin({ zh: `命中单词：${word}`, en: `Found word: ${word}` })
        .setGrid(renderBoard(board, path, marks))
        .setAux([{ label: '已找到', value: found.join(', '), role: 'final' }])
        .commit();
      // 清理 final 标记以便继续搜索
      for (const [r, c] of path) delete marks[`${r},${c}`];
    },
  };

  const result = wordSearch2(board, words, hooks);

  rec
    .begin({
      zh: `完成：找到 ${result.length} 个单词：[${result.join(', ')}]`,
      en: `Done: found ${result.length} words: [${result.join(', ')}]`,
    })
    .setGrid(renderBoard(board, [], marks))
    .setAux([
      { label: '命中单词', value: result.join(', ') || '∅', role: 'final' },
      { label: '个数', value: String(result.length), role: 'final' },
    ])
    .commit();

  return rec.build();
}
