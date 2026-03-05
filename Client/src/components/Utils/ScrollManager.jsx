import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

function ScrollManager() {
  const location = useLocation();
  const positions = useRef({});

  useEffect(() => {
    const path = location.pathname;

    // Pages where we want to PRESERVE scroll
    const preserveScrollPages = [
      "/communities",
      "/posts"
    ];

    if (preserveScrollPages.includes(path)) {
      const saved = positions.current[path] || 0;
      window.scrollTo(0, saved);
    } else {
      window.scrollTo(0, 0);
    }

    return () => {
      positions.current[path] = window.scrollY;
    };

  }, [location.pathname]);

  return null;
}

export default ScrollManager;