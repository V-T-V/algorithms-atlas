// Generator for 23 misc algorithms (LeetCode-style).
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = 'D:/M_X_M/algorithms-atlas';
const CAT = 'misc';
const INDEX = `import type { Demo } from '../../../types.ts';
import { buildTrace } from './trace.ts';
export { meta } from './meta.ts';
export async function createDemo(): Promise<Demo> {
  const { meta } = await import('./meta.ts');
  return { meta, buildTrace };
}
`;

function writeAlg(id, meta, impl, trace, test) {
  const dir = join(ROOT, 'src/algorithms', CAT, id);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'meta.ts'), meta);
  writeFileSync(join(dir, 'impl.ts'), impl);
  writeFileSync(join(dir, 'trace.ts'), trace);
  writeFileSync(join(dir, 'index.ts'), INDEX);
  const testDir = join(ROOT, 'test', CAT);
  mkdirSync(testDir, { recursive: true });
  writeFileSync(join(testDir, `${id}.test.ts`), test);
}

function meta(id, zh, en, sumZh, sumEn, descZh, descEn, time, space, tags) {
  return `// ${zh} · 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: '${id}',
  categoryId: 'misc',
  title: { zh: ${JSON.stringify(zh)}, en: ${JSON.stringify(en)} },
  summary: { zh: ${JSON.stringify(sumZh)}, en: ${JSON.stringify(sumEn)} },
  description: { zh: ${JSON.stringify(descZh)}, en: ${JSON.stringify(descEn)} },
  tags: ${JSON.stringify(tags)},
  complexity: { time: '${time}', space: '${space}' },
};`;
}

// 1. count-and-say
writeAlg('misc-count-and-say',
  meta('misc-count-and-say', '外观数列', 'Count and Say',
    '逐项描述前一项数字：n=1→"1"，n=2→"11"，n=3→"21"，n=4→"1211"。', 'Describe the previous term: n=1→"1", n=2→"11", n=3→"21", n=4→"1211".',
    'LeetCode 38 外观数列：从 "1" 开始，每项是把前一项「读出来」（连续相同数字用 个数+数字 表示）。',
    'LeetCode 38 Count and Say: starting from "1", each term reads out the previous (count + digit for each run).',
    'O(L·n)', 'O(L)', ['misc', 'string', 'leetcode']),
  `// 外观数列 · 实现
export interface CountAndSayHooks {
  onIter?: (n: number, term: string) => void;
  onConclude?: (result: string) => void;
}
export function miscCountAndSay(n: number, hooks: CountAndSayHooks = {}): string {
  if (n <= 0) throw new Error('n 必须 >= 1 / n must be >= 1');
  let term = '1';
  for (let i = 1; i < n; i++) {
    let next = '';
    let j = 0;
    while (j < term.length) {
      const d = term[j]!;
      let cnt = 0;
      while (j < term.length && term[j] === d) { cnt++; j++; }
      next += String(cnt) + d;
    }
    term = next;
    hooks.onIter?.(i + 1, term);
  }
  hooks.onConclude?.(term);
  return term;
}`,
  `// 外观数列 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { miscCountAndSay } from './impl.ts';
export const DEFAULT_INPUT = 5;
export function buildTrace(n: number = DEFAULT_INPUT): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: \`外观数列 n=\${n}\`, en: \`Count and Say n=\${n}\` }).commit();
  const r = miscCountAndSay(n, {
    onIter: (i, term) => rec.begin({ zh: \`第 \${i} 项: \${term}\`, en: \`Term \${i}: \${term}\` })
      .setAux([{ label: '项', value: term, role: 'final' as BarRole }]).commit(),
  });
  rec.begin({ zh: \`结果 \${r}\`, en: \`Result \${r}\` })
    .setAux([{ label: '答案', value: r, role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { miscCountAndSay } from '../../src/algorithms/misc/misc-count-and-say/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-count-and-say/trace.ts';
test('count-and-say 前 5 项', () => {
  assert.equal(miscCountAndSay(1), '1');
  assert.equal(miscCountAndSay(2), '11');
  assert.equal(miscCountAndSay(3), '21');
  assert.equal(miscCountAndSay(4), '1211');
  assert.equal(miscCountAndSay(5), '111221');
});
test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));`,
);

// 2. zigzag
writeAlg('misc-zigzag',
  meta('misc-zigzag', 'Z 字形变换', 'Zigzag Conversion',
    '把字符串按 Z 字形写入 r 行，再按行读出。', 'Write the string in a zigzag across r rows, then read row by row.',
    'LeetCode 6 Z 字形变换：把字符串按从上到下、再斜向上的方式写入 r 行，最后按行拼接。',
    'LeetCode 6 Zigzag Conversion: write characters in a down-then-diagonal-up pattern across r rows, then concatenate rows.',
    'O(n)', 'O(n)', ['misc', 'string', 'leetcode']),
  `// Z 字形变换 · 实现
export interface ZigzagHooks {
  onRow?: (row: number, ch: string) => void;
  onConclude?: (result: string) => void;
}
export function miscZigzag(s: string, numRows: number, hooks: ZigzagHooks = {}): string {
  if (numRows <= 1 || numRows >= s.length) return s;
  const rows: string[] = new Array(numRows).fill('');
  let cur = 0;
  let goingDown = false;
  for (const ch of s) {
    rows[cur] += ch;
    hooks.onRow?.(cur, ch);
    if (cur === 0 || cur === numRows - 1) goingDown = !goingDown;
    cur += goingDown ? 1 : -1;
  }
  const result = rows.join('');
  hooks.onConclude?.(result);
  return result;
}`,
  `// Z 字形变换 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { miscZigzag } from './impl.ts';
export const DEFAULT_INPUT = { s: 'PAYPALISHIRING', numRows: 3 };
export function buildTrace(input: { s?: string; numRows?: number } = {}): Frame[] {
  const { s = DEFAULT_INPUT.s, numRows = DEFAULT_INPUT.numRows } = input;
  const rec = new TraceRecorder();
  rec.begin({ zh: \`zigzag "\${s}" r=\${numRows}\`, en: \`zigzag "\${s}" r=\${numRows}\` }).commit();
  const r = miscZigzag(s, numRows, {
    onRow: (row, ch) => rec.begin({ zh: \`写入行 \${row}: '\${ch}'\`, en: \`Row \${row}: '\${ch}'\` }).commit(),
  });
  rec.begin({ zh: \`结果 \${r}\`, en: \`Result \${r}\` })
    .setAux([{ label: '答案', value: r, role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { miscZigzag } from '../../src/algorithms/misc/misc-zigzag/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-zigzag/trace.ts';
test('zigzag PAYPALISHIRING r=3', () => {
  assert.equal(miscZigzag('PAYPALISHIRING', 3), 'PAHNAPLSIIGYIR');
});
test('zigzag r=1 原样返回', () => {
  assert.equal(miscZigzag('ABC', 1), 'ABC');
});
test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));`,
);

