import React, { useMemo } from 'react';
import { StepType } from '../utils/palindromeChecker';
import './CodeDisplay.css';

// Java代码 - 快慢指针法
const TWO_POINTERS_CODE = `public boolean isPalindrome(ListNode head) {
    if (head == null || head.next == null) return true;
    
    // 1. 找到中点
    ListNode slow = head;
    ListNode fast = head;
    while (fast.next != null && fast.next.next != null) {
        slow = slow.next;
        fast = fast.next.next;
    }
    
    // 2. 反转后半部分
    ListNode secondHalf = reverseList(slow.next);
    
    // 3. 比较两半部分
    ListNode firstHalf = head;
    ListNode secondHalfPointer = secondHalf;
    boolean result = true;
    
    while (result && secondHalfPointer != null) {
        if (firstHalf.val != secondHalfPointer.val) {
            result = false;
        }
        firstHalf = firstHalf.next;
        secondHalfPointer = secondHalfPointer.next;
    }
    
    return result;
}

private ListNode reverseList(ListNode head) {
    ListNode prev = null;
    ListNode curr = head;
    
    while (curr != null) {
        ListNode next = curr.next;
        curr.next = prev;
        prev = curr;
        curr = next;
    }
    
    return prev;
}`;

// Java代码 - 数组复制法
const ARRAY_COPY_CODE = `public boolean isPalindrome(ListNode head) {
    List<Integer> vals = new ArrayList<>();
    
    // 1. 将链表值复制到数组中
    ListNode current = head;
    while (current != null) {
        vals.add(current.val);
        current = current.next;
    }
    
    // 2. 使用双指针检查是否为回文
    int front = 0;
    int back = vals.size() - 1;
    while (front < back) {
        if (!vals.get(front).equals(vals.get(back))) {
            return false;
        }
        front++;
        back--;
    }
    
    return true;
}`;

// 步骤类型到代码行的映射 - 快慢指针法
const TWO_POINTERS_LINE_MAP: Record<string, number[]> = {
  [StepType.INITIAL]: [1, 2],
  [StepType.FIND_MIDDLE_START]: [4, 5, 6],
  [StepType.FIND_MIDDLE_STEP]: [7, 8, 9],
  [StepType.FIND_MIDDLE_COMPLETE]: [7, 8, 9],
  [StepType.REVERSE_START]: [12],
  [StepType.REVERSE_STEP]: [32, 33, 34, 35, 36, 37, 38],
  [StepType.REVERSE_COMPLETE]: [12],
  [StepType.COMPARE_START]: [14, 15, 16, 17],
  [StepType.COMPARE_STEP]: [19, 20, 21, 22, 23, 24],
  [StepType.COMPARE_COMPLETE]: [27],
};

// 步骤类型到代码行的映射 - 数组复制法
const ARRAY_COPY_LINE_MAP: Record<string, number[]> = {
  [StepType.INITIAL]: [1, 2],
  [StepType.ARRAY_COPY_START]: [4, 5, 6, 7, 8],
  [StepType.ARRAY_COPY_COMPLETE]: [4, 5, 6, 7, 8],
  [StepType.ARRAY_COMPARE_START]: [11, 12],
  [StepType.ARRAY_COMPARE_STEP]: [13, 14, 15, 16, 17, 18],
  [StepType.ARRAY_COMPARE_COMPLETE]: [21],
};

interface VariableState {
  name: string;
  value: string;
  line: number;
}

interface CodeDisplayProps {
  stepType: StepType;
  algorithmType: 'twoPointers' | 'arrayCopy';
  variables?: Record<string, unknown>;
  positions?: {
    slowIndex?: number;
    fastIndex?: number;
    prevIndex?: number;
    currentIndex?: number;
    nextIndex?: number;
    leftIndex?: number;
    rightIndex?: number;
  };
}

