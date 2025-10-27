import React, { useState, useEffect } from 'react';
import ResponsiveCard from '../UI/ResponsiveCard';
import ResponsiveButton from '../UI/ResponsiveButton';
import LoadingSpinner from '../UI/LoadingSpinner';
import { fetchExploreProfiles } from '@/lib/api';
import { getAuthToken, ensureValidToken } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface Profile {
  id: string;
  name: string;
  email: string;
  university?: {
    name: string;
  };
  degree?: string;
  year?: string;
  skills?: string[];
  aboutMe?: string;
  images?: Array<{
    id: string;
    cloudfrontUrl: string;
  }>;
  connectionState?: {
    status: string;
  };
}

interface ResponsiveProfileGridProps {
  limit?: number;
  search?: string;
  filters?: {
    gender?: string;
    years?: string[];
    universities?: string[];
    skills?: string[];
  };
}

export default function ResponsiveProfileGrid({
  limit = 20,
  search = '',
  filters = {}
}: ResponsiveProfileGridProps) {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);

  const loadProfiles = async (pageNum: number = 0, reset: boolean = false) => {
    try {
      setLoading(true);
      setError(null);

      // Try to ensure we have a valid token (will refresh if expired)
      const token = await ensureValidToken();
      if (!token) {
        // Token refresh failed, redirect to login
        console.error('No valid token available, redirecting to onboarding');
        navigate('/onboarding');
        return;
      }

      const response = await fetchExploreProfiles({
        limit,
        offset: pageNum * limit,
        search,
        ...filters,
        token
      });

      if (response.success) {
        const newProfiles = response.profiles || [];
        setProfiles(prev => reset ? newProfiles : [...prev, ...newProfiles]);
        setHasMore(newProfiles.length === limit);
        setPage(pageNum);
      } else {
        setError(response.message || 'Failed to load profiles');
      }
    } catch (err) {
      setError('Failed to load profiles. Please try again.');
      console.error('Error loading profiles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfiles(0, true);
  }, [search, filters]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      loadProfiles(page + 1, false);
    }
  };

  const handleConnect = async (profileId: string) => {
    // Implement connection logic
    console.log('Connect to profile:', profileId);
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">{error}</div>
        <ResponsiveButton onClick={() => loadProfiles(0, true)}>
          Try Again
        </ResponsiveButton>
      </div>
    );
  }

  if (loading && profiles.length === 0) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" text="Loading profiles..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
        {profiles.map((profile) => (
          <ResponsiveCard
            key={profile.id}
            hover
            clickable
            className="group overflow-hidden"
          >
            <div className="space-y-4">
              {/* Profile Image */}
              <div className="relative">
                <div className="aspect-square w-full bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-xl overflow-hidden">
                  {profile.images && profile.images.length > 0 ? (
                    <img
                      src={profile.images[0].cloudfrontUrl}
                      alt={profile.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/50">
                      <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                    </div>
                  )}
                </div>

                {/* Connection Status Badge */}
                {profile.connectionState && (
                  <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md ${
                      profile.connectionState.status === 'connected'
                        ? 'bg-green-500/30 text-green-300 border border-green-400/50'
                        : 'bg-blue-500/30 text-blue-300 border border-blue-400/50'
                    }`}>
                      {profile.connectionState.status}
                    </span>
                  </div>
                )}
              </div>

              {/* Profile Info */}
              <div className="space-y-2">
                <h3 className="text-lg sm:text-xl font-bold text-white truncate group-hover:text-green-400 transition-colors">
                  {profile.name}
                </h3>

                {profile.university && (
                  <p className="text-sm text-white/70 truncate flex items-center gap-1">
                    <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                    </svg>
                    {profile.university.name}
                  </p>
                )}

                {profile.degree && profile.year && (
                  <p className="text-sm text-white/60 flex items-center gap-1">
                    <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                    </svg>
                    {profile.degree} • {profile.year}
                  </p>
                )}

                {profile.skills && profile.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {profile.skills.slice(0, 3).map((skill, index) => (
                      <span
                        key={index}
                        className="px-2.5 py-1 bg-gradient-to-r from-green-500/20 to-blue-500/20 text-white/90 text-xs font-medium rounded-full border border-white/10"
                      >
                        {skill}
                      </span>
                    ))}
                    {profile.skills.length > 3 && (
                      <span className="px-2.5 py-1 bg-white/10 text-white/80 text-xs font-medium rounded-full border border-white/10">
                        +{profile.skills.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {profile.aboutMe && (
                  <p className="text-sm text-white/70 line-clamp-2">
                    {profile.aboutMe}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <ResponsiveButton
                  variant="primary"
                  size="sm"
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                  onClick={() => handleConnect(profile.id)}
                >
                  Connect
                </ResponsiveButton>

                <ResponsiveButton
                  variant="outline"
                  size="sm"
                  className="border-green-500/50 hover:bg-green-500/10"
                  onClick={() => window.location.href = `/${profile.name}`}
                >
                  View
                </ResponsiveButton>
              </div>
            </div>
          </ResponsiveCard>
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center pt-4">
          <ResponsiveButton
            onClick={handleLoadMore}
            loading={loading}
            variant="secondary"
            disabled={loading}
            className="min-w-[200px]"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Loading...
              </span>
            ) : (
              'Load More Profiles'
            )}
          </ResponsiveButton>
        </div>
      )}

      {/* Empty State */}
      {!loading && profiles.length === 0 && (
        <div className="text-center py-16 px-4">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No profiles found</h3>
          <p className="text-white/70 mb-6 max-w-md mx-auto">
            Try adjusting your search or filters to discover more amazing people.
          </p>
          <ResponsiveButton
            onClick={() => loadProfiles(0, true)}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
          >
            Refresh Profiles
          </ResponsiveButton>
        </div>
      )}
    </div>
  );
}