// 3. add-binary-2 / 4. plus-one-2 / 5. multiply-str
writeAlg('misc-add-binary-2',
  meta('misc-add-binary-2', '二进制求和', 'Add Binary',
    '两个二进制字符串相加，返回和的二进制字符串。', 'Add two binary strings and return the sum as a binary string.',
    'LeetCode 67 二进制求和：从最低位逐位相加，处理进位。',
    'LeetCode 67 Add Binary: add digit by digit from the LSB, handling carries.',
    'O(max(m,n))', 'O(max(m,n))', ['misc', 'string', 'math', 'leetcode']),
  `// 二进制求和 · 实现
export interface AddBinaryHooks {
  onDigit?: (carry: number, sum: number) => void;
  onConclude?: (result: string) => void;
}
export function miscAddBinary2(a: string, b: string, hooks: AddBinaryHooks = {}): string {
  let i = a.length - 1;
  let j = b.length - 1;
  let carry = 0;
  const out: string[] = [];
  while (i >= 0 || j >= 0 || carry > 0) {
    const da = i >= 0 ? Number(a[i]!) : 0;
    const db = j >= 0 ? Number(b[j]!) : 0;
    const sum = da + db + carry;
    hooks.onDigit?.(carry, sum);
    out.push(String(sum % 2));
    carry = Math.floor(sum / 2);
    i--;
    j--;
  }
  const result = out.reverse().join('');
  hooks.onConclude?.(result);
  return result;
}`,
  `// 二进制求和 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { miscAddBinary2 } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'a="11" b="1"', en: 'a="11" b="1"' }).commit();
  const r = miscAddBinary2('11', '1', {
    onDigit: (c, s) => rec.begin({ zh: \`进位 \${c} 本位和 \${s}\`, en: \`carry \${c} sum \${s}\` }).commit(),
  });
  rec.begin({ zh: \`结果 \${r}\`, en: \`Result \${r}\` })
    .setAux([{ label: '答案', value: r, role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { miscAddBinary2 } from '../../src/algorithms/misc/misc-add-binary-2/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-add-binary-2/trace.ts';
test('add binary 11+1=100', () => {
  assert.equal(miscAddBinary2('11', '1'), '100');
});
test('add binary 1010+1011=10101', () => {
  assert.equal(miscAddBinary2('1010', '1011'), '10101');
});
test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));`,
);

writeAlg('misc-plus-one-2',
  meta('misc-plus-one-2', '加一', 'Plus One',
    '用数组表示的非负整数加一，返回结果数组。', 'Add one to an integer represented as a digit array.',
    'LeetCode 66 加一：给定非负整数数组（每位一个元素）表示一个数，加一后返回。',
    'LeetCode 66 Plus One: given a digit array representing a non-negative integer, add one and return.',
    'O(n)', 'O(1)', ['misc', 'array', 'leetcode']),
  `// 加一 · 实现
export interface PlusOneHooks {
  onCarry?: (idx: number) => void;
  onConclude?: (result: number[]) => void;
}
export function miscPlusOne2(digits: readonly number[], hooks: PlusOneHooks = {}): number[] {
  const result = [...digits];
  for (let i = result.length - 1; i >= 0; i--) {
    if (result[i]! < 9) { result[i] = result[i]! + 1; hooks.onConclude?.(result); return result; }
    result[i] = 0;
    hooks.onCarry?.(i);
  }
  result.unshift(1);
  hooks.onConclude?.(result);
  return result;
}`,
  `// 加一 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { miscPlusOne2 } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '[9,9,9]+1', en: '[9,9,9]+1' }).commit();
  const r = miscPlusOne2([9, 9, 9], {
    onCarry: (i) => rec.begin({ zh: \`进位 @\${i}\`, en: \`Carry @\${i}\` }).commit(),
  });
  rec.begin({ zh: \`结果 [\${r.join(',')}]\`, en: \`Result [\${r.join(',')}]\` })
    .setBars(r.map(x => ({ value: x, role: 'final' as BarRole }))).commit();
  return rec.build();
}`,
  `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { miscPlusOne2 } from '../../src/algorithms/misc/misc-plus-one-2/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-plus-one-2/trace.ts';
test('plus one [1,2,3]→[1,2,4]', () => {
  assert.deepEqual(miscPlusOne2([1, 2, 3]), [1, 2, 4]);
});
test('plus one [9,9,9]→[1,0,0,0]', () => {
  assert.deepEqual(miscPlusOne2([9, 9, 9]), [1, 0, 0, 0]);
});
test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));`,
);

writeAlg('misc-multiply-str',
  meta('misc-multiply-str', '字符串相乘', 'Multiply Strings',
    '两个用字符串表示的非负整数相乘，结果也是字符串。', 'Multiply two non-negative integers given as strings, return the product as a string.',
    'LeetCode 43 字符串相乘：模拟竖式乘法，用数组累加部分积。',
    'LeetCode 43 Multiply Strings: simulate long multiplication, accumulating partial products in an array.',
    'O(m·n)', 'O(m+n)', ['misc', 'string', 'math', 'leetcode']),
  `// 字符串相乘 · 实现
export interface MultiplyStrHooks {
  onPartial?: (i: number, j: number, prod: number) => void;
  onConclude?: (result: string) => void;
}
export function miscMultiplyStr(num1: string, num2: string, hooks: MultiplyStrHooks = {}): string {
  if (num1 === '0' || num2 === '0') return '0';
  const m = num1.length;
  const n = num2.length;
  const pos: number[] = new Array(m + n).fill(0);
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      const prod = Number(num1[i]!) * Number(num2[j]!) + pos[i + j + 1]!;
      hooks.onPartial?.(i, j, prod);
      pos[i + j + 1] = prod % 10;
      pos[i + j]! += Math.floor(prod / 10);
    }
  }
  let result = pos.join('').replace(/^0+/, '');
  if (result === '') result = '0';
  hooks.onConclude?.(result);
  return result;
}`,
  `// 字符串相乘 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { miscMultiplyStr } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '"123"×"456"', en: '"123"×"456"' }).commit();
  const r = miscMultiplyStr('123', '456');
  rec.begin({ zh: \`结果 \${r}\`, en: \`Result \${r}\` })
    .setAux([{ label: '答案', value: r, role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { miscMultiplyStr } from '../../src/algorithms/misc/misc-multiply-str/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-multiply-str/trace.ts';
test('multiply "123"×"456"="56088"', () => {
  assert.equal(miscMultiplyStr('123', '456'), '56088');
});
test('multiply 含 0', () => {
  assert.equal(miscMultiplyStr('0', '123'), '0');
});
test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));`,
);

