/**
 * 居酒屋ゆずりは - script.js
 * Controls dynamic interactions: Leaf animation, scroll reveal, mobile nav, and contact form action.
 */

document.addEventListener('DOMContentLoaded', () => {

  /* -----------------------------------------
     1. Header Scroll Event & Page Top Button
  ----------------------------------------- */
  const header = document.querySelector('.site-header');
  const pagetopBtn = document.getElementById('pagetop-btn');

  window.addEventListener('scroll', () => {
    // Header styling on scroll
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Pagetop button visibility
    if (window.scrollY > 300) {
      pagetopBtn.classList.add('show');
    } else {
      pagetopBtn.classList.remove('show');
    }
  });

  // Page top scroll action
  pagetopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });


  /* -----------------------------------------
     2. Mobile Navigation Toggle
  ----------------------------------------- */
  const menuToggle = document.getElementById('menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const mobileNavOverlay = document.getElementById('mobile-nav-overlay');

  const toggleMenu = () => {
    menuToggle.classList.toggle('open');
    mobileNav.classList.toggle('open');
    if (mobileNavOverlay) {
      mobileNavOverlay.classList.toggle('open');
    }
    document.body.classList.toggle('no-scroll'); // Prevent background scroll when open
  };

  menuToggle.addEventListener('click', toggleMenu);

  // Close menu when a link is clicked
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileNav.classList.contains('open')) {
        toggleMenu();
      }
    });
  });

  // Close menu when overlay is clicked
  if (mobileNavOverlay) {
    mobileNavOverlay.addEventListener('click', () => {
      if (mobileNav.classList.contains('open')) {
        toggleMenu();
      }
    });
  }


  /* -----------------------------------------
     3. Scroll Reveal Animation (Intersection Observer)
  ----------------------------------------- */
  const revealElements = document.querySelectorAll('.scroll-reveal');

  const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Once revealed, no need to keep observing this element
        observer.unobserve(entry.target);
      }
    });
  };

  const revealObserver = new IntersectionObserver(revealCallback, {
    root: null, // viewport
    threshold: 0.15, // trigger when 15% of the element is visible
    rootMargin: '0px 0px -50px 0px' // adjust activation point slightly above the bottom
  });

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });


  /* -----------------------------------------
     4. Dynamic Falling Leaves (Yuzuriha Leaves)
  ----------------------------------------- */
  const leavesContainer = document.getElementById('leaves-container');
  const leafCount = 15; // Number of active falling leaves on screen

  // Define SVG structures for variety (different green tones)
  const leafColors = [
    { fill: '#2D4B37', stroke: '#1C3123', stem: '#C85A4B' }, // Standard deep green & red stem
    { fill: '#3E664C', stroke: '#2B4835', stem: '#D47163' }, // Slightly brighter green
    { fill: '#1E3526', stroke: '#122217', stem: '#B04435' }  // Dark forest green
  ];

  const createLeaf = () => {
    const leaf = document.createElement('div');
    leaf.classList.add('falling-leaf');

    // Randomize colors from the palette
    const color = leafColors[Math.floor(Math.random() * leafColors.length)];
    
    // Generate raw inline SVG representation of a Yuzuriha leaf
    const leafSize = Math.floor(Math.random() * 25) + 20; // Width from 20px to 45px
    const leafHeight = leafSize * 1.5;

    leaf.style.width = `${leafSize}px`;
    leaf.style.height = `${leafHeight}px`;

    leaf.innerHTML = `
      <svg viewBox="0 0 100 150" width="100%" height="100%">
        <!-- Stem (Reddish leaf-stalk - characteristic of Yuzuriha) -->
        <path d="M 50 150 C 47 110, 53 85, 50 50" stroke="${color.stem}" stroke-width="6" fill="none" stroke-linecap="round"/>
        <!-- Leaf blade -->
        <path d="M 50 110 C 22 90, 18 50, 50 10 C 82 50, 78 90, 50 110 Z" fill="${color.fill}" stroke="${color.stroke}" stroke-width="2"/>
        <!-- Veins -->
        <path d="M 50 90 Q 40 80, 32 75 M 50 75 Q 40 65, 35 60 M 50 60 Q 42 50, 38 45 M 50 90 Q 60 80, 68 75 M 50 75 Q 60 65, 65 60 M 50 60 Q 58 50, 62 45" stroke="rgba(255,255,255,0.12)" stroke-width="2" fill="none" stroke-linecap="round"/>
      </svg>
    `;

    // Position and animation styling
    const startX = Math.random() * 100; // Left offset (0vw to 100vw)
    const animationDelay = Math.random() * 15; // delay offset (0s to 15s)
    const animationDuration = Math.random() * 12 + 10; // fall duration (10s to 22s)

    leaf.style.left = `${startX}vw`;
    leaf.style.animationDelay = `${animationDelay}s`;
    leaf.style.animationDuration = `${animationDuration}s`;

    // Add CSS transition delay for gentle entry opacity
    leaf.style.opacity = '0';

    leavesContainer.appendChild(leaf);

    // Remove leaf after its animation cycle completes to clean DOM, then replace it
    setTimeout(() => {
      leaf.remove();
      createLeaf();
    }, (animationDelay + animationDuration) * 1000);
  };

  // Initialize leaf animation elements
  for (let i = 0; i < leafCount; i++) {
    createLeaf();
  }


  /* -----------------------------------------
     5. Contact Form Submission (Mailto link creation)
  ----------------------------------------- */
  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Retrieve form values
      const name = document.getElementById('form-name').value.trim();
      const contact = document.getElementById('form-contact').value.trim();
      const message = document.getElementById('form-message').value.trim();

      if (!name || !contact || !message) {
        alert('必須項目が入力されていません。');
        return;
      }

      // Construct mailto link
      const emailTo = 'yuzuriha20260201@gmail.com';
      const emailSubject = encodeURIComponent('【居酒屋ゆずりは】お問い合わせ');
      
      const emailBodyText = `【居酒屋ゆずりは お問い合わせ】

お名前：
${name}

ご連絡先：
${contact}

内容：
${message}
`;
      const emailBody = encodeURIComponent(emailBodyText);

      // Trigger mail software
      window.location.href = `mailto:${emailTo}?subject=${emailSubject}&body=${emailBody}`;
      
      // Optionally reset form after short delay
      setTimeout(() => {
        contactForm.reset();
      }, 1000);
    });
  }

  /* -----------------------------------------
     6. Menu Details Modal (詳しくはこちらポップアップ)
  ----------------------------------------- */
  // メニュー画像のマッピング
  const menuImages = {
    drink: ['img/ドリンクメニュー1.png', 'img/ドリンクメニュー2.png'],
    grand: ['img/定番メニュー.png'],
    lunch: ['img/ランチメニュー.png'],
    takeout: ['img/テイクアウトメニュー.png']
  };

  const modal = document.getElementById('menu-modal');
  const modalImg = document.getElementById('modal-img');
  const modalOverlay = document.getElementById('modal-overlay');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalPrevBtn = document.getElementById('modal-prev-btn');
  const modalNextBtn = document.getElementById('modal-next-btn');
  const modalCounter = document.getElementById('modal-counter');

  let currentMenuType = '';
  let currentImageIndex = 0;

  // モーダルを開く
  const openMenuModal = (menuType) => {
    currentMenuType = menuType;
    currentImageIndex = 0;
    updateModalContent();
    modal.classList.add('show');
    document.body.classList.add('no-scroll'); // 背景スクロール禁止
  };

  // モーダルを閉じる
  const closeMenuModal = () => {
    modal.classList.remove('show');
    document.body.classList.remove('no-scroll');
    // 画像を少し遅らせてクリアし、閉じる際のアニメーション中のチラつきを防ぐ
    setTimeout(() => {
      modalImg.src = '';
    }, 400);
  };

  // モーダル内の画像およびナビゲーション制御の更新
  const updateModalContent = () => {
    const images = menuImages[currentMenuType];
    if (!images || images.length === 0) return;

    // 画像ソースの設定
    modalImg.src = images[currentImageIndex];

    // ナビゲーションの表示制御
    if (images.length > 1) {
      modalPrevBtn.style.display = 'flex';
      modalNextBtn.style.display = 'flex';
      modalCounter.style.display = 'block';
      modalCounter.textContent = `${currentImageIndex + 1} / ${images.length}`;
    } else {
      modalPrevBtn.style.display = 'none';
      modalNextBtn.style.display = 'none';
      modalCounter.style.display = 'none';
    }
  };

  // スライド切り替え（前へ）
  const showPrevImage = () => {
    const images = menuImages[currentMenuType];
    if (!images) return;
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    updateModalContent();
  };

  // スライド切り替え（次へ）
  const showNextImage = () => {
    const images = menuImages[currentMenuType];
    if (!images) return;
    currentImageIndex = (currentImageIndex + 1) % images.length;
    updateModalContent();
  };

  // イベントリスナーの登録
  const detailTriggers = document.querySelectorAll('.detail-trigger');
  detailTriggers.forEach(button => {
    button.addEventListener('click', () => {
      const menuType = button.getAttribute('data-menu-type');
      openMenuModal(menuType);
    });
  });

  modalCloseBtn.addEventListener('click', closeMenuModal);
  modalOverlay.addEventListener('click', closeMenuModal);
  modalPrevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showPrevImage();
  });
  modalNextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showNextImage();
  });

  // キーボード操作での切り替え・終了対応
  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('show')) return;
    if (e.key === 'ArrowLeft') {
      showPrevImage();
    } else if (e.key === 'ArrowRight') {
      showNextImage();
    } else if (e.key === 'Escape') {
      closeMenuModal();
    }
  });

});
