import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CsvPipeline, JsonPipeline } from '../../src/algorithms/design/design-template/impl.ts';
import { buildTrace, DEFAULT_INPUT } from '../../src/algorithms/design/design-template/trace.ts';

test('template CSV 解析', () => {
  const out = new CsvPipeline().run('a,b\n1,2');
  assert.deepEqual(JSON.parse(out), [
    ['a', 'b'],
    ['1', '2'],
  ]);
});
test('template JSON 解析', () => {
  const out = new JsonPipeline().run('[1,2,3]');
  assert.deepEqual(JSON.parse(out), [1, 2, 3]);
});
test('template 空输入', () => {
  const out = new CsvPipeline().run('');
  assert.deepEqual(JSON.parse(out), []);
});
test('template 步骤被调用', () => {
  const steps: string[] = [];
  new CsvPipeline({ onStep: (s) => steps.push(s) }).run('a,b');
  assert.ok(steps.includes('read'));
  assert.ok(steps.includes('parse'));
  assert.ok(steps.includes('output'));
});
test('buildTrace 生成帧', () => {
  assert.ok(buildTrace(DEFAULT_INPUT).length >= 3);
});
