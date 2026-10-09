// Official Google Maps JavaScript API Loader Service

declare global {
  interface Window {
    google?: any;
    __googleMapsCallback?: () => void;
  }
}

let loadPromise: Promise<any> | null = null;

export const getGoogleMapsApiKey = (): string => {
  const envKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY;
  if (envKey && typeof envKey === 'string' && envKey.trim().length > 0) {
    return envKey.trim();
  }
  // Check if saved in session/localStorage for live testing
  try {
    const saved = localStorage.getItem('mysuru_em_google_maps_key');
    if (saved && saved.trim().length > 0) {
      return saved.trim();
    }
  } catch {
    // Ignore localStorage errors
  }
  return '';
};

export const setCustomGoogleMapsApiKey = (key: string) => {
  try {
    if (key.trim()) {
      localStorage.setItem('mysuru_em_google_maps_key', key.trim());
    } else {
      localStorage.removeItem('mysuru_em_google_maps_key');
    }
    loadPromise = null;
  } catch {
    // Ignore localStorage errors
  }
};

export const loadGoogleMaps = async (apiKeyOverride?: string): Promise<any> => {
  const apiKey = apiKeyOverride || getGoogleMapsApiKey();

  if (!apiKey) {
    throw new Error('MISSING_API_KEY');
  }

  if (window.google && window.google.maps) {
    return window.google;
  }

  if (loadPromise && (!apiKeyOverride || apiKeyOverride === getGoogleMapsApiKey())) {
    return loadPromise;
  }

  loadPromise = new Promise((resolve, reject) => {
    // Check if script already on page
    const existingScript = document.getElementById('google-maps-script');
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.type = 'text/javascript';
    script.async = true;
    script.defer = true;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry&callback=__googleMapsCallback`;

    window.__googleMapsCallback = () => {
      if (window.google && window.google.maps) {
        resolve(window.google);
      } else {
        reject(new Error('Google Maps object missing after script execution'));
      }
    };

    script.onerror = () => {
      reject(new Error('Failed to load Google Maps script. Check network or API key restrictions.'));
    };

    document.head.appendChild(script);
  });

  return loadPromise;
};
