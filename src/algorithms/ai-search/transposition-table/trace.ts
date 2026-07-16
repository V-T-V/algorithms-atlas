// =============================================================================
// 置换表 · 录制帧序列
// 用 setMap 展示置换表内容（hash -> entry），用 setAux 展示统计与当前 hash。
// 演示：在 3x3 棋盘上写若干局面，并查询。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { TranspositionTable, Zobrist, type EntryFlag, type TtEntry } from './impl.ts';

export const DEFAULT_SEED: number = 12345;
export const DEFAULT_CELL_COUNT: number = 9;
export const DEFAULT_PIECE_KINDS: number = 2;

export function buildTrace(
  cellCount: number = DEFAULT_CELL_COUNT,
  pieceKinds: number = DEFAULT_PIECE_KINDS,
  seed: number = DEFAULT_SEED,
): Frame[] {
  const rec = new TraceRecorder();
  const zob = new Zobrist(cellCount, pieceKinds, seed);
  const tt = new TranspositionTable();

  rec
    .begin({
      zh: `初始化 Zobrist 键（${cellCount} 格 × ${pieceKinds} 种棋子）与空置换表`,
      en: `Init Zobrist keys (${cellCount} cells × ${pieceKinds} pieces) and empty transposition table`,
    })
    .setMap([])
    .setAux([{ label: '表大小', value: '0', role: 'pivot' }])
    .commit();

  // 构造若干不同局面并写入表
  const boards: number[][] = [
    [1, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 2, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 2],
  ];
  const flags: EntryFlag[] = ['EXACT', 'LOWER_BOUND', 'UPPER_BOUND'];
  const scores = [5, -3, 7];

  const renderTable = (note: { zh: string; en: string }, curHash?: bigint): void => {
    const entries: Array<{ key: string; value: string; role?: BarRole }> = [];
    // 从 tt.stats 推不出条目；改用 store 期间记录的列表
    for (const e of storedList) {
      const h = e.hash.toString(16).slice(0, 10);
      entries.push({
        key: `0x${h}…`,
        value: `d=${e.depth} s=${e.score} ${e.flag}`,
        role: e.flag === 'EXACT' ? 'final' : e.flag === 'LOWER_BOUND' ? 'frontier' : 'warn',
      });
    }
    rec
      .begin(note)
      .setMap(entries)
      .setAux([
        { label: '表大小', value: String(tt.size), role: 'pivot' },
        { label: '写入', value: String(tt.stats.stores), role: 'frontier' },
        { label: '命中', value: String(tt.stats.hits), role: 'final' },
        { label: '未命中', value: String(tt.stats.misses), role: 'warn' },
        ...(curHash !== undefined
          ? [
              {
                label: '当前 hash',
                value: `0x${curHash.toString(16).slice(0, 10)}…`,
                role: 'compare' as BarRole,
              },
            ]
          : []),
      ])
      .commit();
  };

  const storedList: TtEntry[] = [];
  for (let i = 0; i < boards.length; i++) {
    const h = zob.compute(boards[i]!);
    const entry: TtEntry = {
      hash: h,
      depth: 3,
      score: scores[i]!,
      flag: flags[i]!,
      bestMove: i,
    };
    tt.store(entry);
    storedList.push(entry);
    renderTable(
      {
        zh: `局面 ${i + 1}（${boards[i]!.join(',')}）→ hash=0x${h
          .toString(16)
          .slice(0, 10)}…，写入表（${flags[i]}=${scores[i]}）`,
        en: `Position ${i + 1} (${boards[i]!.join(',')}) → hash=0x${h
          .toString(16)
          .slice(0, 10)}…, stored (${flags[i]}=${scores[i]})`,
      },
      h,
    );
  }

  // 查询一个已存的局面 → 命中
  const hitHash = zob.compute(boards[0]!);
  tt.lookup(hitHash, 3, -Infinity, Infinity);
  renderTable({ zh: `查询局面 1 的 hash → 命中`, en: `Lookup position 1's hash → hit` }, hitHash);

  // 查询一个未存局面 → 未命中
  zob.compute([2, 1, 0, 0, 0, 0, 0, 0, 0]);
  const missHash = zob.hash;
  tt.lookup(missHash, 3, -Infinity, Infinity);
  renderTable({ zh: `查询未存局面 → 未命中`, en: `Lookup unknown position → miss` }, missHash);

  rec
    .begin({
      zh: `完成：表大小 ${tt.size}，命中 ${tt.stats.hits}，未命中 ${tt.stats.misses}`,
      en: `Done: size=${tt.size}, hits=${tt.stats.hits}, misses=${tt.stats.misses}`,
    })
    .setMap(
      storedList.map((e) => ({
        key: `0x${e.hash.toString(16).slice(0, 10)}…`,
        value: `d=${e.depth} s=${e.score} ${e.flag}`,
        role: 'final' as BarRole,
      })),
    )
    .setAux([
      { label: '表大小', value: String(tt.size), role: 'final' },
      { label: '写入', value: String(tt.stats.stores), role: 'final' },
      { label: '命中', value: String(tt.stats.hits), role: 'final' },
      { label: '未命中', value: String(tt.stats.misses), role: 'final' },
    ])
    .commit();

  return rec.build();
}
