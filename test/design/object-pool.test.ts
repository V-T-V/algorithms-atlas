import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ObjectPool } from '../../src/algorithms/design/object-pool/impl.ts';

test('pool 预创建 capacity 个对象', () => {
  const p = new ObjectPool<{ v: number }>(() => ({ v: 0 }), undefined, 3);
  assert.equal(p.freeCount, 3);
  assert.equal(p.inUseCount, 0);
});

test('pool acquire 减少 free 增加 inUse', () => {
  const p = new ObjectPool<{ v: number }>(() => ({ v: 0 }), undefined, 2);
  const o = p.acquire();
  assert.equal(p.freeCount, 1);
  assert.equal(p.inUseCount, 1);
  assert.ok(o);
});

test('pool release 归还对象', () => {
  const p = new ObjectPool<{ v: number }>(() => ({ v: 0 }), undefined, 2);
  const o = p.acquire();
  p.release(o);
  assert.equal(p.freeCount, 2);
  assert.equal(p.inUseCount, 0);
});

test('pool 复用对象（release 后再 acquire 拿到同一个）', () => {
  const p = new ObjectPool<{ v: number }>(() => ({ v: Math.random() }), undefined, 1);
  const o1 = p.acquire();
  p.release(o1);
  const o2 = p.acquire();
  assert.equal(o1, o2);
});

test('pool reject 策略：借空抛错', () => {
  const p = new ObjectPool<{ v: number }>(() => ({ v: 0 }), undefined, 1, 1, 'reject');
  p.acquire();
  assert.throws(() => p.acquire());
  assert.equal(p.stats().totalRejected, 1);
});

test('pool grow 策略：借空时扩张到 maxSize', () => {
  const p = new ObjectPool<{ v: number }>(() => ({ v: 0 }), undefined, 1, 3, 'grow');
  p.acquire();
  p.acquire(); // 触发 grow
  p.acquire(); // 再 grow
  assert.equal(p.capacity, 3);
  assert.equal(p.stats().totalGrown, 2);
});

test('pool grow 到上限后仍 reject', () => {
  const p = new ObjectPool<{ v: number }>(() => ({ v: 0 }), undefined, 1, 2, 'grow');
  p.acquire();
  p.acquire(); // grow 到 2
  assert.throws(() => p.acquire()); // 已到上限
});

test('pool reset 在 release 时被调用', () => {
  let resetCount = 0;
  const p = new ObjectPool<{ v: number }>(
    () => ({ v: 5 }),
    (obj) => {
      obj.v = 0;
      resetCount++;
    },
    1,
  );
  const o = p.acquire();
  p.release(o);
  assert.equal(resetCount, 1);
  assert.equal(o.v, 0);
});

test('pool 非法容量抛错', () => {
  assert.throws(() => new ObjectPool(() => 0, undefined, 0));
  assert.throws(() => new ObjectPool(() => 0, undefined, 5, 3));
});

test('pool stats 统计', () => {
  const p = new ObjectPool<{ v: number }>(() => ({ v: 0 }), undefined, 2);
  const a = p.acquire();
  const b = p.acquire();
  p.release(a);
  p.release(b);
  const s = p.stats();
  assert.equal(s.totalAcquired, 2);
  assert.equal(s.totalReleased, 2);
});
