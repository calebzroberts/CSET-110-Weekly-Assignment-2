var cart = [];

//function added to the add to cart buttons
function AddToCart(button)
{
    //gets items to add to the cart
    let itemImg = "";
    let title = "";
    let price = "";

    //get parent of item
    const parentDiv = button.parentElement.parentElement;

    //gets individual items
    const img = parentDiv.querySelector(".shop-item-image");
    const titleBox = parentDiv.querySelector(".shop-item-title");
    const priceBox = button.parentElement.querySelector(".shop-item-price");

    //assigns image for cart
    itemImg = img.src;
    title = titleBox.textContent;
    price = priceBox.textContent;

    //turn price into a number
    price = Number(price.slice(1));

    const thisCartItem = {imageUrl: itemImg, itemName: title, itemPrice: price, itemQuantity: 1};

    //first checks to make sure this will not add a duplicate
    if (CheckItemInCart(title) === true)
    {
        let duplicateIndex = GetDuplicateIndex(title);
        //update item quantity
        UpdateItemQuantity(duplicateIndex, (cart[duplicateIndex].itemQuantity + 1));

        return;
    }
    

    cart.push(thisCartItem);
    UpdateVisibleCart();

    //resets purchase button back to normal
    UpdatePurchaseText("Click below to purchase.");
}

function PurchaseItems()
{
    if (cart.length === 0)
    {
        UpdatePurchaseText("You don't have anything in your cart!");
        return;
    }
    ResetCart();

    UpdatePurchaseText("We sent your order in. Thanks for ordering!");
}

function UpdatePurchaseText(text)
{
    let purchaseButton = document.getElementById("purchaseMsg");
    purchaseButton.innerText = text;
}

function UpdateItemQuantity(thisIndex, thisQuantity)
{
    cart[thisIndex].itemQuantity = thisQuantity;

    //remove item if quantity becomes 0
    if (thisQuantity < 1)
    {
        
        RemoveItem(thisIndex);
        return;
    }

    UpdateVisibleCart();
}

function UpdateVisibleCart()
{
    const cartSection = document.getElementById("cart-items");

    //reset cart section
    cartSection.innerHTML = ``;

    //for each item in the cart, make a new item in the cart area
    for (let i = 0; i < cart.length; i++)
    {
        let newCartItem = document.createElement("div");
        newCartItem.innerHTML = `
            <div class="cart-row">
                <div class="cart-item cart-column">
                    <img class="cart-item-image" src="${cart[i].imageUrl}" width="100" height="100">
                    <span class="cart-item-title">${cart[i].itemName}</span>
                </div>
                <span class="cart-price cart-column">$${cart[i].itemPrice}</span>
                <div class="cart-quantity cart-column">
                    <input class="cart-quantity-input" type="number" value="${cart[i].itemQuantity}" onchange="UpdateItemQuantity(${[i]}, this.value)" min="0">
                    <button class="btn btn-danger" value="${i}" onclick="RemoveItem(this.value)" type="button">REMOVE</button>
                </div>
            </div>
        `;

        cartSection.append(newCartItem);
    }
    
    UpdateTotal();
}

//updates total text at bottom of cart
function UpdateTotal()
{
    const totalPriceElement = document.getElementById("cart-total-price");
    
    let totalPrice = 0;

    //adds all prices together
    for(let i = 0; i < cart.length; i++)
    {
        totalPrice += (cart[i].itemPrice * cart[i].itemQuantity);
    }

    totalPrice = totalPrice.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    totalPriceElement.innerText = `$${totalPrice}`;
}

function RemoveItem(thisIndex)
{
    //remove item from the cart array
    cart.splice(thisIndex, 1);

    //update after change
    UpdateVisibleCart();
}

//used to see if there is an item in the cart
function CheckItemInCart(name)
{
    for (let i = 0; i < cart.length; i++)
    {
        if (cart[i].itemName === name)
        {
            
            return true;
            
        }
    }

    return false;
}

//update the quantity if duplicate in cart
function GetDuplicateIndex(name)
{
    for (let i = 0; i < cart.length; i++)
    {
        
        if (cart[i].itemName === name)
        {
            
            return i;
            
        }
    }

    return false;
}

function ResetCart()
{
    //reset cart variable
    cart = [];
    
    const cartSection = document.getElementById("cart-items");

    //reset cart section
    cartSection.innerHTML = ``;

    UpdateTotal();
}

//reset cart on load
ResetCart();

//reset purchase text on load
UpdatePurchaseText("Click below to purchase.");