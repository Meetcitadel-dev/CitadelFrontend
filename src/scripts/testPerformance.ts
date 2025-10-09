// Performance testing script for Citadel frontend
import { performanceMonitor, measureWebVitals, logMemoryUsage } from '../lib/performance';
import { apiGet, getApiCacheStats, clearApiCache } from '../lib/apiClient';
import { preloadComponents } from '../lib/lazyLoading';

// Test configuration
const TEST_CONFIG = {
  API_ENDPOINT: '/api/universities',
  SEARCH_QUERIES: ['harvard', 'stanford', 'mit', 'berkeley'],
  COMPONENT_TESTS: [
    { importFn: () => import('../pages/explore'), name: 'ExplorePage' },
    { importFn: () => import('../pages/events'), name: 'EventsPage' },
    { importFn: () => import('../pages/chats'), name: 'ChatsPage' }
  ],
  IMAGE_URLS: [
    'https://example.com/image1.jpg',
    'https://example.com/image2.jpg',
    'https://example.com/image3.jpg'
  ]
};

// Test results interface
interface TestResult {
  testName: string;
  duration: number;
  success: boolean;
  details?: any;
  error?: string;
}

class PerformanceTester {
  private results: TestResult[] = [];

  // Run all performance tests
  async runAllTests(): Promise<TestResult[]> {
    console.log('🚀 Starting Citadel Performance Tests...\n');
    
    // Clear previous results
    this.results = [];
    performanceMonitor.clear();
    
    try {
      // Test 1: API Performance
      await this.testAPIPerformance();
      
      // Test 2: Component Lazy Loading
      await this.testLazyLoading();
      
      // Test 3: Cache Performance
      await this.testCachePerformance();
      
      // Test 4: Memory Usage
      await this.testMemoryUsage();
      
      // Test 5: Bundle Loading
      await this.testBundleLoading();
      
      // Test 6: Image Loading
      await this.testImageLoading();
      
    } catch (error) {
      console.error('❌ Test suite failed:', error);
    }
    
    // Generate summary
    this.generateSummary();
    
    return this.results;
  }

