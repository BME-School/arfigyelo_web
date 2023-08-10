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
let markets = [];
let productsToShow = [];
let loadInProgress = false;
let loadedProductsCount = 0;
// Price box-ban megjelenő cellák száma
// Note: A main függvényben is módosítani kell a feltételt

function onScroll() {
    if ($(window).scrollTop() + $(window).height() + 10 >= $(document).height()) {
        loadMoreProducts();
    }
}

$(window).on('scroll', onScroll);

async function fetchAllProducts() {
    const response = await fetch(`/getproducts/${markets}`);
    products = await response.json();
    return products;
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

function loadProduct(index, product20) {
    if (index < product20.length) {
        return new Promise(resolve => {
            setTimeout(() => {
                addProduct(product20[index]);
                loadedProductsCount++;
                resolve();
            }, 100); // Várakozás 100 ms
        }).then(() => loadProduct(index + 1, product20));
    } else {
        loadInProgress = false;
        $(window).on('scroll', onScroll);
    }
}

function loadMoreProducts() {
    console.log(loadedProductsCount, productsToShow.length)
    loadInProgress = true;
    const productToLoad = productsToShow.slice(loadedProductsCount, Math.min(loadedProductsCount+20, productsToShow.length))
    console.log(productToLoad.length)
    $(window).off('scroll');
    loadProduct(0, productToLoad);
}

async function main(){
    if(loadInProgress) return;
    $('#waitWidget').css("display", "block")
    if (products.length == 0) await fetchAllProducts();
    $('#category-title').text("Kedvezményes termékek")
    $('#products').empty()
    productsToShow = products.filter(product => {
        return product.tesco_price <= product.best_price || 
        product.auchan_price <= product.best_price || 
        product.spar_price <= product.best_price || 
        product.aldi <= product.best_price || 
        product.penny_price <= product.best_price;});
    loadedProductsCount = 0;
    loadMoreProducts(productsToShow);
    $('#waitWidget').css("display", "none")    
}

function loadByCategory(category, categoryTitle) {
    if(loadInProgress) return;
    $('#category-title').text(categoryTitle)
    $('#products').empty()

    productsToShow = products.filter(product => product.category === category);
    loadedProductsCount = 0;
    loadMoreProducts(productsToShow);
}

function containString(name, productName){
    name = name.toLowerCase().normalize("NFD").replace(/[^a-zA-Z]/g, '');
    productName = productName.toLowerCase().normalize("NFD").replace(/[^a-zA-Z]/g, '');
    if(productName.includes(name)) return true;
    else return false;
}

function loadByName(name) {
    if(loadInProgress) return;
    loadInProgress = true;
    $('#category-title').text(`Keresés erre: ${name}`);
    $('#products').empty();
    productsToShow = products.filter(product => product.category === category);
    loadedProductsCount = 0;
    loadMoreProducts(productsToShow);
}

$('#searchForm').submit(function(event) {
    event.preventDefault();
    var searchText = $('#searchInput').val();
    loadByName(searchText);
});

function submitForm(event,form) {
    event.preventDefault();
    markets = $(form).find("input[name='stores']:checked").map(function() {
        return this.value;
    }).get();
    if(markets.length != 0){
        main()
        $("#myModal").css("display", "none")
    } else {
        alert("Legalább egy üzletet ki kell választanod!")
    }
}







