import React from 'react';

interface StepProgressBarProps {
  currentStep: number;
  totalSteps: number;
  width?: number;
}

const StepProgressBar: React.FC<StepProgressBarProps> = ({ 
  currentStep, 
  totalSteps,
  width = window.innerWidth 
}) => {
  // 计算进度百分比
  const progressPercent = Math.min(((currentStep + 1) / totalSteps) * 100, 100);
  
  return (
    <div 
      style={{ 
        width: '100%',
        padding: 0,
        margin: 0,
      }}
    >
      <div style={{ 
        position: 'relative',
        height: '4px',
      }}>
        {/* 进度条背景 */}
        <div 
          style={{
            height: '100%',
            width: '100%',
            backgroundColor: '#2d3139',
            position: 'absolute',
            left: 0,
            top: 0,
          }}
        >
          {/* 完成进度 */}
          <div 
            style={{
              height: '100%',
              width: `${progressPercent}%`,
              background: 'linear-gradient(to right, #00d4aa, #00f5c4)',
              transition: 'width 0.3s ease-in-out',
              position: 'absolute',
              left: 0,
              top: 0,
              boxShadow: '0 0 8px rgba(0, 212, 170, 0.5)'
            }}
          />
        </div>
        
        {/* 步骤计数器文本 */}
        <div 
          style={{
            position: 'absolute',
            right: '8px',
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: '#1a1d23',
            color: '#00d4aa',
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '11px',
            fontWeight: 'bold',
            zIndex: 10,
            border: '1px solid #00d4aa'
          }}
        >
          {currentStep + 1}/{totalSteps}
        </div>
      </div>
    </div>
  );
};

export default StepProgressBar; 