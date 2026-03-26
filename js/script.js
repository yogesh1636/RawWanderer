document.addEventListener("DOMContentLoaded", () => {
    const animatedElements = document.querySelectorAll(
        ".hero-copy, .hero-panel, .value-card, .discovery-card, .product-card, .category-card, .blog-card, .cta-panel"
    );

    const animateIn = (element, delay = 0) => {
        element.style.transition = `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`;
        element.style.opacity = "1";
        element.style.transform = "translateY(0)";
    };

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) {
                        return;
                    }

                    const siblings = Array.from(entry.target.parentElement?.children || []);
                    const delay = Math.max(siblings.indexOf(entry.target), 0) * 70;
                    animateIn(entry.target, delay);
                    observer.unobserve(entry.target);
                });
            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -40px 0px"
            }
        );

        animatedElements.forEach((element) => observer.observe(element));
    } else {
        animatedElements.forEach((element, index) => animateIn(element, index * 60));
    }

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", (event) => {
            const target = document.querySelector(anchor.getAttribute("href"));
            if (!target) {
                return;
            }

            event.preventDefault();
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    });

    document.querySelectorAll(".product-card img").forEach((img) => {
        img.addEventListener("click", () => {
            const reviewLink = img.closest(".product-card")?.querySelector('a[href*="product-"]');
            if (reviewLink) {
                window.location.href = reviewLink.getAttribute("href");
            }
        });
    });

    const navLinks = document.querySelector(".nav-links");
    let navToggle = document.querySelector(".nav-toggle");

    if (navLinks && !navToggle) {
        navToggle = document.createElement("button");
        navToggle.className = "nav-toggle";
        navToggle.type = "button";
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Toggle navigation");

        if (!navLinks.id) {
            navLinks.id = "primary-navigation";
        }

        navToggle.setAttribute("aria-controls", navLinks.id);
        navToggle.innerHTML = "<span></span><span></span><span></span>";
        navLinks.parentElement?.insertBefore(navToggle, navLinks);
    }

    const closeNav = () => {
        if (!navToggle || !navLinks) {
            return;
        }

        navLinks.classList.remove("nav-open");
        navToggle.setAttribute("aria-expanded", "false");
        navLinks.querySelectorAll(".dropdown").forEach((dropdown) => {
            dropdown.classList.remove("dropdown-open");
            const trigger = dropdown.querySelector(":scope > a");
            if (trigger) {
                trigger.setAttribute("aria-expanded", "false");
            }
        });
    };

    if (navToggle && navLinks) {
        navToggle.addEventListener("click", () => {
            const isOpen = navLinks.classList.toggle("nav-open");
            navToggle.setAttribute("aria-expanded", String(isOpen));
        });

        navLinks.querySelectorAll(".dropdown").forEach((dropdown) => {
            const trigger = dropdown.querySelector(":scope > a");
            if (!trigger) {
                return;
            }

            trigger.setAttribute("aria-expanded", "false");

            trigger.addEventListener("click", (event) => {
                if (window.innerWidth > 820 || trigger.getAttribute("href") !== "#") {
                    return;
                }

                event.preventDefault();
                const isOpen = dropdown.classList.toggle("dropdown-open");
                trigger.setAttribute("aria-expanded", String(isOpen));
            });
        });

        navLinks.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                if (window.innerWidth <= 820 && link.getAttribute("href") !== "#") {
                    closeNav();
                }
            });
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 820) {
                closeNav();
            }
        });
    }
});
