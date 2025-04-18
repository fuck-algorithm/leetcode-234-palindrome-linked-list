import React from 'react';
import { useAlgorithm } from '../context/AlgorithmContext';
import { AlgorithmStep } from '../types';
import './ResultDisplay.css';

// 结果显示组件
const ResultDisplay: React.FC = () => {
  const { state } = useAlgorithm();
  const { result, animation } = state;
  const { step } = animation;
  
  // 只有在结果步骤才显示结果
  if (step !== AlgorithmStep.RESULT) {
    return null;
  }
  
  return (
    <div className={`result-display ${result.isPalindrome ? 'success' : 'failure'}`}>
      <div className="result-card">
        <div className="result-header">
          <h2>算法执行结果</h2>
        </div>
        
        <div className="result-content">
          <div className="result-icon">
            {result.isPalindrome ? (
              <span className="success-icon">✓</span>
            ) : (
              <span className="failure-icon">✗</span>
            )}
          </div>
          
          <div className="result-text">
            <h3>
              {result.isPalindrome 
                ? '该链表是回文链表' 
                : '该链表不是回文链表'}
            </h3>
            <p>
              {result.isPalindrome 
                ? '从左到右和从右到左读取链表得到相同的值序列' 
                : '从左到右和从右到左读取链表得到不同的值序列'}
            </p>
          </div>
        </div>
        
        <div className="result-details">
          <h4>算法复杂度分析</h4>
          <div className="complexity">
            <div className="complexity-item">
              <span className="complexity-label">时间复杂度:</span>
              <span className="complexity-value">O(n)</span>
              <p className="complexity-desc">
                其中 n 是链表长度，我们需要遍历整个链表。
              </p>
            </div>
            <div className="complexity-item">
              <span className="complexity-label">空间复杂度:</span>
              <span className="complexity-value">O(1)</span>
              <p className="complexity-desc">
                该算法只使用常数级别的额外空间（几个指针变量）。
              </p>
            </div>
          </div>
        </div>
        
        <div className="result-footer">
          <div className="algorithm-steps">
            <h4>算法步骤回顾</h4>
            <ol>
              <li>使用快慢指针找到链表中点</li>
              <li>反转链表的后半部分</li>
              <li>比较前半部分和反转后的后半部分</li>
              <li>恢复链表原始结构（可选）</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay; 