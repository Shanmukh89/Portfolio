gsap.registerPlugin(ScrollTrigger, SplitText);

(function () {
                const LOADER_KEY = "loaderSeen";

                const loader = document.getElementById("loader");
                const loaderContainer = document.querySelector(".loader-container");
                const loaderDots = document.getElementById("loader-dots");
                const loaderCount = document.getElementById("loader-count");

                if (!loader || !loaderContainer || !loaderDots || !loaderCount) return;

                let count = 0;
                let dots = "";
                let isPageLoaded = false;
                let countReached100 = false;
                let dotInterval = null;
                const startTime = Date.now();

                const hasSeenLoader = sessionStorage.getItem(LOADER_KEY);

                const resetLoaderPosition = () => {
                    gsap.set(loader, { y: "0%" });
                };

                const updateDots = () => {
                    if (count >= 100 && isPageLoaded) {
                        loaderDots.textContent = "...";
                        return;
                    }
                    dots = dots.length < 3 ? dots + "." : "";
                    loaderDots.textContent = dots;
                };

                const updateCount = () => {
                    const elapsed = (Date.now() - startTime) / 1000;
                    const minTimeReached = elapsed >= 2;

                    if (count < 100) {
                        count += Math.random() * 3;
                        if (count > 100) count = 100;
                        loaderCount.textContent = Math.floor(count);
                    }

                    if (count >= 100 && minTimeReached && isPageLoaded) {
                        if (!countReached100) {
                            countReached100 = true;
                            loaderCount.textContent = 100;
                            finishLoader();
                        }
                    } else {
                        requestAnimationFrame(updateCount);
                    }
                };

                const finishLoader = () => {
                    if (dotInterval) clearInterval(dotInterval);

                    gsap.to(loader, {
                        y: "-100%",
                        duration: 1.2,
                        ease: "power3.inOut",
                        onComplete: () => {
                            gsap.set(loader, {
                                y: "0%",
                                autoAlpha: 0,
                                display: "none",
                            });
                            loaderContainer.style.display = "none";
                        },
                    });
                };

                const showLoaderFromBottom = (href) => {
                    gsap.set(loader, {
                        y: "100%",
                        autoAlpha: 1,
                        display: "block",
                    });

                    gsap.to(loader, {
                        y: "0%",
                        duration: 0.8,
                        ease: "power3.inOut",
                        onComplete: () => {
                            window.location.href = href;
                        },
                    });
                };

                document.querySelectorAll(".case-link, .back-link, .case-next").forEach((link) => {
                    link.addEventListener("click", (e) => {
                        const href = link.getAttribute("href");
                        if (!href) return;
                        e.preventDefault();
                        showLoaderFromBottom(href);
                    });
                });

                if (!hasSeenLoader) {
                    gsap.set(loader, {
                        y: "0%",
                        autoAlpha: 1,
                        display: "block",
                    });

                    loaderContainer.style.display = "block";

                    dotInterval = setInterval(updateDots, 500);

                    window.addEventListener("DOMContentLoaded", () => {
                        isPageLoaded = true;
                    });

                    requestAnimationFrame(updateCount);

                    sessionStorage.setItem(LOADER_KEY, "true");
                } else {
                    gsap.set(loader, {
                        y: "0%",
                        autoAlpha: 0,
                        display: "none",
                    });

                    loaderContainer.style.display = "none";

                    window.addEventListener("DOMContentLoaded", () => {
                        gsap.set(loader, {
                            y: "0%",
                            autoAlpha: 1,
                            display: "block",
                        });

                        gsap.to(loader, {
                            y: "-100%",
                            duration: 1.2,
                            ease: "power3.inOut",
                            onComplete: () => {
                                gsap.set(loader, {
                                    y: "0%",
                                    autoAlpha: 0,
                                    display: "none",
                                });
                            },
                        });
                    });
                }
            })();

