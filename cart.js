
let button = document.querySelector("#btn")
let cardButton = document.querySelector("#cart");
let cartList = document.querySelector("#cart_list")

function loadBasket() {
    let basket = JSON.parse(localStorage.getItem("shoppingBasket"));
}

if (localStorage.getItem("shoppingBasket") != null) {
    loadBasket();
}
cardButton.addEventListener("click", () => {
    let card_products = localStorage.getItem("shoppingBasket")
    displayCart()

})

function displayCart() {
    let cartArray = shoppingCard.listBasket();
    cartList.innerHTML = ""
    let totalBasket = shoppingCard.totalBasket()
    for(let i in cartArray) {
        cartList.innerHTML += `<tr>
            <td>${cartArray[i].title}</td>
           <td>${cartArray[i].price}</td>
           <input type='number' class='item-count form-control' data-name="${cartArray[i].title}" value="${cartArray[i].count}">
          <td><button id="del" class='delete-item btn btn-danger' data-name="${cartArray[i].title}">X</button></td>
          <td>${cartArray[i].total}</td>
           </tr> `;

    }
    let deleteItem = document.querySelector("#del")
    // let plusItem = document.querySelector("#plus")
    deleteItem.addEventListener("click", (event) => {
        let name = event.target.getAttribute("data-name")
        shoppingCard.removeAllItem(name);
        displayCart();
    })
    cartList.innerHTML += `<td>${totalBasket}$</td>`;
    displayCart()};