// =========================
// 1. FUNGSI GLOBAL
// =========================

function sudahLogin() {
    return localStorage.getItem("akun") && localStorage.getItem("sudah-login") === "true";
}

function cekLogin() {
    if (!sudahLogin()) {
        alert("Silakan login terlebih dahulu.");
        window.location.href = "login.html"; 
        return false;
    }
    return true;
}

function formatRupiah(harga) {
    return new Intl.NumberFormat("id-ID", { 
        style: "currency", 
        currency: "IDR", 
        maximumFractionDigits: 0 
    }).format(harga);
}

function buatBintang(rating) {
    let hasil = "";
    for (let i = 0; i < Math.round(rating); i++) { hasil += "★"; }
    return hasil + " " + rating;
}

function ambilStock(produk) {
    const stockData = JSON.parse(localStorage.getItem("stock-overrides")) || {};
    return stockData[produk.id] !== undefined ? stockData[produk.id] : produk.stock;
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    let jumlah = 0;
    cart.forEach(item => jumlah += item.quantity || 1);
    const cartCount = document.getElementById("cart-count");
    if (cartCount) cartCount.textContent = jumlah;
}

// =========================
// 2. EVENT LISTENER UMUM (Navbar, Search, dsb)
// =========================

document.addEventListener("DOMContentLoaded", () => {
    updateCartCount();

    const loginRegisterBtn = document.getElementById("login-register-btn");
    if (loginRegisterBtn && sudahLogin()) {
        loginRegisterBtn.style.display = "none";
    }

    // Tombol Back
    document.getElementById("back-button")?.addEventListener("click", () => history.back());

    // Tombol Cart
    document.getElementById("cart-button")?.addEventListener("click", () => {
        if (cekLogin()) window.location.href = "cart.html";
    });

    // Tombol Profile Popup
    document.getElementById("profile-button")?.addEventListener("click", () => {
        if (!cekLogin()) return;
        const dataAkun = JSON.parse(localStorage.getItem("akun"));
        document.getElementById("profile-name").textContent = dataAkun.nama;
        document.getElementById("profile-email").textContent = dataAkun.email;
        document.getElementById("profile-address").value = dataAkun.alamat || "";
        document.getElementById("profile-popup").classList.add("show");
    });

    // Tutup Profile
    document.getElementById("close-profile")?.addEventListener("click", () => {
        document.getElementById("profile-popup").classList.remove("show");
    });

    // Simpan Alamat di Profile
    document.getElementById("save-address-button")?.addEventListener("click", () => {
        const address = document.getElementById("profile-address").value.trim();
        if (address === "") return alert("Alamat tidak boleh kosong.");
        
        const akun = JSON.parse(localStorage.getItem("akun"));
        akun.alamat = address;
        localStorage.setItem("akun", JSON.stringify(akun));
        alert("Alamat berhasil disimpan.");
    });

// Logout
    document.getElementById("logout-button")?.addEventListener("click", () => {
        if (confirm("Are you sure you want to log out?")) {
            localStorage.removeItem("sudah-login");
            
            // Cek posisi URL saat ini, jika di dalam folder html, mundur pakai ../
            if (window.location.href.includes("/html/")) {
                window.location.href = "../index.html";
            } else {
                window.location.reload(); // Jika sudah di halaman utama, cukup refresh
            }
        }
    });

    // Search Global (Mengarahkan ke Halaman All Products)
    function arahkanPencarian(inputElement) {
        const keyword = inputElement.value.trim();
        if (keyword !== "") {
            localStorage.setItem("search-keyword", keyword);
            window.location.href = "all-product.html";
        }
    }

    document.getElementById("search-button")?.addEventListener("click", () => {
        arahkanPencarian(document.getElementById("search-input"));
    });

    document.getElementById("search-input")?.addEventListener("keydown", (e) => {
        if (e.key === "Enter") arahkanPencarian(e.target);
    });
});