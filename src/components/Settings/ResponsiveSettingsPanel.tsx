import React, { useState, useEffect } from 'react';
import ResponsiveCard from '../UI/ResponsiveCard';
import ResponsiveButton from '../UI/ResponsiveButton';
import ResponsiveInput from '../UI/ResponsiveInput';
import LoadingSpinner from '../UI/LoadingSpinner';
import { 
  UserIcon, 
  BellIcon, 
  ShieldCheckIcon, 
  Cog6ToothIcon,
  TrashIcon,
  ArrowRightOnRectangleIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import { getCurrentUserProfile, updateUserProfile, deleteUserAccount, logoutSession } from '@/lib/api';
import { getAuthToken, removeAuthToken } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface UserProfile {
  id: number;
  name: string;
  email: string;
  phoneNumber?: string;
  aboutMe?: string;
  isProfileComplete: boolean;
}

export default function ResponsiveSettingsPanel() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    aboutMe: ''
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = getAuthToken();
      if (!token) {
        navigate('/onboarding');
        return;
      }

      const response = await getCurrentUserProfile(token);
      if (response.success) {
        setProfile(response.data);
        setFormData({
          name: response.data.name || '',
          phoneNumber: response.data.phoneNumber || '',
          aboutMe: response.data.aboutMe || ''
        });
      } else {
        setError(response.message || 'Failed to load profile');
      }
    } catch (err) {
      setError('Failed to load profile. Please try again.');
      console.error('Error loading profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const token = getAuthToken();
      if (!token) return;

      const response = await updateUserProfile(formData, token);
      if (response.success) {
        setSuccess('Profile updated successfully');
        setProfile(prev => prev ? { ...prev, ...formData } : null);
      } else {
        setError(response.message || 'Failed to update profile');
      }
    } catch (err) {
      setError('Failed to update profile. Please try again.');
      console.error('Error updating profile:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutSession();
      removeAuthToken();
      navigate('/onboarding');
    } catch (err) {
      console.error('Error logging out:', err);
      // Force logout even if API fails
      removeAuthToken();
      navigate('/onboarding');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setSaving(true);
      setError(null);

      const token = getAuthToken();
      if (!token) return;

      const response = await deleteUserAccount(token);
      if (response.success) {
        removeAuthToken();
        navigate('/onboarding');
      } else {
        setError(response.message || 'Failed to delete account');
      }
    } catch (err) {
      setError('Failed to delete account. Please try again.');
      console.error('Error deleting account:', err);
    } finally {
      setSaving(false);
      setShowDeleteConfirm(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" text="Loading settings..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Settings */}
      <ResponsiveCard>
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-6">
            <UserIcon className="h-6 w-6 text-white" />
            <h2 className="text-lg font-semibold text-white">Profile Settings</h2>
          </div>

          {error && (
            <div className="bg-red-500/20 text-red-400 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-500/20 text-green-400 p-3 rounded-lg text-sm">
              {success}
            </div>
          )}

          <div className="space-y-4">
            <ResponsiveInput
              label="Name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter your name"
            />

            <ResponsiveInput
              label="Email"
              type="email"
              value={profile?.email || ''}
              disabled
              helperText="Email cannot be changed"
            />

            <ResponsiveInput
              label="Phone Number"
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
              placeholder="Enter your phone number"
            />

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                About Me
              </label>
              <textarea
                value={formData.aboutMe}
                onChange={(e) => setFormData(prev => ({ ...prev, aboutMe: e.target.value }))}
                placeholder="Tell us about yourself..."
                className="w-full px-3 py-2 border border-white/20 rounded-lg bg-white/5 text-white placeholder-white/50 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 resize-none"
                rows={4}
              />
            </div>
          </div>

          <ResponsiveButton
            onClick={handleSave}
            loading={saving}
            disabled={saving}
            variant="primary"
            fullWidth
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </ResponsiveButton>
        </div>
      </ResponsiveCard>

      {/* Account Actions */}
      <ResponsiveCard>
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-6">
            <Cog6ToothIcon className="h-6 w-6 text-white" />
            <h2 className="text-lg font-semibold text-white">Account Actions</h2>
          </div>

          <div className="space-y-3">
            <ResponsiveButton
              onClick={handleLogout}
              variant="outline"
              fullWidth
              className="flex items-center justify-center gap-2"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
              Logout
            </ResponsiveButton>

            <ResponsiveButton
              onClick={() => setShowDeleteConfirm(true)}
              variant="danger"
              fullWidth
              className="flex items-center justify-center gap-2"
            >
              <TrashIcon className="h-5 w-5" />
              Delete Account
            </ResponsiveButton>
          </div>
        </div>
      </ResponsiveCard>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <ResponsiveCard className="max-w-md w-full">
            <div className="space-y-4">
              <div className="text-center">
                <TrashIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Delete Account</h3>
                <p className="text-white/70">
                  Are you sure you want to delete your account? This action cannot be undone.
                </p>
              </div>

              <div className="flex gap-3">
                <ResponsiveButton
                  onClick={() => setShowDeleteConfirm(false)}
                  variant="secondary"
                  fullWidth
                >
                  Cancel
                </ResponsiveButton>
                <ResponsiveButton
                  onClick={handleDeleteAccount}
                  variant="danger"
                  fullWidth
                  loading={saving}
                  disabled={saving}
                >
                  {saving ? 'Deleting...' : 'Delete Account'}
                </ResponsiveButton>
              </div>
            </div>
          </ResponsiveCard>
        </div>
      )}
    </div>
  );
}
