import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import OnboardingPage from "./pages/onboarding";
import ProfilePage from "./pages/editprofile";
import ExplorePage from "./pages/explore";
import NotificationPage from "./pages/notification";
import ProfilesPage from "./pages/gridview";
import ChatApp from "./pages/chats";
import SettingsPage from "./pages/settings";
import EventsPage from "./pages/events";
import UserProfilePage from "./pages/profile";
import { useEffect } from "react";
import { getAuthToken, prefetchImagesBatched, preloadCriticalImages } from "@/lib/utils";
import { fetchExploreProfiles, getCurrentUserProfile } from "@/lib/api";
import UserProfileScreen from "./pages/user-profile";

export default function App() {
  useEffect(() => {
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

    // warm shortly after boot
    const t = setTimeout(warmImages, 50)
    return () => clearTimeout(t)
  }, [])
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/onboarding/*" element={<OnboardingPage />} />
        <Route path="/edit-profile/*" element={<ProfilePage onSave={() => {}} />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/notification" element={<NotificationPage />} />
        <Route path="/chats" element={<ChatApp />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/search" element={<ProfilesPage />} />
        <Route path="/gridview" element={<ProfilesPage />} />
        <Route path="/profile" element={<UserProfilePage />} />
        {/* Catch-all route for user profiles - must be last */}
        <Route path="/:name" element={<UserProfileScreen />} />
        {/* Default route: redirect to onboarding */}
        <Route path="*" element={<Navigate to="/onboarding" replace />} />
      </Routes>
    </BrowserRouter>
  );
}