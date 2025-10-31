import React, { useState } from 'react';
import ResponsiveProfileGrid from '@/components/Explore/ResponsiveProfileGrid';
import ResponsiveInput from '@/components/ui/ResponsiveInput';
import ResponsiveButton from '@/components/ui/ResponsiveButton';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

export default function Explore() {
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    gender: '',
    years: [] as string[],
    universities: [] as string[],
    skills: [] as string[]
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by the ResponsiveProfileGrid component
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* Header */}
      <div className="space-y-4 px-4 sm:px-6 md:px-8 lg:px-10 pt-4 sm:pt-6">
        <div className="text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            Explore
          </h1>
          <p className="text-white/70 text-base sm:text-lg">Discover and connect with students from around the world</p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="flex-1">
            <ResponsiveInput
              type="text"
              placeholder="Search by name, university, or skills..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<MagnifyingGlassIcon className="h-5 w-5" />}
            />
          </div>
          <ResponsiveButton
            type="button"
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 hover:bg-green-500/20 hover:border-green-500 transition-all"
          >
            <FunnelIcon className="h-5 w-5" />
          </ResponsiveButton>
        </form>

        {/* Filters */}
        {showFilters && (
          <div className="card-responsive space-y-4 animate-slide-down">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <FunnelIcon className="h-5 w-5 text-green-400" />
              Filters
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ResponsiveInput
                label="Gender"
                type="select"
                value={filters.gender}
                onChange={(e) => setFilters(prev => ({ ...prev, gender: e.target.value }))}
              >
                <option value="">Any</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </ResponsiveInput>

              <ResponsiveInput
                label="Year"
                type="select"
                value={filters.years[0] || ''}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  years: e.target.value ? [e.target.value] : []
                }))}
              >
                <option value="">Any</option>
                <option value="1st">1st Year</option>
                <option value="2nd">2nd Year</option>
                <option value="3rd">3rd Year</option>
                <option value="4th">4th Year</option>
                <option value="5th">5th Year</option>
                <option value="graduate">Graduate</option>
              </ResponsiveInput>
            </div>

            <div className="flex gap-3">
              <ResponsiveButton
                variant="primary"
                onClick={() => setShowFilters(false)}
                className="flex-1"
              >
                Apply Filters
              </ResponsiveButton>
              <ResponsiveButton
                variant="secondary"
                onClick={() => setFilters({
                  gender: '',
                  years: [],
                  universities: [],
                  skills: []
                })}
              >
                Clear
              </ResponsiveButton>
            </div>
          </div>
        )}
      </div>

      {/* Profile Grid */}
      <div className="px-4 sm:px-6 md:px-8 lg:px-10">
        <ResponsiveProfileGrid
          search={search}
          filters={filters}
          limit={20}
        />
      </div>
    </div>
  );
}
