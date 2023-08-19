export default class Autocomplete {
  constructor(inputElement, array) {
    this.inputElement = inputElement;
    this.array = array;
    this.currentFocus = -1;
    this.init();
  }

  init() {
    this.inputElement.addEventListener("input", this.inputHandler.bind(this));
    this.inputElement.addEventListener(
      "keydown",
      this.keydownHandler.bind(this)
    );
    document.addEventListener("click", this.clickHandler.bind(this));
  }

  inputHandler(e) {
    const val = e.target.value;
    this.closeAllLists();
    if (!val) {
      return false;
    }
    this.currentFocus = -1;
    const autocompleteItems = document.createElement("div");
    autocompleteItems.setAttribute(
      "id",
      this.inputElement.id + "autocomplete-list"
    );
    autocompleteItems.setAttribute("class", "autocomplete-items");
    this.inputElement.parentNode.appendChild(autocompleteItems);
    for (let i = 0; i < this.array.length; i++) {
      if (
        this.array[i].substr(0, val.length).toUpperCase() === val.toUpperCase()
      ) {
        const autocompleteItem = document.createElement("div");
        autocompleteItem.innerHTML =
          "<strong>" + this.array[i].substr(0, val.length) + "</strong>";
        autocompleteItem.innerHTML += this.array[i].substr(val.length);
        autocompleteItem.innerHTML +=
          "<input type='hidden' value='" + this.array[i] + "'>";
        autocompleteItem.addEventListener(
          "click",
          this.itemClickHandler.bind(this)
        );
        autocompleteItems.appendChild(autocompleteItem);
      }
    }
  }

  keydownHandler(e) {
    const autocompleteItems = document.getElementById(
      this.inputElement.id + "autocomplete-list"
    );
    if (autocompleteItems) {
      const items = autocompleteItems.getElementsByTagName("div");
      if (e.keyCode === 40) {
        this.currentFocus++;
        this.addActive(items);
      } else if (e.keyCode === 38) {
        this.currentFocus--;
        this.addActive(items);
      } else if (e.keyCode === 13) {
        e.preventDefault();
        if (this.currentFocus > -1) {
          if (items) items[this.currentFocus].click();
        }
      }
    }
  }

  itemClickHandler(e) {
    this.inputElement.value = e.target.getElementsByTagName("input")[0].value;
    this.closeAllLists();
  }

  addActive(items) {
    if (!items) return false;
    this.removeActive(items);
    if (this.currentFocus >= items.length) this.currentFocus = 0;
    if (this.currentFocus < 0) this.currentFocus = items.length - 1;
    items[this.currentFocus].classList.add("autocomplete-active");
  }

  removeActive(items) {
    for (let i = 0; i < items.length; i++) {
      items[i].classList.remove("autocomplete-active");
    }
  }

  closeAllLists(elmnt) {
    const autocompleteItems =
      document.getElementsByClassName("autocomplete-items");
    for (let i = 0; i < autocompleteItems.length; i++) {
      if (elmnt !== autocompleteItems[i] && elmnt !== this.inputElement) {
        autocompleteItems[i].parentNode.removeChild(autocompleteItems[i]);
      }
    }
  }

  clickHandler(e) {
    this.closeAllLists(e.target);
  }
}
