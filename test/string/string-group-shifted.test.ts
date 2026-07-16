import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  shiftedKey,
  isShiftEquivalent,
  groupShifted,
} from '../../src/algorithms/string/string-group-shifted/impl.ts';

test('shiftedKey 基本', () => {
  assert.equal(shiftedKey('abc'), '1,1');
  assert.equal(shiftedKey('bcd'), '1,1'); // 同一组
  assert.equal(shiftedKey('xyz'), '1,1');
  assert.equal(shiftedKey('az'), '25');
  assert.equal(shiftedKey('ba'), '25'); // b→a 是 -1 ≡ 25
  assert.equal(shiftedKey('a'), '');
  assert.equal(shiftedKey('z'), '');
});

test('isShiftEquivalent', () => {
  assert.equal(isShiftEquivalent('abc', 'bcd'), true);
  assert.equal(isShiftEquivalent('abc', 'xyz'), true);
  assert.equal(isShiftEquivalent('az', 'ba'), true);
  assert.equal(isShiftEquivalent('abc', 'abd'), false);
  assert.equal(isShiftEquivalent('abc', 'ab'), false); // 长度不同
  assert.equal(isShiftEquivalent('acef', 'bdfg'), true);
});

test('groupShifted', () => {
  const groups = groupShifted(['abc', 'bcd', 'acef', 'xyz', 'az', 'ba', 'a', 'z']);
  // 期望：[abc,bcd,xyz]、[az,ba]、[acef]、[a,z]
  assert.equal(groups.length, 4);
  const abcGroup = groups.find((g) => g.includes('abc'));
  assert.ok(abcGroup);
  assert.equal(abcGroup!.length, 3); // abc, bcd, xyz
  const azGroup = groups.find((g) => g.includes('az'));
  assert.ok(azGroup);
  assert.equal(azGroup!.length, 2); // az, ba
  const single = groups.find((g) => g.includes('a'));
  assert.ok(single);
  assert.equal(single!.length, 2); // a, z（都单字符，签名相同）
});

test('groupShifted 空', () => {
  assert.deepEqual(groupShifted([]), []);
});

test('groupShifted 全单字符', () => {
  const groups = groupShifted(['a', 'b', 'c']);
  assert.equal(groups.length, 1); // 都是单字符，签名都是空串
  assert.equal(groups[0]!.length, 3);
});

test('环绕正确性', () => {
  // 'za' 与 'ab'：z→a 是 +1（27-26=1），a→b 是 +1，签名 1,1
  assert.equal(isShiftEquivalent('za', 'ab'), true);
});
