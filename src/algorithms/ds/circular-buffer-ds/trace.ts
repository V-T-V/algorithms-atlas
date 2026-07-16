// =============================================================================
// 循环缓冲区 · 录制帧序列
// 用 setArray 展示环形数组，pointer 标 read/write；setAux 展示逻辑序列。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { CircularBuffer, type CircularBufferHooks } from './impl.ts';

export const DEFAULT_INPUT = {
  capacity: 4,
  ops: [
    { op: 'write', value: 1 },
    { op: 'write', value: 2 },
    { op: 'write', value: 3 },
    { op: 'read' },
    { op: 'read' },
    { op: 'write', value: 4 },
    { op: 'write', value: 5 },
    { op: 'write', value: 6 }, // 回绕
    { op: 'write', value: 7, overwrite: true }, // 覆盖
  ] as const,
};

export function buildTrace(
  input: {
    capacity: number;
    ops: ReadonlyArray<{ op: 'write' | 'read'; value?: number; overwrite?: boolean }>;
  } = DEFAULT_INPUT,
): Frame[] {
  const rec = new TraceRecorder();
  const cb = new CircularBuffer(input.capacity);

  const snapshot = (
    note: { zh: string; en: string },
    activeIdx: number,
    activeRole: BarRole,
  ): void => {
    const arr = cb.toArray();
    const roles: BarRole[] = arr.map(() => 'default');
    for (let k = 0; k < cb.size; k++) {
      const idx = (cb.read + k) % cb.capacity;
      roles[idx] = 'frontier';
    }
    if (activeIdx >= 0) roles[activeIdx] = activeRole;
    const pointers: Array<{ index: number; label: string }> = [];
    if (cb.isEmpty()) {
      pointers.push({ index: cb.write, label: 'r=w' });
    } else {
      pointers.push({ index: cb.read, label: 'read' });
      pointers.push({ index: cb.write, label: 'write' });
    }
    rec
      .begin(note)
      .setArray(arr, roles, pointers)
      .setAux([
        { label: '逻辑序列', value: `[${cb.toSequence().join(', ')}]`, role: 'final' as BarRole },
        { label: 'size / capacity', value: `${cb.size} / ${cb.capacity}` },
      ])
      .commit();
  };

  snapshot({ zh: '空循环缓冲区', en: 'Empty circular buffer' }, -1, 'default');

  const hooks: CircularBufferHooks = {
    onWrite: (idx, value, overwritten) => {
      snapshot(
        {
          zh: `写入 ${value}（下标 ${idx}）${overwritten ? '，覆盖最旧' : ''}`,
          en: `Write ${value} (idx ${idx})${overwritten ? ', overwrote oldest' : ''}`,
        },
        idx,
        'swap',
      );
    },
    onRead: (idx, value) => {
      snapshot(
        { zh: `读取 ${value}（下标 ${idx}）`, en: `Read ${value} (idx ${idx})` },
        idx,
        'compare',
      );
    },
    onFull: () => {
      snapshot({ zh: '缓冲已满', en: 'Buffer full' }, -1, 'warn');
    },
    onEmpty: () => {
      snapshot({ zh: '缓冲为空', en: 'Buffer empty' }, -1, 'warn');
    },
  };

  for (const o of input.ops) {
    if (o.op === 'write') {
      cb.writeValue(o.value ?? 0, o.overwrite ?? false, hooks);
    } else {
      cb.readValue(hooks);
    }
  }

  // 终态
  const seq = cb.toSequence();
  rec
    .begin({ zh: `完成；逻辑序列：[${seq.join(', ')}]`, en: `Done; sequence: [${seq.join(', ')}]` })
    .setArray(
      cb.toArray(),
      cb.toArray().map((_, i) => {
        let used = false;
        for (let k = 0; k < cb.size; k++) if ((cb.read + k) % cb.capacity === i) used = true;
        return used ? ('final' as BarRole) : ('default' as BarRole);
      }),
      cb.isEmpty()
        ? [{ index: cb.write, label: 'r=w' }]
        : [
            { index: cb.read, label: 'read' },
            { index: cb.write, label: 'write' },
          ],
    )
    .setAux([
      { label: '逻辑序列', value: `[${seq.join(', ')}]`, role: 'final' as BarRole },
      { label: 'size / capacity', value: `${cb.size} / ${cb.capacity}` },
    ])
    .commit();

  return rec.build();
}
