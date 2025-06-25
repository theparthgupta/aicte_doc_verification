import { motion } from "framer-motion";
export function BackgroundLayout({ children }: { children: React.ReactNode }) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-[#f8f9fa]">
        <motion.div
          className="absolute inset-0 z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="absolute top-0 left-0 w-64 h-64 bg-[#3498db] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#2ecc71] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#f39c12] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </motion.div>
        <div className="relative z-10">
          {children}
        </div>
      </div>
    );
  }