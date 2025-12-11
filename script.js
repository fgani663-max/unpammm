// Password untuk login
const LOGIN_PASSWORD = "gani 123";

// Data mahasiswa (contoh data, bisa ditambah manual)
let mahasiswaData = [
    { id: 1, nim: "2021001", nama: "Ahmad Rizki", jurusan: "Teknik Informatika", email: "ahmad.rizki@email.com" },
    { id: 2, nim: "2021002", nama: "Budi Santoso", jurusan: "Sistem Informasi", email: "budi.santoso@email.com" },
    { id: 3, nim: "2021003", nama: "Citra Dewi", jurusan: "Teknik Komputer", email: "citra.dewi@email.com" },
    { id: 4, nim: "2021004", nama: "Dedi Kurniawan", jurusan: "Teknik Informatika", email: "dedi.kurniawan@email.com" },
    { id: 5, nim: "2021005", nama: "Eka Putri", jurusan: "Sistem Informasi", email: "eka.putri@email.com" }
];

// DOM Elements
const loginScreen = document.getElementById('loginScreen');
const mainContent = document.getElementById('mainContent');
const loginForm = document.getElementById('loginForm');
const passwordInput = document.getElementById('password');
const loginError = document.getElementById('loginError');
const logoutBtn = document.getElementById('logoutBtn');
const welcomeAnimation = document.getElementById('welcomeAnimation');
const dataDisplay = document.getElementById('dataDisplay');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const sortBy = document.getElementById('sortBy');
const sortOrder = document.getElementById('sortOrder');
const sortBtn = document.getElementById('sortBtn');
const resetBtn = document.getElementById('resetBtn');
const toggleFormBtn = document.getElementById('toggleFormBtn');
const addDataForm = document.getElementById('addDataForm');
const dataForm = document.getElementById('dataForm');
const cancelBtn = document.getElementById('cancelBtn');
const formMessage = document.getElementById('formMessage');

// Current filtered/sorted data
let currentData = [...mahasiswaData];
let nextId = Math.max(...mahasiswaData.map(d => d.id), 0) + 1;

// Login Handler
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const password = passwordInput.value.trim();
    
    if (password === LOGIN_PASSWORD) {
        // Hide login screen
        loginScreen.classList.add('hidden');
        
        // Initialize current data
        currentData = [...mahasiswaData];
        
        // Show welcome animation
        welcomeAnimation.classList.remove('hidden');
        
        // Show main content immediately but behind animation
        mainContent.classList.remove('hidden');
        displayData(currentData);
        
        // Hide animation after 6 seconds (3s display + 3s fade)
        setTimeout(() => {
            welcomeAnimation.classList.add('hidden');
        }, 6000);
        
        // Clear password field
        passwordInput.value = '';
        loginError.textContent = '';
    } else {
        loginError.textContent = 'Password salah! Silakan coba lagi.';
        passwordInput.value = '';
        passwordInput.focus();
    }
});

// Logout Handler
logoutBtn.addEventListener('click', () => {
    mainContent.classList.add('hidden');
    loginScreen.classList.remove('hidden');
    welcomeAnimation.classList.add('hidden');
    currentData = [...mahasiswaData];
    searchInput.value = '';
    sortBy.value = 'nim';
    sortOrder.value = 'asc';
});

// Search Handler
searchBtn.addEventListener('click', () => {
    performSearch();
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        performSearch();
    }
});

// Reset Handler - Show all data
resetBtn.addEventListener('click', () => {
    searchInput.value = '';
    currentData = [...mahasiswaData];
    sortBy.value = 'nim';
    sortOrder.value = 'asc';
    displayData(currentData);
});

// Toggle Form Handler
toggleFormBtn.addEventListener('click', () => {
    addDataForm.classList.toggle('hidden');
    if (!addDataForm.classList.contains('hidden')) {
        toggleFormBtn.textContent = '- Tutup Form';
    } else {
        toggleFormBtn.textContent = '+ Tambah Data Baru';
        dataForm.reset();
        formMessage.textContent = '';
    }
});

