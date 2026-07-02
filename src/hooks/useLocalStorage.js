import { useState, useEffect } from 'react';

// ----------------------------------------------------------------------

const safeParse = (raw, fallback) => {
  if (raw === null || raw === undefined) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
};

export default function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    const storedValue = typeof window !== 'undefined' ? localStorage.getItem(key) : null;
    return safeParse(storedValue, defaultValue);
  });

  useEffect(() => {
    const listener = (e) => {
      if (typeof window !== 'undefined' && e.storageArea === localStorage && e.key === key) {
        setValue(safeParse(e.newValue, defaultValue));
      }
    };
    window.addEventListener('storage', listener);

    return () => {
      window.removeEventListener('storage', listener);
    };
  }, [key, defaultValue]);

  const setValueInLocalStorage = (newValue) => {
    setValue((currentValue) => {
      const result = typeof newValue === 'function' ? newValue(currentValue) : newValue;
      if (typeof window !== 'undefined') localStorage.setItem(key, JSON.stringify(result));
      return result;
    });
  };

  return [value, setValueInLocalStorage];
}
