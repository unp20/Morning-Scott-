5/**
 * ==========================================
 * UNP TOURS - MAIN.JS
 * ==========================================
 * Inashughulikia: Slider, Navigation, Chat,
 * Newsletter, Toast, Lazy Load, n.k.
 */

document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // 1. HEADER SCROLL EFFECT
    // ==========================================
    const header = document.querySelector(".unp-header");
    let lastScroll = 0;

    window.addEventListener("scroll", () => {
        const currentScroll = window.pageYOffset;

        if (header) {
            if (currentScroll > 50) {
                header.classList.add("scrolled");
            } else {
                header.classList.remove("scrolled");
            }
        }

        // Back to top button
        const btn = document.getElementById("backToTop");
        if (btn) {
            if (currentScroll > 300) {
                btn.classList.add("visible");
            } else {
                btn.classList.remove("visible");
            }
        }

        // Progress circle
        if (btn) {
            const circle = btn.querySelector("circle");
            if (circle) {
                const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                const scrollPercent = docHeight > 0 ? (currentScroll / docHeight) * 100 : 0;
                circle.style.strokeDashoffset = 100 - scrollPercent;
            }
        }

        lastScroll = currentScroll;
    }, { passive: true });

    // ==========================================
    // 2. MOBILE NAVIGATION
    // ==========================================
    const menuToggle = document.getElementById("menuToggleBtn");
    const mobileNav = document.getElementById("mobileNav");
    const overlay = document.getElementById("mobileNavOverlay");
    const drawerClose = document.getElementById("drawerCloseBtn");

    function openMobileNav() {
        mobileNav?.classList.add("open");
        overlay?.classList.add("active");
        document.body.classList.add("no-scroll");
        menuToggle?.setAttribute("aria-expanded", "true");
        menuToggle?.classList.add("active");
    }

    function closeMobileNav() {
        mobileNav?.classList.remove("open");
        overlay?.classList.remove("active");
        document.body.classList.remove("no-scroll");
        menuToggle?.setAttribute("aria-expanded", "false");
        menuToggle?.classList.remove("active");
    }

    menuToggle?.addEventListener("click", () => {
        mobileNav?.classList.contains("open") ? closeMobileNav() : openMobileNav();
    });

    drawerClose?.addEventListener("click", closeMobileNav);
    overlay?.addEventListener("click", closeMobileNav);

    // Funga kwa Esc
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeMobileNav();
    });

    // Funga mobile nav link ikibonyezwa
    mobileNav?.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", closeMobileNav);
    });

    // ==========================================
    // 3. HERO SLIDER
    // ==========================================
    const slider = document.getElementById("heroSlider");
    if (slider) {
        const slides = slider.querySelectorAll(".unp-slide");
        const dots = slider.querySelectorAll(".dot");
        const prevBtn = slider.querySelector(".slider-prev");
        const nextBtn = slider.querySelector(".slider-next");
        const autoplayBtn = slider.querySelector(".autoplay-toggle");
        const progressBar = slider.querySelector(".progress-bar");

        let currentSlide = 0;
        let autoplayInterval = null;
        let isAutoplay = true;
        const DURATION = 5000;

        function goToSlide(index) {
            slides.forEach((s, i) => {
                s.classList.toggle("active", i === index);
            });
            dots.forEach((d, i) => {
                d.classList.toggle("active", i === index);
                d.setAttribute("aria-selected", i === index);
            });
            currentSlide = index;

            // Reset progress bar
            if (progressBar) {
                progressBar.style.animation = "none";
                void progressBar.offsetWidth;
                progressBar.style.animation = "";
            }
        }

        function nextSlide() {
            goToSlide((currentSlide + 1) % slides.length);
        }

        function prevSlide() {
            goToSlide((currentSlide - 1 + slides.length) % slides.length);
        }

        function startAutoplay() {
            stopAutoplay();
            autoplayInterval = setInterval(nextSlide, DURATION);
            isAutoplay = true;
            if (autoplayBtn) {
                autoplayBtn.setAttribute("aria-label", "Simamisha");
                autoplayBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>`;
            }
            if (progressBar) progressBar.classList.add("animation");
        }

        function stopAutoplay() {
            if (autoplayInterval) clearInterval(autoplayInterval);
            autoplayInterval = null;
            isAutoplay = false;
            if (progressBar) progressBar.classList.remove("animation");
        }

        nextBtn?.addEventListener("click", () => {
            nextSlide();
            if (isAutoplay) startAutoplay();
        });

        prevBtn?.addEventListener("click", () => {
            prevSlide();
            if (isAutoplay) startAutoplay();
        });

        dots.forEach((dot, i) => {
            dot.addEventListener("click", () => {
                goToSlide(i);
                if (isAutoplay) startAutoplay();
            });
        });

        autoplayBtn?.addEventListener("click", () => {
            if (isAutoplay) {
                stopAutoplay();
                autoplayBtn.setAttribute("aria-label", "Endeleza");
                autoplayBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`;
            } else {
                startAutoplay();
            }
        });

        // Pause on hover
        slider.addEventListener("mouseenter", stopAutoplay);
        slider.addEventListener("mouseleave", () => {
            if (!isAutoplay) return;
            startAutoplay();
        });

        // Keyboard navigation
        slider.addEventListener("keydown", (e) => {
            if (e.key === "ArrowRight") nextSlide();
            if (e.key === "ArrowLeft") prevSlide();
        });

        // Swipe (mobile)
        let touchStartX = 0;
        slider.addEventListener("touchstart", (e) => {
            touchStartX = e.touches[0].clientX;
        }, { passive: true });

        slider.addEventListener("touchend", (e) => {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) {
                diff > 0 ? nextSlide() : prevSlide();
            }
        }, { passive: true });

        // Anza
        startAutoplay();
    }

    // ==========================================
    // 4. TOAST NOTIFICATIONS
    // ==========================================
    let toastContainer = document.querySelector(".toast-container");
    if (!toastContainer) {
        toastContainer = document.createElement("div");
        toastContainer.className = "toast-container top-right";
        toastContainer.setAttribute("aria-live", "polite");
        toastContainer.setAttribute("aria-atomic", "true");
        document.body.appendChild(toastContainer);
    }

    window.showToast = function(message, type = "info", duration = 4000) {
        const icons = {
            success: '<i class="fas fa-check-circle"></i>',
            error: '<i class="fas fa-times-circle"></i>',
            warning: '<i class="fas fa-exclamation-triangle"></i>',
            info: '<i class="fas fa-info-circle"></i>'
        };

        const toast = document.createElement("div");
        toast.className = `toast toast-${type}`;
        toast.setAttribute("role", "alert");
        toast.style.setProperty("--toast-duration", `${duration}ms`);
        toast.innerHTML = `
            <span class="toast-icon" aria-hidden="true">${icons[type] || icons.info}</span>
            <div class="toast-content">
                <span class="toast-message">${message}</span>
            </div>
            <button class="toast-close" aria-label="Funga">&times;</button>
            <div class="toast-progress"></div>
        `;

        toastContainer.appendChild(toast);
        void toast.offsetWidth;
        toast.classList.add("show");

        const timer = setTimeout(() => removeToast(toast), duration);

        toast.querySelector(".toast-close")?.addEventListener("click", () => {
            clearTimeout(timer);
            removeToast(toast);
        });

        toast.addEventListener("mouseenter", () => clearTimeout(timer));
        toast.addEventListener("mouseleave", () => {
            setTimeout(() => removeToast(toast), 1500);
        });
    };

    function removeToast(toast) {
        if (!toast.parentNode) return;
        toast.classList.add("hiding");
        toast.addEventListener("animationend", () => toast.remove(), { once: true });
    }

    // ==========================================
    // 5. NEWSLETTER FORM
    // ==========================================
    const newsletterForm = document.getElementById("newsletterForm");
    if (newsletterForm) {
        const emailInput = newsletterForm.querySelector("input[type='email']");
        const msgEl = document.getElementById("newsletterMsg");

        newsletterForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = emailInput?.value.trim() || "";
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(email)) {
                if (msgEl) {
                    msgEl.textContent = "Tafadhali weka barua pepe sahihi.";
                    msgEl.style.color = "#ef4444";
                }
                showToast("Barua pepe si sahihi. Jaribu tena.", "error");
                emailInput?.focus();
                return;
            }

            const submitBtn = newsletterForm.querySelector("button[type='submit']");
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = "Inatuma...";
            }

            try {
                // Firebase submission
                if (typeof addDoc !== 'undefined' && typeof db !== 'undefined') {
                    await addDoc(collection(db, "newsletters"), {
                        email: email,
                        subscribedAt: new Date().toISOString(),
                        source: 'website'
                    });
                } else {
                    // Fallback: simulate success
                    await new Promise(r => setTimeout(r, 800));
                }

                if (msgEl) {
                    msgEl.textContent = "Asante kwa kujiunga na UNP Tours!";
                    msgEl.style.color = "var(--gold-color, #d4af37)";
                }
                showToast("Asante! Umejiunga na jarida letu kwa mafanikio.", "success");
                newsletterForm.reset();
            } catch (error) {
                if (msgEl) {
                    msgEl.textContent = "Kuna hitilafu. Tafadhali jaribu tena.";
                    msgEl.style.color = "#ef4444";
                }
                showToast("Samahani, kuna hitilafu. Jaribu tena baadaye.", "error");
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = "Jiandikishe";
                }
            }
        });
    }

    // ==========================================
    // 6. CHAT WIDGET
    // ==========================================
    const chatToggle = document.getElementById("chatToggle");
    const chatWindow = document.getElementById("chatWindow");
    const chatClose = document.getElementById("chatClose");
    const chatInput = document.getElementById("chatInput");
    const chatSend = document.getElementById("chatSend");
    const chatMessages = document.getElementById("chatMessages");

    function openChat() {
        chatWindow?.classList.add("open");
        chatToggle?.setAttribute("aria-expanded", "true");
        setTimeout(() => chatInput?.focus(), 300);
    }

    function closeChat() {
        chatWindow?.classList.remove("open");
        chatToggle?.setAttribute("aria-expanded", "false");
    }

    chatToggle?.addEventListener("click", () => {
        chatWindow?.classList.contains("open") ? closeChat() : openChat();
    });

    chatClose?.addEventListener("click", closeChat);

    // Bot responses
    function getBotResponse(message) {
        const lower = message.toLowerCase();
        if (/habari|mambo|jambo|hujambo|shikamoo|hello|hi/.test(lower))
            return "Karibu sana! Naweza kukusaidiaje leo? Unaweza kuuliza kuhusu Safari Blue, Airport Transfers, au Ukodishaji wa Magari.";
        if (/safari|blue|dolphin|snorkel/.test(lower))
            return "Safari Blue inaanzia $45 kwa mtu. Inajumuisha chakula, vinywaji, na kisiwa cha sandbank. Ungependa kufanya booking?";
        if (/transfer|airport|ndege|uwanja/.test(lower))
            return "Airport Transfers kutoka Uwanja wa Ndege hadi Nungwi ni $40 kwa gari. Tunapatikana 24/7.";
        if (/rent|kodi|gari|pikipiki/.test(lower))
            return "Tunakodisha magari, pikipiki, na vifaa vya majini. Wasiliana nasi kwa bei maalum.";
        if (/bei|price|cost|\$/.test(lower))
            return "Bei zetu zinaanzia $40. Bonyeza WhatsApp kwa bei kamili.";
        if (/wasiliana|contact|simu|email|whatsapp/.test(lower))
            return "Wasiliana: +255 655 728 982 au salimnasoro11@gmail.com";
        return "Karibu! Kwa maelezo zaidi, bonyeza kitufe cha WhatsApp hapa chini. 💬";
    }

    function addMessage(text, sender) {
        if (!chatMessages) return;
        const msg = document.createElement("div");
        msg.className = `message ${sender}`;
        msg.textContent = text;
        msg.setAttribute("aria-live", "polite");
        chatMessages.appendChild(msg);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function sendMessage() {
        const text = chatInput?.value.trim();
        if (!text) return;

        addMessage(text, "user");
        if (chatInput) chatInput.value = "";

        // Typing indicator
        const typing = document.createElement("div");
        typing.className = "message bot typing";
        typing.textContent = "Anaandika...";
        chatMessages?.appendChild(typing);
        if (chatMessages) chatMessages.scrollTop = chatMessages.scrollHeight;

        setTimeout(() => {
            typing.remove();
            addMessage(getBotResponse(text), "bot");
        }, 1000);
    }

    chatSend?.addEventListener("click", sendMessage);
    chatInput?.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            sendMessage();
        }
    });

    // ==========================================
    // 7. LANGUAGE SWITCHER
    // ==========================================
    const langSwitcher = document.getElementById("languageSwitcher");
    if (langSwitcher) {
        const savedLang = localStorage.getItem("unp_language") || "sw";
        langSwitcher.value = savedLang;

        langSwitcher.addEventListener("change", (e) => {
            const lang = e.target.value;
            localStorage.setItem("unp_language", lang);
            document.documentElement.lang = lang;
            // TODO: Pakia translations hapa
            showToast(`Lugha imebadilishwa kuwa ${lang.toUpperCase()}`, "info");
        });
    }

    // ==========================================
    // 8. BACK TO TOP
    // ==========================================
    const backToTop = document.getElementById("backToTop");
    backToTop?.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // ==========================================
    // 9. SEARCH
    // ==========================================
    const searchBtn = document.querySelector(".search-btn");
    searchBtn?.addEventListener("click", () => {
        showToast("Search itakuja hivi karibuni.", "info");
    });

    // ==========================================
    // 10. ACTIVE NAV LINK (Scroll Spy)
    // ==========================================
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".desktop-nav a[href^='#']");

    if (sections.length && navLinks.length && "IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    navLinks.forEach(link => {
                        const isActive = link.getAttribute("href") === `#${entry.target.id}`;
                        link.classList.toggle("active", isActive);
                        if (isActive) link.setAttribute("aria-current", "page");
                        else link.removeAttribute("aria-current");
                    });
                }
            });
        }, { threshold: 0.5 });

        sections.forEach(s => observer.observe(s));
    }

});