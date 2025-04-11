import React from 'react';

interface IndicatorComponentProps {
  x: number;
  y: number;
  label: string;
  color: string;
  isActive: boolean;
  pulse?: boolean;
}

const IndicatorComponent: React.FC<IndicatorComponentProps> = ({
  x,
  y,
  label,
  color,
  isActive,
  pulse = true
}) => {
  // 计算动画状态和样式
  const opacity = isActive ? 1 : 0.6;
  const scale = isActive ? 1 : 0.8;
  const strokeWidth = isActive ? 2 : 1;
  
  return (
    <g className="pointer-indicator" 
      style={{ 
        transform: `scale(${scale})`,
        transition: 'transform 0.3s ease, opacity 0.3s ease'
      }}>
      {/* 指针背景 */}
      <rect
        x={x - 30}
        y={y - 15}
        width={60}
        height={30}
        rx={15}
        ry={15}
        fill={color}
        fillOpacity={0.2}
        stroke={color}
        strokeWidth={strokeWidth}
        style={{ opacity }}
      />
      
      {/* 指针标签 */}
      <text
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={color}
        fontSize="14px"
        fontWeight="bold"
        style={{ opacity }}
      >
        {label}
      </text>
      
      {/* 活跃状态时的脉冲效果 */}
      {isActive && pulse && (
        <circle
          cx={x}
          cy={y}
          r={25}
          fill="none"
          stroke={color}
          strokeWidth={2}
          opacity={0.6}
          className="pulse-circle"
        />
      )}
      
      {/* 添加脉冲动画 */}
      <style>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 0.6;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.3;
          }
          100% {
            transform: scale(1.4);
            opacity: 0;
          }
        }
        
        .pulse-circle {
          animation: pulse 1.5s ease-out infinite;
        }
      `}</style>
    </g>
  );
};

export default React.memo(IndicatorComponent); 