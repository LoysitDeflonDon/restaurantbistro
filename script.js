// ========== НАСТРОЙКИ JSONBIN ==========
// ЗАМЕНИ ЭТИ ТРИ СТРОКИ НА СВОИ ДАННЫЕ!
const MASTER_KEY = '$2a$10$LX5oylJg7sUo03LV/.UGeeeJB8Qbq3FHt1N8uL9zvuzCCW4wDxNX.';           // API ключ с jsonbin.io
const USERS_BIN_ID = '6a2f379cf5f4af5e29f221a6';        // ID бина с пользователями
const BOOKINGS_BIN_ID = '6a2f37b3da38895dfec0a14e';     // ID бина с бронями

let currentUser = null;
let menuData = [];

// ========== МЕНЮ (ВСТРОЕННОЕ) ==========
const defaultMenu = [
    { name: "Тартар из тунца с авокадо и манго", price: 890, category: "starters", img: "https://cdn.food.ru/unsigned/fit/640/480/ce/0/czM6Ly9tZWRpYS9waWN0dXJlcy9yZWNpcGVzLzE4Nzkvc3RlcHMvM0NrVDlrLmpwZw.jpg", desc: "Свежайший тунец, авокадо, манго" },
    { name: "Грибной суп-пюре с трюфельным маслом", price: 520, category: "starters", img: "https://img.povar.ru/mobile/89/d5/dd/72/gribnoi_sup-piure-773610.jpg", desc: "Белые грибы, сливки, трюфельное масло" },
    { name: "Креветки темпура с соусом чили-манго", price: 750, category: "starters", img: "https://menu2go.ru/images/food/485/485_684_20221206165345_5961.jpeg", desc: "Тигровые креветки, хрустящий кляр" },
    { name: "Салат с козьим сыром, свеклой и пеканом", price: 680, category: "salads", img: "https://i.pinimg.com/originals/29/a0/7b/29a07b89e080fd1bbdda4cede31ffbab.jpg?nii=t", desc: "Запечённая свекла, козий сыр" },
    { name: "Цезарь с креветками и беконом", price: 890, category: "salads", img: "https://menu2go.ru/images/food/640/640_20241007092820_6860.jpg", desc: "Тигровые креветки, хрустящий бекон" },
    { name: "Рибай на гриле с картофелем фондю", price: 2750, category: "main", img: "https://t3.ftcdn.net/jpg/06/26/13/04/360_F_626130430_CAjVlfKPjBafY5iAf6RoW68phPTbmDVj.jpg", desc: "Мраморная говядина, соус демиглас" },
    { name: "Паста с морепродуктами в сливочном соусе", price: 1150, category: "main", img: "https://www.makfa.ru/upload/resize_cache/iblock/e07/700_700_1/8xhlmm11uwoavtrmijjknx8edevvt9lp.jpg", desc: "Креветки, мидии, кальмары" },
    { name: "Утиная грудка с ягодным гастро", price: 1950, category: "main", img: "https://media.istockphoto.com/id/500786648/ru/фото/жареный-утиная-грудка.jpg?s=612x612&w=0&k=20&c=j1eonwiiOLnODsuhSmuiwypmXG8v3VnQnCWcwFJfMJQ=", desc: "Хрустящая кожа, соус из чёрной смородины" },
    { name: "Лосось с пюре из цветной капусты", price: 1650, category: "main", img: "https://t4.ftcdn.net/jpg/03/31/61/47/360_F_331614767_XWdY5567SqcVq2YZcmyss2IOWvaR8aKV.jpg", desc: "Норвежский лосось, нежное пюре" },
    { name: "Тирамису с солёной карамелью", price: 550, category: "desserts", img: "https://t3.ftcdn.net/jpg/02/72/14/70/360_F_272147052_x6ednpZ0RG93HLDH2VGBJyRr8qF6Wy4J.jpg", desc: "Классика с авторской карамелью" },
    { name: "Шоколадный фондан с пломбиром", price: 590, category: "desserts", img: "https://images.news.ru/2025/12/27/jX19HfB6OE3OB3OgIVVFMvI8aiVxlbi0yVVffjNC_780.png", desc: "Жидкая сердцевина, ванильное мороженое" },
    { name: "Облепиховый мохито", price: 380, category: "drinks", img: "https://buro345.ru/wp-content/uploads/2021/01/82a131b0-c0e9-4669-a4e4-e008a441aa8a-600x600.jpg", desc: "Освежающий, без алкоголя" }
];

