const BASE_URL = 'https://restcountries.com/v3.1/name';
const REQUIRED_FIELDS = ['name', 'capital', 'population', 'flags', 'languages'];

export const fetchCountries = async name => {
  const response = await fetch(`${BASE_URL}/${name}?fields=${REQUIRED_FIELDS.join()}`);

  if (!response.ok) throw new Error(response.status);

  return await response.json();
};
