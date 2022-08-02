import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

export const gallery = new SimpleLightbox('div.gallery__content a', {
  maxZoom: 4,
  overlayOpacity: 0.85,
  captionsData: 'alt',
  alertError: false,
});
