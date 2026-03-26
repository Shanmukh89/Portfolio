document.addEventListener("DOMContentLoaded", function () {
                const navButton = document.querySelector("#menu-button");
                const navMenu = document.querySelector("#nav-menu");
                const navLogo = document.querySelector(".nav-logo");
                const navButtons = navMenu.querySelectorAll(".nav-button");

                let menuOpen = false;
                let tl;

                // Initial states
                gsap.set(navMenu, { opacity: 0, x: -12, pointerEvents: "none" });
                if (navLogo) gsap.set(navLogo, { autoAlpha: 1 });

                function buildTimeline(isSmall) {
                    if (tl) tl.kill();

                    tl = gsap.timeline({ paused: true });

                    // <= 400px: first hide logo, then show menu + links (same animations as before)
                    if (isSmall && navLogo) {
                        tl.to(navLogo, {
                            duration: 0.18,
                            autoAlpha: 0,
                            ease: "power2.out",
                        });
                    }

                    tl.to(navMenu, {
                        duration: 0.32,
                        opacity: 1,
                        x: 0,
                        ease: "power2.out",
                        pointerEvents: "auto",
                    });

                    tl.from(
                        navButtons,
                        {
                            duration: 0.48,
                            opacity: 0,
                            filter: "blur(1px)",
                            ease: "power2.out",
                            stagger: 0.16,
                        },
                        "-=0.24"
                    );

                    return tl;
                }

                // Rebuild timeline depending on screen size (handles resize too)
                const mm = gsap.matchMedia();
                mm.add("(max-width: 400px)", () => buildTimeline(true));
                mm.add("(min-width: 401px)", () => buildTimeline(false));

                navButton.addEventListener("click", function () {
                    if (!menuOpen) {
                        tl.play();
                        navButton.textContent = "Close";
                    } else {
                        tl.reverse(); // reverse will hide links/menu first, then show logo back on <=400px
                        navButton.textContent = "Menu";
                    }
                    menuOpen = !menuOpen;
                });
            });

document.addEventListener("DOMContentLoaded", () => {
                const bar = document.querySelector(".bar.black.top");
                const cta = document.querySelector(".right-hero-cta-mobile");

                if (!bar || !cta || typeof gsap === "undefined") return;

                const BREAKPOINT = 991;

                const OUT_DUR = 0.18;
                const IN_DUR = 0.22;
                const EASE = "power2.out";

                let io = null;
                let tl = null;
                let isScrolled = false;

                const cleanup = () => {
                    if (io) {
                        io.disconnect();
                        io = null;
                    }
                    if (tl) {
                        tl.kill();
                        tl = null;
                    }
                    gsap.killTweensOf(cta);

                    // reset do stanu bazowego
                    cta.classList.remove("cta-scrolled");
                    gsap.set(cta, { opacity: 1 });
                    isScrolled = false;
                };

                const transition = (toScrolled) => {
                    if (toScrolled === isScrolled) return;
                    isScrolled = toScrolled;

                    if (tl) tl.kill();
                    gsap.killTweensOf(cta);

                    tl = gsap.timeline({ defaults: { overwrite: "auto" } });

                    tl.to(cta, { opacity: 0, duration: OUT_DUR, ease: EASE });
                    tl.add(() => {
                        cta.classList.toggle("cta-scrolled", toScrolled);
                    });
                    tl.to(cta, { opacity: 1, duration: IN_DUR, ease: EASE });
                };

                const setupMobile = () => {
                    cleanup(); // na wszelki wypadek

                    const barHeight = bar.offsetHeight;

                    io = new IntersectionObserver(
                        ([entry]) => {
                            transition(!entry.isIntersecting);
                        },
                        {
                            root: null,
                            threshold: 0,
                            rootMargin: `-${barHeight}px 0px 0px 0px`,
                        }
                    );

                    io.observe(bar);
                };

                const check = () => {
                    if (window.innerWidth <= BREAKPOINT) {
                        if (!io) setupMobile();
                    } else {
                        cleanup();
                    }
                };

                check();

                window.addEventListener("resize", check);
            });

