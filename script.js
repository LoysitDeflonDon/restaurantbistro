const navItems = document.querySelectorAll('.nav-item');
const pages = document.querySelectorAll('.page');

function navigateTo(pageId) {
    pages.forEach(page => {
        page.classList.remove('active');
    });
    
    const activePage = document.getElementById(pageId);
    if (activePage) {
        activePage.classList.add('active');
    }
    
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.dataset.page === pageId) {
            item.classList.add('active');
        }
    });
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const pageId = item.dataset.page;
        navigateTo(pageId);
    });
});

window.navigateTo = navigateTo;

// Фильтрация меню
const categoryBtns = document.querySelectorAll('.category-btn');
const menuItems = document.querySelectorAll('.menu-item');

if (categoryBtns.length) {
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const category = btn.dataset.category;
            
            menuItems.forEach(item => {
                if (category === 'all' || item.dataset.category === category) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// Валидация формы
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
    
    const today = new Date().toISOString().split('T')[0];
    if (dateInput) {
        dateInput.setAttribute('min', today);
    }
    
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
        if (digits.length < 10 || digits.length > 11) {
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
        if (hours < 12 || hours > 23) {
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
    
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const isNameValid = validateName();
        const isPhoneValid = validatePhone();
        const isDateValid = validateDate();
        const isTimeValid = validateTime();
        
        if (isNameValid && isPhoneValid && isDateValid && isTimeValid) {
            modal.style.display = 'flex';
            bookingForm.reset();
            
            setTimeout(() => {
                modal.style.display = 'none';
            }, 3000);
        }
    });
}

// Модальное окно
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