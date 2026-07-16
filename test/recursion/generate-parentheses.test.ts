import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  generateParentheses,
  catalan,
} from '../../src/algorithms/recursion/generate-parentheses/impl.ts';
import {
  buildTrace,
  DEFAULT_INPUT,
} from '../../src/algorithms/recursion/generate-parentheses/trace.ts';

test('generateParentheses n=3 生成 5 个', () => {
  const r = generateParentheses(3);
  assert.equal(r.length, 5);
});

test('generateParentheses n=3 结果正确', () => {
  const r = generateParentheses(3).sort();
  assert.deepEqual(r, ['((()))', '(()())', '(())()', '()(())', '()()()'].sort());
});

test('generateParentheses n=1', () => {
  assert.deepEqual(generateParentheses(1), ['()']);
});

test('generateParentheses n=2', () => {
  assert.deepEqual(generateParentheses(2).sort(), ['(())', '()()'].sort());
});

test('generateParentheses n=0 返回空串', () => {
  assert.deepEqual(generateParentheses(0), ['']);
});

test('generateParentheses n=4 生成 14 个', () => {
  assert.equal(generateParentheses(4).length, 14);
});

test('generateParentheses 所有结果都是合法括号', () => {
  const r = generateParentheses(4);
  for (const s of r) {
    // 长度 = 2n
    assert.equal(s.length, 8);
    // 前缀检查：任意前缀中 ')' 数 ≤ '(' 数
    let bal = 0;
    for (const ch of s) {
      bal += ch === '(' ? 1 : -1;
      assert.ok(bal >= 0, `${s} 非法：前缀右括号过多`);
    }
    assert.equal(bal, 0, `${s} 非法：括号不平衡`);
  }
});

test('catalan 数列正确', () => {
  const known = [1, 1, 2, 5, 14, 42, 132, 429];
  for (let n = 0; n < known.length; n++) {
    assert.equal(catalan(n), known[n], `C_${n}`);
  }
});

test('generateParentheses 结果数 = catalan(n)', () => {
  for (let n = 1; n <= 6; n++) {
    assert.equal(generateParentheses(n).length, catalan(n), `n=${n}`);
  }
});

test('generateParentheses 拒绝非法输入', () => {
  assert.throws(() => generateParentheses(-1), RangeError);
  assert.throws(() => generateParentheses(1.5), RangeError);
});

test('generateParentheses 钩子 onCollect 触发 catalan(n) 次', () => {
  let collects = 0;
  generateParentheses(4, {
    onCollect: () => collects++,
  });
  assert.equal(collects, 14);
});

test('generateParentheses 钩子 onAdd/onBacktrack 数量自洽', () => {
  let adds = 0;
  let backtracks = 0;
  generateParentheses(3, {
    onAdd: () => adds++,
    onBacktrack: () => backtracks++,
  });
  // 每次加入必有对应回溯（除叶子收集外）
  assert.equal(adds, backtracks);
  assert.ok(adds > 0);
});

test('generateParentheses onAdd 顺序正确（先 ( 后 )）', () => {
  const firstChars: string[] = [];
  generateParentheses(2, {
    onAdd: (_cur, ch) => {
      if (firstChars.length < 3) firstChars.push(ch);
    },
  });
  // 第一个加入必是 '('
  assert.equal(firstChars[0], '(');
});

test('buildTrace 生成帧序列', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 5);
  const last = frames[frames.length - 1]!;
  assert.ok(last.aux, '终帧应有 aux');
});

test('buildTrace 终帧含 5 个结果', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  const last = frames[frames.length - 1]!;
  const total = last.aux!.find((e) => e.label === '总数')!;
  assert.equal(total.value, '5');
});
