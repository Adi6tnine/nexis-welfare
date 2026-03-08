interface Step {
  stepNumber: number;
  title: string;
  completed: boolean;
  current: boolean;
}

interface ApplicationStepperProps {
  steps: Step[];
  currentStep: number;
}

export function ApplicationStepper({ steps, currentStep }: ApplicationStepperProps) {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.stepNumber} className="flex items-center flex-1">
            {/* Step Circle */}
            <div className="flex flex-col items-center">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
                  transition-all duration-300
                  ${step.completed
                    ? 'bg-green-500 text-white'
                    : step.current
                    ? 'bg-blue-600 text-white ring-4 ring-blue-200'
                    : 'bg-gray-200 text-gray-500'
                  }
                `}
              >
                {step.completed ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  step.stepNumber
                )}
              </div>
              
              {/* Step Title */}
              <div className="mt-2 text-center">
                <p
                  className={`
                    text-xs font-medium
                    ${step.current ? 'text-blue-600' : step.completed ? 'text-green-600' : 'text-gray-500'}
                  `}
                >
                  {step.title}
                </p>
              </div>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={`
                  flex-1 h-1 mx-2 transition-all duration-300
                  ${step.completed ? 'bg-green-500' : 'bg-gray-200'}
                `}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
