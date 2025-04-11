import { LinkedList, ListNode } from '../models/LinkedList';
import { PointerPositions } from './StepData';

// Approach 1: Convert to array and check
export const isPalindromeUsingArray = <T>(list: LinkedList<T>): boolean => {
  const arr = list.toArray();
  const len = arr.length;
  
  for (let i = 0; i < len / 2; i++) {
    if (arr[i] !== arr[len - 1 - i]) return false;
  }
  
  return true;
};

// 步骤类型定义
export enum StepType {
  INITIAL = 'initial',
  // 数组方法的步骤
  ARRAY_COPY_START = 'arrayCopyStart',
  ARRAY_COPY_COMPLETE = 'arrayCopyComplete',
  ARRAY_COMPARE_START = 'arrayCompareStart',
  ARRAY_COMPARE_STEP = 'arrayCompareStep',
  ARRAY_COMPARE_COMPLETE = 'arrayCompareComplete',
  // 快慢指针方法的步骤
  FIND_MIDDLE_START = 'findMiddleStart',
  FIND_MIDDLE_STEP = 'findMiddleStep',
  FIND_MIDDLE_COMPLETE = 'findMiddleComplete',
  REVERSE_START = 'reverseStart',
  REVERSE_STEP = 'reverseStep',
  REVERSE_COMPLETE = 'reverseComplete',
  COMPARE_START = 'compareStart',
  COMPARE_STEP = 'compareStep',
  COMPARE_COMPLETE = 'compareComplete'
}

// 节点状态
export enum NodeStatus {
  NORMAL = 'normal',
  SLOW_POINTER = 'slowPointer',
  FAST_POINTER = 'fastPointer',
  PREV_POINTER = 'prevPointer',
  CURRENT_POINTER = 'currentPointer',
  NEXT_POINTER = 'nextPointer',
  FIRST_HALF = 'firstHalf',
  SECOND_HALF = 'secondHalf',
  COMPARED = 'compared',
  MISMATCH = 'mismatch'
}

export interface NodeData<T> {
  value: T;
  position: number;
  status?: NodeStatus[];
  next?: number | null;
}

export interface StepData<T> {
  type: StepType;
  nodes: NodeData<T>[];
  description: string;
  comparedNodes?: { left: number; right: number }[];
  isEvenLength?: boolean;
  positions?: PointerPositions;
}