// 6. length-last-word-2 / 7. valid-palindrome-phr / 8. valid-number
writeAlg('misc-length-last-word-2',
  meta('misc-length-last-word-2', '最后一个单词长度', 'Length of Last Word',
    '从后向前跳过空格，找最后一个单词的长度。', 'Skip trailing spaces from the end, then count the last word length.',
    'LeetCode 58 最后一个单词的长度：句子由空格分隔单词，返回最后一个单词长度。',
    'LeetCode 58 Length of Last Word: a sentence split by spaces; return the last word length.',
    'O(n)', 'O(1)', ['misc', 'string', 'leetcode']),
  `// 最后一个单词长度 · 实现
export interface LastWordHooks {
  onConclude?: (length: number) => void;
}
export function miscLengthLastWord2(s: string, hooks: LastWordHooks = {}): number {
  let i = s.length - 1;
  while (i >= 0 && s[i] === ' ') i--;
  let len = 0;
  while (i >= 0 && s[i] !== ' ') { len++; i--; }
  hooks.onConclude?.(len);
  return len;
}`,
  `// 最后一个单词长度 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { miscLengthLastWord2 } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 's="Hello World"', en: 's="Hello World"' }).commit();
  const r = miscLengthLastWord2('Hello World');
  rec.begin({ zh: \`长度 \${r}\`, en: \`Length \${r}\` })
    .setAux([{ label: '答案', value: String(r), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { miscLengthLastWord2 } from '../../src/algorithms/misc/misc-length-last-word-2/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-length-last-word-2/trace.ts';
test('last word "Hello World"=5', () => {
  assert.equal(miscLengthLastWord2('Hello World'), 5);
});
test('last word 含尾空格', () => {
  assert.equal(miscLengthLastWord2('   fly me   to   the moon  '), 4);
});
test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));`,
);

writeAlg('misc-valid-palindrome-phr',
  meta('misc-valid-palindrome-phr', '验证回文短语', 'Valid Palindrome (Phrase)',
    '只考虑字母数字、忽略大小写，判断短语是否回文。', 'Consider only alphanumeric, ignore case; check if the phrase is a palindrome.',
    'LeetCode 125 验证回文串：过滤非字母数字、转小写后判断是否左右对称。',
    'LeetCode 125 Valid Palindrome: filter non-alphanumeric, lowercase, then check symmetry.',
    'O(n)', 'O(1)', ['misc', 'string', 'two-pointers', 'leetcode']),
  `// 验证回文短语 · 实现
export interface PalindromeHooks {
  onCompare?: (i: number, j: number, equal: boolean) => void;
  onConclude?: (isPalindrome: boolean) => void;
}
export function miscValidPalindromePhr(s: string, hooks: PalindromeHooks = {}): boolean {
  let i = 0;
  let j = s.length - 1;
  const isAlnum = (c: string) => /[a-z0-9]/i.test(c);
  while (i < j) {
    while (i < j && !isAlnum(s[i]!)) i++;
    while (i < j && !isAlnum(s[j]!)) j--;
    if (s[i]!.toLowerCase() !== s[j]!.toLowerCase()) {
      hooks.onCompare?.(i, j, false);
      hooks.onConclude?.(false);
      return false;
    }
    hooks.onCompare?.(i, j, true);
    i++;
    j--;
  }
  hooks.onConclude?.(true);
  return true;
}`,
  `// 验证回文短语 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { miscValidPalindromePhr } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 's="A man, a plan, a canal: Panama"', en: 's="A man, a plan, a canal: Panama"' }).commit();
  const r = miscValidPalindromePhr('A man, a plan, a canal: Panama');
  rec.begin({ zh: \`回文 \${r}\`, en: \`Palindrome \${r}\` })
    .setAux([{ label: '答案', value: String(r), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { miscValidPalindromePhr } from '../../src/algorithms/misc/misc-valid-palindrome-phr/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-valid-palindrome-phr/trace.ts';
test('回文 "A man, a plan, a canal: Panama"=true', () => {
  assert.equal(miscValidPalindromePhr('A man, a plan, a canal: Panama'), true);
});
test('非回文 "race a car"=false', () => {
  assert.equal(miscValidPalindromePhr('race a car'), false);
});
test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));`,
);

writeAlg('misc-valid-number',
  meta('misc-valid-number', '有效数字', 'Valid Number',
    '用有限状态机判定字符串是否是合法十进制数（含指数、小数、符号）。', 'Use a finite-state machine to check if a string is a valid decimal number (with exponent, fraction, sign).',
    'LeetCode 65 有效数字：判定字符串能否解析为数值（含 ±、小数点、e/E、前后空格）。',
    'LeetCode 65 Valid Number: determine whether a string can be parsed as a number (signs, decimal, exponent, surrounding spaces).',
    'O(n)', 'O(1)', ['misc', 'string', 'fsm', 'leetcode']),
  `// 有效数字 · 实现（确定性有限自动机）
export interface ValidNumberHooks {
  onState?: (i: number, state: string) => void;
  onConclude?: (valid: boolean) => void;
}
const TRANS: Record<string, Record<string, string>> = {
  start: { digit: 'int', sign: 'sign', dot: 'dot', space: 'start' },
  sign: { digit: 'int', dot: 'dot' },
  int: { digit: 'int', dot: 'frac', e: 'e', space: 'end' },
  dot: { digit: 'frac' },
  frac: { digit: 'frac', e: 'e', space: 'end' },
  e: { digit: 'exp', sign: 'esign' },
  esign: { digit: 'exp' },
  exp: { digit: 'exp', space: 'end' },
  end: { space: 'end' },
};
const ACCEPT = new Set(['int', 'frac', 'exp', 'end']);
export function miscValidNumber(s: string, hooks: ValidNumberHooks = {}): boolean {
  let state = 'start';
  for (let i = 0; i < s.length; i++) {
    const c = s[i]!;
    let cls: string;
    if (c >= '0' && c <= '9') cls = 'digit';
    else if (c === '+' || c === '-') cls = 'sign';
    else if (c === '.') cls = 'dot';
    else if (c === 'e' || c === 'E') cls = 'e';
    else if (c === ' ') cls = 'space';
    else { hooks.onConclude?.(false); return false; }
    // 在 e 状态下需要 'esign' 而非 'sign'
    if (state === 'e' && cls === 'sign') cls = 'esign';
    const next = TRANS[state]?.[cls];
    hooks.onState?.(i, state);
    if (!next) { hooks.onConclude?.(false); return false; }
    state = next;
  }
  const valid = ACCEPT.has(state);
  hooks.onConclude?.(valid);
  return valid;
}`,
  `// 有效数字 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { miscValidNumber } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 's=" -1.23e+4 "', en: 's=" -1.23e+4 "' }).commit();
  const r = miscValidNumber(' -1.23e+4 ', {
    onState: (i, st) => rec.begin({ zh: \`i=\${i} state=\${st}\`, en: \`i=\${i} state=\${st}\` }).commit(),
  });
  rec.begin({ zh: \`有效 \${r}\`, en: \`Valid \${r}\` })
    .setAux([{ label: '答案', value: String(r), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { miscValidNumber } from '../../src/algorithms/misc/misc-valid-number/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-valid-number/trace.ts';
test('valid "0"=true', () => { assert.equal(miscValidNumber('0'), true); });
test('valid " 0.1 "=true', () => { assert.equal(miscValidNumber(' 0.1 '), true); });
test('valid "abc"=false', () => { assert.equal(miscValidNumber('abc'), false); });
test('valid "1 a"=false', () => { assert.equal(miscValidNumber('1 a'), false); });
test('valid "2e10"=true', () => { assert.equal(miscValidNumber('2e10'), true); });
test('valid " -1.23e+4 "=true', () => { assert.equal(miscValidNumber(' -1.23e+4 '), true); });
test('valid "e3"=false', () => { assert.equal(miscValidNumber('e3'), false); });
test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));`,
);

