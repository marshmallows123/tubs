// Дожидаемся загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    const bubbleContainer = document.getElementById('bubbleContainer');
    if (!bubbleContainer) {
        console.error('Элемент #bubbleContainer не найден в HTML!');
        return;
    }

    let lastScrollY = window.scrollY;
    let bubbleTimeout = null;

    // Функция создания пузыря ТОЛЬКО по бокам (лево 0-20%, право 80-100%)
    function createBubble() {
        if (document.querySelectorAll('.bubble').length > 15) return;

        const bubble = document.createElement('div');
        const size = Math.floor(Math.random() * (55 - 20 + 1) + 20); // 20-55px

        const screenWidth = window.innerWidth;
        const leftZoneMax = screenWidth * 0.1;   // 0-20% от левого края
        const rightZoneMin = screenWidth * 0.9;  // 80-100% от левого края

        const isLeftSide = Math.random() < 0.5;   // 50% лево, 50% право

        let posX;
        if (isLeftSide) {
            posX = Math.random() * leftZoneMax;
        } else {
            posX = rightZoneMin + Math.random() * (screenWidth - rightZoneMin);
        }
        // защита от выхода за правый край
        posX = Math.min(posX, screenWidth - size);
        // дополнительно: чтобы пузырь не уходил за левый край
        posX = Math.max(posX, 0);

        const duration = Math.random() * 3 + 3;   // 3-6 секунд
        const delay = Math.random() * 0.6;

        bubble.classList.add('bubble');
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.left = `${posX}px`;
        bubble.style.animationDuration = `${duration}s`;
        bubble.style.animationDelay = `${delay}s`;

        bubbleContainer.appendChild(bubble);

        bubble.addEventListener('animationend', () => {
            bubble.remove();
        });

        bubble.addEventListener('click', () => {
            bubble.style.transition = 'transform 0.1s ease';
            bubble.style.transform = 'scale(0)';
            setTimeout(() => bubble.remove(), 100);
        });
    }

    function spawnBubblesOnScroll(intensity = 2) {
        let count = Math.min(intensity + 1, 6);
        for (let i = 0; i < count; i++) {
            setTimeout(() => createBubble(), i * 70);
        }
    }

    // Обработчик скролла
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        const delta = Math.abs(currentScroll - lastScrollY);

        if (delta > 12) {
            let intensity = Math.floor(delta / 20);
            intensity = Math.min(intensity, 5);
            spawnBubblesOnScroll(intensity);
        }

        lastScrollY = currentScroll;

        if (bubbleTimeout) clearTimeout(bubbleTimeout);
        bubbleTimeout = setTimeout(() => {
            if (Math.random() > 0.6) createBubble();
        }, 200);
    });

    // Фоновые пузыри каждые 3 секунды
    setInterval(() => {
        if (Math.random() > 0.7) createBubble();
    }, 3000);

    // Приветственные пузыри при загрузке
    for (let i = 0; i <= 12; i++) {
        setTimeout(() => createBubble(), i * 150);
    }

    // Пузыри при наведении на карточки
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => createBubble());
    });

    // Плавная навигация по якорям
    document.querySelectorAll('.nav-list a, .btn-group a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const target = document.getElementById(targetId);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    for (let i = 0; i < 4; i++) {
                        setTimeout(() => createBubble(), i * 50);
                    }
                }
            }
        });
    });
});