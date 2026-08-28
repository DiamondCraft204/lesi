// Toggle Register / Login
document.getElementById("bukaDaftar").addEventListener("click", () => {
    document.getElementById("login").classList.add("sembunyi");
    document.getElementById("register").classList.remove("sembunyi");
});

document.getElementById("kembali").addEventListener("click", () => {
    document.getElementById("register").classList.add("sembunyi");
    document.getElementById("login").classList.remove("sembunyi");
});

// Proses Register (Daftar Akun)
document.getElementById("registerForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const nama = document.getElementById("nama").value.trim();
    const email = document.getElementById("emailDaftar").value.trim();
    const password = document.getElementById("passwordDaftar").value;
    const konfirmasi = document.getElementById("konfirmasi").value;
    
    if (password !== konfirmasi) {
        document.getElementById("pesanDaftar").textContent = "Password dan konfirmasi tidak sama.";
        return;
    }
    
    // Simpan akun ke Local Storage
    localStorage.setItem("akun", JSON.stringify({ nama, email, password }));
    alert("Akun berhasil dibuat. Silakan login.");
    
    // Balik ke tampilan login dan isi otomatis form emailnya
    document.getElementById("register").classList.add("sembunyi");
    document.getElementById("login").classList.remove("sembunyi");
    document.getElementById("email").value = email;
    document.getElementById("password").value = "";
    document.getElementById("registerForm").reset();
});

// Proses Login
document.getElementById("loginForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const pesan = document.getElementById("pesan");
    
    const dataAkun = localStorage.getItem("akun");
    if (!dataAkun) {
        pesan.textContent = "Kamu belum memiliki akun. Silakan daftar.";
        return;
    }
    
    const akun = JSON.parse(dataAkun);
    if (email === akun.email && password === akun.password) {
        localStorage.setItem("sudah-login", "true");
        alert("Login berhasil!");
        
        // PERBAIKAN: Tambahkan ../ agar sistem mundur satu folder ke root
        window.location.href = "../index.html"; 
    } else {
        pesan.textContent = "Email atau password salah.";
    }
});