import { useEffect, useRef } from "react";

const useInterval = (callback: () => void, delay: number | null) => {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (typeof delay !== "number") {
      return;
    }
    const timer = setInterval(callbackRef.current, delay);
    return () => clearInterval(timer);
  }, [delay]);
};

export default useInterval;
