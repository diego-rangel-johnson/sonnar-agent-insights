import React from 'react';

export default function CircularProgressRing({ 
  size = 200,
  strokeWidth = 15,
  percentage = 75, 
  progress = null,
  color = '#8B5CF6',
  circleColor = '#f3f4f6',
  progressColor = null,
  className = '',
  showLabel = true,
  label = '',
  startAngle = 0
}) {
  // Allow progress to be passed as an alternative to percentage
  const progressValue = progress !== null ? progress : percentage;
  // Allow progressColor to be passed as an alternative to color
  const strokeColor = progressColor !== null ? progressColor : color;

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressValue / 100) * circumference;
  // Adjust start angle (0 degrees is at 3 o'clock, -90 degrees is at 12 o'clock)
  const rotateAngle = startAngle - 90;

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      {/* Background Circle */}
      <svg className="absolute inset-0" width={size} height={size}>
        <circle
          r={radius}
          cx={size / 2}
          cy={size / 2}
          fill="transparent"
          stroke={circleColor}
          strokeWidth={strokeWidth}
        />
      </svg>
      
      {/* Progress Circle */}
      <svg 
        className="absolute inset-0" 
        width={size} 
        height={size} 
        style={{ transform: `rotate(${rotateAngle}deg)` }}
      >
        <circle
          r={radius}
          cx={size / 2}
          cy={size / 2}
          fill="transparent"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>

      {/* Center Label */}
      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold">{progressValue}%</span>
          {label && <span className="text-xs text-gray-500">{label}</span>}
        </div>
      )}
    </div>
  );
}