// 9. string-atoi / 10. simplify-path / 11. compare-version
writeAlg('misc-string-atoi',
  meta('misc-string-atoi', '字符串转换整数 (atoi)', 'String to Integer (atoi)',
    '按规则把字符串转为 32 位有符号整数：跳过空格、读符号、读数字、截断到范围。', 'Convert a string to a 32-bit signed int per rules: skip spaces, read sign, read digits, clamp to range.',
    'LeetCode 8 字符串转换整数 (atoi)：跳过前导空格，可选符号，连续数字部分解析为整数，超出 [−2^31, 2^31−1] 时截断。',
    'LeetCode 8 String to Integer (atoi): skip leading spaces, optional sign, then consecutive digits; clamp to [−2^31, 2^31−1].',
    'O(n)', 'O(1)', ['misc', 'string', 'math', 'leetcode']),
  `// atoi · 实现
const INT_MIN = -2147483648;
const INT_MAX = 2147483647;
export interface AtoiHooks {
  onDigit?: (i: number, digit: number, acc: number) => void;
  onConclude?: (result: number) => void;
}
export function miscStringAtoi(s: string, hooks: AtoiHooks = {}): number {
  let i = 0;
  while (i < s.length && s[i] === ' ') i++;
  let sign = 1;
  if (i < s.length && (s[i] === '+' || s[i] === '-')) {
    sign = s[i] === '-' ? -1 : 1;
    i++;
  }
  let acc = 0;
  while (i < s.length && s[i]! >= '0' && s[i]! <= '9') {
    const d = Number(s[i]!);
    acc = acc * 10 + d;
    hooks.onDigit?.(i, d, acc);
    if (sign * acc > INT_MAX) { hooks.onConclude?.(INT_MAX); return INT_MAX; }
    if (sign * acc < INT_MIN) { hooks.onConclude?.(INT_MIN); return INT_MIN; }
    i++;
  }
  const result = sign * acc;
  hooks.onConclude?.(result);
  return result;
}`,
  `// atoi · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { miscStringAtoi } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 's="   -42"', en: 's="   -42"' }).commit();
  const r = miscStringAtoi('   -42', {
    onDigit: (i, d, acc) => rec.begin({ zh: \`i=\${i} d=\${d} acc=\${acc}\`, en: \`i=\${i} d=\${d} acc=\${acc}\` }).commit(),
  });
  rec.begin({ zh: \`结果 \${r}\`, en: \`Result \${r}\` })
    .setAux([{ label: '答案', value: String(r), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { miscStringAtoi } from '../../src/algorithms/misc/misc-string-atoi/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-string-atoi/trace.ts';
test('atoi "42"=42', () => { assert.equal(miscStringAtoi('42'), 42); });
test('atoi "   -42"=-42', () => { assert.equal(miscStringAtoi('   -42'), -42); });
test('atoi "4193 with words"=4193', () => { assert.equal(miscStringAtoi('4193 with words'), 4193); });
test('atoi 溢出截断', () => { assert.equal(miscStringAtoi('-91283472332'), -2147483648); });
test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));`,
);

writeAlg('misc-simplify-path',
  meta('misc-simplify-path', '简化路径', 'Simplify Path',
    '把 Unix 风格的绝对路径简化为规范形式（处理 . .. //）。', 'Simplify a Unix-style absolute path to canonical form (handles . .. //).',
    'LeetCode 71 简化路径：把含 ".", "..", "//" 的绝对路径化为最简规范路径。',
    'LeetCode 71 Simplify Path: reduce an absolute path containing ".", "..", "//" to its canonical form.',
    'O(n)', 'O(n)', ['misc', 'string', 'stack', 'leetcode']),
  `// 简化路径 · 实现
export interface SimplifyPathHooks {
  onToken?: (token: string) => void;
  onConclude?: (result: string) => void;
}
export function miscSimplifyPath(path: string, hooks: SimplifyPathHooks = {}): string {
  const stack: string[] = [];
  const parts = path.split('/');
  for (const p of parts) {
    hooks.onToken?.(p);
    if (p === '' || p === '.') continue;
    if (p === '..') stack.pop();
    else stack.push(p);
  }
  const result = '/' + stack.join('/');
  hooks.onConclude?.(result);
  return result;
}`,
  `// 简化路径 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { miscSimplifyPath } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'path="/home//foo/"', en: 'path="/home//foo/"' }).commit();
  const r = miscSimplifyPath('/home//foo/', {
    onToken: (t) => rec.begin({ zh: \`token '\${t}'\`, en: \`token '\${t}'\` }).commit(),
  });
  rec.begin({ zh: \`结果 \${r}\`, en: \`Result \${r}\` })
    .setAux([{ label: '答案', value: r, role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { miscSimplifyPath } from '../../src/algorithms/misc/misc-simplify-path/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-simplify-path/trace.ts';
test('simplify "/home//foo/"="/home/foo"', () => {
  assert.equal(miscSimplifyPath('/home//foo/'), '/home/foo');
});
test('simplify "/a/./b/../../c/"="/c"', () => {
  assert.equal(miscSimplifyPath('/a/./b/../../c/'), '/c');
});
test('simplify "/../"="/"', () => {
  assert.equal(miscSimplifyPath('/../'), '/');
});
test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));`,
);

