import { refs } from '../refs/refs';

export const onScrollToTopButtonClick = () => scrollTo(0, 0);

let galleryScrollObserver = null;

export const startGalleryScrollObserver = () => {
  galleryScrollObserver = new IntersectionObserver(onGalleryScroll, { rootMargin: '-80px 0px 0px 0px', threshold: 1 });
  const galleryFirstElement = refs.galleryContent.firstElementChild;

  if (galleryFirstElement) {
    galleryScrollObserver.observe(galleryFirstElement);
  } else {
    destroyCurrentGalleryScrollObserver();
  }
};

const destroyCurrentGalleryScrollObserver = () => {
  if (galleryScrollObserver) {
    galleryScrollObserver.disconnect();
    galleryScrollObserver = null;
  }

  !refs.scrollToTopButton.classList.contains('is-hidden') && refs.scrollToTopButton.classList.add('is-hidden');
};

const onGalleryScroll = entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      !refs.scrollToTopButton.classList.contains('is-hidden') && refs.scrollToTopButton.classList.add('is-hidden');
    } else {
      refs.scrollToTopButton.classList.contains('is-hidden') && refs.scrollToTopButton.classList.remove('is-hidden');
    }
  });
};
