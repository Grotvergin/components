import React from 'react'

function dispatchStorageEvent(key: string, newValue: any) {
    window.dispatchEvent(new StorageEvent("storage", { key, newValue }));
  }

const useLocalStorageSubscribe = (callback: any) => {
    window.addEventListener("storage", callback);
    return () => window.removeEventListener("storage", callback);
  };

  const setLocalStorageItem = (key: string, value: any) => {
    const stringifiedValue = JSON.stringify(value);
    window.localStorage.setItem(key, stringifiedValue);
    dispatchStorageEvent(key, stringifiedValue);
  };
  
  const removeLocalStorageItem = (key: string) => {
    window.localStorage.removeItem(key);
    dispatchStorageEvent(key, null);
  };
  
  const getLocalStorageItem = (key: string) => {
    return window.localStorage.getItem(key);
  };
  
  const getLocalStorageServerSnapshot = () => {
    throw Error("useLocalStorage is a client-only hook");
  };

export function useLocalStorage(key: string, initialValue: string) {
    const getSnapshot = () => getLocalStorageItem(key);
  
    const store = React.useSyncExternalStore(
      useLocalStorageSubscribe,
      getSnapshot,
      getLocalStorageServerSnapshot
    );
  
    const setState = React.useCallback(
      (v: any) => {
        try {
          const nextState = typeof v === "function" ? v(JSON.parse(store as any)) : v;
  
          if (nextState === undefined || nextState === null) {
            removeLocalStorageItem(key);
          } else {
            setLocalStorageItem(key, nextState);
          }
        } catch (e) {
          console.warn(e);
        }
      },
      [key, store]
    );
  
    React.useEffect(() => {
      if (
        getLocalStorageItem(key) === null &&
        typeof initialValue !== "undefined"
      ) {
        setLocalStorageItem(key, initialValue);
      }
    }, [key, initialValue]);
  
    return [store ? JSON.parse(store) : initialValue, setState];
  }