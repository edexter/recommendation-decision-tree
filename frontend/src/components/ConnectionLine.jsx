import { motion } from 'framer-motion';

export default function ConnectionLine({ isActive, label, horizontal = false }) {
  if (horizontal) {
    // Horizontal line for cross-branch connections
    return (
      <div className="flex items-center">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: 80 }}
          transition={{ duration: 0.5 }}
          className={`
            h-1 rounded-full
            ${isActive ? 'bg-gradient-to-r from-blue-400 to-purple-500' : 'bg-gray-600 opacity-40'}
          `}
        />
      </div>
    );
  }

  // Vertical line (original)
  return (
    <div className="flex flex-col items-center my-4">
      <motion.div
        initial={{ height: 0 }}
        animate={{ height: 60 }}
        transition={{ duration: 0.5 }}
        className={`
          w-1 rounded-full
          ${isActive ? 'bg-gradient-to-b from-blue-400 to-purple-500' : 'bg-gray-600 opacity-40'}
        `}
      />
      {label && (
        <span className={`
          text-sm font-semibold px-3 py-1 rounded-full
          ${isActive ? 'text-blue-300' : 'text-gray-500'}
        `}>
          {label}
        </span>
      )}
    </div>
  );
}
