document.addEventListener("DOMContentLoaded", () => {

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

            if (nextSlide >= slides.length) {
                nextSlide = 0;
            }

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
                    if (target === 99) {
                        counter.innerText = "99%";
                    } else {
                        counter.innerText = target + "+";
                    }
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
        }, {
            threshold: 0.3
        });

        statsObserver.observe(statsSection);
    }

    /* BACK TO TOP */
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

    backToTop.addEventListener("click", (e) => {
        e.preventDefault();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
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

        if (nextBanner >= bannerSlides.length) {
            nextBanner = 0;
        }

        showBanner(nextBanner);
    }, 5000);
}

});