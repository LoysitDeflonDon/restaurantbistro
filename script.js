// ========== НАВИГАЦИЯ ==========
const navItems = document.querySelectorAll('.nav-item');
const pages = document.querySelectorAll('.page');

function navigateTo(pageId) {
    // Скрываем все страницы
    pages.forEach(page => {
        page.classList.remove('active');
    });
    
    // Показываем нужную
    const activePage = document.getElementById(pageId);
    if (activePage) {
        activePage.classList.add('active');
    }
    
    // Обновляем активную кнопку в меню
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.dataset.page === pageId) {
            item.classList.add('active');
        }
    });
    
    // Скроллим наверх
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Вешаем обработчики на кнопки навигации
navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const pageId = item.dataset.page;
        if (pageId) {
            navigateTo(pageId);
        }
    });
});

// Делаем функцию глобальной (для onclick в HTML)
window.navigateTo = navigateTo;

// ========== ФИЛЬТРАЦИЯ МЕНЮ ==========
const categoryBtns = document.querySelectorAll('.category-btn');
const menuItems = document.querySelectorAll('.menu-item');

if (categoryBtns.length) {
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // Убираем активный класс у всех кнопок
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const category = btn.dataset.category;
            
            menuItems.forEach(item => {
                if (category === 'all' || item.dataset.category === category) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// ========== ФОРМА БРОНИРОВАНИЯ ==========
const bookingForm = document.getElementById('bookingForm');
const modal = document.getElementById('successModal');

if (bookingForm) {
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    const dateInput = document.getElementById('date');
    const timeInput = document.getElementById('time');
    
    const nameError = document.getElementById('nameError');
    const phoneError = document.getElementById('phoneError');
    const dateError = document.getElementById('dateError');
    const timeError = document.getElementById('timeError');
    
    // Функции валидации
    function validateName() {
        const name = nameInput.value.trim();
        if (name.length < 2) {
            nameInput.classList.add('input-error');
            nameError.style.display = 'block';
            return false;
        }
        nameInput.classList.remove('input-error');
        nameError.style.display = 'none';
        return true;
    }
    
    function validatePhone() {
        const phone = phoneInput.value.trim();
        const digits = phone.replace(/\D/g, '');
        if (digits.length < 10 || digits.length > 12) {
            phoneInput.classList.add('input-error');
            phoneError.style.display = 'block';
            return false;
        }
        phoneInput.classList.remove('input-error');
        phoneError.style.display = 'none';
        return true;
    }
    
    function validateDate() {
        if (!dateInput.value) {
            dateInput.classList.add('input-error');
            dateError.style.display = 'block';
            return false;
        }
        dateInput.classList.remove('input-error');
        dateError.style.display = 'none';
        return true;
    }
    
    function validateTime() {
        if (!timeInput.value) {
            timeInput.classList.add('input-error');
            timeError.style.display = 'block';
            return false;
        }
        const [hours] = timeInput.value.split(':').map(Number);
        if (hours < 10 || hours > 23) {
            timeInput.classList.add('input-error');
            timeError.style.display = 'block';
            return false;
        }
        timeInput.classList.remove('input-error');
        timeError.style.display = 'none';
        return true;
    }
    
    // Вешаем валидацию на события
    nameInput.addEventListener('input', validateName);
    phoneInput.addEventListener('input', validatePhone);
    dateInput.addEventListener('change', validateDate);
    timeInput.addEventListener('change', validateTime);
    
    // Отправка формы
    bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!validateName() || !validatePhone() || !validateDate() || !validateTime()) return;
        
        const bookingData = {
            name: nameInput.value.trim(),
            phone: phoneInput.value.trim(),
            date: dateInput.value,
            time: timeInput.value,
            guests: document.getElementById('guests').value
        };
        
        try {
            const response = await fetch('http://localhost:3000/api/book', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookingData)
            });
            
            if (response.ok) {
                modal.style.display = 'flex';
                bookingForm.reset();
                setTimeout(() => {
                    modal.style.display = 'none';
                }, 4000);
            } else {
                alert('Ошибка при бронировании');
            }
        } catch (err) {
            alert('Сервер не запущен');
        }
    });
}

// ========== МОДАЛЬНОЕ ОКНО ==========
function closeModal() {
    if (modal) {
        modal.style.display = 'none';
    }
}
window.closeModal = closeModal;

// Закрытие по клику вне модалки
window.onclick = (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
};

// ========== ПРИ ЗАГРУЗКЕ ==========
document.addEventListener('DOMContentLoaded', () => {
    // Проверяем, есть ли активная страница, если нет — показываем home
    const activePage = document.querySelector('.page.active');
    if (!activePage) {
        navigateTo('home');
    }
    
    // Устанавливаем минимальную дату в форме
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }
});

// ========== ДЛЯ КНОПКИ FAB (плавающая кнопка) ==========
const fabBook = document.querySelector('.fab-book');
if (fabBook) {
    fabBook.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        navigateTo('contact');
        setTimeout(() => {
            const nameField = document.getElementById('name');
            if (nameField) nameField.focus();
        }, 100);
    });
}