// Approach 2: Using slow and fast pointers to find middle, reverse second half, and compare
export const isPalindromeUsingTwoPointers = <T>(list: LinkedList<T>): {
  result: boolean;
  steps: StepData<T>[];
} => {
  if (list.isEmpty() || !list.head) {
    return { 
      result: true, 
      steps: [{
        type: StepType.INITIAL,
        nodes: [],
        description: '链表为空，视为回文'
      }] 
    };
  }

  const steps: StepData<T>[] = [];
  
  // 创建一个辅助函数，用于生成节点当前状态的快照
  const createNodeSnapshot = (
    head: ListNode<T> | null, 
    pointers: Record<string, ListNode<T> | null> = {}
  ): NodeData<T>[] => {
    const snapshot: NodeData<T>[] = [];
    let current = head;
    let position = 0;
    
    while (current) {
      const status: NodeStatus[] = [];
      
      // 检查每个节点是否是某个指针的位置
      Object.entries(pointers).forEach(([key, node]) => {
        if (node === current) {
          switch (key) {
            case 'slow':
              status.push(NodeStatus.SLOW_POINTER);
              break;
            case 'fast':
              status.push(NodeStatus.FAST_POINTER);
              break;
            case 'prev':
              status.push(NodeStatus.PREV_POINTER);
              break;
            case 'current':
              status.push(NodeStatus.CURRENT_POINTER);
              break;
            case 'next':
              status.push(NodeStatus.NEXT_POINTER);
              break;
            case 'firstHalf':
              status.push(NodeStatus.FIRST_HALF);
              break;
            case 'secondHalf':
              status.push(NodeStatus.SECOND_HALF);
              break;
          }
        }
      });
      
      snapshot.push({ 
        value: current.val, 
        position, 
        status: status.length > 0 ? status : [NodeStatus.NORMAL],
        next: current.next ? position + 1 : null
      });
      
      current = current.next;
      position++;
    }
    
    return snapshot;
  };

  // Initial state
  steps.push({
    type: StepType.INITIAL,
    nodes: createNodeSnapshot(list.head),
    description: '初始链表状态'
  });

  // Step 1: Find the middle of the linked list using slow and fast pointers
  let slow: ListNode<T> | null = list.head;
  let fast: ListNode<T> | null = list.head;
  
  steps.push({
    type: StepType.FIND_MIDDLE_START,
    nodes: createNodeSnapshot(list.head, { slow, fast }),
    description: '开始使用快慢指针查找中间节点: slow和fast都指向头节点',
    positions: {
      slowIndex: 0,
      fastIndex: 0
    }
  });
  
  let isEvenLength = false;
  
  while (fast?.next && fast.next.next) {
    slow = slow?.next || null;
    fast = fast.next.next;
    
    // 获取指针位置
    const slowIndex = getNodePosition(list.head, slow);
    const fastIndex = getNodePosition(list.head, fast);
    
    steps.push({
      type: StepType.FIND_MIDDLE_STEP,
      nodes: createNodeSnapshot(list.head, { slow, fast }),
      description: '慢指针移动一步，快指针移动两步',
      positions: {
        slowIndex,
        fastIndex
      }
    });
  }
  
  // 判断链表长度是奇数还是偶数
  if (fast?.next) {
    isEvenLength = true;
    slow = slow?.next || null; // 对于偶数链表，将slow再前进一步
    
    // 更新指针位置
    const slowIndex = getNodePosition(list.head, slow);
    const fastIndex = getNodePosition(list.head, fast);
    
    steps.push({
      type: StepType.FIND_MIDDLE_STEP,
      nodes: createNodeSnapshot(list.head, { slow, fast }),
      description: '链表长度为偶数，慢指针再移动一步',
      positions: {
        slowIndex,
        fastIndex
      }
    });
  }
  
  // 最终中间位置
  const slowIndex = getNodePosition(list.head, slow);
  const fastIndex = getNodePosition(list.head, fast);
  
  steps.push({
    type: StepType.FIND_MIDDLE_COMPLETE,
    nodes: createNodeSnapshot(list.head, { slow }),
    description: isEvenLength ? 
      '找到中间位置，链表长度为偶数，慢指针指向中间偏右的节点' : 
      '找到中间位置，链表长度为奇数，慢指针指向中间节点',
    isEvenLength,
    positions: {
      slowIndex,
      fastIndex
    }
  });

  // Step 2: Reverse the second half of the linked list
  let prev: ListNode<T> | null = null;
  let current = slow;
  
  // 获取指针位置
  const prevIndex = getNodePosition(list.head, prev);
  const currentIndex = getNodePosition(list.head, current);
  const nextIndex = getNodePosition(list.head, current?.next || null);
  
  steps.push({
    type: StepType.REVERSE_START,
    nodes: createNodeSnapshot(list.head, { prev, current }),
    description: '开始反转链表的后半部分，prev为null，current指向中间节点',
    positions: {
      prevIndex,
      currentIndex,
      nextIndex
    }
  });
  
  while (current) {
    const next = current.next;
    
    // 获取当前循环的指针位置
    const currentPrevIndex = getNodePosition(list.head, prev);
    const currentCurrentIndex = getNodePosition(list.head, current);
    const currentNextIndex = getNodePosition(list.head, next);
    
    steps.push({
      type: StepType.REVERSE_STEP,
      nodes: createNodeSnapshot(list.head, { prev, current, next: next }),
      description: '保存next指针，准备反转current的next指向prev',
      positions: {
        prevIndex: currentPrevIndex,
        currentIndex: currentCurrentIndex,
        nextIndex: currentNextIndex
      }
    });
    
    current.next = prev;
    
    steps.push({
      type: StepType.REVERSE_STEP,
      nodes: createNodeSnapshot(list.head, { prev, current, next: next }),
      description: '将current的next指向prev，反转链接方向',
      positions: {
        prevIndex: currentPrevIndex,
        currentIndex: currentCurrentIndex,
        nextIndex: currentNextIndex
      }
    });
    
    prev = current;
    current = next;
    
    // 获取指针移动后的位置
    const movedPrevIndex = getNodePosition(list.head, prev);
    const movedCurrentIndex = getNodePosition(list.head, current);
    const movedNextIndex = getNodePosition(list.head, current?.next || null);
    
    steps.push({
      type: StepType.REVERSE_STEP,
      nodes: createNodeSnapshot(list.head, { prev, current, next: current?.next || null }),
      description: 'prev指针前进，current指向之前保存的next',
      positions: {
        prevIndex: movedPrevIndex,
        currentIndex: movedCurrentIndex,
        nextIndex: movedNextIndex
      }
    });
  }
  
  // 获取反转完成后的指针位置
  const finalPrevIndex = getNodePosition(list.head, prev);
  
  steps.push({
    type: StepType.REVERSE_COMPLETE,
    nodes: createNodeSnapshot(list.head),
    description: '完成链表后半部分反转，prev指向反转后的头节点',
    positions: {
      prevIndex: finalPrevIndex
    }
  });

  // Step 3: Compare the first half with the reversed second half
  let firstHalf: ListNode<T> | null = list.head;
  let secondHalf: ListNode<T> | null = prev;
  let isPalindrome = true;
  
  // 获取比较阶段的指针位置
  const firstHalfIndex = getNodePosition(list.head, firstHalf);
  const secondHalfIndex = getNodePosition(list.head, secondHalf);
  
  steps.push({
    type: StepType.COMPARE_START,
    nodes: createNodeSnapshot(list.head, { firstHalf, secondHalf }),
    description: '开始比较前半部分与反转后的后半部分',
    positions: {
      leftIndex: firstHalfIndex,
      rightIndex: secondHalfIndex
    }
  });
  
  const comparedNodes: { left: number; right: number }[] = [];
  
  while (secondHalf) {
    const leftPos = getNodePosition(list.head, firstHalf);
    const rightPos = getNodePosition(list.head, secondHalf);
    
    comparedNodes.push({ left: leftPos, right: rightPos });
    
    if (firstHalf?.val !== secondHalf.val) {
      isPalindrome = false;
      
      steps.push({
        type: StepType.COMPARE_STEP,
        nodes: createNodeSnapshot(list.head, { firstHalf, secondHalf }),
        description: `比较节点值 ${firstHalf?.val} 和 ${secondHalf.val} 不相等，不是回文`,
        comparedNodes: [{ left: leftPos, right: rightPos }]
      });
      
      break;
    }
    
    steps.push({
      type: StepType.COMPARE_STEP,
      nodes: createNodeSnapshot(list.head, { firstHalf, secondHalf }),
      description: `比较节点值 ${firstHalf?.val} 和 ${secondHalf.val} 相等`,
      comparedNodes: [{ left: leftPos, right: rightPos }]
    });
    
    firstHalf = firstHalf?.next || null;
    secondHalf = secondHalf.next;
  }
  
  steps.push({
    type: StepType.COMPARE_COMPLETE,
    nodes: createNodeSnapshot(list.head),
    description: isPalindrome ? '比较完成，链表是回文' : '比较完成，链表不是回文',
    comparedNodes
  });

  return { result: isPalindrome, steps };
};

