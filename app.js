
// IIFE to contain local variables and functions, minimizing global scope pollution
(() => {
    // Global scope
    const listProductHTML = document.querySelector('.listProduct');
    const listCartHTML = document.querySelector('.listCart');
    const iconCart = document.querySelector('.icon-cart');
    const iconCartSpan = document.querySelector('.icon-cart span');
    const body = document.querySelector('body');
    const closeCart = document.querySelector('.close');

    let products = [];
    let cart = [];

    // Toggle cart visibility
    iconCart.addEventListener('click', () => {
        body.classList.toggle('showCart');
    });
    closeCart.addEventListener('click', () => {
        body.classList.toggle('showCart');
    });

    // Function to add product data to HTML
    const addDataToHTML = () => {
        if (products.length > 0) { // If there is data
            products.forEach(product => {
                let newProduct = document.createElement('div');
                newProduct.dataset.id = product.id;
                newProduct.classList.add('item');
                newProduct.innerHTML = 
                `<img src="${product.image}" alt="">
                <h2>${product.name}</h2>
                <div class="price">$${product.price}</div>
                <button class="addCart">Add To Cart</button>`;
                listProductHTML.appendChild(newProduct);
            });
        }
    };

    // Event listener for adding products to cart
    listProductHTML.addEventListener('click', (event) => {
        let positionClick = event.target;
        if (positionClick.classList.contains('addCart')) {
            let id_product = positionClick.parentElement.dataset.id;
            addToCart(id_product);
        }
    });

    // Add item to the cart array
    const addToCart = (product_id) => {
        let positionThisProductInCart = cart.findIndex(value => value.product_id == product_id);
        if (cart.length <= 0) {
            cart = [{ product_id: product_id, quantity: 1 }];
        } else if (positionThisProductInCart < 0) {
            cart.push({ product_id: product_id, quantity: 1 });
        } else {
            cart[positionThisProductInCart].quantity += 1;
        }
        addCartToHTML();
        addCartToMemory();
    };

    // Save cart to local storage
    const addCartToMemory = () => {
        localStorage.setItem('cart', JSON.stringify(cart));
    };

    // Add cart data to HTML and update the cart icon quantity
    const addCartToHTML = () => {
        listCartHTML.innerHTML = '';
        let totalQuantity = 0;
        if (cart.length > 0) {
            cart.forEach(item => {
                totalQuantity += item.quantity;
                let newItem = document.createElement('div');
                newItem.classList.add('item');
                newItem.dataset.id = item.product_id;

                let positionProduct = products.findIndex(value => value.id == item.product_id);
                let info = products[positionProduct];
                newItem.innerHTML = `
                    <div class="image">
                        <img src="${info.image}">
                    </div>
                    <div class="name">${info.name}</div>
                    <div class="totalPrice">$${info.price * item.quantity}</div>
                    <div class="quantity">
                        <span class="minus"><</span>
                        <span>${item.quantity}</span>
                        <span class="plus">></span>
                    </div>
                `;
                listCartHTML.appendChild(newItem);
            });
        }
        iconCartSpan.innerText = totalQuantity;
    };

    // Event listener for changing item quantity in the cart
    listCartHTML.addEventListener('click', (event) => {
        let positionClick = event.target;
        if (positionClick.classList.contains('minus') || positionClick.classList.contains('plus')) {
            let product_id = positionClick.parentElement.parentElement.dataset.id;
            let type = positionClick.classList.contains('plus') ? 'plus' : 'minus';
            changeQuantityCart(product_id, type);
        }
    });

    // Update item quantity in the cart
    const changeQuantityCart = (product_id, type) => {
        let positionItemInCart = cart.findIndex(value => value.product_id == product_id);
        if (positionItemInCart >= 0) {
            switch (type) {
                case 'plus':
                    cart[positionItemInCart].quantity += 1;
                    break;
                case 'minus':
                    let changeQuantity = cart[positionItemInCart].quantity - 1;
                    if (changeQuantity > 0) {
                        cart[positionItemInCart].quantity = changeQuantity;
                    } else {
                        cart.splice(positionItemInCart, 1); // Remove item if quantity is 0
                    }
                    break;
            }
        }
        addCartToHTML();
        addCartToMemory();
    };

    // Initialize application, load products and cart data from local storage
    const initApp = () => {
        fetch('products.json')
        .then(response => response.json())
        .then(data => {
            products = data;
            addDataToHTML();

            // Load cart data from local storage if available
            if (localStorage.getItem('cart')) {
                cart = JSON.parse(localStorage.getItem('cart'));
                addCartToHTML();
            }
        });
    };

    // Initialize the app
    initApp();

})(); // End of IIFE
