import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  run,
  string,
  regex,
  seq,
  choice,
  many,
  many1,
  optional,
  sepBy,
  sepBy1,
  map,
  token,
  between,
  eof,
  fail,
  succeed,
  named,
  buildPairParser,
  type CombinatorHooks,
} from '../../src/algorithms/parsing/parser-combinator/impl.ts';
import { buildTrace } from '../../src/algorithms/parsing/parser-combinator/trace.ts';

test('parser-combinator string 匹配字面量', () => {
  assert.equal(run(string('abc'), 'abc').ok, true);
  assert.equal(run(string('abc'), 'abd').ok, false);
});

test('parser-combinator regex 匹配', () => {
  const r = run(regex('[0-9]+'), '12345');
  assert.equal(r.ok, true);
  assert.equal(r.value, '12345');
});

test('parser-combinator seq 顺序组合', () => {
  const p = seq([string('a'), string('b'), string('c')]);
  assert.equal(run(p, 'abc').ok, true);
  assert.equal(run(p, 'abx').ok, false);
});

test('parser-combinator choice 有序选择', () => {
  const p = choice([string('foo'), string('bar')]);
  assert.equal(run(p, 'foo').ok, true);
  assert.equal(run(p, 'bar').ok, true);
  assert.equal(run(p, 'baz').ok, false);
});

test('parser-combinator many 零或多次', () => {
  assert.equal(run(many(string('ab')), 'ababab').ok, true);
  // 零次也成功：直接调用解析器（不要求消费全部）应停在起点
  const r0 = many(string('ab'))('xyz', 0);
  assert.equal(r0.ok, true);
  assert.equal(r0.pos, 0);
  assert.deepEqual(r0.value, []);
});

test('parser-combinator many1 一或多次', () => {
  assert.equal(run(many1(string('ab')), 'abab').ok, true);
  // 零次失败
  assert.equal(run(many1(string('ab')), 'x').ok, false);
});

test('parser-combinator optional 可选', () => {
  const p = seq([optional(string('x')), string('y')]);
  assert.equal(run(p, 'y').ok, true);
  assert.equal(run(p, 'xy').ok, true);
});

test('parser-combinator sepBy 分隔列表', () => {
  const num = regex('[0-9]+');
  const comma = token(string(','));
  const r = run(sepBy(num, comma), '1,2,3');
  assert.equal(r.ok, true);
  assert.deepEqual(r.value, ['1', '2', '3']);
});

test('parser-combinator sepBy 空列表成功', () => {
  const num = regex('[0-9]+');
  const comma = token(string(','));
  assert.equal(run(sepBy(num, comma), '').ok, true);
});

test('parser-combinator sepBy1 空列表失败', () => {
  const num = regex('[0-9]+');
  const comma = token(string(','));
  assert.equal(run(sepBy1(num, comma), '').ok, false);
});

test('parser-combinator map 结果变换', () => {
  const upper = map(string('hi'), (s) => s.toUpperCase());
  const r = run(upper, 'hi');
  assert.equal(r.value, 'HI');
});

test('parser-combinator between 穿过', () => {
  const p = between(string('('), regex('[a-z]+'), string(')'));
  const r = run(p, '(abc)');
  assert.equal(r.ok, true);
  assert.equal(r.value, 'abc');
});

test('parser-combinator eof 末尾', () => {
  assert.equal(run(eof(), '').ok, true);
  assert.equal(run(eof(), 'x').ok, false);
});

test('parser-combinator fail 总是失败', () => {
  assert.equal(run(fail('nope'), 'abc').ok, false);
});

test('parser-combinator succeed 总是成功', () => {
  const r = run(succeed(42), '');
  assert.equal(r.ok, true);
  assert.equal(r.value, 42);
});

test('parser-combinator token 跳过空白', () => {
  const p = seq([token(string('a')), token(string('b'))]);
  const r = run(p, '  a   b  ');
  assert.equal(r.ok, true);
});

test('parser-combinator 键值对演示', () => {
  const r = run(buildPairParser(), 'x = 1; name = hello; count = 42');
  assert.equal(r.ok, true);
  const pairs = r.value as Array<{ key: string; value: string }>;
  assert.equal(pairs.length, 3);
  assert.equal(pairs[0]!.key, 'x');
  assert.equal(pairs[0]!.value, '1');
  assert.equal(pairs[1]!.key, 'name');
  assert.equal(pairs[2]!.value, '42');
});

test('parser-combinator 钩子被触发', () => {
  let tries = 0;
  let failures = 0;
  const hooks: CombinatorHooks = {
    onTry: () => tries++,
    onFailure: () => failures++,
  };
  run(buildPairParser(hooks), 'x = hello');
  assert.ok(tries > 0);
  // value 用 choice，num 先失败 → 至少 1 次 failure
  assert.ok(failures >= 1);
});

test('parser-combinator named 包装不影响结果', () => {
  const p = named('lit', string('abc'));
  assert.equal(run(p, 'abc').ok, true);
});

test('parser-combinator 未消费全部输入失败', () => {
  const p = string('ab');
  const r = run(p, 'abc');
  assert.equal(r.ok, false);
  assert.match(r.error, /未消费/);
});

test('buildTrace 生成多帧', () => {
  const frames = buildTrace();
  assert.ok(frames.length >= 2);
  const last = frames[frames.length - 1]!;
  assert.ok(last.aux, '末帧含 aux');
});
