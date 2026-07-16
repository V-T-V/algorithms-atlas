import { test } from 'node:test';
import assert from 'node:assert/strict';
import { proxmapSort, type ProxmapHooks } from '../../src/algorithms/sorting/sort-proxmap/impl.ts';

test('proxmapSort 基本', () => {
  assert.deepEqual(proxmapSort([]), []);
  assert.deepEqual(proxmapSort([1]), [1]);
  assert.deepEqual(proxmapSort([2, 1]), [1, 2]);
  assert.deepEqual(
    proxmapSort([29, 10, 14, 37, 13, 25, 41, 8, 22, 30]),
    [8, 10, 13, 14, 22, 25, 29, 30, 37, 41],
  );
});
test('proxmapSort 逆序/重复', () => {
  assert.deepEqual(proxmapSort([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
  assert.deepEqual(proxmapSort([3, 3, 1, 2, 2, 1]), [1, 1, 2, 2, 3, 3]);
});
test('proxmapSort 钩子', () => {
  let c = 0;
  proxmapSort([3, 1, 2], { onHit: () => c++ } as ProxmapHooks);
  assert.ok(c >= 1);
});