// 辅助函数：获取节点在链表中的位置
const getNodePosition = <T>(head: ListNode<T> | null, target: ListNode<T> | null): number => {
  if (!head || !target) return -1;
  
  let current: ListNode<T> | null = head;
  let position = 0;
  
  while (current) {
    if (current === target) {
      return position;
    }
    current = current.next;
    position++;
  }
  
  return -1;
};

// Simplified version of the two pointer approach without tracking steps
export const isPalindrome = <T>(list: LinkedList<T>): boolean => {
  if (list.isEmpty() || !list.head) return true;
  
  // Find the middle of the linked list
  let slow: ListNode<T> | null = list.head;
  let fast: ListNode<T> | null = list.head;
  
  while (fast?.next && fast.next.next) {
    slow = slow?.next || null;
    fast = fast.next.next;
  }
  
  // Reverse the second half
  let prev: ListNode<T> | null = null;
  let current: ListNode<T> | null = slow?.next || null;
  
  while (current) {
    const next: ListNode<T> | null = current.next;
    current.next = prev;
    prev = current;
    current = next;
  }
  
  // Compare the first half with the reversed second half
  let firstHalf: ListNode<T> | null = list.head;
  let secondHalf: ListNode<T> | null = prev;
  
  while (secondHalf) {
    if (firstHalf?.val !== secondHalf.val) {
      return false;
    }
    
    firstHalf = firstHalf?.next || null;
    secondHalf = secondHalf.next;
  }
  
  return true;
};

