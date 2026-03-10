import Calculator from "@/components/Calculator";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const Index = () => {
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-kuromi-dark">
      <div
        className="absolute inset-0 transition-all [transition-duration:2000ms] ease-out"
        style={{
          background: `
            radial-gradient(circle 600px at ${mousePos.x}% ${mousePos.y}%, hsl(280 60% 30% / 0.5), transparent),
            radial-gradient(circle 400px at ${100 - mousePos.x}% ${100 - mousePos.y}%, hsl(330 70% 40% / 0.3), transparent),
            radial-gradient(circle 500px at 80% 20%, hsl(260 50% 20% / 0.4), transparent),
            radial-gradient(circle 300px at 20% 80%, hsl(320 60% 35% / 0.3), transparent)
          `,
        }}
      />

      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background: `
            linear-gradient(135deg, transparent 30%, hsl(280 80% 50% / 0.08) 40%, transparent 50%),
            linear-gradient(225deg, transparent 30%, hsl(330 80% 60% / 0.06) 45%, transparent 55%)
          `,
        }}
      />

      <div className="absolute inset-0 pointer-events-none opacity-[0.15]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
        }}
      />

      <motion.div
        className="absolute w-[420px] h-[420px] rounded-full pointer-events-none"
        style={{
          background: "conic-gradient(from 0deg, hsl(280 60% 45% / 0.2), hsl(330 70% 60% / 0.15), hsl(260 50% 40% / 0.2), hsl(280 60% 45% / 0.2))",
          filter: "blur(40px)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Calculator />
      </motion.div>
    </div>
  );
};

export default Index;
