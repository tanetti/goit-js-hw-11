import '../sass/index.scss';
import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import GalleryGenerator from './gallery-generator/gallery-generator';

Notify.init({
  position: 'right-bottom',
  distance: '20px',
  borderRadius: '14px',
  timeout: 5000,
  clickToClose: true,
  cssAnimationStyle: 'from-right',
});

const gallery = new SimpleLightbox('div.gallery__content a', {
  maxZoom: 2,
  overlayOpacity: 0.85,
  captionsData: 'alt',
  disableRightClick: true,
  alertError: false,
});

const galleryGenerator = new GalleryGenerator();
galleryGenerator.init({
  onSuccess: Notify.success,
  onError: Notify.failure,
  simpleLightboxInstance: gallery,
  perPage: 5,

  // ------ Default values ------
  // imageType: 'photo',
  // orientation: 'horizontal',
  // safesearch: true,
  // perPage: 40,
  // onSuccess: null,
  // onError: null,
  // simpleLightboxInstance: null,
  // scrollToNewResult: true,
  // infiniteScroll = true,
});

const refs = {
  serchForm: document.querySelector('form#search-form'),
};

const onFormSubmit = event => {
  event.preventDefault();

  galleryGenerator.start();
};

refs.serchForm.addEventListener('submit', onFormSubmit);