document.addEventListener("DOMContentLoaded", () => {
                const DESKTOP_MIN = 992;

                const logo = document.querySelector(".keda-logo");
                if (!logo) return;

                const txtEl = logo.querySelector(".keda-logo-txt");
                if (!txtEl) return;

                const original = txtEl.dataset.original || txtEl.textContent;
                const target = txtEl.dataset.target || "";
                const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

                let interval = null;
                let isActive = false;

                const getRandomChar = () => characters.charAt(Math.floor(Math.random() * characters.length));

                const shuffleLetters = (fromText, toText, direction = "in") => {
                    clearInterval(interval);

                    const maxFrames = 30;
                    let frame = 0;

                    interval = setInterval(() => {
                        frame++;

                        const result = [];
                        const length =
                            direction === "in"
                                ? Math.max(toText.length, fromText.length - Math.floor(frame / 2))
                                : Math.min(fromText.length, toText.length + Math.floor(frame / 2));

                        for (let i = 0; i < length; i++) {
                            const char = direction === "in" ? toText[i] : fromText[i];

                            result[i] = char && frame > i + 3 ? char : getRandomChar();
                        }

                        txtEl.textContent = result.join("");

                        if (frame >= maxFrames || txtEl.textContent === (direction === "in" ? toText : fromText)) {
                            clearInterval(interval);
                            txtEl.textContent = direction === "in" ? toText : fromText;
                        }
                    }, 40);
                };

                const onEnter = () => shuffleLetters(original, target, "in");
                const onLeave = () => shuffleLetters(original, target, "out");

                const enableHover = () => {
                    if (isActive) return;
                    isActive = true;

                    txtEl.textContent = original;
                    logo.addEventListener("mouseenter", onEnter);
                    logo.addEventListener("mouseleave", onLeave);
                };

                const disableHover = () => {
                    if (!isActive) return;
                    isActive = false;

                    clearInterval(interval);
                    logo.removeEventListener("mouseenter", onEnter);
                    logo.removeEventListener("mouseleave", onLeave);
                    txtEl.textContent = original;
                };

                const checkViewport = () => {
                    if (window.innerWidth >= DESKTOP_MIN) {
                        enableHover();
                    } else {
                        disableHover();
                    }
                };

                checkViewport();

                window.addEventListener("resize", checkViewport);
            });

function updateWarsawTime() {
                const warsawTimeEl = document.querySelector(".warsaw-time");
                if (!warsawTimeEl) return;

                const now = new Date();
                const warsawTime = new Intl.DateTimeFormat("en-GB", {
                    timeZone: "Europe/Warsaw",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                }).format(now);

                warsawTimeEl.textContent = warsawTime.toLowerCase();
            }

            updateWarsawTime();

            setInterval(updateWarsawTime, 60000);

