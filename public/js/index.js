const product_div = `
<li class="product-item col-lg-3 col-md-4 col-sm-6 mb-4">
    <div class="product-item-div">
        <div class="product-image mt-2"><img src="" alt="termek-neve"></div>
        <div class="product-details">
            <h3 class="product-title"></h3>
            <div class="product-price-wrapper container">
                <span class="lowest-price"></span>
                <div class="shopping-list-btn">
                    <button type="button" class="btn favorites-icon" onclick=""><i class="bi bi-heart"></i></button>
                    <button type="button" style="width: 70%;" class="btn btn-primary mb-2 add-to-cart">Hozzáad</button>
                </div>
            </div>
        </div>
    </div>
</li>`;

const priceBoxDiv = `<div class="product-price row">
        <div class="col-3"><img src="" alt=""></div>
        <div class="col-7 price"></div></div>`

const shoppingLiElement = `<li class="list-group-item d-flex justify-content-between align-items-center mb-2">
                            <img src="" alt="Product Image" style="max-width: 80px;">
                            <span class="sl-name">Tesco ecetes torma 200 g</span>
                            <div class="d-flex flex-column">
                                
                            </div>
                            <button type="button" class="btn btn-danger">Törlés</button></li>`
// Sütik
let favoritesArray = [];
let cartArray = [];
let markets = [];

// Termékek betöltése
let products = [];
let productsToShow = [];
let productsCount = 0;
let loadInProgress = false;


// ------------------------------------------------------ //
// ------------------Sütik kezelése---------------------- //
// ------------------------------------------------------ //

function loadCookies(){
    favoritesArray = document.cookie.split("; ").find((row) => row.startsWith("favorites="))?.split("=")[1] || [];
    if(favoritesArray.length != 0) { favoritesArray = JSON.parse(favoritesArray)}
    cartArray = document.cookie.split("; ").find((row) => row.startsWith("shoppingCart="))?.split("=")[1] || [];
    if(cartArray.length != 0) { cartArray = JSON.parse(cartArray)}
    markets = document.cookie.split("; ").find((row) => row.startsWith("markets="))?.split("=")[1] || [];
    if(markets.length != 0) { markets = JSON.parse(markets)}
}

function addToFavorites(id) {
    favoritesArray = document.cookie.split("; ").find((row) => row.startsWith("favorites="))?.split("=")[1] || [];
    if(favoritesArray.length != 0) { favoritesArray = JSON.parse(favoritesArray)}

    if (!favoritesArray.includes(id)) {
        favoritesArray.push(id);
        document.cookie = `favorites=${JSON.stringify(favoritesArray)}; expires=${new Date(new Date().getTime() + 30 * 24 * 3600000).toUTCString()}; path=/`;    }
}

function removeFromFavorites(id) {
    favoritesArray = document.cookie.split("; ").find((row) => row.startsWith("favorites="))?.split("=")[1] || [];
    if(favoritesArray.length != 0) { favoritesArray = JSON.parse(favoritesArray)}

    const index = favoritesArray.indexOf(id);
    if (index !== -1) favoritesArray.splice(index, 1);
    document.cookie = `favorites=${JSON.stringify(favoritesArray)}; expires=${new Date(new Date().getTime() + 30 * 24 * 3600000).toUTCString()}; path=/`;
}

function addToCart(button, id) {
    button.classList.add('btn-success'); 
    setTimeout(function() { button.classList.remove('btn-success'); }, 300);

    cartArray = document.cookie.split("; ").find((row) => row.startsWith("shoppingCart="))?.split("=")[1] || [];
    if(cartArray.length != 0) { cartArray = JSON.parse(cartArray)}

    if (!cartArray.includes(id)) {
        cartArray.push(id);
        document.cookie = `shoppingCart=${JSON.stringify(cartArray)}; expires=${new Date(new Date().getTime() + 30 * 24 * 3600000).toUTCString()}; path=/`;    }
}

