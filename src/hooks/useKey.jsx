import * as React from "react";

export default function useKey(key, callback) {
  const callbackRef = React.useRef(callback);

  React.useEffect(() => {
    callbackRef.current = callback;
  });

  React.useEffect(() => {
    function handle(event) {
      // stop scrolling when space is pressed
      if (event.key === " " || "space" || 32) {
        event.preventDefault();
      }

      // if (event.key === 32 && event.target === document.body) {
      //   event.preventDefault();
      // }

      if (event.key === key) callbackRef.current(event);
    }

    document.addEventListener("keydown", handle);

    return () => document.removeEventListener("keydown", handle);
  }, [key]);
}
