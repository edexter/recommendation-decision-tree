import { motion } from 'framer-motion';

export default function DecisionNode({ node, state, onChoice, selectedChoice, level = 1 }) {
  const isActive = state === 'current';
  const isVisited = state === 'visited';
  const isFuture = state === 'future';

  let stateClasses = '';
  if (isActive) {
    stateClasses = 'bg-gradient-to-br from-blue-500 to-purple-600 animate-glow shadow-2xl scale-105 border-2 border-blue-300';
  } else if (isVisited) {
    stateClasses = 'bg-gradient-to-br from-blue-600 to-purple-700 opacity-80 border-2 border-blue-400';
  } else {
    stateClasses = 'bg-gray-600 opacity-40 border-2 border-gray-500';
  }

  // Fixed widths based on level
  // Level 1: Main decision (full width)
  // Level 2: Primary bifurcation (medium)
  // Level 3+: Secondary bifurcation (small)
  const widthClass = level === 1 ? 'w-[36rem]' : level === 2 ? 'w-[28rem]' : 'w-[22rem]';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center my-8"
    >
      {/* Rectangle box for decision */}
      <div className={`
        ${widthClass} min-h-[200px] p-6 rounded-2xl transition-all duration-300 relative flex flex-col justify-center
        ${stateClasses}
      `}>
        <div className="text-center">
          <h3 className="text-xl font-bold mb-2 whitespace-normal break-words">{node.question}</h3>
          {node.description && (
            <p className="text-sm text-blue-100 opacity-90 whitespace-normal break-words">{node.description}</p>
          )}
        </div>
      </div>

      {/* Choice buttons - ALWAYS show if visited or active */}
      {(isActive || isVisited) && (
        <div className="flex gap-4 mt-6">
          {Object.keys(node.options).map((choice) => {
            const isSelected = selectedChoice === choice;
            const isNotSelected = selectedChoice && selectedChoice !== choice;

            return (
              <motion.button
                key={choice}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onChoice(node.id, choice)}
                className={`
                  px-6 py-3 border-2 rounded-xl font-bold text-base transition-all shadow-lg
                  ${isSelected
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 border-white/40'
                    : isNotSelected
                      ? 'bg-gray-700 border-gray-600 opacity-50 hover:opacity-70'
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-white/40'
                  }
                `}
              >
                {choice}
              </motion.button>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
