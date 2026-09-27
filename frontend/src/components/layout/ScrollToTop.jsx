import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function ScrollToTop() {
  const { pathname, hash, search } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (pathname.includes("//")) {
      const cleanPath = pathname.replace(/\/{2,}/g, "/") || "/";
      navigate(`${cleanPath}${search}${hash}`, { replace: true });
    }
  }, [pathname, search, hash, navigate]);

  useEffect(() => {
    if (hash) {
      const targetId = hash.replace("#", "");
      const timer = setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
      return () => clearTimeout(timer);
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname, hash]);

  return null;
}

export default ScrollToTop;
