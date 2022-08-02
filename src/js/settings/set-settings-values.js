import { refs } from '../refs/refs';
import { collectDataFromLoacalStorage } from '../local-storage_opetations/local-storage-operations';
import { galleryGenerator } from '../gallery-generator/gallery-generator-instance';

const setSearchOrientation = searchOrientation => {
  if (!searchOrientation) return;

  const orientationRadios = refs.orientationSwitch.querySelectorAll('input.orientation__radio');

  orientationRadios.forEach(radio => {
    if (radio.hasAttribute('checked')) {
      radio.removeAttribute('checked');
      return;
    }
  });

  orientationRadios.forEach(radio => {
    if (radio.value === searchOrientation) {
      radio.setAttribute('checked', true);
    }
  });

  galleryGenerator.orientation = searchOrientation;
};

const setSearchPerPage = searchPerPage => {
  if (!searchPerPage) return;

  refs.perPageField.value = searchPerPage;
  galleryGenerator.perPage = Number(searchPerPage);
};

const setSafeSearch = isSafeSearch => {
  if (typeof isSafeSearch !== 'boolean') return;

  if (isSafeSearch !== refs.safeSearchCheckbox.checked) refs.safeSearchCheckbox.toggleAttribute('checked');
  document.querySelector('span.safe-search__type').textContent = isSafeSearch ? 'Safe' : 'Adult';

  galleryGenerator.safesearch = isSafeSearch;
};

export const setSettingsValues = () => {
  const dataFromLocalStorage = collectDataFromLoacalStorage();

  setSearchOrientation(dataFromLocalStorage.searchOrientation ?? galleryGenerator.orientation);
  setSearchPerPage(dataFromLocalStorage.searchPerPage ?? galleryGenerator.perPage);
  setSafeSearch(dataFromLocalStorage.safeSearch ?? galleryGenerator.safesearch);
};
