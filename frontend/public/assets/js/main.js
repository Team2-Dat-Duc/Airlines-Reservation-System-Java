(function ($) {
  'use strict';

  /* JS Index Here */
  /*
    01. Preloader (Must Needed In Your Project)
    02. Sticky Menu
    03. Mobile Menu
    04. Search Header
    05. Popup Sidebar Canvas Menu
    06. Country Select
    07. Swiper Hero Slider
    08. Date Picker
    09. Parallax Mouse Move
    10. GSAP Title Animation
    11. Lenis & GSAP Activation
    12. Dynamic Background Image
    13. Swiper Global Slider
    14. Current Year Set
    15. Back To Top
    16. Counter Animation
    17. Price Filter
    18. Flight Details Toggle
    19. Ajax Contact Form
    20. Magnific Popup
  */
  /*  JS Index End */


  // -----------------------------------------
  //  ***** 01. Preloader (Must Needed In Your Project) *****
  // -----------------------------------------
  $(window).on('load', function () {
    $(".preloader").delay(800).animate({
      "opacity": "0"
    }, 800, function () {
      $(".preloader").css("display", "none");
    });
  });

  // -----------------------------------------
  // ***** 02. Sticky Menu *****
  // -----------------------------------------
  var lastScrollTop = '';
  var scrollToTopBtn = '.scrollToTop';
  function stickyMenu($targetMenu, $toggleClass, $parentClass) {
    var st = $(window).scrollTop();
    var height = $targetMenu.css('height');
    $targetMenu.parent().css('min-height', height);
    if ($(window).scrollTop() > 800) {
      $targetMenu.parent().addClass($parentClass);

      if (st > lastScrollTop) {
        $targetMenu.removeClass($toggleClass);
      } else {
        $targetMenu.addClass($toggleClass);
      }
    } else {
      $targetMenu.parent().css('min-height', '').removeClass($parentClass);
      $targetMenu.removeClass($toggleClass);
    }
    lastScrollTop = st;
  }
  $(window).on('scroll', function () {
    stickyMenu($('.sticky-active'), 'active', 'will-sticky');
    if ($(this).scrollTop() > 500) {
      $(scrollToTopBtn).addClass('show');
    } else {
      $(scrollToTopBtn).removeClass('show');
    }
  });

  // -----------------------------------------
  // ***** 03. Mobile Menu *****
  // -----------------------------------------
  $.fn.tnmobilemenu = function (options) {
    var opt = $.extend(
      {
        menuToggleBtn: ".tn-menu-toggle",
        bodyToggleClass: "tn-body-visible",
        subMenuClass: "tn-submenu",
        subMenuParent: "tn-item-has-children",
        subMenuParentToggle: "tn-active",
        meanExpandClass: "tn-mean-expand",
        appendElement: '<span class="tn-mean-expand"></span>',
        subMenuToggleClass: "tn-open",
        toggleSpeed: 400,
      },
      options
    );

    return this.each(function () {
      var menu = $(this); // Select menu

      // Menu Show & Hide
      function menuToggle() {
        menu.toggleClass(opt.bodyToggleClass);

        // collapse submenu on menu hide or show
        var subMenu = "." + opt.subMenuClass;
        $(subMenu).each(function () {
          if ($(this).hasClass(opt.subMenuToggleClass)) {
            $(this).removeClass(opt.subMenuToggleClass);
            $(this).css("display", "none");
            $(this).parent().removeClass(opt.subMenuParentToggle);
          }
        });
      }

      // Class Set Up for every submenu
      menu.find("li").each(function () {
        var submenu = $(this).find("ul");
        submenu.addClass(opt.subMenuClass);
        submenu.css("display", "none");
        submenu.parent().addClass(opt.subMenuParent);
        submenu.prev("a").append(opt.appendElement);
        submenu.next("a").append(opt.appendElement);
      });

      // Toggle Submenu
      function toggleDropDown($element) {
        if ($($element).next("ul").length > 0) {
          $($element).parent().toggleClass(opt.subMenuParentToggle);
          $($element).next("ul").slideToggle(opt.toggleSpeed);
          $($element).next("ul").toggleClass(opt.subMenuToggleClass);
        } else if ($($element).prev("ul").length > 0) {
          $($element).parent().toggleClass(opt.subMenuParentToggle);
          $($element).prev("ul").slideToggle(opt.toggleSpeed);
          $($element).prev("ul").toggleClass(opt.subMenuToggleClass);
        }
      }

      // Submenu toggle Button
      var expandToggler = "." + opt.meanExpandClass;
      $(expandToggler).each(function () {
        $(this).on("click", function (e) {
          e.preventDefault();
          toggleDropDown($(this).parent());
        });
      });

      // Menu Show & Hide On Toggle Btn click
      $(opt.menuToggleBtn).each(function () {
        $(this).on("click", function () {
          menuToggle();
        });
      });

      // Hide Menu On out side click
      menu.on("click", function (e) {
        e.stopPropagation();
        menuToggle();
      });

      // Stop Hide full menu on menu click
      menu.find("div").on("click", function (e) {
        e.stopPropagation();
      });
    });
  };
  $(".tn-menu-wrapper").tnmobilemenu();

  // -----------------------------------------
  // ***** 04. Search Header *****
  // -----------------------------------------
  function popupSearchBox(searchBox, searchOpen, searchCls, toggleCls) {
    const $box = $(searchBox);
    // Open popup
    $(searchOpen).on('click', function (e) {
      e.preventDefault();
      $box.addClass(toggleCls);
    });
    // Close when clicking overlay (NOT form)
    $box.on('click', function () {
      $box.removeClass(toggleCls);
    });
    // Prevent closing when clicking inside form
    $box.find('form').on('click', function (e) {
      e.stopPropagation();
    });
    // Close button
    $(searchCls).on('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      $box.removeClass(toggleCls);
    });
  }
  popupSearchBox(
    '.popup-search-box',
    '.searchBoxTggler',
    '.searchClose',
    'show'
  );

  // -----------------------------------------
  // ***** 05. Popup Sidebar Canvas Menu *****
  // -----------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    const menuTogglers = document.querySelectorAll('.sideMenuToggler');
    const menuList = document.querySelector('.sidemenu-wrapper');
    const menuContent = menuList.querySelector('.sidemenu-content');
    const menuItems = menuList.querySelectorAll('.sidemenu-item');
    const closeButton = menuList.querySelector('.closeButton');
    const body = document.body;

    // GSAP Timeline
    const tl = gsap.timeline({ paused: true });
    // Menu Animations
    tl.fromTo(
      menuList,
      {
        opacity: 0,
        visibility: 'hidden',
        x: '100%',
      },
      {
        opacity: 1,
        visibility: 'visible',
        x: '0%',
        duration: 0.5,
        ease: 'power2.out',
      }
    )
      .fromTo(
        menuContent,
        {
          opacity: 0,
          x: 20, // Slightly off-screen horizontally
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          ease: 'power2.out',
        },
        '<' // Synchronize with menuList animation
      )
      .fromTo(
        menuItems,
        {
          opacity: 0,
          y: 20, // Slightly below
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out',
          stagger: 0.1,
        },
        '<'
      );

    // Open Menu
    const openMenu = () => {
      menuList.classList.add('show');
      tl.play();
    };

    // Close Menu
    const closeMenu = () => {
      tl.reverse().then(() => {
        menuList.classList.remove('show');
      });
    };

    // Toggle Menu
    const toggleMenu = () => {
      if (menuList.classList.contains('show')) {
        closeMenu();
      } else {
        openMenu();
      }
    };

    // Add click event listener to each toggler
    menuTogglers.forEach((menuToggle) => {
      menuToggle.addEventListener('click', (event) => {
        event.stopPropagation();
        toggleMenu();
      });
    });

    // Close menu when clicking outside menu content
    body.addEventListener('click', (event) => {
      if (
        menuList.classList.contains('show') &&
        !menuContent.contains(event.target) &&
        ![...menuTogglers].some((toggler) => toggler.contains(event.target))
      ) {
        closeMenu();
      }
    });

    // Close menu when clicking the close button
    closeButton.addEventListener('click', (event) => {
      event.stopPropagation();
      closeMenu();
    });
  });

  // -----------------------------------------
  // ***** 06. Country Select *****
  // -----------------------------------------
  const select = document.querySelector("#countrySelect");
  const btn = select.querySelector(".country-select__btn");
  const list = select.querySelector(".country-select__list");
  const items = select.querySelectorAll(".country-select__list li");
  const flag = btn.querySelector(".flag");
  const label = btn.querySelector(".label");

  let open = false;
  // initial state
  gsap.set(list, { autoAlpha: 0, y: 10 });
  gsap.set(items, { opacity: 0, y: 10 });
  // open / close
  btn.addEventListener("click", e => {
    e.stopPropagation(); // prevents outside click conflict
    open = !open;
    btn.setAttribute("aria-expanded", open);

    if (open) {
      gsap.to(list, { autoAlpha: 1, y: 0, duration: 0.25 });
      gsap.to(items, {
        opacity: 1,
        y: 0,
        stagger: 0.05,
        duration: 0.3
      });
    } else {
      closeSelect();
    }
  });
  // select option
  items.forEach(item => {
    item.addEventListener("click", () => {
      open = false;
      closeSelect();

      // animate flag swap
      gsap.fromTo(
        flag,
        { scale: 0.6, autoAlpha: 0 },
        { scale: 1, autoAlpha: 1, duration: 0.25 }
      );

      flag.src = item.dataset.thumbnail;
      label.textContent = item.textContent.trim();
    });
  });
  // close on outside click
  document.addEventListener("click", () => {
    if (open) {
      open = false;
      closeSelect();
    }
  });

  // helper
  function closeSelect() {
    gsap.to(list, { autoAlpha: 0, y: 10, duration: 0.2 });
  }

  // -----------------------------------------
  // ***** 07. Swiper Hero Slider *****
  // -----------------------------------------
  const hero_Swiper = new Swiper(".heroSwiper", {
    slidesPerView: 1,
    loop: false,
    allowTouchMove: false,
  });

  /* Animate hero text once on page load */
  function applyAnimationDelays() {
    const activeSlide = document.querySelector(
      ".heroSwiper .swiper-slide-active"
    );

    if (!activeSlide) return;
    const animElements = activeSlide.querySelectorAll(".tn-hero__anim");

    // Reset animations
    animElements.forEach((el) => {
      el.classList.remove("manimated");
      el.style.animationDelay = "0s";
    });

    // Force reflow to restart animations
    void activeSlide.offsetHeight;
    // Apply staggered animation
    animElements.forEach((el, index) => {
      const delay = 0.6 + index * 0.2;
      el.style.animationDelay = `${delay}s`;
      el.classList.add("manimated");
    });
  }
  // Run once on page load
  window.addEventListener("load", applyAnimationDelays);

  // -----------------------------------------
  // ***** 08. Date Picker *****
  // -----------------------------------------
  $(function () {
    $(".tn-date").datepicker({
      autoclose: true,
      todayHighlight: true
    }).datepicker('update', new Date());
  });

  // -----------------------------------------
  // ***** 09. Parallax *****
  // -----------------------------------------
  document.querySelectorAll('.parallax-wrap').forEach((wrap) => {
    wrap.addEventListener('mousemove', (event) => {
      const rect = wrap.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;

      wrap.querySelectorAll('.parallax-element').forEach((el) => {
        const move = parseFloat(el.dataset.move) || 20;
        const moveX = parseFloat(el.dataset.moveX) || 1;
        const moveY = parseFloat(el.dataset.moveY) || 1;

        gsap.to(el, {
          x: (x / rect.width) * move * moveX,
          y: (y / rect.height) * move * moveY,
          duration: 0.3,
          ease: "power2.out",
        });
      });
    });

    wrap.addEventListener('mouseleave', () => {
      wrap.querySelectorAll('.parallax-element').forEach((el) => {
        gsap.to(el, {
          x: 0,
          y: 0,
          duration: 0.4,
          ease: "power3.out",
        });
      });
    });
  });
  // Parallax Element Movement
  function applyParallaxEffect(event, container, target, intensity) {
    const rect = container.getBoundingClientRect();
    const relX = event.clientX - rect.left;
    const relY = event.clientY - rect.top;

    const moveX = ((relX - rect.width / 2) / rect.width) * intensity;
    const moveY = ((relY - rect.height / 2) / rect.height) * intensity;

    gsap.to(target, {
      duration: 0.3,
      x: moveX,
      y: moveY,
      ease: Power2.easeOut,
    });
  }
  ScrollTrigger.matchMedia({
    "(max-width: 768px)": function () {
      ScrollTrigger.getAll().forEach(st => st.kill());
    }
  });

  // -----------------------------------------
  //  ***** 10. GSAP Title Animation *****
  // -----------------------------------------
  gsap.config({
    nullTargetWarn: false,
    trialWarn: false,
  });

  function tnTitleAnimation() {
    const tnElements = document.querySelectorAll('.title-anime');
    if (!tnElements.length || window.innerWidth < 768) return;

    tnElements.forEach(container => {
      const quotes = container.querySelectorAll('.title-anime__split');

      quotes.forEach(quote => {
        if (quote.animation) {
          if (quote.animation.scrollTrigger) {
            quote.animation.scrollTrigger.kill();
          }
          quote.animation.kill();
          quote.split?.revert();

          quote.animation = null;
          quote.split = null;
        }

        const animationClass = container.className.match(/animation-(style\d+)/);
        if (!animationClass || animationClass[1] === 'style4') return;

        quote.split = new SplitText(quote, {
          type: 'lines,words,chars',
          linesClass: 'split-line',
          charsClass: 'char'
        });

        quote.querySelectorAll('.split-line').forEach(line => {
          line.style.textAlign = '';
        });

        const chars = quote.split.chars;
        const style = animationClass[1];

        const initialStates = {
          style1: { opacity: 0, y: '30vh', rotateX: '-40deg' },
          style2: { opacity: 0, x: '5vw' },
          style3: { opacity: 0 },
          style4: { opacity: 0, skewX: '-30deg', scale: 0.8 },
          style5: { opacity: 0, scale: 0.5 },
          style6: { opacity: 0, y: '-50vh', rotate: '45deg' },
        };

        gsap.set(quote, { perspective: 1000 });
        gsap.set(chars, initialStates[style]);

        quote.animation = gsap.to(chars, {
          x: 0,
          y: 0,
          rotateX: 0,
          rotate: 0,
          opacity: 1,
          skewX: 0,
          scale: 1,
          duration: 1,
          ease: 'expo.out',
          stagger: 0.02,
          scrollTrigger: {
            trigger: quote,
            start: 'top 95%',
            end: 'bottom 5%',
            toggleActions: 'restart none restart none',
            markers: false,
          }
        });
      });
    });
  }
  // Function to rerun animation when re-entered
  function runAnimationAgain(quote) {
    if (quote.animation) {
      quote.animation.restart(true);
    }
  }
  // Clean up SplitText before refresh
  ScrollTrigger.addEventListener('refreshInit', () => {
    document.querySelectorAll('.title-anime__split').forEach((quote) => {
      if (quote.split) quote.split.revert();
    });
  });

  // Re-run animation setup on refresh
  ScrollTrigger.addEventListener('refresh', tnTitleAnimation);

  // Re-run animation on window resize (debounced)
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);
  });

  // -----------------------------------------
  //  ***** 11. Lenis & GSAP Activation *****
  // -----------------------------------------
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
  const lenis = new Lenis({
    lerp: 0.1, // animation smoothness (between 0 & 1)
    touchMultiplier: 0, // scrolling speed for touch events
    smoothWheel: true, // smooth scrolling for while events
    smoothTouch: false, // smooth scrolling for touche events
    mouseWheel: false, // smooth scrolling for mouse events
    autoResize: true,
    smooth: true,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    syncTouch: true,
  });
  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1200);
  });

  // -----------------------------------------
  //  ***** 12. Dynamic Background Image *****
  // -----------------------------------------
  if ($('[data-bg-src]').length > 0) {
    $('[data-bg-src]').each(function () {
      var src = $(this).attr('data-bg-src');
      $(this).css('background-image', 'url(' + src + ')');
      $(this).removeAttr('data-bg-src').addClass('background-image');
    });
  }

  // -----------------------------------------
  // ***** 13. Swiper Global Slider *****
  // -----------------------------------------
  function initSwiper(el, options = {}) {
    const isMobile = window.innerWidth < 991;

    // READ HTML DATA
    if (el.dataset.autoplay === "false") {
      options.autoplay = false;
    }
    // BLOG SLIDER RULES
    if (el.classList.contains('blogSlider')) {
      options.loop = isMobile;
      options.autoplay = isMobile
        ? { delay: 3000, disableOnInteraction: false }
        : false;
      options.allowTouchMove = isMobile;
    }

    const swiper = new Swiper(el, {
      speed: 1000,
      loop: options.loop ?? true,
      autoplay: options.autoplay ?? {
        delay: 3000,
        disableOnInteraction: false,
      },

      pagination: el.querySelector('.swiper-pagination')
        ? {
          el: el.querySelector('.swiper-pagination'),
          clickable: true,
        }
        : false,

      navigation: {
        nextEl: el.querySelector('.swiper-button-next'),
        prevEl: el.querySelector('.swiper-button-prev'),
      },

      breakpoints: getDynamicBreakpoints(el),
      ...options,
    });

    // GLOBAL PAGINATION
    if (el.dataset.pagination === "global") {
      initGlobalPagination(swiper, {
        splitIndex: bp(el, 'split', 4),
      });
      swiper.pagination?.destroy();
    }
    return swiper;
  }

  document.querySelectorAll('[data-swiper]').forEach(el => {
    initSwiper(el);
  });

  function bp(el, size, fallback) {
    return parseInt(el.dataset[size]) || fallback;
  }
  function getDynamicBreakpoints(el) {
    return {
      320: {
        slidesPerView: bp(el, 'sm', 1),
        spaceBetween: bp(el, 'gapSm', 10),
      },
      576: {
        slidesPerView: bp(el, 'md', 2),
        spaceBetween: bp(el, 'gapMd', 15),
      },
      992: {
        slidesPerView: bp(el, 'lg', 3),
        spaceBetween: bp(el, 'gapLg', 20),
      },
      1200: {
        slidesPerView: bp(el, 'xl', 4),
        spaceBetween: bp(el, 'gapXl', 30),
      },
    };
  }
  // Custom Pagination 
  function initGlobalPagination(swiper, options = {}) {
    const {
      splitIndex = 4,
    } = options;

    const sliderEl = swiper.el;
    const pg1 = sliderEl.querySelector(".pg-1");
    const pg2 = sliderEl.querySelector(".pg-2");

    if (!pg1 || !pg2) return;

    const goTo = (index) => {
      swiper.autoplay?.stop();
      swiper.slideToLoop(index, 800);
      swiper.autoplay?.start();
    };

    pg1.onclick = () => {
      goTo(0);
      pg1.classList.add("active");
      pg2.classList.remove("active");
    };

    pg2.onclick = () => {
      goTo(splitIndex);
      pg2.classList.add("active");
      pg1.classList.remove("active");
    };

    swiper.on("slideChangeTransitionEnd", () => {
      if (swiper.realIndex < splitIndex) {
        pg1.classList.add("active");
        pg2.classList.remove("active");
      } else {
        pg2.classList.add("active");
        pg1.classList.remove("active");
      }
    });
  }

  // -----------------------------------------
  // ***** 14.  Current Year Set *****
  // -----------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    const currentYear = new Date().getFullYear();
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
      yearElement.textContent = currentYear;
    }
  });

  // -----------------------------------------
  // ***** 15. Back To Top *****
  // -----------------------------------------
  var progressPath = document.querySelector('.progress-wrap path');
  var pathLength = progressPath.getTotalLength();
  progressPath.style.transition = progressPath.style.WebkitTransition = 'none';
  progressPath.style.strokeDasharray = pathLength + ' ' + pathLength;
  progressPath.style.strokeDashoffset = pathLength;
  progressPath.getBoundingClientRect();
  progressPath.style.transition = progressPath.style.WebkitTransition = 'stroke-dashoffset 10ms linear';
  var updateProgress = function () {
    var scroll = $(window).scrollTop();
    var height = $(document).height() - $(window).height();
    var progress = pathLength - (scroll * pathLength / height);
    progressPath.style.strokeDashoffset = progress;
  }
  updateProgress();
  $(window).scroll(updateProgress);
  var offset = 50;
  var duration = 550;
  jQuery(window).on('scroll', function () {
    if (jQuery(this).scrollTop() > offset) {
      jQuery('.progress-wrap').addClass('active-progress');
    } else {
      jQuery('.progress-wrap').removeClass('active-progress');
    }
  });
  jQuery('.progress-wrap').on('click', function (event) {
    event.preventDefault();
    jQuery('html, body').animate({ scrollTop: 0 }, duration);
    return false;
  })

  // -----------------------------------------
  // ***** 16.Counter Animation *****
  // -----------------------------------------
  function animateCounter(counter) {
    const targetValue = parseInt(counter.getAttribute("data-counter"));
    const animationDuration = 1000; // Set the desired animation duration in milliseconds
    const startTimestamp = performance.now();

    function updateCounter(timestamp) {
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / animationDuration, 1);
      const currentValue = Math.floor(targetValue * progress);
      counter.textContent = currentValue;
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    }
    requestAnimationFrame(updateCounter);
  }

  function startCounterAnimation(entries, observer) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const counter = entry.target.querySelector(".counter-number");
        animateCounter(counter);
        // observer.unobserve(entry.target);
      }
    });
  }
  const counterObserver = new IntersectionObserver(startCounterAnimation, {
    rootMargin: "0px",
    threshold: 0.2, // Adjust the threshold value as needed (0.2 means 20% visibility)
  });
  const counterBlocks = document.querySelectorAll(".counter-body");
  counterBlocks.forEach((counterBlock) => {
    counterObserver.observe(counterBlock);
  });


  // -----------------------------------------
  // ***** 17. Price Filter *****
  // -----------------------------------------
  document.addEventListener("DOMContentLoaded", () => {
    const minRange = document.getElementById("minRange");
    const maxRange = document.getElementById("maxRange");
    const minPrice = document.getElementById("minPrice");
    const maxPrice = document.getElementById("maxPrice");
    const fill = document.querySelector(".range-fill");

    if (!minRange || !maxRange || !fill) return; // safety guard

    const maxValue = +maxRange.max;

    function updateRange() {
      let min = Math.min(+minRange.value, +maxRange.value - 100);
      let max = Math.max(+maxRange.value, +minRange.value + 100);

      minRange.value = min;
      maxRange.value = max;

      minPrice.textContent = `$${min}`;
      maxPrice.textContent = `$${max}`;

      const left = (min / maxValue) * 100;
      const right = 100 - (max / maxValue) * 100;

      gsap.to(fill, {
        left: `${left}%`,
        right: `${right}%`,
        duration: 0.25,
        ease: "power2.out"
      });
    }

    minRange.addEventListener("input", updateRange);
    maxRange.addEventListener("input", updateRange);
    updateRange();
  });


  // -----------------------------------------
  // ***** 18. Flight Details Toggle *****
  // -----------------------------------------
  document.querySelectorAll(".details-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const currentCard = btn.closest(".flight-card");
      const currentDetails = currentCard.querySelector(".flight-card__details");

      const isOpen = currentDetails.classList.contains("active");

      // Close ALL cards first
      document.querySelectorAll(".flight-card").forEach(card => {
        card.classList.remove("active");
        card.querySelector(".flight-card__details")?.classList.remove("active");
        card.querySelector(".details-btn")?.classList.remove("active");
      });

      // Re-open only if it was closed
      if (!isOpen) {
        currentCard.classList.add("active");
        currentDetails.classList.add("active");
        btn.classList.add("active");
      }
    });
  });


  // -----------------------------------------
  // ***** 19. Ajax Contact Form *****
  // -----------------------------------------
  function ajaxContactForm(selectForm) {
    var form = selectForm;
    var invalidCls = "is-invalid";
    var $email = '[name="email"]';
    var $validation =
      '[name="name"],[name="email"],[name="phone"],[name="message"]'; // Remove [name="subject"]
    var formMessages = $(selectForm).next(".form-messages");

    function sendContact() {
      var formData = $(form).serialize();
      var valid;
      valid = validateContact();
      if (valid) {
        jQuery
          .ajax({
            url: $(form).attr("action"),
            data: formData,
            type: "POST",
          })
          .done(function (response) {
            // Make sure that the formMessages div has the 'success' class.
            formMessages.removeClass("error");
            formMessages.addClass("success");
            // Set the message text.
            formMessages.text(response);
            // Clear the form.
            $(form + ' input:not([type="submit"]),' + form + " textarea").val(
              ""
            );
          })
          .fail(function (data) {
            // Make sure that the formMessages div has the 'error' class.
            formMessages.removeClass("success");
            formMessages.addClass("error");
            // Set the message text.
            if (data.responseText !== "") {
              formMessages.html(data.responseText);
            } else {
              formMessages.html(
                "Oops! An error occurred and your message could not be sent."
              );
            }
          });
      }
    }

    function validateContact() {
      var valid = true;
      var formInput;
      function unvalid($validation) {
        $validation = $validation.split(",");
        for (var i = 0; i < $validation.length; i++) {
          formInput = form + " " + $validation[i];
          if (!$(formInput).val()) {
            $(formInput).addClass(invalidCls);
            valid = false;
          } else {
            $(formInput).removeClass(invalidCls);
            valid = true;
          }
        }
      }
      unvalid($validation);

      if (
        !$(form + " " + $email).val() ||
        !$(form + " " + $email)
          .val()
          .match(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/)
      ) {
        $(form + " " + $email).addClass(invalidCls);
        valid = false;
      } else {
        $(form + " " + $email).removeClass(invalidCls);
        valid = true;
      }
      return valid;
    }

    $(form).on("submit", function (element) {
      element.preventDefault();
      sendContact();
    });
  }
  ajaxContactForm(".TNajax");


  // -----------------------------------------
  // ***** 20. Magnific Popup *****
  // -----------------------------------------
  $(".popup-video").magnificPopup({
    type: "iframe",
  });

})(jQuery);
