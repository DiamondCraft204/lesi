const API_URL = "https://lesi-api-new.vercel.app/product.json";
let produkTop = [];
let produkTerpilih = null;

async function ambilProduk() {
    try {
        const response = await fetch(API_URL);
        produkTop = await response.json();
        
        // Urutkan rating tertinggi dan ambil 12 teratas
        produkTop.sort((a, b) => b.rating - a.rating);
        produkTop = produkTop.slice(0, 12);
        
        tampilkanTop();
    } catch (error) {
        document.getElementById("top-product-grid").innerHTML = "<p class='empty-text'>Produk gagal dimuat.</p>";
    }
}

function tampilkanTop() {
    const grid = document.getElementById("top-product-grid");
    let html = "";
    
    produkTop.forEach(produk => {
        html += `
            <article class="product-card" onclick="bukaPopup('${produk.id}')">
                <div class="product-image">
                    <img src="${produk.image}" alt="${produk.name}">
                </div>
                <div class="product-info">
                    <p class="product-category">${produk.category}</p>
                    <h3 class="product-name">${produk.name}</h3>
                    <p class="product-rating">${buatBintang(produk.rating)}</p>
                    <p class="product-price">${formatRupiah(produk.price)}</p>
                </div>
            </article>
        `;
    });
    
    grid.innerHTML = html;
}

// Fitur Popup Produk
function bukaPopup(id) {
    produkTerpilih = produkTop.find(p => p.id == id);
    document.getElementById("popup-image").src = produkTerpilih.image;
    document.getElementById("popup-category").textContent = produkTerpilih.category;
    document.getElementById("popup-name").textContent = produkTerpilih.name;
    document.getElementById("popup-rating").textContent = buatBintang(produkTerpilih.rating);
    document.getElementById("popup-price").textContent = formatRupiah(produkTerpilih.price);
    document.getElementById("popup-description").textContent = produkTerpilih.description || "A carefully selected piece from LÉSCIA.";
    document.getElementById("popup-stock").textContent = "Stock: " + ambilStock(produkTerpilih);
    
    document.getElementById("product-popup").classList.add("show");
}

document.getElementById("close-product")?.addEventListener("click", () => {
    document.getElementById("product-popup").classList.remove("show");
});

document.getElementById("product-popup")?.addEventListener("click", (e) => {
    if (e.target.id === "product-popup") e.target.classList.remove("show");
});

function tambahKeCart(produk) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let item = cart.find(i => i.id === produk.id);
    
    if (item) {
        if (item.quantity < ambilStock(produk)) item.quantity++;
    } else {
        cart.push({ id: produk.id, name: produk.name, price: produk.price, image: produk.image, stock: ambilStock(produk), quantity: 1 });
    }
    
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount(); 
}

document.getElementById("add-cart-button")?.addEventListener("click", () => {
    if (!cekLogin()) return;
    tambahKeCart(produkTerpilih);
    alert("Produk berhasil ditambahkan ke keranjang ♡");
});

document.getElementById("checkout-button")?.addEventListener("click", () => {
    if (!cekLogin()) return;
    tambahKeCart(produkTerpilih);
    localStorage.setItem("checkout-now", JSON.stringify([produkTerpilih.id]));
    window.location.href = "cart.html";
});

ambilProduk();