function removeFromCart(element, id) {
    $(element).remove();
    cartArray = document.cookie.split("; ").find((row) => row.startsWith("shoppingCart="))?.split("=")[1] || [];
    if(cartArray.length != 0) { cartArray = JSON.parse(cartArray)}

    const index = cartArray.indexOf(id);
    if (index !== -1) cartArray.splice(index, 1);
    document.cookie = `shoppingCart=${JSON.stringify(cartArray)}; expires=${new Date(new Date().getTime() + 30 * 24 * 3600000).toUTCString()}; path=/`;
}

function setMarkets(marketsArray) {
   document.cookie = `markets=${JSON.stringify(marketsArray)}; expires=${new Date(new Date().getTime() + 30 * 24 * 3600000).toUTCString()}; path=/`;
}



// ------------------------------------------------------ //
// ------------------Termékek betöltése------------------ //
// ------------------------------------------------------ //


async function fetchAllProducts() {
    const response = await fetch(`/getproducts/${markets}`);
    products = await response.json();
    return products;
}

function sortByPrice(){
    $('#products').empty();
    productsToShow = productsToShow.sort((productA, productB) => {
            const getPrice = (product) => {
                const prices = [product.tesco_price, product.auchan_price, product.aldi_price, product.spar_price, product.penny_price];
                return Math.min(...prices.filter(price => price !== null));
            };
            return getPrice(productA) - getPrice(productB);
        });
    productsCount = 0;
    loadMoreProducts()
}

function loadSettings() {
    const marketSettings = $("#myModal")
    markets.forEach(market => {
        marketSettings.find(`#${market}`).prop("checked", true);
    });
    marketSettings.css("display", "block");
}

// Forintra alakít egy intet
function intToHuf(amount) {
    const formattedAmount = amount.toLocaleString('hu-HU');
    return `${amount.toLocaleString('hu-HU')} Ft`;
}

function containString(name, productName){
    name = name.toLowerCase().normalize("NFD").replace(/[^a-zA-Z0-9]/g, '');
    productName = productName.toLowerCase().normalize("NFD").replace(/[^a-zA-Z0-9]/g, '');
    if(productName.includes(name)) return true;
    else return false;
}

function setProductsCount(db){
    if(db>0) $('#productCount').text(`Összesen: ${db} db termék`)
    else $('#productCount').text("")
}
// Paraméterként kapott terméket betölti
function addProduct(product){
    const liElement = $(product_div);
    liElement.find('.product-image img').attr('src', product.img);
    liElement.find('.product-image img').attr('alt', product.name);
    var index = favoritesArray.indexOf(product.id);
    if (index !== -1) {
        liElement.find(".bi").toggleClass('bi-heart');
        liElement.find(".bi").toggleClass('bi-heart-fill');
    }
    liElement.find(".favorites-icon").attr("onclick", `toggleHeartIcon(this, ${product.id});`);
    liElement.find(".add-to-cart").attr("onclick", `addToCart(this, ${product.id});`);
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
                resolve();
            }, 20); 
        }).then(() => loadProduct(index + 1, product20));
    } else {
        loadInProgress = false;
    }
}

function loadMoreProducts() {
    loadInProgress = true;
    const productToLoad = productsToShow.slice(Math.min(productsCount, productsToShow.length), Math.min(productsCount + 20, productsToShow.length));
    productsCount += 20;
    loadProduct(0, productToLoad);
}

async function main(){
    if(loadInProgress) return;
    productsCount = 0;
    $('#waitWidget').css("display", "block")
    await fetchAllProducts();
    $('#category-title').text("Kedvezményes termékek")
    $('#products').empty()
    $('#shopList').empty();

    productsToShow = products.filter(product => {
        return product.tesco_price <= product.best_price || 
        product.auchan_price <= product.best_price || 
        product.spar_price <= product.best_price || 
        product.aldi <= product.best_price || 
        product.penny_price <= product.best_price;});

    setProductsCount(productsToShow.length)
    loadMoreProducts();
    $('#waitWidget').css("display", "none")   
    $(window).on('scroll', onScroll); 
}

function loadByCategory(category, categoryTitle) {
    if(loadInProgress) return;
    productsCount = 0;
    $('#category-title').text(categoryTitle)
    $('#products').empty()
    $('#shopList').empty();

    productsToShow = products.filter(product => product.category === category);
    setProductsCount(productsToShow.length)
    loadMoreProducts();
    $(window).on('scroll', onScroll);
}

