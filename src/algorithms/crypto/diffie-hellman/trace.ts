// DH密钥交换 · 录制帧序列：双方在公开参数下推导共享秘密。

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { diffieHellman, type DiffieHellmanHooks } from './impl.ts';

export interface DhInput {
  p: number;
  g: number;
  a: number;
  b: number;
}

export const DEFAULT_INPUT: DhInput = { p: 23, g: 5, a: 6, b: 15 };

/** 录制演示帧序列。 */
export function buildTrace(input: DhInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { p, g, a, b } = input;

  rec
    .begin({ zh: `公开参数：p=${p}, g=${g}`, en: `Public: p=${p}, g=${g}` })
    .setMap([
      { key: '素数 p', value: String(p), role: 'pivot' as BarRole },
      { key: '生成元 g', value: String(g), role: 'pivot' as BarRole },
      { key: 'Alice 私钥 a', value: String(a), role: 'compare' as BarRole },
      { key: 'Bob 私钥 b', value: String(b), role: 'compare' as BarRole },
    ])
    .commit();

  const hooks: DiffieHellmanHooks = {
    onPublic: (who, pub) => {
      rec
        .begin({
          zh: `${who} 公布公钥 = g^${who === 'Alice' ? 'a' : 'b'} mod p = ${pub}`,
          en: `${who} publishes ${who === 'Alice' ? 'A' : 'B'} = ${pub}`,
        })
        .setMap([{ key: who, value: String(pub), role: 'frontier' as BarRole }])
        .commit();
    },
    onShared: (who, shared) => {
      rec
        .begin({
          zh: `${who} 算出共享秘密 = ${shared}`,
          en: `${who} derives shared secret = ${shared}`,
        })
        .setMap([{ key: who, value: String(shared), role: 'swap' as BarRole }])
        .commit();
    },
  };

  const r = diffieHellman(p, g, a, b, hooks);

  rec
    .begin({
      zh: `完成：共享秘密 = ${r.sharedSecret}`,
      en: `Done: shared secret = ${r.sharedSecret}`,
    })
    .setMap([
      { key: 'Alice 公钥 A', value: String(r.alicePublic), role: 'default' as BarRole },
      { key: 'Bob 公钥 B', value: String(r.bobPublic), role: 'default' as BarRole },
      { key: '共享秘密 s', value: String(r.sharedSecret), role: 'final' as BarRole },
    ])
    .commit();

  return rec.build();
}
