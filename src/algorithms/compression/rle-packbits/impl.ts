// =============================================================================
// PackBits 风格 RLE · 纯算法实现
// 输出段序列（header + payload），可还原原始字节流。
// =============================================================================

/** 一个 PackBits 段。 */
export interface PackBitsSegment {
  /** 'run' = 重复段（重复 1 个字节 count 次，count ∈ [2,128]）；'lit' = 字面段（count 个不同字节，count ∈ [1,128]）。 */
  kind: 'run' | 'lit';
  /** run: 重复次数（>=2）；lit: literal 字节数 (>=1)。 */
  count: number;
  /** run: 被重复的单字节；lit: 字面字节数组。 */
  data: number[];
}

export interface PackBitsHooks {
  onRun?: (pos: number, byte: number, count: number) => void;
  onLit?: (start: number, bytes: number[]) => void;
}

export interface PackBitsResult {
  segments: PackBitsSegment[];
}

/** 字符串 → 字节（码点 & 0xff）。 */
export function toBytes(s: string): number[] {
  return Array.from(s).map((c) => c.charCodeAt(0) & 0xff);
}

/** 计算从 pos 起的重复长度（同字节连续段，至少包含 pos 自身）。 */
function runLength(data: number[], pos: number): number {
  let len = 1;
  while (pos + len < data.length && data[pos + len] === data[pos] && len < 128) {
    len++;
  }
  return len;
}

/**
 * PackBits 编码：扫描字节流，遇重复段（>=2）发 run，否则累积 literal。
 * literal 段在遇到下一个 run（长度>=2）或达到 128 时 flush。
 */
export function packbitsEncode(input: string, hooks: PackBitsHooks = {}): PackBitsResult {
  const data = toBytes(input);
  const n = data.length;
  const segments: PackBitsSegment[] = [];
  let litBuf: number[] = [];
  let litStart = -1;

  const flushLit = (): void => {
    if (litBuf.length > 0) {
      // 拆成多个 <=128 的 literal 段
      let i = 0;
      while (i < litBuf.length) {
        const chunkLen = Math.min(128, litBuf.length - i);
        const chunk = litBuf.slice(i, i + chunkLen);
        segments.push({ kind: 'lit', count: chunkLen, data: chunk });
        hooks.onLit?.(litStart + i, chunk);
        i += chunkLen;
      }
      litBuf = [];
      litStart = -1;
    }
  };

  let pos = 0;
  while (pos < n) {
    const rl = runLength(data, pos);
    if (rl >= 2) {
      flushLit();
      const byte = data[pos]!;
      hooks.onRun?.(pos, byte, rl);
      segments.push({ kind: 'run', count: rl, data: [byte] });
      pos += rl;
    } else {
      if (litBuf.length === 0) litStart = pos;
      litBuf.push(data[pos]!);
      pos++;
      if (litBuf.length === 128) flushLit();
    }
  }
  flushLit();
  return { segments };
}

/** PackBits 解码：按段还原字节流。 */
export function packbitsDecode(segments: PackBitsSegment[]): string {
  const out: number[] = [];
  for (const seg of segments) {
    if (seg.kind === 'run') {
      const byte = seg.data[0]!;
      for (let i = 0; i < seg.count; i++) out.push(byte);
    } else {
      for (const b of seg.data) out.push(b);
    }
  }
  return String.fromCharCode(...out);
}