writeAlg('misc-compare-version',
  meta('misc-compare-version', '比较版本号', 'Compare Version Numbers',
    '按点分修订号逐段数值比较两个版本字符串。', 'Compare two version strings segment by segment as numeric revision numbers.',
    'LeetCode 165 比较版本号：version 由点分修订号组成，按数值比较每段，缺省补 0。',
    'LeetCode 165 Compare Version Numbers: versions are dot-separated revision numbers; compare each segment numerically, defaulting missing to 0.',
    'O(n+m)', 'O(n+m)', ['misc', 'string', 'leetcode']),
  `// 比较版本号 · 实现
export interface CompareVersionHooks {
  onSegment?: (i: number, a: number, b: number, cmp: number) => void;
  onConclude?: (cmp: number) => void;
}
export function miscCompareVersion(v1: string, v2: string, hooks: CompareVersionHooks = {}): number {
  const a = v1.split('.').map(Number);
  const b = v2.split('.').map(Number);
  const len = Math.max(a.length, b.length);
  for (let i = 0; i < len; i++) {
    const x = a[i] ?? 0;
    const y = b[i] ?? 0;
    const cmp = x < y ? -1 : x > y ? 1 : 0;
    hooks.onSegment?.(i, x, y, cmp);
    if (cmp !== 0) { hooks.onConclude?.(cmp); return cmp; }
  }
  hooks.onConclude?.(0);
  return 0;
}`,
  `// 比较版本号 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { miscCompareVersion } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: '"1.01" vs "1.001"', en: '"1.01" vs "1.001"' }).commit();
  const r = miscCompareVersion('1.01', '1.001', {
    onSegment: (i, x, y, c) => rec.begin({ zh: \`段\${i}: \${x} vs \${y} cmp=\${c}\`, en: \`Seg\${i}: \${x} vs \${y}\` }).commit(),
  });
  rec.begin({ zh: \`cmp=\${r}\`, en: \`cmp=\${r}\` })
    .setAux([{ label: '答案', value: String(r), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { miscCompareVersion } from '../../src/algorithms/misc/misc-compare-version/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-compare-version/trace.ts';
test('compare "1.01"="1.001" → 0', () => { assert.equal(miscCompareVersion('1.01', '1.001'), 0); });
test('compare "1.0"="1.0.0" → 0', () => { assert.equal(miscCompareVersion('1.0', '1.0.0'), 0); });
test('compare "0.1"<"1.1" → -1', () => { assert.equal(miscCompareVersion('0.1', '1.1'), -1); });
test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));`,
);

// 12. excel-col-title-2 / 13. excel-col-num
writeAlg('misc-excel-col-title-2',
  meta('misc-excel-col-title-2', 'Excel 表列名', 'Excel Sheet Column Title',
    '把列号转为 Excel 表列名（1→A, 28→AB）。', 'Convert a column number to Excel title (1→A, 28→AB).',
    'LeetCode 168 Excel 表列名称：把 1-based 数字转为 A-Z 二十六进制字符串。',
    'LeetCode 168 Excel Sheet Column Title: convert a 1-based number to a base-26 string over A-Z.',
    'O(log n)', 'O(log n)', ['misc', 'math', 'string', 'leetcode']),
  `// Excel 列名 · 实现
export interface ExcelTitleHooks {
  onDigit?: (ch: string) => void;
  onConclude?: (title: string) => void;
}
export function miscExcelColTitle2(n: number, hooks: ExcelTitleHooks = {}): string {
  let cur = n;
  const out: string[] = [];
  while (cur > 0) {
    cur--;
    const ch = String.fromCharCode(65 + (cur % 26));
    hooks.onDigit?.(ch);
    out.push(ch);
    cur = Math.floor(cur / 26);
  }
  const title = out.reverse().join('');
  hooks.onConclude?.(title);
  return title;
}`,
  `// Excel 列名 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { miscExcelColTitle2 } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'n=28', en: 'n=28' }).commit();
  const r = miscExcelColTitle2(28);
  rec.begin({ zh: \`结果 \${r}\`, en: \`Result \${r}\` })
    .setAux([{ label: '答案', value: r, role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { miscExcelColTitle2 } from '../../src/algorithms/misc/misc-excel-col-title-2/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-excel-col-title-2/trace.ts';
test('excel title 1→A', () => { assert.equal(miscExcelColTitle2(1), 'A'); });
test('excel title 28→AB', () => { assert.equal(miscExcelColTitle2(28), 'AB'); });
test('excel title 701→ZY', () => { assert.equal(miscExcelColTitle2(701), 'ZY'); });
test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));`,
);

writeAlg('misc-excel-col-num',
  meta('misc-excel-col-num', 'Excel 表列号', 'Excel Sheet Column Number',
    '把 Excel 列名转为列号（A→1, AB→28）。', 'Convert an Excel column title to its number (A→1, AB→28).',
    'LeetCode 171 Excel 表列序号：把 A-Z 二十六进制字符串转为 1-based 数字。',
    'LeetCode 171 Excel Sheet Column Number: convert a base-26 A-Z string to its 1-based number.',
    'O(n)', 'O(1)', ['misc', 'math', 'string', 'leetcode']),
  `// Excel 列号 · 实现
export interface ExcelNumHooks {
  onChar?: (ch: string, acc: number) => void;
  onConclude?: (num: number) => void;
}
export function miscExcelColNum(title: string, hooks: ExcelNumHooks = {}): number {
  let acc = 0;
  for (const ch of title) {
    acc = acc * 26 + (ch.charCodeAt(0) - 64);
    hooks.onChar?.(ch, acc);
  }
  hooks.onConclude?.(acc);
  return acc;
}`,
  `// Excel 列号 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { miscExcelColNum } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'title="AB"', en: 'title="AB"' }).commit();
  const r = miscExcelColNum('AB', {
    onChar: (ch, acc) => rec.begin({ zh: \`\${ch} → \${acc}\`, en: \`\${ch} → \${acc}\` }).commit(),
  });
  rec.begin({ zh: \`结果 \${r}\`, en: \`Result \${r}\` })
    .setAux([{ label: '答案', value: String(r), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { miscExcelColNum } from '../../src/algorithms/misc/misc-excel-col-num/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-excel-col-num/trace.ts';
test('excel num "A"=1', () => { assert.equal(miscExcelColNum('A'), 1); });
test('excel num "AB"=28', () => { assert.equal(miscExcelColNum('AB'), 28); });
test('excel num "ZY"=701', () => { assert.equal(miscExcelColNum('ZY'), 701); });
test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));`,
);

// 14. factorial-trail-2 / 15. trailing-zero / 16. happy-2
writeAlg('misc-factorial-trail-2',
  meta('misc-factorial-trail-2', '阶乘末尾零（朴素）', 'Factorial Trailing Zeros (Naive)',
    '直接数 n! 字符串末尾有多少个 0（小规模教学）。', 'Directly count trailing zeros in n! as a string (small-scale teaching).',
    '朴素方法：算出 n!（用 BigInt），转字符串数末尾 0。仅适合小 n。',
    'Naive method: compute n! (via BigInt), count trailing 0s in the string. Only for small n.',
    'O(n²)', 'O(n)', ['misc', 'math', 'bigint']),
  `// 阶乘末尾零（朴素）· 实现
export interface FactorialTrailHooks {
  onIter?: (i: number, factorial: bigint) => void;
  onConclude?: (zeros: number) => void;
}
export function miscFactorialTrail2(n: number, hooks: FactorialTrailHooks = {}): number {
  if (n < 0) throw new Error('n 必须 >= 0 / n must be >= 0');
  let f = 1n;
  for (let i = 2; i <= n; i++) { f *= BigInt(i); hooks.onIter?.(i, f); }
  const s = f.toString();
  let zeros = 0;
  for (let i = s.length - 1; i >= 0; i--) {
    if (s[i] !== '0') break;
    zeros++;
  }
  hooks.onConclude?.(zeros);
  return zeros;
}`,
  `// 阶乘末尾零 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { miscFactorialTrail2 } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'n=10', en: 'n=10' }).commit();
  const r = miscFactorialTrail2(10, {
    onIter: (i) => rec.begin({ zh: \`\${i}!\`, en: \`\${i}!\` }).commit(),
  });
  rec.begin({ zh: \`\${r} 个 0\`, en: \`\${r} zeros\` })
    .setAux([{ label: '答案', value: String(r), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { miscFactorialTrail2 } from '../../src/algorithms/misc/misc-factorial-trail-2/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-factorial-trail-2/trace.ts';
test('10! 末尾 2 个 0', () => { assert.equal(miscFactorialTrail2(10), 2); });
test('25! 末尾 6 个 0', () => { assert.equal(miscFactorialTrail2(25), 6); });
test('0! 末尾 0', () => { assert.equal(miscFactorialTrail2(0), 0); });
test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));`,
);

