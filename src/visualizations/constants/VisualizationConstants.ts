import { NodeStatus } from '../../utils/palindromeChecker';

/**
 * 定义指针和节点状态的颜色
 */
export const STATUS_COLORS = {
  [NodeStatus.NORMAL]: '#2c3e50',
  [NodeStatus.SLOW_POINTER]: '#3498db',
  [NodeStatus.FAST_POINTER]: '#9b59b6',
  [NodeStatus.PREV_POINTER]: '#e67e22',
  [NodeStatus.CURRENT_POINTER]: '#f1c40f',
  [NodeStatus.NEXT_POINTER]: '#1abc9c',
  [NodeStatus.FIRST_HALF]: '#27ae60',
  [NodeStatus.SECOND_HALF]: '#e74c3c',
  [NodeStatus.COMPARED]: '#2ecc71',
  [NodeStatus.MISMATCH]: '#c0392b'
};

/**
 * 定义数据部分的背景渐变色
 */
export const STATUS_BACKGROUNDS = {
  [NodeStatus.NORMAL]: '#e8f8f5',
  [NodeStatus.SLOW_POINTER]: '#d6eaf8',
  [NodeStatus.FAST_POINTER]: '#ebdef0',
  [NodeStatus.PREV_POINTER]: '#fdebd0',
  [NodeStatus.CURRENT_POINTER]: '#fef9e7',
  [NodeStatus.NEXT_POINTER]: '#e8f8f5',
  [NodeStatus.FIRST_HALF]: '#eafaf1',
  [NodeStatus.SECOND_HALF]: '#fadbd8',
  [NodeStatus.COMPARED]: '#eafaf1',
  [NodeStatus.MISMATCH]: '#f9ebea'
};

/**
 * 状态标签
 */
export const STATUS_LABELS = {
  [NodeStatus.NORMAL]: '',
  [NodeStatus.SLOW_POINTER]: 'slow',
  [NodeStatus.FAST_POINTER]: 'fast',
  [NodeStatus.PREV_POINTER]: 'prev',
  [NodeStatus.CURRENT_POINTER]: 'curr',
  [NodeStatus.NEXT_POINTER]: 'next',
  [NodeStatus.FIRST_HALF]: 'first',
  [NodeStatus.SECOND_HALF]: 'second',
  [NodeStatus.COMPARED]: 'compare',
  [NodeStatus.MISMATCH]: 'mismatch'
};

/**
 * 定义节点布局参数
 */
export const NODE_RADIUS = 20;
export const NODE_SPACING = 120;
export const ROW_SPACING = 90;
export const NODES_PER_ROW = 5;
export const START_X = 60;
export const START_Y = 60;
export const POINTER_WIDTH = 40;
export const POINTER_HEIGHT = 30; 