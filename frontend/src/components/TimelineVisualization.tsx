interface TimelineEvent {
  date: string;
  event: string;
  schemeId: string;
  schemeName: string;
  probability: number;
  action: string;
}

interface TimelineVisualizationProps {
  events: TimelineEvent[];
}

export function TimelineVisualization({ events }: TimelineVisualizationProps) {
  if (events.length === 0) {
    return null;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getYearsFromNow = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const years = Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 365));
    return years;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Future Eligibility Timeline</h2>
          <p className="text-sm text-gray-600">Schemes you may qualify for in the future</p>
        </div>
      </div>

      <div className="space-y-6">
        {events.map((event, index) => {
          const yearsFromNow = getYearsFromNow(event.date);
          
          return (
            <div key={index} className="relative pl-8 pb-6 border-l-2 border-purple-200 last:border-l-0 last:pb-0">
              {/* Timeline Dot */}
              <div className="absolute left-0 top-0 -ml-2 w-4 h-4 rounded-full bg-purple-500 border-4 border-white" />
              
              {/* Event Card */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-semibold text-purple-900">
                      {formatDate(event.date)}
                      {yearsFromNow > 0 && (
                        <span className="ml-2 text-xs text-purple-600">
                          (in {yearsFromNow} {yearsFromNow === 1 ? 'year' : 'years'})
                        </span>
                      )}
                    </p>
                    <h3 className="text-lg font-bold text-gray-900 mt-1">
                      {event.schemeName}
                    </h3>
                  </div>
                  
                  {/* Probability Badge */}
                  <div className="flex items-center space-x-1 px-3 py-1 bg-purple-200 rounded-full">
                    <svg className="w-4 h-4 text-purple-700" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs font-bold text-purple-900">
                      {event.probability}% likely
                    </span>
                  </div>
                </div>

                <p className="text-sm text-gray-700 mb-3">
                  <strong>Event:</strong> {event.event}
                </p>

                <div className="flex items-center space-x-2 text-sm">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-purple-900 font-medium">Action: {event.action}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Set Reminder CTA */}
      <div className="mt-6 p-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg border border-purple-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-purple-900">Get notified</p>
              <p className="text-xs text-purple-700">We'll remind you when you become eligible</p>
            </div>
          </div>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium">
            Set Reminder
          </button>
        </div>
      </div>
    </div>
  );
}
