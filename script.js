// ===== CONFIGURAÇÃO DOS BARBEIROS =====

const BARBEIROS_CONFIG = {
  barbeiro1: {
    nome: "Eduardo",
    whatsapp: "5515991932175",
    instagram: "https://www.instagram.com/de_lara_barber/",
    instagramHandle: "@de_lara_barber",
    foto: "https://ui-avatars.com/api/?name=Eduardo&background=2d2d2d&color=fff&size=300",
    trabalhos: [
      "assets/work-1.jpg",
      "assets/work-2.jpg",
      "assets/work-3.jpg",
      "assets/work-4.jpg",
      "assets/work-5.jpg"
    ]
  },
  barbeiro2: {
    nome: "Caique",
    whatsapp: "5515999999999",
    instagram: "https://www.instagram.com/caique_de_lara/",
    instagramHandle: "@caique_de_lara",
    foto: "https://ui-avatars.com/api/?name=Caique&background=4a4a4a&color=fff&size=300",
    trabalhos: [
      "assets/work-1.jpg",
      "assets/work-2.jpg",
      "assets/work-3.jpg",
      "assets/work-4.jpg",
      "assets/work-5.jpg"
    ]
  },
  barbeiro3: {
    nome: "Jorge",
    whatsapp: "5515999999999",
    instagram: "https://www.instagram.com/barbeirogeorge/",
    instagramHandle: "@barbeirogeorge",
    foto: "https://ui-avatars.com/api/?name=Jorge&background=6c757d&color=fff&size=300",
    trabalhos: [
      "assets/work-1.jpg",
      "assets/work-2.jpg",
      "assets/work-3.jpg",
      "assets/work-4.jpg",
      "assets/work-5.jpg"
    ]
  }
};

// Variáveis globais
let currentBarberKey = null;
let currentBarber = null;
let bookingData = {
    service: null,
    price: null,
    date: null,
    time: null,
    clientName: null,
    clientPhone: null
};
let currentCalendarDate = new Date();
let carouselIndex = 0;

// Horários disponíveis
const availableTimeSlots = [
    "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"
];

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Fechar modal de barbeiro ao clicar fora
    const barberModal = document.getElementById('barber-modal');
    if (barberModal) {
        barberModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeBarberModal();
            }
        });
    }
    
    // Fechar modal de agendamento ao clicar fora
    const bookingModal = document.getElementById('booking-modal');
    if (bookingModal) {
        bookingModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeBookingModal();
            }
        });
    }
    
    // Inicializar máscara de telefone
    initPhoneMask();
});

// ===== FUNÇÕES DO MODAL DE PERFIL DO BARBEIRO =====

function openBarberProfile(barberKey) {
    currentBarberKey = barberKey;
    currentBarber = BARBEIROS_CONFIG[barberKey];

    if (!currentBarber) {
        showToast('Erro: Barbeiro não encontrado', 'error');
        return;
    }

    document.getElementById('barber-modal-img').src = currentBarber.foto;
    document.getElementById('barber-modal-name').textContent = currentBarber.nome;
    document.getElementById('barber-modal-instagram').href = currentBarber.instagram;
    document.getElementById('barber-modal-instagram-text').textContent = currentBarber.instagramHandle;

    carouselIndex = 0;
    document.getElementById('carousel-section').classList.remove('active');

    document.getElementById('barber-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeBarberModal() {
    document.getElementById('barber-modal').classList.remove('active');
    document.body.style.overflow = 'auto';
    currentBarberKey = null;
    currentBarber = null;
}

function toggleCarousel() {
    const carouselSection = document.getElementById('carousel-section');
    carouselSection.classList.toggle('active');
    
    if (carouselSection.classList.contains('active')) {
        initCarousel();
    }
}

// ===== FUNÇÕES DO CARROSSEL =====

function initCarousel() {
    const track = document.getElementById('carousel-track');
    const container = document.querySelector('.carousel-container');
    const nav = document.getElementById('carousel-nav');
    
    track.innerHTML = '';
    nav.innerHTML = '';
    
    currentBarber.trabalhos.forEach((foto, index) => {
        const slide = document.createElement('div');
        slide.className = 'carousel-slide';
        slide.innerHTML = `<img src="${foto}" alt="Trabalho ${index + 1}" onerror="this.src='assets/logo.png'">`;
        track.appendChild(slide);
        
        const navBtn = document.createElement('button');
        navBtn.className = index === 0 ? 'active' : '';
        navBtn.onclick = () => goToSlide(index);
        nav.appendChild(navBtn);
    });
    
    carouselIndex = 0;
    updateCarousel();
    
    if (container._touchAbort) container._touchAbort.abort();
    container._touchAbort = new AbortController();
    const { signal } = container._touchAbort;

    let touchStartX = 0;
    let touchEndX = 0;
    
    container.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true, signal });
    
    container.addEventListener('touchmove', function(e) {
        touchEndX = e.changedTouches[0].screenX;
    }, { passive: true, signal });
    
    container.addEventListener('touchend', function() {
        const delta = touchStartX - touchEndX;
        if (Math.abs(delta) > 50) {
            if (delta > 0 && carouselIndex < currentBarber.trabalhos.length - 1) {
                goToSlide(carouselIndex + 1);
            } else if (delta < 0 && carouselIndex > 0) {
                goToSlide(carouselIndex - 1);
            }
        }
    }, { passive: true, signal });
}

