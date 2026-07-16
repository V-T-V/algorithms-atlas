// =============================================================================
// PackBits 风格 RLE · 录制帧序列
// setArray 展示字节流 + 指针；setAux 展示当前段类型与已输出段。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { packbitsEncode, toBytes, type PackBitsHooks, type PackBitsSegment } from './impl.ts';

export const DEFAULT_INPUT = 'AAAABBBCCXYZDDD';

function vis(c: number): string {
  if (c < 32 || c > 126) return `·${c}`;
  return String.fromCharCode(c);
}

export function buildTrace(input: string = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const data = toBytes(input);
  const emitted: PackBitsSegment[] = [];
  let pos = 0;
  let segRange: { kind: 'run' | 'lit'; len: number } | null = null;

  const snapshot = (note: { zh: string; en: string }): void => {
    const roles: BarRole[] = data.map((_, i) => {
      if (i < pos) return 'final';
      if (segRange && i >= pos && i < pos + segRange.len)
        return segRange.kind === 'run' ? 'compare' : 'frontier';
      if (i === pos) return 'pivot';
      return 'default';
    });
    const pointers: Array<{ index: number; label: string }> = [];
    if (pos < data.length) pointers.push({ index: pos, label: 'pos' });
    rec
      .begin(note)
      .setArray([...data], roles, pointers)
      .setAux([
        {
          label: '已输出段',
          value: emitted.length
            ? emitted
                .map((s) =>
                  s.kind === 'run' ? `run(${vis(s.data[0]!)}×${s.count})` : `lit(${s.count})`,
                )
                .join(' ')
            : '∅',
          role: 'final' as BarRole,
        },
      ])
      .commit();
    segRange = null;
  };

  snapshot({ zh: `输入「${input}」`, en: `Input "${input}"` });

  const hooks: PackBitsHooks = {
    onRun: (p, byte, count) => {
      pos = p;
      segRange = { kind: 'run', len: count };
      snapshot({ zh: `run 段：'${vis(byte)}' × ${count}`, en: `Run: '${vis(byte)}' × ${count}` });
      pos = p + count;
    },
    onLit: (start, bytes) => {
      pos = start;
      segRange = { kind: 'lit', len: bytes.length };
      snapshot({ zh: `lit 段：${bytes.length} 字节`, en: `Lit: ${bytes.length} bytes` });
      pos = start + bytes.length;
    },
  };

  const result = packbitsEncode(input, hooks);
  emitted.push(...result.segments);
  pos = data.length;

  rec
    .begin({
      zh: `完成：${result.segments.length} 个段`,
      en: `Done: ${result.segments.length} segments`,
    })
    .setMap([
      { key: '输入 / input', value: input, role: 'default' as BarRole },
      {
        key: '段序列',
        value: result.segments
          .map((s) => (s.kind === 'run' ? `run(${vis(s.data[0]!)}×${s.count})` : `lit(${s.count})`))
          .join(' '),
        role: 'final' as BarRole,
      },
    ])
    .commit();

  return rec.build();
}
