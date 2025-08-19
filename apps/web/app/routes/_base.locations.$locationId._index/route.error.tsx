import { isRouteErrorResponse, useRouteError } from "react-router";

import { LayoutSection } from "~/ui/layout";

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return (
        <LayoutSection width="narrow" className="text-center">
          <div className="py-16">
            <div className="text-8xl mb-6">🏟️</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Location Not Found
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Sorry, we couldn&apos;t find the location you&apos;re looking for. 
              The location ID may be invalid or this location may no longer be available.
            </p>
            <div className="space-y-4">
              <a
                href="/"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Find Other Locations
              </a>
              <div>
                <a
                  href="mailto:support@rec.app"
                  className="text-blue-600 hover:text-blue-800 underline text-sm"
                >
                  Report a problem with this location
                </a>
              </div>
            </div>
          </div>
        </LayoutSection>
      );
    }

    if (error.status === 400) {
      return (
        <LayoutSection width="narrow" className="text-center">
          <div className="py-16">
            <div className="text-8xl mb-6">⚠️</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Invalid Request
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              The location ID provided is invalid. Please check the URL and try again.
            </p>
            <a
              href="/"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Go Home
            </a>
          </div>
        </LayoutSection>
      );
    }
  }

  return (
    <LayoutSection width="narrow" className="text-center">
      <div className="py-16">
        <div className="text-8xl mb-6">💥</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Something Went Wrong
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          We encountered an unexpected error while loading this location. 
          Please try again or contact support if the problem persists.
        </p>
        <div className="space-y-4">
          <button
            onClick={() => window.location.reload()}
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors mr-4"
          >
            Try Again
          </button>
          <a
            href="/"
            className="inline-block bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Go Home
          </a>
        </div>
      </div>
    </LayoutSection>
  );
}