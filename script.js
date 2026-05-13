// ========== НАВИГАЦИЯ (ФИКС ДЛЯ ТЕЛЕФОНОВ) ==========
const navItems = document.querySelectorAll('.nav-item');
const pages = document.querySelectorAll('.page');

function navigateTo(pageId) {
    console.log('Переход на:', pageId); // Для отладки
    
    // Скрываем все страницы
    pages.forEach(page => {
        page.classList.remove('active');
    });
    
    // Показываем нужную
    const activePage = document.getElementById(pageId);
    if (activePage) {
        activePage.classList.add('active');
    }
    
    // Обновляем активную кнопку
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.dataset.page === pageId) {
            item.classList.add('active');
        }
    });
    
    // Скроллим наверх (обязательно через setTimeout для телефонов)
    setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 50);
}

// ФИКС ДЛЯ ТЕЛЕФОНОВ: используем touchstart и click
navItems.forEach(item => {
    // Для телефонов
    item.addEventListener('touchstart', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const pageId = item.dataset.page;
        if (pageId) {
            navigateTo(pageId);
        }
    });
    
    // Для компа (оставляем)
    item.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const pageId = item.dataset.page;
        if (pageId) {
            navigateTo(pageId);
        }
    });
});

// Делаем функцию глобальной
window.navigateTo = navigateTo;

// ========== ФИЛЬТРАЦИЯ МЕНЮ ==========
const categoryBtns = document.querySelectorAll('.category-btn');
const menuItems = document.querySelectorAll('.menu-item');

if (categoryBtns.length) {
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
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
        
        // Для телефонов
        btn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            e.stopPropagation();
            btn.click();
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
    
    nameInput.addEventListener('input', validateName);
    phoneInput.addEventListener('input', validatePhone);
    dateInput.addEventListener('change', validateDate);
    timeInput.addEventListener('change', validateTime);
    
    bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!validateName() || !validatePhone() || !validateDate() || !validateTime()) return;
        
        // Для телефона: показываем индикатор загрузки
        const submitBtn = bookingForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
        submitBtn.disabled = true;
        
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
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

// ========== МОДАЛКА ==========
function closeModal() {
    if (modal) {
        modal.style.display = 'none';
    }
}
window.closeModal = closeModal;

window.onclick = (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
};

// ========== ПРИ ЗАГРУЗКЕ ==========
document.addEventListener('DOMContentLoaded', () => {
    const activePage = document.querySelector('.page.active');
    if (!activePage) {
        navigateTo('home');
    }
    
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }
});

// ========== ПЛАВАЮЩАЯ КНОПКА ==========
const fabBook = document.querySelector('.fab-book');
if (fabBook) {
    const handleFab = (e) => {
        e.preventDefault();
        e.stopPropagation();
        navigateTo('contact');
        setTimeout(() => {
            const nameField = document.getElementById('name');
            if (nameField) nameField.focus();
        }, 100);
    };
    
    fabBook.addEventListener('click', handleFab);
    fabBook.addEventListener('touchstart', handleFab);
}
