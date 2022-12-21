const sliderRate = document.getElementById('inputRateNumber');
const rating = document.getElementById('rateNumber');
rating.innerHTML = sliderRate.value;

const addCatForm = document.forms.formAddCat;

sliderRate.oninput = function () {
  rating.innerHTML = this.value;
};

const BASE_URL = 'https://cats.petiteweb.dev/api/single/AllieHub';

const container = document.querySelector('.wraper');
const createCatModal = document.querySelector('.form');

const renderCat = ({
  id, name, image, age, rate, description,
}) => {
  return `
    <div data-cat-id="${id}" class="card">
        <img class="card__avatar" src="${image}" alt="" />
        <div class="card__info">
          <p><b>Имя кота:</b> ${name}</p>
          <p><b>Рейтинг:</b> ${rate}</p>
        </div>
      <div class="card__buttons">
        <button data-action="details" id="" type="button" class="btn_details">Детали</button>
        <button data-action="delete" id="" type="button" class="btn_delete red">Удалить</button>
      </div>
    </div>
    `;
};

const renderDetals = ({
  id, name, image, age, rate, description, favorite,
}) => {
  const favoriteText = favorite ? 'Да' : 'Нет';
  return `      
<div class="detailed-modal">
  <div class="card">
    <img class="card__avatar" src="${image}" alt="" />
    <div class="card__info">
      <p><b>ID кота:</b> ${id}</p>
      <p><b>Имя кота:</b> ${name}</p>
      <p><b>Рейтинг:</b> ${rate}</p>
      <p><b>Возраст:</b> ${age}</p>
      <p><b>Мой любимый котик:</b> ${favoriteText}</p>
      <p><b>Описание:</b> ${description}</p>
    </div>
    <button
      data-action="close-details"
      type="button"
      class="btn_details"
      onclick="closeDetailsModal()"
    >
      Закрыть
    </button>
  </div>
</div>
`;
};

fetch(`${BASE_URL}/show`)
  .then((response) => response.json())
  .then((data) => {
    const renderData = data.map(renderCat).join('');
    container.insertAdjacentHTML('afterbegin', renderData);
  })
  .catch((error) => {
    alert('Произошла ошибка во время загрузки данных');
    console.error(error);
  });

const openCreateCatModal = (isOpen) => {
  const visibility = isOpen ? 'visible' : 'hidden';
  createCatModal.style.visibility = visibility;
};

const closeDetailsModal = () => {
  const detailsModal = document.querySelector('.detailed-modal');
  document.body.removeChild(detailsModal);
};

container.addEventListener('click', (event) => {
  const action = event.target.dataset.action;

  const catContainer = event.target.closest('[data-cat-id]');
  const catId = catContainer.dataset.catId;

  if (action === 'delete') {
    fetch(`${BASE_URL}/delete/${catId}`, {
      method: 'DELETE',
    }).then((response) => {
      if (response.status === 200) {
        return catContainer.remove();
      }
      alert(`Удалить кота с id: ${catId} не получилось`);
    });
  } else if (action === 'details') {
    fetch(`${BASE_URL}/show/${catId}`)
      .then((response) => response.json())
      .then((data) => {
        const renderData = renderDetals(data);
        document.body.insertAdjacentHTML('afterbegin', renderData);
      })
      .catch(() => {
        alert(`Отобразить кота с id: ${catId} не получилось`);
      });
  }
});

addCatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  let formDataObject = Object.fromEntries(new FormData(e.target).entries());

  formDataObject = {
    ...formDataObject,
    id: +formDataObject.id,
    age: +formDataObject.age,
    rate: +formDataObject.rate,
    favorite: !!formDataObject.favorite,
  };
  console.log({ formDataObject });

  fetch(`${BASE_URL}/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formDataObject),
  })
    .then((response) => {
      if (response.status === 200) {
        openCreateCatModal(false);
        return container.insertAdjacentHTML(
          'afterbegin',
          renderCat(formDataObject),
        );
      }
      throw Error('Создать кота не получилось');
    })
    .catch(alert);
});
