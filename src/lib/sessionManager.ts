/**
 * Global Session Manager for Adjective Persistence
 * Handles session state that persists across component remounts and navigation
 */

interface ExploreSession {
  sessionId: string | null;
  currentProfileIndex: number;
  profiles: any[];
  lastUpdated: number;
}

const SESSION_KEY = 'explore_session';
const SESSION_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

class SessionManager {
  private session: ExploreSession | null = null;

  constructor() {
    this.loadSession();
  }

  /**
   * Load session from localStorage
   */
  private loadSession(): void {
    if (typeof window === 'undefined') return
    
    try {
      const stored = localStorage.getItem(SESSION_KEY);
      if (stored) {
        const parsedSession = JSON.parse(stored);
        
        // Check if session is expired
        if (Date.now() - parsedSession.lastUpdated < SESSION_EXPIRY) {
          this.session = parsedSession;
        } else {
          // Session expired, clear it
          this.clearSession();
        }
      }
    } catch (error) {
      console.error('Error loading session:', error);
      this.clearSession();
    }
  }

  /**
   * Save session to localStorage
   */
  private saveSession(): void {
    if (typeof window === 'undefined') return
    
    if (this.session) {
      try {
        this.session.lastUpdated = Date.now();
        localStorage.setItem(SESSION_KEY, JSON.stringify(this.session));
      } catch (error) {
        console.error('Error saving session:', error);
      }
    }
  }

  /**
   * Get current session ID
   */
  getSessionId(): string | null {
    return this.session?.sessionId || null;
  }

  /**
   * Set session ID
   */
  setSessionId(sessionId: string): void {
    if (!this.session) {
      this.session = {
        sessionId: null,
        currentProfileIndex: 0,
        profiles: [],
        lastUpdated: Date.now()
      };
    }
    this.session.sessionId = sessionId;
    this.saveSession();
  }

  /**
   * Get current profile index
   */
  getCurrentProfileIndex(): number {
    return this.session?.currentProfileIndex || 0;
  }

  /**
   * Set current profile index
   */
  setCurrentProfileIndex(index: number): void {
    if (!this.session) {
      this.session = {
        sessionId: null,
        currentProfileIndex: 0,
        profiles: [],
        lastUpdated: Date.now()
      };
    }
    this.session.currentProfileIndex = index;
    this.saveSession();
  }

  /**
   * Get cached profiles
   */
  getProfiles(): any[] {
    return this.session?.profiles || [];
  }

  /**
   * Set profiles
   */
  setProfiles(profiles: any[]): void {
    if (!this.session) {
      this.session = {
        sessionId: null,
        currentProfileIndex: 0,
        profiles: [],
        lastUpdated: Date.now()
      };
    }
    this.session.profiles = profiles;
    this.saveSession();
  }

  /**
   * Clear the entire session
   */
  clearSession(): void {
    this.session = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem(SESSION_KEY);
    }
  }

  /**
   * Check if session exists and is valid
   */
  hasValidSession(): boolean {
    return this.session !== null && 
           Date.now() - (this.session.lastUpdated || 0) < SESSION_EXPIRY;
  }

  /**
   * Get session info for debugging
   */
  getSessionInfo(): ExploreSession | null {
    return this.session;
  }

  /**
   * Force refresh session (clear and start fresh)
   */
  refreshSession(): void {
    this.clearSession();
  }
}

// Export singleton instance
export const sessionManager = new SessionManager();
export default sessionManager;
