let categories = document.querySelector("#allcategories");
let button = document.querySelector("#btn");
let categorySelect = document.querySelector("#category_select");
let cardButton = document.querySelector("#cart");
let cartList = document.querySelector("#cart_list");

//Fetch of categories
(async () => {
  let response = await fetch("https://dummyjson.com/products/categories");
  let data = await response.json();
  categorySelect.innerHTML += `<option value="" >Select category</option>`;
  for (let i = 0; i < data.length; i++) {
    categorySelect.innerHTML += `
                <option value="${data[i]}">${data[i]}</option>`;
  }
})();

//Basket
let shoppingCard = (function () {
  let basket = [];
  let curentUserId = localStorage.getItem("currentUserId");

  function Item(id, title, price, count, total) {
    this.id = id;
    this.title = title;
    this.price = price;
    this.count = count;
    this.total = total;
  }

  function saveBasket() {
    let curentUserId = localStorage.getItem("currentUserId");
    localStorage.setItem(curentUserId, JSON.stringify(basket));
  }

  function loadBasket() {
    let basket = localStorage.getItem(curentUserId);
  }

  if (localStorage.getItem(curentUserId) != null) {
    loadBasket();
  }

  let obj = {};

  obj.addItemToBasket = function (id, title, price, count, total) {
    for (let item in basket) {
      if (basket[item].title === title) {
        basket[item].count++;
        saveBasket();
        return;
      }
    }
    let item = new Item(id, title, price, count, total);
    basket.push(item);
    saveBasket();
  };
  obj.setCount = function (title, count) {
    for (let i in basket) {
      if (basket[i].title === title) {
        basket[i].count = count;
        break;
      }
    }
  };
  obj.removeItem = function (title) {
    for (let item in basket) {
      if (basket[item].title === title) {
        basket[item].count--;
        if (basket[item].count === 0) {
          basket.splice(item, 1);
        }
        break;
      }
    }
    saveBasket();
  };
  obj.removeAllItem = function (title) {
    for (let item in basket) {
      if (basket[item].title === title) {
        basket.splice(item, 1);
        break;
      }
    }
    saveBasket();
  };

  obj.clearBasket = function () {
    basket = [];
    saveBasket();
  };

  obj.totalCount = function () {
    let totalCount = 0;
    for (let item in basket) {
      totalCount += basket[item].count;
    }
    return totalCount;
  };

  obj.totalBasket = function () {
    let totalBasket = 0;
    for (let item in basket) {
      totalBasket += basket[item].price * basket[item].count;
    }
    return Number(totalBasket.toFixed(2));
  };

  obj.listBasket = function () {
    let basketCopy = [];
    for (let i in basket) {
      let items = basket[i];
      let itemCopy = {};
      for (let p in items) {
        itemCopy[p] = items[p];
      }
      itemCopy.total = Number(items.price * items.count).toFixed(2);
      basketCopy.push(itemCopy);
    }
    return basketCopy;
  };
  return obj;
})();

function displayCart() {
  let cartArray = shoppingCard.listBasket();
  cartList.innerHTML = "";
  let totalBasket = shoppingCard.totalBasket();
  cartList.innerHTML += `<h1>Shopping Cart</h1>`;
  for (let i in cartArray) {
    cartList.innerHTML += `
<tr id="table">
           <td>Name:${cartArray[i].title}</td>
           <td>Price:${cartArray[i].price}$</td>
           <input type='number' class='item-count form-control' data-name="${cartArray[i].title}" value="${cartArray[i].count}">
           <td><button id="del" class='delete-item btn btn-danger' data-name="${cartArray[i].title}">X</button></td>
           <td>${cartArray[i].total}$</td> <hr>
           </tr> `;
  }
  cartList.innerHTML += ` Total price:<td>${totalBasket}$</td><br> <br>`;
  cartList.innerHTML += ` <td><button id="checkout">Checkout</button> </td>`;
  let deleteItem = document.querySelector("#del");
  // let plusItem = document.querySelector("#plus")
  deleteItem.addEventListener("click", (event) => {
    let name = event.target.getAttribute("data-name");
    shoppingCard.removeAllItem(name);
    displayCart();
  });

  let checkbtn = document.querySelector("#checkout");
  const sendOrder = (email, subject, message, total) => {
    const templateParams = {
      subject: subject,
      message: message,
      total: total,
      to_email: email,
    };

    emailjs.send("service_it1i2ac", "template_puq4f2s", templateParams).then(
        function (response) {
          let getId = localStorage.getItem("currentUserId");
          console.log("SUCCESS!", response.status, response.text);
          localStorage.removeItem(getId);
          cartList.innerHTML = "";
        },
        function (error) {
          console.log("FAILED...", error);
        }
    );
  };

  checkbtn.addEventListener("click", () => {
    let getId = localStorage.getItem("currentUserId");
    let getEmail = localStorage.getItem("currentUserEmails");
    let getBasket = JSON.parse(localStorage.getItem(getId));
    let totalBasket = shoppingCard.totalBasket();

    let message = ``;
    for (item of getBasket) {
      message += `\n ${item.title}: ${item.price}$ \n `;
    }

    sendOrder(getEmail, "Order confirmation", message, `${totalBasket}$`);
  })
}
//End of basket

// Fetch products
async function sendId(id) {
  let response = await fetch("https://dummyjson.com/products?&limit=100");
  let data = await response.json();
  let toCard = [];
  let users = JSON.parse(localStorage.getItem("AllUsers")) || [];
  let current_user = localStorage.getItem("currentUserId");
  for (let prod of data.products) {
    if (prod.id === id) {
      toCard.push(prod);
    }
  }
  for (let item of users) {
    if (item.id === current_user) {
      let product = toCard[0];
      shoppingCard.addItemToBasket(product.id, product.title, product.price, 1);
      displayCart();
    }
  }
}
cardButton.addEventListener("click", () => {
  let card_products = localStorage.getItem("shoppingBasket");
  displayCart();
});

//Category select
async function inputCategory(category) {
  let response = await fetch("https://dummyjson.com/products?&limit=100");
  let data = await response.json();

  categories.innerHTML = "";
  for (let products of data.products) {
    if (category) {
      if (category == products.category) {
        categories.innerHTML += `
            <div class="productblock">
                <div class ="image" style="background-image: url(${products.images[0]});">
                </div> <br>
                <span class="title">${products.title}</span>
                <br>
                <span class="price">${products.price}$</span><br> 
                <span class="titles">Category: ${products.category} </span> <br>
            
                <button id="btn" onClick="sendId(${products.id})">Add to cart</button><br>
            </div>`;
      }
    } else {
      categories.innerHTML += `
                    <div class="productblock">
                    <div class ="image" style="background-image: url(${products.images[0]});">
                    </div> <br>
                    <span class="title">${products.title}</span>
                    <br>
                    <span class="price">${products.price}$</span><br> 
                    <span class="titles">Category: ${products.category}</span>  <br>
                    <button id="btn" onClick="sendId(${products.id})">Add to cart</button><br>
                </div>`;
    }
  }
}
inputCategory();

categorySelect.addEventListener("change", () => {
  inputCategory(categorySelect.value);
});
