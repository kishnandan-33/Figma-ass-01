/* ---------- Mobile menu + active link ---------- */
(function () {
    const toggle = document.querySelector(".nav__toggle");
    const menu = document.querySelector(".nav__menu");
    const links = document.querySelectorAll(".nav__link");

    toggle.addEventListener("click", () => {
        const open = menu.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", String(open));
    });

    menu.addEventListener("click", (e) => {
        if (e.target.closest("a")) {
            menu.classList.remove("is-open");
            toggle.setAttribute("aria-expanded", "false");
        }
    });

    const sections = ["home", "projects", "recommendations", "contact"]
        .map((id) => document.getElementById(id))
        .filter(Boolean);

    function setActive(id) {
        links.forEach((link) => {
            link.classList.toggle("is-active", link.getAttribute("href") === "#" + id);
        });
    }

    // the active link is the last section whose top has passed 45% of the screen
    function updateActiveLink() {
        const marker = window.scrollY + window.innerHeight * 0.45;
        let current = "home";
        sections.forEach((section) => {
            if (section.offsetTop <= marker) current = section.id;
        });
        if (window.scrollY < 10) current = "home";
        setActive(current);
    }

    window.addEventListener("scroll", updateActiveLink, { passive: true });
    window.addEventListener("resize", updateActiveLink);
    updateActiveLink();
})();

/* ---------- Recommendations carousel ---------- */
(function () {
    const root = document.querySelector(".carousel");
    const viewport = root.querySelector(".carousel__viewport");
    const track = root.querySelector(".carousel__track");
    const slides = Array.from(track.children);
    const dotsWrap = root.querySelector(".carousel__dots");
    const AUTOPLAY_MS = 5000;

    let index = 2;
    let timer;

    const dots = slides.map((_, i) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "carousel__dot";
        dot.setAttribute("aria-label", "Show recommendation " + (i + 1));
        dot.addEventListener("click", () => { goTo(i); restart(); });
        dotsWrap.appendChild(dot);
        return dot;
    });

    function goTo(i) {
        index = (i + slides.length) % slides.length;
        const slide = slides[index];
        const trackLeft = track.getBoundingClientRect().left;
        const centre = slide.getBoundingClientRect().left - trackLeft + slide.offsetWidth / 2;
        track.style.setProperty("--offset", viewport.clientWidth / 2 - centre + "px");
        slides.forEach((s, n) => s.classList.toggle("is-active", n === index));
        dots.forEach((d, n) => d.classList.toggle("is-active", n === index));
    }

    function start() {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        timer = setInterval(() => goTo(index + 1), AUTOPLAY_MS);
    }
    function stop() { clearInterval(timer); }
    function restart() { stop(); start(); }

    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", start);
    root.addEventListener("focusin", stop);
    root.addEventListener("focusout", start);

    let startX = null;
    viewport.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; }, { passive: true });
    viewport.addEventListener("touchend", (e) => {
        if (startX === null) return;
        const delta = e.changedTouches[0].clientX - startX;
        if (Math.abs(delta) > 40) { goTo(index + (delta < 0 ? 1 : -1)); restart(); }
        startX = null;
    });

    window.addEventListener("resize", () => goTo(index));
    window.addEventListener("load", () => goTo(index));

    track.style.transition = "none";
    goTo(index);
    requestAnimationFrame(() => { track.style.transition = ""; });
    start();
})();

/* ---------- Contact form validation (nothing is stored) ---------- */
(function () {
    const form = document.getElementById("contact-form");
    const name = form.querySelector("#name");
    const email = form.querySelector("#email");
    const status = document.getElementById("form-status");
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    function setError(input, message) {
        const error = document.getElementById(input.id + "-error");
        error.textContent = message;
        input.classList.toggle("is-invalid", Boolean(message));
        input.setAttribute("aria-invalid", message ? "true" : "false");
    }

    function validateName() {
        const ok = name.value.trim().length >= 2;
        setError(name, ok ? "" : "Please enter your full name.");
        return ok;
    }

    function validateEmail() {
        const value = email.value.trim();
        let message = "";
        if (!value) message = "Please enter your email.";
        else if (!emailPattern.test(value)) message = "Please enter a valid email address.";
        setError(email, message);
        return !message;
    }

    name.addEventListener("blur", validateName);
    email.addEventListener("blur", validateEmail);

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        status.textContent = "";
        const nameOk = validateName();
        const emailOk = validateEmail();
        if (!nameOk) return name.focus();
        if (!emailOk) return email.focus();
        status.textContent = "Thanks! Your message has been sent.";
        form.reset();
    });
})();