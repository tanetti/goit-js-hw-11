export class GalleryGenerator {
  #baseURL;
  #key;
  #refs;
  #onSuccess;
  #onError;

  constructor() {
    this.#baseURL = 'https://pixabay.com/api';
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
  }

  init(options) {
    if (!options || typeof options !== 'object') return;

    const { imageType = 'photo', orientation = 'horizontal', safesearch = true, perPage = 40, onSuccess = null, onError = null } = options;

    this.imageType = imageType;
    this.orientation = orientation;
    this.safesearch = safesearch;
    this.perPage = perPage;
    this.#onSuccess = onSuccess;
    this.#onError = onError;
  }

  async start() {
    if (!this.#refs.inputField) return this.#errorNotification('Input field not specified!');
    if (!this.#refs.galleryContainer) return this.#errorNotification('Gallery container not specified!');

    const sanitizedQuery = this.#refs.inputField.value.trim();

    if (!sanitizedQuery) return;
    if (sanitizedQuery === this.query) {
      this.currentPage += 1;
    } else {
      this.query = sanitizedQuery;
      this.currentPage = 1;
      this.#refs.galleryContainer.innerHTML = '';
    }

    this.#toggleLoaderVisibility();

    try {
      this.#renderData(await this.#fetchData());
    } catch (error) {
      this.#errorNotification(`Ooops, something went wrong!\n${error.message}`);
    }

    this.#toggleLoaderVisibility();
  }

  async #fetchData() {
    const searchOptions = new URLSearchParams({
      key: this.#key,
      q: this.query,
      image_type: this.imageType,
      orientation: this.orientation,
      safesearch: this.safesearch,
      page: this.currentPage,
      per_page: this.perPage,
    });

    const response = await fetch(`${this.#baseURL}/?${searchOptions}`);

    if (!response.ok) throw new Error(response.status);

    return await response.json();
  }

  #renderData({ hits, totalHits }) {
    if (totalHits === 0) return this.#errorNotification('Sorry, there are no images matching your search query. Please try again.');
    if (this.currentPage === 1) this.#successNotification(`Hooray! We found ${totalHits} images.`);

    this.#refs.galleryContainer.insertAdjacentHTML('beforeend', this.#createGalleryMarkup(hits));
  }

  #createGalleryMarkup(imagesData) {
    return imagesData.map(({ views }) => `<span>${views}</span>`).join('');
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
}
