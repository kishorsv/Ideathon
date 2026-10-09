// Official Google Maps JavaScript API Loader & Diagnostic Service

declare global {
  interface Window {
    google?: any;
    __googleMapsCallback?: () => void;
    gm_authFailure?: () => void;
  }
}

let loadPromise: Promise<any> | null = null;
let activeAuthErrorHandler: ((err: string) => void) | null = null;

export const getGoogleMapsApiKey = (): string => {
  const envKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY;
  if (envKey && typeof envKey === 'string' && envKey.trim().length > 0) {
    return envKey.trim();
  }
  return '';
};

/**
 * Diagnostic error message translator for Google Maps errors
 */
export const getGoogleMapsErrorMessage = (errorCode: string): { title: string; description: string; action: string } => {
  switch (errorCode) {
    case 'InvalidKeyMapError':
      return {
        title: 'Invalid Google Maps API Key',
        description: 'The API key provided is either invalid, mistyped, or does not exist in Google Cloud Console.',
        action: 'Verify and copy the correct API Key from Google Cloud Console > Credentials.',
      };
    case 'RefererNotAllowedMapError':
      return {
        title: 'HTTP Referrer Restriction Error',
        description: 'The current website domain or URL is not authorized in the API key restrictions list.',
        action: 'Add your domain (e.g. http://localhost:*/* or https://mysuru-em.ai.studio/*) to Google Cloud Console > Credentials > Key Restrictions > Websites.',
      };
    case 'BillingNotEnabledMapError':
      return {
        title: 'Google Cloud Billing Not Enabled',
        description: 'Google Maps JavaScript API requires an active billing account linked to the project.',
        action: 'Enable billing in Google Cloud Console for your project (Google provides $200 free monthly credit).',
      };
    case 'ApiNotActivatedMapError':
      return {
        title: 'Maps JavaScript API Not Activated',
        description: 'The Maps JavaScript API has not been enabled in your Google Cloud project.',
        action: 'Go to Google Cloud Console > APIs & Services > Library > Enable "Maps JavaScript API" and "Places API".',
      };
    case 'OverQuotaMapError':
      return {
        title: 'API Quota Exceeded',
        description: 'The daily or per-minute request quota for Maps JavaScript API has been exceeded.',
        action: 'Check your Google Cloud Console quota settings and usage limits.',
      };
    case 'MISSING_API_KEY':
      return {
        title: 'Google Maps API Key Not Configured',
        description: 'The deployment environment variable VITE_GOOGLE_MAPS_API_KEY is currently empty.',
        action: 'Set VITE_GOOGLE_MAPS_API_KEY=your_key in your .env file or deployment platform.',
      };
    default:
      return {
        title: 'Google Maps Initialization Error',
        description: errorCode || 'Failed to initialize Google Maps JavaScript API.',
        action: 'Check browser developer console for detailed network logs and Google Cloud API credentials.',
      };
  }
};

export const registerGoogleMapsAuthErrorHandler = (handler: (err: string) => void) => {
  activeAuthErrorHandler = handler;
  window.gm_authFailure = () => {
    const errorMsg = 'InvalidKeyMapError';
    if (activeAuthErrorHandler) {
      activeAuthErrorHandler(errorMsg);
    }
  };
};

export const loadGoogleMaps = async (apiKeyOverride?: string): Promise<any> => {
  const apiKey = (apiKeyOverride && apiKeyOverride.trim().length > 0) ? apiKeyOverride.trim() : getGoogleMapsApiKey();

  if (!apiKey) {
    throw new Error('MISSING_API_KEY');
  }

  if (window.google && window.google.maps) {
    return window.google;
  }

  // Clear previous script if any
  const existingScript = document.getElementById('google-maps-script');
  if (existingScript) {
    existingScript.remove();
  }

  loadPromise = new Promise((resolve, reject) => {
    let timeoutId: any = null;

    window.__googleMapsCallback = () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (window.google && window.google.maps) {
        resolve(window.google);
      } else {
        reject(new Error('Google Maps object not found after script execution.'));
      }
    };

    window.gm_authFailure = () => {
      if (timeoutId) clearTimeout(timeoutId);
      const err = 'InvalidKeyMapError';
      if (activeAuthErrorHandler) {
        activeAuthErrorHandler(err);
      }
      reject(new Error(err));
    };

    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.type = 'text/javascript';
    script.async = true;
    script.defer = true;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&libraries=places,geometry&callback=__googleMapsCallback`;

    script.onerror = () => {
      if (timeoutId) clearTimeout(timeoutId);
      reject(new Error('Network error loading Google Maps JavaScript API script.'));
    };

    // 10 second timeout safety
    timeoutId = setTimeout(() => {
      reject(new Error('Google Maps script loading timed out. Check internet connection and key restrictions.'));
    }, 10000);

    document.head.appendChild(script);
  });

  return loadPromise;
};
