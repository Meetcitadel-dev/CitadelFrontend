import { 
  AcademicCapIcon,
  LightBulbIcon,
  UserGroupIcon,
  ClockIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

export default function QuizDiagnostic() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Icon Diagnostic Test</h1>
        
        <div className="space-y-6">
          {/* Test 1: Basic Icon Rendering */}
          <div className="bg-white/10 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Test 1: Basic Icons</h2>
            <div className="flex gap-4 items-center">
              <AcademicCapIcon className="w-8 h-8 text-blue-400" />
              <LightBulbIcon className="w-8 h-8 text-yellow-400" />
              <UserGroupIcon className="w-8 h-8 text-green-400" />
              <ClockIcon className="w-8 h-8 text-purple-400" />
              <ArrowRightIcon className="w-8 h-8 text-red-400" />
            </div>
            <p className="mt-4 text-sm text-white/70">
              If you see colored icons above, Heroicons are working correctly.
            </p>
          </div>

          {/* Test 2: Icon with Different Sizes */}
          <div className="bg-white/10 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Test 2: Different Sizes</h2>
            <div className="flex gap-4 items-center">
              <CheckCircleIcon className="w-4 h-4 text-green-400" />
              <CheckCircleIcon className="w-8 h-8 text-green-400" />
              <CheckCircleIcon className="w-12 h-12 text-green-400" />
              <CheckCircleIcon className="w-16 h-16 text-green-400" />
            </div>
            <p className="mt-4 text-sm text-white/70">
              Icons should appear in increasing sizes.
            </p>
          </div>

          {/* Test 3: Icon in Gradient Background */}
          <div className="bg-white/10 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Test 3: Icon in Gradient</h2>
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto">
              <AcademicCapIcon className="w-10 h-10 text-white" />
            </div>
            <p className="mt-4 text-sm text-white/70 text-center">
              Icon should appear centered in a gradient circle.
            </p>
          </div>

          {/* Test 4: SVG Inspection */}
          <div className="bg-white/10 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Test 4: SVG Element Info</h2>
            <div className="space-y-2 text-sm">
              <p>Check browser console for SVG element details.</p>
              <div className="flex items-center gap-2">
                <span>Icon Element:</span>
                <XCircleIcon 
                  className="w-6 h-6 text-red-400" 
                  id="test-icon"
                  data-testid="diagnostic-icon"
                />
              </div>
            </div>
          </div>

          {/* Test 5: Inline SVG */}
          <div className="bg-white/10 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Test 5: Manual SVG</h2>
            <svg 
              className="w-8 h-8 text-blue-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
            <p className="mt-4 text-sm text-white/70">
              Manual SVG checkmark should appear above.
            </p>
          </div>
        </div>

        <div className="mt-8 p-6 bg-red-500/20 border border-red-500/50 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Troubleshooting</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-white/80">
            <li>If you see "X" marks instead of icons, Heroicons are not rendering</li>
            <li>Check browser console for any errors</li>
            <li>Verify @heroicons/react is installed: npm list @heroicons/react</li>
            <li>Check if Tailwind CSS is properly loaded</li>
            <li>Inspect SVG elements in browser DevTools</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

