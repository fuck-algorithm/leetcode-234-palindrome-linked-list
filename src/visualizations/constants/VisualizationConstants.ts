import { NodeStatus } from '../../utils/palindromeChecker';

/**
 * 定义指针和节点状态的颜色 - 更生动的配色
 */
export const STATUS_COLORS = {
  [NodeStatus.NORMAL]: '#4a5568',
  [NodeStatus.SLOW_POINTER]: '#00d4aa',
  [NodeStatus.FAST_POINTER]: '#ff6b6b',
  [NodeStatus.PREV_POINTER]: '#ffa726',
  [NodeStatus.CURRENT_POINTER]: '#ffeb3b',
  [NodeStatus.NEXT_POINTER]: '#26c6da',
  [NodeStatus.FIRST_HALF]: '#66bb6a',
  [NodeStatus.SECOND_HALF]: '#ef5350',
  [NodeStatus.COMPARED]: '#4caf50',
  [NodeStatus.MISMATCH]: '#f44336'
};

/**
 * 定义数据部分的背景渐变色 - 深色主题
 */
export const STATUS_BACKGROUNDS = {
  [NodeStatus.NORMAL]: '#2d3748',
  [NodeStatus.SLOW_POINTER]: '#1a3a3a',
  [NodeStatus.FAST_POINTER]: '#3a2a2a',
  [NodeStatus.PREV_POINTER]: '#3a3020',
  [NodeStatus.CURRENT_POINTER]: '#3a3820',
  [NodeStatus.NEXT_POINTER]: '#203038',
  [NodeStatus.FIRST_HALF]: '#203a20',
  [NodeStatus.SECOND_HALF]: '#3a2020',
  [NodeStatus.COMPARED]: '#203a20',
  [NodeStatus.MISMATCH]: '#3a2020'
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
export const NODE_RADIUS = 30;
export const NODE_SPACING = 220;
export const ROW_SPACING = 90;
export const START_X = 150;
export const START_Y = 180;
export const NODES_PER_ROW = Number.MAX_SAFE_INTEGER;
export const POINTER_WIDTH = 60;
export const POINTER_HEIGHT = 40; 