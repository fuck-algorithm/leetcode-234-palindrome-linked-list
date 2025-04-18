import React from 'react';

interface PointerMovementPathProps {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  color: string;
  animate: boolean;
  label?: string;
}

const PointerMovementPath: React.FC<PointerMovementPathProps> = ({
  sourceX,
  sourceY,
  targetX,
  targetY,
  color,
  animate,
  label
}) => {
  // 计算路径曲线
  const midX = (sourceX + targetX) / 2;
  const midY = (sourceY + targetY) / 2 - 20; // 弯曲高度
  
  const path = `M${sourceX},${sourceY} Q${midX},${midY} ${targetX},${targetY}`;
  
  // 为箭头计算角度和位置
  const dx = targetX - sourceX;
  const dy = targetY - sourceY;
  const angle = Math.atan2(targetY - midY, targetX - midX) * 180 / Math.PI;
  
  // 动画定义
  const dashArray = animate ? "5, 5" : "none";
  const animationDuration = animate ? "1.5s" : "0s";

  return (
    <g className="pointer-movement-path">
      {/* 主路径 */}
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeDasharray={dashArray}
        style={{
          animation: animate ? `dash ${animationDuration} linear infinite` : 'none'
        }}
      />
      
      {/* 箭头 */}
      <polygon
        points="0,-5 10,0 0,5"
        fill={color}
        transform={`translate(${targetX}, ${targetY}) rotate(${angle})`}
        style={{
          opacity: animate ? 1 : 0.7
        }}
      />
      
      {/* 标签 */}
      {label && (
        <text
          x={midX}
          y={midY - 10}
          textAnchor="middle"
          fill={color}
          fontSize="12px"
          fontWeight="bold"
        >
          {label}
        </text>
      )}
      
      {/* 添加CSS动画 */}
      <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: 20;
          }
        }
      `}</style>
    </g>
  );
};

export default React.memo(PointerMovementPath); 