// Cancel Form Handler
cancelBtn.addEventListener('click', () => {
    addDataForm.classList.add('hidden');
    toggleFormBtn.textContent = '+ Tambah Data Baru';
    dataForm.reset();
    formMessage.textContent = '';
});

// Add Data Form Handler
dataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const nim = document.getElementById('newNim').value.trim();
    const nama = document.getElementById('newNama').value.trim();
    const jurusan = document.getElementById('newJurusan').value.trim();
    const email = document.getElementById('newEmail').value.trim();
    
    // Validate
    if (!nim || !nama || !jurusan || !email) {
        formMessage.textContent = 'Semua field harus diisi!';
        formMessage.className = 'form-message error';
        return;
    }
    
    // Check if NIM already exists
    if (mahasiswaData.some(item => item.nim === nim)) {
        formMessage.textContent = 'NIM sudah terdaftar!';
        formMessage.className = 'form-message error';
        return;
    }
    
    // Add new data
    const newData = {
        id: nextId++,
        nim: nim,
        nama: nama,
        jurusan: jurusan,
        email: email
    };
    
    mahasiswaData.push(newData);
    currentData = [...mahasiswaData];
    
    // Reset form
    dataForm.reset();
    formMessage.textContent = 'Data berhasil ditambahkan!';
    formMessage.className = 'form-message success';
    
    // Update display
    displayData(currentData);
    
    // Hide form after 2 seconds
    setTimeout(() => {
        addDataForm.classList.add('hidden');
        toggleFormBtn.textContent = '+ Tambah Data Baru';
        formMessage.textContent = '';
    }, 2000);
});

function performSearch() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    
    if (searchTerm === '') {
        currentData = [...mahasiswaData];
    } else {
        currentData = mahasiswaData.filter(item => 
            item.nim.toLowerCase().includes(searchTerm) || 
            item.nama.toLowerCase().includes(searchTerm)
        );
    }
    
    displayData(currentData);
}

// Sort Handler
sortBtn.addEventListener('click', () => {
    performSort();
});

function performSort() {
    const sortField = sortBy.value;
    const order = sortOrder.value;
    
    currentData = [...currentData].sort((a, b) => {
        let comparison = 0;
        
        if (sortField === 'nim') {
            comparison = a.nim.localeCompare(b.nim);
        } else if (sortField === 'nama') {
            comparison = a.nama.localeCompare(b.nama);
        }
        
        return order === 'asc' ? comparison : -comparison;
    });
    
    displayData(currentData);
}

// Delete Handler - Make it global so it can be accessed from onclick
window.deleteData = function(id) {
    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
        // Remove from main data
        mahasiswaData = mahasiswaData.filter(item => item.id !== id);
        
        // Remove from current data
        currentData = currentData.filter(item => item.id !== id);
        
        displayData(currentData);
    }
}

// Display Data
function displayData(data) {
    if (!dataDisplay) {
        console.error('dataDisplay element not found');
        return;
    }
    
    if (data.length === 0) {
        dataDisplay.innerHTML = '<div class="no-data">Tidak ada data yang ditemukan</div>';
        return;
    }
    
    dataDisplay.innerHTML = data.map(item => `
        <div class="data-card">
            <h3>${item.nama}</h3>
            <p><span class="label">NIM:</span> ${item.nim}</p>
            <p><span class="label">Jurusan:</span> ${item.jurusan}</p>
            <p><span class="label">Email:</span> ${item.email}</p>
            <button class="delete-btn" onclick="deleteData(${item.id})">Hapus Data</button>
        </div>
    `).join('');
}

// Initialize - show login screen
if (loginScreen) {
    loginScreen.classList.remove('hidden');
}
if (mainContent) {
    mainContent.classList.add('hidden');
}
if (welcomeAnimation) {
    welcomeAnimation.classList.add('hidden');
}

// Make sure data is accessible
console.log('Data mahasiswa tersedia:', mahasiswaData.length, 'data');

