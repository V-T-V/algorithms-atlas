// =============================================================================
// 分馏密码（Morbit）· 纯算法实现
// 1. 字母 -> 摩尔斯电码，字母间用 '/' 分隔。
// 2. 把点(.)、划(-)、分隔(/) 视为三符号，每两个符号组成 9 种组合，映射到 '1'..'9'。
// =============================================================================
const MORSE: Record<string, string> = {
  A: '.-',
  B: '-...',
  C: '-.-.',
  D: '-..',
  E: '.',
  F: '..-.',
  G: '--.',
  H: '....',
  I: '..',
  J: '.---',
  K: '-.-',
  L: '.-..',
  M: '--',
  N: '-.',
  O: '---',
  P: '.--.',
  Q: '--.-',
  R: '.-.',
  S: '...',
  T: '-',
  U: '..-',
  V: '...-',
  W: '.--',
  X: '-..-',
  Y: '-.--',
  Z: '--..',
};
// 三符号两两组合 -> '1'..'9'
// '.', '-', '/'
const PAIR_MAP: Record<string, string> = {
  '..': '1',
  '.-': '2',
  './': '3',
  '-.': '4',
  '--': '5',
  '-/': '6',
  '/.': '7',
  '/-': '8',
  '//': '9',
};

export interface FractionationHooks {
  onMorse?: (morse: string) => void;
  onPair?: (i: number, pair: string, code: string) => void;
}

function letterToMorse(ch: string): string {
  return MORSE[ch] ?? '';
}

export function fractionationEncrypt(text: string, hooks: FractionationHooks = {}): string {
  // 1. 转摩尔斯，字母之间用 '/'
  let morse = '';
  const letters: string[] = [];
  for (let i = 0; i < text.length; i++) {
    const up = text[i]!.toUpperCase();
    if (MORSE[up]) {
      letters.push(up);
    }
  }
  morse = letters.map(letterToMorse).join('/');
  hooks.onMorse?.(morse);
  // 2. 两两配对，奇数补 '.'
  const padded = morse.length % 2 === 1 ? morse + '.' : morse;
  let out = '';
  for (let i = 0; i < padded.length; i += 2) {
    const pair = padded[i]! + padded[i + 1]!;
    const code = PAIR_MAP[pair] ?? '0';
    out += code;
    hooks.onPair?.(i, pair, code);
  }
  return out;
}
