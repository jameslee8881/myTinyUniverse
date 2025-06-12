$(document).ready(function () {
  // Animation lock for scroll animations
  let isScrollAnimating = false;

  // Initialize Swiper for goods carousel
  const goodsSwiper = new Swiper(".goods-swiper", {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    // autoplay: {
    //   delay: 3000,
    //   disableOnInteraction: false,
    // },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    breakpoints: {
      640: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 30,
      },
      1024: {
        slidesPerView: 5,
        spaceBetween: 30,
      },
    },
  });

  // Tarot Cards Carousel
  let currentTarotIndex = 0;
  const tarotCards = $(".tarot-card");
  const tarotIndicators = $(".tarot-indicator");
  const totalTarotCards = tarotCards.length;
  let tarotAutoRotateInterval;
  let isAnimating = false; // 애니메이션 진행 중 플래그

  // 초기 카드 위치 설정
  function initializeTarotCards() {
    tarotCards.removeClass("center left right");
    tarotIndicators.removeClass("active");

    // 시계방향 회전을 위한 초기 설정
    const positions = ["center", "left", "right"];

    tarotCards.each(function (index) {
      const card = $(this);
      const relativeIndex =
        (index - currentTarotIndex + totalTarotCards) % totalTarotCards;
      card.addClass(positions[relativeIndex] || "right");
    });

    tarotIndicators.eq(currentTarotIndex).addClass("active");
  }

  function updateTarotCarousel(activeIndex) {
    // 이미 애니메이션 진행 중이면 무시
    if (isAnimating) return;

    // 같은 카드를 클릭한 경우 무시
    if (activeIndex === currentTarotIndex) return;

    isAnimating = true; // 애니메이션 시작

    // requestAnimationFrame을 사용해서 DOM 조작 최적화
    requestAnimationFrame(() => {
      // Remove all position classes in batch
      tarotCards.removeClass("center left right");
      tarotIndicators.removeClass("active");

      // 시계방향 회전을 위한 위치 배열 (center -> left -> right 순서)
      const positions = ["center", "left", "right"];

      tarotCards.each(function (index) {
        const card = $(this);
        const relativeIndex =
          (index - activeIndex + totalTarotCards) % totalTarotCards;
        card.addClass(positions[relativeIndex] || "right");
      });

      // Update indicators
      tarotIndicators.eq(activeIndex).addClass("active");
      currentTarotIndex = activeIndex;
    });

    // 애니메이션 완료 후 플래그 해제 (CSS transition 시간과 맞춤)
    setTimeout(() => {
      isAnimating = false;
    }, 800);
  }

  function nextTarotCard() {
    const nextIndex =
      (currentTarotIndex - 1 + totalTarotCards) % totalTarotCards;
    updateTarotCarousel(nextIndex);
  }

  function startTarotAutoRotate() {
    tarotAutoRotateInterval = setInterval(nextTarotCard, 4000); // 4초마다 회전
  }

  function stopTarotAutoRotate() {
    if (tarotAutoRotateInterval) {
      clearInterval(tarotAutoRotateInterval);
    }
  }

  // Indicator click handlers
  tarotIndicators.click(function () {
    const targetIndex = parseInt($(this).data("index"));
    updateTarotCarousel(targetIndex);
  });

  // Card click handlers
  tarotCards.click(function () {
    const targetIndex = parseInt($(this).data("index"));
    updateTarotCarousel(targetIndex);
  });

  // Initialize tarot cards only (no auto rotation)
  initializeTarotCards();

  // 햄버거 메뉴 동작
  const hamburger = $("#hamburger");
  const navLinks = $("#navLinks");

  // 햄버거 버튼 클릭 이벤트
  hamburger.click(function (e) {
    e.preventDefault();
    e.stopPropagation();
    hamburger.toggleClass("active");
    navLinks.toggleClass("active");
  });

  // 모바일 메뉴 링크 클릭 시 메뉴 닫기
  navLinks.find("a").click(function () {
    hamburger.removeClass("active");
    navLinks.removeClass("active");
  });

  // 메뉴 외부 클릭 시 메뉴 닫기 (개선된 로직)
  $(document).click(function (e) {
    // 햄버거 버튼이나 그 자식 요소를 클릭한 경우 무시
    if (hamburger.is(e.target) || hamburger.has(e.target).length > 0) {
      return;
    }

    // 네비게이션 메뉴나 그 자식 요소를 클릭한 경우 무시
    if (navLinks.is(e.target) || navLinks.has(e.target).length > 0) {
      return;
    }

    // 그 외의 경우 메뉴 닫기
    if (navLinks.hasClass("active")) {
      hamburger.removeClass("active");
      navLinks.removeClass("active");
    }
  });

  // ESC 키로 메뉴 닫기
  $(document).keydown(function (e) {
    if (e.key === "Escape" && navLinks.hasClass("active")) {
      hamburger.removeClass("active");
      navLinks.removeClass("active");
    }
  });

  // Smooth scrolling for navigation links with animation lock
  $(
    ".logo a, .nav-links a, .hero-buttons .btn-primary, .hero-buttons .btn-secondary"
  ).click(function (e) {
    // 이미 스크롤 애니메이션 진행 중이면 무시
    if (isScrollAnimating) return;

    const target = $(this).attr("href");

    if (target && target.startsWith("#")) {
      e.preventDefault();
      const targetSection = $(target);

      if (targetSection.length) {
        isScrollAnimating = true; // 스크롤 애니메이션 시작

        $("html, body").animate(
          {
            scrollTop: targetSection.offset().top - 60,
          },
          800,
          "easeInOutQuart",
          function () {
            // 애니메이션 완료 후 플래그 해제
            isScrollAnimating = false;
          }
        );
      }
    }
  });

  // Button click handlers
  $(".btn-primary").click(function () {
    // 이미 스크롤 애니메이션 진행 중이면 무시
    if (isScrollAnimating) return;

    if ($(this).text().includes("굿즈")) {
      isScrollAnimating = true;
      $("html, body").animate(
        {
          scrollTop: $("#goods").offset().top - 80,
        },
        800,
        "easeInOutQuart",
        function () {
          isScrollAnimating = false;
        }
      );
    } else if ($(this).text().includes("커스터마이징")) {
      isScrollAnimating = true;
      $("html, body").animate(
        {
          scrollTop: $("#tarot").offset().top - 80,
        },
        800,
        "easeInOutQuart",
        function () {
          isScrollAnimating = false;
        }
      );
    }
  });

  $(".btn-secondary").click(function () {
    // 이미 스크롤 애니메이션 진행 중이면 무시
    if (isScrollAnimating) return;

    if ($(this).text().includes("타로")) {
      isScrollAnimating = true;
      $("html, body").animate(
        {
          scrollTop: $("#tarot").offset().top - 80,
        },
        800,
        "easeInOutQuart",
        function () {
          isScrollAnimating = false;
        }
      );
    }
  });

  // Navbar background on scroll
  $(window).scroll(function () {
    if ($(this).scrollTop() > 50) {
      $(".navbar").addClass("scrolled");
    } else {
      $(".navbar").removeClass("scrolled");
    }
  });

  // Add scrolled class styles dynamically
  const style = document.createElement("style");
  style.textContent = `
        .navbar.scrolled {
            background: rgba(254, 254, 254, 0.98);
            box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
        }
    `;
  document.head.appendChild(style);

  // Animate elements on scroll
  function animateOnScroll() {
    $(".story-item, .goods-item, .tarot-card").each(function () {
      const elementTop = $(this).offset().top;
      const elementBottom = elementTop + $(this).outerHeight();
      const viewportTop = $(window).scrollTop();
      const viewportBottom = viewportTop + $(window).height();

      if (elementBottom > viewportTop && elementTop < viewportBottom) {
        $(this).addClass("animate-in");
      }
    });
  }

  // Add animation styles
  const animationStyle = document.createElement("style");
  animationStyle.textContent = `
        .story-item, .goods-item {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease;
        }
        
        .story-item.animate-in, .goods-item.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .story-item:nth-child(2) {
            transition-delay: 0.2s;
        }
        
        .story-item:nth-child(3) {
            transition-delay: 0.4s;
        }
    `;
  document.head.appendChild(animationStyle);

  // Initial animation check
  animateOnScroll();

  // Check animation on scroll
  $(window).scroll(animateOnScroll);

  // Add easing function for smooth scroll
  $.easing.easeInOutQuart = function (x, t, b, c, d) {
    if ((t /= d / 2) < 1) return (c / 2) * t * t * t * t + b;
    return (-c / 2) * ((t -= 2) * t * t * t - 2) + b;
  };

  // Contact button handlers (you can customize these links)
  // $(".smartstore-btn").click(function (e) {
  //   e.preventDefault();
  //   // Replace with actual smartstore URL
  //   window.open("https://smartstore.naver.com/", "_blank");
  // });

  // $(".instagram-btn").click(function (e) {
  //   e.preventDefault();
  //   // Replace with actual Instagram URL
  //   window.open("https://instagram.com/", "_blank");
  // });

  // Add hover effects for interactive elements
  $(".goods-item, .contact-btn").hover(
    function () {
      $(this).addClass("hover-effect");
    },
    function () {
      $(this).removeClass("hover-effect");
    }
  );

  // Add pulse animation to stars
  setInterval(function () {
    $(".hero-decoration .star").each(function (index) {
      setTimeout(() => {
        $(this).addClass("pulse");
        setTimeout(() => {
          $(this).removeClass("pulse");
        }, 300);
      }, index * 200);
    });
  }, 5000);

  // Add pulse animation styles
  const pulseStyle = document.createElement("style");
  pulseStyle.textContent = `
        .star.pulse {
            transform: scale(1.5);
            opacity: 1 !important;
        }
        
        .hover-effect {
            transform: scale(1.02);
        }
    `;
  document.head.appendChild(pulseStyle);
});