document.addEventListener("DOMContentLoaded", () => {
                const DESKTOP_MIN = 992;

                const navbar = document.querySelector(".navbar");
                const staticNav = document.querySelector(".navbar-static");

                let lenis = null;

                let lastScrollY = window.pageYOffset || document.documentElement.scrollTop;
                let ticking = false;

                let stickAtY = 0;

                const computeStickThreshold = () => {
                    if (!navbar) return;
                    stickAtY =
                        (window.pageYOffset || document.documentElement.scrollTop) + navbar.getBoundingClientRect().top;
                };

                const setFixed = (value) => {
                    if (!navbar) return;
                    navbar.classList.toggle("fixed", value);
                };

                const onScroll = () => {
                    if (!navbar || !staticNav) return;

                    const currentY = window.pageYOffset || document.documentElement.scrollTop;

                    if (!ticking) {
                        ticking = true;
                        requestAnimationFrame(() => {
                            const scrollingDown = currentY > lastScrollY;
                            const scrollingUp = currentY < lastScrollY;

                            if (scrollingDown && currentY >= stickAtY) {
                                setFixed(true);
                            }

                            if (scrollingUp) {
                                const staticTop = staticNav.getBoundingClientRect().top;
                                if (staticTop >= 0) {
                                    setFixed(false);
                                }
                            }

                            lastScrollY = currentY <= 0 ? 0 : currentY;
                            ticking = false;
                        });
                    }
                };

                const enableLenis = () => {
                    if (lenis) return;
                    lenis = new Lenis({ autoRaf: true });
                };

                const disableLenis = () => {
                    if (!lenis) return;
                    lenis.destroy();
                    lenis = null;
                };

                const updateLenisByViewport = () => {
                    const isDesktop = window.innerWidth >= DESKTOP_MIN;
                    if (isDesktop) enableLenis();
                    else disableLenis();
                };

                computeStickThreshold();
                updateLenisByViewport();

                window.addEventListener("scroll", onScroll, { passive: true });

                let resizeRaf = null;
                window.addEventListener(
                    "resize",
                    () => {
                        if (resizeRaf) cancelAnimationFrame(resizeRaf);
                        resizeRaf = requestAnimationFrame(() => {
                            computeStickThreshold();
                            updateLenisByViewport();
                        });
                    },
                    { passive: true }
                );
            });

document.addEventListener("DOMContentLoaded", () => {
                const customCursor = document.getElementById("custom-cursor");
                if (!customCursor) return;

                let isCursorInitialized = false;

                const handleMouseMove = (e) => {
                    if (!isCursorInitialized) {
                        gsap.set(customCursor, { x: e.clientX, y: e.clientY, scale: 0 });
                        gsap.to(customCursor, { duration: 0.32, scale: 1, ease: "back.out(1.7)" });
                        isCursorInitialized = true;
                    } else {
                        gsap.to(customCursor, {
                            duration: 0.16,
                            x: e.clientX,
                            y: e.clientY,
                            ease: "power3.out",
                        });
                    }
                };

                function checkViewport() {
                    if (window.innerWidth > 991) {
                        document.addEventListener("mousemove", handleMouseMove);
                    }
                }

                window.addEventListener("resize", checkViewport);
                checkViewport();
            });

document.addEventListener("DOMContentLoaded", function () {
                ScrollTrigger.config({ ignoreMobileResize: true });
                const mmDesktop = window.matchMedia("(min-width: 992px)");

                if (mmDesktop.matches) {
                    gsap.set(".footer-reveal", { yPercent: -72 });

                    gsap.to(".footer-reveal", {
                        yPercent: 0,
                        ease: "none",
                        scrollTrigger: {
                            trigger: ".footer",
                            start: "top bottom",
                            end: "bottom bottom",
                            scrub: true,
                        },
                    });
                }

                const footer = document.querySelector("#footer");
                const overlay = document.querySelector(".bottom-overlay-wrapper");

                if (footer && overlay) {
                    const isMobile = window.innerWidth <= 768;
                    const footerThreshold = isMobile ? 0.32 : 0.5;

                    ScrollTrigger.create({
                        trigger: footer,
                        start: () => {
                            const footerHeight = footer.offsetHeight;
                            return `top bottom-=${footerHeight * footerThreshold}`;
                        },
                        onEnter: () => {
                            overlay.style.display = "none";
                        },
                        onLeaveBack: () => {
                            overlay.style.display = "";
                        },
                        invalidateOnRefresh: true,
                    });

                    let lastW = window.innerWidth;
                    window.addEventListener(
                        "resize",
                        () => {
                            const w = window.innerWidth;
                            if (w === lastW) return;
                            lastW = w;

                            requestAnimationFrame(() => ScrollTrigger.refresh());
                        },
                        { passive: true }
                    );
                }

                document.querySelectorAll(".footer-back-to-the-top").forEach((el) => {
                    el.addEventListener("click", function (e) {
                        e.preventDefault();
                        window.scrollTo({ top: 0, behavior: "smooth" });
                    });
                });
            });

