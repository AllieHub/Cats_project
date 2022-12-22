const BASE_URL = 'https://cats.petiteweb.dev/api/single/AllieHub';
const DEFAULT_AVATAR = 'https://www.m24.ru/b/d/nBkSUhL2gVMkn8-0PqzJrMCqzJ3w-pun2XyQ2q2C_2OZcGuaSnvVjCdg4M4S7FjDvM_AtC_QbIk8W7zj1GdwKSGT_w=NWGtprpGA6b7Cy2657h8rw.jpg';
const ADD_CAT_LS = 'ADD_CAT_LS';
const CHANGE_CAT_LS = 'CHANGE_CAT_LS';

const container = document.querySelector('.wraper');

const renderCatForm = (isCreate) => {
  const title = isCreate ? 'Создайте котика' : 'Измените котика';
  return `
  <div class="form">
    <div class="form__container">
      <p>${title}</p>
      <form name="formAddCat">
        <div class="form__cats">
          <label for="">Присвойте id</label>
          <input type="number" required name="id" min="0" placeholder="id" ${!isCreate && 'readonly'} />
        </div>
        <div class="form__cats">
          <label for="">Имя котика</label>
          <input type="text" required name="name" placeholder="Имя котика" />
        </div>
        <div class="form__cats">
          <label for="number">Возраст котика</label>
          <input type="number" name="age" min="0" max="50" placeholder="Возраст" />
        </div>
        <div class="form__cats">
          <label for="">Описание</label>
          <input type="text" name="description" placeholder="Описание" />
        </div>
        <div class="form__cats">
          <label for="">Вставьте ссылку на картинку с котиком</label>
          <input type="url" name="image" placeholder="Ссылка на картинку" />
        </div>
  
        <div class="form__cats-rate">
          <label for="">Рейтинг: <span id="rateNumber"></span></label>
          <input type="range" name="rate" min="1" max="10" value="10" id="inputRateNumber" class="slider-rating"/>
        </div>
  
        <div class="form__cats-checkbox">
          <label for="">Любимый котик</label>
          <input class="checkbox_favorite" type="checkbox" name="favorite" checked/>
        </div>
        <div class="form__buttons">
          <button class="btn_submit" id="submit" type="submit">Сохранить</button>
          <button class="btn_cancel red" type="button" onclick="closeCreateCatModal()" >Отменить</button>
        </div>
      </form>
    </div>
  </div>
  `;
};
const renderCat = ({
  id, name, image, rate,
}) => {
  return `
    <div data-cat-id="${id}" class="card">
        <img class="card__avatar" src="${image || DEFAULT_AVATAR}" alt="" />
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

const renderDetals = (cat) => {
  const {
    id, name, image, age, rate, description, favorite,
  } = cat;
  localStorage.setItem(CHANGE_CAT_LS, JSON.stringify(cat));
  const favoriteText = favorite ? 'Да' : 'Нет';
  return `      
<div class="detailed-modal">
  <div class="card">
    <img class="card__avatar" src="${image || DEFAULT_AVATAR}" alt="" />
    <div class="card__info">
      <p><b>ID кота:</b> ${id}</p>
      <p><b>Имя кота:</b> ${name}</p>
      <p><b>Рейтинг:</b> ${rate}</p>
      <p><b>Возраст:</b> ${age}</p>
      <p><b>Мой любимый котик:</b> ${favoriteText}</p>
      <p><b>Описание:</b> ${description}</p>
    </div>
    <div class="card__buttons">
    <button type="button" onclick="changeCat()">Изменить</button>
    <button type="button" class="red" onclick="closeDetailsModal()">Закрыть</button>
    </div>
  </div>
</div>
`;
};

const getCats = async () => {
  fetch(`${BASE_URL}/show`)
    .then((response) => response.json())
    .then((data) => {
      container.innerHTML = '';
      const renderData = data.map(renderCat).join('');
      container.insertAdjacentHTML('afterbegin', renderData);
    })
    .catch((error) => {
      alert('Произошла ошибка во время загрузки данных');
      console.error(error);
    });
};

const closeDetailsModal = () => {
  const detailsModal = document.querySelector('.detailed-modal');
  document.body.removeChild(detailsModal);
};

// Функционал для создания котика
const parseFormatCatData = (data) => {
  const formDataObject = Object.fromEntries(new FormData(data).entries());
  return {
    ...formDataObject,
    id: +formDataObject.id,
    age: +formDataObject.age,
    rate: +formDataObject.rate,
    favorite: !!formDataObject.favorite,
  };
};

const addCatFormSubmit = (e) => {
  e.preventDefault();
  const formDataObject = parseFormatCatData(e.target);

  fetch(`${BASE_URL}/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formDataObject),
  })
    .then((response) => {
      if (response.status === 200) {
        // eslint-disable-next-line no-use-before-define
        closeCreateCatModal();
        return container.insertAdjacentHTML(
          'afterbegin',
          renderCat(formDataObject),
        );
      }
      throw Error('Создать кота не получилось');
    })
    .catch(alert);
};

