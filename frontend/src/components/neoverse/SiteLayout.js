import React from "react";
import { useLocation, Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { AtmosphereLayer } from "./AtmosphereLayer";
import { SeluneSky } from "./SeluneSky";

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: -6,
    transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
  },
};

export const SiteLayout = () => {
  const location = useLocation();
  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none fixed inset-0 z-0">
        <AtmosphereLayer grain stars vignette />
      </div>
      <SeluneSky />
      <div className="relative z-10">
        <SiteHeader />
        <AnimatePresence mode="wait">
          <motion.main
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Outlet />
          </motion.main>
        </AnimatePresence>
        <SiteFooter />
      </div>
    </div>
  );
};

export default SiteLayout;
