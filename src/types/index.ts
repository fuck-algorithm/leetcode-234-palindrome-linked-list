// 链表节点类型定义
export interface ListNode {
  val: number;
  next: ListNode | null;
  id: string; // 用于D3识别
  x?: number; // 位置坐标
  y?: number;
}

// 算法状态枚举
export enum AlgorithmStep {
  INITIALIZE = 'initialize',
  FIND_MIDDLE = 'findMiddle',
  REVERSE_SECOND_HALF = 'reverseSecondHalf',
  COMPARE = 'compare',
  RESTORE = 'restore',
  RESULT = 'result'
}

// 动画控制状态
export interface AnimationState {
  step: AlgorithmStep;
  playing: boolean;
  speed: number;
  completed: boolean;
}

// 指针状态
export interface PointerState {
  slow: number; // 慢指针位置索引
  fast: number; // 快指针位置索引
  left: number; // 比较时的左指针索引
  right: number; // 比较时的右指针索引
  middleNode: number; // 中间节点索引
}

// 算法结果
export interface AlgorithmResult {
  isPalindrome: boolean;
  comparisons: boolean[]; // 每对节点比较结果
} 