// =============================================================================
// xxHash (XXH32) · 录制帧序列
// 用 setAux 展示累加器随 stripe / 尾部 / 雪崩的演化。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { xxh32, avalanche, type XxHashHooks } from './impl.ts';

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
  const nstripes = Math.floor(data.length / 16);
  let stripeCount = 0;

  rec
    .begin({
      zh: `输入 ${displayInput}（${data.length} 字节），种子 ${hex8(seed)}。${nstripes} 个 stripe + ${data.length % 16} 尾字节。`,
      en: `Input ${displayInput} (${data.length} bytes), seed ${hex8(seed)}. ${nstripes} stripes + ${data.length % 16} tail bytes.`,
    })
    .setAux([
      { label: '种子', value: hex8(seed), role: 'frontier' as BarRole },
      { label: '累计 acc', value: hex8(seed), role: 'pivot' as BarRole },
      { label: '字节数', value: String(data.length), role: 'default' as BarRole },
      { label: 'P1', value: hex8(0x9e3779b1), role: 'compare' as BarRole },
      { label: 'P2', value: hex8(0x85ebca77), role: 'compare' as BarRole },
    ])
    .commit();

  const hooks: XxHashHooks = {
    onStripe: (i, acc) => {
      stripeCount++;
      rec
        .begin({
          zh: `stripe[${i}]：4 lane 各 (×P2→rot17→×P1) 混入累加器。合并 acc=${hex8(acc.reduce((x, y) => (x + y) >>> 0, 0))}`,
          en: `stripe[${i}]: 4 lanes each (×P2→rot17→×P1) merged into accumulators.`,
        })
        .setAux([
          { label: 'acc1', value: hex8(acc[0]!), role: 'compare' as BarRole },
          { label: 'acc2', value: hex8(acc[1]!), role: 'compare' as BarRole },
          { label: 'acc3', value: hex8(acc[2]!), role: 'compare' as BarRole },
          { label: 'acc4', value: hex8(acc[3]!), role: 'compare' as BarRole },
          {
            label: '已处理 stripe',
            value: `${stripeCount}/${nstripes}`,
            role: 'default' as BarRole,
          },
        ])
        .commit();
    },
    onTail: (tailBytes, accv) => {
      rec
        .begin({
          zh: `尾部 ${tailBytes} 字节消化 → acc=${hex8(accv)}`,
          en: `Tail ${tailBytes} bytes digested → acc=${hex8(accv)}`,
        })
        .setAux([
          { label: '累计 acc', value: hex8(accv), role: 'final' as BarRole },
          { label: '尾段长度', value: String(tailBytes), role: 'pivot' as BarRole },
        ])
        .commit();
    },
    onResult: (hash) => {
      rec
        .begin({
          zh: `雪崩 avalanche（右移异或×4 + 乘 P2/P3）→ ${hex8(hash)} (${hash >>> 0})`,
          en: `Avalanche (shift-xor×4 + mul P2/P3) → ${hex8(hash)} (${hash >>> 0})`,
        })
        .setAux([
          { label: '最终 hash', value: hex8(hash), role: 'final' as BarRole },
          { label: '十进制', value: String(hash >>> 0), role: 'default' as BarRole },
          { label: '输入', value: displayInput, role: 'compare' as BarRole },
          { label: 'avalanche 校验', value: hex8(avalanche(hash)), role: 'compare' as BarRole },
        ])
        .commit();
    },
  };

  xxh32(input, seed, hooks);

  return rec.build();
}
