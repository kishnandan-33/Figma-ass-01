/* ---------- Navigation menu + active section ---------- */
(function () {
    const menuButton = document.querySelector(".mobile-navigation-toggle");
    const navigation = document.querySelector(".navigation-menu");
    const navigationLinks = document.querySelectorAll(".navigation-item a");

    if (!menuButton || !navigation) return;

    menuButton.addEventListener("click", () => {
        const isOpen = navigation.classList.toggle("is-open");
        menuButton.setAttribute("aria-expanded", String(isOpen));
    });

    navigation.addEventListener("click", (event) => {
        if (event.target.closest("a")) {
            navigation.classList.remove("is-open");
            menuButton.setAttribute("aria-expanded", "false");
        }
    });

    const pageSections = ["home", "projects", "recommendations", "contact"]
        .map((sectionId) => document.getElementById(sectionId))
        .filter(Boolean);

    function highlightNavigation(sectionId) {
        navigationLinks.forEach((link) => {
            link.classList.toggle(
                "is-active",
                link.getAttribute("href") === "#" + sectionId
            );
        });
    }

    // Active link changes according to the section visible on screen
    function refreshNavigation() {
        const scrollMarker =
            window.scrollY + window.innerHeight * 0.45;

        let activeSection = "home";

        pageSections.forEach((section) => {
            if (section.offsetTop <= scrollMarker) {
                activeSection = section.id;
            }
        });

        if (window.scrollY < 10) {
            activeSection = "home";
        }

        highlightNavigation(activeSection);
    }

    window.addEventListener("scroll", refreshNavigation, {
        passive: true
    });

    window.addEventListener("resize", refreshNavigation);

    refreshNavigation();
})();


/* ---------- Recommendation slider ---------- */
(function () {
    const slider = document.querySelector(".recommendation-slider");

    if (!slider) return;

    const sliderWindow = slider.querySelector(".recommendation-viewport");
    const sliderTrack = slider.querySelector(".recommendation-track");
    const recommendationCards = Array.from(sliderTrack.children);
    const controls = slider.querySelector(".carousel-controls");

    if (!sliderWindow || !sliderTrack || !controls) return;

    const autoplayDelay = 5000;

    let currentIndex = 2;
    let autoplayTimer;

    const navigationDots = recommendationCards.map((_, position) => {
        const button = document.createElement("button");

        button.type = "button";
        button.className = "carousel-dot";
        button.setAttribute(
            "aria-label",
            "Show recommendation " + (position + 1)
        );

        button.addEventListener("click", () => {
            moveTo(position);
            restartAutoplay();
        });

        controls.appendChild(button);

        return button;
    });

    function moveTo(position) {
        currentIndex =
            (position + recommendationCards.length) %
            recommendationCards.length;

        const activeCard = recommendationCards[currentIndex];

        const trackPosition =
            sliderTrack.getBoundingClientRect().left;

        const cardCenter =
            activeCard.getBoundingClientRect().left -
            trackPosition +
            activeCard.offsetWidth / 2;

        const movement =
            sliderWindow.clientWidth / 2 - cardCenter;

        sliderTrack.style.setProperty(
            "--offset",
            movement + "px"
        );

        recommendationCards.forEach((card, number) => {
            card.classList.toggle(
                "is-active",
                number === currentIndex
            );
        });

        navigationDots.forEach((dot, number) => {
            dot.classList.toggle(
                "is-active",
                number === currentIndex
            );
        });
    }

    function startAutoplay() {
        if (
            window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches
        ) {
            return;
        }

        autoplayTimer = setInterval(() => {
            moveTo(currentIndex + 1);
        }, autoplayDelay);
    }

    function stopAutoplay() {
        clearInterval(autoplayTimer);
    }

    function restartAutoplay() {
        stopAutoplay();
        startAutoplay();
    }

    slider.addEventListener("mouseenter", stopAutoplay);
    slider.addEventListener("mouseleave", startAutoplay);

    slider.addEventListener("focusin", stopAutoplay);
    slider.addEventListener("focusout", startAutoplay);


    /* ---------- Touch swipe ---------- */

    let touchStart = null;

    sliderWindow.addEventListener(
        "touchstart",
        (event) => {
            touchStart = event.touches[0].clientX;
        },
        { passive: true }
    );

    sliderWindow.addEventListener("touchend", (event) => {
        if (touchStart === null) return;

        const touchDistance =
            event.changedTouches[0].clientX - touchStart;

        if (Math.abs(touchDistance) > 40) {
            moveTo(
                currentIndex +
                (touchDistance < 0 ? 1 : -1)
            );

            restartAutoplay();
        }

        touchStart = null;
    });


    /* ---------- Slider resize ---------- */

    window.addEventListener("resize", () => {
        moveTo(currentIndex);
    });

    window.addEventListener("load", () => {
        moveTo(currentIndex);
    });


    /* ---------- Initial slider position ---------- */

    sliderTrack.style.transition = "none";

    moveTo(currentIndex);

    requestAnimationFrame(() => {
        sliderTrack.style.transition = "";
    });

    startAutoplay();
})();


/* ---------- Contact form validation ---------- */
(function () {
    const contactForm = document.getElementById("contact-form");

    if (!contactForm) return;

    const nameField = contactForm.querySelector("#name");
    const emailField = contactForm.querySelector("#email");
    const formStatus = document.getElementById("form-status");

    if (!nameField || !emailField || !formStatus) return;

    const emailRule = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    function showValidationError(field, message) {
        const errorMessage = document.getElementById(
            field.id + "-error"
        );

        if (errorMessage) {
            errorMessage.textContent = message;
        }

        field.classList.toggle(
            "is-invalid",
            Boolean(message)
        );

        field.setAttribute(
            "aria-invalid",
            message ? "true" : "false"
        );
    }


    function checkName() {
        const validName =
            nameField.value.trim().length >= 2;

        showValidationError(
            nameField,
            validName
                ? ""
                : "Please enter your full name."
        );

        return validName;
    }


    function checkEmail() {
        const enteredEmail =
            emailField.value.trim();

        let errorText = "";

        if (!enteredEmail) {
            errorText = "Please enter your email.";
        } else if (!emailRule.test(enteredEmail)) {
            errorText =
                "Please enter a valid email address.";
        }

        showValidationError(
            emailField,
            errorText
        );

        return !errorText;
    }


    nameField.addEventListener("blur", checkName);
    emailField.addEventListener("blur", checkEmail);


    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();

        formStatus.textContent = "";

        const validName = checkName();
        const validEmail = checkEmail();

        if (!validName) {
            nameField.focus();
            return;
        }

        if (!validEmail) {
            emailField.focus();
            return;
        }

        formStatus.textContent =
            "Thanks! Your message has been sent.";

        contactForm.reset();
    });
})();