writeAlg('misc-trailing-zero',
  meta('misc-trailing-zero', '阶乘末尾零（数学）', 'Trailing Zeroes (Math)',
    'n! 末尾 0 数 = ⌊n/5⌋+⌊n/25⌋+...，O(log n)。', 'Number of trailing zeros in n! = sum ⌊n/5⌋+⌊n/25⌋+..., O(log n).',
    'LeetCode 172 阶乘后的零：不计算 n!，直接统计 5 的因子个数。',
    'LeetCode 172 Factorial Trailing Zeroes: count factors of 5 without computing n!.',
    'O(log n)', 'O(1)', ['misc', 'math', 'leetcode']),
  `// 阶乘末尾零（数学）· 实现
export interface TrailingZeroHooks {
  onStep?: (divisor: number, contribution: number) => void;
  onConclude?: (zeros: number) => void;
}
export function miscTrailingZero(n: number, hooks: TrailingZeroHooks = {}): number {
  let zeros = 0;
  let divisor = 5;
  while (divisor <= n) {
    const contrib = Math.floor(n / divisor);
    zeros += contrib;
    hooks.onStep?.(divisor, contrib);
    divisor *= 5;
  }
  hooks.onConclude?.(zeros);
  return zeros;
}`,
  `// 阶乘末尾零（数学）· 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { miscTrailingZero } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'n=25', en: 'n=25' }).commit();
  const r = miscTrailingZero(25, {
    onStep: (d, c) => rec.begin({ zh: \`⌊25/\${d}⌋=\${c}\`, en: \`⌊25/\${d}⌋=\${c}\` }).commit(),
  });
  rec.begin({ zh: \`\${r} 个 0\`, en: \`\${r} zeros\` })
    .setAux([{ label: '答案', value: String(r), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { miscTrailingZero } from '../../src/algorithms/misc/misc-trailing-zero/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-trailing-zero/trace.ts';
test('trailingZero 3=0', () => { assert.equal(miscTrailingZero(3), 0); });
test('trailingZero 5=1', () => { assert.equal(miscTrailingZero(5), 1); });
test('trailingZero 25=6', () => { assert.equal(miscTrailingZero(25), 6); });
test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));`,
);

writeAlg('misc-happy-2',
  meta('misc-happy-2', '快乐数', 'Happy Number',
    '反复把 n 替换为各位平方和，最终为 1 是快乐数，否则进入循环。', 'Replace n with the sum of squared digits repeatedly; reaches 1 = happy, else loops.',
    'LeetCode 202 快乐数：用快慢指针检测是否最终到 1，避免无穷循环。',
    'LeetCode 202 Happy Number: use fast/slow pointers to detect whether n reaches 1 without infinite loop.',
    'O(log n)', 'O(1)', ['misc', 'math', 'two-pointers', 'leetcode']),
  `// 快乐数 · 实现
function sqSum(n: number): number {
  let s = 0;
  while (n > 0) { const d = n % 10; s += d * d; n = Math.floor(n / 10); }
  return s;
}
export interface HappyHooks {
  onStep?: (n: number) => void;
  onConclude?: (happy: boolean) => void;
}
export function miscHappy2(n: number, hooks: HappyHooks = {}): boolean {
  let slow = n;
  let fast = sqSum(n);
  while (fast !== 1 && slow !== fast) {
    hooks.onStep?.(slow);
    slow = sqSum(slow);
    fast = sqSum(sqSum(fast));
  }
  const happy = fast === 1;
  hooks.onConclude?.(happy);
  return happy;
}`,
  `// 快乐数 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { miscHappy2 } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'n=19', en: 'n=19' }).commit();
  const r = miscHappy2(19, {
    onStep: (n) => rec.begin({ zh: \`→ \${n}\`, en: \`→ \${n}\` }).commit(),
  });
  rec.begin({ zh: \`happy=\${r}\`, en: \`happy=\${r}\` })
    .setAux([{ label: '答案', value: String(r), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { miscHappy2 } from '../../src/algorithms/misc/misc-happy-2/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-happy-2/trace.ts';
test('19 是快乐数', () => { assert.equal(miscHappy2(19), true); });
test('2 不是快乐数', () => { assert.equal(miscHappy2(2), false); });
test('1 是快乐数', () => { assert.equal(miscHappy2(1), true); });
test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));`,
);

// 17. ugly-2 / 18. nth-ugly-2 / 19. count-prime-2
writeAlg('misc-ugly-2',
  meta('misc-ugly-2', '丑数', 'Ugly Number',
    '丑数是只含质因子 2、3、5 的正整数；判断 n 是否丑数。', 'An ugly number has only prime factors 2, 3, 5; check whether n is ugly.',
    'LeetCode 263 丑数：反复除尽 2、3、5，看最终是否为 1。',
    'LeetCode 263 Ugly Number: divide out 2, 3, 5; check if the remainder is 1.',
    'O(log n)', 'O(1)', ['misc', 'math', 'leetcode']),
  `// 丑数 · 实现
export interface UglyHooks {
  onDivide?: (factor: number, cur: number) => void;
  onConclude?: (ugly: boolean) => void;
}
export function miscUgly2(n: number, hooks: UglyHooks = {}): boolean {
  if (n <= 0) return false;
  let cur = n;
  for (const f of [2, 3, 5]) {
    while (cur % f === 0) { cur /= f; hooks.onDivide?.(f, cur); }
  }
  const ugly = cur === 1;
  hooks.onConclude?.(ugly);
  return ugly;
}`,
  `// 丑数 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { miscUgly2 } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'n=6', en: 'n=6' }).commit();
  const r = miscUgly2(6, {
    onDivide: (f, cur) => rec.begin({ zh: \`÷\${f} → \${cur}\`, en: \`÷\${f} → \${cur}\` }).commit(),
  });
  rec.begin({ zh: \`ugly=\${r}\`, en: \`ugly=\${r}\` })
    .setAux([{ label: '答案', value: String(r), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { miscUgly2 } from '../../src/algorithms/misc/misc-ugly-2/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-ugly-2/trace.ts';
test('6 是丑数', () => { assert.equal(miscUgly2(6), true); });
test('14 不是丑数', () => { assert.equal(miscUgly2(14), false); });
test('1 是丑数', () => { assert.equal(miscUgly2(1), true); });
test('非正数非丑', () => { assert.equal(miscUgly2(-6), false); });
test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));`,
);

