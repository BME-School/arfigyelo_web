const product_div = `
<li class="product-item col-lg-3 col-md-4 col-sm-6 mb-4">
    <div class="product-item-div">
        <div class="product-image mt-2"><img src="" alt="termek-neve"></div>
        <div class="product-details">
            <h3 class="product-title"></h3>
            <div class="product-price-wrapper container">
                <span class="lowest-price"></span>
                <div class="shopping-list-btn"><button type="button" class="btn btn-primary mb-2">Hozzáad</button></div>
            </div>
        </div>
    </div>
</li>`;

const priceBoxDiv = `<div class="product-price row">
        <div class="col-3"><img src="" alt=""></div>
        <div class="col-7 price"></div></div>`

let products = [];
// Price box-ban megjelenő cellák száma
// Note: A main függvényben is módosítani kell a feltételt
const markets = ["tesco", "auchan"];

async function fetchAllProducts() {
    const response = await fetch(`/getproducts`);
    const data = await response.json();
    products = data;
    return data;
}

// Forintra alakít egy intet
function intToHuf(amount) {
    const formattedAmount = amount.toLocaleString('hu-HU');
    return `${amount.toLocaleString('hu-HU')} Ft`;
}

// Paraméterként kapott terméket hozzáadja a products-hoz
function addProduct(product){
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
}

async function main(){
    if (products.length == 0) await fetchAllProducts();
    $('#category-title').text("Kedvezményes termékek")
    $('#products').empty()
    products.forEach(product => {
        if(product.tesco_price <= product.best_price || product.achan_price <= product.best_price){
            addProduct(product)
        }
    });
}

function loadByCategory(category, categoryTitle){
    $('#category-title').text(categoryTitle)
    $('#products').empty()
    products.forEach(product => {
        if(product.category == category){
            addProduct(product)
        }
    });
}
function containString(name, productName){
    name = name.toLowerCase().normalize("NFD").replace(/[^a-zA-Z]/g, '');
    productName = productName.toLowerCase().normalize("NFD").replace(/[^a-zA-Z]/g, '');
    if(productName.includes(name)) return true;
    else return false;
}

function loadByName(name){
    $('#category-title').text(`Keresés erre: ${name}`)
    $('#products').empty()
    products.forEach(product => {
        if(containString(name, product.name)){
            addProduct(product)
        }
    });
}

$('#searchForm').submit(function(event) {
    event.preventDefault();
    var searchText = $('#searchInput').val();
    loadByName(searchText);
});


main()





