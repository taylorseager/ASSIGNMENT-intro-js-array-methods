import { card } from "../components/card.js";
import { tableRow } from "../components/table.js";
import { referenceList } from "../data/reference.js";
import { renderToDom } from "../utils/renderToDom.js";

// Reusable function to get the cards on the DOM
// .forEach()
const renderCards = (array) => {
  let refStuff = "";
  // item = reference to object in reference.js
  //goes through each time to look at items one at a time, then loops back to the next object
  array.forEach((item) => {
    //.forEach iterates through every item in an array; gives us access to the item to manipulate it how we see fit based on the problem we are trying to solve
    refStuff += card(item);
  }) 
  
  
  renderToDom("#cards", refStuff);
}

// UPDATE/ADD ITEMS TO CART - around 1 hr 50 min
// .findIndex() & (.includes() - string method)
const toggleCart = (event) => {
  if (event.target.id.includes("fav-btn")) {
  //.split turns a string into an array of values
   const [, id] = event.target.id.split('--');
//value of index is the ref list, finding the index on the attribute (taco), converting attribute id to number
   const index = referenceList.findIndex(item => item.id === Number(id));
   
   referenceList[index].inCart = !referenceList[index].inCart
   cartTotal();
   //want to render to DOM all of the data
   renderCards(referenceList);
  }
}

// SEARCH
// .filter()
//getting the event pushed to it
const search = (event) => {
  //declared const, capturing the value and converting it to lower case
  const eventLC = event.target.value.toLowerCase();
  //looking at the reference list and filtering out the items based on lines 37-39
  const searchResult = referenceList.filter(item => 
    item.title.toLowerCase().includes(eventLC) || 
    item.author.toLowerCase().includes(eventLC) || 
    item.description.toLowerCase().includes(eventLC)
    )
    renderCards(searchResult)
}

// BUTTON FILTER
// .filter() & .reduce() &.sort() - chaining
const buttonFilter = (event) => {
  if(event.target.id.includes('free')) {
    //.filter returns a new array of values based on a condition
    const free = referenceList.filter(item => item.price <= 0)
    renderCards(free);
  }
  if(event.target.id.includes('cartFilter')) {
    const  wishList = referenceList.filter(item => item.inCart);
    renderCards(wishList);
  }
  if(event.target.id.includes('books')) {
    const books = referenceList.filter(item => item.type.toLowerCase() === 'book');
    renderCards(books);  
  }
  if(event.target.id.includes('clearFilter')) {
    renderCards(referenceList);
  }
  if(event.target.id.includes('productList')) {
    //open up the table
    let table = `<table class="table table-dark table-striped" style="width: 600px">
    <thead>
      <tr>
        <th scope="col">Title</th>
        <th scope="col">Type</th>
        <th scope="col">Price</th>
      </tr>
    </thead>
    <tbody>
    `;
    //what I want to iterate on; loop through them
    //.sort will sort array from a to z
    productList().sort((a, b) => a.type.localeCompare(b.type)).forEach(item => {
      table += tableRow(item);
    });
    //close out the table
    table += `</tbody></table>`

    renderToDom('#cards', table);
  }
  
}

// CALCULATE CART TOTAL around 2 hours
// .reduce() & .some()
const cartTotal = () => {
  const cart = referenceList.filter(item => item.inCart);
  //=> (first item, second time.parameter, initial value)
  const total = cart.reduce((a, b) => a + b.price, 0)
  const free = cart.some(taco => taco.price <= 0);
  //targeting the cart total on the DOM, pushing it to 2 decimal points
  document.querySelector("#cartTotal").innerHTML = total.toFixed(2);

  if (free) {
    document.querySelector('#includes-free').innerHTML = 'INCLUDES FREE ITEMS'
  } else {
    document.querySelector('#includes-free').innerHTML = ''
  }
}

// RESHAPE DATA TO RENDER TO DOM
// .map() returns an new array; manipulates data based on our determination 
const productList = () => {
  return referenceList.map(item => ({
   //key: value pair
    title: item.title, 
    price: item.price, 
    type: item.type 
  }))
}


const startApp = () => {
  // PUT ALL CARDS ON THE DOM
  renderCards(referenceList)

  // PUT CART TOTAL ON DOM
  cartTotal();

  // SELECT THE CARD DIV
  document.querySelector('#cards').addEventListener('click', toggleCart);

  // SELECT THE SEARCH INPUT
  //everytime a user lets go of a key, I want it to search
  document.querySelector('#searchInput').addEventListener('keyup', search)

  // SELECT BUTTON ROW DIV
  document.querySelector('#btnRow').addEventListener('click', buttonFilter);
}
startApp();