document.addEventListener("DOMContentLoaded", () => {
                const sections = document.querySelectorAll("#about, #next-case");
                let img = document.querySelector("#about-image, #next-image");

                if (img && img.tagName === "SPAN") img = img.querySelector("img");
                if (!sections.length || !img) return;

                const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

                gsap.set(img, {
                    position: "fixed",
                    left: 0,
                    top: 0,
                    opacity: 0,
                    scale: 0.8,
                    x: 0,
                    y: 0,
                    rotationX: 0,
                    rotationY: 0,
                    scaleX: 1,
                    scaleY: 1,
                    transformOrigin: "top left",
                    transformPerspective: 900,
                    force3D: true,
                    pointerEvents: "none",
                    zIndex: 9999,
                    willChange: "transform, opacity",
                });

                let lastX = 0;
                let lastY = 0;
                let visible = false;

                let enterDelayCall = null;
                let idleResetTimer = null;
                let leaveFollowTimeout = null;
                let leaveMoveListenerActive = false;

                const xTo = gsap.quickTo(img, "x", { duration: 0.28, ease: "power3.out" });
                const yTo = gsap.quickTo(img, "y", { duration: 0.28, ease: "power3.out" });
                const rotXTo = gsap.quickTo(img, "rotationX", { duration: 0.45, ease: "power3.out" });
                const rotYTo = gsap.quickTo(img, "rotationY", { duration: 0.45, ease: "power3.out" });
                const scaleXTo = gsap.quickTo(img, "scaleX", { duration: 0.35, ease: "power3.out" });
                const scaleYTo = gsap.quickTo(img, "scaleY", { duration: 0.35, ease: "power3.out" });

                const showAnim = () => {
                    gsap.fromTo(
                        img,
                        { scale: 0.64, opacity: 0 },
                        { scale: 1, opacity: 1, duration: 0.32, ease: "back.out(1.7)" }
                    );
                };

                const hideAnim = () => {
                    gsap.to(img, {
                        opacity: 0,
                        scale: 0.8,
                        rotationX: 0,
                        rotationY: 0,
                        scaleX: 1,
                        scaleY: 1,
                        duration: 0.24,
                        ease: "power3.out",
                        onComplete: () => {
                            visible = false;
                        },
                    });
                };

                function resetTilt() {
                    rotXTo(0);
                    rotYTo(0);
                    scaleXTo(1);
                    scaleYTo(1);
                }

                function scheduleIdleResetByNoMove() {
                    if (idleResetTimer) clearTimeout(idleResetTimer);
                    idleResetTimer = setTimeout(() => {
                        resetTilt();
                    }, 120);
                }

                function handleEnter(e) {
                    if (window.innerWidth <= 991) return;

                    const x = e.clientX;
                    const y = e.clientY;

                    gsap.set(img, {
                        x: x + 12,
                        y: y + 12,
                        scale: 0.8,
                        opacity: 0,
                        rotationX: 0,
                        rotationY: 0,
                        scaleX: 1,
                        scaleY: 1,
                    });

                    lastX = x;
                    lastY = y;

                    if (leaveFollowTimeout) {
                        clearTimeout(leaveFollowTimeout);
                        leaveFollowTimeout = null;
                    }
                    if (leaveMoveListenerActive) {
                        window.removeEventListener("pointermove", handleLeaveMove);
                        leaveMoveListenerActive = false;
                    }

                    if (enterDelayCall) enterDelayCall.kill();
                    enterDelayCall = gsap.delayedCall(0.2, showAnim);

                    scheduleIdleResetByNoMove();
                }

                function updatePositionAndTilt(x, y) {
                    const vx = x - lastX;
                    const vy = y - lastY;
                    lastX = x;
                    lastY = y;

                    xTo(x + 12);
                    yTo(y + 12);

                    const speed = Math.hypot(vx, vy);

                    const speedNorm = clamp(speed / 35, 0, 1);
                    const tiltMax = 10;
                    const tilt = tiltMax * speedNorm;

                    const targetRotX = clamp((-vy / 12) * tilt, -tiltMax, tiltMax);
                    const targetRotY = clamp((vx / 12) * tilt, -tiltMax, tiltMax);

                    rotXTo(targetRotX);
                    rotYTo(targetRotY);

                    const s = 1 + 0.04 * speedNorm;
                    scaleXTo(s);
                    scaleYTo(s);

                    scheduleIdleResetByNoMove();
                }

                function handleMove(e) {
                    if (window.innerWidth <= 991) return;
                    if (!visible) visible = true;
                    updatePositionAndTilt(e.clientX, e.clientY);
                }

                function handleLeaveMove(e) {
                    updatePositionAndTilt(e.clientX, e.clientY);
                }

                function handleLeave() {
                    if (enterDelayCall) {
                        enterDelayCall.kill();
                        enterDelayCall = null;
                    }
                    if (idleResetTimer) {
                        clearTimeout(idleResetTimer);
                        idleResetTimer = null;
                    }

                    hideAnim();

                    if (!leaveMoveListenerActive) {
                        window.addEventListener("pointermove", handleLeaveMove);
                        leaveMoveListenerActive = true;
                    }

                    leaveFollowTimeout = setTimeout(() => {
                        if (leaveMoveListenerActive) {
                            window.removeEventListener("pointermove", handleLeaveMove);
                            leaveMoveListenerActive = false;
                        }
                    }, 1000);
                }

                sections.forEach((section) => {
                    section.addEventListener("pointerenter", handleEnter);
                    section.addEventListener("pointermove", handleMove);
                    section.addEventListener("pointerleave", handleLeave);
                });

                window.addEventListener("resize", () => {
                    if (window.innerWidth <= 991) {
                        gsap.set(img, { opacity: 0, scale: 0.8, rotationX: 0, rotationY: 0, scaleX: 1, scaleY: 1 });
                        visible = false;

                        if (enterDelayCall) {
                            enterDelayCall.kill();
                            enterDelayCall = null;
                        }
                        if (idleResetTimer) {
                            clearTimeout(idleResetTimer);
                            idleResetTimer = null;
                        }

                        if (leaveFollowTimeout) {
                            clearTimeout(leaveFollowTimeout);
                            leaveFollowTimeout = null;
                        }
                        if (leaveMoveListenerActive) {
                            window.removeEventListener("pointermove", handleLeaveMove);
                            leaveMoveListenerActive = false;
                        }
                    }
                });
            });

