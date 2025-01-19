import { Check } from 'lucide-react'

export function ProgressIndicator({ steps, currentStep }: { steps: string[]; currentStep: number }) {
  return (
    <div className="flex items-center justify-between mb-8">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              index <= currentStep ? 'bg-primary text-primary-foreground' : 'bg-gray-300 dark:bg-gray-700'
            }`}
          >
            {index < currentStep ? (
              <Check className="w-5 h-5" />
            ) : (
              index + 1
            )}
          </div>
          {index < steps.length - 1 && (
            <div
              className={`h-1 w-12 ${
                index < currentStep ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-700'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )
}

