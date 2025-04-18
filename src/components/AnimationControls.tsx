import React from 'react';
import { AlgorithmStep } from '../types';
import { useAlgorithm } from '../context/AlgorithmContext';
import './AnimationControls.css';

// 算法步骤标签映射
const stepLabels: Record<AlgorithmStep, string> = {
  [AlgorithmStep.INITIALIZE]: '初始化',
  [AlgorithmStep.FIND_MIDDLE]: '寻找中点',
  [AlgorithmStep.REVERSE_SECOND_HALF]: '反转后半部分',
  [AlgorithmStep.COMPARE]: '比较前后两部分',
  [AlgorithmStep.RESTORE]: '恢复链表',
  [AlgorithmStep.RESULT]: '结果展示'
};

// 算法步骤描述
const stepDescriptions: Record<AlgorithmStep, string> = {
  [AlgorithmStep.INITIALIZE]: '创建链表并初始化显示',
  [AlgorithmStep.FIND_MIDDLE]: '使用快慢指针寻找链表中点',
  [AlgorithmStep.REVERSE_SECOND_HALF]: '将链表后半部分原地反转',
  [AlgorithmStep.COMPARE]: '从两端向中间比较节点值是否相等',
  [AlgorithmStep.RESTORE]: '恢复链表原始结构',
  [AlgorithmStep.RESULT]: '显示判断结果'
};

// 动画控制组件
const AnimationControls: React.FC = () => {
  const { state, startAnimation, pauseAnimation, resetAnimation, setSpeed, dispatch } = useAlgorithm();
  const { animation } = state;
  const { step, playing, speed } = animation;

  // 切换到指定步骤
  const handleStepChange = (newStep: AlgorithmStep) => {
    dispatch({ type: 'SET_STEP', payload: newStep });
  };

  // 处理速度变化
  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSpeed(parseFloat(e.target.value));
  };

  // 获取步骤按钮类名
  const getStepButtonClass = (buttonStep: AlgorithmStep) => {
    return `step-button ${buttonStep === step ? 'active' : ''}`;
  };

  return (
    <div className="animation-controls">
      <div className="controls-top">
        <div className="playback-controls">
          {playing ? (
            <button 
              className="control-button pause" 
              onClick={pauseAnimation}
              aria-label="暂停"
            >
              <span>⏸</span>
            </button>
          ) : (
            <button 
              className="control-button play" 
              onClick={startAnimation}
              aria-label="播放"
            >
              <span>▶</span>
            </button>
          )}
          
          <button 
            className="control-button reset" 
            onClick={resetAnimation}
            aria-label="重置"
          >
            <span>⟲</span>
          </button>
        </div>
        
        <div className="speed-control">
          <label htmlFor="speed-slider">速度</label>
          <input 
            id="speed-slider"
            type="range" 
            min="0.5" 
            max="3" 
            step="0.5" 
            value={speed} 
            onChange={handleSpeedChange} 
          />
          <span>{speed}x</span>
        </div>
      </div>
      
      <div className="step-description">
        <h3>{stepLabels[step]}</h3>
        <p>{stepDescriptions[step]}</p>
      </div>
      
      <div className="step-navigation">
        {Object.values(AlgorithmStep).map((stepValue) => (
          <button 
            key={stepValue}
            className={getStepButtonClass(stepValue)}
            onClick={() => handleStepChange(stepValue)}
          >
            {stepLabels[stepValue]}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AnimationControls; 