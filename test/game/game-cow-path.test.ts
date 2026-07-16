import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cowPath } from '../../src/algorithms/game/game-cow-path/impl.ts';
import { buildTrace } from '../../src/algorithms/game/game-cow-path/trace.ts';
test('奶牛路径找到右侧目标', () => {
  const r = cowPath(3);
  assert.equal(r.dir, 1);
  assert.ok(r.ratio <= 9.01);
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace().length > 0);
});
