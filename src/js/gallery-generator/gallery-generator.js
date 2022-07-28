import axios from 'axios';
import throttle from 'lodash.throttle';

export default class GalleryGenerator {
  #baseURL;
  #key;
  #refs;
  #onSuccess;
  #onError;
  #simpleLightboxInstance;
  #scrollToNewResult;
  #infiniteScroll;
  #currentTotalHits;
  #totalResults;

  constructor() {
    this.#baseURL = 'https://pixabay.com/api/';
    this.#key = '28880240-210227b5aa1544e2eb6639b3c';
    this.#refs = {
      inputField: document.querySelector('[data-gallery="input"]'),
      galleryContainer: document.querySelector('[data-gallery="container"]'),
      galleryLoader: document.querySelector('[data-gallery="loader"]'),
    };

    this.query = '';
    this.currentPage = 1;

    this.imageType = 'photo';
    this.orientation = 'horizontal';
    this.safesearch = true;
    this.perPage = 40;

    this.#onSuccess = null;
    this.#onError = null;
    this.#simpleLightboxInstance = null;
    this.#scrollToNewResult = true;
    this.#infiniteScroll = true;

    this.#currentTotalHits = 0;
    this.#totalResults = 0;
  }

  init(options) {
    if (!options || typeof options !== 'object') return;

    const {
      imageType = 'photo',
      orientation = 'horizontal',
      safesearch = true,
      perPage = 40,
      onSuccess = null,
      onError = null,
      simpleLightboxInstance = null,
      scrollToNewResult = true,
      infiniteScroll = true,
    } = options;

    this.imageType = imageType;
    this.orientation = orientation;
    this.safesearch = safesearch;
    this.perPage = perPage;
    this.#onSuccess = onSuccess;
    this.#onError = onError;
    this.#simpleLightboxInstance = simpleLightboxInstance;
    this.#scrollToNewResult = scrollToNewResult;
    this.#infiniteScroll = infiniteScroll;
  }

  async start() {
    if (!this.#refs.inputField) return this.#errorNotification('Input field not specified!');
    if (!this.#refs.galleryContainer) return this.#errorNotification('Gallery container not specified!');
    if (this.#infiniteScroll && !window.onscroll) window.onscroll = throttle(this.#scrollHandler.bind(this), 200);

    const sanitizedQuery = this.#refs.inputField.value.trim();

    if (!sanitizedQuery) return;
    if (sanitizedQuery === this.query) {
      this.currentPage += 1;
      this.#totalResults = this.currentPage * this.perPage;
      if (this.#totalResults >= this.#currentTotalHits) return this.#errorNotification("We're sorry, but you've reached the end of search results.");
    } else {
      this.query = sanitizedQuery;
      this.currentPage = 1;
      this.#totalResults = 0;
      this.#refs.galleryContainer.innerHTML = '';
    }

    this.#toggleLoaderVisibility();

    try {
      this.#renderData(await this.#fetchData());
    } catch (error) {
      this.#errorNotification(error.message);
    }

    this.#toggleLoaderVisibility();
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
    if (totalHits === 0) return this.#errorNotification('Sorry, there are no images matching your search query. Please try again.');
    if (this.currentPage === 1) this.#successNotification(`Hooray! We found ${totalHits == 500 ? '500+' : totalHits} images.`);

    let galleryHeight = 0;
    if (this.#scrollToNewResult && this.currentPage !== 1) {
      const { height } = this.#refs.galleryContainer.getBoundingClientRect();
      galleryHeight = height;
    }

    this.#refs.galleryContainer.insertAdjacentHTML('beforeend', this.#createGalleryMarkup(hits));

    if (this.#simpleLightboxInstance) this.#simpleLightboxInstance.refresh();

    if (galleryHeight) window.scrollTo(0, galleryHeight);
  }

  #createGalleryMarkup(imagesData) {
    return imagesData
      .map(
        ({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) =>
          `<a class="card" href="${largeImageURL}">
            <img class="card__image" src="${webformatURL}" alt="${tags}" width="220" height="150" loading="lazy"/>
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
          </a>`
      )
      .join('');
  }

  #successNotification(message) {
    if (!this.#onSuccess) return alert(`SUCCESS!!!\n${message}`);

    this.#onSuccess(message);
  }

  #errorNotification(message) {
    if (!this.#onError) return alert(`ERROR!!!\n${message}`);

    this.#onError(message);
  }

  #toggleLoaderVisibility() {
    if (!this.#refs.galleryLoader) return;
    this.#refs.galleryLoader.classList.toggle('is-hidden');
  }

  #scrollHandler() {
    if (this.#totalResults >= this.#currentTotalHits) return;
    const { height: galleryHeight } = this.#refs.galleryContainer.getBoundingClientRect();

    if (window.scrollY > galleryHeight - window.innerHeight) this.start();
  }
}