// ========== РАБОТА С JSONBIN ==========
async function fetchBin(binId) {
    const res = await fetch(`https://api.jsonbin.io/v3/b/${binId}/latest`, {
        headers: { 'X-Master-Key': MASTER_KEY }
    });
    const data = await res.json();
    // Если бин содержит объект { "users": [] } или { "bookings": [] } — достаём массив
    if (data.record.users !== undefined) return data.record.users;
    if (data.record.bookings !== undefined) return data.record.bookings;
    return data.record;
}

async function updateBin(binId, arrayData) {
    // Определяем, какой это бин (users или bookings)
    let payload;
    if (binId === USERS_BIN_ID) {
        payload = { users: arrayData };
    } else {
        payload = { bookings: arrayData };
    }
    await fetch(`https://api.jsonbin.io/v3/b/${binId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-Master-Key': MASTER_KEY
        },
        body: JSON.stringify(payload)
    });
}

// ========== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ==========
function validatePhone(phone) {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length === 11;
}

function showModal(msg) {
    document.getElementById("modalMessage").innerText = msg;
    document.getElementById("successModal").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

function closeModal() {
    document.getElementById("successModal").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

function updateAuthUI() {
    const unauth = document.getElementById("unauthBlock");
    const authBlock = document.getElementById("authBlock");
    if (currentUser) {
        unauth.style.display = "none";
        authBlock.style.display = "block";
        document.getElementById("userName").innerText = currentUser.name;
        document.getElementById("userEmail").innerText = currentUser.email;
        document.getElementById("userPhone").innerText = currentUser.phone;
    } else {
        unauth.style.display = "block";
        authBlock.style.display = "none";
    }
}

function renderMenu(filter = "all") {
    const container = document.getElementById("menuList");
    if (!container) return;
    const sourceMenu = menuData.length ? menuData : defaultMenu;
    const filtered = filter === "all" ? sourceMenu : sourceMenu.filter(item => item.category === filter);
    container.innerHTML = filtered.map(item => `
        <div class="menu-item">
            <img src="${item.img}" class="menu-img" loading="lazy" onerror="this.src='https://placehold.co/600x400?text=No+Image'">
            <div class="menu-info">
                <div class="menu-header"><h3>${item.name}</h3><span class="menu-price">${item.price}₽</span></div>
                <p class="menu-desc">${item.desc}</p>
            </div>
        </div>
    `).join("");
}

// ========== РЕГИСТРАЦИЯ ==========
async function register(name, email, phone, password) {
    const users = await fetchBin(USERS_BIN_ID);
    if (users.find(u => u.email === email)) throw new Error("Email уже существует");
    if (users.find(u => u.phone === phone)) throw new Error("Телефон уже используется");
    
    const newUser = {
        id: Date.now(),
        name, email, phone,
        password: password
    };
    users.push(newUser);
    await updateBin(USERS_BIN_ID, users);
    return newUser;
}

// ========== ЛОГИН ==========
async function login(email, password) {
    const users = await fetchBin(USERS_BIN_ID);
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) throw new Error("Неверный email или пароль");
    return user;
}

// ========== БРОНИРОВАНИЕ ==========
async function addBooking(userId, name, phone, date, time, guests) {
    const bookings = await fetchBin(BOOKINGS_BIN_ID);
    bookings.push({
        id: Date.now(),
        userId, name, phone, date, time, guests,
        createdAt: new Date().toISOString()
    });
    await updateBin(BOOKINGS_BIN_ID, bookings);
}

// ========== ИНИЦИАЛИЗАЦИЯ ==========
document.addEventListener("DOMContentLoaded", async () => {
    renderMenu();
    
    const savedUser = localStorage.getItem('bistro_current_user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateAuthUI();
    }
    
    // Навигация
    document.querySelectorAll(".nav-item").forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const pageId = link.dataset.page;
            document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
            document.getElementById(pageId).classList.add("active");
            document.querySelectorAll(".nav-item").forEach(n => n.classList.remove("active"));
            link.classList.add("active");
        });
    });
    
    // Категории меню
    document.querySelectorAll(".category-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".category-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            renderMenu(btn.dataset.category);
        });
    });
    
    // Переключение табов
    document.querySelectorAll(".auth-tab-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const tab = btn.dataset.tab;
            document.querySelectorAll(".auth-tab-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            document.querySelectorAll(".auth-form").forEach(f => f.classList.remove("active"));
            document.getElementById(`${tab}Form`).classList.add("active");
        });
    });
    
    // ЛОГИН
    document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value;
        let ok = true;
        if (!email) { document.getElementById("loginEmailError").style.display="block"; ok=false; }
        else document.getElementById("loginEmailError").style.display="none";
        if (password.length<6) { document.getElementById("loginPassError").style.display="block"; ok=false; }
        else document.getElementById("loginPassError").style.display="none";
        if(!ok) return;
        try {
            const user = await login(email, password);
            currentUser = user;
            localStorage.setItem('bistro_current_user', JSON.stringify(user));
            updateAuthUI();
            showModal("Добро пожаловать!");
            document.getElementById("loginEmail").value="";
            document.getElementById("loginPassword").value="";
        } catch(err) { showModal("Ошибка: "+err.message); }
    });
    
    // РЕГИСТРАЦИЯ
    document.getElementById("registerForm")?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const name = document.getElementById("regName").value.trim();
        const email = document.getElementById("regEmail").value.trim();
        const phone = document.getElementById("regPhone").value.replace(/\D/g,'');
        const password = document.getElementById("regPassword").value;
        let ok=true;
        if(name.length<2){ document.getElementById("regNameError").style.display="block"; ok=false; } 
        else document.getElementById("regNameError").style.display="none";
        if(!email){ document.getElementById("regEmailError").style.display="block"; ok=false; } 
        else document.getElementById("regEmailError").style.display="none";
        if(!validatePhone(phone)){ document.getElementById("regPhoneError").style.display="block"; ok=false; } 
        else document.getElementById("regPhoneError").style.display="none";
        if(password.length<6){ document.getElementById("regPassError").style.display="block"; ok=false; } 
        else document.getElementById("regPassError").style.display="none";
        if(!ok) return;
        try {
            await register(name, email, phone, password);
            showModal("Регистрация успешна! Теперь войдите.");
            document.getElementById("regName").value="";
            document.getElementById("regEmail").value="";
            document.getElementById("regPhone").value="";
            document.getElementById("regPassword").value="";
            document.querySelector(".auth-tab-btn[data-tab='login']").click();
        } catch(err) { showModal("Ошибка: "+err.message); }
    });
    
    // БРОНИРОВАНИЕ
    document.getElementById("bookingForm")?.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (!currentUser) {
            showModal("Сначала войдите в аккаунт!");
            return;
        }
        const name = document.getElementById("bookName").value.trim();
        let phone = document.getElementById("bookPhone").value.replace(/\D/g,'');
        const date = document.getElementById("bookDate").value;
        const time = document.getElementById("bookTime").value;
        const guests = document.getElementById("bookGuests").value;
        let ok=true;
        if(name.length<2){ document.getElementById("bookNameError").style.display="block"; ok=false; } 
        else document.getElementById("bookNameError").style.display="none";
        if(!validatePhone(phone)){ document.getElementById("bookPhoneError").style.display="block"; ok=false; } 
        else document.getElementById("bookPhoneError").style.display="none";
        if(!date){ document.getElementById("bookDateError").style.display="block"; ok=false; } 
        else document.getElementById("bookDateError").style.display="none";
        if(!time){ document.getElementById("bookTimeError").style.display="block"; ok=false; } 
        else document.getElementById("bookTimeError").style.display="none";
        if(!ok) return;
        try {
            await addBooking(currentUser.id, name, phone, date, time, guests);
            showModal("Бронирование отправлено! Мы перезвоним.");
            document.getElementById("bookName").value="";
            document.getElementById("bookPhone").value="";
            document.getElementById("bookDate").value="";
            document.getElementById("bookTime").value="";
        } catch(err) { showModal("Ошибка: "+err.message); }
    });
    
    // ВЫХОД
    document.getElementById("logoutBtn")?.addEventListener("click", () => {
        currentUser = null;
        localStorage.removeItem('bistro_current_user');
        updateAuthUI();
        showModal("Вы вышли из аккаунта");
    });
    
    window.closeModal = closeModal;
    window.navigateTo = (page) => {
        document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
        document.getElementById(page).classList.add("active");
        document.querySelectorAll(".nav-item").forEach(n => n.classList.remove("active"));
        document.querySelector(`.nav-item[data-page="${page}"]`).classList.add("active");
    };
});
