import { useState } from 'react'
import './App.css'
import { AlgorithmProvider } from './context/AlgorithmContext'
import LinkedListVisualization from './components/LinkedListVisualization'
import LinkedListInput from './components/LinkedListInput'
import AnimationControls from './components/AnimationControls'
import ResultDisplay from './components/ResultDisplay'
import AlgorithmEngine from './engine/AlgorithmEngine'

function App() {
  return (
    <AlgorithmProvider>
      <div className="algorithm-visualization">
        <header className="app-header">
          <h1>回文链表算法可视化</h1>
          <p className="subtitle">
            LeetCode 234 - 基于快慢指针和就地反转的 O(n) 时间 O(1) 空间解法
          </p>
        </header>
        
        <main className="app-main">
          <section className="configuration-section">
            <LinkedListInput />
          </section>
          
          <section className="visualization-section">
            <LinkedListVisualization />
            <AnimationControls />
          </section>
          
          <section className="result-section">
            <ResultDisplay />
          </section>
        </main>
        
        <footer className="app-footer">
          <p>
            基于 React + TypeScript + D3.js 实现
          </p>
        </footer>
      </div>
      
      {/* 算法引擎（无界面组件） */}
      <AlgorithmEngine />
    </AlgorithmProvider>
  )
}

export default App
