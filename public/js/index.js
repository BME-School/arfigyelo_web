const product_div = `
<li class="col-lg-3 col-md-4 col-sm-6">
    <div class="product-item mb-4">
        <div class="product-image"><img src="" alt="termek-neve"></div>
        <div class="product-details">
            <h3 class="product-title"></h3>
            <div class="product-price-wrapper container">
                <span class="lowest-price"></span>
                <div class="shopping-list-btn"><button type="button" class="btn btn-primary">Hozzáad</button></div>
            </div>
        </div>
    </div>
</li>`;

const priceBoxDiv = `<div class="product-price row">
        <div class="col-3"><img src="" alt=""></div>
        <div class="col-7 price"></div></div>`

function intToHuf(amount) {
    const formattedAmount = amount.toLocaleString('hu-HU');
    return `${formattedAmount} Ft`;
}

// Lekérdezi a termékeket az adatbázisból ahol az aktuális ár a legjobb ár vagy kategória szerint
async function fetchProductByCategory(category = "") {
    const response = await fetch(`/products?category=${category}`);
    const data = await response.json();
    return data;
}


// Paraméterként kapott termékeket betölti
async function loadProducts(products, categoryTitle){
    const markets = ["tesco", "auchan"];
    $("#category-title").text(categoryTitle)
    $('#products').empty();
    for (const product of products) {
        const liElement = $(product_div);
        liElement.find('.product-image img').attr('src', product.img);
        liElement.find('.product-image img').attr('alt', product.name);
        liElement.find('.product-title').text(product.name);
        if(product.best_price) liElement.find('.lowest-price').text(`Legalacsonyabb ár*: ${intToHuf(product.best_price)}`);

        markets.forEach(market => {
            if(product[`${market}_price`]){
                const priceBox = $(priceBoxDiv);
                priceBox.find("div img").attr("src", `svg/${market}.svg`);
                priceBox.find(".price").prepend(intToHuf(product[`${market}_price`]));
                liElement.find('.product-price-wrapper').prepend(priceBox);
            }
        });
        
        $('#products').append(liElement);
    };
};

async function main(){
    const products = await fetchProductByCategory();
    loadProducts(products, "Kedvezményes termékek");
}

async function loadByCategory(category){
    const products = await fetchProductByCategory(category);
    console.log(products);
    loadProducts(products, category);
}

loadByCategory("bbq")





