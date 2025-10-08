import { motion } from 'framer-motion';

export default function Hero({ title, subtitle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-center py-16 px-4"
    >
      <h1 className="text-5xl md:text-6xl font-bold mb-4 gradient-text">
        {title}
      </h1>
      <p className="text-xl md:text-2xl text-blue-200">
        {subtitle}
      </p>
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="mt-12 text-4xl text-blue-300"
      >
        ↓
      </motion.div>
    </motion.div>
  );
}
