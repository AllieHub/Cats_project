const BASE_URL = "https://cats.petiteweb.dev/api/single/AllieHub";
const container = document.querySelector(".container");

const renderCat = ({ name, image, age, rate, description }) => {
  return `
          <div class="card">
        <img
          class="card__avatar"
          src="${image}"
          alt=""
        />
        <div class="card__info">
          <p><b>Имя кота:</b> ${name}</p>
          <p><b>Рейтинг:</b> ${rate}</p>
          <p><b>Возраст:</b> ${age}</p>
          <p><b>Описание:</b> ${description}</p>
        </div>
        <button id="" type="">Button</button>
      </div>
    `;
};

fetch(`${BASE_URL}/show`)
  .then((response) => response.json())
  .then((data) => {
    const renderData = data.map(renderCat).join("");
    container.insertAdjacentHTML("afterbegin", renderData);
  })
  .catch((error) => {
    alert("Произошла ошибка во время загрузки данных");
    console.error(error);
  });