document.addEventListener("DOMContentLoaded", () => {
                const el = document.querySelector(".hero-title-italic");

                if (!el) return;

                if (!el.hasAttribute("data-text")) {
                    el.setAttribute("data-text", el.textContent);
                }

                const glitchOnce = () => {
                    const timeline = gsap.timeline({
                        onComplete: scheduleNext,
                    });

                    const flickerFrames = Math.floor(Math.random() * 3) + 2;

                    for (let i = 0; i < flickerFrames; i++) {
                        const offsetBefore = `${Math.random() * 12 - 6}px`;
                        const offsetAfter = `${Math.random() * 12 - 6}px`;
                        const skew = `${Math.random() * 30 - 15}deg`;
                        const scale = 0.9 + Math.random() * 0.2;
                        const z = Math.floor(Math.random() * 10) + 2;

                        const shiftX = Math.random() * 4 - 2;
                        const shiftY = Math.random() * 2 - 1;
                        const blur = Math.random() < 0.5 ? "1px" : "0px";

                        timeline.to(el, {
                            duration: 0.04 + Math.random() * 0.03,
                            "--glitch-opacity": 1,
                            "--glitch-offset-before": offsetBefore,
                            "--glitch-offset-after": offsetAfter,
                            "--glitch-skew": skew,
                            "--glitch-scale": scale,
                            zIndex: z,
                            x: shiftX,
                            y: shiftY,
                            filter: `blur(${blur})`,
                            ease: "power2.inOut",
                        });

                        timeline.to(el, {
                            duration: 0.03 + Math.random() * 0.02,
                            "--glitch-opacity": 0,
                            "--glitch-offset-before": "0px",
                            "--glitch-offset-after": "0px",
                            "--glitch-skew": "0deg",
                            "--glitch-scale": 1,
                            zIndex: 1,
                            x: 0,
                            y: 0,
                            filter: "blur(0px)",
                            ease: "power3.out",
                        });
                    }
                };

                const scheduleNext = () => {
                    const delay = Math.random() * (1200 - 200) + 200;
                    setTimeout(glitchOnce, delay);
                };

                scheduleNext();
            });

document.addEventListener("DOMContentLoaded", () => {
                const DESKTOP_BREAKPOINT = 992;

                if (window.innerWidth < DESKTOP_BREAKPOINT) return;

                const cases = document.querySelectorAll(".works-content");

                cases.forEach((item) => {
                    const img = item.querySelector(".hero-case-image");
                    const desc = item.querySelector(".case-description");

                    if (!img || !desc) return;

                    const descSplit = SplitText.create(desc, { type: "words" });

                    const hoverTL = gsap.timeline({ paused: true });

                    hoverTL.fromTo(
                        descSplit.words,
                        {
                            opacity: 0,
                            filter: "blur(8px)",
                        },
                        {
                            duration: 0.48,
                            opacity: 1,
                            filter: "blur(0px)",
                            stagger: 0.04,
                            ease: "power2.out",
                        }
                    );

                    img.addEventListener("mouseenter", () => hoverTL.play());
                    img.addEventListener("mouseleave", () => hoverTL.reverse());
                });
            });

