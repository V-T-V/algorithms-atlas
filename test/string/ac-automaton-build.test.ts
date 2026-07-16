import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  buildAcAutomaton,
  AcBuilder,
} from '../../src/algorithms/string/ac-automaton-build/impl.ts';

test('AC build 基本 he/she/his/hers', () => {
  const ac = buildAcAutomaton(['he', 'she', 'his', 'hers']);
  // 节点数：root + h,e,he_end,he.s? s,h(e 子),she_end, i,his_end,hers... 具体：
  assert.ok(ac.nodes.length > 5);
  // 'he' 结尾节点 output=true
  let cur = 0;
  for (const ch of 'he') cur = ac.nodes[cur]!.children.get(ch)!;
  assert.equal(ac.nodes[cur]!.output, true);
  // 'she' 结尾
  cur = 0;
  for (const ch of 'she') cur = ac.nodes[cur]!.children.get(ch)!;
  assert.equal(ac.nodes[cur]!.output, true);
});

test('AC build root 的 fail 全为 0', () => {
  const ac = buildAcAutomaton(['a', 'ab']);
  assert.equal(ac.nodes[0]!.fail, 0);
});

test('AC build fail 链正确性', () => {
  const ac = buildAcAutomaton(['abc', 'bc', 'c']);
  // 找到 'abc' 末节点
  let abc = 0;
  for (const ch of 'abc') abc = ac.nodes[abc]!.children.get(ch)!;
  // abc 的 fail 应指向 'bc' 末节点
  let bc = 0;
  for (const ch of 'bc') bc = ac.nodes[bc]!.children.get(ch)!;
  assert.equal(ac.nodes[abc]!.fail, bc);
  // bc 的 fail 应指向 'c' 末节点
  let cEnd = 0;
  cEnd = ac.nodes[cEnd]!.children.get('c')!;
  assert.equal(ac.nodes[bc]!.fail, cEnd);
});

test('AC build 空模式', () => {
  const ac = buildAcAutomaton([]);
  assert.equal(ac.nodes.length, 1); // 仅 root
  assert.equal(ac.nodes[0]!.fail, 0);
});

test('AC build 重复模式', () => {
  const ac = buildAcAutomaton(['a', 'a', 'aa']);
  let aEnd = 0;
  aEnd = ac.nodes[aEnd]!.children.get('a')!;
  assert.equal(ac.nodes[aEnd]!.output, true);
});

test('ACBuilder 直接使用', () => {
  const ac = new AcBuilder();
  ac.insert('xyz');
  ac.buildFail();
  let cur = 0;
  for (const ch of 'xyz') cur = ac.nodes[cur]!.children.get(ch)!;
  assert.equal(ac.nodes[cur]!.output, true);
  assert.equal(ac.nodes[0]!.fail, 0);
});
