// Test script for real-time connection request system
import { socketService } from '../lib/socket';
import { apiPost, apiGet } from '../lib/apiClient';
import { performanceMonitor } from '../lib/performance';

interface ConnectionTestResult {
  testName: string;
  success: boolean;
  duration: number;
  details: any;
  error?: string;
}

class ConnectionRequestTester {
  private results: ConnectionTestResult[] = [];
  private testEvents: any[] = [];
  private isConnected = false;

  async runAllTests(): Promise<ConnectionTestResult[]> {
    console.log('🔗 Starting Connection Request Tests...\n');
    
    this.results = [];
    this.testEvents = [];
    
    try {
      // Test 1: WebSocket connection
      await this.testWebSocketConnection();
      
      // Test 2: Connection request events
      await this.testConnectionRequestEvents();
      
      // Test 3: Real-time notifications
      await this.testRealTimeNotifications();
      
      // Test 4: Event cleanup
      await this.testEventCleanup();
      
    } catch (error) {
      console.error('❌ Connection request test suite failed:', error);
    }
    
    this.generateSummary();
    return this.results;
  }

  private async testWebSocketConnection(): Promise<void> {
    console.log('🌐 Testing WebSocket Connection...');
    
    const testName = 'WebSocket Connection';
    const startTime = performance.now();
    
    try {
      // Initialize socket connection
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('WebSocket connection timeout'));
        }, 5000);

        socketService.onConnect(() => {
          clearTimeout(timeout);
          this.isConnected = true;
          resolve();
        });

        socketService.onDisconnect(() => {
          this.isConnected = false;
        });

        // Initialize connection
        socketService.connect();
      });

      const duration = performance.now() - startTime;
      
      this.results.push({
        testName,
        success: this.isConnected,
        duration,
        details: {
          connectionStatus: this.isConnected ? 'connected' : 'disconnected',
          connectionTime: `${duration.toFixed(2)}ms`
        }
      });
      
      console.log(`  ${this.isConnected ? '✅' : '❌'} WebSocket connection: ${duration.toFixed(2)}ms`);
      
    } catch (error) {
      const duration = performance.now() - startTime;
      this.results.push({
        testName,
        success: false,
        duration,
        details: {},
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      console.log(`  ❌ WebSocket connection failed: ${error}`);
    }
  }

  private async testConnectionRequestEvents(): Promise<void> {
    console.log('📡 Testing Connection Request Events...');
    
    if (!this.isConnected) {
      console.log('  ⚠️ Skipping event tests - WebSocket not connected');
      return;
    }

    const eventTests = [
      {
        eventName: 'connection_request_received',
        testName: 'Connection Request Received Event'
      },
      {
        eventName: 'connection_request_accepted',
        testName: 'Connection Request Accepted Event'
      },
      {
        eventName: 'connection_request_rejected',
        testName: 'Connection Request Rejected Event'
      }
    ];

    for (const { eventName, testName } of eventTests) {
      const startTime = performance.now();
      
      try {
        // Set up event listener
        const eventReceived = await new Promise<boolean>((resolve) => {
          const timeout = setTimeout(() => resolve(false), 3000);
          
          const handler = (data: any) => {
            clearTimeout(timeout);
            this.testEvents.push({ eventName, data, timestamp: Date.now() });
            resolve(true);
          };

          // Register event handler
          if (eventName === 'connection_request_received') {
            socketService.onConnectionRequestReceived(handler);
          } else if (eventName === 'connection_request_accepted') {
            socketService.onConnectionRequestAccepted(handler);
          } else if (eventName === 'connection_request_rejected') {
            socketService.onConnectionRequestRejected(handler);
          }

          // Simulate event emission (this would normally come from backend)
          setTimeout(() => {
            // Emit test event
            socketService.emit(eventName, {
              id: `test-${Date.now()}`,
              message: `Test ${eventName}`,
              timestamp: Date.now()
            });
          }, 100);
        });

        const duration = performance.now() - startTime;
        
        this.results.push({
          testName,
          success: eventReceived,
          duration,
          details: {
            eventName,
            eventReceived,
            responseTime: `${duration.toFixed(2)}ms`
          },
          error: eventReceived ? undefined : 'Event not received within timeout'
        });
        
        console.log(`  ${eventReceived ? '✅' : '❌'} ${eventName}: ${duration.toFixed(2)}ms`);
        
      } catch (error) {
        const duration = performance.now() - startTime;
        this.results.push({
          testName,
          success: false,
          duration,
          details: { eventName },
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        console.log(`  ❌ ${eventName} test failed: ${error}`);
      }
    }
  }

  private async testRealTimeNotifications(): Promise<void> {
    console.log('🔔 Testing Real-time Notifications...');
    
    if (!this.isConnected) {
      console.log('  ⚠️ Skipping notification tests - WebSocket not connected');
      return;
    }

    const testName = 'Real-time Notification Flow';
    const startTime = performance.now();
    
    try {
      // Test the complete notification flow
      let notificationReceived = false;
      let notificationData: any = null;

      // Set up notification listener
      const notificationPromise = new Promise<boolean>((resolve) => {
        const timeout = setTimeout(() => resolve(false), 5000);
        
        socketService.onConnectionRequestReceived((data) => {
          clearTimeout(timeout);
          notificationReceived = true;
          notificationData = data;
          resolve(true);
        });
      });

      // Simulate sending a connection request
      setTimeout(() => {
        socketService.emit('connection_request_received', {
          id: `notification-test-${Date.now()}`,
          requesterId: 'test-user-1',
          requesterName: 'Test User',
          requesterUsername: 'testuser',
          requesterImage: 'https://example.com/avatar.jpg',
          targetId: 'current-user',
          status: 'pending',
          createdAt: new Date().toISOString(),
          message: 'Test User sent you a connection request'
        });
      }, 500);

      const received = await notificationPromise;
      const duration = performance.now() - startTime;
      
      this.results.push({
        testName,
        success: received,
        duration,
        details: {
          notificationReceived: received,
          notificationData: notificationData ? {
            hasRequiredFields: !!(notificationData.id && notificationData.message),
            messageContent: notificationData.message,
            requesterId: notificationData.requesterId
          } : null,
          responseTime: `${duration.toFixed(2)}ms`
        },
        error: received ? undefined : 'Real-time notification not received'
      });
      
      console.log(`  ${received ? '✅' : '❌'} Real-time notifications: ${duration.toFixed(2)}ms`);
      
    } catch (error) {
      const duration = performance.now() - startTime;
      this.results.push({
        testName,
        success: false,
        duration,
        details: {},
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      console.log(`  ❌ Real-time notification test failed: ${error}`);
    }
  }

  private async testEventCleanup(): Promise<void> {
    console.log('🧹 Testing Event Cleanup...');
    
    const testName = 'Event Listener Cleanup';
    const startTime = performance.now();
    
    try {
      // Test that event listeners can be properly removed
      let eventCount = 0;
      
      const handler = () => {
        eventCount++;
      };

      // Add event listener
      socketService.onConnectionRequestReceived(handler);
      
      // Emit test event
      socketService.emit('connection_request_received', { test: true });
      
      // Wait a bit for event to process
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Remove event listener (this would typically be done in component cleanup)
      socketService.off('connection_request_received', handler);
      
      // Emit another event - should not be received
      socketService.emit('connection_request_received', { test: true });
      
      // Wait a bit more
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const duration = performance.now() - startTime;
      const cleanupWorking = eventCount === 1; // Should only receive first event
      
      this.results.push({
        testName,
        success: cleanupWorking,
        duration,
        details: {
          eventsReceived: eventCount,
          expectedEvents: 1,
          cleanupWorking,
          testDuration: `${duration.toFixed(2)}ms`
        },
        error: cleanupWorking ? undefined : 'Event cleanup not working properly'
      });
      
      console.log(`  ${cleanupWorking ? '✅' : '❌'} Event cleanup: ${eventCount} events received`);
      
    } catch (error) {
      const duration = performance.now() - startTime;
      this.results.push({
        testName,
        success: false,
        duration,
        details: {},
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      console.log(`  ❌ Event cleanup test failed: ${error}`);
    }
  }

  private generateSummary(): void {
    console.log('\n📊 Connection Request Test Summary');
    console.log('=' .repeat(50));
    
    const totalTests = this.results.length;
    const passedTests = this.results.filter(r => r.success).length;
    const failedTests = totalTests - passedTests;
    
    console.log(`Total Tests: ${totalTests}`);
    console.log(`Passed: ${passedTests} ✅`);
    console.log(`Failed: ${failedTests} ❌`);
    console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
    
    // WebSocket connection status
    console.log(`\nWebSocket Status: ${this.isConnected ? 'Connected ✅' : 'Disconnected ❌'}`);
    
    // Event statistics
    console.log(`\nEvents Captured: ${this.testEvents.length}`);
    this.testEvents.forEach(event => {
      console.log(`  - ${event.eventName}: ${new Date(event.timestamp).toLocaleTimeString()}`);
    });
    
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
    if (!this.isConnected) {
      console.log('  - Check WebSocket server connection and authentication');
    }
    if (this.testEvents.length === 0) {
      console.log('  - Verify event emission from backend is working');
    }
    if (failedTests > 0) {
      console.log('  - Review failed tests and check WebSocket implementation');
    }
    if (passedTests === totalTests && this.isConnected) {
      console.log('  - All tests passed! Real-time connection requests are working optimally.');
    }
  }

  // Cleanup method
  cleanup(): void {
    if (this.isConnected) {
      socketService.disconnect();
    }
    this.testEvents = [];
    this.results = [];
  }
}

// Export for use
export const connectionRequestTester = new ConnectionRequestTester();

// Auto-run in development if enabled
if (import.meta.env.DEV && import.meta.env.VITE_RUN_CONNECTION_TESTS === 'true') {
  setTimeout(() => {
    connectionRequestTester.runAllTests();
  }, 2000);
}
