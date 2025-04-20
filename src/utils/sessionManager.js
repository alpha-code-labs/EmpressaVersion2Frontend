// src/utils/sessionManager.js

import { v4 as uuidv4 } from 'uuid';

// Constants
const SESSION_ID_KEY = 'empressa_session_id';
const SESSION_EXPIRY_KEY = 'empressa_session_expiry';
const SESSION_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

// Create a new session
export const createSession = () => {
  const sessionId = uuidv4();
  const expiryTime = Date.now() + SESSION_DURATION;
  
  // Store in localStorage
  try {
    localStorage.setItem(SESSION_ID_KEY, sessionId);
    localStorage.setItem(SESSION_EXPIRY_KEY, expiryTime.toString());
    
    // Backup to sessionStorage in case localStorage is cleared
    sessionStorage.setItem(SESSION_ID_KEY, sessionId);
    sessionStorage.setItem(SESSION_EXPIRY_KEY, expiryTime.toString());
    
    // Also set as a cookie for additional fallback
    setCookie(SESSION_ID_KEY, sessionId, 30); // 30 days
  } catch (error) {
    // Silent fail in production
  }
  
  return sessionId;
};

// Get the current session ID, create one if it doesn't exist or is expired
export const getSessionId = () => {
  let sessionId;
  let expiryTime;
  
  try {
    // Try to get from localStorage first
    sessionId = localStorage.getItem(SESSION_ID_KEY);
    expiryTime = localStorage.getItem(SESSION_EXPIRY_KEY);
    
    // If not in localStorage, try sessionStorage
    if (!sessionId) {
      sessionId = sessionStorage.getItem(SESSION_ID_KEY);
      expiryTime = sessionStorage.getItem(SESSION_EXPIRY_KEY);
    }
    
    // If not in storage, try cookies
    if (!sessionId) {
      sessionId = getCookie(SESSION_ID_KEY);
    }
    
    // Check if session is expired
    if (sessionId && expiryTime && Number(expiryTime) < Date.now()) {
      // Session expired, clear it
      clearSession();
      sessionId = null;
    }
  } catch (error) {
    // Silent fail in production
  }
  
  // If no valid session exists, create a new one
  if (!sessionId) {
    sessionId = createSession();
  } else {
    // Refresh expiry time
    refreshSession();
  }
  
  return sessionId;
};

// Refresh the session expiry time
export const refreshSession = () => {
  const expiryTime = Date.now() + SESSION_DURATION;
  
  try {
    localStorage.setItem(SESSION_EXPIRY_KEY, expiryTime.toString());
    sessionStorage.setItem(SESSION_EXPIRY_KEY, expiryTime.toString());
    
    // Also refresh the cookie
    const sessionId = localStorage.getItem(SESSION_ID_KEY) || sessionStorage.getItem(SESSION_ID_KEY);
    if (sessionId) {
      setCookie(SESSION_ID_KEY, sessionId, 30);
    }
  } catch (error) {
    // Silent fail in production
  }
};

// Clear the current session
export const clearSession = () => {
  try {
    localStorage.removeItem(SESSION_ID_KEY);
    localStorage.removeItem(SESSION_EXPIRY_KEY);
    sessionStorage.removeItem(SESSION_ID_KEY);
    sessionStorage.removeItem(SESSION_EXPIRY_KEY);
    deleteCookie(SESSION_ID_KEY);
  } catch (error) {
    // Silent fail in production
  }
};

// Store data associated with the session
export const setSessionData = (key, data) => {
  const sessionId = getSessionId();
  const dataKey = `empressa_${sessionId}_${key}`;
  
  try {
    localStorage.setItem(dataKey, JSON.stringify(data));
  } catch (error) {
    // Silent fail in production
  }
};

// Get data associated with the session
export const getSessionData = (key) => {
  const sessionId = getSessionId();
  const dataKey = `empressa_${sessionId}_${key}`;
  
  try {
    const data = localStorage.getItem(dataKey);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    return null;
  }
};

// Helper function to set a cookie
const setCookie = (name, value, days) => {
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
};

// Helper function to get a cookie value
const getCookie = (name) => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

// Helper function to delete a cookie
const deleteCookie = (name) => {
  document.cookie = `${name}=; Max-Age=-99999999; path=/`;
};

// Detect if storage is available (for Instagram in-app browser)
export const isStorageAvailable = (type) => {
  try {
    const storage = window[type];
    const x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return false;
  }
};

// Generate a URL with session ID parameter (fallback for when storage isn't available)
export const getSessionUrl = (url, sessionId = null) => {
  if (!sessionId) {
    sessionId = getSessionId();
  }
  
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}_sid=${sessionId}`;
};

// Extract session ID from URL if present
export const getSessionIdFromUrl = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('_sid');
};