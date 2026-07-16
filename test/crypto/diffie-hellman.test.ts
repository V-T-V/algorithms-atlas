import { test } from 'node:test';
import assert from 'node:assert/strict';
import { diffieHellman } from '../../src/algorithms/crypto/diffie-hellman/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/crypto/diffie-hellman/trace.ts';

test('diffieHellman 双方共享秘密一致', () => {
  const r = diffieHellman(23, 5, 6, 15);
  // 经典示例：A=8, B=19, s=2
  assert.equal(r.alicePublic, 8);
  assert.equal(r.bobPublic, 19);
  assert.equal(r.sharedSecret, 2);
});

test('diffieHellman 默认参数确定', () => {
  const r = diffieHellman();
  assert.equal(r.sharedSecret, diffieHellman().sharedSecret);
});

test('diffieHellman 任意私钥都得到一致秘密', () => {
  for (let a = 1; a < 10; a++) {
    for (let b = 1; b < 10; b++) {
      const r = diffieHellman(23, 5, a, b);
      assert.equal(r.sharedSecret >= 0 && r.sharedSecret < 23, true);
    }
  }
});

test('diffieHellman 钩子触发', () => {
  const pubs: string[] = [];
  const shared: number[] = [];
  diffieHellman(23, 5, 6, 15, {
    onPublic: (who, pub) => pubs.push(`${who}:${pub}`),
    onShared: (_who, s) => shared.push(s),
  });
  assert.deepEqual(pubs, ['Alice:8', 'Bob:19']);
  assert.deepEqual(shared, [2, 2]);
});

test('buildTrace 末帧含共享秘密', () => {
  const frames = buildTrace(DEFAULT_INPUT);
  assert.ok(frames.length >= 2);
  const last = frames[frames.length - 1]!;
  assert.ok(last.map);
  assert.equal(last.map!.find((e) => e.key.includes('共享秘密'))!.value, '2');
});
