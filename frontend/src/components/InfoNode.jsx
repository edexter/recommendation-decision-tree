import { motion } from 'framer-motion';
import { useEffect } from 'react';

export default function InfoNode({ node, state, onContinue, level = 1 }) {
  const isActive = state === 'current';
  const isVisited = state === 'visited';

  // Auto-advance after a delay when active
  useEffect(() => {
    if (isActive && node.next !== null) {
      const timer = setTimeout(() => {
        onContinue(node.id);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isActive, node, onContinue]);

  let stateClasses = '';
  if (isActive) {
    stateClasses = 'bg-gradient-to-br from-blue-500 to-purple-600 animate-glow shadow-2xl scale-105';
  } else if (isVisited) {
    stateClasses = 'bg-gradient-to-br from-blue-600 to-purple-700 opacity-80';
  } else {
    stateClasses = 'bg-gray-600 opacity-40';
  }

  // Fixed widths based on level (same as DecisionNode)
  const widthClass = level === 1 ? 'w-[36rem]' : level === 2 ? 'w-[28rem]' : 'w-[22rem]';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center my-8"
    >
      <div className={`
        ${widthClass} min-h-[200px] p-6 rounded-2xl transition-all duration-300 relative flex flex-col justify-center
        ${stateClasses}
      `}>
        <div className="text-center">
          <h3 className="text-xl font-bold mb-2 whitespace-normal break-words">{node.title}</h3>
          <p className="text-blue-100 whitespace-normal break-words">{node.description}</p>

          {isActive && node.next === null && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onContinue(node.id)}
              className="mt-6 px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 border-2 border-white/40 rounded-xl font-bold text-lg shadow-xl transition-all"
            >
              Continue to Next Phase →
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
