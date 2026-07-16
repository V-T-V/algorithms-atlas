// 批处理模式（Lazy 批量化）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'batch-processing',
  categoryId: 'design',
  title: { zh: '批处理模式（懒批量化）', en: 'Batch Processing (Lazy Batching)' },
  summary: {
    zh: '把高频小请求攒成一批一次性处理：缓冲到阈值或定时器触发，摊薄单位开销。',
    en: 'Accumulate frequent small requests into one batch: buffer until a threshold or timer fires, amortizing per-op cost.',
  },
  description: {
    zh: '批处理（Batching）是降低「每次操作固定开销」的经典设计：当单次请求的固定成本高（如网络往返、磁盘 IO、锁获取），把多个请求攒一批一次处理可大幅提升吞吐。\n\n核心机制：\n- 维护一个缓冲区 buffer\n- 每次 add(item)：加入 buffer；若达到 size 阈值则立刻 flush\n- 也可由定时器在 maxLatency 后强制 flush\n- flush(buffer)：把整批交给处理器，清空 buffer\n\n设计要点：\n- **背压**：buffer 上限避免内存爆炸\n- **次序**：批内可保持 FIFO\n- **部分失败**：批失败需重试或逐项回退\n\n本实现演示一个简易批处理器：阈值触发 flush，并统计每批大小与总处理项数。',
    en: 'Batching is the classic design for lowering "fixed per-operation cost": when each request has a high fixed cost (network round-trip, disk IO, lock acquisition), accumulating many into one batch greatly improves throughput.\n\nCore mechanism:\n- Maintain a buffer\n- On add(item): append to buffer; if the size threshold is reached, flush immediately\n- A timer may also force flush after maxLatency\n- flush(buffer): hand the whole batch to the processor and clear the buffer\n\nDesign concerns:\n- **Back-pressure**: a buffer cap prevents memory blowup\n- **Ordering**: FIFO within a batch\n- **Partial failure**: a failed batch needs retry or per-item fallback\n\nThis implementation demonstrates a simple batch processor: threshold-triggered flush, with per-batch sizes and total counts reported.',
  },
  tags: ['design', 'batching', 'throughput', 'buffering'],
  complexity: { time: 'O(1) amortized per add', space: 'O(batchSize)' },
};
