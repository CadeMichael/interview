window.addEventListener("DOMContentLoaded", setup);

/*
 * @typedef {Object} Product
 */

/**
 * Return all products using a GET request
 * @param {string} url - the endpoint for the GET request 
 * @throws {Error} - an error if the the request fails
 * @returns {Promise<Product[]>} data - array of products from the request
 */
async function getProducts(url) {
    // catch and throw any errors
    try {
        // fetch and check response
        let res = await fetch(url);
        if (!res.ok) {
            throw new Error(`Error => ${res.status}`)
        }
        // response is good so return json body
        let data = await res.json();
        return data;
    } catch (err) {
        console.log(`Error => ${err}`);
        throw err;
    }
}

/**
 * Process response data
 * @param {Product[]} data - holds the json body of the response
 */
function processProducts(data) {
    // get the product grid
    let product_grid = document.getElementById("product-grid");

    // sort and handle each product
    data.sort((a, b) => a.price - b.price)
        .forEach((p) => {
            // get data from product 'p'
            let img = p.images[0]?.src;
            let title = p.title;
            let price = p.price.toString();
            let dollar = `$${price.slice(0, - 2)}.${price.slice(-2)}`

            // create HTML element for the product
            let product = document.createElement("div");
            product.className = "product";
            product.innerHTML = `
            <img src=${img} alt=${title} class="product-image">
            <h3 class="product-title">${title}</h3>
            <p class="product-price">${dollar}</p>
            `

            // add new HTML element to the DOM
            product_grid.appendChild(product);
        });
}

async function setup() {
    // catch and throw any errors
    try {
        // get and render ALL products from endpoint
        let data = await getProducts("/products");
        processProducts(data);

        // handle searching
        document.getElementById("product-search")
            .addEventListener("input", function() {
                productSearch(this.value.toLowerCase());
            });

        /**
         * Search for products based on input text
         * @param {string} searchTerm - product search input text
         */
        async function productSearch(searchTerm) {
            // clear out existing product grid
            document.getElementById("product-grid").innerHTML = "";

            // this function is a closure so data is in scope
            const matchedProducts = data.filter((p) => {
                // filter data based on user input
                let title = p.title.toLowerCase();
                return title.includes(searchTerm);
            });

            // process only the matched products
            processProducts(matchedProducts);
        }
    } catch (err) {
        console.log(`Error => ${err}`);
        throw err;
    }
}
