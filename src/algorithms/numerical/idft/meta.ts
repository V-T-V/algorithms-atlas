// 逆离散傅里叶变换（IDFT）· 元数据

import type { AlgorithmMeta } from '../../../types.ts';

export const meta: AlgorithmMeta = {
  id: 'numerical-idft',
  categoryId: 'numerical',
  title: { zh: '逆离散傅里叶变换（IDFT）', en: 'Inverse Discrete Fourier Transform (IDFT)' },
  summary: {
    zh: '把频域复序列还原为时域：x_n = (1/N)·Σ X_k·e^(+2πi·kn/N)。',
    en: 'Reconstruct time domain from frequency domain: x_n = (1/N)·Σ X_k·e^(+2πi·kn/N).',
  },
  description: {
    zh:
      '逆离散傅里叶变换（Inverse DFT, IDFT）：DFT 的逆运算，从频域复序列 X_k 还原时域序列 x_n。' +
      '\n- 公式：x_n = (1/N) · Σ_{k=0}^{N−1} X_k · e^(+2πi·kn/N)' +
      '\n- 与 DFT 唯一区别：旋转因子符号取正，最后除以 N。' +
      '\n- 性质：DFT 与 IDFT 互逆（合成后再分解、或分解后再合成得原序列，允许数值误差）。' +
      '\n- 应用：频域滤波后还原信号、频谱合成、压缩重建。' +
      '\n- 复杂度 O(N²)；IFFT 可降至 O(N log N)。',
    en:
      'Inverse DFT (IDFT): the inverse of DFT, reconstructing the time-domain sequence x_n from the ' +
      'frequency-domain complex sequence X_k. ' +
      '\n- Formula: x_n = (1/N) · Σ_{k=0}^{N−1} X_k · e^(+2πi·kn/N) ' +
      '\n- Differs from DFT only in the sign of the twiddle factor and the final 1/N scaling. ' +
      '\n- Property: DFT and IDFT are inverses (compose then decompose, or vice versa, recovers the original up to numerical error). ' +
      '\n- Applications: time-domain reconstruction after filtering, spectral synthesis, compression reconstruction. ' +
      '\nComplexity O(N²); IFFT reduces to O(N log N).',
  },
  tags: ['numerical', 'idft', 'fourier', 'signal', 'inverse'],
  complexity: { time: 'O(N²)', space: 'O(N)' },
};
