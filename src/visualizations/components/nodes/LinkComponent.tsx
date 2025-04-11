import React from 'react';

interface LinkComponentProps {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  isReverse: boolean;
  isNull: boolean;
}

/**
 * 连接线组件 - 用于渲染链表节点之间的连接
 * 支持正向连接、反向连接和空连接
 */
const LinkComponent: React.FC<LinkComponentProps> = ({ 
  sourceX, 
  sourceY, 
  targetX, 
  targetY, 
  isReverse,
  isNull
}) => {
  // 渲染指向空的连接
  if (isNull) {
    return (
      <g className="null-link">
        <path
          d={`M${sourceX},${sourceY} h30`}
          stroke="#95a5a6"
          strokeWidth={2}
          fill="none"
          markerEnd="url(#arrow-null)"
        />
        <text
          x={sourceX + 35}
          y={sourceY + 4}
          textAnchor="middle"
          fontSize="12px"
          fill="#95a5a6"
        >
          null
        </text>
      </g>
    );
  }
  
  // 渲染反向连接（指向前面的节点）
  if (isReverse) {
    const controlPointY = Math.min(sourceY, targetY) - 40;
    const path = `M${sourceX},${sourceY} 
                C${sourceX + 30},${controlPointY} 
                ${targetX - 30},${controlPointY} 
                ${targetX},${targetY}`;
    
    const midX = (sourceX + targetX) / 2;
    const midY = controlPointY - 10;
    
    return (
      <g className="reverse-link">
        <path
          d={path}
          stroke="#e67e22"
          strokeWidth={2}
          fill="none"
          markerEnd="url(#arrow)"
          strokeDasharray="5,2"
        />
        <text
          x={midX}
          y={midY}
          textAnchor="middle"
          fontSize="10px"
          fill="#e67e22"
        >
          反向连接
        </text>
      </g>
    );
  }
  
  // 渲染正向连接（指向后面的节点）
  const dx = targetX - sourceX;
  const dy = targetY - sourceY;
  const midX = (sourceX + targetX) / 2;
  const midY = Math.min(sourceY, targetY);
  
  // 控制点计算，生成平滑曲线
  const cpx1 = sourceX + dx / 3;
  const cpy1 = midY;
  const cpx2 = targetX - dx / 3;
  const cpy2 = midY;
  
  const path = `M${sourceX},${sourceY} C${cpx1},${cpy1} ${cpx2},${cpy2} ${targetX},${targetY}`;
  
  return (
    <g className="forward-link">
      <path
        d={path}
        stroke="#34495e"
        strokeWidth={2}
        fill="none"
        markerEnd="url(#arrow)"
      />
    </g>
  );
};

export default LinkComponent; 