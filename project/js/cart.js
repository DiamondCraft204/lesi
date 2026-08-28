let cart = JSON.parse(localStorage.getItem("cart")) || [];
let selectedIds = JSON.parse(localStorage.getItem("checkout-now")) || [];
localStorage.removeItem("checkout-now"); 

function tampilkanCart() {
    const list = document.getElementById("cart-list");
    
    if (cart.length === 0) {
        list.innerHTML = '<div class="empty-cart">Keranjang kamu masih kosong ♡</div>';
        updateSummary();
        return;
    }
    
    let htmlCart = "";
    cart.forEach(item => {
        const isChecked = selectedIds.includes(item.id) ? "checked" : "";
        htmlCart += `
            <div class="cart-item">
                <input type="checkbox" class="cart-check" onchange="toggleCek(this, '${item.id}')" ${isChecked}>
                
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                
                <div>
                    <h3 class="cart-item-name">${item.name}</h3>
                    <p class="cart-item-price">${formatRupiah(item.price)}</p>
                    <div class="quantity-box">
                        <button onclick="kurangQty('${item.id}')">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="tambahQty('${item.id}')">+</button>
                    </div>
                    <button class="delete-button" onclick="hapusItem('${item.id}')">REMOVE</button>
                </div>
                
                <p class="item-total">${formatRupiah(item.price * item.quantity)}</p>
            </div>
        `;
    });
    
    list.innerHTML = htmlCart;
    updateSummary();
}

function toggleCek(checkbox, id) {
    if (checkbox.checked) {
        if (!selectedIds.includes(id)) selectedIds.push(id);
    } else {
        selectedIds = selectedIds.filter(item => item !== id);
    }
    updateSummary();
}

function kurangQty(id) {
    let item = cart.find(i => i.id == id);
    if (item && item.quantity > 1) {
        item.quantity--;
        simpanDanRender();
    }
}

function tambahQty(id) {
    let item = cart.find(i => i.id == id);
    if (item && item.quantity < item.stock) {
        item.quantity++;
        simpanDanRender();
    } else {
        alert("Jumlah melebihi stok.");
    }
}

function hapusItem(id) {
    cart = cart.filter(item => item.id != id);
    selectedIds = selectedIds.filter(item => item != id);
    simpanDanRender();
}

function simpanDanRender() {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    tampilkanCart();
}

// Ringkasan Belanja
function updateSummary() {
    let jumlah = 0;
    let total = 0;
    cart.forEach(item => {
        if (selectedIds.includes(item.id)) {
            jumlah += item.quantity;
            total += item.price * item.quantity;
        }
    });
    document.getElementById("selected-count").textContent = jumlah;
    document.getElementById("cart-total").textContent = formatRupiah(total);
}

// Isi Alamat Otomatis
const akun = JSON.parse(localStorage.getItem("akun"));
if (akun && akun.alamat) {
    document.getElementById("checkout-address").value = akun.alamat;
}

// Tombol Checkout
document.getElementById("checkout-button")?.addEventListener("click", () => {
    if (selectedIds.length === 0) return alert("Pilih barang yang ingin kamu checkout.");
    
    const address = document.getElementById("checkout-address").value.trim();
    if (address === "") return alert("Silakan isi alamat pengiriman terlebih dahulu.");
    
    const payment = document.getElementById("payment-method").value;
    if (payment === "") return alert("Silakan pilih metode pembayaran.");
    
    if (akun) {
        akun.alamat = address;
        localStorage.setItem("akun", JSON.stringify(akun));
    }
    
    // Potong Stok
    let stockData = JSON.parse(localStorage.getItem("stock-overrides")) || {};
    for (let item of cart) {
        if (selectedIds.includes(item.id)) {
            const currentStock = stockData[item.id] !== undefined ? stockData[item.id] : item.stock;
            if (item.quantity > currentStock) {
                return alert("Stok " + item.name + " tidak mencukupi.");
            }
            stockData[item.id] = currentStock - item.quantity;
        }
    }
    localStorage.setItem("stock-overrides", JSON.stringify(stockData));
    
    // Hapus barang dari keranjang
    cart = cart.filter(item => !selectedIds.includes(item.id));
    selectedIds = [];
    simpanDanRender();
    
    alert(`Checkout berhasil! Pembayaran menggunakan ${payment}. Terima kasih sudah belanja di LÉSCIA ♡`);
});

tampilkanCart();