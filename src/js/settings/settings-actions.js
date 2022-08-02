import { refs } from '../refs/refs';
import { recordDataToLocalStorage } from '../local-storage_opetations/local-storage-operations';
import { galleryGenerator } from '../gallery-generator/gallery-generator-instance';

const onNotSearchFormClick = ({ target }) => {
  const itsSearchForm = target == refs.searchForm || refs.searchForm.contains(target);

  if (!itsSearchForm) onSearchFormSettingsButtonClick();
};

export const onSearchFormSettingsButtonClick = () => {
  const isExpanded = refs.searchFormSettingsButton.getAttribute('aria-expanded') === 'true' ? true : false;

  refs.searchFormSettingsButton.setAttribute('aria-expanded', !isExpanded);
  refs.searchForm.classList.toggle('settings-is-open');

  if (refs.searchForm.classList.contains('settings-is-open')) {
    document.body.addEventListener('click', onNotSearchFormClick);
  } else {
    document.body.removeEventListener('click', onNotSearchFormClick);
  }
};

export const onOrientationSwitchClick = () => {
  const orientationRadios = Array.from(refs.orientationSwitch.querySelectorAll('input.orientation__radio'));

  orientationRadios.forEach(radio => {
    if (radio.hasAttribute('checked')) {
      radio.removeAttribute('checked');
      orientationRadios.splice(orientationRadios.indexOf(radio), 1);
      return;
    }
  });

  orientationRadios[0].setAttribute('checked', true);

  const currentOrientationValue = refs.searchForm.orientation.value;

  galleryGenerator.orientation = currentOrientationValue;
  galleryGenerator.query = '';

  recordDataToLocalStorage('searchOrientation', currentOrientationValue);
};

export const onPerPageFieldInput = ({ target: input }) => {
  const perPageFieldValue = Number(input.value);

  if (perPageFieldValue < 3) input.value = 3;
  if (perPageFieldValue > 200) input.value = 200;

  const currentPerPage = Number(input.value);

  galleryGenerator.perPage = currentPerPage;

  recordDataToLocalStorage('searchPerPage', currentPerPage);
};

export const onSafeSearchCheckboxChange = ({ currentTarget: { checked } }) => {
  const searchTypeSpanRef = document.querySelector('span.safe-search__type');

  searchTypeSpanRef.classList.add('on-change');
  setTimeout(() => {
    searchTypeSpanRef.textContent = checked ? 'Safe' : 'Adult';
    searchTypeSpanRef.classList.remove('on-change');
  }, 110);

  galleryGenerator.safesearch = checked;
  galleryGenerator.query = '';

  recordDataToLocalStorage('safeSearch', checked);
};
