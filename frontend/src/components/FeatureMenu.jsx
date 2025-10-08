import { motion } from 'framer-motion';

export default function FeatureMenu({ phase, selections, onToggle, isCompleted = false }) {
  // If completed, show all options. Otherwise, reveal one at a time as they're answered
  const numAnswered = Object.keys(selections).length;
  const optionsToShow = isCompleted ? phase.options : phase.options.slice(0, numAnswered + 1);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {optionsToShow.map((option, index) => {
        const isSelected = selections[option.id];
        const isCurrentQuestion = index === numAnswered;

        return (
          <motion.div
            key={option.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full"
          >
            <div className={`
              bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl p-6 border-2 shadow-xl transition-all
              ${isCurrentQuestion ? 'border-blue-300 scale-105' : 'border-blue-400'}
            `}>

              <div className="flex items-start justify-between gap-6">
                {/* Question */}
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-1 text-white">
                    {option.question}
                  </h3>
                  {option.description && (
                    <p className="text-sm text-blue-100 opacity-90">
                      {option.description}
                    </p>
                  )}
                </div>

                {/* Yes/No Toggle Buttons */}
                <div className="flex gap-3 shrink-0">
                  <motion.button
                    whileHover={!isCompleted ? { scale: 1.05 } : {}}
                    whileTap={!isCompleted ? { scale: 0.95 } : {}}
                    onClick={() => !isCompleted && onToggle(option.id, true)}
                    disabled={isCompleted}
                    className={`
                      px-6 py-2 border-2 rounded-lg font-bold text-sm transition-all shadow-lg
                      ${isSelected === true
                        ? 'bg-green-500 border-green-300 text-white'
                        : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                      }
                      ${isCompleted ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}
                    `}
                  >
                    YES
                  </motion.button>

                  <motion.button
                    whileHover={!isCompleted ? { scale: 1.05 } : {}}
                    whileTap={!isCompleted ? { scale: 0.95 } : {}}
                    onClick={() => !isCompleted && onToggle(option.id, false)}
                    disabled={isCompleted}
                    className={`
                      px-6 py-2 border-2 rounded-lg font-bold text-sm transition-all shadow-lg
                      ${isSelected === false
                        ? 'bg-red-500 border-red-300 text-white'
                        : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                      }
                      ${isCompleted ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}
                    `}
                  >
                    NO
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}

      {/* Continue button - only show if all options have been answered AND not completed */}
      {!isCompleted && phase.options.every(opt => selections[opt.id] !== undefined) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center pt-8"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onToggle('__continue__', true)}
            className="px-10 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 border-2 border-white/40 rounded-xl font-bold text-xl shadow-xl transition-all"
          >
            Continue to Next Phase →
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}
