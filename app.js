document.addEventListener("DOMContentLoaded", () => {
    
    // 1. MOBILE MENU BURGER
    const burgerBtn = document.getElementById("burgerBtn");
    const navMenu = document.getElementById("navMenu");

    if (burgerBtn && navMenu) {
        burgerBtn.addEventListener("click", () => {
            navMenu.classList.toggle("active");
        });
        document.querySelectorAll(".nav-menu a").forEach(link => {
            link.addEventListener("click", () => navMenu.classList.remove("active"));
        });
    }

    // 2. MESSENGER ROUTING WITH FORMS
    const channelButtons = document.querySelectorAll(".channel-btn");
    const submitBtn = document.getElementById("submitBtn");
    let selectedChannel = "whatsapp"; // Значення за замовчуванням

    // Офіційні дані студії для відправки
    const studioPhone = "390321611619"; 
    const studioTelegramUser = "studiobroggimazzini"; // Сюди можна буде прописати точний нікнейм телеграм
    const studioEmail = "segreteria@studiobroggimazzini.eu";

    channelButtons.forEach(button => {
        button.addEventListener("click", () => {
            channelButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");
            
            selectedChannel = button.getAttribute("data-channel");
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

            // Шаблон листа італійською мовою
            const textTemplate = `Richiesta Assistenza Legale\n\n` +
                                 `• Nome e Cognome: ${name}\n` +
                                 `• Ambito: ${area}\n` +
                                 `• Urgenza: ${urgency}\n` +
                                 `• Dettagli del caso: ${message}`;

            const encodedText = encodeURIComponent(textTemplate);

            // Логіка відкриття додатків
            if (selectedChannel === "whatsapp") {
                window.open(`https://wa.me/${studioPhone}?text=${encodedText}`, "_blank");
            } else if (selectedChannel === "telegram") {
                window.open(`https://t.me/${studioTelegramUser}?text=${encodedText}`, "_blank");
            } else if (selectedChannel === "viber") {
                window.open(`viber://forward?text=${encodedText}`, "_blank");
            } else if (selectedChannel === "email") {
                window.location.href = `mailto:${studioEmail}?subject=Richiesta%20Contatto%20Studio%20Legale&body=${encodedText}`;
            }
        });
    }
});
