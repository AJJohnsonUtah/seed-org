import React from "react";
// Ty for hook: https://www.robinwieruch.de/react-uselocalstorage-hook/
export const useLocalStorage = (storageKey, fallbackState) => {
  const [value, setValue] = React.useState(JSON.parse(localStorage.getItem(storageKey)) ?? fallbackState);

  React.useEffect(() => {
    if (value === null || value === undefined) {
      localStorage.removeItem(storageKey);
    } else {
      localStorage.setItem(storageKey, JSON.stringify(value));
    }
  }, [value, storageKey]);

  return [value, setValue];
};
