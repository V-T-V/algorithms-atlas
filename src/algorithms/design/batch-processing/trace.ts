// =============================================================================
// 批处理模式 · 录制帧序列
// 用 setAux 展示缓冲区内容、批次数；用 setBars 展示各批大小。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { BatchProcessor, type BatchHooks } from './impl.ts';

export const DEFAULT_INPUT = { items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], threshold: 4 };

interface TraceOptions {
  items: number[];
  threshold: number;
}

export function buildTrace(input: Partial<TraceOptions> = {}): Frame[] {
  const items = input.items ?? DEFAULT_INPUT.items;
  const threshold = input.threshold ?? DEFAULT_INPUT.threshold;
  const rec = new TraceRecorder();

  let buffer: number[] = [];
  let batchCount = 0;
  const batchSizes: number[] = [];

  const render = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setAux([
        {
          label: '缓冲区',
          value: `[${buffer.join(', ')}]`,
          role: (buffer.length >= threshold ? 'warn' : 'compare') as BarRole,
        },
        {
          label: '阈值',
          value: String(threshold),
          role: 'pivot' as BarRole,
        },
        {
          label: '已 flush 批次',
          value: String(batchCount),
          role: 'final' as BarRole,
        },
        {
          label: '各批大小',
          value: `[${batchSizes.join(', ')}]`,
          role: 'sorted' as BarRole,
        },
      ])
      .setBars(
        batchSizes.length > 0
          ? batchSizes.map((s, i) => ({
              value: s,
              role: 'final' as BarRole,
              label: `批${i + 1}:${s}`,
            }))
          : [{ value: 0, role: 'default' as BarRole, label: '(无批次)' }],
      )
      .commit();
  };

  render({
    zh: `初始化：阈值=${threshold}，待处理 ${items.length} 项`,
    en: `Init: threshold=${threshold}, ${items.length} items pending`,
  });

  const hooks: BatchHooks<number> = {
    onBuffer: (item, size) => {
      buffer.push(item);
      render({
        zh: `入缓冲：${item}（当前 ${size}/${threshold}）`,
        en: `Buffered: ${item} (${size}/${threshold})`,
      });
    },
    onFlush: (batch) => {
      batchCount += 1;
      batchSizes.push(batch.length);
      buffer = [];
      render({
        zh: `Flush 第 ${batchCount} 批（${batch.length} 项）：[${batch.join(', ')}]`,
        en: `Flush batch ${batchCount} (${batch.length} items): [${batch.join(', ')}]`,
      });
    },
  };

  const proc = new BatchProcessor<number>(threshold, hooks);
  for (const it of items) proc.add(it);
  proc.flush();

  const stats = proc.stats();
  rec
    .begin({
      zh: `完成：共 ${stats.batchCount} 批，处理 ${stats.totalProcessed} 项`,
      en: `Done: ${stats.batchCount} batches, ${stats.totalProcessed} items processed`,
    })
    .setAux([
      { label: '批次数', value: String(stats.batchCount), role: 'final' as BarRole },
      { label: '总项数', value: String(stats.totalProcessed), role: 'final' as BarRole },
      { label: '各批大小', value: `[${stats.batchSizes.join(', ')}]`, role: 'final' as BarRole },
    ])
    .setBars(
      stats.batchSizes.map((s, i) => ({
        value: s,
        role: 'sorted' as BarRole,
        label: `批${i + 1}`,
      })),
    )
    .commit();

  return rec.build();
}
