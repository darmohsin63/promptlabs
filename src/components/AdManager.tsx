import { useEffect } from "react";
import { useAdSettings } from "@/hooks/useAdSettings";

export function AdManager() {
  const { adsEnabled, loading } = useAdSettings();

  useEffect(() => {
    if (loading) return;

    // Find and control AdMaven script elements
    const adScripts = document.querySelectorAll('script[src*="dcbbwymp1bhlf.cloudfront.net"]');
    
    // Control visibility of ad containers
    const adContainers = document.querySelectorAll('[id*="ad"], [class*="ad-container"]');
    
    if (adsEnabled) {
      // Show ads
      document.body.classList.remove('ads-disabled');
      adContainers.forEach(container => {
        (container as HTMLElement).style.display = '';
      });
    } else {
      // Hide ads
      document.body.classList.add('ads-disabled');
      adContainers.forEach(container => {
        (container as HTMLElement).style.display = 'none';
      });
    }
  }, [adsEnabled, loading]);

  return null;
}
