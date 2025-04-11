import React from 'react';

interface ComparisonLineProps {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  isMatch: boolean;
  animate: boolean;
}

const ComparisonLine: React.FC<ComparisonLineProps> = ({
  sourceX,
  sourceY,
  targetX,
  targetY,
  isMatch,
  animate
}) => {
  // 设置线的样式基于匹配状态
  const color = isMatch ? '#2ecc71' : '#e74c3c';
  const dashArray = animate ? "5, 5" : "none";
  
  // 为曲线计算控制点
  const midX = (sourceX + targetX) / 2;
  const midY = (sourceY + targetY) / 2 - 30; // 曲线高度
  
  // 计算曲线路径
  const path = `M${sourceX},${sourceY} Q${midX},${midY} ${targetX},${targetY}`;
  
  // 计算标签位置
  const labelX = midX;
  const labelY = midY - 10;
  
  // 匹配或不匹配的标签
  const label = isMatch ? "匹配" : "不匹配";
  
  return (
    <g className="comparison-line">
      {/* 连接曲线 */}
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeDasharray={dashArray}
        opacity={0.8}
        style={{
          animation: animate ? `dash 1.5s linear infinite` : 'none'
        }}
      />
      
      {/* 连接线末端圆点 */}
      <circle cx={sourceX} cy={sourceY} r={4} fill={color} />
      <circle cx={targetX} cy={targetY} r={4} fill={color} />
      
      {/* 标签背景 */}
      <rect
        x={labelX - 25}
        y={labelY - 10}
        width={50}
        height={20}
        rx={10}
        ry={10}
        fill="white"
        stroke={color}
        strokeWidth={1}
      />
      
      {/* 标签文字 */}
      <text
        x={labelX}
        y={labelY + 5}
        textAnchor="middle"
        fontSize="12px"
        fontWeight="bold"
        fill={color}
      >
        {label}
      </text>
      
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

export default React.memo(ComparisonLine); 