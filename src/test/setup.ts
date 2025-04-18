import '@testing-library/jest-dom';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import matchers from '@testing-library/jest-dom/matchers';

// 扩展expect以支持DOM断言
expect.extend(matchers);

// 每个测试后清理
afterEach(() => {
  cleanup();
}); 