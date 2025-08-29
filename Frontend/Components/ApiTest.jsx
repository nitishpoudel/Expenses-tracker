import React, { useState } from 'react';
import { API_ENDPOINTS } from '../src/config/api.js';

export default function ApiTest() {
  const [testResults, setTestResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const testBackendConnection = async () => {
    setIsLoading(true);
    setTestResults([]);

    const tests = [
      {
        name: 'Health Check',
        url: API_ENDPOINTS.HEALTH,
        method: 'GET'
      },
      {
        name: 'CORS Test',
        url: API_ENDPOINTS.HEALTH.replace('/health', '/cors-test'),
        method: 'GET'
      }
    ];

    const results = [];

    for (const test of tests) {
      try {
        console.log(`Testing: ${test.name} at ${test.url}`);
        
        const response = await fetch(test.url, {
          method: test.method,
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        
        results.push({
          name: test.name,
          url: test.url,
          status: response.status,
          success: response.ok,
          data: data,
          error: null
        });

        console.log(`${test.name} result:`, data);
      } catch (error) {
        results.push({
          name: test.name,
          url: test.url,
          status: 'ERROR',
          success: false,
          data: null,
          error: error.message
        });

        console.error(`${test.name} error:`, error);
      }
    }

    setTestResults(results);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">API Connection Test</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Current Configuration</h2>
          <div className="bg-gray-50 p-4 rounded">
            <p><strong>API Base URL:</strong> {import.meta.env.VITE_API_BASE_URL || 'Not set (using default)'}</p>
            <p><strong>Health Endpoint:</strong> {API_ENDPOINTS.HEALTH}</p>
            <p><strong>Login Endpoint:</strong> {API_ENDPOINTS.LOGIN}</p>
          </div>
        </div>

        <button
          onClick={testBackendConnection}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg disabled:bg-gray-400 mb-6"
        >
          {isLoading ? 'Testing...' : 'Test Backend Connection'}
        </button>

        {testResults.length > 0 && (
          <div className="space-y-4">
            {testResults.map((result, index) => (
              <div key={index} className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${
                result.success ? 'border-green-500' : 'border-red-500'
              }`}>
                <h3 className="text-lg font-semibold mb-2">{result.name}</h3>
                <p><strong>URL:</strong> {result.url}</p>
                <p><strong>Status:</strong> {result.status}</p>
                <p><strong>Success:</strong> {result.success ? '' : 'No'}</p>
                
                {result.error && (
                  <div className="mt-2">
                    <strong>Error:</strong>
                    <p className="text-red-600 bg-red-50 p-2 rounded mt-1">{result.error}</p>
                  </div>
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
            ))}
          </div>
        )}

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">Troubleshooting</h3>
          <ul className="text-yellow-700 space-y-1">
            <li>• If you see "net::ERR_FAILED", the backend URL is incorrect</li>
            <li>• If you see CORS errors, the backend needs to allow your frontend domain</li>
            <li>• If you see 404 errors, the backend endpoints don't exist</li>
            <li>• Check your Vercel dashboard for the correct backend URL</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
