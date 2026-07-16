import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'dp-music-3',
  categoryId: 'dp',
  title: { zh: '歌曲列表（不同歌间隔 k）', en: 'Playlist with Cool-down k' },
  summary: {
    zh: '从 n 首歌、目标长度 L 的歌单，每首歌与前 k 首不同（歌单可循环），求方案数。',
    en: 'Count playlists of length L from n unique songs; same song repeats only after k other songs.',
  },
  description: {
    zh: 'dp[i]=长度 i 的合法歌单数。dp[i]=dp[i-1]*(n-used)；used=已用且可重用的歌数。',
    en: 'dp[i]=dp[i-1]*(n-used); used=number of songs played and reusable.',
  },
  tags: ['dp', 'combinatorics', 'playlist'],
  complexity: { time: 'O(L)', space: 'O(L)' },
};
