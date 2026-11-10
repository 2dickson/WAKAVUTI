document.addEventListener("DOMContentLoaded", () => {

    const API_BASE_URL = "http://localhost:5000";

    function showToast(message, type = "success", duration = 4500) {
        let toast = document.getElementById("wakavutiToast");

        if (!toast) {
            toast = document.createElement("div");
            toast.id = "wakavutiToast";
            toast.innerHTML = `
                <div class="toast-icon"></div>
                <div>
                    <strong class="toast-title"></strong>
                    <p class="toast-message"></p>
                </div>
            `;
            document.body.appendChild(toast);
        }

        const icon = toast.querySelector(".toast-icon");
        const title = toast.querySelector(".toast-title");
        const text = toast.querySelector(".toast-message");

        const titles = {
            success: "Success",
            error: "Failed",
            processing: "Sending"
        };

        const icons = {
            success: "✓",
            error: "!",
            processing: "⏳"
        };

        toast.className = `wakavuti-toast ${type} show`;
        icon.textContent = icons[type] || "✓";
        title.textContent = titles[type] || "Notice";
        text.textContent = message;

        clearTimeout(window.wakavutiToastTimer);

        window.wakavutiToastTimer = setTimeout(() => {
            toast.classList.remove("show");
        }, duration);
    }

    /* MOBILE MENU */
    const menuToggle = document.getElementById("menuToggle");
    const navMenu = document.getElementById("navMenu");

    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", () => {
            navMenu.classList.toggle("show");
        });
    }

    /* HERO SLIDER */
    const slides = document.querySelectorAll(".hero-slide");
    const dots = document.querySelectorAll(".hero-dot");
    let currentSlide = 0;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove("active"));
        dots.forEach(dot => dot.classList.remove("active"));

        if (slides[index]) slides[index].classList.add("active");
        if (dots[index]) dots[index].classList.add("active");

        currentSlide = index;
    }

    if (slides.length > 0) {
        setInterval(() => {
            let nextSlide = currentSlide + 1;
            if (nextSlide >= slides.length) nextSlide = 0;
            showSlide(nextSlide);
        }, 5000);

        dots.forEach((dot, index) => {
            dot.addEventListener("click", () => {
                showSlide(index);
            });
        });
    }

    /* ANIMATED COUNTERS */
    const counters = document.querySelectorAll(".counter");
    let countersStarted = false;

    function startCounters() {
        if (countersStarted) return;
        countersStarted = true;

        counters.forEach(counter => {
            const target = Number(counter.dataset.target);
            let count = 0;
            const speed = target / 80;

            function updateCounter() {
                count += speed;

                if (count < target) {
                    counter.innerText = Math.ceil(count);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.innerText = target === 99 ? "99%" : target + "+";
                }
            }

            updateCounter();
        });
    }

    const statsSection = document.querySelector(".stats-section");

    if (statsSection && counters.length > 0) {
        const statsObserver = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                startCounters();
                statsObserver.disconnect();
            }
        }, { threshold: 0.3 });

        statsObserver.observe(statsSection);
    }

    /* BACK TO TOP */
    const backToTop = document.getElementById("backToTop");

    if (backToTop) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 400) {
                backToTop.classList.add("show");
            } else {
                backToTop.classList.remove("show");
            }
        });

        backToTop.addEventListener("click", e => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    /* PAGE BANNER SLIDER */
    const bannerSlides = document.querySelectorAll(".banner-slide");
    const bannerDots = document.querySelectorAll(".banner-dot");
    let currentBanner = 0;

    function showBanner(index) {
        bannerSlides.forEach(slide => slide.classList.remove("active"));
        bannerDots.forEach(dot => dot.classList.remove("active"));

        if (bannerSlides[index]) bannerSlides[index].classList.add("active");
        if (bannerDots[index]) bannerDots[index].classList.add("active");

        currentBanner = index;
    }

    if (bannerSlides.length > 0) {
        setInterval(() => {
            let nextBanner = currentBanner + 1;
            if (nextBanner >= bannerSlides.length) nextBanner = 0;
            showBanner(nextBanner);
        }, 5000);
    }

    /* APPOINTMENT FORM */
    const appointmentForm = document.getElementById("appointmentForm");
    const storageKey = "wakavutiAppointmentDraft";

    function setFormStatus(form, message, type) {
        let status = form.querySelector(".form-status");

        if (!status) {
            status = document.createElement("div");
            status.className = "form-status";
            form.appendChild(status);
        }

        status.textContent = message;
        status.className = `form-status ${type}`;
    }

    function readForm(form) {
        return {
            fullName: form.fullName?.value.trim() || "",
            phone: form.phone?.value.trim() || "",
            email: form.email?.value.trim() || "",
            service: form.service?.value.trim() || "",
            appointmentDate: form.appointmentDate?.value || "",
            message: form.message?.value.trim() || ""
        };
    }

    if (appointmentForm) {
        const saved = localStorage.getItem(storageKey);

        if (saved) {
            try {
                const draft = JSON.parse(saved);
                Object.keys(draft).forEach(key => {
                    if (appointmentForm[key]) appointmentForm[key].value = draft[key];
                });
            } catch (_) {}
        }

        appointmentForm.addEventListener("input", () => {
            localStorage.setItem(storageKey, JSON.stringify(readForm(appointmentForm)));
        });

        appointmentForm.addEventListener("submit", async e => {
            e.preventDefault();

            const data = readForm(appointmentForm);
            const phoneOk = /^(07\d{8}|\+2547\d{8})$/.test(data.phone);

            if (!phoneOk) {
                setFormStatus(appointmentForm, "Use a valid phone number starting with 07 or +2547.", "error");
                showToast("Use a valid phone number starting with 07 or +2547.", "error", 5000);
                return;
            }

            const submitButton = appointmentForm.querySelector("button[type='submit']");
            const originalText = submitButton.innerHTML;

            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

            showToast("Sending appointment request, please wait...", "processing", 8000);

            try {
                const response = await fetch(`${API_BASE_URL}/api/appointment`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (!response.ok || !result.success) {
                    throw new Error(result.message || "Failed to send appointment request.");
                }

                localStorage.removeItem(storageKey);
                appointmentForm.reset();

                setFormStatus(appointmentForm, "Appointment request sent successfully. We will contact you soon.", "success");
                showToast("Appointment request sent successfully. We will contact you soon.", "success", 4500);

            } catch (error) {
                const msg = error.message || "Unable to connect. Make sure the backend is running.";
                setFormStatus(appointmentForm, msg, "error");
                showToast(msg, "error", 5000);

            } finally {
                submitButton.disabled = false;
                submitButton.innerHTML = originalText;
            }
        });
    }

    /* WAKAVUTI CHAT WIDGET */
    const chat = document.getElementById("wakavutiChat");
    const chatToggle = document.getElementById("wakavutiChatToggle");
    const chatClose = document.getElementById("wakavutiChatClose");
    const chatForm = document.getElementById("wakavutiChatForm");

    if (chat && chatToggle) {
        chatToggle.addEventListener("click", () => {
            chat.classList.toggle("open");
        });
    }

    if (chat && chatClose) {
        chatClose.addEventListener("click", () => {
            chat.classList.remove("open");
        });
    }

    if (chatForm) {
        chatForm.addEventListener("submit", async e => {
            e.preventDefault();

            const submitButton = chatForm.querySelector("button");
            const originalText = submitButton.textContent;

            const chatData = {
                chatEmail: chatForm.chatEmail.value.trim(),
                chatMessage: chatForm.chatMessage.value.trim()
            };

            if (!chatData.chatMessage) {
                showToast("Please type your message before sending.", "error", 4500);
                return;
            }

            submitButton.disabled = true;
            submitButton.textContent = "Sending...";

            showToast("Sending your message, please wait...", "processing", 8000);

            try {
                const response = await fetch(`${API_BASE_URL}/api/chat-message`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(chatData)
                });

                const result = await response.json();

                if (!response.ok || !result.success) {
                    throw new Error(result.message || "Failed to send message.");
                }

                showToast("Your chat message has been sent successfully.", "success", 4500);
                chatForm.reset();

            } catch (error) {
                showToast("Failed to send message. Please check your connection and try again.", "error", 5000);

            } finally {
                submitButton.disabled = false;
                submitButton.textContent = originalText;
            }
        });
    }

});