import { useRef, useLayoutEffect, useEffect, useMemo } from "react";

type noop = () => void;

export const useAnimationFrame = (callback: noop) => {
  const callbackRef = useRef(callback);
  const frameRef = useRef<number | undefined>();

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const loop = useMemo(() => {
    return () => {
      frameRef.current = requestAnimationFrame(loop);
      const cb = callbackRef.current;
      cb();
    };
  }, []);

  useLayoutEffect(() => {
    frameRef.current = requestAnimationFrame(loop);

    return () => {
      frameRef.current && cancelAnimationFrame(frameRef.current);
    };
  }, [loop]);
};
