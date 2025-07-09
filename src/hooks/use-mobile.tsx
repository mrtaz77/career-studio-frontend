import * as React from 'react';

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    // Check if matchMedia is available (for older browser compatibility)
    if (typeof window.matchMedia !== 'function') {
      // Fallback to just using window.innerWidth
      const updateMobileState = () => {
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
      };

      updateMobileState();
      window.addEventListener('resize', updateMobileState);

      return () => window.removeEventListener('resize', updateMobileState);
    }

    // Use matchMedia if available (modern browsers)
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener('change', onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return !!isMobile;
}
