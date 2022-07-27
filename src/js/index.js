import '../sass/index.scss';
import { Notify } from 'notiflix';
import { GalleryGenerator } from './gallery-generator/gallery-generator';

const gallery = new GalleryGenerator();

gallery.init({
  onSuccess: Notify.success,
  onError: Notify.failure,

  // ------ Default values ------
  // imageType: 'photo',
  // orientation: 'horizontal',
  // safesearch: true,
  // perPage: 40,
  // onSuccess: null,
  // onError: null,
});

const refs = {
  serchForm: document.querySelector('form#search-form'),
};

const onFormSubmit = event => {
  event.preventDefault();

  gallery.start();
};

refs.serchForm.addEventListener('submit', onFormSubmit);
