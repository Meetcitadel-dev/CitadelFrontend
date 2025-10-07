import React, { useState } from 'react';
import { Play, Download, RefreshCw, CheckCircle, XCircle, Clock } from 'lucide-react';
import { citadelTestRunner, performanceTester, universityLoadingTester, connectionRequestTester } from '../../scripts/testRunner';

interface TestResult {
  suiteName: string;
  success: boolean;
  duration: number;
  testCount: number;
  passedTests: number;
  failedTests: number;
  details: any[];
  error?: string;
}

interface TestSuite {
  name: string;
  description: string;
  tester: any;
  critical: boolean;
}

const TestInterface: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const [selectedSuite, setSelectedSuite] = useState<string>('all');
  const [showDetails, setShowDetails] = useState<string | null>(null);

  const testSuites: TestSuite[] = [
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

  const runTests = async () => {
    setIsRunning(true);
    setResults([]);

    try {
      let testResults: TestResult[];
      
      if (selectedSuite === 'all') {
        testResults = await citadelTestRunner.runAllTests();
      } else {
        const result = await citadelTestRunner.runSpecificSuite(selectedSuite);
        testResults = result ? [result] : [];
      }
      
      setResults(testResults);
    } catch (error) {
      console.error('Test execution failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const exportResults = () => {
    const exportData = citadelTestRunner.exportResults();
    const blob = new Blob([exportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `citadel-test-results-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusIcon = (success: boolean) => {
    return success ? (
      <CheckCircle className="w-5 h-5 text-green-500" />
    ) : (
      <XCircle className="w-5 h-5 text-red-500" />
    );
  };

  const getSuccessRate = (result: TestResult) => {
    return result.testCount > 0 ? ((result.passedTests / result.testCount) * 100).toFixed(1) : '0';
  };

  // Only show in development mode
  if (!import.meta.env.DEV) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-lg p-4 w-96 max-h-96 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">🧪 Test Interface</h3>
          <div className="flex gap-2">
            {results.length > 0 && (
              <button
                onClick={exportResults}
                className="p-1 text-gray-400 hover:text-white transition-colors"
                title="Export Results"
              >
                <Download className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setResults([])}
              className="p-1 text-gray-400 hover:text-white transition-colors"
              title="Clear Results"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Test Suite Selection */}
        <div className="mb-4">
          <label className="block text-sm text-gray-300 mb-2">Test Suite:</label>
          <select
            value={selectedSuite}
            onChange={(e) => setSelectedSuite(e.target.value)}
            className="w-full bg-gray-800 text-white border border-gray-600 rounded px-3 py-2 text-sm"
            disabled={isRunning}
          >
            <option value="all">All Test Suites</option>
            {testSuites.map(suite => (
              <option key={suite.name} value={suite.name}>
                {suite.name} {suite.critical ? '(Critical)' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Run Tests Button */}
        <button
          onClick={runTests}
          disabled={isRunning}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded flex items-center justify-center gap-2 mb-4 transition-colors"
        >
          {isRunning ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Running Tests...
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Run Tests
            </>
          )}
        </button>

        {/* Test Results */}
        {results.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-white font-medium text-sm">Results:</h4>
            {results.map((result, index) => (
              <div key={index} className="bg-gray-800 rounded p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(result.success)}
                    <span className="text-white text-sm font-medium">
                      {result.suiteName}
                    </span>
                  </div>
                  <button
                    onClick={() => setShowDetails(showDetails === result.suiteName ? null : result.suiteName)}
                    className="text-gray-400 hover:text-white text-xs"
                  >
                    {showDetails === result.suiteName ? 'Hide' : 'Details'}
                  </button>
                </div>
                
                <div className="text-xs text-gray-300 space-y-1">
                  <div className="flex justify-between">
                    <span>Tests:</span>
                    <span>{result.passedTests}/{result.testCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Success Rate:</span>
                    <span>{getSuccessRate(result)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {result.duration.toFixed(2)}ms
                    </span>
                  </div>
                  {result.error && (
                    <div className="text-red-400 text-xs mt-1">
                      Error: {result.error}
                    </div>
                  )}
                </div>

                {/* Detailed Results */}
                {showDetails === result.suiteName && result.details.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-700">
                    <div className="text-xs text-gray-300 space-y-1 max-h-32 overflow-y-auto">
                      {result.details.map((detail: any, detailIndex: number) => (
                        <div key={detailIndex} className="flex items-center justify-between">
                          <span className="truncate flex-1 mr-2">{detail.testName}</span>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(detail.success)}
                            <span>{detail.duration?.toFixed(2)}ms</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Overall Summary */}
        {results.length > 1 && (
          <div className="mt-4 pt-4 border-t border-gray-700">
            <div className="text-xs text-gray-300">
              <div className="flex justify-between">
                <span>Total Suites:</span>
                <span>{results.filter(r => r.success).length}/{results.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Tests:</span>
                <span>
                  {results.reduce((sum, r) => sum + r.passedTests, 0)}/
                  {results.reduce((sum, r) => sum + r.testCount, 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Total Duration:</span>
                <span>{results.reduce((sum, r) => sum + r.duration, 0).toFixed(2)}ms</span>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        {results.length === 0 && !isRunning && (
          <div className="text-xs text-gray-400 mt-4">
            <p>Select a test suite and click "Run Tests" to validate application fixes.</p>
            <p className="mt-2">Available test suites:</p>
            <ul className="mt-1 space-y-1">
              {testSuites.map(suite => (
                <li key={suite.name} className="flex items-start gap-1">
                  <span className="text-blue-400">•</span>
                  <span>{suite.name}: {suite.description}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestInterface;
