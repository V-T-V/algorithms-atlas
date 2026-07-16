import { test } from 'node:test';
import assert from 'node:assert/strict';
import { canWinNim, playNim } from '../../src/algorithms/misc/misc-nim-game-alt/impl.ts';
import {
  buildTrace,
  DEFAULT_N,
  DEFAULT_MAX,
} from '../../src/algorithms/misc/misc-nim-game-alt/trace.ts';

test('nim-alt n=4,max=3 先手必败', () => {
  assert.equal(canWinNim(4, 3), false);
});

test('nim-alt n=5,max=3 先手必胜', () => {
  assert.equal(canWinNim(5, 3), true);
});

test('nim-alt n=1,max=3 先手必胜', () => {
  assert.equal(canWinNim(1, 3), true);
});

test('nim-alt 必胜时先手应赢', () => {
  for (let n = 1; n <= 20; n++) {
    const { winner } = playNim(n, 3);
    if (canWinNim(n, 3)) {
      assert.equal(winner, 1, `n=${n} 先手应胜`);
    } else {
      assert.equal(winner, 2, `n=${n} 后手应胜`);
    }
  }
});

test('nim-alt 非法 maxTake 抛错', () => {
  assert.throws(() => canWinNim(5, 0));
});

test('buildTrace 生成帧', () => {
  const frames = buildTrace(DEFAULT_N, DEFAULT_MAX);
  assert.ok(frames.length >= 3);
});
