import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  parseJson,
  toJsonTree,
  resetNodeId,
  JsonParseError,
  type JsonValue,
} from '../../src/algorithms/parsing/json-parser/impl.ts';
import { buildTrace } from '../../src/algorithms/parsing/json-parser/trace.ts';

test('json-parser null', () => {
  assert.equal(parseJson('null'), null);
});

test('json-parser 布尔', () => {
  assert.equal(parseJson('true'), true);
  assert.equal(parseJson('false'), false);
});

test('json-parser 数字（整数）', () => {
  assert.equal(parseJson('0'), 0);
  assert.equal(parseJson('42'), 42);
  assert.equal(parseJson('-7'), -7);
});

test('json-parser 数字（小数）', () => {
  assert.equal(parseJson('3.14'), 3.14);
  assert.equal(parseJson('-0.5'), -0.5);
});

test('json-parser 数字（指数）', () => {
  assert.equal(parseJson('1e3'), 1000);
  assert.equal(parseJson('1.5e2'), 150);
  assert.equal(parseJson('2E-2'), 0.02);
});

test('json-parser 字符串（基本）', () => {
  assert.equal(parseJson('"hello"'), 'hello');
  assert.equal(parseJson('""'), '');
  assert.equal(parseJson('"中文测试"'), '中文测试');
});

test('json-parser 字符串转义', () => {
  assert.equal(parseJson('"a\\nb"'), 'a\nb');
  assert.equal(parseJson('"a\\tb"'), 'a\tb');
  assert.equal(parseJson('"a\\"b"'), 'a"b');
  assert.equal(parseJson('"a\\\\b"'), 'a\\b');
  assert.equal(parseJson('"a\/b"'), 'a/b');
  assert.equal(parseJson('"\\u0041' + '"'), 'A'); // \u0041 = A
});

test('json-parser 数组', () => {
  assert.deepEqual(parseJson('[]'), []);
  assert.deepEqual(parseJson('[1,2,3]'), [1, 2, 3]);
  assert.deepEqual(parseJson('[1, "a", true, null]'), [1, 'a', true, null]);
});

test('json-parser 嵌套数组', () => {
  assert.deepEqual(parseJson('[[1,2],[3,4]]'), [
    [1, 2],
    [3, 4],
  ]);
  assert.deepEqual(parseJson('[[]]'), [[]]);
});

test('json-parser 对象', () => {
  assert.deepEqual(parseJson('{}'), {});
  assert.deepEqual(parseJson('{"a":1}'), { a: 1 });
  assert.deepEqual(parseJson('{"a":1,"b":2}'), { a: 1, b: 2 });
});

test('json-parser 嵌套对象', () => {
  const r = parseJson('{"a":{"b":{"c":1}}}') as { a: { b: { c: number } } };
  assert.deepEqual(r, { a: { b: { c: 1 } } });
  assert.equal(r.a.b.c, 1);
});

test('json-parser 混合', () => {
  const r = parseJson('{"name":"x","tags":[1,2],"meta":{"ok":true}}') as JsonValue as {
    name: string;
    tags: number[];
    meta: { ok: boolean };
  };
  assert.equal(r.name, 'x');
  assert.deepEqual(r.tags, [1, 2]);
  assert.equal(r.meta.ok, true);
});

test('json-parser 空白跳过', () => {
  assert.deepEqual(parseJson('  [ 1 , 2 ]  '), [1, 2]);
  assert.deepEqual(parseJson('\n{\n"a"\n:\n1\n}\n'), { a: 1 });
  assert.equal(parseJson('   42   '), 42);
});

test('json-parser 与原生 JSON.parse 一致', () => {
  const samples = [
    'null',
    'true',
    '42',
    '-3.14',
    '"hi"',
    '[1,2,3]',
    '{"a":1,"b":"x"}',
    '{"nested":{"arr":[1,"a",true,null]}}',
  ];
  for (const s of samples) {
    assert.deepEqual(parseJson(s), JSON.parse(s));
  }
});

