// =============================================================================
// 可持久化队列 · 录制帧序列
// 用 setArray 展示各版本队列内容，setAux 展示版本号与操作历史。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { PersistentQueue, type PersistentQueueHooks } from './impl.ts';

export const DEFAULT_INPUT = {
  ops: [
    { op: 'enqueue', value: 1 },
    { op: 'enqueue', value: 2 },
    { op: 'enqueue', value: 3 },
    { op: 'dequeue' },
    { op: 'enqueue', value: 4 },
    { op: 'dequeue' },
    { op: 'dequeue' },
  ] as const,
};

export function buildTrace(
  input: {
    ops: ReadonlyArray<{ op: 'enqueue' | 'dequeue'; value?: number }>;
  } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  // 保留所有历史版本，演示「持久化」
  const versions: Array<{ tag: string; q: PersistentQueue }> = [];
  let cur = PersistentQueue.empty();
  versions.push({ tag: 'v0(empty)', q: cur });
  const history: string[] = [];

  const snapshot = (note: { zh: string; en: string }): void => {
    const curArr = cur.toArray();
    rec
      .begin(note)
      .setArray(
        curArr,
        curArr.map(() => 'final' as BarRole),
        [],
      )
      .setAux([
        { label: '当前版本', value: `v${versions.length - 1}`, role: 'pivot' as BarRole },
        { label: '当前队列', value: `[${curArr.join(', ')}]`, role: 'final' as BarRole },
        { label: '长度', value: String(cur.length) },
        { label: '历史版本', value: versions.map((v, i) => `v${i}:${v.tag}`).join(' | ') },
        { label: '操作历史', value: history.join(' → ') || '∅', role: 'compare' as BarRole },
      ])
      .commit();
  };

  snapshot({ zh: '初始：空队列（v0）', en: 'Initial: empty queue (v0)' });

  const hooks: PersistentQueueHooks = {
    onReverse: (count) => {
      history.push(`reverse(${count})`);
      snapshot({
        zh: `倾倒 back → front（反转 ${count} 个）`,
        en: `Dump back → front (reverse ${count})`,
      });
    },
  };

  for (const o of input.ops) {
    if (o.op === 'enqueue') {
      cur = cur.enqueue(o.value ?? 0, hooks, versions.length - 1);
      versions.push({ tag: `+${o.value}`, q: cur });
      history.push(`enq(${o.value})`);
      snapshot({
        zh: `入队 ${o.value} → 新版本 v${versions.length - 1}`,
        en: `Enqueue ${o.value} → new version v${versions.length - 1}`,
      });
    } else {
      const r = cur.dequeue(hooks, versions.length - 1);
      if (r !== null) {
        cur = r.rest;
        versions.push({ tag: `deq(${r.value})`, q: cur });
        history.push(`deq→${r.value}`);
        snapshot({
          zh: `出队 ${r.value} → 新版本 v${versions.length - 1}`,
          en: `Dequeue ${r.value} → new version v${versions.length - 1}`,
        });
      }
    }
  }

  // 终态：强调所有历史版本仍可访问
  rec
    .begin({
      zh: `完成；共 ${versions.length} 个版本均可访问（持久化）`,
      en: `Done; all ${versions.length} versions still accessible (persistence)`,
    })
    .setAux([
      {
        label: '所有版本',
        value: versions.map((v, i) => `v${i}=[${v.q.toArray().join(',')}]`).join('  '),
        role: 'final' as BarRole,
      },
    ])
    .commit();

  return rec.build();
}
