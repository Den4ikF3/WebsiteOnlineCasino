// script.js

document.addEventListener("DOMContentLoaded", function() {

    // --- НАЛАШТУВАННЯ: Знаходимо ключові елементи ---
    const header = document.querySelector('header');
    const allSmoothLinks = document.querySelectorAll('a[href^="#"]');
    
    // Модальні вікна
    const modalOverlay = document.querySelector("#generic-modal-overlay");
    const modalContent = document.querySelector("#modal-dynamic-content");
    const modalCloseBtn = document.querySelector("#generic-modal-close");

    // --- ЧАСТИНА 1 & 3: Плавна прокрутка (для шапки та кнопок Hero) ---
    allSmoothLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            const href = link.getAttribute('href');
            // Перевірка, чи це не просто кнопка-заглушка
            if (href.startsWith("#") && href.length > 1) { 
                event.preventDefault();
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    const headerHeight = header.offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY;
                    const offsetPosition = targetPosition - headerHeight - 20;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // --- ЧАСТИНА 2 & 7: Модальні вікна (Логін, Реєстрація, Бонуси, ...) ---
    
    // Базові функції модального вікна
    function openModal(contentHTML) {
        modalContent.innerHTML = contentHTML;
        modalOverlay.classList.add("active");
        document.body.classList.add("modal-open");
    }
    function closeModal() {
        modalOverlay.classList.remove("active");
        document.body.classList.remove("modal-open");
    }
    modalCloseBtn.addEventListener("click", closeModal);
    modalOverlay.addEventListener("click", (e) => { if (e.target === modalOverlay) closeModal(); });

    // HTML-контент для різних модальних вікон
    const loginFormHTML = `
        <h2>Login</h2>
        <form class="modal-form">
            <label for="email">Email</label>
            <input type="email" id="email" placeholder="your@email.com">
            <label for="pass">Password</label>
            <input type="password" id="pass" placeholder="Password">
            <label>Captcha: 2 + 2 = ?</label>
            <input type="text" placeholder="Your answer">
            <button type="submit" class="btn btn-gold">Login</button>
        </form>`;
    
    const registerFormHTML = `
        <h2>Register</h2>
        <form class="modal-form">
            <label for="user">Username</label>
            <input type="text" id="user" placeholder="Choose a username">
            <label for="email">Email</label>
            <input type="email" id="email" placeholder="your@email.com">
            <label for="pass">Password</label>
            <input type="password" id="pass" placeholder="Create password">
            <label for="pass2">Confirm Password</label>
            <input type="password" id="pass2" placeholder="Confirm password">
            <label>Captcha: 3 + 4 = ?</label>
            <input type="text" placeholder="Your answer">
            <button type="submit" class="btn btn-gold">Register</button>
        </form>`;

    const vipModalHTML = `
        <h2><i class="fas fa-gem gold-icon"></i> VIP Lounge</h2>
        <p>Access exclusive high-stakes games, available only to our VIP members.</p>
        <div class="game-grid" style="grid-template-columns: 1fr 1fr;">
            <div class="game-card" data-category="roulette" data-game-name="VIP Roulette"><div class="game-image-wrap"><img src="images/roulett.jfif" alt="VIP Roulette"></div><div class="game-info"><h4>VIP Roulette (High Stakes)</h4><p class="game-category">VIP</p></div></div>
            <div class="game-card" data-category="blackjack" data-game-name="Luxury Blackjack"><div class="game-image-wrap"><img src="images/blackjack.jfif" alt="Luxury Blackjack"></div><div class="game-info"><h4>Luxury Blackjack (High Stakes)</h4><p class="game-category">VIP</p></div></div>
        </div>`;

    const paymentFormHTML = `
        <h2>Welcome Bonus</h2>
        <p>Make your first deposit to claim your 200% bonus + 200 Free Spins!</p>
        <form class="modal-form">
            <label for="card">Card Number</label>
            <input type="text" id="card" placeholder="0000 0000 0000 0000">
            <label for="amount">Deposit Amount ($)</label>
            <input type="number" id="amount" placeholder="50">
            <button type="submit" class="btn btn-gold">Deposit Now</button>
        </form>`;

    const vipPerksHTML = `
        <h2><i class="fas fa-trophy gold-icon"></i> VIP Program Perks</h2>
        <p>Enjoy higher stakes, a personal account manager, priority withdrawals, and exclusive bonuses.</p>
        <button class="btn btn-gold" id="buy-vip-btn">Buy VIP Status</button>`;

    const tournamentRulesHTML = `
        <h2>Weekly Tournaments</h2>
        <p>Join our weekly tournaments with a prize pool of 1,000,000 ₽! Play the featured games, climb the leaderboard, and win your share. Check the "Tournaments" page for active events.</p>`;

    // Обробники для кнопок (Завдання 1, 2, 7)
    document.querySelector("#login-btn").addEventListener("click", (e) => { e.preventDefault(); openModal(loginFormHTML); });
    document.querySelector("#register-btn").addEventListener("click", (e) => { e.preventDefault(); openModal(registerFormHTML); });
    document.querySelector("#vip-btn").addEventListener("click", (e) => { e.preventDefault(); openModal(vipModalHTML); });

    document.querySelectorAll(".btn-bonus-action").forEach(btn => {
        btn.addEventListener("click", function(event) {
            const bonusType = btn.dataset.bonusType;
            if (bonusType === "welcome") { event.preventDefault(); openModal(paymentFormHTML); }
            if (bonusType === "vip") { event.preventDefault(); openModal(vipPerksHTML); }
            if (bonusType === "tournament") { event.preventDefault(); openModal(tournamentRulesHTML); }
            // "cashback" вже має href="#games", тому він обробляється Частиною 1
        });
    });

    // --- ЧАСТИНА 4: Колесо Фортуни (Завдання 4) ---
    const tryLuckBtn = document.querySelector("#try-luck-btn");
    const spinBtn = document.querySelector("#spin-btn");
    const wheelSpinner = document.querySelector("#wheel-spinner");
    let isSpinning = false;
    // Сектори, ЯК ВОНИ ВІДОБРАЖЕНІ В HTML (проти годинникової стрілки):
    const segments = ["250 FS", "50%", "100 FS", "75%", "200%", "150 FS", "100%", "300%"];

    tryLuckBtn.addEventListener("click", (e) => {
        e.preventDefault();
        spinBtn.classList.add("pulse-animation"); // Підсвічуємо кнопку
    });

    spinBtn.addEventListener("click", function(event) {
        event.preventDefault();
        if (isSpinning) return; // Захист від повторних натискань
        isSpinning = true;
        spinBtn.disabled = true;
        spinBtn.classList.remove("pulse-animation");

        // 1. Розраховуємо випадковий кут
        const randomSpins = Math.floor(Math.random() * 5) + 5; // 5-10 повних обертів
        const randomSegment = Math.floor(Math.random() * segments.length); // Який сектор виграє (0-7)
        const segmentAngle = 360 / segments.length; // 45deg
        // Фінальний кут: (оберти * 360) + (позиція сектора * 45) + (невелике зміщення всередині сектора)
        const stopAngle = (randomSpins * 360) - (randomSegment * segmentAngle) - (segmentAngle / 2);

        // 2. Отримуємо виграш
        const prize = segments[randomSegment];
        
        // 3. Анімуємо колесо
        wheelSpinner.style.transition = "transform 6s cubic-bezier(0.25, 1, 0.5, 1)"; // Плавний старт, різка зупинка
        wheelSpinner.style.transform = `rotate(${stopAngle}deg)`;

        // 4. Показуємо результат ПІСЛЯ анімації
        setTimeout(() => {
            const winModalHTML = `
                <h2>Congratulations!</h2>
                <p style="font-size: 20px;">You won <strong>${prize}</strong>!</p>
                <button class="btn btn-gold" id="modal-ok-btn">Awesome!</button>`;
            openModal(winModalHTML);
            
            isSpinning = false;
            spinBtn.disabled = false;
            
            // (Опціонально) Повертаємо колесо у стартову позицію
            // wheelSpinner.style.transition = 'none';
            // wheelSpinner.style.transform = `rotate(0deg)`;

        }, 6500); // 6.5 секунд (6 сек анімація + 0.5 сек затримка)
    });

    // --- ЧАСТИНА 5: Фільтрація Ігор (Завдання 5) ---
    const filterContainer = document.querySelector(".game-filters");
    const gameCards = document.querySelectorAll(".game-card");

    filterContainer.addEventListener("click", function(event) {
        event.preventDefault();
        const target = event.target;
        if (!target.classList.contains("btn-filter")) return; // Клікнули не по кнопці

        // 1. Оновлюємо "active" клас на кнопках
        filterContainer.querySelector(".active").classList.remove("active");
        target.classList.add("active");

        const filter = target.dataset.filter; // "all", "hot", "slots" і т.д.

        // 2. Фільтруємо картки
        gameCards.forEach(card => {
            const categories = card.dataset.category;
            
            if (filter === "all" || categories.includes(filter)) {
                card.classList.remove("hidden"); // Показуємо
            } else {
                card.classList.add("hidden"); // Ховаємо
            }
        });
    });

    // --- ЧАСТИНА 6 & 8: Модальні вікна для Ігор (Завдання 6, 8) ---
    function handleGameCardClick(event) {
        const card = event.currentTarget; // Отримуємо картку, на яку клікнули
        const gameName = card.dataset.gameName || card.dataset.liveGame;
        
        let content = `<p>Standard casino game rules apply. Play responsibly.</p>`;
        if (card.dataset.liveGame) {
            content = `<p>This is a LIVE game played with a real dealer in real time. Good luck!</p>`;
        }
        
        const gameModalHTML = `<h2>${gameName}</h2>${content}`;
        openModal(gameModalHTML);
    }
    
    document.querySelectorAll(".game-card").forEach(card => {
        card.addEventListener("click", handleGameCardClick);
    });
    document.querySelectorAll(".live-game-card").forEach(card => {
        card.addEventListener("click", handleGameCardClick);
    });

    // --- ЧАСТИНА 7 (фінал): Делегування подій для динамічних кнопок ---
    document.body.addEventListener("click", function(event) {
        // Кнопка "Buy VIP"
        if (event.target.id === "buy-vip-btn") {
            const successHTML = `
                <h2><i class="fas fa-check-circle gold-icon"></i> Success!</h2>
                <p>You now have VIP status. Enjoy the perks!</p>
                <button class="btn btn-gold" id="modal-ok-btn">OK</button>`;
            openModal(successHTML);
        }
        // Кнопка "OK"
        if (event.target.id === "modal-ok-btn") {
            closeModal();
        }
        // Обробка кнопок "Login", "Register", "Deposit" (зараз вони нічого не роблять)
        if (event.target.type === "submit" && event.target.closest('.modal-form')) {
            event.preventDefault();
            // Тут могла б бути логіка відправки, але ми просто закриваємо
            closeModal(); 
            alert("Form submitted (demo)!");
        }
    });

    console.log("Royal Casino JavaScript (v1.0) successfully loaded!");

});