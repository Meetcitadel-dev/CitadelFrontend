import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import OnboardingPage from "./pages/onboarding";
import ProfilePage from "./pages/profile";
import ExplorePage from "./pages/explore";
import NotificationPage from "./pages/notification";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/onboarding/*" element={<OnboardingPage />} />
        <Route path="/profile/*" element={<ProfilePage onSave={() => {}} />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/notification" element={<NotificationPage />} />
        {/* Default route: redirect to onboarding */}
        <Route path="*" element={<Navigate to="/onboarding" replace />} />
      </Routes>
    </BrowserRouter>
  );
}