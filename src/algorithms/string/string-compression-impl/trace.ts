// =============================================================================
// 字符串压缩 · 录制帧序列
// setArray 展示字符码，pointer 标记 read/write；setAux 展示当前段与计数。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { compress, type CompressionHooks } from './impl.ts';

export const DEFAULT_INPUT = ['a', 'a', 'b', 'b', 'c', 'c', 'c'];

const CODE = (chars: readonly string[]): number[] => chars.map((c) => c.charCodeAt(0));

export function buildTrace(input: string[] = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const chars = [...input];
  let read = 0;
  let write = 0;
  let curCh = '';
  let curCount = 0;

  const snap = (note: { zh: string; en: string }): void => {
    const n = chars.length;
    const roles: BarRole[] = new Array(n).fill('default');
    const pointers: Array<{ index: number; label: string }> = [];
    // 已写入部分
    for (let k = 0; k < write; k++) roles[k] = 'final';
    // 当前读段
    for (let k = read; k < read + curCount && k < n; k++) roles[k] = 'frontier';
    if (read < n) pointers.push({ index: read, label: 'read' });
    if (write < n) pointers.push({ index: write, label: 'write' });
    rec
      .begin(note)
      .setArray(CODE(chars), roles, pointers)
      .setAux([
        { label: '当前字符', value: curCh || '-', role: 'compare' as BarRole },
        { label: '当前计数', value: String(curCount), role: 'pivot' as BarRole },
        { label: 'write', value: String(write) },
      ])
      .commit();
  };

  snap({
    zh: `原始字符数组：[${input.map((c) => `'${c}'`).join(', ')}]`,
    en: `Original chars: [${input.map((c) => `'${c}'`).join(', ')}]`,
  });

  const hooks: CompressionHooks = {
    onRun: (start, end, ch) => {
      read = start;
      curCh = ch;
      curCount = end - start;
      snap({
        zh: `识别一段：'${ch}' × ${end - start}`,
        en: `Run found: '${ch}' × ${end - start}`,
      });
    },
    onWriteChar: (w, c) => {
      write = w + 1;
      snap({
        zh: `写入 '${c}' 到下标 ${w}`,
        en: `Write '${c}' at index ${w}`,
      });
    },
    onWriteCount: () => {
      snap({
        zh: `计数 ${curCount} 已写入`,
        en: `Count ${curCount} written`,
      });
    },
  };

  const len = compress(chars, hooks);

  rec
    .begin({ zh: `完成：压缩后长度 = ${len}`, en: `Done: compressed length = ${len}` })
    .setArray(
      CODE(chars.slice(0, len)),
      chars.slice(0, len).map(() => 'final' as BarRole),
      [],
    )
    .setAux([
      { label: '压缩结果', value: chars.slice(0, len).join(''), role: 'final' as BarRole },
      { label: '长度', value: String(len) },
    ])
    .commit();

  return rec.build();
}