document.addEventListener("DOMContentLoaded", () => {
                const accessToken = "7288dcd90fc83df8937d29ef5be6a183077f817a4d06b31a946bc0cd4a7c5a72";

                const dribbbleTrack = document.querySelector(".dribbble-track");
                const prototypeCase = document.querySelector(".dribbble-case");
                const swiperEl = document.querySelector(".dribbble-swiper");

                if (!dribbbleTrack || !prototypeCase || !swiperEl) {
                    console.error("Missing .dribbble-track, .dribbble-case or .dribbble-swiper element.");
                    return;
                }

                const isMobile = window.innerWidth < 768;
                const perPage = isMobile ? 12 : 24;

                swiperEl.classList.add("swiper");
                dribbbleTrack.classList.add("swiper-wrapper");

                function shuffleShots(shots) {
                    const array = [...shots];
                    const randomBuffer = new Uint32Array(1);
                    for (let i = array.length - 1; i > 0; i--) {
                        window.crypto.getRandomValues(randomBuffer);
                        const j = randomBuffer[0] % (i + 1);
                        [array[i], array[j]] = [array[j], array[i]];
                    }
                    return array;
                }

                function ensureImgLoaded(slideEl) {
                    if (!slideEl) return;
                    const img = slideEl.querySelector(".dribbble-image");
                    if (!img) return;

                    const dataSrc = img.getAttribute("data-src");
                    if (!dataSrc) return;

                    if (img.getAttribute("src")) return;

                    img.loading = "eager";
                    img.decoding = "async";
                    img.src = dataSrc;
                    img.removeAttribute("data-src");
                }

                function preloadNeighbors(swiper) {
                    ensureImgLoaded(swiper.slides[swiper.activeIndex]);
                    ensureImgLoaded(swiper.slides[swiper.activeIndex - 1]);
                    ensureImgLoaded(swiper.slides[swiper.activeIndex + 1]);
                }

                fetch(`https://api.dribbble.com/v2/user/shots?access_token=${accessToken}&per_page=${perPage}`)
                    .then((r) => r.json())
                    .then((shots) => {
                        const items = shuffleShots(shots);

                        dribbbleTrack.innerHTML = "";

                        items.forEach((shot, index) => {
                            const slide = prototypeCase.cloneNode(true);
                            slide.classList.add("swiper-slide");
                            slide.href = shot.html_url;

                            const img = slide.querySelector(".dribbble-image");
                            if (img) {
                                const desktopSrc = shot.images.hidpi || shot.images.normal || shot.images.teaser;
                                const mobileSrc = shot.images.normal || shot.images.teaser || shot.images.hidpi;

                                if (isMobile) {
                                    img.removeAttribute("src");
                                    img.setAttribute("data-src", mobileSrc);
                                    img.alt = shot.title;

                                    if (index < 3) {
                                        img.loading = "eager";
                                        img.src = mobileSrc;
                                        img.removeAttribute("data-src");
                                    }
                                } else {
                                    img.src = desktopSrc;
                                    img.alt = shot.title;
                                    img.loading = index < 8 ? "eager" : "lazy";
                                    img.decoding = "async";
                                }
                            }

                            dribbbleTrack.appendChild(slide);
                        });

                        if (isMobile) {
                            const slidesCount = items.length;

                            const swiper = new Swiper(swiperEl, {
                                loop: true,
                                effect: "coverflow",
                                slidesPerView: 1.5,
                                centeredSlides: true,
                                initialSlide: Math.floor(slidesCount / 2),

                                autoplay: {
                                    delay: 2400,
                                    disableOnInteraction: false,
                                },

                                spaceBetween: 16,
                                speed: 600,
                                watchSlidesProgress: true,
                                allowTouchMove: true,

                                observer: true,
                                observeParents: true,
                                observeSlideChildren: true,

                                preloadImages: false,
                                lazy: false,

                                coverflowEffect: {
                                    rotate: 30,
                                    slideShadows: false,
                                    depth: 100,
                                    stretch: 0,
                                },

                                on: {
                                    init(sw) {
                                        preloadNeighbors(sw);
                                        requestAnimationFrame(() => sw.update());
                                    },
                                    slideChange(sw) {
                                        preloadNeighbors(sw);
                                    },
                                    slideChangeTransitionEnd(sw) {
                                        sw.update();
                                    },
                                    touchStart(sw) {
                                        preloadNeighbors(sw);
                                    },
                                },
                            });

                            preloadNeighbors(swiper);
                        } else {
                            const track = dribbbleTrack;

                            const slides = Array.from(track.children);
                            slides.forEach((slide) => track.appendChild(slide.cloneNode(true)));

                            const trackWidth = track.scrollWidth / 2;

                            gsap.set(track, { x: 0 });

                            const tickerTween = gsap.to(track, {
                                x: -trackWidth,
                                duration: 80,
                                ease: "none",
                                repeat: -1,
                                modifiers: {
                                    x: gsap.utils.unitize(gsap.utils.wrap(-trackWidth, 0)),
                                },
                            });

                            swiperEl.addEventListener("mouseenter", () => {
                                gsap.to(tickerTween, { timeScale: 0.3, duration: 0.5, ease: "power2.out" });
                            });

                            swiperEl.addEventListener("mouseleave", () => {
                                gsap.to(tickerTween, { timeScale: 1, duration: 0.3, ease: "power1.inOut" });
                            });
                        }
                    })
                    .catch((error) => {
                        console.error("Error fetching posts:", error);
                    });
            });

