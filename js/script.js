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

    const enhanceProductReviewPage = () => {
        const detailSection = document.querySelector(".product-detail");
        if (!detailSection) {
            return;
        }

        document.body.classList.add("review-page");

        const detailContainer = detailSection.querySelector(".container");
        const title = detailSection.querySelector("h1");
        const intro = detailSection.querySelector(".product-intro, .overview");
        const rating = detailSection.querySelector(".rating");
        const buyLink = detailSection.querySelector('a[href*="amzn.to"]');
        const featuresHeading = Array.from(detailSection.querySelectorAll("h2")).find((heading) =>
            heading.textContent.toLowerCase().includes("feature")
        );
        const featuresList = featuresHeading?.nextElementSibling?.matches("ul") ? featuresHeading.nextElementSibling : detailSection.querySelector(".features-list");
        const whoHeading = Array.from(detailSection.querySelectorAll("h2")).find((heading) =>
            heading.textContent.toLowerCase().includes("who should buy")
        );
        const whoList = whoHeading?.nextElementSibling?.matches("ul") ? whoHeading.nextElementSibling : detailSection.querySelector(".target-audience ul");
        const verdictHeading = Array.from(detailSection.querySelectorAll("h2")).find((heading) =>
            heading.textContent.toLowerCase().includes("verdict")
        );
        const verdictSection = verdictHeading?.closest(".verdict") || verdictHeading?.parentElement;
        const gallery = detailSection.querySelector(".product-images");
        const standaloneImage = detailSection.querySelector(".product-image");

        if (detailContainer && title) {
            const crumbs = document.createElement("div");
            crumbs.className = "review-crumbs";
            crumbs.innerHTML = '<a href="index.html">Home</a><span>/</span><a href="products.html">Products</a><span>/</span><span>Review</span>';
            detailContainer.prepend(crumbs);
        }

        if (title && !detailSection.querySelector(".review-kicker")) {
            const kicker = document.createElement("div");
            kicker.className = "review-kicker";
            kicker.textContent = "RawWanderer Review";
            title.parentElement?.insertBefore(kicker, title);
        }

        if (intro && featuresList) {
            const featureItems = Array.from(featuresList.querySelectorAll("li"))
                .map((item) => item.textContent.trim())
                .filter(Boolean)
                .slice(0, 3);

            if (featureItems.length && !intro.parentElement?.querySelector(".review-highlight")) {
                const chipRow = document.createElement("div");
                chipRow.className = "review-highlight";
                featureItems.forEach((item) => {
                    const chip = document.createElement("span");
                    chip.className = "review-chip";
                    chip.textContent = item;
                    chipRow.appendChild(chip);
                });

                intro.insertAdjacentElement("afterend", chipRow);
            }
        }

        if (title && !detailSection.querySelector(".review-quick-grid")) {
            const reviewCountMatch = rating?.textContent.match(/\(([^)]+)\)/);
            const quickGrid = document.createElement("div");
            quickGrid.className = "review-quick-grid";

            const stats = [
                { label: "Review signal", value: reviewCountMatch ? reviewCountMatch[1] : "High interest" },
                { label: "Feature count", value: featuresList ? `${featuresList.querySelectorAll("li").length}+ highlights` : "Quick review" },
                { label: "Best for", value: whoList?.querySelector("li")?.textContent.trim() || "Everyday buyers" }
            ];

            stats.forEach((stat) => {
                const card = document.createElement("div");
                card.className = "review-stat";
                card.innerHTML = `<strong>${stat.value}</strong><span>${stat.label}</span>`;
                quickGrid.appendChild(card);
            });

            const targetContainer = intro?.parentElement || title.parentElement;
            targetContainer?.appendChild(quickGrid);
        }

        if (buyLink && !detailSection.querySelector(".review-buy-box") && verdictSection) {
            const buyBox = document.createElement("div");
            buyBox.className = "review-buy-box";
            buyBox.innerHTML = `
                <h3>Ready to check the deal?</h3>
                <p>This review keeps the original affiliate link already saved in your project.</p>
            `;

            const clonedLink = buyLink.cloneNode(true);
            clonedLink.textContent = "Check on Amazon";
            clonedLink.setAttribute("rel", "noopener noreferrer");
            buyBox.appendChild(clonedLink);
            verdictSection.appendChild(buyBox);
        }

        if (title && !detailSection.querySelector(".review-jump-nav")) {
            const jumpNav = document.createElement("div");
            jumpNav.className = "review-jump-nav";

            const jumpTargets = [
                { label: "Features", heading: featuresHeading },
                { label: "Pros & Cons", heading: Array.from(detailSection.querySelectorAll("h2, h3")).find((el) => el.textContent.toLowerCase().includes("pros")) },
                { label: "Who It's For", heading: whoHeading },
                { label: "Verdict", heading: verdictHeading }
            ].filter((item) => item.heading);

            jumpTargets.forEach((item, index) => {
                const id = item.heading.id || `review-section-${index + 1}`;
                item.heading.id = id;
                const link = document.createElement("a");
                link.href = `#${id}`;
                link.textContent = item.label;
                jumpNav.appendChild(link);
            });

            if (jumpNav.childElementCount) {
                const targetContainer = intro?.parentElement || title.parentElement;
                targetContainer?.appendChild(jumpNav);
            }
        }

        if (gallery && !gallery.classList.contains("review-gallery")) {
            const images = Array.from(gallery.querySelectorAll("img"));
            if (!images.length) {
                return;
            }

            gallery.classList.add("review-gallery");

            const stage = document.createElement("div");
            stage.className = "review-gallery-stage";

            const stageImage = images[0].cloneNode(true);
            stage.appendChild(stageImage);

            const thumbGrid = document.createElement("div");
            thumbGrid.className = "review-thumbs";

            images.forEach((img, index) => {
                const button = document.createElement("button");
                button.type = "button";
                button.className = `review-thumb${index === 0 ? " is-active" : ""}`;
                button.setAttribute("aria-label", `View image ${index + 1}`);

                const thumbImage = img.cloneNode(true);
                button.appendChild(thumbImage);

                button.addEventListener("click", () => {
                    stageImage.src = img.src;
                    stageImage.alt = img.alt;
                    thumbGrid.querySelectorAll(".review-thumb").forEach((thumb) => thumb.classList.remove("is-active"));
                    button.classList.add("is-active");
                });

                thumbGrid.appendChild(button);
            });

            gallery.innerHTML = "";
            gallery.append(stage, thumbGrid);
        } else if (standaloneImage && !standaloneImage.classList.contains("review-gallery")) {
            standaloneImage.classList.add("review-gallery");
        }
    };

    enhanceProductReviewPage();

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
