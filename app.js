document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 1. MOBILE NAVIGATION MENU
    // ==========================================
    const burgerBtn = document.getElementById("burgerBtn");
    const navMenu = document.getElementById("navMenu");

    if (burgerBtn && navMenu) {
        burgerBtn.addEventListener("click", () => {
            const isActive = navMenu.classList.toggle("active");
            burgerBtn.classList.toggle("toggle");
            burgerBtn.setAttribute("aria-expanded", isActive ? "true" : "false");
        });

        document.querySelectorAll(".nav-menu a").forEach(link => {
            link.addEventListener("click", () => {
                navMenu.classList.remove("remove");
                navMenu.classList.remove("active");
                burgerBtn.classList.remove("toggle");
                burgerBtn.setAttribute("aria-expanded", "false");
            });
        });
    }

    // ==========================================
    // 2. FAQ ACCORDION WITH FLUID TRANSITIONS
    // ==========================================
    const accordionHeaders = document.querySelectorAll(".accordion-header");

    accordionHeaders.forEach(header => {
        header.addEventListener("click", () => {
            const item = header.parentElement;
            const body = header.nextElementSibling;
            const isCurrentlyActive = item.classList.contains("active");

            document.querySelectorAll(".accordion-item").forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove("active");
                    otherItem.querySelector(".accordion-header").setAttribute("aria-expanded", "false");
                    otherItem.querySelector(".accordion-body").style.maxHeight = null;
                }
            });

            if (!isCurrentlyActive) {
                item.classList.add("active");
                header.setAttribute("aria-expanded", "true");
                body.style.maxHeight = body.scrollHeight + "px";
            } else {
                item.classList.remove("active");
                header.setAttribute("aria-expanded", "false");
                body.style.maxHeight = null;
            }
        });
    });

    // ==========================================
    // 3. COOKIE CONSENT BANNER
    // ==========================================
    const cookieBanner = document.getElementById("cookieBanner");
    const acceptCookies = document.getElementById("acceptCookies");
    const declineCookies = document.getElementById("declineCookies");

    if (cookieBanner && acceptCookies && declineCookies) {
        const cookieDecision = localStorage.getItem("studioCookiesAccepted");
        if (cookieDecision === null) {
            cookieBanner.style.display = "flex";
        }

        acceptCookies.addEventListener("click", () => {
            localStorage.setItem("studioCookiesAccepted", "true");
            fadeOut(cookieBanner);
        });

        declineCookies.addEventListener("click", () => {
            localStorage.setItem("studioCookiesAccepted", "false");
            fadeOut(cookieBanner);
        });
    }

    function fadeOut(element) {
        element.style.transition = "opacity 0.5s ease, transform 0.5s ease";
        element.style.opacity = "0";
        element.style.transform = "translateY(20px)";
        setTimeout(() => {
            element.style.display = "none";
        }, 500);
    }

    // ==========================================
    // 4. TESTIMONIALS/REVIEWS SLIDER
    // ==========================================
    const slides = document.querySelectorAll(".review-slide");
    const indicators = document.querySelectorAll(".slider-indicators .indicator");
    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
        if (slides.length === 0) return;
        
        slides.forEach(slide => slide.classList.remove("active"));
        indicators.forEach(indicator => indicator.classList.remove("active"));
        
        currentSlide = (index + slides.length) % slides.length;
        slides[currentSlide].classList.add("active");
        indicators[currentSlide].classList.add("active");
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function startSlideShow() {
        stopSlideShow();
        slideInterval = setInterval(nextSlide, 6000); // Rotate every 6 seconds
    }

    function stopSlideShow() {
        if (slideInterval) clearInterval(slideInterval);
    }

    if (indicators.length > 0) {
        indicators.forEach(indicator => {
            indicator.addEventListener("click", () => {
                const targetIndex = parseInt(indicator.getAttribute("data-slide"), 10);
                showSlide(targetIndex);
                startSlideShow(); // Reset interval
            });
        });
        
        startSlideShow();
        
        // Pause slide show when user leaves tab
        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                stopSlideShow();
            } else {
                startSlideShow();
            }
        });
    }

    // ==========================================
    // 5. INTERACTIVE MESSENGER CONTACT FORM
    // ==========================================
    const form = document.getElementById("appointmentForm");
    const nameInput = document.getElementById("name");
    const areaSelect = document.getElementById("area");
    const urgencySelect = document.getElementById("urgency");
    const messageTextarea = document.getElementById("message");
    const channelButtons = document.querySelectorAll(".channel-btn");
    const submitBtn = document.getElementById("submitBtn");
    const formStatus = document.getElementById("formStatus");

    let activeChannel = "whatsapp"; // Default messaging channel

    if (channelButtons.length > 0) {
        channelButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                channelButtons.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                activeChannel = btn.getAttribute("data-channel");
                
                // Update Submit Button Text based on channel selection
                switch (activeChannel) {
                    case "whatsapp":
                        submitBtn.textContent = "Invia tramite WhatsApp";
                        submitBtn.style.backgroundColor = "#25d366";
                        break;
                    case "telegram":
                        submitBtn.textContent = "Invia tramite Telegram";
                        submitBtn.style.backgroundColor = "#0088cc";
                        break;
                    case "viber":
                        submitBtn.textContent = "Invia tramite Viber";
                        submitBtn.style.backgroundColor = "#7360f2";
                        break;
                    case "email":
                        submitBtn.textContent = "Invia tramite Email";
                        submitBtn.style.backgroundColor = "var(--accent)";
                        break;
                }
            });
        });
    }

    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            // Clear previous errors
            formStatus.style.display = "none";
            formStatus.className = "form-status";
            formStatus.textContent = "";

            let isValid = true;

            // Name verification
            if (!nameInput.value.trim() || nameInput.value.trim().length < 3) {
                showError(nameInput, "Inserisci il tuo nome e cognome completo.");
                isValid = false;
            } else {
                clearError(nameInput);
            }

            // Case description verification
            if (!messageTextarea.value.trim() || messageTextarea.value.trim().length < 10) {
                showError(messageTextarea, "Fornisci una descrizione più dettagliata del caso (almeno 10 caratteri).");
                isValid = false;
            } else {
                clearError(messageTextarea);
            }

            if (!isValid) return;

            // Form Submit processing
            const originalText = submitBtn.textContent;
            const originalBg = submitBtn.style.backgroundColor;
            
            submitBtn.disabled = true;
            submitBtn.textContent = "Elaborazione...";

            // Compile URL encoded message details
            const clientName = nameInput.value.trim();
            const caseArea = areaSelect.value;
            const caseUrgency = urgencySelect.value;
            const caseDesc = messageTextarea.value.trim();

            const messageTemplate = `Studio Legale Broggi & Mazzini\n\n*Nuovo Contatto dal Sito*\n*Cliente:* ${clientName}\n*Area:* ${caseArea}\n*Urgenza:* ${caseUrgency}\n\n*Descrizione del Caso:*\n${caseDesc}`;
            const encodedText = encodeURIComponent(messageTemplate);

            // Log lead to Formspree asynchronously in the background as a backup log
            const formData = new FormData();
            formData.append("name", clientName);
            formData.append("area", caseArea);
            formData.append("urgency", caseUrgency);
            formData.append("message", caseDesc);
            formData.append("selected_channel", activeChannel);

            // Silent log
            fetch("https://formspree.io/f/xknqgjew", {
                method: "POST",
                body: formData,
                headers: { "Accept": "application/json" }
            }).catch(err => console.log("Silent logging error:", err));

            // Execute Messenger redirection based on user choice
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
                submitBtn.style.backgroundColor = originalBg;
                
                formStatus.style.display = "block";
                formStatus.classList.add("success");
                formStatus.textContent = "Reindirizzamento al canale selezionato in corso...";

                switch (activeChannel) {
                    case "whatsapp":
                        window.open(`https://api.whatsapp.com/send?phone=390321611619&text=${encodedText}`, "_blank");
                        break;
                    
                    case "telegram":
                        // Copy message to clipboard before opening Telegram because Telegram Web does not support query text for user chats
                        navigator.clipboard.writeText(messageTemplate).then(() => {
                            alert("Il testo della richiesta è stato copiato negli appunti! Ora verrai reindirizzato a Telegram: incolla il messaggio direttamente nella chat.");
                            window.open("https://t.me/studiobroggimazzini", "_blank");
                        }).catch(() => {
                            window.open("https://t.me/studiobroggimazzini", "_blank");
                        });
                        break;
                    
                    case "viber":
                        window.open(`viber://chat?number=%2B390321611619`, "_blank");
                        break;
                    
                    case "email":
                        window.location.href = `mailto:segreteria@studiobroggimazzini.eu?subject=Richiesta%20Assistenza%20-%20${encodeURIComponent(clientName)}&body=${encodedText}`;
                        break;
                }
                form.reset();
            }, 1000);
        });
    }

    function showError(inputElement, message) {
        const group = inputElement.closest(".form-group");
        if (group) {
            group.classList.add("invalid");
            const errSpan = group.querySelector(".error-message");
            if (errSpan) {
                errSpan.textContent = message;
            }
        }
    }

    function clearError(inputElement) {
        const group = inputElement.closest(".form-group");
        if (group) {
            group.classList.remove("invalid");
            const errSpan = group.querySelector(".error-message");
            if (errSpan) {
                errSpan.textContent = "";
            }
        }
    }

    // ==========================================
    // 6. CONVERSATIONAL INTAKE CHATBOT
    // ==========================================
    const botToggle = document.getElementById("botToggle");
    const botWindow = document.getElementById("botWindow");
    const closeBot = document.getElementById("closeBot");
    const botMessages = document.getElementById("botMessages");
    const botOptions = document.getElementById("botOptions");
    const botOptionsContainer = document.getElementById("botOptionsContainer");
    const botTypingWrapper = document.getElementById("botTypingWrapper");

    let chatData = {
        area: "",
        urgency: "",
        channel: ""
    };

    if (botToggle && botWindow && closeBot) {
        botToggle.addEventListener("click", () => {
            const isActive = botWindow.classList.toggle("active");
            botToggle.setAttribute("aria-expanded", isActive ? "true" : "false");
            
            // Remove notification dot when chat opens
            const dot = botToggle.querySelector(".bot-notification-dot");
            if (dot) dot.remove();

            if (isActive) {
                botWindow.style.display = "flex";
                botMessages.scrollTop = botMessages.scrollHeight;
            } else {
                setTimeout(() => {
                    if(!botWindow.classList.contains("active")) {
                        botWindow.style.display = "none";
                    }
                }, 400);
            }
        });

        closeBot.addEventListener("click", () => {
            botWindow.classList.remove("active");
            botToggle.setAttribute("aria-expanded", "false");
            setTimeout(() => {
                botWindow.style.display = "none";
            }, 400);
        });

        botOptions.addEventListener("click", (e) => {
            if (!e.target.classList.contains("option-btn")) return;

            const selectedText = e.target.textContent;
            const selectedVal = e.target.getAttribute("data-next");

            // Display user message in chat
            appendMessage(selectedText, "user-msg");
            
            // Hide options and display typing indicator
            botOptionsContainer.style.display = "none";
            botTypingWrapper.style.display = "block";
            botMessages.scrollTop = botMessages.scrollHeight;

            setTimeout(() => {
                botTypingWrapper.style.display = "none";
                processChatStep(selectedVal);
            }, 1000);
        });
    }

    function processChatStep(value) {
        if (!chatData.area) {
            // Step 1: Area selected
            chatData.area = value;
            appendMessage("Capito. Quanto è urgente la questione?", "bot-msg");
            
            // Present step 2 options (urgency)
            botOptions.innerHTML = `
                <button class="option-btn" data-next="Urgente">Urgente (Scadenze immediate)</button>
                <button class="option-btn" data-next="Ordinaria">Ordinaria (Contatto entro 24h)</button>
            `;
            botOptionsContainer.style.display = "block";
        } else if (!chatData.urgency) {
            // Step 2: Urgency selected
            chatData.urgency = value;
            appendMessage("Perfetto. Quale canale preferisci per essere ricontattato?", "bot-msg");
            
            // Present step 3 options (channel preference)
            botOptions.innerHTML = `
                <button class="option-btn" data-next="whatsapp">WhatsApp</button>
                <button class="option-btn" data-next="viber">Viber</button>
                <button class="option-btn" data-next="email">Email / Telefono</button>
            `;
            botOptionsContainer.style.display = "block";
        } else {
            // Step 3: Channel selected
            chatData.channel = value;
            
            let prettyArea = chatData.area.charAt(0).toUpperCase() + chatData.area.slice(1);
            if(prettyArea === "Condominio") prettyArea = "Diritto Condominiale";
            if(prettyArea === "Fallimentare") prettyArea = "Diritto Fallimentare";
            
            appendMessage(`Grazie per le risposte. Ho preimpostato il modulo di contatto per te con le seguenti opzioni:\n\n• Area: Diritto ${prettyArea}\n• Urgenza: ${chatData.urgency}\n• Canale: ${chatData.channel.toUpperCase()}`, "bot-msg");
            
            // Sync choices to the main form automatically
            if (areaSelect) {
                // Find matching option
                for(let opt of areaSelect.options) {
                    if(opt.value.toLowerCase().includes(chatData.area.toLowerCase())) {
                        areaSelect.value = opt.value;
                        break;
                    }
                }
            }
            if (urgencySelect) {
                urgencySelect.value = chatData.urgency;
            }
            if (channelButtons.length > 0) {
                // Trigger button click programmatically
                const targetBtn = Array.from(channelButtons).find(btn => btn.getAttribute("data-channel") === chatData.channel);
                if (targetBtn) targetBtn.click();
            }

            // Append final CTA link in chat
            setTimeout(() => {
                const fragment = document.createDocumentFragment();
                const textNode = document.createElement("p");
                textNode.textContent = "Per completare, inserisci brevemente il tuo nome e cognome e una sintesi della vicenda nella form e premi invio!";
                
                const ctaLink = document.createElement("a");
                ctaLink.href = "#prenota";
                ctaLink.style.color = "#b45309";
                ctaLink.style.fontWeight = "bold";
                ctaLink.style.display = "block";
                ctaLink.style.marginTop = "10px";
                ctaLink.textContent = "Vai alla Form precompilata ↓";
                
                ctaLink.addEventListener("click", () => {
                    botWindow.classList.remove("active");
                    botToggle.setAttribute("aria-expanded", "false");
                    setTimeout(() => {
                        botWindow.style.display = "none";
                    }, 400);
                });

                fragment.appendChild(textNode);
                fragment.appendChild(ctaLink);
                appendComplexMessage(fragment, "bot-msg");
            }, 600);
        }
        botMessages.scrollTop = botMessages.scrollHeight;
    }

    function appendMessage(text, className) {
        const msgDiv = document.createElement("div");
        msgDiv.className = `msg ${className}`;
        msgDiv.textContent = text;
        botMessages.appendChild(msgDiv);
        botMessages.scrollTop = botMessages.scrollHeight;
    }

    function appendComplexMessage(documentFragment, className) {
        const msgDiv = document.createElement("div");
        msgDiv.className = `msg ${className}`;
        msgDiv.appendChild(documentFragment);
        botMessages.appendChild(msgDiv);
        botMessages.scrollTop = botMessages.scrollHeight;
    }

    // ==========================================
    // 7. SCROLL ENTRANCE ANIMATION (Intersection Observer)
    // ==========================================
    const animatedElements = document.querySelectorAll('.scroll-anim, .card-anim, .item-anim');

    if (animatedElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -45px 0px'
        });

        animatedElements.forEach((el) => {
            observer.observe(el);
        });
    }
});
