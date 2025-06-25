
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface ZoomableMapProps {
  children: React.ReactNode;
  className?: string;
}

export const ZoomableMap = ({ children, className = "" }: ZoomableMapProps) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const mapRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev * 1.2, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev / 1.2, 0.5));
  };

  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.001;
    setScale(prev => Math.max(0.5, Math.min(3, prev + delta)));
  };

  return (
    <div className={`relative overflow-hidden rounded-xl ${className}`}>
      {/* 縮放控制按鈕 */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
        <Button 
          size="sm" 
          variant="outline" 
          onClick={handleZoomIn}
          className="w-10 h-10 p-0 bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white"
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={handleZoomOut}
          className="w-10 h-10 p-0 bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white"
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={handleReset}
          className="w-10 h-10 p-0 bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      {/* 縮放比例指示器 */}
      <div className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 text-sm font-medium shadow-lg">
        {Math.round(scale * 100)}%
      </div>

      {/* 地圖容器 */}
      <div
        ref={mapRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          transformOrigin: 'center center',
          transition: isDragging ? 'none' : 'transform 0.1s ease-out'
        }}
      >
        {children}
      </div>

      {/* 操作提示 */}
      <div className="absolute bottom-4 left-4 z-20 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-gray-600 shadow-lg">
        滾輪縮放 • 拖拽移動 • 點擊按鈕控制
      </div>
    </div>
  );
};
