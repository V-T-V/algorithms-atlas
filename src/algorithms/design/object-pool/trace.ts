// =============================================================================
// 对象池模式 · 录制帧序列
// 用 setAux 展示 free/inUse 计数；用 setBars 展示容量使用。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { ObjectPool, type PoolHooks } from './impl.ts';

/** 演示用的「资源」对象：带 id 与 dirty 标志。 */
interface Resource {
  id: number;
  dirty: boolean;
}

export const DEFAULT_INPUT = { capacity: 3, acquireSeq: [1, 1, 1, 0, 1, 0, 0] };
// 序列：1=acquire，0=release 最早借出且仍在用的对象

interface TraceOptions {
  capacity: number;
  acquireSeq: number[];
}

export function buildTrace(input: Partial<TraceOptions> = {}): Frame[] {
  const capacity = input.capacity ?? DEFAULT_INPUT.capacity;
  const acquireSeq = input.acquireSeq ?? DEFAULT_INPUT.acquireSeq;
  const rec = new TraceRecorder();

  let free = 0;
  let inUse = 0;
  let nextId = 0;
  const inUseObjs: Resource[] = [];
  let rejected = 0;

  const render = (note: { zh: string; en: string }): void => {
    rec
      .begin(note)
      .setAux([
        { label: '容量', value: String(capacity), role: 'pivot' as BarRole },
        { label: '空闲', value: String(free), role: 'compare' as BarRole },
        { label: '使用中', value: String(inUse), role: 'final' as BarRole },
        { label: '拒绝次数', value: String(rejected), role: 'warn' as BarRole },
        {
          label: '使用中对象',
          value: inUseObjs.map((o) => `#${o.id}${o.dirty ? '*' : ''}`).join(', '),
          role: 'frontier' as BarRole,
        },
      ])
      .setBars(
        Array.from({ length: capacity }, (_, i) => ({
          value: i < inUse ? 1 : 0,
          role: (i < inUse ? 'final' : 'default') as BarRole,
          label: i < inUse ? `#${inUseObjs[i]?.id ?? '?'}` : 'free',
        })),
      )
      .commit();
  };

  free = capacity;
  render({
    zh: `初始化：预创建 ${capacity} 个对象入池`,
    en: `Init: pre-allocate ${capacity} objects into pool`,
  });

  const pool = new ObjectPool<Resource>(
    () => ({ id: ++nextId, dirty: false }),
    (obj) => {
      obj.dirty = false; // reset
    },
    capacity,
    capacity,
    'reject',
    {
      onAcquire: (obj) => {
        free = pool.freeCount;
        inUse = pool.inUseCount;
        inUseObjs.push(obj);
        render({ zh: `acquire 对象 #${obj.id}`, en: `acquire object #${obj.id}` });
      },
      onRelease: (obj) => {
        free = pool.freeCount;
        inUse = pool.inUseCount;
        const idx = inUseObjs.findIndex((o) => o.id === obj.id);
        if (idx >= 0) inUseObjs.splice(idx, 1);
        render({
          zh: `release 对象 #${obj.id}（已 reset）`,
          en: `release object #${obj.id} (reset)`,
        });
      },
      onReject: () => {
        rejected += 1;
        render({ zh: `池空，acquire 被拒绝`, en: `pool empty, acquire rejected` });
      },
    } satisfies PoolHooks<Resource>,
  );

  for (const op of acquireSeq) {
    if (op === 1) {
      // 模拟借出后「弄脏」
      try {
        const obj = pool.acquire();
        obj.dirty = true;
      } catch {
        // reject 已在钩子处理
      }
    } else {
      // release 最早借出的对象
      if (inUseObjs.length > 0) pool.release(inUseObjs[0]!);
    }
  }

  const stats = pool.stats();
  rec
    .begin({
      zh: `完成：借出 ${stats.totalAcquired} 次，归还 ${stats.totalReleased} 次，拒绝 ${stats.totalRejected} 次`,
      en: `Done: ${stats.totalAcquired} acquired, ${stats.totalReleased} released, ${stats.totalRejected} rejected`,
    })
    .setAux([
      { label: '总借出', value: String(stats.totalAcquired), role: 'final' as BarRole },
      { label: '总归还', value: String(stats.totalReleased), role: 'final' as BarRole },
      { label: '总拒绝', value: String(stats.totalRejected), role: 'final' as BarRole },
    ])
    .commit();

  return rec.build();
}
