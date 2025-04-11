import React, { useState, useEffect, useRef } from 'react';
import { LinkedList } from '../models/LinkedList';
import { STORAGE_KEYS } from '../utils/constants';

interface LinkedListInputProps {
  onListCreated: (list: LinkedList<number>) => void;
}

const LinkedListInput: React.FC<LinkedListInputProps> = ({ onListCreated }) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastHiding, setToastHiding] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Toast notification function
  const showNotification = (message: string) => {
    // If a toast is already showing, clear its timeout
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
      setToastHiding(false);
    }
    
    setToastMessage(message);
    setShowToast(true);
    
    // Auto-hide after 3 seconds
    toastTimeoutRef.current = setTimeout(() => {
      setToastHiding(true);
      
      // Wait for animation to complete before hiding
      setTimeout(() => {
        setShowToast(false);
        setToastHiding(false);
      }, 500);
    }, 3000);
  };

  // Clear timeouts on unmount
  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  // 在组件挂载时从 localStorage 加载保存的链表值
  useEffect(() => {
    const savedListValues = localStorage.getItem(STORAGE_KEYS.LINKED_LIST);
    if (savedListValues) {
      try {
        const values = JSON.parse(savedListValues);
        if (Array.isArray(values) && values.length > 0) {
          setInputValue(values.join(','));
        }
      } catch (e) {
        console.error('Failed to parse saved linked list:', e);
      }
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setError(null);
  };

  // 生成随机链表数据
  const generateRandomList = () => {
    // 随机决定链表长度 (3-9)
    const length = Math.floor(Math.random() * 7) + 3;
    
    // 生成链表数据的模式: 1=回文, 2=几乎回文, 3=非回文
    // 平衡概率: 回文(40%), 几乎回文(30%), 非回文(30%)
    const patternRoll = Math.random();
    let pattern: number;
    let patternName: string;
    
    if (patternRoll < 0.4) {
      pattern = 1; // 回文
      patternName = "回文链表";
    } else if (patternRoll < 0.7) {
      pattern = 2; // 几乎回文
      patternName = "几乎回文链表";
    } else {
      pattern = 3; // 非回文
      patternName = "非回文链表";
    }
    
    let values: number[] = [];
    
    if (pattern === 1) {
      // 生成回文链表
      const halfLength = Math.floor(length / 2);
      const firstHalf: number[] = [];
      
      // 生成前半部分 (1-9之间的随机数)
      for (let i = 0; i < halfLength; i++) {
        firstHalf.push(Math.floor(Math.random() * 9) + 1);
      }
      
      // 构建回文链表
      values = [...firstHalf];
      
      // 如果长度是奇数，添加中间元素
      if (length % 2 !== 0) {
        values.push(Math.floor(Math.random() * 9) + 1);
      }
      
      // 添加镜像部分
      for (let i = firstHalf.length - 1; i >= 0; i--) {
        values.push(firstHalf[i]);
      }
    } else if (pattern === 2) {
      // 生成几乎回文的链表 (只有一个位置不同)
      const halfLength = Math.floor(length / 2);
      const firstHalf: number[] = [];
      
      // 生成前半部分
      for (let i = 0; i < halfLength; i++) {
        firstHalf.push(Math.floor(Math.random() * 9) + 1);
      }
      
      // 构建基本回文
      values = [...firstHalf];
      
      // 如果长度是奇数，添加中间元素
      if (length % 2 !== 0) {
        values.push(Math.floor(Math.random() * 9) + 1);
      }
      
      // 添加镜像部分
      for (let i = firstHalf.length - 1; i >= 0; i--) {
        values.push(firstHalf[i]);
      }
      
      // 修改一个随机位置的值，使其不再是回文
      const changeIndex = Math.floor(Math.random() * values.length);
      let newValue;
      do {
        newValue = Math.floor(Math.random() * 9) + 1;
      } while(newValue === values[changeIndex]);
      
      values[changeIndex] = newValue;
    } else {
      // 生成非回文链表
      for (let i = 0; i < length; i++) {
        values.push(Math.floor(Math.random() * 9) + 1);
      }
      
      // 确保不是回文
      let isPalindrome = true;
      while (isPalindrome) {
        isPalindrome = true;
        for (let i = 0; i < Math.floor(values.length / 2); i++) {
          if (values[i] !== values[values.length - 1 - i]) {
            isPalindrome = false;
            break;
          }
        }
        
        if (isPalindrome) {
          // 如果仍然是回文，修改最后一个元素
          const lastIndex = values.length - 1;
          let newValue;
          do {
            newValue = Math.floor(Math.random() * 9) + 1;
          } while(newValue === values[lastIndex]);
          
          values[lastIndex] = newValue;
        }
      }
    }
    
    // 更新输入值
    setInputValue(values.join(','));
    
    // 创建链表
    const linkedList = new LinkedList<number>(values);
    
    // 保存到 localStorage
    localStorage.setItem(STORAGE_KEYS.LINKED_LIST, JSON.stringify(values));
    
    // 显示通知
    showNotification(`已生成${values.length}个节点的${patternName}`);
    
    // 通知父组件
    onListCreated(linkedList);
  };

  const handleCreateList = () => {
    try {
      // Parse the input as a comma-separated list of numbers
      const values = inputValue
        .split(',')
        .map((val) => val.trim())
        .filter((val) => val !== '')
        .map((val) => {
          const num = Number(val);
          if (isNaN(num)) {
            throw new Error(`"${val}" 不是一个有效的数字`);
          }
          return num;
        });

      if (values.length === 0) {
        setError('请至少输入一个数字');
        return;
      }

      // Create the linked list
      const linkedList = new LinkedList<number>(values);
      
      // 保存到 localStorage
      localStorage.setItem(STORAGE_KEYS.LINKED_LIST, JSON.stringify(values));
      
      onListCreated(linkedList);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCreateList();
    }
  };

  const examples = [
    [1, 2, 2, 1],
    [1, 2, 3, 2, 1],
    [1, 2, 3, 4, 5],
  ];

  return (
    <div className="linked-list-input" style={{ margin: '20px 0', position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="输入用逗号分隔的数字（例如：1,2,2,1）"
          style={{
            padding: '8px 12px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            flex: 1,
          }}
        />
        <button
          onClick={generateRandomList}
          title="生成随机链表数据"
          className="dice-button"
        >
          <span className="dice-icon">🎲</span>
        </button>
        <button
          onClick={handleCreateList}
          style={{
            padding: '8px 16px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          创建链表
        </button>
      </div>

      {error && (
        <div
          style={{
            color: '#e74c3c',
            marginTop: '10px',
            fontSize: '14px',
          }}
        >
          错误: {error}
        </div>
      )}

      <div style={{ marginTop: '15px' }}>
        <div style={{ fontSize: '14px', color: '#7f8c8d', marginBottom: '8px' }}>
          示例:
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {examples.map((example, index) => (
            <button
              key={index}
              onClick={() => setInputValue(example.join(','))}
              style={{
                padding: '6px 12px',
                backgroundColor: '#f1f1f1',
                border: '1px solid #ddd',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              {example.join(', ')}
            </button>
          ))}
        </div>
      </div>

      {/* Toast notification */}
      {showToast && (
        <div className={`toast-notification ${toastHiding ? 'hiding' : ''}`}>
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default LinkedListInput; 