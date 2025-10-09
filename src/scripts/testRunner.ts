// @ts-nocheck
// Comprehensive test runner for all Citadel application fixes
import { performanceTester } from './testPerformance';
import { universityLoadingTester } from './testUniversityLoading';
import { connectionRequestTester } from './testConnectionRequests';
import { performanceMonitor, logMemoryUsage, logBundleInfo } from '../lib/performance';
import { getApiCacheStats } from '../lib/apiClient';

interface TestSuite {
  name: string;
  description: string;
  tester: any;
  critical: boolean;
}

interface TestRunnerResult {
  suiteName: string;
  success: boolean;
  duration: number;
  testCount: number;
  passedTests: number;
  failedTests: number;
  details: any[];
  error?: string;
}

class CitadelTestRunner {
  private testSuites: TestSuite[] = [
    {
      name: 'University Loading',
      description: 'Tests university search, loading, and caching performance',
      tester: universityLoadingTester,
      critical: true
    },
    {
      name: 'Connection Requests',
      description: 'Tests real-time connection request system and WebSocket functionality',
      tester: connectionRequestTester,
      critical: true
    },
    {
      name: 'Performance Optimization',
      description: 'Tests overall application performance, lazy loading, and bundle optimization',
      tester: performanceTester,
      critical: false
    }
  ];

  private results: TestRunnerResult[] = [];

  async runAllTests(): Promise<TestRunnerResult[]> {
    console.log('🚀 Starting Citadel Application Test Suite');
    console.log('=' .repeat(60));
    console.log(`Running ${this.testSuites.length} test suites...\n`);
    
    // Initialize
    this.results = [];
    performanceMonitor.clear();
    
    // Log initial system state
    this.logSystemState();
    
    // Run each test suite
    for (const suite of this.testSuites) {
      await this.runTestSuite(suite);
    }
    
    // Generate comprehensive summary
    this.generateComprehensiveSummary();
    
    return this.results;
  }

