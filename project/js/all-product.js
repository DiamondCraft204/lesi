const API_URL = "https://lesi-api-new.vercel.app/product.json";
let semuaProduk = [];
let kategoriAktif = "all";
let produkTerpilih = null;

async function ambilProduk() {
    try {
        const response = await fetch(API_URL);
        semuaProduk = await response.json();
        
        // Cek jika ada request filter kategori atau search dari halaman Home
        const kategori = localStorage.getItem("selected-category");
        const keyword = localStorage.getItem("search-keyword");
        
        if (kategori) {
            kategoriAktif = kategori.toLowerCase();
            localStorage.removeItem("selected-category");
            
            // Set tombol filter yang aktif di UI
            document.querySelectorAll(".category-filter").forEach(b => {
                b.classList.remove("active");
                if (b.getAttribute("data-category") === kategoriAktif) b.classList.add("active");
            });
        }
        
        tampilkanProduk();
        
        if (keyword) {
            document.getElementById("product-search").value = keyword;
            localStorage.removeItem("search-keyword");
            cariProduk(keyword);
        }
    } catch (error) {
        document.getElementById("product-grid").innerHTML = "<p class='empty-text'>Produk gagal dimuat.</p>";
    }
}

// Menampilkan Produk menggunakan InnerHTML
function tampilkanProduk(dataPencarian = null) {
    const grid = document.getElementById("product-grid");
    
    let produkTampil = dataPencarian || semuaProduk;
    if (!dataPencarian && kategoriAktif !== "all") {
        produkTampil = semuaProduk.filter(p => p.category.toLowerCase() === kategoriAktif);
    }
    
    if (produkTampil.length === 0) {
        grid.innerHTML = "<p class='empty-text'>Produk tidak ditemukan.</p>";
        return;
    }
    
    // Buat HTML dengan perulangan forEach
    let html = "";
    produkTampil.forEach(produk => {
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

// Fitur Search di Halaman All Product
function cariProduk(keyword) {
    const kata = keyword.toLowerCase().trim();
    const data = semuaProduk.filter(p => 
        p.name.toLowerCase().includes(kata) || 
        p.category.toLowerCase().includes(kata)
    );
    tampilkanProduk(data);
}

document.getElementById("product-search-button")?.addEventListener("click", () => {
    cariProduk(document.getElementById("product-search").value);
});

document.getElementById("product-search")?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") cariProduk(e.target.value);
});

// Fitur Filter Tombol Kategori
const filterButtons = document.querySelectorAll(".category-filter");
filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        filterButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        kategoriAktif = btn.getAttribute("data-category");
        tampilkanProduk();
    });
});

// Fitur Popup Produk
function bukaPopup(id) {
    produkTerpilih = semuaProduk.find(p => p.id == id);
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

// Keranjang & Checkout
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