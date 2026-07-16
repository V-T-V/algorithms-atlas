// =============================================================================
// Rabin-Karp 二维匹配 · 录制帧序列
// 用 setGrid 展示文本网格（行=字符串），命中窗口用角色 'final' 高亮；
// setAux 展示模式与当前哈希/校验坐标。
// =============================================================================

import type { BarRole, Cell, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { rabinKarp2, type RabinKarp2Hooks } from './impl.ts';

export const DEFAULT_INPUT: { text: string[]; pat: string[] } = {
  text: ['ABCABC', 'BCABCA', 'ABCABC', 'BCABCA'],
  pat: ['AB', 'CA'],
};

/** 录制演示帧序列。 */
export function buildTrace(input: { text: string[]; pat: string[] } = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { text, pat } = input;
  const R = text.length;
  const C = R > 0 ? text[0]!.length : 0;
  const ph = pat.length;
  const pw = pat.length > 0 ? pat[0]!.length : 0;

  let curR = -1;
  let curC = -1;
  let roleTip: BarRole = 'default';
  let lastHashNote = '';
  const found: Array<[number, number]> = [];

  const aux = (): Array<{ label: string; value: string; role?: BarRole }> => [
    { label: 'text', value: `${R}x${C}`, role: 'default' },
    { label: 'pat', value: pat.join(' / '), role: 'default' },
    { label: 'r,c', value: curR < 0 ? '-' : `${curR},${curC}`, role: 'frontier' },
    { label: 'hash', value: lastHashNote || '-' },
  ];

  const render = (note: { zh: string; en: string }): void => {
    const rows: Array<Array<string | number | undefined>> = [];
    const roles: Record<string, BarRole> = {};
    for (let r = 0; r < R; r++) {
      const line = text[r]!;
      const row: Array<string | number | undefined> = [];
      for (let c = 0; c < C; c++) row.push(line[c]);
      rows.push(row);
    }
    // 高亮当前校验/命中窗口
    if (curR >= 0 && curC >= 0) {
      for (let i = 0; i < ph; i++) {
        for (let j = 0; j < pw; j++) {
          roles[`${curR + i},${curC + j}`] = roleTip;
        }
      }
    }
    // 命中窗口固定高亮 final（叠加）
    for (const [fr, fc] of found) {
      for (let i = 0; i < ph; i++) {
        for (let j = 0; j < pw; j++) roles[`${fr + i},${fc + j}`] = 'final';
      }
    }
    const grid: Cell[][] = rec.gridFrom(rows, roles);
    rec.begin(note).setGrid(grid).setAux(aux()).commit();
    roleTip = 'default';
    lastHashNote = '';
  };

  render({
    zh: `在 ${R}x${C} 文本中查找 ${ph}x${pw} 模式`,
    en: `Find ${ph}x${pw} pattern in ${R}x${C} text`,
  });

  const hooks: RabinKarp2Hooks = {
    onHash: (label, row, hash) => {
      lastHashNote = `${label}[${row}]=${hash}`;
      curR = row >= 0 ? row : curR;
    },
    onVerify: (r, c) => {
      curR = r;
      curC = c;
      roleTip = 'compare';
      render({ zh: `指纹匹配，校验 (${r},${c})`, en: `Fingerprint match, verify (${r},${c})` });
    },
    onFound: (r, c) => {
      found.push([r, c]);
      curR = r;
      curC = c;
      roleTip = 'final';
      render({ zh: `命中！左上角 (${r},${c})`, en: `Found! top-left (${r},${c})` });
    },
  };

  rabinKarp2(text, pat, hooks);

  // 终态：仅高亮所有命中
  curR = -1;
  curC = -1;
  render({
    zh: `完成：${found.length} 处命中 [${found.map(([r, c]) => `(${r},${c})`).join(', ')}]`,
    en: `Done: ${found.length} hits [${found.map(([r, c]) => `(${r},${c})`).join(', ')}]`,
  });

  return rec.build();
}
