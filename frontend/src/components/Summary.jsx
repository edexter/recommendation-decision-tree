import { motion } from 'framer-motion';

export default function Summary({ choices, treeData, onReset }) {
  const getChoiceSummary = () => {
    const summary = [];
    Object.entries(choices).forEach(([nodeId, choice]) => {
      const node = treeData.nodes.find(n => n.id === nodeId);
      if (node && node.type === 'decision') {
        summary.push({
          question: node.question,
          answer: choice,
          phase: node.phase
        });
      }
    });
    return summary.sort((a, b) => a.phase - b.phase);
  };

  const choiceSummary = getChoiceSummary();

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto px-4 py-16"
    >
      <div className="glass-strong p-8 rounded-3xl">
        <h2 className="text-4xl font-bold mb-6 gradient-text text-center">
          Your Recommendation System Configuration
        </h2>

        <div className="space-y-6 mb-8">
          {choiceSummary.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass p-4 rounded-xl"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <span className="text-sm text-blue-300 font-semibold">
                    Phase {item.phase}
                  </span>
                  <p className="text-lg font-medium text-white mt-1">
                    {item.question}
                  </p>
                </div>
                <div className="ml-4">
                  <span className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg font-bold">
                    {item.answer}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="glass p-6 rounded-xl mb-8 bg-gradient-to-r from-blue-900/50 to-purple-900/50">
          <h3 className="text-xl font-bold mb-3">Recommendation</h3>
          <p className="text-blue-100">
            Based on your selections, we recommend a {choiceSummary.length > 0 ? 'customized' : 'hybrid'} recommendation system
            with real-time tracking and personalized delivery. This configuration will maximize attendee engagement
            while respecting privacy preferences.
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onReset}
            className="px-8 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-lg border border-white/40 rounded-xl font-bold transition-all"
          >
            ↻ Start Over
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl font-bold shadow-lg transition-all"
          >
            Get a Custom Quote →
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
