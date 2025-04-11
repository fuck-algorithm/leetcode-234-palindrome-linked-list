import React from 'react';
import { NodeStatus } from '../../../utils/palindromeChecker';
import { 
  NODE_RADIUS, 
  POINTER_WIDTH, 
  POINTER_HEIGHT 
} from '../../constants/VisualizationConstants';

interface NodeComponentProps {
  x: number;
  y: number;
  value: any;
  index: number;
  status: NodeStatus[];
  isFocus: boolean;
}

/**
 * 节点组件 - 用于渲染链表中的单个节点
 * 包含值部分(圆形)和指针部分(矩形)
 */
const NodeComponent: React.FC<NodeComponentProps> = ({ 
  x, 
  y, 
  value, 
  index, 
  status, 
  isFocus 
}) => {
  // 确定节点值部分的颜色
  const valueFill = (() => {
    if (isFocus) {
      return '#f39c12';
    }
    
    if (status.includes(NodeStatus.COMPARED)) return '#9b59b6';
    if (status.includes(NodeStatus.CURRENT_POINTER)) return '#3498db';
    if (status.includes(NodeStatus.SLOW_POINTER)) return '#16a085';
    if (status.includes(NodeStatus.FAST_POINTER)) return '#e74c3c';
    return '#bdc3c7';
  })();
  
  // 确定指针部分的颜色
  const pointerFill = '#f8f9fa';
  
  // 值部分的中心位置在传入的x坐标
  const valueX = x;
  
  // 指针部分的左上角位置
  const pointerX = x + NODE_RADIUS;
  const pointerY = y - POINTER_HEIGHT/2;
  
  return (
    <g className="node">
      {/* 值部分 - 圆形 */}
      <circle
        cx={valueX}
        cy={y}
        r={NODE_RADIUS}
        fill={valueFill}
        stroke="#34495e"
        strokeWidth={2}
      />
      
      {/* 值部分文本 */}
      <text
        x={valueX}
        y={y}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="14px"
        fill="#ffffff"
        fontWeight="bold"
      >
        {String(value)}
      </text>
      
      {/* 连接值部分和指针部分的线 */}
      <line
        x1={valueX + NODE_RADIUS}
        y1={y}
        x2={pointerX}
        y2={y}
        stroke="#34495e"
        strokeWidth={1.5}
      />
      
      {/* 指针部分 - 矩形 */}
      <rect
        x={pointerX}
        y={pointerY}
        width={POINTER_WIDTH}
        height={POINTER_HEIGHT}
        fill={pointerFill}
        stroke="#34495e"
        strokeWidth={2}
        rx={2}
        ry={2}
      />
      
      {/* 指针部分文本 */}
      <text
        x={pointerX + POINTER_WIDTH/2}
        y={y}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="12px"
        fill="#34495e"
      >
        next
      </text>
      
      {/* 节点索引 */}
      <text
        x={valueX}
        y={y + NODE_RADIUS + 15}
        textAnchor="middle"
        fontSize="12px"
        fill="#777"
      >
        #{index + 1}
      </text>
    </g>
  );
};

export default NodeComponent; 