function goToSlide(index) {
    carouselIndex = index;
    updateCarousel();
}

function updateCarousel() {
    const track = document.getElementById('carousel-track');
    const navBtns = document.querySelectorAll('.carousel-nav button');
    
    track.style.transform = `translateX(-${carouselIndex * 100}%)`;
    
    navBtns.forEach((btn, index) => {
        btn.classList.toggle('active', index === carouselIndex);
    });
}

// ===== FUNÇÕES DO MODAL DE AGENDAMENTO =====

function openBookingModal() {
    bookingData = {
        service: null,
        price: null,
        date: null,
        time: null,
        clientName: null,
        clientPhone: null
    };
    
    document.getElementById('booking-title').textContent = `Agendar com ${currentBarber.nome}`;
    showBookingScreen(1);
    
    document.getElementById('booking-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeBookingModal() {
    document.getElementById('booking-modal').classList.remove('active');
    document.body.style.overflow = 'auto';
    
    bookingData = {
        service: null,
        price: null,
        date: null,
        time: null,
        clientName: null,
        clientPhone: null
    };
}

function showBookingScreen(screenNumber) {
    for (let i = 1; i <= 5; i++) {
        const screen = document.getElementById(`booking-screen-${i}`);
        if (screen) {
            screen.classList.add('hidden');
        }
    }
    
    const targetScreen = document.getElementById(`booking-screen-${screenNumber}`);
    if (targetScreen) {
        targetScreen.classList.remove('hidden');
    }
    
    renderBackButton(screenNumber);
    renderStepper(screenNumber);
    
    if (screenNumber === 2) {
        initCalendar();
    } else if (screenNumber === 3) {
        initTimeSlots();
    }
}

function renderBackButton(screenNumber) {
    const bookingBody = document.querySelector('.booking-body');
    const existingBtn = bookingBody.querySelector('.booking-back-btn');
    if (existingBtn) existingBtn.remove();
    
    if (screenNumber >= 2 && screenNumber <= 4) {
        const backBtn = document.createElement('button');
        backBtn.className = 'booking-back-btn';
        backBtn.innerHTML = '← Voltar';
        backBtn.onclick = () => showBookingScreen(screenNumber - 1);
        
        const progressContainer = document.getElementById('booking-progress-container');
        if (progressContainer && progressContainer.nextSibling) {
            bookingBody.insertBefore(backBtn, progressContainer.nextSibling);
        } else {
            bookingBody.insertBefore(backBtn, bookingBody.firstChild);
        }
    }
}

function renderStepper(screenNumber) {
    const container = document.getElementById('booking-progress-container');
    if (!container) return;
    container.innerHTML = '';
    
    if (screenNumber < 1 || screenNumber > 4) return;
    
    const steps = [
        { num: 1, label: 'Serviço' },
        { num: 2, label: 'Data' },
        { num: 3, label: 'Horário' },
        { num: 4, label: 'Dados' }
    ];
    
    const stepper = document.createElement('div');
    stepper.className = 'booking-progress';
    
    steps.forEach((step, index) => {
        const stepEl = document.createElement('div');
        stepEl.className = 'progress-step';
        if (step.num === screenNumber) {
            stepEl.classList.add('active');
        } else if (step.num < screenNumber) {
            stepEl.classList.add('completed');
        }
        
        const circle = document.createElement('div');
        circle.className = 'step-circle';
        circle.textContent = step.num < screenNumber ? '✓' : step.num;
        
        const label = document.createElement('div');
        label.className = 'step-label';
        label.textContent = step.label;
        
        stepEl.appendChild(circle);
        stepEl.appendChild(label);
        stepper.appendChild(stepEl);
        
        if (index < steps.length - 1) {
            const line = document.createElement('div');
            line.className = 'progress-line';
            if (step.num < screenNumber) {
                line.classList.add('completed');
            }
            stepper.appendChild(line);
        }
    });
    
    container.appendChild(stepper);
}

function selectService(serviceName, price) {
    bookingData.service = serviceName;
    bookingData.price = price;
    showBookingScreen(2);
}

// ===== FUNÇÕES DO CALENDÁRIO =====

function initCalendar() {
    currentCalendarDate = new Date();
    renderCalendar();
}

function renderCalendar() {
    const calendarGrid = document.getElementById('calendar-grid');
    const currentMonthEl = document.getElementById('current-month');
    
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();
    
    const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
                        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    currentMonthEl.textContent = `${monthNames[month]} ${year}`;
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    calendarGrid.innerHTML = '';
    
    const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    weekDays.forEach(day => {
        const dayEl = document.createElement('div');
        dayEl.style.fontWeight = '600';
        dayEl.style.color = '#4a4a4a';
        dayEl.style.fontSize = '14px';
        dayEl.textContent = day;
        calendarGrid.appendChild(dayEl);
    });
    
    for (let i = 0; i < firstDay; i++) {
        const emptyDay = document.createElement('div');
        calendarGrid.appendChild(emptyDay);
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dayEl = document.createElement('button');
        
        const isPast = date < today;
        
        dayEl.className = 'calendar-day';
        if (isPast) {
            dayEl.classList.add('disabled');
        }
        dayEl.textContent = day;
        
        if (!isPast) {
            dayEl.onclick = () => selectDate(date);
        }
        
        calendarGrid.appendChild(dayEl);
    }
}

function changeMonth(delta) {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() + delta);
    renderCalendar();
}

