import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ImageProxy } from '../../src/algorithms/design/design-proxy/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/design/design-proxy/trace.ts';

test('proxy 延迟加载', () => {
  const p = new ImageProxy('img', 5);
  assert.equal(p.isLoaded(), false);
  p.render();
  assert.equal(p.isLoaded(), true);
});
test('proxy 缓存第二次', () => {
  let loads = 0;
  const p = new ImageProxy('img', 5, {
    onLoad: () => {
      loads++;
    },
  });
  p.render();
  p.render();
  assert.equal(loads, 1);
});
test('proxy 不同 key 独立加载', () => {
  let loads = 0;
  const pa = new ImageProxy('a', 5, {
    onLoad: () => {
      loads++;
    },
  });
  const pb = new ImageProxy('b', 5, {
    onLoad: () => {
      loads++;
    },
  });
  pa.render();
  pb.render();
  assert.equal(loads, 2);
});
test('proxy real render 一致', () => {
  const p = new ImageProxy('x', 7);
  const r = p.render();
  assert.ok(r.includes('x'));
  assert.ok(r.includes('cost=7'));
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace(DEFAULT_INPUT).length >= 3);
});
