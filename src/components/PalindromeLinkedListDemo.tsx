import React, { useState, useEffect, useRef, useCallback } from 'react';
import { LinkedList } from '../models/LinkedList';
import { 
  isPalindromeUsingTwoPointers, 
  isPalindromeUsingArrayWithSteps,
  StepType, 
  NodeData 
} from '../utils/palindromeChecker';
import { STORAGE_KEYS } from '../utils/constants';
import LinkedListInput from './LinkedListInput';
import PalindromeVisualization from '../visualizations/PalindromeVisualization';
import StepProgressBar from './StepProgressBar';
import Header from './Header';
import CodeDisplay from './CodeDisplay';
import AlgorithmInfoPanel from './AlgorithmInfoPanel';
import WechatFloatButton from './WechatFloatButton';

// 算法解法类型
enum AlgorithmType {
  TWO_POINTERS = 'twoPointers',
  ARRAY_COPY = 'arrayCopy'
}

const PalindromeLinkedListDemo: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [linkedList, setLinkedList] = useState<LinkedList<number>>(new LinkedList<number>([1, 2, 2, 1]));
  const [algorithmSteps, setAlgorithmSteps] = useState<{
    type: StepType;
    nodes: NodeData<number>[];
    description: string;
    comparedNodes?: { left: number; right: number }[];
    isEvenLength?: boolean;
    positions?: {
      slowIndex?: number;
      fastIndex?: number;
      prevIndex?: number;
      currentIndex?: number;
      nextIndex?: number;
      leftIndex?: number;
      rightIndex?: number;
    };
  }[]>([]);
  const [isPalindrome, setIsPalindrome] = useState<boolean>(true);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [animationSpeed, setAnimationSpeed] = useState<number>(1500);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const [algorithmType, setAlgorithmType] = useState<AlgorithmType>(AlgorithmType.TWO_POINTERS);
  const [isPending, setIsPending] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPreloading, setIsPreloading] = useState<boolean>(true);
  const [showHints, setShowHints] = useState<boolean>(true);
  const [currentHint, setCurrentHint] = useState<string>('');
  const animationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // 从localStorage加载保存的状态
  useEffect(() => {
    const savedListValues = localStorage.getItem(STORAGE_KEYS.LINKED_LIST);
    const savedAlgorithmType = localStorage.getItem(STORAGE_KEYS.ALGORITHM_TYPE) as AlgorithmType;
    const savedAnimationSpeed = localStorage.getItem(STORAGE_KEYS.ANIMATION_SPEED);
    
    // 恢复链表状态
    if (savedListValues) {
      try {
        const values = JSON.parse(savedListValues);
        if (Array.isArray(values) && values.length > 0) {
          setLinkedList(new LinkedList<number>(values));
        }
      } catch (e) {
        console.error('Failed to parse saved linked list:', e);
      }
    }
    
    // 恢复算法类型
    if (savedAlgorithmType && Object.values(AlgorithmType).includes(savedAlgorithmType)) {
      setAlgorithmType(savedAlgorithmType);
    }
    
    // 恢复动画速度
    if (savedAnimationSpeed) {
      const speed = parseInt(savedAnimationSpeed, 10);
      if (!isNaN(speed) && speed > 0) {
        setAnimationSpeed(speed);
      }
    }
    
    // 确保数据加载后立即设置预加载完成标志
    setTimeout(() => {
      setIsPreloading(false);
    }, 100);
  }, []);
  
  // 保存状态到localStorage
  useEffect(() => {
    if (linkedList && !isPending) {
      localStorage.setItem(STORAGE_KEYS.LINKED_LIST, JSON.stringify(linkedList.toArray()));
    }
  }, [linkedList, isPending]);
  
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ALGORITHM_TYPE, algorithmType);
  }, [algorithmType]);
  
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ANIMATION_SPEED, animationSpeed.toString());
  }, [animationSpeed]);
  
  // 监听窗口变化，更新容器尺寸
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        // 计算可用空间
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // 为控制面板预留空间
        const controlsHeight = viewportHeight > 768 ? 150 : 120;
        
        setContainerSize({
          width: viewportWidth,
          height: viewportHeight - controlsHeight
        });
      }
    };

    window.addEventListener('resize', updateSize);
    updateSize();

    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    // 组件挂载时立即初始化
    if (isPreloading && linkedList) {
      // 确保在DOM完全渲染前计算好算法步骤
      setIsPending(true);
      checkPalindrome(linkedList);
      
      // 设置短暂的预加载期，让React有时间处理状态更新
      const timer = setTimeout(() => {
        setIsPreloading(false);
        setIsPending(false);
      }, 200);
      
      return () => clearTimeout(timer);
    }
  }, [isPreloading, linkedList]);

  useEffect(() => {
    if (!isPreloading) {
      checkPalindrome(linkedList);
    }
  }, [algorithmType, linkedList, isPreloading]);

  useEffect(() => {
    if (linkedList && linkedList.length() > 0 && !isPending && algorithmSteps.length > 0) {
      if (isPlaying) {
        setIsPlaying(false);
      }
      
      setCurrentStep(0);
    }
  }, [algorithmSteps, linkedList, isPending, isPlaying]);

  useEffect(() => {
    if (algorithmSteps.length > 0 && currentStep < algorithmSteps.length) {
      const hint = getHintForStep(algorithmSteps[currentStep]);
      setCurrentHint(hint);
    }
  }, [currentStep, algorithmSteps]);

  const checkPalindrome = (list: LinkedList<number>) => {
    if (algorithmType === AlgorithmType.TWO_POINTERS) {
      const { result, steps } = isPalindromeUsingTwoPointers(list);
      setAlgorithmSteps(steps);
      setIsPalindrome(result);
    } else {
      // 使用带步骤的数组方法
      const { result, steps } = isPalindromeUsingArrayWithSteps(list);
      setAlgorithmSteps(steps);
      setIsPalindrome(result);
    }
    setIsPending(false);
  };

  const handleListCreated = (list: LinkedList<number>) => {
    setLinkedList(list);
  };

  const handleNext = useCallback(() => {
    if (currentStep < algorithmSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep, algorithmSteps.length]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const handleAutoPlay = useCallback(() => {
    if (isAutoPlaying) {
      setIsAutoPlaying(false);
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current);
        animationIntervalRef.current = null;
      }
      return;
    }

    setIsAutoPlaying(true);
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= algorithmSteps.length - 1) {
          clearInterval(interval);
          setIsAutoPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, animationSpeed);
    
    animationIntervalRef.current = interval;
  }, [isAutoPlaying, algorithmSteps.length, animationSpeed]);

  // 键盘快捷键处理
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 如果焦点在输入框中，不处理快捷键
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          handlePrevious();
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleNext();
          break;
        case ' ':
          e.preventDefault();
          handleAutoPlay();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrevious, handleNext, handleAutoPlay]);

  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const speed = parseInt(e.target.value);
    setAnimationSpeed(speed);
  };

  const handleAlgorithmChange = (type: AlgorithmType) => {
    setAlgorithmType(type);
  };

  // 重置为默认设置
  const handleReset = () => {
    if (isAutoPlaying && animationIntervalRef.current) {
      clearInterval(animationIntervalRef.current);
    }
    setIsAutoPlaying(false);
    setCurrentStep(0);
  };

  // 跳到最后一步
  const handleSkipToEnd = () => {
    if (isAutoPlaying && animationIntervalRef.current) {
      clearInterval(animationIntervalRef.current);
    }
    setIsAutoPlaying(false);
    setCurrentStep(algorithmSteps.length - 1);
  };
  
  // 切换提示显示
  const toggleHints = () => {
    setShowHints(!showHints);
  };

  // 根据步骤生成提示信息
  const getHintForStep = (step: { type: StepType }): string => {
    const { type } = step;
    
    switch(type) {
      case StepType.INITIAL:
        return "这是我们的初始链表。我们将判断它是否为回文链表。";
      case StepType.ARRAY_COPY_START:
        return "首先，我们需要将链表中的所有值复制到一个数组中，以便于访问。";
      case StepType.ARRAY_COPY_COMPLETE:
        return "链表值已全部复制到数组中，接下来我们将使用双指针从两端向中间移动比较。";
      case StepType.ARRAY_COMPARE_START:
        return "设置front指针指向数组开头，back指针指向数组末尾，开始比较。";
      case StepType.ARRAY_COMPARE_STEP:
        return "比较指针指向的值，如果相同则指针继续向中间移动；如果不同则不是回文。";
      case StepType.ARRAY_COMPARE_COMPLETE:
        return "所有值比较完成，结果显示这个链表" + (isPalindrome ? "是" : "不是") + "回文链表。";
      case StepType.FIND_MIDDLE_START:
        return "在优化方法中，我们首先使用快慢指针找到链表中点。";
      case StepType.FIND_MIDDLE_STEP:
        return "慢指针每次移动一步，快指针每次移动两步，当快指针到达末尾时，慢指针指向中点。";
      case StepType.FIND_MIDDLE_COMPLETE:
        return "已找到链表中点位置，接下来我们将反转链表的后半部分。";
      case StepType.REVERSE_START:
        return "开始反转链表后半部分，使用三个指针：prev、current和next。";
      case StepType.REVERSE_STEP:
        return "将current的next指向prev，然后移动prev和current指针，继续反转。";
      case StepType.REVERSE_COMPLETE:
        return "链表后半部分反转完成，现在我们比较前半部分和反转后的后半部分。";
      case StepType.COMPARE_START:
        return "开始比较前半部分和反转后的后半部分，分别使用指针p1和p2。";
      case StepType.COMPARE_STEP:
        return "比较p1和p2指向的节点值，如果相同则继续；如果不同则不是回文。";
      case StepType.COMPARE_COMPLETE:
        return "比较完成，结果显示这个链表" + (isPalindrome ? "是" : "不是") + "回文链表。";
      default:
        return "";
    }
  };

  // 获取当前步骤的位置信息
  const getCurrentPositions = () => {
    if (algorithmSteps.length > 0 && currentStep < algorithmSteps.length) {
      return algorithmSteps[currentStep].positions;
    }
    return undefined;
  };

  // 计算可视化区域尺寸
  const visualizationWidth = Math.max(containerSize.width * 0.6, 400);
  const visualizationHeight = Math.max(containerSize.height * 0.6, 300);

  return (
    <div className="palindrome-demo" style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', backgroundColor: '#1a1d23' }}>
      <Header />
      
      {/* 紧凑的控制栏 */}
      <div className="controls" style={{ padding: '6px 0', flexShrink: 0, borderBottom: '1px solid #2d3139' }}>
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '8px', 
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <LinkedListInput onListCreated={handleListCreated} />
            
            <div style={{ display: 'flex', gap: '4px' }}>
              <button
                onClick={() => handleAlgorithmChange(AlgorithmType.TWO_POINTERS)}
                style={{
                  padding: '5px 10px',
                  backgroundColor: algorithmType === AlgorithmType.TWO_POINTERS ? '#00d4aa' : '#2d3139',
                  color: algorithmType === AlgorithmType.TWO_POINTERS ? '#1a1d23' : '#a0a0a0',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 600
                }}
              >
                快慢指针法
              </button>
              <button
                onClick={() => handleAlgorithmChange(AlgorithmType.ARRAY_COPY)}
                style={{
                  padding: '5px 10px',
                  backgroundColor: algorithmType === AlgorithmType.ARRAY_COPY ? '#00d4aa' : '#2d3139',
                  color: algorithmType === AlgorithmType.ARRAY_COPY ? '#1a1d23' : '#a0a0a0',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 600
                }}
              >
                数组复制法
              </button>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button onClick={handlePrevious} title="快捷键: ←" style={{ backgroundColor: '#3b82f6', color: 'white', padding: '5px 10px', fontSize: '12px' }}>
                ← 上一步
              </button>
              <button onClick={handleNext} title="快捷键: →" style={{ backgroundColor: '#3b82f6', color: 'white', padding: '5px 10px', fontSize: '12px' }}>
                下一步 →
              </button>
              <button onClick={handleAutoPlay} title="快捷键: 空格" style={{ backgroundColor: isAutoPlaying ? '#f59e0b' : '#10b981', color: 'white', padding: '5px 10px', fontSize: '12px' }}>
                {isAutoPlaying ? '⏸ 暂停' : '▶ 播放'}
              </button>
              <button onClick={handleReset} style={{ backgroundColor: '#ef4444', color: 'white', padding: '5px 10px', fontSize: '12px' }}>⟲ 重置</button>
              <button onClick={handleSkipToEnd} style={{ backgroundColor: '#8b5cf6', color: 'white', padding: '5px 10px', fontSize: '12px' }}>⏭ 结尾</button>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#a0a0a0', fontSize: '12px' }}>
              <label htmlFor="speed">速度:</label>
              <input
                id="speed"
                type="range"
                min="500"
                max="3000"
                step="100"
                value={animationSpeed}
                onChange={handleSpeedChange}
                style={{ width: '80px', accentColor: '#00d4aa' }}
              />
            </div>
            
            <button onClick={toggleHints} style={{ 
              padding: '5px 8px',
              fontSize: '12px',
              backgroundColor: showHints ? '#6366f1' : '#2d3139',
              color: showHints ? 'white' : '#a0a0a0'
            }}>
              {showHints ? '隐藏提示' : '显示提示'}
            </button>
            
            {/* 结果标签 */}
            <div 
              style={{ 
                padding: '4px 12px', 
                backgroundColor: isPalindrome ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                color: isPalindrome ? '#10b981' : '#f59e0b',
                borderRadius: '4px',
                fontWeight: 'bold',
                fontSize: '12px',
                border: `1px solid ${isPalindrome ? '#10b981' : '#f59e0b'}`
              }}
            >
              {isPalindrome ? '✓ 回文' : '✗ 非回文'}
            </div>
          </div>
        </div>
      </div>
      
      {/* 进度条 */}
      <div style={{ width: '100%', flexShrink: 0 }}>
        <StepProgressBar 
          currentStep={currentStep} 
          totalSteps={algorithmSteps.length} 
        />
      </div>
      
      {showHints && currentHint && (
        <div 
          className="hint-box" 
          style={{ 
            padding: '4px 8px', 
            backgroundColor: '#2d3139',
            border: '1px solid #3d4149',
            color: '#a0a0a0',
            fontSize: '12px',
            flexShrink: 0
          }}
        >
          💡 {currentHint}
        </div>
      )}
      
      {/* 主内容区域：信息面板 + 可视化 + 代码 */}
      <div 
        ref={containerRef} 
        className="main-content"
        style={{
          flex: 1,
          minHeight: 0,
          overflow: 'hidden',
          display: 'flex',
          gap: '0'
        }}
      >
        {/* 左侧信息面板 */}
        <div 
          className="info-panel-container"
          style={{
            width: '180px',
            flexShrink: 0,
            overflow: 'auto',
            borderRight: '1px solid #2d3139'
          }}
        >
          <AlgorithmInfoPanel
            stepType={algorithmSteps[currentStep]?.type || StepType.INITIAL}
            currentStep={currentStep}
            totalSteps={algorithmSteps.length}
            isPalindrome={isPalindrome}
            algorithmType={algorithmType === AlgorithmType.TWO_POINTERS ? 'twoPointers' : 'arrayCopy'}
            nodeCount={linkedList.length()}
            positions={getCurrentPositions()}
            nodeValues={linkedList.toArray()}
          />
        </div>
        
        {/* 中间可视化区域 - 占用最大空间 */}
        <div 
          className="visualization-container"
          style={{
            flex: 1,
            minWidth: 0,
            overflow: 'hidden',
            backgroundColor: '#0f1419',
            background: 'linear-gradient(135deg, #0f1419 0%, #1a2332 50%, #0d1117 100%)'
          }}
        >
          <PalindromeVisualization
            steps={algorithmSteps}
            currentStep={currentStep}
            width={visualizationWidth}
            height={visualizationHeight}
          />
        </div>
        
        {/* 右侧代码展示区域 - 增加宽度 */}
        <div 
          className="code-container"
          style={{
            width: '480px',
            flexShrink: 0,
            overflow: 'hidden',
            borderLeft: '1px solid #2d3139'
          }}
        >
          <CodeDisplay
            stepType={algorithmSteps[currentStep]?.type || StepType.INITIAL}
            algorithmType={algorithmType === AlgorithmType.TWO_POINTERS ? 'twoPointers' : 'arrayCopy'}
            positions={getCurrentPositions()}
          />
        </div>
      </div>
      
      {/* 微信交流群悬浮球 */}
      <WechatFloatButton />
    </div>
  );
};

export default PalindromeLinkedListDemo;