function selectDate(date) {
    bookingData.date = date;
    showBookingScreen(3);
    initTimeSlots();
}

// ===== FUNÇÕES DE HORÁRIOS =====

function initTimeSlots() {
    const timeGrid = document.getElementById('time-grid');
    timeGrid.innerHTML = '';
    
    availableTimeSlots.forEach(time => {
        const timeBtn = document.createElement('button');
        timeBtn.className = 'time-slot';
        timeBtn.textContent = time;
        timeBtn.onclick = () => selectTime(time);
        timeGrid.appendChild(timeBtn);
    });
}

function selectTime(time) {
    bookingData.time = time;
    showBookingScreen(4);
}

// ===== FUNÇÕES DE CONFIRMAÇÃO =====

function confirmBooking() {
    const clientName = document.getElementById('client-name').value;
    const clientPhone = document.getElementById('client-phone').value;
    
    if (!clientName || !clientPhone) {
        showToast('Por favor, preencha todos os campos', 'error');
        return;
    }
    
    bookingData.clientName = clientName;
    bookingData.clientPhone = clientPhone;
    
    const formattedDateBR = bookingData.date.toLocaleDateString('pt-BR');
    
    // Montar mensagem para WhatsApp
    const message = `Olá! Gostaria de agendar um horário:\n\n` +
        `👤 Cliente: ${bookingData.clientName}\n` +
        `📞 Telefone: ${bookingData.clientPhone}\n` +
        `✂️ Serviço: ${bookingData.service}\n` +
        `📅 Data: ${formattedDateBR}\n` +
        `⏰ Horário: ${bookingData.time}\n` +
        `💰 Valor: R$ ${bookingData.price}`;
    
    // Abrir WhatsApp direto com a mensagem
    const whatsappUrl = `https://wa.me/${currentBarber.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    // Mostrar feedback visual
    showToast('Redirecionando para WhatsApp...', 'success');
    
    // Fechar modal após breve intervalo
    setTimeout(() => {
        closeBookingModal();
    }, 1500);
}

// ===== TOAST NOTIFICATION =====

function showToast(message, type = '') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.className = 'toast';
    if (type) toast.classList.add(type);
    
    void toast.offsetWidth;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

// ===== MÁSCARA DE TELEFONE =====

function initPhoneMask() {
    const phoneInput = document.getElementById('client-phone');
    if (!phoneInput) return;
    
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        value = value.slice(0, 11);
        
        if (value.length > 7) {
            value = `(${value.slice(0,2)}) ${value.slice(2,7)}-${value.slice(7)}`;
        } else if (value.length > 2) {
            value = `(${value.slice(0,2)}) ${value.slice(2)}`;
        } else if (value.length > 0) {
            value = `(${value}`;
        }
        
        e.target.value = value;
    });
}

// ===== FECHAR MODAIS COM ESC =====

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeBarberModal();
        closeBookingModal();
    }
});