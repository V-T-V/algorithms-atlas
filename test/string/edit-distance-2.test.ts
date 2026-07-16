import { test } from 'node:test';
import assert from 'node:assert/strict';
import { editDistance2 } from '../../src/algorithms/string/edit-distance-2/impl.ts';

test('editDistance2 基本距离', () => {
  assert.equal(editDistance2('', '').distance, 0);
  assert.equal(editDistance2('sunday', 'saturday').distance, 3);
  assert.equal(editDistance2('kitten', 'sitting').distance, 3);
  assert.equal(editDistance2('abc', 'abc').distance, 0);
  assert.equal(editDistance2('', 'abc').distance, 3);
});

test('editDistance2 操作序列能把 a 变成 b', () => {
  // 严格模拟操作序列：从 a 出发执行 ops，结果应等于 b
  const a = 'sunday';
  const b = 'saturday';
  const { ops, distance } = editDistance2(a, b);
  // 把 a 装进可变数组；按 ops 重建 b
  let ai = 0;
  let bi = 0;
  let out = '';
  for (const op of ops) {
    if (op === 'keep') {
      out += a[ai];
      ai++;
      bi++;
    } else if (op === 'replace') {
      out += b[bi];
      ai++;
      bi++;
    } else if (op === 'insert') {
      out += b[bi];
      bi++;
    } else {
      // delete
      ai++;
    }
  }
  assert.equal(out, b, '操作序列重建结果应等于 b');
  assert.equal(ops.filter((o) => o !== 'keep').length, distance);
});

test('editDistance2 钩子被调用', () => {
  let traces = 0;
  let done = -1;
  editDistance2('sunday', 'saturday', {
    onTrace: () => traces++,
    onDone: (d) => (done = d),
  });
  assert.ok(traces >= 8, '应回溯多步操作');
  assert.equal(done, 3);
});
