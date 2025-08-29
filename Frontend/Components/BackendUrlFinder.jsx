import React, { useState } from 'react';

export default function BackendUrlFinder() {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Common backend URL patterns to test
  const testUrls = [
    'https://expenses-tracker-backend.vercel.app',
    'https://expenses-tracker-backend-git-main.vercel.app',
    'https://expenses-tracker-backend-git-main-abc123.vercel.app',
    'https://expenses-tracker-backend-abc123.vercel.app',
    'https://expenses-tracker-backend-git-main-xyz789.vercel.app',
    'https://expenses-tracker-backend-xyz789.vercel.app',
    'https://expenses-tracker-backend-git-main-def456.vercel.app',
    'https://expenses-tracker-backend-def456.vercel.app',
  ];

  const testBackendUrls = async () => {
    setIsLoading(true);
    setResults([]);

    const newResults = [];

    for (const url of testUrls) {
      try {
        console.log(`Testing: ${url}/api/health`);
        
        const response = await fetch(`${url}/api/health`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          newResults.push({
            url: url,
            status: response.status,
            success: true,
            data: data,
            error: null
          });
          console.log(`✅ Found working backend: ${url}`);
        } else {
          newResults.push({
            url: url,
            status: response.status,
            success: false,
            data: null,
            error: `HTTP ${response.status}`
          });
        }
      } catch (error) {
        newResults.push({
          url: url,
          status: 'ERROR',
          success: false,
          data: null,
          error: error.message
        });
        console.log(`❌ Failed: ${url} - ${error.message}`);
      }
    }

    setResults(newResults);
    setIsLoading(false);
  };

  const setAsBackendUrl = (url) => {
    // This will help you copy the URL to use in your environment variables
    navigator.clipboard.writeText(url);
    alert(`Backend URL copied to clipboard: ${url}\n\nNow set this as your VITE_API_BASE_URL environment variable in Vercel.`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Backend URL Finder</h1>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-blue-800 mb-2">Instructions</h2>
          <p className="text-blue-700">
            This tool will test common backend URL patterns to help you find your actual backend URL.
            Click the button below to start testing.
          </p>
        </div>

        <button
          onClick={testBackendUrls}
          disabled={isLoading}
          className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg disabled:bg-gray-400 mb-6"
        >
          {isLoading ? 'Testing URLs...' : 'Find Backend URL'}
        </button>

        {results.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold mb-4">Test Results</h2>
            {results.map((result, index) => (
              <div key={index} className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${
                result.success ? 'border-green-500' : 'border-red-500'
              }`}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">{result.url}</h3>
                    <p><strong>Status:</strong> {result.status}</p>
                    <p><strong>Success:</strong> {result.success ? '✅ Yes' : '❌ No'}</p>
                    
                    {result.error && (
                      <p className="text-red-600"><strong>Error:</strong> {result.error}</p>
                    )}
                    
                    {result.data && (
                      <div className="mt-2">
                        <strong>Response:</strong>
                        <pre className="bg-gray-50 p-2 rounded mt-1 text-sm overflow-x-auto">
                          {JSON.stringify(result.data, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                  
                  {result.success && (
                    <button
                      onClick={() => setAsBackendUrl(result.url)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg ml-4"
                    >
                      Use This URL
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">Next Steps</h3>
          <ol className="text-yellow-700 space-y-1 list-decimal list-inside">
            <li>Find a working backend URL from the results above</li>
            <li>Click "Use This URL" to copy it</li>
            <li>Go to your frontend Vercel project settings</li>
            <li>Add environment variable: <code>VITE_API_BASE_URL</code> = the copied URL</li>
            <li>Redeploy your frontend</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
