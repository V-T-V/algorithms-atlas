// =============================================================================
// 842 压缩 (简化) · 纯算法实现
// 8 字节为块，检测全零 / 全相同 / 短回引。
// =============================================================================

export interface Op842 {
  type: 'raw' | 'zeros' | 'repeat' | 'short-match';
  bytes?: number[];
  distance?: number;
  length?: number;
}

export interface Op842Hooks {
  onOp?: (op: Op842) => void;
}

const BLOCK = 8;

export function compress842(data: readonly number[], hooks: Op842Hooks = {}): Op842[] {
  const ops: Op842[] = [];
  let i = 0;
  while (i < data.length) {
    const block = data.slice(i, i + BLOCK);
    // 模板 1：全零
    if (block.length === BLOCK && block.every((b) => b === 0)) {
      const op: Op842 = { type: 'zeros' };
      ops.push(op);
      hooks.onOp?.(op);
      i += BLOCK;
      continue;
    }
    // 模板 2：全相同字节
    if (block.length >= 2 && block.every((b) => b === block[0])) {
      const op: Op842 = { type: 'repeat', length: block.length, bytes: [block[0]!] };
      ops.push(op);
      hooks.onOp?.(op);
      i += block.length;
      continue;
    }
    // 模板 3：短回引（前 64 字节内有相同 8 字节块）
    if (block.length === BLOCK) {
      let dist = 0;
      for (let d = BLOCK; d <= Math.min(i, 64); d += BLOCK) {
        const ref = i - d;
        let match = true;
        for (let k = 0; k < BLOCK; k++) {
          if (data[ref + k] !== block[k]) {
            match = false;
            break;
          }
        }
        if (match) {
          dist = d;
          break;
        }
      }
      if (dist > 0) {
        const op: Op842 = { type: 'short-match', distance: dist, length: BLOCK };
        ops.push(op);
        hooks.onOp?.(op);
        i += BLOCK;
        continue;
      }
    }
    // 原始
    const op: Op842 = { type: 'raw', bytes: [...block] };
    ops.push(op);
    hooks.onOp?.(op);
    i += block.length;
  }
  return ops;
}

export function decompress842(ops: readonly Op842[]): number[] {
  const out: number[] = [];
  for (const op of ops) {
    switch (op.type) {
      case 'raw':
        out.push(...(op.bytes ?? []));
        break;
      case 'zeros':
        for (let k = 0; k < BLOCK; k++) out.push(0);
        break;
      case 'repeat': {
        const len = op.length ?? 1;
        const v = op.bytes?.[0] ?? 0;
        for (let k = 0; k < len; k++) out.push(v);
        break;
      }
      case 'short-match': {
        const start = out.length - (op.distance ?? 0);
        for (let k = 0; k < (op.length ?? 0); k++) out.push(out[start + k]!);
        break;
      }
    }
  }
  return out;
}