document.addEventListener("DOMContentLoaded", () => {
                const customCursor = document.getElementById("custom-cursor");
                const cursorText = customCursor.querySelector(".cursor-text");

                const initialState = {
                    width: 12,
                    height: 12,
                    background: "white",
                    backdropFilter: "none",
                    mixBlendMode: "difference",
                    color: "white",
                };

                const hoverState = {
                    width: 80,
                    height: 80,
                    background: "rgba(255,255,255,0.48)",
                    backdropFilter: "blur(12px)",
                    mixBlendMode: "unset",
                    color: "black",
                };

                gsap.set(customCursor, initialState);
                gsap.set(cursorText, { opacity: 0 });

                const hoverInTimeline = gsap.timeline({ paused: true });
                hoverInTimeline
                    .fromTo(
                        customCursor,
                        { ...initialState },
                        { ...hoverState, duration: 0.24, ease: "power3.out", immediateRender: false },
                        0
                    )
                    .fromTo(
                        cursorText,
                        { opacity: 0 },
                        { opacity: 1, duration: 0.32, ease: "power2.inOut", immediateRender: false },
                        0
                    );

                const hoverOutTimeline = gsap.timeline({ paused: true });
                hoverOutTimeline
                    .fromTo(
                        cursorText,
                        { opacity: 1 },
                        { opacity: 0, duration: 0.08, ease: "power2.out", immediateRender: false },
                        0
                    )
                    .fromTo(
                        customCursor,
                        { ...hoverState },
                        { ...initialState, duration: 0.3, ease: "power2.out", immediateRender: false },
                        0
                    );

                setTimeout(() => {
                    const targets = document.querySelectorAll(".case-link, .dribbble-case");

                    const handleMouseEnter = (e) => {
                        hoverOutTimeline.pause(0);
                        hoverInTimeline.pause(0).progress(0).play();
                    };

                    const handleMouseLeave = (e) => {
                        hoverInTimeline.pause(0);
                        hoverOutTimeline.pause(0).progress(0).play();
                    };

                    const checkViewport = () => {
                        if (window.innerWidth > 991) {
                            targets.forEach((target) => {
                                target.addEventListener("mouseenter", handleMouseEnter);
                                target.addEventListener("mouseleave", handleMouseLeave);
                            });
                        } else {
                            targets.forEach((target) => {
                                target.removeEventListener("mouseenter", handleMouseEnter);
                                target.removeEventListener("mouseleave", handleMouseLeave);
                            });
                        }
                    };

                    window.addEventListener("resize", checkViewport);
                    checkViewport();
                }, 2000);
            });

