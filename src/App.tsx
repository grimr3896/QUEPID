import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Layout from '@/components/Layout';
import ChatsPage from '@/pages/ChatsPage';
import ChatScreen from '@/pages/ChatScreen';
import AddContactScreen from '@/pages/AddContactScreen';
import ProfilePage from '@/pages/ProfilePage';
import { useStore } from '@/store';

// Auth Pages
import WelcomeScreen from '@/pages/auth/WelcomeScreen';
import LoginScreen from '@/pages/auth/LoginScreen';
import SignupEmailScreen from '@/pages/auth/SignupEmailScreen';
import SignupUsernameScreen from '@/pages/auth/SignupUsernameScreen';
import SignupPasswordScreen from '@/pages/auth/SignupPasswordScreen';
import VerifyEmailScreen from '@/pages/auth/VerifyEmailScreen';
import AccountActivatedScreen from '@/pages/auth/AccountActivatedScreen';

// Onboarding Pages
import OnboardingDisplayName from '@/pages/onboarding/OnboardingDisplayName';
import OnboardingAvatar from '@/pages/onboarding/OnboardingAvatar';
import OnboardingAbout from '@/pages/onboarding/OnboardingAbout';
import OnboardingComplete from '@/pages/onboarding/OnboardingComplete';

function ProtectedRoute() {
  const { isAuthenticated } = useStore();
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Auth Routes */}
        <Route path="/" element={<WelcomeScreen />} />
        <Route path="/auth/login" element={<LoginScreen />} />
        <Route path="/auth/signup/email" element={<SignupEmailScreen />} />
        <Route path="/auth/signup/username" element={<SignupUsernameScreen />} />
        <Route path="/auth/signup/password" element={<SignupPasswordScreen />} />
        <Route path="/auth/verify" element={<VerifyEmailScreen />} />
        <Route path="/auth/activated" element={<AccountActivatedScreen />} />

        {/* Onboarding Routes (Semi-protected in real app, open for demo flow) */}
        <Route path="/onboarding/name" element={<OnboardingDisplayName />} />
        <Route path="/onboarding/avatar" element={<OnboardingAvatar />} />
        <Route path="/onboarding/about" element={<OnboardingAbout />} />
        <Route path="/onboarding/complete" element={<OnboardingComplete />} />

        {/* Protected App Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="chats" element={<ChatsPage />} />
            <Route path="chats/:id" element={<ChatScreen />} />
            <Route path="contacts/add" element={<AddContactScreen />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
