const LOCAL_STORAGE_KEY = 'galleryGeneratorSettings';

export const collectDataFromLoacalStorage = () => {
  const localStorageData = localStorage.getItem(LOCAL_STORAGE_KEY);
  let parsedData = {};

  if (!localStorageData) return parsedData;

  try {
    parsedData = JSON.parse(localStorageData);
  } catch {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }

  return parsedData;
};

export const recordDataToLocalStorage = (key, value) => {
  const currentData = collectDataFromLoacalStorage();

  currentData[key] = value;

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(currentData));
};