test('json-parser 错误：意外字符', () => {
  assert.throws(() => parseJson('xyz'), JsonParseError);
  assert.throws(() => parseJson('{a:1}'), JsonParseError); // 键未加引号
});

test('json-parser 错误：尾逗号', () => {
  assert.throws(() => parseJson('[1,2,]'), JsonParseError);
  assert.throws(() => parseJson('{"a":1,}'), JsonParseError);
});

test('json-parser 错误：未闭合', () => {
  assert.throws(() => parseJson('[1,2'), JsonParseError);
  assert.throws(() => parseJson('{"a":1'), JsonParseError);
  assert.throws(() => parseJson('"abc'), JsonParseError);
});

test('json-parser 错误：多余字符', () => {
  assert.throws(() => parseJson('1 2'), JsonParseError);
  assert.throws(() => parseJson('true false'), JsonParseError);
});

test('json-parser 错误：非法转义', () => {
  assert.throws(() => parseJson('"a\\xb"'), JsonParseError);
  assert.throws(() => parseJson('"\\u00"'), JsonParseError); // \u 不足 4 位
});

test('json-parser 错误位置信息', () => {
  try {
    parseJson('{"a":1,}');
    assert.fail('应抛错');
  } catch (e) {
    assert.ok(e instanceof JsonParseError);
    assert.ok((e as JsonParseError).position >= 0);
  }
});

test('json-parser 钩子 onValue 被调用', () => {
  let count = 0;
  parseJson('[1, "a", true]', {
    onValue: () => count++,
  });
  // 1, "a", true 各触发一次 onValue；数组本身也触发一次 onValue('array')
  assert.ok(count >= 4);
});

test('json-parser 钩子 onArrayElement', () => {
  const elems: unknown[] = [];
  parseJson('[10, 20, 30]', {
    onArrayElement: (_i, v) => elems.push(v),
  });
  assert.deepEqual(elems, [10, 20, 30]);
});

test('json-parser 钩子 onObjectMember', () => {
  const members: Array<[string, unknown]> = [];
  parseJson('{"x":1,"y":2}', {
    onObjectMember: (k, v) => members.push([k, v]),
  });
  assert.deepEqual(members, [
    ['x', 1],
    ['y', 2],
  ]);
});

test('json-parser 钩子 onResult', () => {
  let res: JsonValue | null = null;
  parseJson('{"a":1}', {
    onResult: (v) => (res = v),
  });
  assert.deepEqual(res, { a: 1 });
});

test('json-parser toJsonTree 基本值', () => {
  resetNodeId();
  const t = toJsonTree(42);
  assert.equal(t.value, '42');
  assert.equal(t.children, undefined);
});

test('json-parser toJsonTree 数组', () => {
  resetNodeId();
  const t = toJsonTree([1, 2]);
  assert.equal(t.value, '[2]');
  assert.equal(t.children!.length, 2);
});

test('json-parser toJsonTree 对象', () => {
  resetNodeId();
  const t = toJsonTree({ a: 1, b: 2 });
  assert.equal(t.value, '{2}');
  assert.equal(t.children!.length, 2);
  assert.equal(t.children![0]!.edgeLabel, 'a');
});

test('json-parser toJsonTree null', () => {
  resetNodeId();
  const t = toJsonTree(null);
  assert.equal(t.value, 'null');
});

test('buildTrace 生成 aux 帧', () => {
  const frames = buildTrace('[1, "a", true]');
  assert.ok(frames.length >= 3);
  for (const f of frames) assert.ok(f.aux, '每帧应有 aux');
});

test('buildTrace 终帧有 tree', () => {
  const frames = buildTrace('{"a":1,"b":[2,3]}');
  const last = frames[frames.length - 1]!;
  assert.ok(last.tree, '终帧应有 tree');
  assert.ok(last.tree!.children!.length === 2);
});

test('buildTrace 复杂嵌套可解析', () => {
  const frames = buildTrace('{"x":{"y":[1,2,{"z":null}]}}');
  assert.ok(frames.length >= 4);
  const last = frames[frames.length - 1]!;
  assert.ok(last.tree);
});
