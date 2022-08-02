import { refs } from '../refs/refs';
import { galleryGenerator } from '../gallery-generator/gallery-generator-instance';
import { startGalleryScrollObserver } from '../scroll-to-top/scroll-to-top';
import { onSearchFormSettingsButtonClick } from '../settings/settings-actions';

export const onFormSubmit = async event => {
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
