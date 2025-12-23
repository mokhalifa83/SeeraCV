import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

const STORAGE_KEY = 'cvData';
const USER_ID_KEY = 'cvDataUserId';

// Default empty CV data structure
export const getEmptyCvData = () => ({
  personalInfo: {},
  summary: "",
  experiences: [],
  education: [],
  skills: [],
  certificates: [],
  languages: [],
  projects: [],
  hobbies: [],
});

/**
 * Save CV data to localStorage with user association
 */
export const saveCvDataToStorage = (cvData: any): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cvData));
    console.log('CV data saved to localStorage');
  } catch (error) {
    console.error('Error saving CV data to localStorage:', error);
  }
};

/**
 * Load CV data from localStorage
 */
export const loadCvDataFromStorage = (): any | null => {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (!savedData) return null;
    
    const parsedData = JSON.parse(savedData);
    
    // Check if data has any actual content
    const hasData = Object.values(parsedData).some((value: any) => {
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === 'object' && value !== null) return Object.keys(value).length > 0;
      return value && value !== '';
    });
    
    return hasData ? parsedData : null;
  } catch (error) {
    console.error('Error loading CV data from localStorage:', error);
    return null;
  }
};

/**
 * Check if current user owns the stored data
 */
export const checkUserOwnsStoredData = async (): Promise<boolean> => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return false;
  
  const storedUserId = localStorage.getItem(USER_ID_KEY);
  return storedUserId === session.user.id;
};

/**
 * Associate current user with stored data
 */
export const associateUserWithStoredData = (userId: string): void => {
  localStorage.setItem(USER_ID_KEY, userId);
};

/**
 * Clear stored CV data
 */
export const clearStoredCvData = (): void => {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(USER_ID_KEY);
};

/**
 * Custom hook for CV data persistence
 */
export const useCvDataPersistence = () => {
  const save = useCallback((data: any) => {
    saveCvDataToStorage(data);
  }, []);

  const load = useCallback(() => {
    return loadCvDataFromStorage();
  }, []);

  const clear = useCallback(() => {
    clearStoredCvData();
  }, []);

  return { save, load, clear };
};
