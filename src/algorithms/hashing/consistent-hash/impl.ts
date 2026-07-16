// =============================================================================
// 一致性哈希 Consistent Hashing · 纯算法实现
// 零 DOM 依赖，可独立单测。哈希环：服务器与数据键映射到环上，
// 数据顺时针归属到第一个服务器。通过「钩子」暴露分配过程。
// =============================================================================

/** 算法执行过程中的事件钩子。任一可选。 */
export interface ConsistentHashHooks {
  /** 计算某对象的哈希环位置（0..1）。obj 为服务器名或数据键。 */
  onHash?: (obj: string, position: number) => void;
  /** 服务器 server 被放置到环上 position。 */
  onPlaceServer?: (server: string, position: number) => void;
  /** 数据键 key（位置 pos）被分配到服务器 server（位置 serverPos）。 */
  onAssign?: (key: string, pos: number, server: string, serverPos: number) => void;
}

export interface ConsistentRing {
  /** 环上所有节点（服务器，含虚拟节点），按位置升序。 */
  nodes: Array<{ server: string; position: number }>;
  /** 服务器名集合（去重）。 */
  servers: Set<string>;
}

export interface AssignResult {
  /** 数据键 → 归属服务器。 */
  assignment: Map<string, string>;
  /** 各服务器分到的键数。 */
  counts: Map<string, number>;
}

/** 字符串哈希到 [0, 1)。使用简单多项式滚动哈希后归一化。 */
export function hashPosition(obj: string): number {
  let h = 2166136261;
  for (let i = 0; i < obj.length; i++) {
    h ^= obj.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  // 转为无符号 32 位再归一化
  const u = h >>> 0;
  return u / 0x100000000;
}

/**
 * 构建一致性哈希环。
 * @param servers 服务器名列表
 * @param replicas 每台服务器的虚拟节点数（改善均衡）
 */
export function buildRing(servers: readonly string[], replicas = 3): ConsistentRing {
  const nodes: Array<{ server: string; position: number }> = [];
  const set = new Set<string>();
  for (const s of servers) {
    set.add(s);
    for (let v = 0; v < replicas; v++) {
      nodes.push({ server: s, position: hashPosition(`${s}#${v}`) });
    }
  }
  nodes.sort((a, b) => a.position - b.position);
  return { nodes, servers: set };
}

/**
 * 把数据键分配到环上：顺时针找到第一个 position >= keyPos 的服务器节点；
 * 若没有（超过最大位置）则回到环首（环绕）。
 *
 * @param ring 哈希环
 * @param keys 数据键
 * @param hooks 可选事件钩子
 * @returns 分配结果
 */
export function assign(
  ring: ConsistentRing,
  keys: readonly string[],
  hooks: ConsistentHashHooks = {},
): AssignResult {
  const assignment = new Map<string, string>();
  const counts = new Map<string, number>();
  for (const s of ring.servers) counts.set(s, 0);

  for (const key of keys) {
    const pos = hashPosition(key);
    hooks.onHash?.(key, pos);
    // 二分找第一个 position >= pos
    let lo = 0;
    let hi = ring.nodes.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (ring.nodes[mid]!.position < pos) lo = mid + 1;
      else hi = mid;
    }
    let target: { server: string; position: number };
    if (lo < ring.nodes.length) {
      target = ring.nodes[lo]!;
    } else {
      target = ring.nodes[0]!; // 环绕
    }
    assignment.set(key, target.server);
    counts.set(target.server, (counts.get(target.server) ?? 0) + 1);
    hooks.onAssign?.(key, pos, target.server, target.position);
  }
  return { assignment, counts };
}

export interface ConsistentHashResult {
  ring: ConsistentRing;
  assignment: Map<string, string>;
  counts: Map<string, number>;
}

/**
 * 一致性哈希：建环 + 分配。
 *
 * @param servers 服务器名列表
 * @param keys 数据键
 * @param replicas 每台服务器的虚拟节点数
 * @param hooks 可选事件钩子
 * @returns 环、分配表、计数
 */
export function consistentHash(
  servers: readonly string[],
  keys: readonly string[],
  replicas = 3,
  hooks: ConsistentHashHooks = {},
): ConsistentHashResult {
  const ring = buildRing(servers, replicas);
  for (const n of ring.nodes) hooks.onPlaceServer?.(n.server, n.position);
  const { assignment, counts } = assign(ring, keys, hooks);
  return { ring, assignment, counts };
}
