document.addEventListener('DOMContentLoaded', () => {
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
});