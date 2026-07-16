import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  runBlackboard,
  type KnowledgeSource,
} from '../../src/algorithms/design/design-blackboard/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-blackboard/trace.ts';
test('blackboard 收敛', () => {
  const b = new Map<string, string>();
  const ks: KnowledgeSource[] = [
    { name: 'A', canHandle: (m) => !m.has('done'), apply: (m) => m.set('done', '1') },
  ];
  runBlackboard(b, ks, 3);
  assert.equal(b.get('done'), '1');
});
test('blackboard trace 非空', () => assert.ok(buildTrace().length > 0));
