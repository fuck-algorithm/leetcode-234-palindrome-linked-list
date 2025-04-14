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
        width: '100vw',  // 使用视口宽度单位
        padding: 0,
        margin: 0,
        position: 'relative',
        left: '50%',
        right: '50%',
        marginLeft: '-50vw',
        marginRight: '-50vw',
      }}
    >
      <div style={{ 
        position: 'relative',
        height: '18px',
      }}>
        {/* 进度条背景 */}
        <div 
          style={{
            height: '100%',
            width: '100%',
            backgroundColor: '#ecf0f1',
            position: 'absolute',
            left: 0,
            top: 0,
            boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)'
          }}
        >
          {/* 完成进度 */}
          <div 
            style={{
              height: '100%',
              width: `${progressPercent}%`,
              background: 'linear-gradient(to right, #3498db, #2980b9)',
              transition: 'width 0.3s ease-in-out',
              position: 'absolute',
              left: 0,
              top: 0
            }}
          />
        </div>
        
        {/* 步骤计数器文本 */}
        <div 
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '1px 12px',
            borderRadius: '15px',
            fontSize: '1rem',
            fontWeight: 'bold',
            zIndex: 10,
            minWidth: '80px',
            textAlign: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
          }}
        >
          {currentStep + 1}/{totalSteps}
        </div>
      </div>
    </div>
  );
};

export default StepProgressBar; 