import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gasStation } from '../../src/algorithms/dp/gas-station/impl.ts';

// 校验：从返回起点出发绕一圈，油量全程 ≥ 0。
function verify(gas: number[], cost: number[], start: number): boolean {
  if (start < 0) return false;
  const n = gas.length;
  let tank = 0;
  for (let k = 0; k < n; k++) {
    const i = (start + k) % n;
    tank += gas[i]! - cost[i]!;
    if (tank < 0) return false;
  }
  return true;
}

test('gas-station 基本行为', () => {
  assert.equal(gasStation([], []), -1);
  assert.equal(gasStation([5], [4]), 0); // 单站够
  assert.equal(gasStation([5], [6]), -1); // 单站不够
});

test('gas-station 经典用例', () => {
  // LeetCode 134：gas=[1,2,3,4,5], cost=[3,4,5,1,2] → 起点 3
  const r1 = gasStation([1, 2, 3, 4, 5], [3, 4, 5, 1, 2]);
  assert.equal(r1, 3);
  assert.ok(verify([1, 2, 3, 4, 5], [3, 4, 5, 1, 2], r1));

  // 无解：总净余 < 0
  const r2 = gasStation([2, 3, 4], [3, 4, 3]);
  assert.equal(r2, -1);
});

test('gas-station 总净余恰为 0 仍有解', () => {
  const r = gasStation([2, 2, 2], [2, 2, 2]);
  assert.ok(r >= 0);
  assert.ok(verify([2, 2, 2], [2, 2, 2], r));
});

test('gas-station 暴力对拍', () => {
  const brute = (gas: number[], cost: number[]): number => {
    const n = gas.length;
    for (let s = 0; s < n; s++) {
      let tank = 0;
      let ok = true;
      for (let k = 0; k < n; k++) {
        const i = (s + k) % n;
        tank += gas[i]! - cost[i]!;
        if (tank < 0) {
          ok = false;
          break;
        }
      }
      if (ok) return s;
    }
    return -1;
  };
  const rng = (s: number) => () => (s = (s * 1103515245 + 12345) & 0x7fffffff);
  const rand = rng(13);
  for (let t = 0; t < 200; t++) {
    const n = 1 + (rand() % 8);
    const gas: number[] = [];
    const cost: number[] = [];
    for (let i = 0; i < n; i++) {
      gas.push(rand() % 6);
      cost.push(rand() % 6);
    }
    const got = gasStation(gas, cost);
    const exp = brute(gas, cost);
    // 贪心可能返回任一可行起点（不只 brute 的最小）；用可行性校验替代等值
    if (exp === -1) assert.equal(got, -1, `应无解 ${JSON.stringify({ gas, cost })}`);
    else assert.ok(verify(gas, cost, got), `应可行 ${JSON.stringify({ gas, cost })} got=${got}`);
  }
});

test('gas-station 钩子被调用', () => {
  let visit = 0;
  let done = -2;
  gasStation([1, 2, 3, 4, 5], [3, 4, 5, 1, 2], {
    onVisit: () => visit++,
    onDone: (s) => {
      done = s;
    },
  });
  assert.ok(visit >= 5, '应访问每站');
  assert.equal(done, 3);
});
