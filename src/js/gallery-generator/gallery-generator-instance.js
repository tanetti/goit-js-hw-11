import { Notify } from 'notiflix';
import { gallery } from '../simple-lighbox-instance/simple-lightbox-instance';
import GalleryGenerator from './gallery-generator-class';

export const galleryGenerator = new GalleryGenerator();
galleryGenerator.init({
  onSuccess: Notify.success,
  onFailure: Notify.failure,
  simpleLightboxInstance: gallery,
  aosAnimation: 'fade-up',

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
