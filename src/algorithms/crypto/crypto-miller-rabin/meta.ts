// Miller-Rabin 素性测试（Miller-Rabin Primality）· 元数据
import type { AlgorithmMeta } from '../../../types.ts';
export const meta: AlgorithmMeta = {
  id: 'crypto-miller-rabin',
  categoryId: 'crypto',
  title: { zh: 'Miller-Rabin 素性测试', en: 'Miller-Rabin Primality' },
  summary: { zh: '概率素性测试，密码学常用。', en: 'Probabilistic primality test.' },
  description: {
    zh: 'Miller-Rabin 是 RSA 等公钥密码生成大素数的标准概率测试，对每个基以 1/4 错误率判定，多轮后极可靠。',
    en: 'Miller-Rabin is the standard probabilistic test for generating large primes in RSA; each base errs with prob 1/4.',
  },
  tags: ['crypto', 'primality', 'miller-rabin', 'rsa'],
  complexity: { time: 'O(k log^3 n)', space: 'O(1)' },
};
