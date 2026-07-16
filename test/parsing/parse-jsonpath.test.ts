import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parsePath, queryPath } from '../../src/algorithms/parsing/parse-jsonpath/impl.ts';

test('jsonpath 解析', () => {
  assert.deepEqual(parsePath('$.a.b[0].c'), [
    { kind: 'key', value: 'a' },
    { kind: 'key', value: 'b' },
    { kind: 'index', value: 0 },
    { kind: 'key', value: 'c' },
  ]);
});
test('jsonpath 查询', () => {
  const data = { a: { b: [{ c: 1 }, { c: 2 }] } };
  assert.deepEqual(queryPath(data, '$.a.b[0].c'), [1]);
  assert.deepEqual(queryPath(data, '$.a.b[*].c'), [1, 2]);
});
