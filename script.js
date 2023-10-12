const select = document.getElementById("category");
const button = document.querySelectorAll(".search-btn");
const price = document.getElementById("price-range");
const pdisplay = document.getElementById("price-display");
const container = document.getElementById("product-container");
const prev = document.getElementById("prev-button");
const next = document.getElementById("next-button");
let products = []; // filter jab krenge toh yaha store ho jayega
let currentPage = 0;

//display products
function display() {
    container.innerHTML = ''; //existing product clear kr dega aur filter product ko aane dega

    const perPage = 36; //12 column * 3 rows display items per page
    const startIndex = currentPage * perPage;
    const endIndex = startIndex + perPage;

    let pfiltered = products;

    //category filter
    const cselected = select.value;
    if (cselected !== 'all') {
        pfiltered = pfiltered.filter(product => product.category === cselected);
    }

    //search filters
    button.forEach(button => {
        const sfilter = button.getAttribute("data-filter");
        if (button.classList.contains("active")) {
            pfiltered = pfiltered.filter(product => sfilter === 'all' || product.searchFor === sfilter);
        }
    });

    //price range filter
    const pselected = parseFloat(price.value);//so that hume desimal vale na mile we get proper integer
    pdisplay.textContent = `$${pselected}`;
    pfiltered = pfiltered.filter(product => product.price <= pselected);


    //current page product display
    const productsDisplay = pfiltered.slice(startIndex, endIndex);

    productsDisplay.forEach(product => {
        const productElement = document.createElement("div");
        productElement.classList.add("product");
        productElement.innerHTML = `
                <a href="${product.productLink}" target="_blank" class='card'>
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                 
                    <p>Price: $${product.price}</p>
                </a>
            `;
        container.appendChild(productElement);
    });
}

//fetching data from json
fetch("data.json")
    .then(response => response.json())
    .then(data => {
        products = data; //array me product store ho jayega
        display();
    })
    .catch(error => console.error("Error loading product data:", error));

//for category filter
select.addEventListener("change", function () {
    display();
});

//for "Search For" buttons
button.forEach(button => {
    button.addEventListener("click", function () {
        button.classList.toggle("active");
        display();
    });
});

//for price range filter
price.addEventListener("input", function () {
    display();
});

//for prev button
prev.addEventListener("click", function () {
    if (currentPage > 0) {
        currentPage--;
        display();
    }
});

//for next button
next.addEventListener("click", function () {
    const perPage = 36; //no. of product to be displayed on each page
    const totalProducts = products.length;
    const maxPages = Math.ceil(totalProducts / perPage);//math.ceil nearest integer me convert krdega
    if (currentPage < maxPages - 1) {
        currentPage++;
        display();
    }
});


const clearbtn = document.getElementById("clear");
clearbtn.addEventListener("click", function () {
    // Clear category filter
    select.value = "all";

    // Clear "Search For" buttons
    button.forEach(button => {
        button.classList.remove("active");
    });

    // Reset price range filter
    price.value = 999;
    pdisplay.textContent = "$999";

    // Call the display function to update the product display with cleared filters
    display();
});