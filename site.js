(function () {
  var file = window.location.pathname.split('/').pop() || 'index.html';
  var page = file.replace(/\.html$/, '') || 'index';
  document.body.classList.add('page-' + page);

  var masthead = document.querySelector('.masthead');
  var nav = document.querySelector('nav');
  if (masthead && nav) {
    var menu = document.createElement('button');
    menu.className = 'site-menu';
    menu.type = 'button';
    menu.textContent = 'Menu';
    menu.setAttribute('aria-label', 'Open site navigation');
    menu.setAttribute('aria-expanded', 'false');
    masthead.appendChild(menu);

    function setMenu(open) {
      nav.classList.toggle('open', open);
      document.body.classList.toggle('menu-open', open);
      menu.textContent = open ? 'Close' : 'Menu';
      menu.setAttribute('aria-expanded', String(open));
      menu.setAttribute('aria-label', open ? 'Close site navigation' : 'Open site navigation');
    }

    menu.addEventListener('click', function () {
      setMenu(!nav.classList.contains('open'));
    });

    nav.querySelectorAll('a').forEach(function (link) {
      if (link.getAttribute('href') === file) link.classList.add('here');
      link.addEventListener('click', function () { setMenu(false); });
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) setMenu(false);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') setMenu(false);
    });
  }

  var mainTarget = document.querySelector('.hero, .page-head, .scrolly, .story');
  if (mainTarget) {
    mainTarget.id = mainTarget.id || 'main-content';
    var skip = document.createElement('a');
    skip.href = '#' + mainTarget.id;
    skip.textContent = 'Skip to content';
    skip.style.cssText = 'position:fixed;left:12px;top:-60px;z-index:300;padding:10px 14px;background:#d8ff52;color:#101514;font:700 13px Manrope,sans-serif;text-decoration:none;border-radius:4px';
    skip.addEventListener('focus', function () { skip.style.top = '12px'; });
    skip.addEventListener('blur', function () { skip.style.top = '-60px'; });
    document.body.insertBefore(skip, document.body.firstChild);
  }

  document.querySelectorAll('figure img').forEach(function (image) {
    image.loading = 'lazy';
    image.decoding = 'async';
  });

  if (page === 'about') {
    var story = document.querySelector('.story');
    if (story) {
      story.querySelectorAll('h2').forEach(function (heading) {
        var paragraph = heading.nextElementSibling;
        if (!paragraph || paragraph.tagName !== 'P') return;
        var profile = document.createElement('section');
        profile.className = 'profile';
        story.insertBefore(profile, heading);
        profile.appendChild(heading);
        profile.appendChild(paragraph);
      });
    }
  }

  var revealItems = document.querySelectorAll('figure, .chart-block, .data-table, .profile');
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.08 });

    revealItems.forEach(function (item) {
      item.classList.add('reveal');
      revealObserver.observe(item);
    });
  }
})();
