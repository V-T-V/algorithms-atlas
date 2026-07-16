import { test } from 'node:test';
import assert from 'node:assert/strict';
import { acAutomaton2 } from '../../src/algorithms/string/ac-automaton-2/impl.ts';

test('acAutomaton2 命中统计', () => {
  const stats = acAutomaton2('ushers', ['he', 'she', 'his', 'hers']);
  // he @2, she @1, hers @2, his 0
  const map = new Map(stats.map((s) => [s.pattern, s]));
  assert.equal(map.get('he')!.count, 1);
  assert.deepEqual(map.get('he')!.positions, [2]);
  assert.equal(map.get('she')!.count, 1);
  assert.deepEqual(map.get('she')!.positions, [1]);
  assert.equal(map.get('hers')!.count, 1);
  assert.deepEqual(map.get('hers')!.positions, [2]);
  assert.equal(map.get('his')!.count, 0);
  assert.deepEqual(map.get('his')!.positions, []);
});

test('acAutomaton2 多次出现计数', () => {
  const stats = acAutomaton2('abababab', ['ab', 'ba', 'abab']);
  const map = new Map(stats.map((s) => [s.pattern, s]));
  assert.equal(map.get('ab')!.count, 4);
  assert.equal(map.get('ba')!.count, 3);
  assert.equal(map.get('abab')!.count, 3);
  assert.deepEqual(map.get('ab')!.positions, [0, 2, 4, 6]);
});

test('acAutomaton2 无匹配', () => {
  const stats = acAutomaton2('hello', ['xyz']);
  assert.equal(stats[0]!.count, 0);
});

test('acAutomaton2 边界', () => {
  // 空文本、有模式：返回每个模式的统计（count=0）
  const emptyText = acAutomaton2('', ['a']);
  assert.equal(emptyText.length, 1);
  assert.equal(emptyText[0]!.count, 0);
  // 无模式
  assert.deepEqual(acAutomaton2('abc', []), []);
});

test('acAutomaton2 钩子', () => {
  let founds = 0;
  acAutomaton2('ushers', ['he', 'she', 'hers'], {
    onFound: () => founds++,
  });
  assert.equal(founds, 3);
});
