/**
 * UI String Constants
 * Centralized strings for production consistency
 */
export const UI_STRINGS = {
  // Page titles and headings
  TITLE: 'Select Your Vehicle',
  QUICK_SELECT_HEADING: 'Quick Select',
  
  // Form labels
  FORM_LABELS: {
    MAKE: 'Make:',
    MODEL: 'Model:',
    BADGE: 'Badge:',
    LOGBOOK: 'Upload Logbook (Plain Text .txt):',
  },
  
  // Form placeholders
  FORM_PLACEHOLDERS: {
    SELECT_MAKE: '-- Select Make --',
    SELECT_MODEL: '-- Select Model --',
    SELECT_BADGE: '-- Select Badge --',
  },
  
  // Button labels
  BUTTONS: {
    SUBMIT: 'Submit',
    SUBMITTING: 'Submitting…',
    SUBMIT_ANOTHER: 'Submit Another Vehicle',
  },
  
  // Loading states
  LOADING: 'Loading vehicle data…',
  
  // Error messages
  ERRORS: {
    UNEXPECTED: 'An unexpected error occurred.',
    LOAD_FAILED: 'Unable to load vehicle data. Please refresh to try again.',
    MAKE_REQUIRED: 'Make is required',
    MODEL_REQUIRED: 'Model is required',
    BADGE_REQUIRED: 'Badge is required',
  },
  
  // Success messages
  SUCCESS: {
    SUBMISSION_TITLE: 'Submission Successful',
    MAKE: 'Make:',
    MODEL: 'Model:',
    BADGE: 'Badge:',
    LOGBOOK_CONTENTS: 'Logbook Contents:',
  },
  
  // File upload
  FILE_TYPES: {
    ACCEPT: '.txt, text/plain',
    DESCRIPTION: 'Plain Text .txt',
  },
};

/**
 * API Configuration
 * Gets values from environment variables with fallbacks
 */
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  ENDPOINTS: {
    UPLOAD: '/upload',
    VEHICLES: '/vehicles',
  },
  TIMEOUT_MS: 30000,
};

/**
 * Application Configuration
 */
export const APP_CONFIG = {
  ENVIRONMENT: import.meta.env.VITE_ENVIRONMENT || 'development',
  DEBUG: import.meta.env.VITE_ENABLE_DEBUG_LOGS === 'true',
  IS_PRODUCTION: import.meta.env.MODE === 'production',
};

/**
 * Scroll behavior configuration
 */
export const SCROLL_CONFIG = {
  BEHAVIOR: 'smooth' as const,
  BLOCK: 'start' as const,
  TOP: 0,
};
