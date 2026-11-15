$(function () {
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

  const includeTargets = $('[data-include]');
  let loadedCount = 0;
  const sidebarLinks = document.querySelectorAll('.sidebar-link');

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

      // Setelah SEMUA file bagian section selesai dimuat ke dalam DOM
      if (loadedCount === includeTargets.length) {
        updateActiveSidebarLink();

        // Jika halaman diakses langsung menggunakan hash link (cth: materi.html#saktah)
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

  function updateActiveSidebarLink() {
    const sections = document.querySelectorAll('.doc-section');
    const currentScroll = window.scrollY;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (currentScroll >= sectionTop && currentScroll < sectionTop + sectionHeight) {
        sidebarLinks.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${sectionId}`);
        });
      }
    });
  }

  window.addEventListener('scroll', () => {
    updateActiveSidebarLink();
  });

  sidebarLinks.forEach((link) => {
    link.addEventListener('click', function () {
      sidebarLinks.forEach((l) => l.classList.remove('active'));
      this.classList.add('active');
    });
  });
});