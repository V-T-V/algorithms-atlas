// =============================================================================
// 一致性哈希 · 录制帧序列
// 用 setGraph 展示哈希环：服务器节点 x/y 归一化到圆周（position→(cos,sin)），
// role：服务器='pivot'，数据键='compare'，当前分配的键-服务器对='final'；
// setAux 展示各服务器分到的键数。
// =============================================================================

import type { BarRole, Frame, GraphEdge, GraphNode } from '../../../types.ts';
import { TraceRecorder } from '../../../core/recorder.ts';
import { consistentHash, type ConsistentHashHooks } from './impl.ts';

export const DEFAULT_SERVERS = ['S1', 'S2', 'S3'];
export const DEFAULT_KEYS = [
  'user:1',
  'user:2',
  'user:3',
  'user:4',
  'user:5',
  'user:6',
  'user:7',
  'user:8',
];
export const DEFAULT_REPLICAS = 4;

/** position(0..1) → 单位圆坐标（中心 0.5，半径 0.4，翻转 y）。 */
function toCircleXY(position: number): { x: number; y: number } {
  const theta = position * 2 * Math.PI;
  return {
    x: 0.5 + 0.4 * Math.cos(theta),
    y: 0.5 - 0.4 * Math.sin(theta), // 翻转 y 使顺时针为正方向
  };
}

/** 录制演示帧序列。 */
export function buildTrace(
  servers: string[] = DEFAULT_SERVERS,
  keys: string[] = DEFAULT_KEYS,
  replicas: number = DEFAULT_REPLICAS,
): Frame[] {
  const rec = new TraceRecorder();
  const counts = new Map<string, number>();
  for (const s of servers) counts.set(s, 0);
  let currentKey: string | null = null;
  let currentServer: string | null = null;
  const placedServers = new Map<string, number[]>(); // server → positions

  const render = (note: { zh: string; en: string }): void => {
    const nodes: GraphNode[] = [];
    const edges: GraphEdge[] = [];

    // 服务器节点（含虚拟节点，合并显示同台服务器的多个位置）
    for (const s of placedServers.keys()) {
      for (const pos of placedServers.get(s)!) {
        const { x, y } = toCircleXY(pos);
        nodes.push({
          id: `srv-${s}-${pos.toFixed(4)}`,
          label: s,
          x,
          y,
          role: currentServer === s ? 'final' : 'pivot',
        });
      }
    }

    // 数据键节点（放在稍内圈）
    if (currentKey) {
      // 用 key 的哈希位置画在内圈
      let h = 2166136261;
      for (let i = 0; i < currentKey.length; i++) {
        h ^= currentKey.charCodeAt(i);
        h = Math.imul(h, 16777619);
      }
      const pos = (h >>> 0) / 0x100000000;
      const theta = pos * 2 * Math.PI;
      nodes.push({
        id: `key-${currentKey}`,
        label: currentKey,
        x: 0.5 + 0.22 * Math.cos(theta),
        y: 0.5 - 0.22 * Math.sin(theta),
        role: 'compare',
      });
      // 连到归属服务器
      if (currentServer) {
        const srvPos = placedServers.get(currentServer)!.find(() => true)!;
        edges.push({
          from: `key-${currentKey}`,
          to: `srv-${currentServer}-${srvPos.toFixed(4)}`,
          role: 'final',
        });
      }
    }

    const aux = servers.map((s) => ({
      label: s,
      value: String(counts.get(s) ?? 0),
      role: (currentServer === s ? 'final' : 'pivot') as BarRole,
    }));
    aux.push({
      label: '当前键',
      value: currentKey ?? '—',
      role: 'compare' as BarRole,
    });
    aux.push({
      label: '归属',
      value: currentServer ?? '—',
      role: 'final' as BarRole,
    });

    rec.begin(note).setGraph(nodes, edges).setAux(aux).commit();
    currentKey = null;
    currentServer = null;
  };

  render({
    zh: `一致性哈希环：${servers.length} 台服务器，每台 ${replicas} 虚拟节点`,
    en: `Hash ring: ${servers.length} servers, ${replicas} vnodes each`,
  });

  const hooks: ConsistentHashHooks = {
    onPlaceServer: (server, position) => {
      if (!placedServers.has(server)) placedServers.set(server, []);
      placedServers.get(server)!.push(position);
    },
    onHash: (key, pos) => {
      currentKey = key;
      render({
        zh: `数据键「${key}」哈希到环位置 ${pos.toFixed(4)}`,
        en: `Key "${key}" hashes to ${pos.toFixed(4)}`,
      });
    },
    onAssign: (key, pos, server, serverPos) => {
      currentKey = key;
      currentServer = server;
      counts.set(server, (counts.get(server) ?? 0) + 1);
      render({
        zh: `「${key}」(${pos.toFixed(4)}) 顺时针归属到 ${server} (${serverPos.toFixed(4)})`,
        en: `"${key}" (${pos.toFixed(4)}) → ${server} (${serverPos.toFixed(4)}) clockwise`,
      });
    },
  };

  consistentHash(servers, keys, replicas, hooks);

  // 终态：所有键已分配，展示各服务器计数
  const nodes: GraphNode[] = [];
  for (const s of placedServers.keys()) {
    for (const pos of placedServers.get(s)!) {
      const { x, y } = toCircleXY(pos);
      nodes.push({ id: `srv-${s}-${pos.toFixed(4)}`, label: s, x, y, role: 'final' });
    }
  }
  rec
    .begin({
      zh: `分配完成：${keys.length} 个键 → ${servers.length} 台服务器`,
      en: `Done: ${keys.length} keys → ${servers.length} servers`,
    })
    .setGraph(nodes, [])
    .setAux(
      servers.map((s) => ({
        label: s,
        value: String(counts.get(s) ?? 0),
        role: 'final' as BarRole,
      })),
    )
    .commit();

  return rec.build();
}
