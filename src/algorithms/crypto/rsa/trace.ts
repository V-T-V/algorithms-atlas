// =============================================================================
// RSA（玩具版）· 录制帧序列
// 用 setAux 展示密钥参数（p,q,n,φ,e,d）与加解密数值，用 setMap 展示逐字符明文/密文对照。
// =============================================================================

import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { rsa, type RsaHooks } from './impl.ts';

export interface RsaInput {
  p: number;
  q: number;
  message: number[];
}

export const DEFAULT_INPUT: RsaInput = { p: 3, q: 11, message: [4, 11, 29] };

/** 录制演示帧序列。 */
export function buildTrace(input: RsaInput = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  const { p, q, message } = input;

  let keyDisplay: Array<{ label: string; value: string; role?: BarRole }> = [];
  const cipher: number[] = [];
  const plain: number[] = [];
  let activeIdx = -1;

  const keyAux = (): Array<{ label: string; value: string; role?: BarRole }> => [
    { label: 'p', value: String(p), role: 'default' as BarRole },
    { label: 'q', value: String(q), role: 'default' as BarRole },
    ...keyDisplay,
  ];

  const snapshot = (note: { zh: string; en: string }): void => {
    // 明文/密文对照 map：未处理的位用占位
    const entries = message.map((m, i) => {
      const hasCipher = i < cipher.length;
      const hasPlain = i < plain.length;
      const role: BarRole = i === activeIdx ? 'swap' : hasPlain ? 'final' : 'default';
      return {
        key: `m${i}=${m}`,
        value: hasPlain ? `${cipher[i]!} → ${plain[i]!}` : hasCipher ? `${cipher[i]!}` : '?',
        role,
      };
    });
    rec.begin(note).setAux(keyAux()).setMap(entries).commit();
    activeIdx = -1;
  };

  rec
    .begin({
      zh: `RSA 玩具版：明文 ${JSON.stringify(message)}，素数 p=${p}, q=${q}`,
      en: `RSA toy: message ${JSON.stringify(message)}, primes p=${p}, q=${q}`,
    })
    .setAux(keyAux())
    .setMap(message.map((m, i) => ({ key: `m${i}=${m}`, value: '?', role: 'default' as BarRole })))
    .commit();

  const hooks: RsaHooks = {
    onPrimes: (pp, qq) => {
      keyDisplay = [];
      snapshot({
        zh: `选两个素数 p=${pp}, q=${qq}`,
        en: `Pick two primes p=${pp}, q=${qq}`,
      });
    },
    onModulus: (n, phi) => {
      keyDisplay = [
        { label: 'n=p·q', value: String(n), role: 'pivot' as BarRole },
        { label: 'φ=(p-1)(q-1)', value: String(phi), role: 'pivot' as BarRole },
      ];
      snapshot({
        zh: `模数 n = ${n}，欧拉函数 φ(n) = ${phi}`,
        en: `Modulus n = ${n}, Euler totient φ(n) = ${phi}`,
      });
    },
    onPublicExponent: (e) => {
      keyDisplay = [...keyDisplay, { label: 'e', value: String(e), role: 'frontier' as BarRole }];
      snapshot({
        zh: `选公钥指数 e=${e}（与 φ 互素）`,
        en: `Public exponent e=${e} (coprime to φ)`,
      });
    },
    onPrivateExponent: (d) => {
      keyDisplay = [...keyDisplay, { label: 'd', value: String(d), role: 'frontier' as BarRole }];
      snapshot({
        zh: `求私钥指数 d=${d}（满足 e·d ≡ 1 mod φ）`,
        en: `Private exponent d=${d} (e·d ≡ 1 mod φ)`,
      });
    },
    onEncrypt: (i, m, c) => {
      activeIdx = i;
      cipher[i] = c;
      snapshot({
        zh: `加密 m${i}=${m}：${m}^e mod n = ${c}`,
        en: `Encrypt m${i}=${m}: ${m}^e mod n = ${c}`,
      });
    },
    onDecrypt: (i, c, m) => {
      activeIdx = i;
      plain[i] = m;
      snapshot({
        zh: `解密 c${i}=${c}：${c}^d mod n = ${m}`,
        en: `Decrypt c${i}=${c}: ${c}^d mod n = ${m}`,
      });
    },
  };

  const result = rsa(message, p, q, hooks);

  // 终态：公钥 / 私钥 / 还原
  rec
    .begin({
      zh: `完成：公钥 (e,n)=(${result.key.e},${result.key.n})，私钥 (d,n)=(${result.key.d},${result.key.n})`,
      en: `Done: public (e,n)=(${result.key.e},${result.key.n}), private (d,n)=(${result.key.d},${result.key.n})`,
    })
    .setMap([
      {
        key: '公钥 / public key',
        value: `(${result.key.e}, ${result.key.n})`,
        role: 'final' as BarRole,
      },
      {
        key: '私钥 / private key',
        value: `(${result.key.d}, ${result.key.n})`,
        role: 'final' as BarRole,
      },
      { key: '明文 / plaintext', value: message.join(', '), role: 'default' as BarRole },
      { key: '密文 / ciphertext', value: result.cipher.join(', '), role: 'pivot' as BarRole },
      { key: '还原 / recovered', value: result.plain.join(', '), role: 'final' as BarRole },
    ])
    .commit();

  return rec.build();
}
