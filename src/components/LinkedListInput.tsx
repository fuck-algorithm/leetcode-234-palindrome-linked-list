import React, { useState } from 'react';
import { useAlgorithm } from '../context/AlgorithmContext';
import { createLinkedList, isPalindrome } from '../utils/linkedListUtils';
import './LinkedListInput.css';

// 预设链表数据选项
const presetOptions = [
  { label: '回文示例: 1→2→2→1', value: [1, 2, 2, 1] },
  { label: '回文示例: 1→2→3→2→1', value: [1, 2, 3, 2, 1] },
  { label: '非回文示例: 1→2→3→4', value: [1, 2, 3, 4] },
  { label: '单节点: 5', value: [5] },
  { label: '空链表', value: [] }
];

const LinkedListInput: React.FC = () => {
  const { dispatch } = useAlgorithm();
  const [inputValue, setInputValue] = useState('1,2,2,1');
  const [error, setError] = useState('');

  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setError('');
  };

  // 处理预设选择
  const handlePresetSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedIndex = parseInt(e.target.value);
    if (selectedIndex >= 0 && selectedIndex < presetOptions.length) {
      setInputValue(presetOptions[selectedIndex].value.join(','));
      setError('');
    }
  };

  // 创建链表
  const handleCreateList = () => {
    try {
      // 解析输入值
      let values: number[] = [];
      if (inputValue.trim()) {
        values = inputValue.split(',').map(val => {
          const num = Number(val.trim());
          if (isNaN(num)) {
            throw new Error(`无效的数字: "${val.trim()}"`);
          }
          return num;
        });
      }

      // 创建链表
      const list = createLinkedList(values);
      
      // 预计算是否为回文
      const result = isPalindrome(list);
      
      // 更新状态
      dispatch({ type: 'SET_LIST', payload: list });
      dispatch({ 
        type: 'UPDATE_RESULT', 
        payload: { 
          isPalindrome: result,
          comparisons: [] // 初始化为空数组，会在比较阶段填充
        } 
      });
      
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : '输入格式错误');
    }
  };

  // 随机生成链表
  const generateRandomList = (palindrome: boolean) => {
    const length = Math.floor(Math.random() * 5) + 2; // 2-6个节点
    const values: number[] = [];
    
    // 生成随机值
    for (let i = 0; i < Math.ceil(length / 2); i++) {
      values.push(Math.floor(Math.random() * 9) + 1); // 1-9的随机数
    }
    
    // 如果要生成回文链表，镜像复制前半部分
    if (palindrome) {
      // 奇数长度需要跳过中间元素
      const isOdd = length % 2 !== 0;
      const mirrorStart = isOdd ? Math.ceil(length / 2) - 2 : Math.ceil(length / 2) - 1;
      
      for (let i = mirrorStart; i >= 0; i--) {
        values.push(values[i]);
      }
    } else {
      // 非回文链表，确保最后一个元素与对应位置不同
      for (let i = Math.ceil(length / 2) - 2; i >= 0; i--) {
        const val = values[i];
        const newVal = (val % 9) + 1; // 确保不同的值
        values.push(newVal);
      }
      
      // 最后添加一个不同的值，确保不是回文
      values.push((values[0] % 9) + 1);
    }
    
    setInputValue(values.join(','));
  };

  return (
    <div className="linked-list-input">
      <h3>链表配置</h3>
      
      <div className="input-group">
        <label htmlFor="list-input">输入链表值（逗号分隔）:</label>
        <div className="input-row">
          <input
            id="list-input"
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="例如: 1,2,2,1"
          />
          <button onClick={handleCreateList} className="create-button">
            创建
          </button>
        </div>
        {error && <div className="error-message">{error}</div>}
      </div>
      
      <div className="presets">
        <label htmlFor="preset-select">选择预设:</label>
        <select 
          id="preset-select" 
          onChange={handlePresetSelect}
          defaultValue="-1"
        >
          <option value="-1" disabled>选择预设链表...</option>
          {presetOptions.map((option, index) => (
            <option key={index} value={index}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      
      <div className="random-buttons">
        <button onClick={() => generateRandomList(true)} className="random-button palindrome">
          生成随机回文链表
        </button>
        <button onClick={() => generateRandomList(false)} className="random-button non-palindrome">
          生成随机非回文链表
        </button>
      </div>
    </div>
  );
};

export default LinkedListInput; 