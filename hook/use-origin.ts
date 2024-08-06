//waits until the component is fully loaded and then returns the base URL of the current webpage
import { useEffect, useState } from "react";

export const useOrigin = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const origin = typeof window !== "undefined" && window.location.origin ? window.location.origin : "";

  if (!mounted) {
    return ""; 
  }

  return origin;
};
