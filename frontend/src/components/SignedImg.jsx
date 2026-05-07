import { useEffect, useState } from "react";
import { resolveImage, isStorageKey } from "../lib/api";

export function useResolvedSrc(src) {
  const [resolved, setResolved] = useState(() => (isStorageKey(src) ? "" : src || ""));
  useEffect(() => {
    let cancelled = false;
    if (!src) {
      setResolved("");
      return;
    }
    if (!isStorageKey(src)) {
      setResolved(src);
      return;
    }
    resolveImage(src)
      .then((url) => !cancelled && setResolved(url))
      .catch(() => !cancelled && setResolved(""));
    return () => {
      cancelled = true;
    };
  }, [src]);
  return resolved;
}

export default function SignedImg({ src, alt = "", className, ...rest }) {
  const [resolved, setResolved] = useState(() => (isStorageKey(src) ? "" : src || ""));

  useEffect(() => {
    let cancelled = false;
    if (!src) {
      setResolved("");
      return;
    }
    if (!isStorageKey(src)) {
      setResolved(src);
      return;
    }
    resolveImage(src)
      .then((url) => {
        if (!cancelled) setResolved(url);
      })
      .catch(() => {
        if (!cancelled) setResolved("");
      });
    return () => {
      cancelled = true;
    };
  }, [src]);

  if (!resolved) return null;
  return <img src={resolved} alt={alt} className={className} {...rest} />;
}
