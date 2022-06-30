console.log("Hello world");

const listDom = document.querySelector(".list");
const loadingDOM = document.querySelector(".loading-text");
const imagefile = document.querySelector("#file");
const file = document.querySelector(".upload-input");
const upload = document.getElementById("upload");
const clear = document.getElementById("clear");
const formAlertDOM = document.querySelector(".form-alert");
clear.disabled = true;
let websites = [];
let serverError = "";
upload.addEventListener("click", async (e) => {
  try {
    e.preventDefault();
    upload.disabled = true;
    const formData = new FormData();

    formData.append("image", imagefile.files[0]);
    if (!imagefile.value) {
      upload.disabled = false;
      formAlertDOM.style.display = "block";
      formAlertDOM.innerHTML = `Файл не выбран`;
      setTimeout(() => {
        formAlertDOM.style.display = "none";
        formAlertDOM.innerHTML = ``;
      }, 3000);
      return;
    }
    // console.log(formData);
    imagefile.value = "";
    websites = [];

    listDom.innerHTML = "";
    loadingDOM.style.visibility = "visible";
    const result = await axios.post("/api/v1/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    const data = result.data;
    websites = data.listOfData;
    serverError = result;

    upload.disabled = false;
    console.log(websites, "websites");
    if (websites.length < 1) {
      listDom.innerHTML = '<h5 class="empty-list">Нет результатов!</h5>';
      loadingDOM.style.visibility = "hidden";

      return;
    }
    clear.disabled = false;
    const render = websites
      .map((w) => {
        const { link, resultName, type } = w;

        return `<div class="single-task">
              <p class="type">${type}</p>
              <p><span><i class="far fa-check-circle"></i></span>${resultName.slice(
                0,
                20
              )}</p>
              <div class="task-links">
              <a href="${link}" target="_blank"  class="edit-link">
               Посмотреть сайт
              </a>
              </div>
              </div>`;
      })
      .join("");
    loadingDOM.style.visibility = "hidden";

    listDom.innerHTML = render;
    // const result = await fetch("/api/v1/upload", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "multipart/form-data",
    //   },
    //   body: formData,
    // })
  } catch (error) {
    console.log("Somthing went wrong!!!", error.message);
    imagefile.value = "";
    websites = [];
    listDom.innerHTML = "";
    formAlertDOM.style.display = "block";
    formAlertDOM.innerHTML = `${serverError || error.message}`;
    loadingDOM.style.visibility = "hidden";
    setTimeout(() => {
      formAlertDOM.style.display = "none";
      formAlertDOM.innerHTML = ``;
      upload.disabled = false;
    }, 3000);
  }
});

clear.addEventListener("click", async (e) => {
  loadingDOM.style.visibility = "hidden";
  listDom.innerHTML = "";
  websites = [];
  imagefile.value = "";
});
