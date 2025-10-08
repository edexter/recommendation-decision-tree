import { motion } from 'framer-motion';

export default function PhaseHeader({ phase, currentPhase, totalPhases }) {
  const isActive = phase.id === currentPhase;
  const isPast = phase.id < currentPhase;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`
        mb-12 p-6 rounded-2xl text-center
        ${isActive ? 'glass-strong animate-glow' : isPast ? 'glass opacity-60' : 'glass opacity-30'}
      `}
    >
      <div className="flex justify-center gap-2 mb-4">
        {[...Array(totalPhases)].map((_, i) => (
          <div
            key={i}
            className={`
              w-3 h-3 rounded-full transition-all
              ${i + 1 === currentPhase ? 'bg-blue-400 scale-125' : i + 1 < currentPhase ? 'bg-purple-400' : 'bg-gray-500'}
            `}
          />
        ))}
      </div>
      <h2 className="text-3xl font-bold mb-2">
        Phase {phase.id}: {phase.name}
      </h2>
      <p className="text-blue-200">
        {phase.description}
      </p>
    </motion.div>
  );
}
