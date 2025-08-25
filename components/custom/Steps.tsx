// StepProgress.tsx
import { motion, AnimatePresence } from "framer-motion";

interface StepProgressProps {
  stepIndex: number;
  stepCount: number;
}

export function StepProgress({ stepIndex, stepCount }: StepProgressProps) {
  const dashes = Array.from({ length: stepCount });

  return (
    <div className="flex items-center justify-center gap-2 h-9">
      {dashes.map((_, index) => {
        const isActive = index === stepIndex;

        return (
          <AnimatePresence key={index}>
            <motion.div
              key={index}
              initial={false}
              animate={{
                backgroundColor: isActive ? "#3b82f6" : "#e5e7eb",
                // scale: isActive ? 1.1 : 1,
                // height: isActive ? "14px" : "9px",
              }}
              transition={{ duration: 0.5 }}
              className="w-full h-[9px] rounded-sm"
            />
          </AnimatePresence>
        );
      })}
    </div>
  );
}
