// =============================================================================
// MurmurHash3 (32-bit) · 录制帧序列
// 用 setAux 展示每处理一个 4 字节块后累计 hash 值的演化。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { murmurhash3, fmix32, type MurmurHooks } from './impl.ts';

export const DEFAULT_INPUT = 'hello world';
export const DEFAULT_SEED = 0;

function hex8(n: number): string {
  return '0x' + (n >>> 0).toString(16).padStart(8, '0');
}

/** 录制演示帧序列。 */
export function buildTrace(
  input: string | number[] = DEFAULT_INPUT,
  seed: number = DEFAULT_SEED,
): Frame[] {
  const rec = new TraceRecorder();
  const data = typeof input === 'string' ? Array.from(new TextEncoder().encode(input)) : input;
  const displayInput = typeof input === 'string' ? `"${input}"` : `[${input.join(', ')}]`;
  const nblocks = Math.floor(data.length / 4);
  let blockCount = 0;

  rec
    .begin({
      zh: `输入 ${displayInput}（${data.length} 字节），种子 ${hex8(seed)}。${nblocks} 个完整块 + ${data.length & 3} 尾字节。`,
      en: `Input ${displayInput} (${data.length} bytes), seed ${hex8(seed)}. ${nblocks} full blocks + ${data.length & 3} tail bytes.`,
    })
    .setAux([
      { label: '种子', value: hex8(seed), role: 'frontier' as BarRole },
      { label: '当前 hash', value: hex8(seed), role: 'pivot' as BarRole },
      { label: '字节数', value: String(data.length), role: 'default' as BarRole },
      { label: 'C1', value: hex8(0xcc9e2d51), role: 'compare' as BarRole },
      { label: 'C2', value: hex8(0x1b873593), role: 'compare' as BarRole },
    ])
    .commit();

  const hooks: MurmurHooks = {
    onBlock: (i, k1, hash) => {
      blockCount++;
      rec
        .begin({
          zh: `块[${i}] k1=${hex8(k1)}：乘C1→旋转15→乘C2→混入→旋转13→乘5加常量。hash=${hex8(hash)}`,
          en: `Block[${i}] k1=${hex8(k1)}: mulC1→rot15→mulC2→mix→rot13→mul5+const. hash=${hex8(hash)}`,
        })
        .setAux([
          { label: '当前 hash', value: hex8(hash), role: 'final' as BarRole },
          { label: '当前块', value: String(i), role: 'pivot' as BarRole },
          { label: 'k1 (混入前)', value: hex8(k1), role: 'compare' as BarRole },
          { label: '已处理块', value: `${blockCount}/${nblocks}`, role: 'default' as BarRole },
        ])
        .commit();
    },
    onTail: (tailBytes, tailValue, hash) => {
      rec
        .begin({
          zh: `尾部 ${tailBytes} 字节：k1=${hex8(tailValue)}，乘C1→旋转15→乘C2→异或入 hash。hash=${hex8(hash)}`,
          en: `Tail ${tailBytes} bytes: k1=${hex8(tailValue)}, mulC1→rot15→mulC2→XOR into hash. hash=${hex8(hash)}`,
        })
        .setAux([
          { label: '当前 hash', value: hex8(hash), role: 'final' as BarRole },
          { label: '尾字节数', value: String(tailBytes), role: 'compare' as BarRole },
          { label: 'tail k1', value: hex8(tailValue), role: 'pivot' as BarRole },
        ])
        .commit();
    },
    onResult: (hash) => {
      rec
        .begin({
          zh: `终结 fmix32（右移异或×2 + 乘常量×2）→ ${hex8(hash)} (${hash >>> 0})`,
          en: `Finalize fmix32 (shift-xor×2 + mul const×2) → ${hex8(hash)} (${hash >>> 0})`,
        })
        .setAux([
          { label: '最终 hash', value: hex8(hash), role: 'final' as BarRole },
          { label: '十进制', value: String(hash >>> 0), role: 'default' as BarRole },
          { label: '输入', value: displayInput, role: 'compare' as BarRole },
          { label: 'fmix32', value: hex8(fmix32(hash)), role: 'compare' as BarRole },
        ])
        .commit();
    },
  };

  murmurhash3(input, seed, hooks);

  return rec.build();
}
