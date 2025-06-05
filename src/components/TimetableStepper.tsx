
import { useTimetable } from '@/contexts/TimetableContext';
import { Button } from '@/components/ui/button';
import { Check, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimetableStepperProps {
  onStepClick: (stepIndex: number, path: string) => void;
}

const TimetableStepper = ({ onStepClick }: TimetableStepperProps) => {
  const { currentStep, steps, canProceedToStep } = useTimetable();

  return (
    <div className="w-full bg-white border-b p-4">
      <div className="container mx-auto">
        <div className="flex items-center justify-between overflow-x-auto">
          {steps.map((step, index) => {
            const isActive = currentStep === index;
            const isCompleted = step.completed;
            const isAccessible = canProceedToStep(index);
            
            return (
              <div key={step.id} className="flex items-center min-w-0">
                <div className="flex flex-col items-center min-w-max">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => isAccessible && onStepClick(index, step.path)}
                    disabled={!isAccessible}
                    className={cn(
                      "w-10 h-10 rounded-full border-2 p-0",
                      isActive && "border-blue-500 bg-blue-50",
                      isCompleted && "border-green-500 bg-green-50",
                      !isAccessible && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <span className={cn(
                        "text-sm font-medium",
                        isActive ? "text-blue-600" : "text-gray-500"
                      )}>
                        {index + 1}
                      </span>
                    )}
                  </Button>
                  <div className="text-center mt-2 max-w-24">
                    <p className={cn(
                      "text-xs font-medium truncate",
                      isActive ? "text-blue-600" : "text-gray-600"
                    )}>
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {step.description}
                    </p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <ChevronRight className="w-4 h-4 text-gray-400 mx-2 flex-shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TimetableStepper;
