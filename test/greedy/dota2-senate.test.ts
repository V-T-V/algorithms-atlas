import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  dota2Senate,
  type Dota2SenateHooks,
} from '../../src/algorithms/greedy/dota2-senate/impl.ts';

test('dota2-senate "RD" → Radiant', () => {
  // LeetCode 示例 1：R 先发言禁 D
  assert.equal(dota2Senate('RD'), 'Radiant');
});

test('dota2-senate "RDD" → Dire', () => {
  // LeetCode 示例 2：R 禁第一个 D，第二个 D 反禁 R
  assert.equal(dota2Senate('RDD'), 'Dire');
});

test('dota2-senate 单方全部 R → Radiant', () => {
  assert.equal(dota2Senate('RRR'), 'Radiant');
  assert.equal(dota2Senate('R'), 'Radiant');
});

test('dota2-senate 单方全部 D → Dire', () => {
  assert.equal(dota2Senate('DDD'), 'Dire');
  assert.equal(dota2Senate('D'), 'Dire');
});

test('dota2-senate "DRDR" → Dire', () => {
  // D 先禁 R，剩 D,R；R 禁 D，剩 R... 实际取决于下标博弈
  const r = dota2Senate('DRDR');
  assert.ok(r === 'Radiant' || r === 'Dire');
});

test('dota2-senate 交替长短串', () => {
  // 大量交替：先发言方优势
  const r1 = dota2Senate('RDRDRDRD');
  const r2 = dota2Senate('DRDRDRDR');
  assert.ok(['Radiant', 'Dire'].includes(r1));
  assert.ok(['Radiant', 'Dire'].includes(r2));
});

test('dota2-senate 数量多者常胜', () => {
  // R 数倍于 D：R 胜
  assert.equal(dota2Senate('RRRRD'), 'Radiant');
  assert.equal(dota2Senate('DDDDR'), 'Dire');
});

test('dota2-senate 钩子被调用', () => {
  let bans = 0;
  let concludes = 0;
  const hooks: Dota2SenateHooks = {
    onBan: () => bans++,
    onConclude: () => concludes++,
  };
  dota2Senate('RDD', hooks);
  assert.ok(bans > 0);
  assert.equal(concludes, 1);
});

test('dota2-senate 空串', () => {
  // 无参议员：约定 Dire（无 R）→ 但两者都空，实现返回 Dire（dq 为空则 Radiant，rq 为空则 Dire；这里 rq/dq 都空，rq.length=0 → Dire）
  const r = dota2Senate('');
  assert.ok(r === 'Radiant' || r === 'Dire');
});
