// ****** SELECT ITEMS **********
const alert = document.querySelector(".alert");
const form = document.querySelector(".grocery-form");
const grocery = document.getElementById("grocery");
const submitBtn = document.querySelector(".submit-btn");

const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");
const clearBtn = document.querySelector(".clear-btn");

// edit option
let editElement;
let editFlag = false;
let editId;

// ****** EVENT LISTENERS **********
//submit form
form.addEventListener("submit", addItem);
/* clear all btn */
clearBtn.addEventListener("click", clearItems);

/* load */
window.addEventListener("DOMContentLoaded", load);

// ****** FUNCTIONS **********
/* add item function */
function addItem(event) {
  event.preventDefault();
  const id = new Date().getTime().toString();
  const value = grocery.value;
  if (value && !editFlag) {
    createListItems(id, value);

    addLocalStorage(id, value);
    setBackToDefault();
    showAlert("item added", "success");
  } else if (value && editFlag) {
    editElement.innerHTML = value;
    showAlert("item edited", "success");
    editLocalStorageItems(editId, value);
    setBackToDefault();
  } else {
    showAlert("empty value", "danger");
  }
}

/* show alert function */
function showAlert(text, classText) {
  alert.textContent = text;
  alert.classList.add(`alert-${classText}`);

  //remove action
  setTimeout(function () {
    alert.textContent = "";
    alert.classList.remove(`alert-${classText}`);
  }, 1000);
}

/* set back to default function */
function setBackToDefault() {
  grocery.value = "";
  editFlag = false;
  editId = "";
  submitBtn.textContent = "submit";
}

/* clear all items function */

function clearItems() {
  container.classList.remove("show-container");
  // list.innerHTML = "";
  let items = document.querySelectorAll(".grocery-item");
  items.forEach(function (item) {
    list.removeChild(item);
  });
  showAlert("items deleted", "danger");
  setBackToDefault();
  localStorage.removeItem("list");
}

// ****** LOCAL STORAGE **********

/* practice and reference example */
/* 
localStorage.setItem("keyItem", JSON.stringify(["jedan", "dva"]));
localStorage.setItem("drugiItem", JSON.stringify("ojdara"));

const localItem = JSON.parse(localStorage.getItem("keyItem"));
console.log(localItem);

localStorage.removeItem("keyItem"); */

//add local storage item

function addLocalStorage(id, value) {
  const grocery = { id, value };
  let items = localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
  items.push(grocery);

  localStorage.setItem("list", JSON.stringify(items));
  console.log(items);
}

/* remove items from local storage */

function removeFromLocalStorage(id) {
  let items = localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
  items = items.filter(function (item) {
    if (item.id !== id) {
      return item;
    }
  });
  localStorage.setItem("list", JSON.stringify(items));
}

/* edit local storage items */

function editLocalStorageItems(id, value) {
  let items = localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
  items = items.map(function (item) {
    if (item.id === id) {
      item.value = value;
    }
    return item;
  });
  localStorage.setItem("list", JSON.stringify(items));
}

/* load content function */
function load() {
  let items = localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
  if (items.length > 0) {
    items.forEach(function (item) {
      createListItems(item.id, item.value);
    });
  }
}

// ****** SETUP ITEMS **********

/* create list items fucntion */

function createListItems(id, value) {
  container.classList.add("show-container");
  const element = document.createElement("article");

  const atrr = document.createAttribute("data-data");
  atrr.value = id;
  element.setAttributeNode(atrr);
  element.classList.add("grocery-item");

  element.innerHTML = ` 
       
          <p class="title">${value}</p>
          <div class="btn-container">
            <button type="button" class="edit-btn">
              <i class="fas fa-edit"></i>
            </button>
            <button type="button" class="delete-btn">
              <i class="fas fa-trash"></i>
            </button>
            </div>
          `;
  list.appendChild(element);

  /* select delete and edit btns */
  const deleteBtn = element.querySelector(".delete-btn");
  const editBtn = element.querySelector(".edit-btn");

  /*  event listeners for delete and edit btn */
  deleteBtn.addEventListener("click", function (event) {
    const forDelete = event.currentTarget.parentElement.parentElement;
    const id = forDelete.dataset.data;

    forDelete.remove();
    removeFromLocalStorage(id);
    setBackToDefault();
    showAlert("item deleted", "danger");
    if (list.children.length === 0) {
      container.classList.remove("show-container");
    }
  });

  editBtn.addEventListener("click", function (event) {
    const element = event.currentTarget.parentElement.parentElement;
    editElement = event.currentTarget.parentElement.previousElementSibling;
    editFlag = true;
    editId = element.dataset.data;
    submitBtn.textContent = "edit";
    grocery.value = editElement.innerHTML;
  });
}
