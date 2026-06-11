(() => {
  const header = document.querySelector("[data-header]");
  const nav = document.querySelector("[data-nav]");
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const navLinks = [...document.querySelectorAll(".main-nav a")];
  const horizontalWork = document.querySelector("[data-horizontal-work]");
  const workTrack = document.querySelector("[data-work-track]");
  const workSection = document.querySelector("#work");
  const workIndex = document.querySelector("[data-work-index]");
  const workModeButtons = [...document.querySelectorAll("[data-work-mode]")];
  const filterButtons = [...document.querySelectorAll("[data-filter]")];
  const contactForm = document.querySelector("[data-form]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const smoothScrollEnabled = false;
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);
  const aboutCollage = document.querySelector(".about-collage");
  const heroScene = document.querySelector(".studio-landing");
  const pageLoader = document.querySelector("[data-loader]");
  const loaderCount = document.querySelector("[data-loader-count]");
  const loaderSlides = Array.from(document.querySelectorAll("[data-loader-slide]"));

  function initPageLoader() {
    if (!pageLoader) return;

    const minimumDuration = reducedMotion ? 450 : 2200;
    const startedAt = performance.now();
    let progress = 0;
    let isLoaded = false;
    let isDone = false;
    let activeSlide = 0;

    function setActiveSlide(index) {
      if (!loaderSlides.length) return;
      activeSlide = ((index % loaderSlides.length) + loaderSlides.length) % loaderSlides.length;
      loaderSlides.forEach((slide, slideIndex) => {
        slide.classList.toggle("is-active", slideIndex === activeSlide);
      });
    }

    function setProgress(value) {
      const safeValue = Math.max(0, Math.min(100, value));
      progress = safeValue;
      pageLoader.style.setProperty("--loader-progress", (safeValue / 100).toFixed(3));
      if (loaderCount) loaderCount.textContent = `${Math.round(safeValue).toString().padStart(2, "0")}%`;
    }

    function finish() {
      if (isDone) return;
      isDone = true;
      setProgress(100);
      setActiveSlide(loaderSlides.length - 1);
      if (slideTimer) window.clearInterval(slideTimer);
      window.setTimeout(() => {
        pageLoader.classList.add("is-hidden");
        document.body.classList.remove("is-loading");
      }, reducedMotion ? 80 : 320);
      window.setTimeout(() => pageLoader.remove(), reducedMotion ? 450 : 1100);
    }

    setActiveSlide(0);
    const slideTimer = loaderSlides.length > 1 ? window.setInterval(() => {
      if (isDone) {
        window.clearInterval(slideTimer);
        return;
      }
      setActiveSlide(activeSlide + 1);
    }, reducedMotion ? 380 : 520) : null;

    const timer = window.setInterval(() => {
      if (isDone) {
        window.clearInterval(timer);
        return;
      }

      const target = isLoaded ? 100 : 92;
      const speed = isLoaded ? 0.32 : 0.075;
      setProgress(progress + (target - progress) * speed + 0.4);

      if (isLoaded && progress >= 99) {
        window.clearInterval(timer);
        finish();
      }
    }, 70);

    function requestFinish() {
      if (isLoaded) return;
      isLoaded = true;
      const elapsed = performance.now() - startedAt;
      const delay = Math.max(0, minimumDuration - elapsed);
      window.setTimeout(() => setProgress(100), delay);
    }

    if (document.readyState === "complete") {
      requestFinish();
    } else {
      window.addEventListener("load", requestFinish, { once: true });
    }

    window.setTimeout(requestFinish, 5200);
  }


  let smoothTarget = window.scrollY;
  let smoothCurrent = window.scrollY;
  let smoothFrame = null;

  const aboutMotion = {
    current: 0,
    target: 0,
    frame: null,
  };

  const heroMotion = {
    current: 0,
    target: 0,
    frame: null,
  };

  const cursor = {
    angle: 0,
    currentX: window.innerWidth / 2,
    currentY: window.innerHeight / 2,
    targetX: window.innerWidth / 2,
    targetY: window.innerHeight / 2,
  };

  function updateHeader() {
    if (!header) return;

    header.classList.toggle("is-scrolled", window.scrollY > 18);

    if (workSection) {
      const rect = workSection.getBoundingClientRect();
      document.body.classList.toggle("is-work-view", rect.top < window.innerHeight * 0.45 && rect.bottom > 120);
    }
  }


  function applyHeroMotion(progress) {
    if (!heroScene) return;

    const eased = easeInOut(progress);
    const dogY = (1 - eased) * -120;
    const stickerX = (1 - eased) * -190;
    const dogOpacity = Math.max(0, Math.min(1, (progress - 0.02) / 0.22));
    const stickerOpacity = Math.max(0, Math.min(1, (progress - 0.12) / 0.22));

    heroScene.style.setProperty("--hero-dog-y", `${dogY.toFixed(2)}px`);
    heroScene.style.setProperty("--hero-dog-opacity", dogOpacity.toFixed(3));
    heroScene.style.setProperty("--hero-sticker-x", `${stickerX.toFixed(2)}px`);
    heroScene.style.setProperty("--hero-sticker-opacity", stickerOpacity.toFixed(3));
  }

  function animateHeroMotion() {
    const delta = heroMotion.target - heroMotion.current;
    heroMotion.current += delta * 0.18;

    applyHeroMotion(heroMotion.current);

    if (Math.abs(delta) < 0.002) {
      heroMotion.current = heroMotion.target;
      applyHeroMotion(heroMotion.current);
      heroMotion.frame = null;
      return;
    }

    heroMotion.frame = requestAnimationFrame(animateHeroMotion);
  }

  function updateHeroMotion() {
    if (!heroScene || reducedMotion) return;
    if (window.innerWidth <= 900) {
      applyHeroMotion(1);
      return;
    }

    const rect = heroScene.getBoundingClientRect();
    const viewportHeight = window.innerHeight || 1;
    const enterDistance = Math.max(1, Math.min(viewportHeight * 0.7, rect.height * 0.72));
    const progress = Math.max(0, Math.min(1, -rect.top / enterDistance));

    heroMotion.target = progress;

    if (!heroMotion.frame) {
      heroMotion.frame = requestAnimationFrame(animateHeroMotion);
    }
  }

  function updateHorizontalWork() {
    if (!horizontalWork || !workTrack) return;

    const slides = [...workTrack.querySelectorAll(".work-slide")];

    horizontalWork.style.height = "auto";
    workTrack.style.height = "auto";
    workTrack.style.transform = "none";

    slides.forEach((slide) => {
      slide.style.removeProperty("top");
      slide.style.removeProperty("z-index");
      slide.style.removeProperty("pointer-events");
      slide.style.removeProperty("--slide-blur");
      slide.style.removeProperty("--slide-opacity");
      slide.style.removeProperty("--slide-scale");
      slide.style.removeProperty("--slide-parallax");
      slide.classList.remove("is-current");
    });
  }


  function easeInOut(value) {
    return value * value * (3 - 2 * value);
  }

  function applyAboutMotion(progress) {
    if (!aboutCollage) return;

    const viewportWidth = window.innerWidth || 1;
    const safeProgress = Math.max(0, Math.min(1, progress));
    const eased = easeInOut(safeProgress);

    /*
      Animación visible con scroll:
      - el sello entra desde la derecha
      - el Vandal entra desde el borde inferior y sigue subiendo
      No uso position fixed para que no desaparezcan.
    */

    const sealX = (1 - eased) * Math.max(320, viewportWidth * 0.34);
    const sealY = Math.sin(safeProgress * Math.PI) * 4;

    // Arranca debajo del borde inferior y sube claramente con el scroll.
    const badgeY = (1 - eased) * 360 - eased * 170;

    const sealOpacity = Math.max(0, Math.min(1, safeProgress / 0.16));
    const badgeOpacity = Math.max(0, Math.min(1, safeProgress / 0.16));

    const copyProgress = Math.max(0, Math.min(1, (safeProgress - 0.04) / 0.28));
    const copyEased = easeInOut(copyProgress);
    const copyX = (1 - copyEased) * -130;
    const copyOpacity = copyProgress;

    aboutCollage.style.setProperty("--about-copy-x", `${copyX.toFixed(2)}px`);
    aboutCollage.style.setProperty("--about-copy-opacity", copyOpacity.toFixed(3));

    aboutCollage.style.setProperty("--seal-x", `${sealX.toFixed(2)}px`);
    aboutCollage.style.setProperty("--seal-y", `${sealY.toFixed(2)}px`);
    aboutCollage.style.setProperty("--seal-rotate", `${(-7 + eased * 6).toFixed(2)}deg`);
    aboutCollage.style.setProperty("--seal-opacity", sealOpacity.toFixed(3));

    aboutCollage.style.setProperty("--badge-x", "0px");
    aboutCollage.style.setProperty("--badge-y", `${badgeY.toFixed(2)}px`);
    aboutCollage.style.setProperty("--badge-rotate", `${(-2 + eased * 2).toFixed(2)}deg`);
    aboutCollage.style.setProperty("--badge-opacity", badgeOpacity.toFixed(3));
  }

  function animateAboutMotion() {
    const delta = aboutMotion.target - aboutMotion.current;
    aboutMotion.current += delta * 0.48;

    applyAboutMotion(aboutMotion.current);

    if (Math.abs(delta) < 0.0018) {
      aboutMotion.current = aboutMotion.target;
      applyAboutMotion(aboutMotion.current);
      aboutMotion.frame = null;
      return;
    }

    aboutMotion.frame = requestAnimationFrame(animateAboutMotion);
  }

  function updateAboutMotion() {
    if (!aboutCollage || reducedMotion) return;

    if (window.innerWidth <= 900) {
      applyAboutMotion(1);
      return;
    }

    const section = aboutCollage.closest(".studio-about-manifesto") || aboutCollage;
    const rect = section.getBoundingClientRect();
    const viewportHeight = window.innerHeight || 1;

    /*
      El movimiento empieza antes de que el bloque llegue al centro
      y continúa mientras bajas, para que sí se vea el Vandal subiendo.
    */
    const startPoint = viewportHeight * 0.92;
    const endPoint = viewportHeight * -0.58;
    const progress = Math.max(0, Math.min(1, (startPoint - rect.top) / (startPoint - endPoint)));

    aboutMotion.target = progress;

    if (!aboutMotion.frame) {
      aboutMotion.frame = requestAnimationFrame(animateAboutMotion);
    }
  }

  function maxScrollY() {
    return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  }

  function animateSmoothScroll() {
    smoothCurrent += (smoothTarget - smoothCurrent) * 0.32;

    if (Math.abs(smoothTarget - smoothCurrent) < 0.5) {
      smoothCurrent = smoothTarget;
      smoothFrame = null;
    } else {
      smoothFrame = requestAnimationFrame(animateSmoothScroll);
    }

    window.scrollTo(0, smoothCurrent);
    initPageLoader();

  updateHeader();
    updateHeroMotion();
    updateHorizontalWork();
    updateAboutMotion();
  }

  function startSmoothScroll() {
    if (!smoothFrame) {
      smoothFrame = requestAnimationFrame(animateSmoothScroll);
    }
  }

  function scrollToSmoothly(y) {
    const headerOffset = header ? header.offsetHeight * 0.42 : 0;
    const finalY = y - headerOffset;

    if (!smoothScrollEnabled) {
      window.scrollTo({ top: finalY, behavior: reducedMotion ? "auto" : "smooth" });
      return;
    }

    smoothTarget = Math.min(maxScrollY(), Math.max(0, finalY));
    startSmoothScroll();
  }

  function closeMenu() {
    if (!nav || !header || !menuToggle) return;
    nav.classList.remove("is-open");
    header.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
  }

  if (menuToggle && nav && header) {
    menuToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      header.classList.toggle("is-open", isOpen);
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const hash = link.getAttribute("href");
      if (!hash || hash === "#") return;

      const target = document.querySelector(hash);
      if (!target) return;

      event.preventDefault();
      scrollToSmoothly(target.offsetTop);
      history.pushState(null, "", hash);
    });
  });

  if ("IntersectionObserver" in window && sections.length) {
    const activeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          navLinks.forEach((link) => {
            link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
          });
        });
      },
      { rootMargin: "-42% 0px -48% 0px" }
    );

    sections.forEach((section) => activeObserver.observe(section));
  }

  const revealItems = [...document.querySelectorAll("[data-reveal]")];
  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.14 }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedCategory = button.dataset.filter;

      filterButtons.forEach((item) => {
        const isActive = item === button;
        item.classList.toggle("is-active", isActive);
        item.setAttribute("aria-selected", String(isActive));
      });

      document.querySelectorAll("[data-category]").forEach((project) => {
        const shouldShow = selectedCategory === "all" || project.dataset.category === selectedCategory;
        project.classList.toggle("is-hidden", !shouldShow);
        project.setAttribute("aria-hidden", String(!shouldShow));
      });

      requestAnimationFrame(updateHorizontalWork);
    });
  });

  workModeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const mode = button.dataset.workMode;
      const showIndex = mode === "index";

      workModeButtons.forEach((item) => {
        const isActive = item === button;
        item.classList.toggle("is-active", isActive);
        item.setAttribute("aria-pressed", String(isActive));
      });

      if (workIndex) {
        workIndex.hidden = !showIndex;
      }

      if (workSection) {
        workSection.classList.toggle("is-index-mode", showIndex);
      }
    });
  });

  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const form = event.currentTarget;
      const status = document.querySelector("[data-form-status]");
      const fields = [...form.querySelectorAll("input, textarea")];
      const invalidFields = fields.filter((field) => !field.checkValidity());

      fields.forEach((field) => {
        const isInvalid = invalidFields.includes(field);
        field.classList.toggle("has-error", isInvalid);
        field.setAttribute("aria-invalid", String(isInvalid));
      });

      if (!status) return;

      if (invalidFields.length) {
        status.textContent = "Complete the required fields.";
        status.classList.remove("is-ok");
        invalidFields[0].focus();
        return;
      }

      status.textContent = "Message sent successfully.";
      status.classList.add("is-ok");
      form.reset();
      fields.forEach((field) => field.setAttribute("aria-invalid", "false"));
    });
  }

  window.addEventListener("scroll", updateHeader, { passive: true });
  window.addEventListener("scroll", updateHeroMotion, { passive: true });
  window.addEventListener("scroll", updateHorizontalWork, { passive: true });
  window.addEventListener("scroll", updateAboutMotion, { passive: true });
  window.addEventListener("resize", () => {
    smoothTarget = window.scrollY;
    smoothCurrent = window.scrollY;
    updateHorizontalWork();
    updateAboutMotion();
  });

  if (smoothScrollEnabled) {
    document.body.classList.add("is-smooth-scrolling");

    window.addEventListener(
      "wheel",
      (event) => {
        event.preventDefault();
        smoothTarget = Math.min(maxScrollY(), Math.max(0, smoothTarget + event.deltaY * 1.45));
        startSmoothScroll();
      },
      { passive: false }
    );
  }

  if (window.matchMedia("(pointer: fine)").matches && !reducedMotion) {
    const cursorLine = document.createElement("span");
    const cursorDot = document.createElement("span");
    cursorLine.className = "cursor-line";
    cursorDot.className = "cursor-dot";
    document.body.append(cursorLine, cursorDot);

    function renderCursor() {
      cursor.currentX += (cursor.targetX - cursor.currentX) * 0.48;
      cursor.currentY += (cursor.targetY - cursor.currentY) * 0.48;

      cursorLine.style.transform = `translate3d(${cursor.currentX}px, ${cursor.currentY}px, 0) rotate(${cursor.angle}rad)`;
      cursorDot.style.transform = `translate3d(${cursor.currentX}px, ${cursor.currentY}px, 0) translate(-50%, -50%)`;
      requestAnimationFrame(renderCursor);
    }

    window.addEventListener("pointermove", (event) => {
      const dx = event.clientX - cursor.targetX;
      const dy = event.clientY - cursor.targetY;
      cursor.targetX = event.clientX;
      cursor.targetY = event.clientY;

      if (Math.abs(dx) + Math.abs(dy) > 0.1) {
        cursor.angle = Math.atan2(dy, dx);
      }

      cursorLine.classList.add("is-ready");
      cursorDot.classList.add("is-ready");
    });

    window.addEventListener("pointerleave", () => {
      cursorLine.classList.remove("is-ready");
      cursorDot.classList.remove("is-ready");
    });

    document.querySelectorAll("a, button, input, textarea, video").forEach((item) => {
      item.addEventListener("pointerenter", () => {
        cursorLine.classList.add("is-hovering");
        cursorDot.classList.add("is-hovering");
      });
      item.addEventListener("pointerleave", () => {
        cursorLine.classList.remove("is-hovering");
        cursorDot.classList.remove("is-hovering");
      });
    });

    renderCursor();
  }

  function initPortfolioPixelHover() {
    const cards = Array.from(document.querySelectorAll(
      ".work-section .buja-card, .work-section .reverse-card, .work-section .split-card, .work-section .art-direction-card"
    ));

    if (!cards.length || reducedMotion) return;

    cards.forEach((card) => {
      const img = card.querySelector("img");
      if (!img) return;

      const lens = document.createElement("span");
      lens.className = "magnifier-lens";
      card.appendChild(lens);

      const zoom = 1.85;

      function moveLens(event) {
        const cardBox = card.getBoundingClientRect();
        const imgBox = img.getBoundingClientRect();

        const mouseX = event.clientX - cardBox.left;
        const mouseY = event.clientY - cardBox.top;
        const imgX = event.clientX - imgBox.left;
        const imgY = event.clientY - imgBox.top;

        lens.style.left = `${mouseX}px`;
        lens.style.top = `${mouseY}px`;

        const lensWidth = lens.offsetWidth || 220;
        const lensHeight = lens.offsetHeight || 220;
        const backgroundWidth = imgBox.width * zoom;
        const backgroundHeight = imgBox.height * zoom;

        lens.style.backgroundImage = `url("${img.currentSrc || img.src}")`;
        lens.style.backgroundSize = `${backgroundWidth}px ${backgroundHeight}px`;
        lens.style.backgroundPosition = `${-(imgX * zoom - lensWidth / 2)}px ${-(imgY * zoom - lensHeight / 2)}px`;
      }

      card.addEventListener("mouseenter", (event) => {
        lens.classList.add("is-visible");
        moveLens(event);
      });

      card.addEventListener("mousemove", moveLens);

      card.addEventListener("mouseleave", () => {
        lens.classList.remove("is-visible");
      });
    });
  }




  function initStoryLiquidHover() {
    const storySection = document.querySelector(".scroll-story");
    if (!storySection || reducedMotion || !window.matchMedia("(pointer: fine)").matches || window.matchMedia("(max-width: 900px)").matches) return;

    const targets = Array.from(storySection.querySelectorAll(".story-sticky h2, .story-panel h3, .story-panel .story-accent"));
    if (!targets.length) return;

    const chars = [];
    const motionItems = Array.from(storySection.querySelectorAll(".story-panel img, .story-panel div")).map((el) => ({
      el,
      tx: 0,
      ty: 0,
      tr: 0,
      ts: 1,
      to: 1,
      x: 0,
      y: 0,
      r: 0,
      s: 1,
      o: 1,
      depth: el.matches(".story-sticky__inner") ? 0.45 : el.matches("img") ? 1 : 0.88,
      radius: el.matches(".story-sticky__inner") ? 360 : el.matches("img") ? 280 : 250
    }));


    function splitTarget(target) {
      const text = (target.textContent || "").trim();
      if (!text) return;
      target.textContent = "";
      target.classList.add("story-distort-target");

      text.split(" ").forEach((word, wordIndex, array) => {
        const wordSpan = document.createElement("span");
        wordSpan.className = "story-distort-word";

        [...word].forEach((letter) => {
          const charSpan = document.createElement("span");
          charSpan.className = "char";
          charSpan.textContent = letter;
          wordSpan.appendChild(charSpan);
          chars.push({ el: charSpan, tx: 0, ty: 0, tr: 0, x: 0, y: 0, r: 0, hero: target.matches(".story-sticky h2") });
        });

        target.appendChild(wordSpan);
        if (wordIndex < array.length - 1) {
          const gap = document.createTextNode(" ");
          target.appendChild(gap);
        }
      });
    }

    targets.forEach(splitTarget);

    const pointer = { x: 0, y: 0, active: false };
    const radius = 180;
    let rafId = 0;

    function updateMotionItems() {
      motionItems.forEach((item) => {
        const rect = item.el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        let tx = 0;
        let ty = 0;
        let tr = 0;
        let ts = 1;
        let to = 1;

        if (pointer.active) {
          const dx = cx - pointer.x;
          const dy = cy - pointer.y;
          const distance = Math.hypot(dx, dy);

          if (distance < item.radius) {
            const force = Math.pow(1 - distance / item.radius, 1.5);
            const angle = Math.atan2(dy, dx);
            const push = (item.el.matches("img") ? 30 : 24) * item.depth * force;
            tx += Math.cos(angle) * push;
            ty += Math.sin(angle) * push * 0.8;
            tr += Math.cos(angle) * 6 * force;
            ts += force * (item.el.matches("img") ? 0.035 : 0.02);
          }
        }

        const anchor = item.el.closest(".story-panel") || storySection;
        const anchorRect = anchor.getBoundingClientRect();
        const progress = ((window.innerHeight * 0.56) - anchorRect.top) / (window.innerHeight + anchorRect.height);
        const clamped = Math.max(0, Math.min(1, progress));
        const centered = clamped * 2 - 1;
        const visibility = Math.max(0, 1 - Math.abs(centered) * 1.15);

        if (item.el.matches(".story-sticky__inner")) {
          tx += centered * 72 * item.depth;
          ty += centered * -18 * item.depth;
          tr += centered * -4;
          to = 0.3 + visibility * 0.7;
        } else if (item.el.matches("img")) {
          tx += centered * -94 * item.depth;
          ty += centered * 78 * item.depth;
          tr += centered * 4.5;
          to = 0.15 + visibility * 0.85;
        } else {
          tx += centered * 112 * item.depth;
          ty += centered * -62 * item.depth;
          tr += centered * 6.5;
          to = 0.12 + visibility * 0.88;
        }

        item.tx = tx;
        item.ty = ty;
        item.tr = tr;
        item.ts = ts;
        item.to = to;
      });
    }

    function updateTargets() {
      chars.forEach((char) => {
        if (!pointer.active) {
          char.tx = 0;
          char.ty = 0;
          char.tr = 0;
          return;
        }

        const rect = char.el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = cx - pointer.x;
        const dy = cy - pointer.y;
        const distance = Math.hypot(dx, dy);

        const localRadius = char.hero ? radius + 50 : radius;

        if (distance < localRadius) {
          const force = Math.pow(1 - distance / localRadius, 1.65);
          const push = (char.hero ? 54 : 38) * force;
          const angle = Math.atan2(dy, dx);
          char.tx = Math.cos(angle) * push;
          char.ty = Math.sin(angle) * push * (char.hero ? 0.82 : 0.72);
          char.tr = Math.cos(angle) * (char.hero ? 12 : 9) * force;
        } else {
          char.tx = 0;
          char.ty = 0;
          char.tr = 0;
        }
      });
    }

    function render() {
      chars.forEach((char) => {
        const ease = char.hero ? 0.22 : 0.18;
        char.x += (char.tx - char.x) * ease;
        char.y += (char.ty - char.y) * ease;
        char.r += (char.tr - char.r) * ease;
        char.el.style.transform = `translate3d(${char.x}px, ${char.y}px, 0) rotate(${char.r}deg)`;
      });

      motionItems.forEach((item) => {
        item.x += (item.tx - item.x) * 0.12;
        item.y += (item.ty - item.y) * 0.12;
        item.r += (item.tr - item.r) * 0.12;
        item.s += (item.ts - item.s) * 0.12;
        item.o += (item.to - item.o) * 0.12;
        item.el.style.transform = `translate3d(${item.x}px, ${item.y}px, 0) rotate(${item.r}deg) scale(${item.s})`;
        item.el.style.opacity = item.o;
      });

      rafId = window.requestAnimationFrame(render);
    }

    storySection.addEventListener("pointerenter", (event) => {
      pointer.active = true;
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      updateTargets();
      updateMotionItems();
    });

    storySection.addEventListener("pointermove", (event) => {
      pointer.active = true;
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      updateTargets();
      updateMotionItems();
    });

    storySection.addEventListener("pointerleave", () => {
      pointer.active = false;
      updateTargets();
      updateMotionItems();
    });

    window.addEventListener("scroll", () => {
      if (pointer.active) updateTargets();
      updateMotionItems();
    }, { passive: true });

    window.addEventListener("resize", () => {
      if (pointer.active) updateTargets();
      updateMotionItems();
    });

    updateMotionItems();
    render();
  }


  function initAboutCursorColor() {
    const title = document.querySelector(".about-manifesto-title");
    if (!title || reducedMotion || !window.matchMedia("(pointer: fine)").matches) return;

    const originalHTML = title.innerHTML;
    const paintLayer = document.createElement("span");
    paintLayer.className = "about-manifesto-title-paint";
    paintLayer.setAttribute("aria-hidden", "true");
    paintLayer.innerHTML = originalHTML;
    title.appendChild(paintLayer);

    const maskCanvas = document.createElement("canvas");
    const maskCtx = maskCanvas.getContext("2d", { alpha: true });
    if (!maskCtx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let rafId = 0;

    function updateMaskImage() {
      rafId = 0;
      const dataURL = maskCanvas.toDataURL("image/png");
      paintLayer.style.webkitMaskImage = `url(${dataURL})`;
      paintLayer.style.maskImage = `url(${dataURL})`;
    }

    function commit() {
      if (!rafId) rafId = requestAnimationFrame(updateMaskImage);
    }

    function resize() {
      const rect = title.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

      maskCanvas.width = Math.round(width * dpr);
      maskCanvas.height = Math.round(height * dpr);
      maskCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      maskCtx.clearRect(0, 0, width, height);
      commit();
    }

    function spray(x, y) {
      const coreBursts = 36;
      const mistBursts = 120;

      maskCtx.save();
      maskCtx.globalCompositeOperation = "source-over";
      maskCtx.fillStyle = "rgba(255,255,255,1)";

      for (let i = 0; i < coreBursts; i += 1) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.pow(Math.random(), 0.72) * 32;
        const size = 2 + Math.random() * 9;
        const px = x + Math.cos(angle) * radius;
        const py = y + Math.sin(angle) * radius;

        maskCtx.globalAlpha = 0.3 + Math.random() * 0.3;
        maskCtx.beginPath();
        maskCtx.arc(px, py, size, 0, Math.PI * 2);
        maskCtx.fill();
      }

      for (let i = 0; i < mistBursts; i += 1) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.pow(Math.random(), 0.94) * 56;
        const size = 0.8 + Math.random() * 2.8;
        const px = x + Math.cos(angle) * radius;
        const py = y + Math.sin(angle) * radius;

        maskCtx.globalAlpha = 0.06 + Math.random() * 0.12;
        maskCtx.beginPath();
        maskCtx.arc(px, py, size, 0, Math.PI * 2);
        maskCtx.fill();
      }

      maskCtx.restore();
      commit();
    }

    function update(event) {
      const rect = title.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width, event.clientX - rect.left));
      const y = Math.max(0, Math.min(rect.height, event.clientY - rect.top));
      spray(x, y);
    }

    title.addEventListener("pointerenter", update);
    title.addEventListener("pointermove", update);
    window.addEventListener("resize", resize);

    resize();
  }


  function initHoodieVideoLoop() {
    const hoodieVideo = document.querySelector(".bio-visual-video--base") || document.querySelector(".bio-visual-video");
    if (!hoodieVideo) return;

    hoodieVideo.muted = true;
    hoodieVideo.loop = true;
    hoodieVideo.playsInline = true;
    hoodieVideo.setAttribute("muted", "");
    hoodieVideo.setAttribute("loop", "");
    hoodieVideo.setAttribute("playsinline", "");
    hoodieVideo.setAttribute("webkit-playsinline", "");

    function playVideo() {
      const playPromise = hoodieVideo.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {});
      }
    }

    hoodieVideo.addEventListener("ended", () => {
      hoodieVideo.currentTime = 0;
      playVideo();
    });

    hoodieVideo.addEventListener("pause", () => {
      if (!document.hidden) playVideo();
    });

    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) playVideo();
    });

    playVideo();
  }



  function initHoodieLiquidHover() {
    const surface = document.querySelector(".bio-visual-surface");
    const baseVideo = document.querySelector(".bio-visual-video--base");
    const fxWrap = document.querySelector(".bio-visual-distort");
    const fxVideo = document.querySelector(".bio-visual-video--fx");
    const turbulence = document.getElementById("hoodie-liquid-noise");
    const displacement = document.getElementById("hoodie-liquid-map");

    if (!surface || !baseVideo || !fxWrap || !fxVideo || !turbulence || !displacement) return;

    const supportsFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!supportsFinePointer || reducedMotion) return;

    fxVideo.muted = true;
    fxVideo.loop = true;
    fxVideo.playsInline = true;
    fxVideo.setAttribute("muted", "");
    fxVideo.setAttribute("loop", "");
    fxVideo.setAttribute("playsinline", "");
    fxVideo.setAttribute("webkit-playsinline", "");

    const state = {
      currentX: 0.5,
      currentY: 0.5,
      targetX: 0.5,
      targetY: 0.5,
      currentScale: 18,
      targetScale: 18,
      currentFreqX: 0.011,
      currentFreqY: 0.019,
      targetFreqX: 0.011,
      targetFreqY: 0.019,
      raf: 0,
      active: false,
      lastX: 0,
      lastY: 0,
      lastTime: 0
    };

    function safePlay(video) {
      const p = video.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    }

    function syncFxVideo() {
      if (Math.abs(fxVideo.currentTime - baseVideo.currentTime) > 0.08) {
        try { fxVideo.currentTime = baseVideo.currentTime; } catch (e) {}
      }
      if (!baseVideo.paused && fxVideo.paused) safePlay(fxVideo);
    }

    baseVideo.addEventListener("play", () => {
      try { fxVideo.currentTime = baseVideo.currentTime; } catch (e) {}
      safePlay(fxVideo);
    });
    baseVideo.addEventListener("timeupdate", syncFxVideo);
    baseVideo.addEventListener("seeking", syncFxVideo);
    baseVideo.addEventListener("ratechange", () => {
      fxVideo.playbackRate = baseVideo.playbackRate || 1;
      syncFxVideo();
    });
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) syncFxVideo();
    });

    function applyPointer(event) {
      const rect = surface.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
      const now = performance.now();
      const dx = event.clientX - state.lastX;
      const dy = event.clientY - state.lastY;
      const dt = Math.max(16, now - state.lastTime);
      const speed = Math.min(1, Math.hypot(dx, dy) / dt / 1.7);

      state.targetX = x;
      state.targetY = y;
      state.targetScale = 20 + speed * 18;
      state.targetFreqX = 0.011 + speed * 0.006;
      state.targetFreqY = 0.019 + speed * 0.008;
      state.lastX = event.clientX;
      state.lastY = event.clientY;
      state.lastTime = now;
    }

    function render() {
      state.currentX += (state.targetX - state.currentX) * 0.16;
      state.currentY += (state.targetY - state.currentY) * 0.16;
      state.currentScale += (state.targetScale - state.currentScale) * 0.14;
      state.currentFreqX += (state.targetFreqX - state.currentFreqX) * 0.12;
      state.currentFreqY += (state.targetFreqY - state.currentFreqY) * 0.12;

      surface.style.setProperty("--hover-x", `${(state.currentX * 100).toFixed(2)}%`);
      surface.style.setProperty("--hover-y", `${(state.currentY * 100).toFixed(2)}%`);
      surface.style.setProperty("--hover-opacity", state.active ? "1" : "0");
      displacement.setAttribute("scale", state.currentScale.toFixed(2));
      turbulence.setAttribute("baseFrequency", `${state.currentFreqX.toFixed(4)} ${state.currentFreqY.toFixed(4)}`);

      if (!state.active) {
        state.targetScale += (18 - state.targetScale) * 0.08;
        state.targetFreqX += (0.011 - state.targetFreqX) * 0.08;
        state.targetFreqY += (0.019 - state.targetFreqY) * 0.08;
      }

      state.raf = window.requestAnimationFrame(render);
    }

    surface.addEventListener("pointerenter", (event) => {
      state.active = true;
      applyPointer(event);
      syncFxVideo();
      safePlay(fxVideo);
    });

    surface.addEventListener("pointermove", (event) => {
      state.active = true;
      applyPointer(event);
    });

    surface.addEventListener("pointerleave", () => {
      state.active = false;
      state.targetScale = 18;
      state.targetFreqX = 0.011;
      state.targetFreqY = 0.019;
    });

    try { fxVideo.currentTime = baseVideo.currentTime; } catch (e) {}
    safePlay(fxVideo);
    render();
  }


  function initLoopingVideos() {
    const videos = document.querySelectorAll(".bio-visual-video, video[autoplay]");

    videos.forEach((video) => {
      video.loop = true;
      video.muted = true;
      video.autoplay = true;
      video.playsInline = true;
      video.setAttribute("loop", "");
      video.setAttribute("muted", "");
      video.setAttribute("autoplay", "");
      video.setAttribute("playsinline", "");

      const playVideo = () => {
        const promise = video.play();
        if (promise && typeof promise.catch === "function") {
          promise.catch(() => {});
        }
      };

      video.addEventListener("ended", () => {
        video.currentTime = 0;
        playVideo();
      });

      video.addEventListener("pause", () => {
        if (!video.ended && !document.hidden) playVideo();
      });

      playVideo();
    });
  }


  function initDisruptTitleScroll() {
    const storySection = document.querySelector(".scroll-story");
    const title = document.querySelector(".story-main-title");
    if (!storySection || !title) return;

    let ticking = false;

    function clamp(value, min, max) {
      return Math.min(Math.max(value, min), max);
    }

    function hideTitle() {
      title.style.opacity = "0";
      title.style.setProperty("pointer-events", "none", "important");
      title.style.setProperty("position", "fixed", "important");
    }

    function update() {
      ticking = false;

      const rect = storySection.getBoundingClientRect();
      const viewportH = window.innerHeight || document.documentElement.clientHeight;
      const viewportW = window.innerWidth || document.documentElement.clientWidth;
      const header = document.querySelector("[data-header]");
      const headerH = header ? header.offsetHeight : 0;

      const travel = Math.max(1, rect.height - viewportH);
      const baseProgress = clamp((headerH - rect.top) / travel, 0, 1);

      const isMobile = viewportW <= 900;
      const startTop = isMobile ? headerH + viewportH * 0.12 : headerH + viewportH * 0.16;
      const endTop = isMobile ? headerH + viewportH * 0.34 : headerH + viewportH * 0.42;
      const top = startTop + (endTop - startTop) * baseProgress;
      const left = isMobile ? 18 : clamp(viewportW * 0.035, 44, 86);

      /*
        Regla dura:
        El título solo puede existir si su caja completa queda dentro de la sección negra.
        Así NO se monta sobre la parte beige ni sobre el video/hoodie.
      */
      const titleHeight = title.getBoundingClientRect().height || viewportH * 0.22;
      const titleTopIsInsideBlack = rect.top <= top - 8;
      const titleBottomIsInsideBlack = rect.bottom >= top + titleHeight + 12;

      if (!titleTopIsInsideBlack || !titleBottomIsInsideBlack) {
        hideTitle();
        return;
      }

      title.style.setProperty("position", "fixed", "important");
      title.style.setProperty("top", `${top}px`, "important");
      title.style.setProperty("left", `${left}px`, "important");
      title.style.setProperty("right", "auto", "important");
      title.style.setProperty("bottom", "auto", "important");
      title.style.setProperty("margin", "0", "important");
      title.style.setProperty("transform", "none", "important");
      title.style.setProperty("pointer-events", "auto", "important");
      title.style.opacity = "0.96";
    }

    function requestUpdate() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    window.addEventListener("load", requestUpdate);
    hideTitle();
    update();
  }








  function initVandalAugustScroll() {
    const section = document.querySelector("[data-vandal-august-scroll]");
    const track = section ? section.querySelector("[data-vandal-august-track]") : null;
    if (!section || !track) return;

    let ticking = false;

    function clampValue(value, min = 0, max = 1) {
      return Math.max(min, Math.min(max, value));
    }

    function update() {
      ticking = false;

      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const total = Math.max(1, rect.height - vh);
      const progress = clampValue(-rect.top / total);

      /*
        Scroll trigger tipo carrusel:
        empieza entrando desde la derecha, primero se lee WILD DESIGN,
        luego la frase completa cruza y se repite como loop horizontal.
      */
      const firstItem = track.querySelector("span");
      const styles = window.getComputedStyle(track);
      const gap = Number.parseFloat(styles.columnGap || styles.gap || "0") || 0;
      const loopDistance = firstItem ? firstItem.getBoundingClientRect().width + gap : track.scrollWidth / 3;
      const startX = window.innerWidth * 0.02;
      const x = startX - progress * loopDistance;

      track.style.setProperty("--august-x", `${x.toFixed(2)}px`);
    }

    function requestUpdate() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    window.addEventListener("load", requestUpdate);
    update();
  }



  function initVandalAugustAutoMarquee() {
    const section = document.querySelector("[data-vandal-august-scroll]");
    const track = section ? section.querySelector("[data-vandal-august-track]") : null;
    if (!section || !track) return;

    let loopDistance = 1;
    let lastTime = performance.now();
    let offset = 0;
    const speed = 270; // px por segundo, más rápido

    function measure() {
      const firstItem = track.querySelector("span");
      const styles = window.getComputedStyle(track);
      const gap = Number.parseFloat(styles.columnGap || styles.gap || "0") || 0;
      loopDistance = firstItem ? Math.max(1, firstItem.getBoundingClientRect().width + gap) : Math.max(1, track.scrollWidth / 4);
    }

    function render(now) {
      const delta = Math.min(64, now - lastTime);
      lastTime = now;

      offset = (offset + (delta / 1000) * speed) % loopDistance;
      track.style.setProperty("transform", `translate3d(${-offset.toFixed(2)}px, -50%, 0) scaleY(2.25)`, "important");
      window.requestAnimationFrame(render);
    }

    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("load", measure);
    window.requestAnimationFrame(render);
  }


  initAboutCursorColor();
  initHoodieVideoLoop();
  initHoodieLiquidHover();
  initLoopingVideos();
  initStoryLiquidHover();
  initDisruptTitleScroll();
  initPortfolioPixelHover();
  initPageLoader();
  updateHeader();
  updateHeroMotion();
  updateHorizontalWork();
  updateAboutMotion();
})();
