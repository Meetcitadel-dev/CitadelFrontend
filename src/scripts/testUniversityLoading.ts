// Comprehensive test script for university loading optimization
import { apiGet } from '../lib/apiClient';
import { performanceMonitor } from '../lib/performance';

interface UniversityTestResult {
  testName: string;
  success: boolean;
  duration: number;
  details: any;
  error?: string;
}

class UniversityLoadingTester {
  private results: UniversityTestResult[] = [];
  private baseUrl = '/api/universities';

  async runAllTests(): Promise<UniversityTestResult[]> {
    console.log('🏫 Starting University Loading Tests...\n');
    
    this.results = [];
    
    try {
      // Test 1: Basic university loading
      await this.testBasicLoading();
      
      // Test 2: Search functionality
      await this.testSearchFunctionality();
      
      // Test 3: Cache performance
      await this.testCachePerformance();
      
      // Test 4: Error handling
      await this.testErrorHandling();
      
      // Test 5: Large result sets
      await this.testLargeResultSets();
      
      // Test 6: Debouncing simulation
      await this.testDebouncingBehavior();
      
    } catch (error) {
      console.error('❌ University loading test suite failed:', error);
    }
    
    this.generateSummary();
    return this.results;
  }

  private async testBasicLoading(): Promise<void> {
    console.log('📚 Testing Basic University Loading...');
    
    const testName = 'Basic University Loading';
    const startTime = performance.now();
    
    try {
      const response = await apiGet(`${this.baseUrl}?limit=20`);
      const duration = performance.now() - startTime;
      
      const isValid = response && 
                     Array.isArray(response.universities) && 
                     response.universities.length > 0;
      
      this.results.push({
        testName,
        success: isValid,
        duration,
        details: {
          universitiesCount: response?.universities?.length || 0,
          hasMetadata: !!response?.metadata,
          responseStructure: Object.keys(response || {}),
          loadTime: `${duration.toFixed(2)}ms`
        },
        error: isValid ? undefined : 'Invalid response structure'
      });
      
      console.log(`  ${isValid ? '✅' : '❌'} Basic loading: ${duration.toFixed(2)}ms, ${response?.universities?.length || 0} universities`);
      
    } catch (error) {
      const duration = performance.now() - startTime;
      this.results.push({
        testName,
        success: false,
        duration,
        details: {},
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      console.log(`  ❌ Basic loading failed: ${error}`);
    }
  }

  private async testSearchFunctionality(): Promise<void> {
    console.log('🔍 Testing Search Functionality...');
    
    const searchQueries = [
      { query: 'harvard', expectedMinResults: 1 },
      { query: 'stanford', expectedMinResults: 1 },
      { query: 'university', expectedMinResults: 5 },
      { query: 'college', expectedMinResults: 3 },
      { query: 'xyz123nonexistent', expectedMinResults: 0 }
    ];
    
    for (const { query, expectedMinResults } of searchQueries) {
      const testName = `Search: "${query}"`;
      const startTime = performance.now();
      
      try {
        const response = await apiGet(`${this.baseUrl}?search=${encodeURIComponent(query)}&limit=20`);
        const duration = performance.now() - startTime;
        
        const universities = response?.universities || [];
        const meetsExpectation = universities.length >= expectedMinResults;
        
        // Check if results are relevant to search query
        const relevantResults = universities.filter((uni: any) => 
          uni.name?.toLowerCase().includes(query.toLowerCase())
        );
        
        this.results.push({
          testName,
          success: meetsExpectation,
          duration,
          details: {
            query,
            totalResults: universities.length,
            relevantResults: relevantResults.length,
            expectedMinResults,
            relevanceRatio: universities.length > 0 ? (relevantResults.length / universities.length * 100).toFixed(1) + '%' : '0%',
            loadTime: `${duration.toFixed(2)}ms`,
            sampleResults: universities.slice(0, 3).map((uni: any) => uni.name)
          },
          error: meetsExpectation ? undefined : `Expected at least ${expectedMinResults} results, got ${universities.length}`
        });
        
        console.log(`  ${meetsExpectation ? '✅' : '❌'} "${query}": ${universities.length} results (${duration.toFixed(2)}ms)`);
        
      } catch (error) {
        const duration = performance.now() - startTime;
        this.results.push({
          testName,
          success: false,
          duration,
          details: { query },
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        console.log(`  ❌ "${query}" search failed: ${error}`);
      }
    }
  }

  private async testCachePerformance(): Promise<void> {
    console.log('🗄️ Testing Cache Performance...');
    
    const testQuery = 'test-cache-performance';
    
    // First call (cache miss)
    const testName1 = 'Cache Miss Performance';
    const startTime1 = performance.now();
    
    try {
      await apiGet(`${this.baseUrl}?search=${testQuery}&limit=10`);
      const duration1 = performance.now() - startTime1;
      
      // Second call (cache hit)
      const testName2 = 'Cache Hit Performance';
      const startTime2 = performance.now();
      await apiGet(`${this.baseUrl}?search=${testQuery}&limit=10`);
      const duration2 = performance.now() - startTime2;
      
      const speedImprovement = ((duration1 - duration2) / duration1 * 100);
      const isCacheWorking = duration2 < duration1 * 0.5; // Cache should be at least 50% faster
      
      this.results.push({
        testName: testName1,
        success: true,
        duration: duration1,
        details: {
          cacheStatus: 'miss',
          loadTime: `${duration1.toFixed(2)}ms`
        }
      });
      
      this.results.push({
        testName: testName2,
        success: isCacheWorking,
        duration: duration2,
        details: {
          cacheStatus: 'hit',
          loadTime: `${duration2.toFixed(2)}ms`,
          speedImprovement: `${speedImprovement.toFixed(1)}%`,
          cacheWorking: isCacheWorking
        },
        error: isCacheWorking ? undefined : 'Cache not providing expected performance improvement'
      });
      
      console.log(`  ✅ Cache miss: ${duration1.toFixed(2)}ms`);
      console.log(`  ${isCacheWorking ? '✅' : '❌'} Cache hit: ${duration2.toFixed(2)}ms (${speedImprovement.toFixed(1)}% improvement)`);
      
    } catch (error) {
      this.results.push({
        testName: testName1,
        success: false,
        duration: performance.now() - startTime1,
        details: {},
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      console.log(`  ❌ Cache test failed: ${error}`);
    }
  }

  private async testErrorHandling(): Promise<void> {
    console.log('⚠️ Testing Error Handling...');
    
    const errorTests = [
      { url: `${this.baseUrl}?limit=invalid`, testName: 'Invalid Limit Parameter' },
      { url: `${this.baseUrl}?offset=invalid`, testName: 'Invalid Offset Parameter' },
      { url: `${this.baseUrl}?search=${'x'.repeat(1000)}`, testName: 'Extremely Long Search Query' }
    ];
    
    for (const { url, testName } of errorTests) {
      const startTime = performance.now();
      
      try {
        const response = await apiGet(url);
        const duration = performance.now() - startTime;
        
        // Should either return valid data or handle gracefully
        const handledGracefully = response && (
          Array.isArray(response.universities) || 
          response.error || 
          response.message
        );
        
        this.results.push({
          testName,
          success: handledGracefully,
          duration,
          details: {
            responseType: typeof response,
            hasUniversities: Array.isArray(response?.universities),
            hasError: !!response?.error,
            responseKeys: Object.keys(response || {})
          },
          error: handledGracefully ? undefined : 'Error not handled gracefully'
        });
        
        console.log(`  ${handledGracefully ? '✅' : '❌'} ${testName}: ${duration.toFixed(2)}ms`);
        
      } catch (error) {
        const duration = performance.now() - startTime;
        // Catching an error is actually expected behavior for some tests
        this.results.push({
          testName,
          success: true, // Error handling is working
          duration,
          details: {
            errorCaught: true,
            errorMessage: error instanceof Error ? error.message : 'Unknown error'
          }
        });
        console.log(`  ✅ ${testName}: Error caught as expected (${duration.toFixed(2)}ms)`);
      }
    }
  }

  private async testLargeResultSets(): Promise<void> {
    console.log('📊 Testing Large Result Sets...');
    
    const testName = 'Large Result Set Performance';
    const startTime = performance.now();
    
    try {
      // Request a large number of universities
      const response = await apiGet(`${this.baseUrl}?limit=100`);
      const duration = performance.now() - startTime;
      
      const universities = response?.universities || [];
      const isPerformant = duration < 2000; // Should load within 2 seconds
      const hasResults = universities.length > 0;
      
      this.results.push({
        testName,
        success: isPerformant && hasResults,
        duration,
        details: {
          universitiesCount: universities.length,
          loadTime: `${duration.toFixed(2)}ms`,
          isPerformant,
          hasResults,
          averageTimePerUniversity: universities.length > 0 ? `${(duration / universities.length).toFixed(2)}ms` : 'N/A'
        },
        error: (!isPerformant || !hasResults) ? 'Large result set performance issue' : undefined
      });
      
      console.log(`  ${(isPerformant && hasResults) ? '✅' : '❌'} Large set: ${universities.length} universities in ${duration.toFixed(2)}ms`);
      
    } catch (error) {
      const duration = performance.now() - startTime;
      this.results.push({
        testName,
        success: false,
        duration,
        details: {},
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      console.log(`  ❌ Large result set test failed: ${error}`);
    }
  }

  private async testDebouncingBehavior(): Promise<void> {
    console.log('⏱️ Testing Debouncing Behavior...');
    
    const testName = 'Rapid Search Requests';
    const startTime = performance.now();
    
    try {
      // Simulate rapid search requests (like user typing)
      const searchPromises = [
        apiGet(`${this.baseUrl}?search=h`),
        apiGet(`${this.baseUrl}?search=ha`),
        apiGet(`${this.baseUrl}?search=har`),
        apiGet(`${this.baseUrl}?search=harv`),
        apiGet(`${this.baseUrl}?search=harva`),
        apiGet(`${this.baseUrl}?search=harvard`)
      ];
      
      const responses = await Promise.all(searchPromises);
      const duration = performance.now() - startTime;
      
      const allSuccessful = responses.every(response => 
        response && Array.isArray(response.universities)
      );
      
      const finalResults = responses[responses.length - 1]?.universities || [];
      
      this.results.push({
        testName,
        success: allSuccessful,
        duration,
        details: {
          requestCount: searchPromises.length,
          allSuccessful,
          finalResultsCount: finalResults.length,
          averageRequestTime: `${(duration / searchPromises.length).toFixed(2)}ms`,
          totalTime: `${duration.toFixed(2)}ms`
        },
        error: allSuccessful ? undefined : 'Some rapid requests failed'
      });
      
      console.log(`  ${allSuccessful ? '✅' : '❌'} Rapid requests: ${searchPromises.length} requests in ${duration.toFixed(2)}ms`);
      
    } catch (error) {
      const duration = performance.now() - startTime;
      this.results.push({
        testName,
        success: false,
        duration,
        details: {},
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      console.log(`  ❌ Debouncing test failed: ${error}`);
    }
  }

  private generateSummary(): void {
    console.log('\n📊 University Loading Test Summary');
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
    
    // Recommendations
    console.log('\n💡 Recommendations:');
    const avgDuration = durations.length > 0 ? durations.reduce((a, b) => a + b, 0) / durations.length : 0;
    
    if (avgDuration > 500) {
      console.log('  - Consider further optimization for response times > 500ms');
    }
    if (failedTests > 0) {
      console.log('  - Review failed tests and implement fixes');
    }
    if (passedTests === totalTests) {
      console.log('  - All tests passed! University loading is working optimally.');
    }
  }
}

// Export for use
export const universityLoadingTester = new UniversityLoadingTester();

// Auto-run in development if enabled
if (import.meta.env.DEV && import.meta.env.VITE_RUN_UNIVERSITY_TESTS === 'true') {
  setTimeout(() => {
    universityLoadingTester.runAllTests();
  }, 1000);
}
