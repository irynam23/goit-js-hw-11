import axios from 'axios';

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
};

const APIKEY = '32876010-953e9d7ee50a911a8b34edefd';
const baseUrl = 'https://pixabay.com/api/';

let query = '';

refs.form.addEventListener('submit', onSubmit);

async function onSubmit(e) {
  e.preventDefault();

  const searchQuery = e.target.elements.searchQuery.value;
  if (!searchQuery) {
    return;
  }
  query = searchQuery;
  const images = await getImages(searchQuery);
  renderImages(images.hits);
}
async function getImages(q) {
  const response = await axios.get(`${baseUrl}?key=${APIKEY}&q=${q}`);
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
  <img src="${webformatURL}" alt="" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes: ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views: ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments: ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${downloads}</b>
    </p>
  </div>
</div>`;
      }
    )
    .join('');
  refs.gallery.insertAdjacentHTML('beforeend', markup);
}