const CodeDisplay: React.FC<CodeDisplayProps> = ({
  stepType,
  algorithmType,
  positions,
}) => {
  const code = algorithmType === 'twoPointers' ? TWO_POINTERS_CODE : ARRAY_COPY_CODE;
  const lineMap = algorithmType === 'twoPointers' ? TWO_POINTERS_LINE_MAP : ARRAY_COPY_LINE_MAP;
  
  const highlightedLines = lineMap[stepType] || [];
  
  // 根据当前步骤生成变量状态
  const variableStates = useMemo((): VariableState[] => {
    const states: VariableState[] = [];
    
    if (algorithmType === 'twoPointers') {
      if (positions?.slowIndex !== undefined && positions.slowIndex >= 0) {
        states.push({ name: 'slow', value: `node[${positions.slowIndex}]`, line: 5 });
      }
      if (positions?.fastIndex !== undefined && positions.fastIndex >= 0) {
        states.push({ name: 'fast', value: `node[${positions.fastIndex}]`, line: 6 });
      }
      if (positions?.prevIndex !== undefined) {
        states.push({ name: 'prev', value: positions.prevIndex >= 0 ? `node[${positions.prevIndex}]` : 'null', line: 32 });
      }
      if (positions?.currentIndex !== undefined) {
        states.push({ name: 'curr', value: positions.currentIndex >= 0 ? `node[${positions.currentIndex}]` : 'null', line: 33 });
      }
      if (positions?.leftIndex !== undefined && positions.leftIndex >= 0) {
        states.push({ name: 'firstHalf', value: `node[${positions.leftIndex}]`, line: 15 });
      }
      if (positions?.rightIndex !== undefined && positions.rightIndex >= 0) {
        states.push({ name: 'secondHalfPointer', value: `node[${positions.rightIndex}]`, line: 16 });
      }
    } else {
      if (positions?.leftIndex !== undefined && positions.leftIndex >= 0) {
        states.push({ name: 'front', value: `${positions.leftIndex}`, line: 11 });
      }
      if (positions?.rightIndex !== undefined && positions.rightIndex >= 0) {
        states.push({ name: 'back', value: `${positions.rightIndex}`, line: 12 });
      }
    }
    
    return states;
  }, [algorithmType, positions]);
  
  const lines = code.split('\n');
  
  // 简单的Java语法高亮
  const highlightSyntax = (line: string): React.ReactNode => {
    const keywords = /\b(public|private|boolean|int|while|if|return|null|true|false|new|void)\b/g;
    const types = /\b(ListNode|List|ArrayList|Integer)\b/g;
    const strings = /"[^"]*"/g;
    const comments = /(\/\/.*$)/g;
    const numbers = /\b(\d+)\b/g;
    
    let result = line;
    const parts: { start: number; end: number; type: string; text: string }[] = [];
    
    // 收集所有匹配
    let match;
    while ((match = keywords.exec(line)) !== null) {
      parts.push({ start: match.index, end: match.index + match[0].length, type: 'keyword', text: match[0] });
    }
    keywords.lastIndex = 0;
    
    while ((match = types.exec(line)) !== null) {
      parts.push({ start: match.index, end: match.index + match[0].length, type: 'type', text: match[0] });
    }
    types.lastIndex = 0;
    
    while ((match = strings.exec(line)) !== null) {
      parts.push({ start: match.index, end: match.index + match[0].length, type: 'string', text: match[0] });
    }
    strings.lastIndex = 0;
    
    while ((match = comments.exec(line)) !== null) {
      parts.push({ start: match.index, end: match.index + match[0].length, type: 'comment', text: match[0] });
    }
    comments.lastIndex = 0;
    
    while ((match = numbers.exec(line)) !== null) {
      parts.push({ start: match.index, end: match.index + match[0].length, type: 'number', text: match[0] });
    }
    numbers.lastIndex = 0;
    
    // 按位置排序
    parts.sort((a, b) => a.start - b.start);
    
    // 构建结果
    if (parts.length === 0) {
      return <span>{result}</span>;
    }
    
    const elements: React.ReactNode[] = [];
    let lastEnd = 0;
    
    parts.forEach((part, index) => {
      // 检查是否与前一个重叠
      if (part.start < lastEnd) return;
      
      // 添加前面的普通文本
      if (part.start > lastEnd) {
        elements.push(<span key={`text-${index}`}>{line.slice(lastEnd, part.start)}</span>);
      }
      
      // 添加高亮部分
      elements.push(
        <span key={`${part.type}-${index}`} className={`code-${part.type}`}>
          {part.text}
        </span>
      );
      
      lastEnd = part.end;
    });
    
    // 添加剩余文本
    if (lastEnd < line.length) {
      elements.push(<span key="text-end">{line.slice(lastEnd)}</span>);
    }
    
    return <>{elements}</>;
  };
  
  // 获取某行的变量值
  const getVariablesForLine = (lineNum: number): VariableState[] => {
    return variableStates.filter(v => v.line === lineNum);
  };
  
  return (
    <div className="code-display">
      <div className="code-header">
        <span className="code-lang">Java</span>
        <span className="code-title">
          {algorithmType === 'twoPointers' ? '快慢指针法' : '数组复制法'}
        </span>
      </div>
      <div className="code-content">
        <pre>
          {lines.map((line, index) => {
            const lineNum = index + 1;
            const isHighlighted = highlightedLines.includes(lineNum);
            const lineVariables = getVariablesForLine(lineNum);
            
            return (
              <div
                key={lineNum}
                className={`code-line ${isHighlighted ? 'highlighted' : ''}`}
              >
                <span className="line-number">{lineNum}</span>
                <span className="line-content">
                  {highlightSyntax(line)}
                </span>
                {lineVariables.length > 0 && (
                  <span className="variable-values">
                    {lineVariables.map((v, i) => (
                      <span key={i} className="variable-badge">
                        {v.name} = {v.value}
                      </span>
                    ))}
                  </span>
                )}
              </div>
            );
          })}
        </pre>
      </div>
    </div>
  );
};

export default CodeDisplay;