document.addEventListener("DOMContentLoaded", () => {
                const MOBILE_MAX = 767;
                const OFFSET = 64;

                const button = document.querySelector(".case-info-button");
                const floating = document.querySelector(".case-info.scrollable");
                const next = document.querySelector(".case-next");

                if (!button || !floating || !next || typeof gsap === "undefined") return;

                let ioButton = null;
                let ioNext = null;
                let bottomSentinel = null;
                let nextSentinel = null;

                let passedButton = false;
                let reachedNext = false;
                let active = false;

                const show = () => {
                    if (floating.classList.contains("visible")) return;

                    floating.classList.add("visible");
                    gsap.killTweensOf(floating);

                    gsap.to(floating, {
                        scale: 1,
                        opacity: 1,
                        duration: 0.32,
                        ease: "power2.out",
                        overwrite: "auto",
                    });
                };

                const hide = (immediate = false) => {
                    gsap.killTweensOf(floating);

                    if (immediate) {
                        floating.classList.remove("visible");
                        gsap.set(floating, { scale: 0.88, opacity: 0 });
                        return;
                    }

                    if (!floating.classList.contains("visible")) return;

                    gsap.to(floating, {
                        scale: 0.88,
                        opacity: 0,
                        duration: 0.24,
                        ease: "power2.out",
                        overwrite: "auto",
                        onComplete: () => floating.classList.remove("visible"),
                    });
                };

                const update = () => {
                    if (passedButton && !reachedNext) show();
                    else hide();
                };

                const initMobile = () => {
                    if (active) return;
                    active = true;

                    gsap.set(floating, {
                        scale: 0.88,
                        opacity: 0,
                        transformOrigin: "50% 50%",
                        willChange: "transform, opacity",
                    });
                    floating.classList.remove("visible");

                    bottomSentinel = document.createElement("div");
                    bottomSentinel.style.cssText = `
        position:absolute;
        left:0; right:0; bottom:0;
        height:1px;
        pointer-events:none;
      `;
                    button.style.position ||= "relative";
                    button.appendChild(bottomSentinel);

                    nextSentinel = document.createElement("div");
                    nextSentinel.style.cssText = `
        position:relative;
        height:1px;
        top:-${OFFSET}px;
        pointer-events:none;
      `;
                    next.parentNode.insertBefore(nextSentinel, next);

                    passedButton = false;
                    reachedNext = false;

                    ioButton = new IntersectionObserver(([e]) => {
                        if (!e.isIntersecting && e.boundingClientRect.top < 0) passedButton = true;
                        if (e.isIntersecting || e.boundingClientRect.top >= 0) passedButton = false;
                        update();
                    });

                    ioNext = new IntersectionObserver(([e]) => {
                        reachedNext = e.isIntersecting;
                        if (!e.isIntersecting && e.boundingClientRect.top < 0) reachedNext = true;
                        if (!e.isIntersecting && e.boundingClientRect.top > 0) reachedNext = false;
                        update();
                    });

                    ioButton.observe(bottomSentinel);
                    ioNext.observe(nextSentinel);
                };

                const destroyMobile = () => {
                    if (!active) return;
                    active = false;

                    ioButton?.disconnect();
                    ioNext?.disconnect();

                    ioButton = null;
                    ioNext = null;

                    bottomSentinel?.remove();
                    nextSentinel?.remove();

                    bottomSentinel = null;
                    nextSentinel = null;

                    hide(true);
                };

                const check = () => {
                    if (window.innerWidth <= MOBILE_MAX) initMobile();
                    else destroyMobile();
                };

                check();

                window.addEventListener("resize", () => {
                    requestAnimationFrame(check);
                });
            });