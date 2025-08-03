/**
 * Production-grade Performance Monitoring for Dynamic Forms
 * Features:
 * - Real-time performance tracking
 * - Memory usage monitoring
 * - Render time analysis
 * - Performance bottleneck detection
 * - Automatic optimization suggestions
 */

export interface PerformanceMetrics {
  renderTime: number;
  validationTime: number;
  updateTime: number;
  memoryUsage?: number;
  componentCount?: number;
  rerenderCount?: number;
}

export interface PerformanceBenchmark {
  metric: keyof PerformanceMetrics;
  threshold: number;
  severity: 'info' | 'warning' | 'error';
}

class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetrics> = new Map();
  private benchmarks: PerformanceBenchmark[] = [
    { metric: 'renderTime', threshold: 16, severity: 'warning' }, // 60fps
    { metric: 'renderTime', threshold: 33, severity: 'error' }, // 30fps
    { metric: 'validationTime', threshold: 10, severity: 'warning' },
    { metric: 'updateTime', threshold: 5, severity: 'warning' },
  ];
  private isEnabled: boolean = false;
  private startTimes: Map<string, number> = new Map();

  constructor() {
    this.isEnabled =
      process.env.NODE_ENV === 'development' ||
      localStorage.getItem('form-performance-monitoring') === 'true';
  }

  enable() {
    this.isEnabled = true;
    localStorage.setItem('form-performance-monitoring', 'true');
  }

  disable() {
    this.isEnabled = false;
    localStorage.removeItem('form-performance-monitoring');
  }

  startMeasure(measureId: string): string {
    if (!this.isEnabled) return measureId;

    const startTime = performance.now();
    this.startTimes.set(measureId, startTime);

    // Also use Performance API if available
    if (performance.mark) {
      performance.mark(`${measureId}-start`);
    }

    return measureId;
  }

  endMeasure(measureId: string, metricType: keyof PerformanceMetrics): number {
    if (!this.isEnabled) return 0;

    const startTime = this.startTimes.get(measureId);
    if (!startTime) return 0;

    const endTime = performance.now();
    const duration = endTime - startTime;

    // Clean up
    this.startTimes.delete(measureId);

    // Use Performance API if available
    if (performance.mark && performance.measure) {
      try {
        performance.mark(`${measureId}-end`);
        performance.measure(
          measureId,
          `${measureId}-start`,
          `${measureId}-end`
        );
      } catch (e) {
        // Ignore performance API errors
      }
    }

    // Update metrics
    this.updateMetric(measureId, metricType, duration);

    // Check benchmarks
    this.checkBenchmarks(measureId, metricType, duration);

    return duration;
  }

  private updateMetric(
    measureId: string,
    metricType: keyof PerformanceMetrics,
    value: number
  ) {
    const existing = this.metrics.get(measureId) || {
      renderTime: 0,
      validationTime: 0,
      updateTime: 0,
    };

    existing[metricType] = value;

    // Add memory usage if available
    if ((performance as any).memory) {
      existing.memoryUsage = (performance as any).memory.usedJSHeapSize;
    }

    this.metrics.set(measureId, existing);
  }

  private checkBenchmarks(
    measureId: string,
    metricType: keyof PerformanceMetrics,
    value: number
  ) {
    const relevantBenchmarks = this.benchmarks.filter(
      b => b.metric === metricType
    );

    for (const benchmark of relevantBenchmarks) {
      if (value > benchmark.threshold) {
        this.logPerformanceIssue(measureId, metricType, value, benchmark);
      }
    }
  }

  private logPerformanceIssue(
    measureId: string,
    metricType: keyof PerformanceMetrics,
    value: number,
    benchmark: PerformanceBenchmark
  ) {
    const message = `Performance ${benchmark.severity}: ${metricType} for ${measureId} took ${value.toFixed(2)}ms (threshold: ${benchmark.threshold}ms)`;

    switch (benchmark.severity) {
      case 'warning':
        console.warn(message, this.getOptimizationSuggestion(metricType));
        break;
      case 'error':
        console.error(message, this.getOptimizationSuggestion(metricType));
        break;
      default:
        console.info(message);
    }
  }

  private getOptimizationSuggestion(
    metricType: keyof PerformanceMetrics
  ): string {
    const suggestions = {
      renderTime:
        'Consider memoizing components, reducing component depth, or implementing virtual scrolling',
      validationTime:
        'Consider debouncing validation, caching validation results, or simplifying validation logic',
      updateTime:
        'Consider batching state updates, using useCallback for event handlers, or optimizing data structures',
      memoryUsage:
        'Consider implementing object pooling, reducing component state, or using lazy loading',
      componentCount:
        'Consider component composition, reducing nesting, or implementing component virtualization',
      rerenderCount:
        'Consider React.memo, useMemo, useCallback, or optimizing dependency arrays',
    };

    return (
      suggestions[metricType] ||
      'Consider profiling to identify specific bottlenecks'
    );
  }

  getMetrics(
    measureId?: string
  ): PerformanceMetrics | Map<string, PerformanceMetrics> {
    if (measureId) {
      return (
        this.metrics.get(measureId) || {
          renderTime: 0,
          validationTime: 0,
          updateTime: 0,
        }
      );
    }
    return this.metrics;
  }

  getAverageMetrics(): PerformanceMetrics {
    const allMetrics = Array.from(this.metrics.values());
    if (allMetrics.length === 0) {
      return {
        renderTime: 0,
        validationTime: 0,
        updateTime: 0,
        memoryUsage: 0,
      };
    }

    const totals = allMetrics.reduce(
      (acc, metric) => ({
        renderTime: acc.renderTime + metric.renderTime,
        validationTime: acc.validationTime + metric.validationTime,
        updateTime: acc.updateTime + metric.updateTime,
        memoryUsage: (acc.memoryUsage || 0) + (metric.memoryUsage || 0),
      }),
      { renderTime: 0, validationTime: 0, updateTime: 0, memoryUsage: 0 }
    );

    return {
      renderTime: totals.renderTime / allMetrics.length,
      validationTime: totals.validationTime / allMetrics.length,
      updateTime: totals.updateTime / allMetrics.length,
      memoryUsage: (totals.memoryUsage || 0) / allMetrics.length,
    };
  }

  reset() {
    this.metrics.clear();
    this.startTimes.clear();
  }

  exportMetrics(): string {
    const data = {
      timestamp: new Date().toISOString(),
      metrics: Object.fromEntries(this.metrics),
      averages: this.getAverageMetrics(),
      benchmarks: this.benchmarks,
    };

    return JSON.stringify(data, null, 2);
  }

  // React DevTools Profiler integration
  onRenderCallback = (
    id: string,
    phase: 'mount' | 'update',
    actualDuration: number,
    _baseDuration: number,
    _startTime: number,
    _commitTime: number
  ) => {
    if (!this.isEnabled) return;

    const existing = this.metrics.get(id) || {
      renderTime: 0,
      validationTime: 0,
      updateTime: 0,
    };

    existing.renderTime = actualDuration;
    existing.rerenderCount = (existing.rerenderCount || 0) + 1;

    this.metrics.set(id, existing);

    // Log slow renders
    if (actualDuration > 16) {
      console.warn(
        `Slow ${phase} render for ${id}: ${actualDuration.toFixed(2)}ms`
      );
    }
  };
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

// React hook for easy integration
export const usePerformanceMonitor = () => {
  const startMeasure = (measureId: string) =>
    performanceMonitor.startMeasure(measureId);
  const endMeasure = (
    measureId: string,
    metricType: keyof PerformanceMetrics
  ) => performanceMonitor.endMeasure(measureId, metricType);

  return {
    startMeasure,
    endMeasure,
    getMetrics: performanceMonitor.getMetrics.bind(performanceMonitor),
    enable: performanceMonitor.enable.bind(performanceMonitor),
    disable: performanceMonitor.disable.bind(performanceMonitor),
    reset: performanceMonitor.reset.bind(performanceMonitor),
    exportMetrics: performanceMonitor.exportMetrics.bind(performanceMonitor),
  };
};

export default performanceMonitor;
