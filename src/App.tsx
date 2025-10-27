import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { getAuthToken, setAuthToken, prefetchImagesBatched, preloadCriticalImages } from "@/lib/utils";
import { fetchExploreProfiles, getCurrentUserProfile, refreshAccessToken } from "@/lib/api";
import UserProfileScreen from "./pages/user-profile";
import { useClientOnly } from "@/lib/hooks/useClientOnly";
import { useConnectionRequests } from "@/hooks/useConnectionRequests";
import { useRoutePerformance, usePerformanceSummary } from "@/hooks/usePerformance";
import { measureWebVitals, logMemoryUsage, logBundleInfo } from "@/lib/performance";
import { chatSocketService } from "@/lib/socket";
import { Toaster } from 'react-hot-toast';
import ResponsiveLayout from "@/components/Layout/ResponsiveLayout";
import {
  LazyOnboardingPage,
  LazyExplorePage,
  LazyEventsPage,
  LazyChatsPage,
  LazyProfilePage,
  LazySettingsPage,
  LazyGridviewPage,
  LazyNotificationPage,
  preloadComponents
} from "@/lib/lazyLoading";

// Import Quiz page
import QuizPage from "./pages/quiz";
// Import Intro page
import IntroSequencePage from "./pages/intro";

// Import non-lazy components that are critical
import UserProfilePage from "./pages/profile";
import EventHistoryPage from "./pages/event-history";

// Import test interface for development
import TestInterface from "@/components/Testing/TestInterface";

export default function App() {
  const isClient = useClientOnly()

  // Initialize performance monitoring
  useRoutePerformance()
  usePerformanceSummary()

  // Initialize connection request handling
  useConnectionRequests()
  
  useEffect(() => {
    if (!isClient) return

    // Initialize performance monitoring
    if (import.meta.env.DEV) {
      measureWebVitals()
      logBundleInfo()
      logMemoryUsage()
    }

    // Preload critical components
    const preloadCriticalComponents = async () => {
      await preloadComponents([
        { importFn: () => import("./pages/explore"), name: "ExplorePage" },
        { importFn: () => import("./pages/chats"), name: "ChatsPage" },
        { importFn: () => import("./pages/notification"), name: "NotificationPage" }
      ])
    }

    const warmImages = async () => {
      try {
        const token = getAuthToken()
        if (!token) return

        const highPriorityUrls: string[] = []
        const lowPriorityUrls: string[] = []

        // Current user's hero and gallery images - HIGH PRIORITY
        const profileRes = await getCurrentUserProfile(token)
        if (profileRes?.success && profileRes.data?.images) {
          const imgs = profileRes.data.images
          const hero = imgs[0]?.cloudfrontUrl
          if (hero) highPriorityUrls.push(hero)
          imgs.slice(1, 5).forEach((img: any) => img?.cloudfrontUrl && highPriorityUrls.push(img.cloudfrontUrl))
        }

        // Initial explore profiles (first page) - HIGH PRIORITY for first 3, LOW for rest
        const exploreRes = await fetchExploreProfiles({ limit: 10, offset: 0, token })
        if (exploreRes?.success && Array.isArray(exploreRes.profiles)) {
          exploreRes.profiles.slice(0, 3).forEach((p: any) => {
            if (p?.profileImage) highPriorityUrls.push(p.profileImage)
          })
          exploreRes.profiles.slice(3, 8).forEach((p: any) => {
            if (p?.profileImage) lowPriorityUrls.push(p.profileImage)
          })
        }

        // Prefetch high priority images immediately with performance tracking
        if (highPriorityUrls.length > 0) {
          preloadCriticalImages(highPriorityUrls)
        }

        // Prefetch low priority images in batches with delay
        if (lowPriorityUrls.length > 0) {
          setTimeout(() => {
            prefetchImagesBatched(lowPriorityUrls, 3)
          }, 200)
        }
      } catch (e) {
        // ignore
      }
    }

    // Attempt silent session restore before preloading (7-day window via refresh cookie)
    const tryRefresh = async () => {
      try {
        const res = await refreshAccessToken()
        if (res?.success && res.tokens?.accessToken) {
          setAuthToken(res.tokens.accessToken)
          // Only initialize socket if we have a valid token
          try {
            chatSocketService.initializeConnection()
          } catch {}
          return true
        }
      } catch (e) {
        // No-op: user will go through onboarding if needed
      }
      return false
    }

    // Start preloading and warming after trying refresh
    let cleanup: () => void = () => {}
    
    tryRefresh().finally(() => {
      preloadCriticalComponents()
      const t = setTimeout(warmImages, 50)
      cleanup = () => clearTimeout(t)
    })

    return () => cleanup()
  }, [])
  return (
    <>
      <Routes>
        <Route path="/" element={<IntroSequencePage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/onboarding/*" element={<LazyOnboardingPage />} />
        <Route path="/edit-profile/*" element={<LazyProfilePage onSave={() => {}} />} />
        <Route path="/explore" element={
          <ResponsiveLayout>
            <LazyExplorePage />
          </ResponsiveLayout>
        } />
        <Route path="/notification" element={
          <ResponsiveLayout>
            <LazyNotificationPage />
          </ResponsiveLayout>
        } />
        <Route path="/chats" element={
          <ResponsiveLayout>
            <LazyChatsPage />
          </ResponsiveLayout>
        } />
        <Route path="/settings" element={
          <ResponsiveLayout>
            <LazySettingsPage />
          </ResponsiveLayout>
        } />
        <Route path="/events" element={
          <ResponsiveLayout>
            <LazyEventsPage />
          </ResponsiveLayout>
        } />
        <Route path="/event-history" element={
          <ResponsiveLayout>
            <EventHistoryPage />
          </ResponsiveLayout>
        } />
        <Route path="/search" element={
          <ResponsiveLayout>
            <LazyGridviewPage />
          </ResponsiveLayout>
        } />
        <Route path="/gridview" element={
          <ResponsiveLayout>
            <LazyGridviewPage />
          </ResponsiveLayout>
        } />
        <Route path="/profile" element={
          <ResponsiveLayout>
            <UserProfilePage />
          </ResponsiveLayout>
        } />
        {/* Catch-all route for user profiles - must be last */}
        <Route path="/:name" element={<UserProfileScreen />} />
        {/* Default route: redirect to onboarding */}
        <Route path="*" element={<Navigate to="/onboarding" replace />} />
      </Routes>

      {/* Toast notifications for connection requests */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
      {/* Test Interface - Development Only (enable via VITE_ENABLE_TEST_UI=true) */}
      {import.meta.env.DEV && import.meta.env.VITE_ENABLE_TEST_UI === 'true' && <TestInterface />}
    </>
  );
}