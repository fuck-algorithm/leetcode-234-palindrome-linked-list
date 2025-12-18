import React, { useState } from 'react';

const WechatFloatButton: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        position: 'fixed',
        right: '20px',
        bottom: '20px',
        zIndex: 1000,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 悬浮球 */}
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: '#07c160',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(7, 193, 96, 0.4)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          transform: isHovered ? 'scale(1.1)' : 'scale(1)',
        }}
      >
        {/* 微信群图标 */}
        <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
          {/* 三个人形图标表示群聊 */}
          <circle cx="12" cy="5" r="2.5" />
          <path d="M12 8.5c-3 0-5.5 1.5-5.5 3.5V13h11v-1c0-2-2.5-3.5-5.5-3.5z" />
          <circle cx="5.5" cy="7" r="2" />
          <path d="M5.5 10c-2 0-3.5 1-3.5 2.5V13.5h3.5V12c0-.8.2-1.5.6-2H5.5z" opacity="0.7" />
          <circle cx="18.5" cy="7" r="2" />
          <path d="M18.5 10c2 0 3.5 1 3.5 2.5V13.5h-3.5V12c0-.8-.2-1.5-.6-2h.6z" opacity="0.7" />
        </svg>
        <span style={{ 
          color: 'white', 
          fontSize: '10px', 
          fontWeight: 'bold',
          marginTop: '2px',
          lineHeight: 1
        }}>
          交流群
        </span>
      </div>

      {/* 弹出的二维码卡片 */}
      {isHovered && (
        <div
          style={{
            position: 'absolute',
            right: '60px',
            bottom: '0',
            backgroundColor: '#fff',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
            animation: 'fadeIn 0.2s ease',
            minWidth: '200px',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '10px' }}>
            <span style={{ 
              color: '#333', 
              fontSize: '14px', 
              fontWeight: 'bold',
              display: 'block',
              marginBottom: '4px'
            }}>
              加入算法交流群
            </span>
            <span style={{ color: '#666', fontSize: '12px' }}>
              扫码发送 <strong style={{ color: '#07c160' }}>leetcode</strong>
            </span>
          </div>
          <img
            src="/wechat-qrcode.png"
            alt="微信二维码"
            style={{
              maxWidth: '220px',
              height: 'auto',
              borderRadius: '8px',
              display: 'block',
            }}
          />
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(10px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default WechatFloatButton;
