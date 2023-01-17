import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
let gallery = new SimpleLightbox('.gallery a');
const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMore: document.querySelector('.load-more'),
  searchBtn: document.querySelector('.search-btn'),
};

const APIKEY = '32876010-953e9d7ee50a911a8b34edefd';
const baseUrl = 'https://pixabay.com/api/';

let query = '';
let page = 1;

refs.form.addEventListener('submit', onSubmit);
refs.loadMore.addEventListener('click', onLoadMore);

async function onSubmit(e) {
  e.preventDefault();
  refs.searchBtn.disabled = true;
  refs.gallery.innerHTML = '';
  refs.loadMore.classList.add('is-hidden');
  page = 1;

  const searchQuery = e.target.elements.searchQuery.value;
  if (!searchQuery) {
    return;
  }
  query = searchQuery;
  try {
    const images = await getImages(searchQuery, page);
    if (images.totalHits) {
      Notify.success(`Hooray! We found ${images.totalHits} images.`);
    }
    renderImages(images.hits);
  } catch (error) {
    console.log(error);
  }
  refs.searchBtn.disabled = false;
}
async function getImages(q, pageNumber) {
  const response = await axios.get(
    `${baseUrl}?key=${APIKEY}&q=${q}&page=${pageNumber}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40`
  );
  const totalPages = Math.ceil(response.data.totalHits / 40);
  if (!response.data.hits.length) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
  if (totalPages > 1) {
    refs.loadMore.classList.remove('is-hidden');
  }
  if (totalPages === page) {
    refs.loadMore.classList.add('is-hidden');
    Notify.info("We're sorry, but you've reached the end of search results.");
  }
  return response.data;
}

function renderImages(imagesArray) {
  const markup = imagesArray
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
  <div class="image-wrap"><a href="${largeImageURL}"><img src="${webformatURL}" alt="${tags}" loading="lazy"/></a></div>
  <div class="info">
    <p class="info-item">
      <b>Likes</b> ${likes}
    </p>
    <p class="info-item">
      <b>Views</b> ${views}
    </p>
    <p class="info-item">
      <b>Comments</b> ${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b> ${downloads}
    </p>
  </div>
</div>`;
      }
    )
    .join('');
  refs.gallery.insertAdjacentHTML('beforeend', markup);
  gallery.refresh();
}

async function onLoadMore() {
  refs.loadMore.disabled = true;
  page += 1;
  try {
    const images = await getImages(query, page);
    renderImages(images.hits);
  } catch (error) {
    console.log(error);
  }
  refs.loadMore.disabled = false;
}
