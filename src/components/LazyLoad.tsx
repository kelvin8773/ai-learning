/**
 * Lazy loading wrapper component for performance optimization
 */

import React, { Suspense, lazy, ComponentType } from 'react';
import { Box, Spinner, Center } from '@chakra-ui/react';

interface LazyLoadProps {
  fallback?: React.ReactNode;
}

// Default loading fallback
const DefaultFallback = () => (
  <Center p={8}>
    <Spinner size="lg" />
  </Center>
);

// Higher-order component for lazy loading
export const withLazyLoad = <P extends object>(
  Component: ComponentType<P>,
  fallback?: React.ReactNode
) => {
  const LazyComponent = (props: P) => (
    <Suspense fallback={fallback || <DefaultFallback />}>
      <Component {...props} />
    </Suspense>
  );

  LazyComponent.displayName = `withLazyLoad(${Component.displayName || Component.name})`;
  
  return LazyComponent;
};

// Lazy load specific components
export const LazySettingsPanel = withLazyLoad(
  lazy(() => import('./SettingsPanel').then(module => ({ default: module.SettingsPanel })))
);

export const LazyExportPanel = withLazyLoad(
  lazy(() => import('./ExportPanel').then(module => ({ default: module.ExportPanel })))
);

export const LazySearchFilter = withLazyLoad(
  lazy(() => import('./SearchFilter').then(module => ({ default: module.SearchFilter })))
);

// Generic lazy loading wrapper
export const LazyLoad: React.FC<LazyLoadProps & { children: React.ReactNode }> = ({
  children,
  fallback = <DefaultFallback />
}) => (
  <Suspense fallback={fallback}>
    {children}
  </Suspense>
);
