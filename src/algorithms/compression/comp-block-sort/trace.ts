// =============================================================================
// 块排序 · 录制帧序列
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { blockSortForward, blockSortInverse, type BlockSortHooks } from './impl.ts';

export const DEFAULT_INPUT = 'bananaabracadabra';

export function buildTrace(input: string = DEFAULT_INPUT, blockSize: number = 8): Frame[] {
  const rec = new TraceRecorder();
  const blocks: Array<{ block: string; lastColumn: string; idx: number }> = [];

  rec
    .begin({
      zh: `输入 "${input}"，块大小 ${blockSize}`,
      en: `Input "${input}", block size ${blockSize}`,
    })
    .setAux([{ label: '块大小', value: String(blockSize), role: 'pivot' as BarRole }])
    .commit();

  const hooks: BlockSortHooks = {
    onBlock: (block, r) => blocks.push({ block, lastColumn: r.lastColumn, idx: r.primaryIndex }),
  };

  const results = blockSortForward(input, blockSize, hooks);
  const restored = blockSortInverse(results);
  const ok = restored === input;

  for (const b of blocks) {
    rec
      .begin({
        zh: `块 "${b.block}" → 末列 "${b.lastColumn}"（主索引 ${b.idx}）`,
        en: `Block "${b.block}" → last "${b.lastColumn}" (idx ${b.idx})`,
      })
      .setAux([
        { label: '原块', value: b.block, role: 'compare' as BarRole },
        { label: '末列', value: b.lastColumn, role: 'final' as BarRole },
        { label: '主索引', value: String(b.idx), role: 'pivot' as BarRole },
      ])
      .commit();
  }

  rec
    .begin({
      zh: `完成：${results.length} 块，往返${ok ? '一致' : '不一致'}`,
      en: `Done: ${results.length} blocks, ${ok ? 'OK' : 'FAIL'}`,
    })
    .setAux([
      { label: '块数', value: String(results.length), role: 'pivot' as BarRole },
      { label: '还原', value: restored, role: 'compare' as BarRole },
      { label: '往返一致', value: ok ? '是' : '否', role: 'final' as BarRole },
    ])
    .commit();

  return rec.build();
}
