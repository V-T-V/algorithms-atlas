import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseRegex, serializeRegex } from '../../src/algorithms/parsing/parse-regex-ast/impl.ts';
import {
  optimizeRegex,
  countRules,
  type OptimizeHooks,
} from '../../src/algorithms/parsing/parse-regex-optimize/impl.ts';
import { buildTrace } from '../../src/algorithms/parsing/parse-regex-optimize/trace.ts';

const opt = (s: string) => optimizeRegex(parseRegex(s), serializeRegex).after;

test('parse-regex-optimize (x*)* → x*', () => {
  const a = opt('a**');
  assert.equal(serializeRegex(a), 'a*');
});

test('parse-regex-optimize (x+)* → x*', () => {
  const a = opt('a+*');
  assert.equal(serializeRegex(a), 'a*');
});

test('parse-regex-optimize x?* → x*', () => {
  const a = opt('a?*');
  assert.equal(serializeRegex(a), 'a*');
});

test('parse-regex-optimize ε* → ε', () => {
  const a = opt('');
  assert.equal(serializeRegex(a), '');
});

test('parse-regex-optimize concat 消去 ε', () => {
  // 用 alt(a, ε) 产生 ε 再 concat
  const before = parseRegex('a');
  // 构造 concat(a, ε)：通过 parseRegex('a') + 后处理
  const r = optimizeRegex(
    { kind: 'concat', children: [before, { kind: 'empty' }] },
    serializeRegex,
  );
  assert.equal(serializeRegex(r.after), 'a');
});

test('parse-regex-optimize 扁平化嵌套 concat', () => {
  // 手动构造 concat(concat(a,b),c)
  const nested = {
    kind: 'concat' as const,
    children: [
      {
        kind: 'concat' as const,
        children: [
          { kind: 'char' as const, ch: 'a' },
          { kind: 'char' as const, ch: 'b' },
        ],
      },
      { kind: 'char' as const, ch: 'c' },
    ],
  };
  const r = optimizeRegex(nested, serializeRegex);
  assert.equal(serializeRegex(r.after), 'abc');
});

test('parse-regex-optimize alt 去重', () => {
  // alt(a, a) → a
  const dup = {
    kind: 'alt' as const,
    children: [
      { kind: 'char' as const, ch: 'a' },
      { kind: 'char' as const, ch: 'a' },
    ],
  };
  const r = optimizeRegex(dup, serializeRegex);
  assert.equal(serializeRegex(r.after), 'a');
});

test('parse-regex-optimize 单子 alt 提升', () => {
  const single = {
    kind: 'alt' as const,
    children: [{ kind: 'char' as const, ch: 'a' }],
  };
  const r = optimizeRegex(single, serializeRegex);
  assert.equal(serializeRegex(r.after), 'a');
});

test('parse-regex-optimize 已规范者 changed=false', () => {
  const r = optimizeRegex(parseRegex('abc'), serializeRegex);
  assert.equal(r.changed, false);
});

test('parse-regex-optimize countRules', () => {
  assert.equal(countRules(parseRegex('a')), 1);
  assert.equal(countRules(parseRegex('ab')), 3); // concat + a + b
  assert.equal(countRules(parseRegex('a*')), 2);
});

test('parse-regex-optimize 不改变语义', () => {
  // (a|b)* 的化简结果仍可解析
  const a = opt('(a|b)*|ε');
  // 再次解析应成功
  const reparsed = parseRegex(serializeRegex(a));
  assert.ok(reparsed);
});

test('parse-regex-optimize 钩子触发', () => {
  let passes = 0;
  let results = 0;
  const hooks: OptimizeHooks = {
    onPass: () => passes++,
    onResult: () => results++,
  };
  optimizeRegex(parseRegex('a**'), serializeRegex, 20, hooks);
  assert.ok(passes >= 1);
  assert.equal(results, 1);
});

test('buildTrace 生成 aux 帧', () => {
  const frames = buildTrace('a**');
  assert.ok(frames.length >= 3);
  for (const f of frames) assert.ok(f.aux);
  const last = frames[frames.length - 1]!;
  const cur = last.aux!.find((e) => e.label === '规范化');
  assert.ok(cur);
  assert.equal(cur!.value, 'a*');
});
