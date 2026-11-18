$(function () {
  // 1. Mobile Menu Toggle Logic
  const menuToggle = document.getElementById('menu-toggle');
  const menuMobile = document.getElementById('menu-mobile');
  const menuIcon = document.getElementById('menu-icon');

  if (menuToggle && menuMobile && menuIcon) {
    const setMenuOpen = (isOpen) => {
      menuMobile.classList.toggle('active', isOpen);
      menuIcon.classList.toggle('fa-bars', !isOpen);
      menuIcon.classList.toggle('fa-xmark', isOpen);
    };

    menuToggle.addEventListener('click', () => {
      setMenuOpen(!menuMobile.classList.contains('active'));
    });

    menuMobile.addEventListener('click', (event) => {
      if (event.target instanceof Element && event.target.closest('a')) {
        setMenuOpen(false);
      }
    });

    document.addEventListener('click', (event) => {
      if (
        menuMobile.classList.contains('active') &&
        event.target instanceof Node &&
        !menuMobile.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && menuMobile.classList.contains('active')) {
        setMenuOpen(false);
        menuToggle.focus();
      }
    });
  }

  // 2. Sidebar Dropdown / Accordion
  const groupToggles = document.querySelectorAll('.group-toggle');
  const sidebarGroups = document.querySelectorAll('.sidebar-group');

  groupToggles.forEach((toggle) => {
    toggle.addEventListener('click', function () {
      const parentGroup = this.closest('.sidebar-group');
      const isOpen = parentGroup.classList.contains('active');

      sidebarGroups.forEach((group) => group.classList.remove('active'));

      if (!isOpen) {
        parentGroup.classList.add('active');
      }
    });
  });

  const sidebarLinks = document.querySelectorAll('.sidebar-link');

  function setActiveSidebarItem(activeLink, activeGroup) {
    sidebarLinks.forEach((link) => {
      link.classList.toggle('active', link === activeLink);
    });

    sidebarGroups.forEach((group) => group.classList.remove('active'));
    (activeGroup || activeLink?.closest('.sidebar-group'))?.classList.add('active');
  }

  function updateLightScrollSpy() {
    const landmarks = document.querySelectorAll('.doc-title-section, .doc-section[id]');
    const activationLine = window.scrollY + 140;
    let activeLandmark = landmarks[0];

    landmarks.forEach((landmark) => {
      if (landmark.getBoundingClientRect().top + window.scrollY <= activationLine) {
        activeLandmark = landmark;
      }
    });

    if (!activeLandmark) {
      setActiveSidebarItem(null, null);
      return;
    }

    const isChapterTitle = activeLandmark.classList.contains('doc-title-section');
    const activeSection = isChapterTitle
      ? activeLandmark.closest('section')?.querySelector('.doc-section[id]')
      : activeLandmark;
    const activeLink = activeSection
      ? Array.from(sidebarLinks).find((link) => link.getAttribute('href') === `#${activeSection.id}`)
      : null;

    setActiveSidebarItem(isChapterTitle ? null : activeLink, activeLink?.closest('.sidebar-group'));
  }

  sidebarLinks.forEach((link) => {
    link.addEventListener('click', () => setActiveSidebarItem(link, null));
  });

  window.addEventListener('scroll', updateLightScrollSpy, { passive: true });
  window.addEventListener('resize', updateLightScrollSpy);

  // 3. Asynchronous File Loader
  const includeTargets = $('[data-include]');
  let loadedCount = 0;

  includeTargets.each(function () {
    const $el = $(this);
    const file = $el.data('include');

    $el.load(file, function (response, status, xhr) {
      if (status !== 'success') {
        console.error(`Gagal memuat ${file}:`, xhr.status, xhr.statusText);
        $el.attr('role', 'alert')
          .html('<p style="color: red; padding: 1rem;">Materi gagal dimuat. Silakan muat ulang halaman.</p>');
      }

      loadedCount++;

      if (loadedCount === includeTargets.length) {
        updateLightScrollSpy();

        if (window.location.hash) {
          const target = document.querySelector(window.location.hash);
          if (target) {
            setTimeout(() => {
              target.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }
        }
      }
    });
  });
});