import { test } from 'node:test';
import assert from 'node:assert/strict';
import { decodeWays } from '../../src/algorithms/dp/decode-ways/impl.ts';

test('decode-ways 基本行为', () => {
  assert.equal(decodeWays(''), 1);
  assert.equal(decodeWays('0'), 0);
  assert.equal(decodeWays('1'), 1);
  assert.equal(decodeWays('9'), 1);
});

test('decode-ways 经典用例', () => {
  assert.equal(decodeWays('12'), 2); // AB / L
  assert.equal(decodeWays('226'), 3); // BBF / BZ / VF
  assert.equal(decodeWays('111'), 3); // AAA / AK / KA
  assert.equal(decodeWays('11106'), 2); // 1 1 10 6 / 11 10 6
  assert.equal(decodeWays('06'), 0); // 起头 0 非法
  assert.equal(decodeWays('10'), 1); // J
  assert.equal(decodeWays('27'), 1); // BG（2 与 7，27 不合法）
});

test('decode-ways 全 1 长串（斐波那契）', () => {
  // "11111" → 5 位全是 1，方案数为 fib: 1,2,3,5,8
  assert.equal(decodeWays('11111'), 8);
});

test('decode-ways 钩子被调用', () => {
  let fill = 0;
  let done = -1;
  decodeWays('226', {
    onFillCell: () => fill++,
    onDone: (t) => {
      done = t;
    },
  });
  assert.ok(fill >= 3, '应触发 onFillCell');
  assert.equal(done, 3);
});
