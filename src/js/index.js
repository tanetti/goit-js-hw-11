import '../sass/index.scss';
import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Aos from 'aos';
import 'aos/dist/aos.css';
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
  //    orientation: 'horizontal', (STRING)
  //    safesearch: true, (BOOLEAN)
  //    perPage: 40, (NUMBER)

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
  serchForm: document.querySelector('form#search-form'),
};

const onFormSubmit = event => {
  event.preventDefault();

  galleryGenerator.start();
};

refs.serchForm.addEventListener('submit', onFormSubmit);