writeAlg('misc-nth-ugly-2',
  meta('misc-nth-ugly-2', '第 N 个丑数', 'Nth Ugly Number',
    '三指针法生成丑数序列，求第 n 个。', 'Three-pointer method to generate ugly numbers in order; return the n-th.',
    'LeetCode 264 丑数 II：用三指针分别对应 ×2/×3/×5，每次取最小，O(n)。',
    'LeetCode 264 Ugly Number II: three pointers for ×2/×3/×5; pick the min each step, O(n).',
    'O(n)', 'O(n)', ['misc', 'math', 'dp', 'leetcode']),
  `// 第 N 个丑数 · 实现
export interface NthUglyHooks {
  onStep?: (i: number, value: number) => void;
  onConclude?: (value: number) => void;
}
export function miscNthUgly2(n: number, hooks: NthUglyHooks = {}): number {
  if (n <= 0) throw new Error('n 必须 >= 1 / n must be >= 1');
  const ugly: number[] = new Array(n).fill(0);
  ugly[0] = 1;
  let i2 = 0;
  let i3 = 0;
  let i5 = 0;
  for (let i = 1; i < n; i++) {
    const next = Math.min(ugly[i2]! * 2, ugly[i3]! * 3, ugly[i5]! * 5);
    ugly[i] = next;
    if (next === ugly[i2]! * 2) i2++;
    if (next === ugly[i3]! * 3) i3++;
    if (next === ugly[i5]! * 5) i5++;
    hooks.onStep?.(i, next);
  }
  const value = ugly[n - 1]!;
  hooks.onConclude?.(value);
  return value;
}`,
  `// 第 N 个丑数 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { miscNthUgly2 } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'n=10', en: 'n=10' }).commit();
  const r = miscNthUgly2(10, {
    onStep: (i, v) => rec.begin({ zh: \`\${i}: \${v}\`, en: \`\${i}: \${v}\` }).commit(),
  });
  rec.begin({ zh: \`结果 \${r}\`, en: \`Result \${r}\` })
    .setAux([{ label: '答案', value: String(r), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { miscNthUgly2 } from '../../src/algorithms/misc/misc-nth-ugly-2/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-nth-ugly-2/trace.ts';
test('第 10 个丑数 = 12', () => { assert.equal(miscNthUgly2(10), 12); });
test('第 1 个丑数 = 1', () => { assert.equal(miscNthUgly2(1), 1); });
test('第 11 个 = 15', () => { assert.equal(miscNthUgly2(11), 15); });
test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));`,
);

writeAlg('misc-count-prime-2',
  meta('misc-count-prime-2', '计数质数', 'Count Primes',
    '埃氏筛统计小于 n 的质数个数。', 'Sieve of Eratosthenes to count primes less than n.',
    'LeetCode 204 计数质数：用埃拉托斯特尼筛法统计 < n 的质数数量。',
    'LeetCode 204 Count Primes: sieve of Eratosthenes to count primes below n.',
    'O(n log log n)', 'O(n)', ['misc', 'math', 'sieve', 'leetcode']),
  `// 计数质数 · 实现
export interface CountPrimeHooks {
  onMark?: (p: number) => void;
  onConclude?: (count: number) => void;
}
export function miscCountPrime2(n: number, hooks: CountPrimeHooks = {}): number {
  if (n <= 2) return 0;
  const isPrime: boolean[] = new Array(n).fill(true);
  isPrime[0] = false;
  isPrime[1] = false;
  for (let p = 2; p * p < n; p++) {
    if (isPrime[p]) {
      hooks.onMark?.(p);
      for (let k = p * p; k < n; k += p) isPrime[k] = false;
    }
  }
  let count = 0;
  for (let i = 2; i < n; i++) if (isPrime[i]) count++;
  hooks.onConclude?.(count);
  return count;
}`,
  `// 计数质数 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { miscCountPrime2 } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'n=10', en: 'n=10' }).commit();
  const r = miscCountPrime2(10, {
    onMark: (p) => rec.begin({ zh: \`筛 \${p}\`, en: \`Sieve \${p}\` }).commit(),
  });
  rec.begin({ zh: \`\${r} 个质数\`, en: \`\${r} primes\` })
    .setAux([{ label: '答案', value: String(r), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { miscCountPrime2 } from '../../src/algorithms/misc/misc-count-prime-2/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-count-prime-2/trace.ts';
test('countPrime 10 = 4', () => { assert.equal(miscCountPrime2(10), 4); });
test('countPrime 0 = 0', () => { assert.equal(miscCountPrime2(0), 0); });
test('countPrime 1 = 0', () => { assert.equal(miscCountPrime2(1), 0); });
test('countPrime 100 = 25', () => { assert.equal(miscCountPrime2(100), 25); });
test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));`,
);

// 20. is-perfect-square / 21. arrange-coin-2 / 22. bulb-2 / 23. power-of-3
writeAlg('misc-is-perfect-square',
  meta('misc-is-perfect-square', '完全平方数判定', 'Valid Perfect Square',
    '用二分/牛顿法判定 num 是否是完全平方数（不用 sqrt）。', 'Use binary search / Newton method to check if num is a perfect square (no sqrt).',
    'LeetCode 367 有效的完全平方数：二分查找 1..num 中是否有 x 满足 x*x=num。',
    'LeetCode 367 Valid Perfect Square: binary search in 1..num for an x with x*x=num.',
    'O(log n)', 'O(1)', ['misc', 'math', 'binary-search', 'leetcode']),
  `// 完全平方数判定 · 实现
export interface PerfectSquareHooks {
  onProbe?: (mid: number, sq: number) => void;
  onConclude?: (isPerfect: boolean) => void;
}
export function miscIsPerfectSquare(num: number, hooks: PerfectSquareHooks = {}): boolean {
  if (num < 1) return false;
  let lo = 1;
  let hi = num;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    const sq = mid * mid;
    hooks.onProbe?.(mid, sq);
    if (sq === num) { hooks.onConclude?.(true); return true; }
    if (sq < num) lo = mid + 1;
    else hi = mid - 1;
  }
  hooks.onConclude?.(false);
  return false;
}`,
  `// 完全平方数判定 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { miscIsPerfectSquare } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'num=16', en: 'num=16' }).commit();
  const r = miscIsPerfectSquare(16, {
    onProbe: (m, sq) => rec.begin({ zh: \`mid=\${m} sq=\${sq}\`, en: \`mid=\${m} sq=\${sq}\` }).commit(),
  });
  rec.begin({ zh: \`结果 \${r}\`, en: \`Result \${r}\` })
    .setAux([{ label: '答案', value: String(r), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { miscIsPerfectSquare } from '../../src/algorithms/misc/misc-is-perfect-square/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-is-perfect-square/trace.ts';
test('16 是完全平方', () => { assert.equal(miscIsPerfectSquare(16), true); });
test('14 不是完全平方', () => { assert.equal(miscIsPerfectSquare(14), false); });
test('1 是完全平方', () => { assert.equal(miscIsPerfectSquare(1), true); });
test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));`,
);

