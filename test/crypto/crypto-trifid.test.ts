import { test } from 'node:test';
import assert from 'node:assert/strict';
import { trifidEncrypt, buildTrifidFill } from '../../src/algorithms/crypto/crypto-trifid/impl.ts';

test('crypto-trifid 填充构造', () => {
  const fill = buildTrifidFill('');
  assert.equal(fill.length, 27);
  assert.equal(fill[26], '+');
});

test('crypto-trifid 单字符自恒', () => {
  // 单字符周期内 combined=[l,r,c] 三三成组回查 -> 原字符
  assert.equal(trifidEncrypt('A'), 'A');
  assert.equal(trifidEncrypt('Z'), 'Z');
});

test('crypto-trifid 两字符扩散', () => {
  // A=[0,0,0], B=[0,0,1] -> layers[0,0] rows[0,0] cols[0,1]
  // combined=[0,0,0,0,0,1] -> triples (0,0,0)=A (0,0,1)=B
  // 同结构 => AB (二者都在第 0 层第 0 行，仅列不同)
  assert.equal(trifidEncrypt('AB'), 'AB');
  // A=[0,0,0], J=[1,0,0] -> combined=[0,1,0,0,0,0] -> (0,1,0)=D (0,0,0)=A
  assert.equal(trifidEncrypt('AJ'), 'DA');
});
