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
import UserProfileScreen from "./pages/user-profile";

export default function App() {
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