  // Test API performance with caching
  private async testAPIPerformance(): Promise<void> {
    console.log('📡 Testing API Performance...');
    
    for (const query of TEST_CONFIG.SEARCH_QUERIES) {
      const testName = `API Search: ${query}`;
      const startTime = performance.now();
      
      try {
        // First call (cache miss)
        await apiGet(`${TEST_CONFIG.API_ENDPOINT}?search=${query}`);
        const firstCallDuration = performance.now() - startTime;
        
        // Second call (cache hit)
        const cacheStartTime = performance.now();
        await apiGet(`${TEST_CONFIG.API_ENDPOINT}?search=${query}`);
        const cacheCallDuration = performance.now() - cacheStartTime;
        
        this.results.push({
          testName: `${testName} (Cache Miss)`,
          duration: firstCallDuration,
          success: true,
          details: { cacheHit: false }
        });
        
        this.results.push({
          testName: `${testName} (Cache Hit)`,
          duration: cacheCallDuration,
          success: true,
          details: { 
            cacheHit: true,
            speedImprovement: `${((firstCallDuration - cacheCallDuration) / firstCallDuration * 100).toFixed(1)}%`
          }
        });
        
        console.log(`  ✅ ${query}: ${firstCallDuration.toFixed(2)}ms → ${cacheCallDuration.toFixed(2)}ms`);
        
      } catch (error) {
        this.results.push({
          testName,
          duration: performance.now() - startTime,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        console.log(`  ❌ ${query}: Failed`);
      }
    }
  }

  // Test lazy loading performance
  private async testLazyLoading(): Promise<void> {
    console.log('📦 Testing Lazy Loading Performance...');
    
    for (const component of TEST_CONFIG.COMPONENT_TESTS) {
      const testName = `Lazy Load: ${component.name}`;
      const startTime = performance.now();
      
      try {
        await component.importFn();
        const duration = performance.now() - startTime;
        
        this.results.push({
          testName,
          duration,
          success: true,
          details: { 
            component: component.name,
            loadTime: `${duration.toFixed(2)}ms`
          }
        });
        
        console.log(`  ✅ ${component.name}: ${duration.toFixed(2)}ms`);
        
      } catch (error) {
        this.results.push({
          testName,
          duration: performance.now() - startTime,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        console.log(`  ❌ ${component.name}: Failed`);
      }
    }
  }

  // Test cache performance and statistics
  private async testCachePerformance(): Promise<void> {
    console.log('🗄️ Testing Cache Performance...');
    
    const testName = 'Cache Statistics';
    const startTime = performance.now();
    
    try {
      // Get initial cache stats
      const initialStats = getApiCacheStats();
      
      // Make some cached requests
      await Promise.all([
        apiGet('/api/universities?search=test1'),
        apiGet('/api/universities?search=test2'),
        apiGet('/api/universities?search=test3')
      ]);
      
      // Get updated stats
      const updatedStats = getApiCacheStats();
      
      // Test cache clearing
      clearApiCache();
      const clearedStats = getApiCacheStats();
      
      const duration = performance.now() - startTime;
      
      this.results.push({
        testName,
        duration,
        success: true,
        details: {
          initialEntries: initialStats.total,
          afterRequests: updatedStats.total,
          afterClear: clearedStats.total,
          cacheWorking: updatedStats.total > initialStats.total
        }
      });
      
      console.log(`  ✅ Cache: ${initialStats.total} → ${updatedStats.total} → ${clearedStats.total} entries`);
      
    } catch (error) {
      this.results.push({
        testName,
        duration: performance.now() - startTime,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      console.log(`  ❌ Cache test failed`);
    }
  }

  // Test memory usage
  private async testMemoryUsage(): Promise<void> {
    console.log('💾 Testing Memory Usage...');
    
    const testName = 'Memory Usage';
    const startTime = performance.now();
    
    try {
      // Force garbage collection if available
      if ('gc' in window && typeof (window as any).gc === 'function') {
        (window as any).gc();
      }
      
      const initialMemory = this.getMemoryUsage();
      
      // Perform memory-intensive operations
      const largeArray = new Array(100000).fill(0).map((_, i) => ({ id: i, data: `test-${i}` }));
      
      const afterAllocationMemory = this.getMemoryUsage();
      
      // Clear the array
      largeArray.length = 0;
      
      // Force garbage collection again
      if ('gc' in window && typeof (window as any).gc === 'function') {
        (window as any).gc();
      }
      
      const afterCleanupMemory = this.getMemoryUsage();
      
      const duration = performance.now() - startTime;
      
      this.results.push({
        testName,
        duration,
        success: true,
        details: {
          initialMemory: `${initialMemory.toFixed(2)} MB`,
          afterAllocation: `${afterAllocationMemory.toFixed(2)} MB`,
          afterCleanup: `${afterCleanupMemory.toFixed(2)} MB`,
          memoryIncrease: `${(afterAllocationMemory - initialMemory).toFixed(2)} MB`,
          memoryRecovered: `${(afterAllocationMemory - afterCleanupMemory).toFixed(2)} MB`
        }
      });
      
      console.log(`  ✅ Memory: ${initialMemory.toFixed(2)} → ${afterAllocationMemory.toFixed(2)} → ${afterCleanupMemory.toFixed(2)} MB`);
      
    } catch (error) {
      this.results.push({
        testName,
        duration: performance.now() - startTime,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      console.log(`  ❌ Memory test failed`);
    }
  }

  // Test bundle loading performance
  private async testBundleLoading(): Promise<void> {
    console.log('📦 Testing Bundle Loading...');
    
    const testName = 'Bundle Preloading';
    const startTime = performance.now();
    
    try {
      await preloadComponents(TEST_CONFIG.COMPONENT_TESTS);
      const duration = performance.now() - startTime;
      
      this.results.push({
        testName,
        duration,
        success: true,
        details: {
          componentsPreloaded: TEST_CONFIG.COMPONENT_TESTS.length,
          averageLoadTime: `${(duration / TEST_CONFIG.COMPONENT_TESTS.length).toFixed(2)}ms`
        }
      });
      
      console.log(`  ✅ Preloaded ${TEST_CONFIG.COMPONENT_TESTS.length} components in ${duration.toFixed(2)}ms`);
      
    } catch (error) {
      this.results.push({
        testName,
        duration: performance.now() - startTime,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      console.log(`  ❌ Bundle preloading failed`);
    }
  }

  // Test image loading performance
  private async testImageLoading(): Promise<void> {
    console.log('🖼️ Testing Image Loading...');
    
    for (const imageUrl of TEST_CONFIG.IMAGE_URLS) {
      const testName = `Image Load: ${imageUrl.split('/').pop()}`;
      const startTime = performance.now();
      
      try {
        await this.loadImage(imageUrl);
        const duration = performance.now() - startTime;
        
        this.results.push({
          testName,
          duration,
          success: true,
          details: { imageUrl }
        });
        
        console.log(`  ✅ ${imageUrl.split('/').pop()}: ${duration.toFixed(2)}ms`);
        
      } catch (error) {
        this.results.push({
          testName,
          duration: performance.now() - startTime,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        console.log(`  ❌ ${imageUrl.split('/').pop()}: Failed`);
      }
    }
  }

  // Helper method to load an image
  private loadImage(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
      img.src = src;
    });
  }

  // Helper method to get memory usage
  private getMemoryUsage(): number {
    if ('memory' in performance) {
      return (performance as any).memory.usedJSHeapSize / 1024 / 1024;
    }
    return 0;
  }

  // Generate test summary
  private generateSummary(): void {
    console.log('\n📊 Performance Test Summary');
    console.log('=' .repeat(50));
    
    const totalTests = this.results.length;
    const passedTests = this.results.filter(r => r.success).length;
    const failedTests = totalTests - passedTests;
    
    console.log(`Total Tests: ${totalTests}`);
    console.log(`Passed: ${passedTests} ✅`);
    console.log(`Failed: ${failedTests} ❌`);
    console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
    
    // Performance statistics
    const durations = this.results.filter(r => r.success).map(r => r.duration);
    if (durations.length > 0) {
      const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
      const maxDuration = Math.max(...durations);
      const minDuration = Math.min(...durations);
      
      console.log(`\nPerformance Stats:`);
      console.log(`Average Duration: ${avgDuration.toFixed(2)}ms`);
      console.log(`Fastest Test: ${minDuration.toFixed(2)}ms`);
      console.log(`Slowest Test: ${maxDuration.toFixed(2)}ms`);
    }
    
    // Failed tests details
    if (failedTests > 0) {
      console.log(`\n❌ Failed Tests:`);
      this.results.filter(r => !r.success).forEach(result => {
        console.log(`  - ${result.testName}: ${result.error}`);
      });
    }
    
    // Performance monitoring summary
    console.log('\n📈 Performance Monitor Summary:');
    performanceMonitor.logSummary();
    
    // Memory usage
    logMemoryUsage();
  }
}

// Export for use in browser console or testing
export const performanceTester = new PerformanceTester();

// Auto-run tests in development mode
if (import.meta.env.DEV && import.meta.env.VITE_RUN_PERFORMANCE_TESTS === 'true') {
  // Run tests after a delay to allow app initialization
  setTimeout(() => {
    performanceTester.runAllTests();
  }, 2000);
}