const changeCatFormSubmit = (e) => {
  e.preventDefault();
  const formDataObject = parseFormatCatData(e.target);
  console.log(formDataObject);
  fetch(`${BASE_URL}/update/${formDataObject.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formDataObject),
  })
    .then((response) => {
      if (response.status === 200) {
        // eslint-disable-next-line no-use-before-define
        closeCreateCatModal();
        getCats();
      } else if (response.status !== 204) {
        throw Error('Изменить кота не получилось');
      }
    })
    .catch(alert);
};

const openCreateCatModal = (isCreate) => {
  const renderData = renderCatForm(isCreate);
  document.body.insertAdjacentHTML('afterbegin', renderData);
  const addCatForm = document.forms.formAddCat;

  // Слайдер для рейтинга
  const sliderRate = document.getElementById('inputRateNumber');
  const rating = document.getElementById('rateNumber');
  rating.innerHTML = sliderRate.value;
  // eslint-disable-next-line func-names
  sliderRate.oninput = function () {
    rating.innerHTML = this.value;
  };

  const keyStorage = isCreate ? ADD_CAT_LS : CHANGE_CAT_LS;
  const dataFromLS = localStorage.getItem(keyStorage);
  const preparedData = dataFromLS && JSON.parse(dataFromLS);

  if (preparedData) {
    Object.keys(preparedData).forEach((key) => {
      addCatForm[key].value = preparedData[key];
    });
    rating.innerHTML = preparedData.rate;
  }

  const event = isCreate ? addCatFormSubmit : changeCatFormSubmit;
  addCatForm.addEventListener('submit', event);
  addCatForm.addEventListener('change', () => {
    const formDataObject = parseFormatCatData(addCatForm);
    localStorage.setItem(keyStorage, JSON.stringify(formDataObject));
  });
};

const closeCreateCatModal = () => {
  const createCatModal = document.querySelector('.form');
  document.body.removeChild(createCatModal);
};

// eslint-disable-next-line no-unused-vars
const changeCat = () => {
  closeDetailsModal();
  openCreateCatModal(false);
};

container.addEventListener('click', (event) => {
  const action = event.target.dataset.action;

  const catContainer = event.target.closest('[data-cat-id]');
  const catId = catContainer.dataset.catId;

  switch (action) {
    case 'delete':
      fetch(`${BASE_URL}/delete/${catId}`, {
        method: 'DELETE',
      }).then((response) => {
        if (response.status === 200) {
          return catContainer.remove();
        }
        alert(`Удалить кота с id: ${catId} не получилось`);
      });
      break;
    case 'details':
      fetch(`${BASE_URL}/show/${catId}`)
        .then((response) => response.json())
        .then((data) => {
          const renderData = renderDetals(data);
          document.body.insertAdjacentHTML('afterbegin', renderData);
        })
        .catch(() => {
          alert(`Отобразить кота с id: ${catId} не получилось`);
        });
      break;
    default:
      break;
  }
});

getCats();
