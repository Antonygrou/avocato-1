document.addEventListener("DOMContentLoaded", () => {
    
    // 1. МОБІЛЬНЕ МЕНЮ (БУРГЕР)
    const burgerBtn = document.getElementById("burgerBtn");
    const navMenu = document.getElementById("navMenu");

    if (burgerBtn && navMenu) {
        burgerBtn.addEventListener("click", () => {
            navMenu.classList.toggle("active");
        });
        // Закривати меню при кліку на будь-яке посилання
        document.querySelectorAll(".nav-menu a").forEach(link => {
            link.addEventListener("click", () => navMenu.classList.remove("active"));
        });
    }

    // 2. ІНТЕГРАЦІЯ МЕСЕНДЖЕРІВ ТА ВІДПРАВКА ФОРМИ
    const channelButtons = document.querySelectorAll(".channel-btn");
    const submitBtn = document.getElementById("submitBtn");
    let selectedChannel = "whatsapp"; // Канал за замовчуванням

    // Номер телефону студії для месенджерів (вкажіть ваш робочий мобільний у форматі без знака +)
    const studioPhone = "390321611619"; 
    const studioTelegramUser = "username_da_inserire"; // Сюди можна буде вписати нік телеграм
    const studioEmail = "segreteria@studiobroggimazzini.eu";

    channelButtons.forEach(button => {
        button.addEventListener("click", () => {
            channelButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");
            
            selectedChannel = button.getAttribute("data-channel");
            // Змінюємо текст на головній кнопці залежно від вибору
            const formattedChannel = selectedChannel.charAt(0).toUpperCase() + selectedChannel.slice(1);
            submitBtn.textContent = `Invia tramite ${formattedChannel}`;
        });
    });

    if (submitBtn) {
        submitBtn.addEventListener("click", () => {
            const name = document.getElementById("name").value.trim();
            const area = document.getElementById("area").value;
            const urgency = document.getElementById("urgency").value;
            const message = document.getElementById("message").value.trim();

            if (!name || !message) {
                alert("Per favore, compila tutti i campi obbligatori (Nome e Descrizione).");
                return;
            }

            // Формуємо красивий текст повідомлення для адвокатів
            const textTemplate = `Richiesta Contatto - Studio Legale\n\n` +
                                 `• Nome: ${name}\n` +
                                 `• Area: ${area}\n` +
                                 `• Urgenza: ${urgency}\n` +
                                 `• Dettagli: ${message}`;

            const encodedText = encodeURIComponent(textTemplate);

            // Виконуємо дію залежно від обраного каналу
            if (selectedChannel === "whatsapp") {
                window.open(`https://wa.me/${studioPhone}?text=${encodedText}`, "_blank");
            } else if (selectedChannel === "telegram") {
                window.open(`https://t.me/${studioTelegramUser}?text=${encodedText}`, "_blank");
            } else if (selectedChannel === "viber") {
                window.open(`viber://forward?text=${encodedText}`, "_blank");
            } else if (selectedChannel === "email") {
                window.location.href = `mailto:${studioEmail}?subject=Richiesta%20Assistenza%20Legale&body=${encodedText}`;
            }
        });
    }
});
