import axios from 'axios';

export default class GalleryGenerator {
  #baseURL;
  #key;
  #refs;
  #onSuccess;
  #onFailure;
  #simpleLightboxInstance;
  #scrollToNewResults;
  #infiniteScroll;
  #currentTotalHits;
  #infiniteScrollObserver;
  #aosAnimation;

  constructor() {
    this.#baseURL = 'https://pixabay.com/api/';
    this.#key = '28880240-210227b5aa1544e2eb6639b3c';
    this.#refs = {
      inputField: document.querySelector('[data-gallery="input"]'),
      galleryContainer: document.querySelector('[data-gallery="container"]'),
      galleryLoader: document.querySelector('[data-gallery="loader"]'),
      galleryPlaceholder: document.querySelector('[data-gallery="placeholder"]'),
    };

    this.query = '';
    this.currentPage = 1;

    this.imageType = 'photo';
    this.orientation = 'horizontal';
    this.safesearch = true;
    this.perPage = 40;

    this.#onSuccess = null;
    this.#onFailure = null;
    this.#simpleLightboxInstance = null;
    this.#scrollToNewResults = true;
    this.#infiniteScroll = true;
    this.#aosAnimation = '';

    this.#currentTotalHits = 0;
    this.#infiniteScrollObserver = null;
  }

  init(options) {
    if (!options || typeof options !== 'object') return;

    const {
      imageType = 'photo',
      orientation = 'horizontal',
      safesearch = true,
      perPage = 40,
      onSuccess = null,
      onFailure = null,
      simpleLightboxInstance = null,
      scrollToNewResults = true,
      infiniteScroll = true,
      aosAnimation = '',
    } = options;

    this.imageType = imageType;
    this.orientation = orientation;
    this.safesearch = safesearch;
    this.perPage = perPage;
    this.#onSuccess = onSuccess;
    this.#onFailure = onFailure;
    this.#simpleLightboxInstance = simpleLightboxInstance;
    this.#scrollToNewResults = scrollToNewResults;
    this.#infiniteScroll = infiniteScroll;
    this.#aosAnimation = aosAnimation;
  }

  async start(isTrigereredByScroll = false) {
    if (!this.#refs.inputField) return this.#failureNotification('Input field not specified!');
    if (!this.#refs.galleryContainer) return this.#failureNotification('Gallery container not specified!');

    const sanitizedQuery = this.#refs.inputField.value.trim();

    if (!sanitizedQuery) return;

    const totalHitsRendered = this.currentPage * this.perPage;

    if (sanitizedQuery === this.query) {
      if (this.#currentTotalHits === 0) return this.#failureNotification('Sorry, there are no images matching your search query. Please try again.');

      if (totalHitsRendered >= this.#currentTotalHits) return this.#failureNotification("We're sorry, but you've reached the end of search results.");
    } else {
      this.query = sanitizedQuery;
      this.currentPage = 1;
      this.#refs.galleryContainer.innerHTML = '';
    }

    if (this.#infiniteScrollObserver) this.#infiniteScrollObserver.disconnect();

    this.#toggleLoaderVisibility();
    const galleryDimensions = this.#refs.galleryContainer.getBoundingClientRect();

    try {
      this.#renderData(await this.#fetchData());
    } catch (error) {
      this.#failureNotification(error.message);
    }

    if (this.#scrollToNewResults && !isTrigereredByScroll && this.currentPage > 2) this.#scrollToNewResult(galleryDimensions);
    this.#toggleLoaderVisibility();

    if (this.#infiniteScroll && totalHitsRendered < this.#currentTotalHits) this.#createInfiniteScrollObserver();
  }

  async #fetchData() {
    const searchParams = new URLSearchParams({
      key: this.#key,
      q: this.query,
      image_type: this.imageType,
      orientation: this.orientation,
      safesearch: this.safesearch,
      page: this.currentPage,
      per_page: this.perPage,
    });

    return await axios.get(this.#baseURL, { params: searchParams });
  }

  #renderData({ data }) {
    const { hits, totalHits } = data;

    this.#currentTotalHits = totalHits;
    if (totalHits === 0) {
      this.#refs.galleryPlaceholder && this.#refs.galleryPlaceholder.classList.remove('is-hidden');
      this.#failureNotification('Sorry, there are no images matching your search query. Please try again.');
      return;
    }

    this.#refs.galleryPlaceholder && this.#refs.galleryPlaceholder.classList.add('is-hidden');

    this.#refs.galleryContainer.insertAdjacentHTML('beforeend', this.#createGalleryMarkup(hits));

    this.#animateImagesloading();

    if (this.currentPage === 1) this.#successNotification(`Hooray! We found ${totalHits == 500 ? '500+' : totalHits} images.`);
    if (this.#simpleLightboxInstance) this.#simpleLightboxInstance.refresh();
    this.currentPage += 1;
  }

  #createGalleryMarkup(imagesData) {
    return imagesData
      .map(
        ({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) =>
          `<a class="card" href="${largeImageURL}" ${this.#aosAnimation ? `data-aos=${this.#aosAnimation}` : ''}>
            <div class="card__container">
              <div class="card__image-container">
                <div class="card__image-loader">
                  <div class="image-loader"></div>
                </div>
                <img class="card__image is-hidden" src="${webformatURL}" alt="${tags}" ${
            this.orientation === 'vertical' ? 'width="220" height="330"' : 'width="220" height="150"'
          } loading="lazy" />
              </div>
              <div class="card__info">
                <p class="card__info-item">
                  <b>Likes</b>
                  <span class="card__item-count">${likes}</span>
                </p>
                <p class="card__info-item">
                  <b>Views</b>
                  <span class="card__item-count">${views}</span>
                </p>
                <p class="card__info-item">
                  <b>Comments</b>
                  <span class="card__item-count">${comments}</span>
                </p>
                <p class="card__info-item">
                  <b>Downloads</b>
                  <span class="card__item-count">${downloads}</span>
                </p>
              </div>
            </div>
          </a>`
      )
      .join('');
  }

  #animateImagesloading() {
    const cards = this.#refs.galleryContainer.querySelectorAll('a.card');

    const cardProcessing = card => {
      const imageLoager = card.querySelector('div.card__image-loader');
      const image = card.querySelector('img.card__image');

      const showImage = () => {
        imageLoager.classList.add('is-hidden');
        image.classList.remove('is-hidden');
      };

      image.addEventListener('load', showImage, { once: true });
    };

    cards && cards.forEach(cardProcessing);
  }

  #successNotification(message) {
    if (!this.#onSuccess) return alert(`SUCCESS!!!\n${message}`);

    this.#onSuccess(message);
  }

  #failureNotification(message) {
    if (!this.#onFailure) return alert(`FAILURE!!!\n${message}`);

    this.#onFailure(message);
  }

  #toggleLoaderVisibility() {
    if (!this.#refs.galleryLoader) return;
    this.#refs.galleryLoader.classList.toggle('is-hidden');
  }

  #scrollToNewResult({ height }) {
    window.scrollTo(0, height);
  }

  #createInfiniteScrollObserver() {
    this.#infiniteScrollObserver = new IntersectionObserver(this.#onInfiniteScrollIntersection.bind(this), { threshold: 0.1 });
    const lastLoadedImage = this.#refs.galleryContainer.lastElementChild;

    lastLoadedImage && this.#infiniteScrollObserver.observe(lastLoadedImage);
  }

  #onInfiniteScrollIntersection(entries, infiniteScrollObserver) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        infiniteScrollObserver.unobserve(entry.target);
        this.start(true);
      }
    });
  }
}
