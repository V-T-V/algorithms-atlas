// =============================================================================
// 环形缓冲区 · 录制帧序列
// 用 setBars 展示定长数组（有效元素标 'sorted'，空槽标 'default'，
// read 指针位标 'pivot'，write 指针位标 'frontier'，刚写/读位标 'final'/'swap'）。
// 用 setAux 展示 count / read / write / capacity。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { RingBuffer, type RingBufferHooks } from './impl.ts';

/** 演示：写入到满（触发丢弃），读出若干，再写入体现环绕。 */
export const DEFAULT_INPUT = {
  capacity: 4,
  ops: [1, 2, 3, 4, 5, null, null, 6, 7] as Array<number | null>,
};

/** 录制演示帧序列。 */
export function buildTrace(
  input: { capacity: number; ops: ReadonlyArray<number | null> } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const rb = new RingBuffer(input.capacity);

  let lastWrite = -1;
  let lastRead = -1;
  let overflow = false;

  const snapshot = (note: { zh: string; en: string }): void => {
    const arr = rb.toArray(); // 含空槽
    const seq = new Set(rb.toSequence());
    const roles: Record<number, BarRole> = {};
    for (let i = 0; i < arr.length; i++) {
      if (i === rb.read && !rb.isEmpty()) roles[i] = 'pivot';
      else if (i === rb.write && !rb.isFull()) roles[i] = 'frontier';
      else if (i === lastRead) roles[i] = 'swap';
      else if (i === lastWrite) roles[i] = 'final';
      else if (seq.has(arr[i]!)) roles[i] = 'sorted';
      else roles[i] = 'default';
    }
    rec
      .begin(note)
      .setBars(rec.barsFrom(arr, roles))
      .setAux([
        { label: 'count', value: `${rb.size}/${input.capacity}`, role: 'final' },
        { label: 'read', value: String(rb.read), role: 'pivot' },
        { label: 'write', value: String(rb.write), role: 'frontier' },
      ])
      .commit();
    lastWrite = lastRead = -1;
    overflow = false;
  };

  snapshot({
    zh: `空环形缓冲区（容量 ${input.capacity}）`,
    en: `Empty ring buffer (capacity ${input.capacity})`,
  });

  const hooks: RingBufferHooks = {
    onWrite: (idx, value) => {
      lastWrite = idx;
      void value;
      snapshot({
        zh: `写入 ${value}（write 下标 ${idx} → ${(idx + 1) % input.capacity}）`,
        en: `Write ${value} (write ${idx} → ${(idx + 1) % input.capacity})`,
      });
    },
    onRead: (idx, value) => {
      lastRead = idx;
      void value;
      snapshot({
        zh: `读出 ${value}（read 下标 ${idx} → ${(idx + 1) % input.capacity}）`,
        en: `Read ${value} (read ${idx} → ${(idx + 1) % input.capacity})`,
      });
    },
    onOverflow: (value) => {
      overflow = true;
      void value;
      snapshot({ zh: `缓冲区满，丢弃 ${value}`, en: `Buffer full, drop ${value}` });
    },
  };

  const readOut: number[] = [];
  for (const op of input.ops) {
    if (op === null) {
      const v = rb.readValue(hooks);
      if (v !== undefined) readOut.push(v);
    } else {
      rb.writeValue(op, hooks);
    }
  }
  void overflow;

  // 终态
  const arr = rb.toSequence();
  rec
    .begin({
      zh: `完成，有效数据 [${arr.join(', ')}]，已读出 [${readOut.join(', ')}]`,
      en: `Done, in-buffer [${arr.join(', ')}], read-out [${readOut.join(', ')}]`,
    })
    .setBars(arr.map((v) => ({ value: v, role: 'final' as BarRole })))
    .commit();

  return rec.build();
}
