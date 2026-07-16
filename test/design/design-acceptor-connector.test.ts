import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Acceptor, Connector } from '../../src/algorithms/design/design-acceptor-connector/impl.ts';
import { buildTrace } from '../../src/algorithms/design/design-acceptor-connector/trace.ts';
test('acceptor/connector 创建 handler', () => {
  assert.equal(new Acceptor().accept('p').peer, 'p');
  assert.equal(new Connector().connect('q').peer, 'q');
});
test('acceptor-connector trace 非空', () => assert.ok(buildTrace().length > 0));
