import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

// Skeleton genérico para páginas
export const PageSkeleton = () => (
  <div className="min-h-screen bg-gray-50 p-4 md:p-6">
    <div className="max-w-7xl mx-auto space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="flex justify-between items-center">
        <div>
          <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-96"></div>
        </div>
        <div className="h-10 bg-gray-200 rounded w-32"></div>
      </div>
      
      {/* Cards grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
      
      {/* Large content area skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="h-96 bg-gray-200 rounded-lg"></div>
        </div>
        <div>
          <div className="h-96 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    </div>
  </div>
);

// Skeleton para cards
export const CardSkeleton = ({ className = "" }) => (
  <Card className={`animate-pulse ${className}`}>
    <CardHeader className="pb-2">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-24"></div>
          <div className="h-6 bg-gray-200 rounded w-16"></div>
        </div>
        <div className="h-8 w-8 bg-gray-200 rounded"></div>
      </div>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-16 bg-gray-200 rounded"></div>
      </div>
    </CardContent>
  </Card>
);

// Skeleton para tabelas
export const TableSkeleton = ({ rows = 5, columns = 4 }) => (
  <div className="animate-pulse">
    <div className="space-y-3">
      {/* Header */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="h-4 bg-gray-200 rounded w-20"></div>
        ))}
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div key={colIndex} className="h-6 bg-gray-200 rounded"></div>
          ))}
        </div>
      ))}
    </div>
  </div>
);

// Skeleton para listas
export const ListSkeleton = ({ items = 6 }) => (
  <div className="space-y-4 animate-pulse">
    {Array.from({ length: items }).map((_, i) => (
      <div key={i} className="flex items-center space-x-4">
        <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="h-8 w-16 bg-gray-200 rounded"></div>
      </div>
    ))}
  </div>
);

// Loading spinner com texto
export const LoadingSpinner = ({ 
  size = "default", 
  text = "Carregando...", 
  className = "" 
}) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-6 w-6", 
    lg: "h-8 w-8",
    xl: "h-12 w-12"
  };

  return (
    <div className={`flex items-center justify-center space-x-2 ${className}`}>
      <Loader2 className={`${sizeClasses[size]} animate-spin text-indigo-600`} />
      {text && <span className="text-sm text-gray-600">{text}</span>}
    </div>
  );
};

// Loading para tela cheia
export const FullScreenLoading = ({ text = "Carregando aplicação..." }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center space-y-4">
      <LoadingSpinner size="xl" />
      <p className="text-lg text-gray-600">{text}</p>
    </div>
  </div>
);

// Loading para botões
export const ButtonLoading = ({ 
  loading = false, 
  children, 
  loadingText = "Carregando...",
  ...props 
}) => (
  <button {...props} disabled={loading || props.disabled}>
    {loading ? (
      <div className="flex items-center justify-center space-x-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>{loadingText}</span>
      </div>
    ) : (
      children
    )}
  </button>
);

// Loading overlay
export const LoadingOverlay = ({ show, text = "Processando..." }) => {
  if (!show) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <LoadingSpinner text={text} />
      </div>
    </div>
  );
};

// Loading para charts/gráficos
export const ChartSkeleton = ({ height = "h-64" }) => (
  <div className={`${height} bg-gray-100 rounded-lg animate-pulse flex items-center justify-center`}>
    <div className="text-center space-y-2">
      <div className="h-8 w-8 bg-gray-200 rounded mx-auto"></div>
      <div className="h-4 w-32 bg-gray-200 rounded"></div>
    </div>
  </div>
);

export default PageSkeleton; 