// Approach 1: Convert to array and check (with visualization steps)
export const isPalindromeUsingArrayWithSteps = <T>(list: LinkedList<T>): {
  result: boolean;
  steps: StepData<T>[];
} => {
  if (list.isEmpty() || !list.head) {
    return { 
      result: true, 
      steps: [{
        type: StepType.INITIAL,
        nodes: [],
        description: '链表为空，视为回文'
      }] 
    };
  }

  const steps: StepData<T>[] = [];
  
  // 创建节点快照辅助函数
  const createNodeSnapshot = (
    head: ListNode<T> | null, 
    arrayIndices: number[] = [],
    comparedIndices: number[] = [],
    mismatchIndices: number[] = []
  ): NodeData<T>[] => {
    const snapshot: NodeData<T>[] = [];
    let current = head;
    let position = 0;
    
    while (current) {
      const status: NodeStatus[] = [];
      
      // 检查节点是否在数组索引中
      if (arrayIndices.includes(position)) {
        status.push(NodeStatus.COMPARED); // 标记为已处理的节点
      }
      
      // 检查节点是否在比较索引中
      if (comparedIndices.includes(position)) {
        status.push(NodeStatus.COMPARED); // 标记为正在比较的节点
      }
      
      // 检查节点是否在不匹配索引中
      if (mismatchIndices.includes(position)) {
        status.push(NodeStatus.MISMATCH); // 标记为不匹配的节点
      }
      
      snapshot.push({ 
        value: current.val, 
        position, 
        status: status.length > 0 ? status : [NodeStatus.NORMAL],
        next: current.next ? position + 1 : null
      });
      
      current = current.next;
      position++;
    }
    
    return snapshot;
  };
  
  // 初始状态
  steps.push({
    type: StepType.INITIAL,
    nodes: createNodeSnapshot(list.head),
    description: '初始链表状态'
  });
  
  // 步骤1：将链表值复制到数组中
  const arr: T[] = [];
  let current: ListNode<T> | null = list.head;
  const processedNodes: number[] = [];
  
  steps.push({
    type: StepType.ARRAY_COPY_START,
    nodes: createNodeSnapshot(list.head),
    description: '开始将链表值复制到数组中'
  });
  
  while (current) {
    arr.push(current.val);
    processedNodes.push(getNodePosition(list.head, current));
    
    steps.push({
      type: StepType.ARRAY_COPY_START,
      nodes: createNodeSnapshot(list.head, processedNodes),
      description: `将节点值 ${current.val} 添加到数组，当前数组: [${arr.join(', ')}]`
    });
    
    current = current.next;
  }
  
  steps.push({
    type: StepType.ARRAY_COPY_COMPLETE,
    nodes: createNodeSnapshot(list.head, processedNodes),
    description: `链表值已全部复制到数组: [${arr.join(', ')}]`
  });
  
  // 步骤2：使用双指针检查数组是否为回文
  steps.push({
    type: StepType.ARRAY_COMPARE_START,
    nodes: createNodeSnapshot(list.head),
    description: '开始使用双指针检查数组是否为回文'
  });
  
  const len = arr.length;
  let isPalindrome = true;
  
  for (let i = 0; i < len / 2; i++) {
    const leftIndex = i;
    const rightIndex = len - 1 - i;
    
    // 获取链表中对应的位置
    const leftNodePosition = leftIndex;
    const rightNodePosition = rightIndex;
    
    const comparedNodes = [leftNodePosition, rightNodePosition];
    
    if (arr[leftIndex] !== arr[rightIndex]) {
      isPalindrome = false;
      
      steps.push({
        type: StepType.ARRAY_COMPARE_STEP,
        nodes: createNodeSnapshot(list.head, processedNodes, [], comparedNodes),
        description: `比较 arr[${leftIndex}]=${arr[leftIndex]} 和 arr[${rightIndex}]=${arr[rightIndex]}，不相等，不是回文`,
        comparedNodes: [{ left: leftNodePosition, right: rightNodePosition }]
      });
      
      break;
    }
    
    steps.push({
      type: StepType.ARRAY_COMPARE_STEP,
      nodes: createNodeSnapshot(list.head, processedNodes, comparedNodes),
      description: `比较 arr[${leftIndex}]=${arr[leftIndex]} 和 arr[${rightIndex}]=${arr[rightIndex]}，相等，继续比较`,
      comparedNodes: [{ left: leftNodePosition, right: rightNodePosition }]
    });
  }
  
  steps.push({
    type: StepType.ARRAY_COMPARE_COMPLETE,
    nodes: createNodeSnapshot(list.head, processedNodes),
    description: isPalindrome ? '所有元素比较完成，是回文' : '不是回文，比较已提前结束'
  });
  
  return {
    result: isPalindrome,
    steps
  };
}; 