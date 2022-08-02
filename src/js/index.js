import '../sass/index.scss';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Aos from 'aos';
import 'aos/dist/aos.css';
import { collectDataFromLoacalStorage, recordDataToLocalStorage } from './local-storage_opetations/local-storage-operations';
import { startGalleryScrollObserver } from './scroll-to-top/scroll-to-top';
import GalleryGenerator from './gallery-generator/gallery-generator';

Notify.init({
  position: 'center-bottom',
  distance: '20px',
  borderRadius: '14px',
  timeout: 5000,
  clickToClose: true,
  cssAnimationStyle: 'from-bottom',
});

const gallery = new SimpleLightbox('div.gallery__content a', {
  maxZoom: 2,
  overlayOpacity: 0.85,
  captionsData: 'alt',
  disableRightClick: true,
  alertError: false,
});

Aos.init();

const galleryGenerator = new GalleryGenerator();
galleryGenerator.init({
  onSuccess: Notify.success,
  onFailure: Notify.failure,
  simpleLightboxInstance: gallery,
  aosAnimation: 'zoom-in-up',

  // ------ Options and default values ------

  // Pixabay query settings:
  //    imageType: 'photo', (STRING)
  //    orientation: 'horizontal', (STRING) (!!! User localStorage has higher priority !!!)
  //    safesearch: true, (BOOLEAN) (!!! User localStorage has higher priority !!!)
  //    perPage: 40, (NUMBER) (!!! User localStorage has higher priority !!!)

  // Callback for notification (Use Alet() default):
  //    onSuccess: null, (CALLBACK)
  //    onFailure: null, (CALLBACK)

  // Apply initialized SimpleLightbox instance:
  //    simpleLightboxInstance: null, (INSTANCE)

  // Enable or disable autoscroll to new result after search:
  //    scrollToNewResults: true, (BOOLEAN)

  // Enable or disable infinite scroll:
  //    infiniteScroll: true, (BOOLEAN)

  // Apply AOS animation type ('fade-up', 'flip-left', 'zoom-in' etc...):
  //    aosAnimation: '', (STRING)
});

const refs = {
  searchForm: document.querySelector('form#search-form'),
  searchFormSettingsButton: document.querySelector('button#settings-button'),
  orientationSwitch: document.querySelector('fieldset#orientation'),
  perPageField: document.querySelector('input#perPage'),
  safeSearchCheckbox: document.querySelector('input#safeSearch'),
  scrollToTopButton: document.querySelector('button#scroll-to-top'),
};

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

const setSettingsValues = () => {
  const dataFromLocalStorage = collectDataFromLoacalStorage();

  setSearchOrientation(dataFromLocalStorage.searchOrientation ?? galleryGenerator.orientation);
  setSearchPerPage(dataFromLocalStorage.searchPerPage ?? galleryGenerator.perPage);
  setSafeSearch(dataFromLocalStorage.safeSearch ?? galleryGenerator.safesearch);
};

setSettingsValues();

const onFormSubmit = async event => {
  event.preventDefault();

  const searchField = refs.searchForm.querySelector('input.search-form__input');

  if (refs.searchForm.classList.contains('settings-is-open')) {
    onSearchFormSettingsButtonClick();

    setTimeout(() => searchField.focus(), 250);
    return;
  }

  if (!searchField.value) {
    searchField.focus();

    searchField.classList.toggle('search-form__input--hint');

    let count = 0;
    setInterval(() => {
      if (count > 4) return;
      searchField.classList.toggle('search-form__input--hint');
      count += 1;
    }, 350);

    return;
  }

  await galleryGenerator.start();

  startGalleryScrollObserver();
};

const onSearchFormSettingsButtonClick = () => {
  const isExpanded = refs.searchFormSettingsButton.getAttribute('aria-expanded') === 'true' ? true : false;

  refs.searchFormSettingsButton.setAttribute('aria-expanded', !isExpanded);
  refs.searchForm.classList.toggle('settings-is-open');
};

const onOrientationSwitchClick = () => {
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

const onPerPageFieldInput = ({ target: input }) => {
  const perPageFieldValue = Number(input.value);

  if (perPageFieldValue < 3) input.value = 3;
  if (perPageFieldValue > 200) input.value = 200;

  const currentPerPage = Number(input.value);

  galleryGenerator.perPage = currentPerPage;

  recordDataToLocalStorage('searchPerPage', currentPerPage);
};

const onSafeSearchCheckboxChange = ({ currentTarget: { checked } }) => {
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

const onScrollToTopButtonClick = () => window.scrollTo(0, 0);

refs.searchForm.addEventListener('submit', onFormSubmit);
refs.searchFormSettingsButton.addEventListener('click', onSearchFormSettingsButtonClick);
refs.orientationSwitch.addEventListener('click', onOrientationSwitchClick);
refs.perPageField.addEventListener('focus', ({ currentTarget }) => currentTarget.select());
refs.perPageField.addEventListener('input', debounce(onPerPageFieldInput, 1000));
refs.safeSearchCheckbox.addEventListener('change', onSafeSearchCheckboxChange);
refs.scrollToTopButton.addEventListener('click', onScrollToTopButtonClick);