document.addEventListener("DOMContentLoaded", () => {
                const DESKTOP_MIN = 992;

                const serviceItems = document.querySelectorAll(".services-item");
                const allImages = document.querySelectorAll(".services-image");

                let currentImage = null;
                let activeImageTween = null;
                let zIndexCounter = 1;
                let hoverDebounceFrame = null;
                let lastTriggerValue = null;

                gsap.set(allImages, {
                    y: "0%",
                    scale: 1,
                    autoAlpha: 0,
                });

                const debounceHover = (callback, delay = 50) => {
                    let timeout;
                    return (...args) => {
                        if (timeout) cancelAnimationFrame(timeout);
                        timeout = requestAnimationFrame(() => {
                            setTimeout(() => callback(...args), delay);
                        });
                    };
                };

                const isDesktopNow = () => window.innerWidth >= DESKTOP_MIN;

                const getRelatedImage = (item) => {
                    const triggerValue = item?.dataset?.trigger;
                    if (!triggerValue) return null;
                    return document.querySelector(`.services-image[data-service="${triggerValue}"]`);
                };

                const animateLabelDesktop = (item, direction = "bottom") => {
                    const textEl = item.querySelector(".skills-item-label");
                    if (!textEl) return;

                    gsap.set(textEl, { overflow: "hidden" });

                    const textTarget =
                        textEl.querySelector("[data-label-inner]") ||
                        textEl.querySelector(".skills-item-label-inner") ||
                        textEl.querySelector("span") ||
                        textEl;

                    gsap.killTweensOf(textTarget);

                    const tl = gsap.timeline();
                    if (direction === "top") {
                        tl.to(textTarget, { duration: 0.16, y: "104%", ease: "power2.out" })
                            .set(textTarget, { y: "-104%" })
                            .to(textTarget, { duration: 0.16, y: "0%", ease: "power2.out" });
                    } else {
                        tl.to(textTarget, { duration: 0.16, y: "-104%", ease: "power2.out" })
                            .set(textTarget, { y: "104%" })
                            .to(textTarget, { duration: 0.16, y: "0%", ease: "power2.out" });
                    }
                };

                const setActiveMobile = (activeItem) => {
                    serviceItems.forEach((it) => {
                        if (it === activeItem) it.classList.add("active");
                        else it.classList.remove("active");
                    });
                };

                const activateItem = (item, direction = "bottom", opts = {}) => {
                    if (!item) return;

                    const { force = false, animateText = true, setActive = false } = opts;

                    const triggerValue = item.dataset.trigger;
                    const relatedImage = getRelatedImage(item);
                    if (!relatedImage) return;

                    if (!force && triggerValue && triggerValue === lastTriggerValue) return;
                    lastTriggerValue = triggerValue || null;

                    const fromY = direction === "top" ? "-100%" : "100%";

                    if (currentImage === relatedImage) {
                        if (setActive) setActiveMobile(item);
                        if (animateText) animateLabelDesktop(item, direction);
                        return;
                    }

                    if (activeImageTween) activeImageTween.kill();

                    if (currentImage && currentImage !== relatedImage) {
                        gsap.to(currentImage, {
                            duration: 0.28,
                            autoAlpha: 0,
                            ease: "power2.out",
                        });
                    }

                    zIndexCounter++;
                    gsap.set(relatedImage, {
                        y: fromY,
                        scale: 1.24,
                        zIndex: zIndexCounter,
                        autoAlpha: 1,
                    });

                    activeImageTween = gsap.to(relatedImage, {
                        duration: 0.62,
                        y: "0%",
                        scale: 1,
                        ease: "power2.out",
                    });

                    currentImage = relatedImage;

                    if (setActive) setActiveMobile(item);
                    if (animateText) animateLabelDesktop(item, direction);
                };

                const handleHover = debounceHover((item, direction) => {
                    activateItem(item, direction, {
                        animateText: true,
                        setActive: false,
                    });
                }, 50);

                const bind = () => {
                    const desktop = isDesktopNow();

                    serviceItems.forEach((item) => {
                        if (desktop) {
                            item.addEventListener("mouseenter", (e) => {
                                const rect = item.getBoundingClientRect();
                                const midY = rect.top + rect.height / 2;
                                const direction = e.clientY < midY ? "top" : "bottom";

                                if (hoverDebounceFrame) cancelAnimationFrame(hoverDebounceFrame);
                                hoverDebounceFrame = requestAnimationFrame(() => {
                                    handleHover(item, direction);
                                });
                            });
                        } else {
                            let lastTouchAt = 0;

                            const onTap = () =>
                                activateItem(item, "bottom", {
                                    animateText: false,
                                    setActive: true,
                                });

                            item.addEventListener("click", () => {
                                if (Date.now() - lastTouchAt < 500) return;
                                onTap();
                            });
                        }
                    });
                };

                bind();

                const firstItem = serviceItems[0];
                if (firstItem) {
                    if (isDesktopNow()) {
                        activateItem(firstItem, "bottom", { animateText: true, setActive: false, force: true });
                    } else {
                        activateItem(firstItem, "bottom", { animateText: false, setActive: true, force: true });
                    }
                }
            });
