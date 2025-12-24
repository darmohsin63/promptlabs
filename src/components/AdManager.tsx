import { useEffect, useRef } from "react";
import { useAdSettings } from "@/hooks/useAdSettings";

const ADMAVEN_SCRIPTS = [
  "//dcbbwymp1bhlf.cloudfront.net/?wbbcd=1232641",
  "//dcbbwymp1bhlf.cloudfront.net/?wbbcd=1232855",
  "//dcbbwymp1bhlf.cloudfront.net/?wbbcd=1232858",
];

export function AdManager() {
  const { adsEnabled, loading } = useAdSettings();
  const scriptsLoadedRef = useRef(false);

  useEffect(() => {
    if (loading) return;

    if (adsEnabled && !scriptsLoadedRef.current) {
      // Load AdMaven scripts dynamically
      ADMAVEN_SCRIPTS.forEach((src) => {
        const script = document.createElement("script");
        script.src = src;
        script.setAttribute("data-cfasync", "false");
        script.className = "admaven-script";
        document.head.appendChild(script);
      });
      scriptsLoadedRef.current = true;
      document.body.classList.remove("ads-disabled");
    } else if (!adsEnabled) {
      // Hide ads by adding class
      document.body.classList.add("ads-disabled");
      
      // Remove any dynamically created ad elements
      const adElements = document.querySelectorAll(
        'div[style*="z-index: 2147483647"], div[style*="position: fixed"][style*="bottom"], iframe[src*="cloudfront"]'
      );
      adElements.forEach((el) => el.remove());
    }
  }, [adsEnabled, loading]);

  return null;
}