function loadFavorites() {
    if(loadInProgress) return;
    $('#category-title').text("Kedvenc termékek");
    $('#products').empty();
    $('#shopList').empty();
    
    productsToShow = products.filter(product => favoritesArray.includes(product.id));
    setProductsCount(productsToShow.length)
    if(productsToShow.length == 0)  $('#category-title').text(`Nincs találat`);
    else loadMoreProducts();
    $(window).on('scroll', onScroll);
}

function loadByName(name) {
    if(loadInProgress) return;
    productsCount = 0;
    $('#category-title').text(`Keresés erre: ${name}`);
    $('#products').empty();
    $('#shopList').empty();
    nameArr = name.split(" ");
    productsToShow = products.filter(product => nameArr.every(part => containString(part, product.name)));
    setProductsCount(productsToShow.length)
    if(productsToShow.length == 0)  $('#category-title').text(`Nincs találat erre: ${name}`);
    else loadMoreProducts();
    $(window).on('scroll', onScroll);
}

function loadShoppingCart() {
    if(loadInProgress) return;
    $('#products').empty();
    $('#shopList').empty();
    $('#category-title').text("Bevásárlólista")
    setProductsCount(0)
    $(window).off('scroll');

    let priceSum = 0;
    productsToShow = products.filter(product => cartArray.includes(product.id));
    productsToShow.forEach(product => {
        const listElement = $(shoppingLiElement);
        listElement.find('img').attr('src', product.img);
        listElement.find('sl-name').text(product.name);
        listElement.find('button').attr("onclick", `removeFromCart(this.parentNode, ${product.id})`);
        let values = [];
        markets.forEach(market => {
            values.push(product[`${market}_price`]);
            if(product[`${market}_price`]){
                const priceElement = $(`<span class="sl-price"><img src="svg/${market}.svg" alt=""> &nbsp;${intToHuf(product[`${market}_price`])}</span>`);
                listElement.find('.flex-column').prepend(priceElement);
            }
        });
        const validValues = values.filter(value => typeof value === 'number' && !isNaN(value));
        priceSum += Math.min(...validValues)
        
        $('#shopList').append(listElement);
    });
    const sumELement = $(`<h2 class='text-right'>Összesen: ${intToHuf(priceSum)}*</h2>`)
    $('#shopList').append(sumELement);



}
// ------------------------------------------------------ //
// ------------------Eseménykezelők---------------------- //
// ------------------------------------------------------ //



function onScroll(){
    if ($(window).scrollTop() + $(window).height() + 10 >= $(document).height()) {
        loadMoreProducts();
        $("#topbtn").css("display", "block")
    }
    if ($(window).scrollTop() >= 600) {
        $("#topbtn").css("display", "block")
    } else {
        $("#topbtn").css("display", "none")
    }
}

// Gombnyomásra az oldal tetejére görget
$('#topbtn').on('click', function() {
    $('html, body').animate({
      scrollTop: 0
    }, 'smooth');
});

// Kedvencekhez adás gomb ki-be kapcsolása
function toggleHeartIcon(button, id) {
    const heartIcon = $(button).find('.bi');
    if (heartIcon.hasClass('bi-heart-fill')) removeFromFavorites(id);
    else addToFavorites(id);
    heartIcon.toggleClass('bi-heart');
    heartIcon.toggleClass('bi-heart-fill');
};

$('#searchForm').submit(function(event) {
    event.preventDefault();
    var searchText = $('#searchInput').val();
    if(searchText.length >= 3) loadByName(searchText);
    else alert("legalább 3 karakter megadása kötelező");
});


// Beállítások mentése
function submitForm(event,form) {
    event.preventDefault();
    markets = $(form).find("input[name='stores']:checked").map(function() {
        return this.value;
    }).get();
    setMarkets(markets)
    if(markets.length != 0){
        main()
        $("#myModal").css("display", "none")
    } else {
        alert("Legalább egy üzletet ki kell választanod!")
    }
};



// ------------------------------------------------------ //
// -------------Futtatás oldal megnyitásakor------------- //
// ------------------------------------------------------ //

loadCookies()
if(markets.length == 0) $("#myModal").css("display", "block");
else main();







