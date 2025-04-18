import React from 'react';

interface PointerAnimationProps {
  pointerType: 'slow' | 'fast';
  startNodeIndex: number;
  endNodeIndex: number;
  currentNodeIndices: number[];
  nodePositions: {[key: number]: {x: number; y: number}};
  nodeRadius: number;
  isAnimating?: boolean;
}

/**
 * 指针动画组件 - 负责渲染指针动画
 * 支持快指针的两步动画和慢指针的单步动画
 */
const PointerAnimation: React.FC<PointerAnimationProps> = ({
  pointerType,
  startNodeIndex,
  endNodeIndex,
  currentNodeIndices,
  nodePositions,
  nodeRadius,
  isAnimating = false
}) => {
  const color = pointerType === 'slow' ? '#16a085' : '#c0392b';
  const arrowColor = pointerType === 'slow' ? '#27ae60' : '#e74c3c';
  
  // 确保指针位置存在
  if (!nodePositions[currentNodeIndices[0]]) {
    return null;
  }
  
  return (
    <g className={`${pointerType}-pointer-indicator`}>
      {currentNodeIndices.map((nodeIndex, idx) => {
        if (!nodePositions[nodeIndex]) return null;
        
        // 位置计算 - slow指针在上方，fast指针在下方
        const x = nodePositions[nodeIndex].x;
        // 根据指针类型决定是在上方还是下方
        const isOnTop = pointerType === 'slow';
        const yOffset = isOnTop ? -nodeRadius - 5 : nodeRadius + 5;
        const y = nodePositions[nodeIndex].y + yOffset;
        
        // 标签文本
        const labelText = pointerType;
        
        // 箭头和标签的视觉效果
        return (
          <g key={`${pointerType}-pointer-${idx}`}>
            {/* 指针指示线 */}
            <line
              x1={x}
              y1={isOnTop ? y - 15 : y + 15}
              x2={x}
              y2={y}
              stroke={color}
              strokeWidth={2.5}
              strokeLinecap="round"
            />
            
            {/* 箭头三角形 - 上方或下方 */}
            <path
              d={isOnTop 
                ? `M${x - 6},${y - 6} L${x},${y} L${x + 6},${y - 6}` // 上箭头
                : `M${x - 6},${y + 6} L${x},${y} L${x + 6},${y + 6}` // 下箭头
              }
              fill={arrowColor}
              stroke="none"
            />
            
            {/* 指针标签 */}
            <rect
              x={x - 24}
              y={isOnTop ? y - 35 : y + 15}
              width={48}
              height={20}
              rx={10}
              ry={10}
              fill={color}
              filter="url(#dropShadow)"
            />
            
            <text
              x={x}
              y={isOnTop ? y - 23 : y + 27}
              textAnchor="middle"
              fontSize="12px"
              fontWeight="bold"
              fill="white"
            >
              {labelText}
            </text>
          </g>
        );
      })}
    </g>
  );
};

export default PointerAnimation; 