  private async runTestSuite(suite: TestSuite): Promise<void> {
    console.log(`\n🧪 Running ${suite.name} Test Suite`);
    console.log(`📝 ${suite.description}`);
    console.log('-' .repeat(50));
    
    const startTime = performance.now();
    
    try {
      const testResults = await suite.tester.runAllTests();
      const duration = performance.now() - startTime;
      
      const passedTests = testResults.filter((r: any) => r.success).length;
      const failedTests = testResults.length - passedTests;
      const success = suite.critical ? failedTests === 0 : passedTests > failedTests;
      
      this.results.push({
        suiteName: suite.name,
        success,
        duration,
        testCount: testResults.length,
        passedTests,
        failedTests,
        details: testResults
      });
      
      console.log(`\n${success ? '✅' : '❌'} ${suite.name} Suite: ${passedTests}/${testResults.length} tests passed (${duration.toFixed(2)}ms)`);
      
    } catch (error) {
      const duration = performance.now() - startTime;
      
      this.results.push({
        suiteName: suite.name,
        success: false,
        duration,
        testCount: 0,
        passedTests: 0,
        failedTests: 1,
        details: [],
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      console.log(`\n❌ ${suite.name} Suite: Failed to run (${error})`);
    }
  }

  private logSystemState(): void {
    console.log('📊 System State Before Tests:');
    console.log('-' .repeat(30));
    
    // Bundle information
    logBundleInfo();
    
    // Memory usage
    logMemoryUsage();
    
    // API cache stats
    const cacheStats = getApiCacheStats();
    console.log('🗄️ API Cache Stats:');
    console.log(`  Total entries: ${cacheStats.total}`);
    console.log(`  Valid entries: ${cacheStats.valid}`);
    console.log(`  Expired entries: ${cacheStats.expired}`);
    
    // Performance monitor state
    console.log('⏱️ Performance Monitor:');
    console.log(`  Active metrics: ${performanceMonitor.getMetrics().length}`);
    
    console.log('');
  }

  private generateComprehensiveSummary(): void {
    console.log('\n' + '=' .repeat(60));
    console.log('📊 COMPREHENSIVE TEST SUMMARY');
    console.log('=' .repeat(60));
    
    // Overall statistics
    const totalSuites = this.results.length;
    const passedSuites = this.results.filter(r => r.success).length;
    const failedSuites = totalSuites - passedSuites;
    
    const totalTests = this.results.reduce((sum, r) => sum + r.testCount, 0);
    const totalPassed = this.results.reduce((sum, r) => sum + r.passedTests, 0);
    const totalFailed = this.results.reduce((sum, r) => sum + r.failedTests, 0);
    
    const totalDuration = this.results.reduce((sum, r) => sum + r.duration, 0);
    
    console.log('\n📈 Overall Results:');
    console.log(`Test Suites: ${passedSuites}/${totalSuites} passed`);
    console.log(`Individual Tests: ${totalPassed}/${totalTests} passed`);
    console.log(`Total Duration: ${totalDuration.toFixed(2)}ms`);
    console.log(`Success Rate: ${((totalPassed / totalTests) * 100).toFixed(1)}%`);
    
    // Suite breakdown
    console.log('\n📋 Suite Breakdown:');
    this.results.forEach(result => {
      const status = result.success ? '✅' : '❌';
      const critical = this.testSuites.find(s => s.name === result.suiteName)?.critical ? ' (Critical)' : '';
      console.log(`  ${status} ${result.suiteName}${critical}: ${result.passedTests}/${result.testCount} tests (${result.duration.toFixed(2)}ms)`);
    });
    
    // Critical issues
    const criticalFailures = this.results.filter(r => 
      !r.success && this.testSuites.find(s => s.name === r.suiteName)?.critical
    );
    
    if (criticalFailures.length > 0) {
      console.log('\n🚨 Critical Issues:');
      criticalFailures.forEach(failure => {
        console.log(`  ❌ ${failure.suiteName}: ${failure.error || 'Multiple test failures'}`);
      });
    }
    
    // Performance insights
    console.log('\n⚡ Performance Insights:');
    const avgSuiteDuration = totalDuration / totalSuites;
    console.log(`  Average suite duration: ${avgSuiteDuration.toFixed(2)}ms`);
    
    const slowestSuite = this.results.reduce((slowest, current) => 
      current.duration > slowest.duration ? current : slowest
    );
    console.log(`  Slowest suite: ${slowestSuite.suiteName} (${slowestSuite.duration.toFixed(2)}ms)`);
    
    const fastestSuite = this.results.reduce((fastest, current) => 
      current.duration < fastest.duration ? current : fastest
    );
    console.log(`  Fastest suite: ${fastestSuite.suiteName} (${fastestSuite.duration.toFixed(2)}ms)`);
    
    // Recommendations
    this.generateRecommendations();
    
    // Final system state
    console.log('\n📊 System State After Tests:');
    logMemoryUsage();
    
    const finalCacheStats = getApiCacheStats();
    console.log('🗄️ Final API Cache Stats:');
    console.log(`  Total entries: ${finalCacheStats.total}`);
    console.log(`  Valid entries: ${finalCacheStats.valid}`);
    console.log(`  Expired entries: ${finalCacheStats.expired}`);
    
    // Performance monitor summary
    console.log('\n📈 Performance Monitor Summary:');
    performanceMonitor.logSummary();
  }

  private generateRecommendations(): void {
    console.log('\n💡 Recommendations:');
    
    const totalPassed = this.results.reduce((sum, r) => sum + r.passedTests, 0);
    const totalTests = this.results.reduce((sum, r) => sum + r.testCount, 0);
    const successRate = (totalPassed / totalTests) * 100;
    
    if (successRate === 100) {
      console.log('  🎉 Excellent! All tests passed. The application is performing optimally.');
    } else if (successRate >= 90) {
      console.log('  ✅ Good performance! Minor issues detected that should be addressed.');
    } else if (successRate >= 75) {
      console.log('  ⚠️ Moderate issues detected. Review failed tests and implement fixes.');
    } else {
      console.log('  🚨 Significant issues detected. Immediate attention required.');
    }
    
    // Specific recommendations based on results
    const universityResult = this.results.find(r => r.suiteName === 'University Loading');
    if (universityResult && !universityResult.success) {
      console.log('  - University loading issues detected. Check database indexes and Redis caching.');
    }
    
    const connectionResult = this.results.find(r => r.suiteName === 'Connection Requests');
    if (connectionResult && !connectionResult.success) {
      console.log('  - Real-time connection issues detected. Verify WebSocket server and event handling.');
    }
    
    const performanceResult = this.results.find(r => r.suiteName === 'Performance Optimization');
    if (performanceResult && !performanceResult.success) {
      console.log('  - Performance optimization issues detected. Review bundle size and lazy loading.');
    }
    
    // General recommendations
    const totalDuration = this.results.reduce((sum, r) => sum + r.duration, 0);
    if (totalDuration > 10000) {
      console.log('  - Test suite taking longer than expected. Consider optimizing test performance.');
    }
    
    const failedSuites = this.results.filter(r => !r.success).length;
    if (failedSuites > 0) {
      console.log(`  - ${failedSuites} test suite(s) failed. Review individual test results for details.`);
    }
  }

  // Method to run specific test suite
  async runSpecificSuite(suiteName: string): Promise<TestRunnerResult | null> {
    const suite = this.testSuites.find(s => s.name === suiteName);
    if (!suite) {
      console.error(`❌ Test suite "${suiteName}" not found`);
      return null;
    }
    
    console.log(`🧪 Running ${suite.name} Test Suite Only`);
    await this.runTestSuite(suite);
    
    return this.results[this.results.length - 1];
  }

  // Method to get test results
  getResults(): TestRunnerResult[] {
    return this.results;
  }

  // Method to export results as JSON
  exportResults(): string {
    return JSON.stringify({
      timestamp: new Date().toISOString(),
      totalSuites: this.results.length,
      results: this.results,
      summary: {
        totalTests: this.results.reduce((sum, r) => sum + r.testCount, 0),
        totalPassed: this.results.reduce((sum, r) => sum + r.passedTests, 0),
        totalFailed: this.results.reduce((sum, r) => sum + r.failedTests, 0),
        totalDuration: this.results.reduce((sum, r) => sum + r.duration, 0)
      }
    }, null, 2);
  }
}

// Export singleton instance
export const citadelTestRunner = new CitadelTestRunner();

// Auto-run all tests in development if enabled
if (import.meta.env.DEV && import.meta.env.VITE_RUN_ALL_TESTS === 'true') {
  setTimeout(() => {
    citadelTestRunner.runAllTests();
  }, 3000);
}

// Export individual testers for manual use
export { performanceTester, universityLoadingTester, connectionRequestTester };