writeAlg('misc-arrange-coin-2',
  meta('misc-arrange-coin-2', '排列硬币', 'Arranging Coins',
    '搭 k 行阶梯共用 k(k+1)/2 枚硬币；求 n 枚最多能搭几完整行。', 'A k-row staircase uses k(k+1)/2 coins; find the max complete rows for n coins.',
    'LeetCode 441 排列硬币：求最大 k 使 k(k+1)/2 ≤ n，二分 O(log n)。',
    'LeetCode 441 Arranging Coins: find max k with k(k+1)/2 ≤ n, binary search O(log n).',
    'O(log n)', 'O(1)', ['misc', 'math', 'binary-search', 'leetcode']),
  `// 排列硬币 · 实现
export interface ArrangeCoinHooks {
  onProbe?: (mid: number, used: number) => void;
  onConclude?: (rows: number) => void;
}
export function miscArrangeCoin2(n: number, hooks: ArrangeCoinHooks = {}): number {
  if (n <= 0) return 0;
  let lo = 1;
  let hi = n;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    const used = (mid * (mid + 1)) / 2;
    hooks.onProbe?.(mid, used);
    if (used === n) { hooks.onConclude?.(mid); return mid; }
    if (used < n) lo = mid + 1;
    else hi = mid - 1;
  }
  hooks.onConclude?.(hi);
  return hi;
}`,
  `// 排列硬币 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { miscArrangeCoin2 } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'n=5', en: 'n=5' }).commit();
  const r = miscArrangeCoin2(5, {
    onProbe: (m, u) => rec.begin({ zh: \`mid=\${m} 用 \${u}\`, en: \`mid=\${m} used \${u}\` }).commit(),
  });
  rec.begin({ zh: \`结果 \${r}\`, en: \`Result \${r}\` })
    .setAux([{ label: '答案', value: String(r), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { miscArrangeCoin2 } from '../../src/algorithms/misc/misc-arrange-coin-2/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-arrange-coin-2/trace.ts';
test('arrangeCoin 5 = 2', () => { assert.equal(miscArrangeCoin2(5), 2); });
test('arrangeCoin 8 = 3', () => { assert.equal(miscArrangeCoin2(8), 3); });
test('arrangeCoin 0 = 0', () => { assert.equal(miscArrangeCoin2(0), 0); });
test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));`,
);

writeAlg('misc-bulb-2',
  meta('misc-bulb-2', '灯泡开关', 'Bulb Switcher',
    'n 个灯泡每个轮 toggle；最终亮的 = ⌊√n⌋（只完全平方数位置亮）。', 'Each round toggles bulbs; final lit count = ⌊√n⌋ (only perfect-square positions stay on).',
    'LeetCode 319 灯泡开关：第 i 轮切换编号是 i 倍数的灯。最终亮灯数 = ⌊√n⌋。',
    'LeetCode 319 Bulb Switcher: round i toggles multiples of i. Lit count = ⌊√n⌋.',
    'O(1)', 'O(1)', ['misc', 'math', 'leetcode']),
  `// 灯泡开关 · 实现
export interface BulbHooks {
  onConclude?: (lit: number) => void;
}
export function miscBulb2(n: number, hooks: BulbHooks = {}): number {
  if (n <= 0) return 0;
  const lit = Math.floor(Math.sqrt(n));
  hooks.onConclude?.(lit);
  return lit;
}`,
  `// 灯泡开关 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { miscBulb2 } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'n=9', en: 'n=9' }).commit();
  const r = miscBulb2(9);
  rec.begin({ zh: \`\${r} 个灯亮\`, en: \`\${r} lit\` })
    .setAux([{ label: '答案', value: String(r), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { miscBulb2 } from '../../src/algorithms/misc/misc-bulb-2/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-bulb-2/trace.ts';
test('bulb 0 = 0', () => { assert.equal(miscBulb2(0), 0); });
test('bulb 3 = 1', () => { assert.equal(miscBulb2(3), 1); });
test('bulb 9 = 3', () => { assert.equal(miscBulb2(9), 3); });
test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));`,
);

writeAlg('misc-power-of-3',
  meta('misc-power-of-3', '3 的幂', 'Power of Three',
    '判断 n 是否是 3 的幂（不断除以 3 看是否到 1）。', 'Check if n is a power of three (divide by 3 until reaching 1).',
    'LeetCode 326 3 的幂：n>0 且反复除以 3 最终为 1。也可直接判断 n 是否整除 3^19=1162261467（32 位内最大）。',
    'LeetCode 326 Power of Three: n>0 and dividing by 3 repeatedly reaches 1. Equivalent to n dividing 3^19=1162261467.',
    'O(log n)', 'O(1)', ['misc', 'math', 'leetcode']),
  `// 3 的幂 · 实现
export interface PowerOf3Hooks {
  onDivide?: (cur: number) => void;
  onConclude?: (isPower: boolean) => void;
}
export function miscPowerOf3(n: number, hooks: PowerOf3Hooks = {}): boolean {
  if (n <= 0) return false;
  let cur = n;
  while (cur % 3 === 0) { cur /= 3; hooks.onDivide?.(cur); }
  const isPower = cur === 1;
  hooks.onConclude?.(isPower);
  return isPower;
}`,
  `// 3 的幂 · 录制
import type { BarRole, Frame } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { miscPowerOf3 } from './impl.ts';
export function buildTrace(): Frame[] {
  const rec = new TraceRecorder();
  rec.begin({ zh: 'n=27', en: 'n=27' }).commit();
  const r = miscPowerOf3(27, {
    onDivide: (cur) => rec.begin({ zh: \`→ \${cur}\`, en: \`→ \${cur}\` }).commit(),
  });
  rec.begin({ zh: \`结果 \${r}\`, en: \`Result \${r}\` })
    .setAux([{ label: '答案', value: String(r), role: 'final' as BarRole }]).commit();
  return rec.build();
}`,
  `import { test } from 'node:test';
import assert from 'node:assert/strict';
import { miscPowerOf3 } from '../../src/algorithms/misc/misc-power-of-3/impl.ts';
import { buildTrace } from '../../src/algorithms/misc/misc-power-of-3/trace.ts';
test('27 是 3 的幂', () => { assert.equal(miscPowerOf3(27), true); });
test('9 是 3 的幂', () => { assert.equal(miscPowerOf3(9), true); });
test('45 不是 3 的幂', () => { assert.equal(miscPowerOf3(45), false); });
test('1 是 3 的幂', () => { assert.equal(miscPowerOf3(1), true); });
test('buildTrace 生成帧', () => assert.ok(buildTrace().length >= 2));`,
);

console.log('generated all 23 misc algorithms');
