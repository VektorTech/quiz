import { useEffect } from "react";

const useSetInterval = (
  cb: () => void,
  interval: number,
  stop = false
) => {
  useEffect(() => {
    if (stop) {
      return;
    }
    const timer = setInterval(cb, interval);
    return () => clearInterval(timer);
  }, [interval, stop]);
};

export default useSetInterval;