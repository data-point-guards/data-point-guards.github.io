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

    function closeCategoryMenus() {
      nav.querySelectorAll('.nav-group.open').forEach(function (group) {
        group.classList.remove('open');
        group.querySelector('.nav-category').setAttribute('aria-expanded', 'false');
      });
    }

    function setMenu(open) {
      nav.classList.toggle('open', open);
      document.body.classList.toggle('menu-open', open);
      menu.textContent = open ? 'Close' : 'Menu';
      menu.setAttribute('aria-expanded', String(open));
      menu.setAttribute('aria-label', open ? 'Close site navigation' : 'Open site navigation');
      if (!open) closeCategoryMenus();
    }

    menu.addEventListener('click', function () {
      setMenu(!nav.classList.contains('open'));
    });

    var categoryTopics = {
      'index.html#audience': [
        ['Attendance', 'attendance.html'],
        ['The League', 'league.html']
      ],
      'index.html#recognition': [
        ['Awards', 'awards.html'],
        ['Greatness', 'greatness.html']
      ],
      'index.html#careers': [
        ['The Draft', 'draft.html'],
        ['College to Pros', 'college.html']
      ]
    };

    Object.keys(categoryTopics).forEach(function (href) {
      var link = nav.querySelector('a[href="' + href + '"]');
      if (!link) return;

      var group = document.createElement('div');
      group.className = 'nav-group';
      link.parentNode.insertBefore(group, link);
      group.appendChild(link);

      link.classList.add('nav-category');
      link.setAttribute('aria-haspopup', 'true');
      link.setAttribute('aria-expanded', 'false');

      var submenu = document.createElement('div');
      submenu.className = 'nav-submenu';
      submenu.setAttribute('aria-label', link.textContent.trim() + ' topics');

      categoryTopics[href].forEach(function (topic) {
        var topicLink = document.createElement('a');
        topicLink.href = topic[1];
        topicLink.textContent = topic[0];
        submenu.appendChild(topicLink);
      });

      group.appendChild(submenu);

      link.addEventListener('click', function (event) {
        event.preventDefault();
        var shouldOpen = !group.classList.contains('open');
        closeCategoryMenus();
        group.classList.toggle('open', shouldOpen);
        link.setAttribute('aria-expanded', String(shouldOpen));
      });
    });

    nav.querySelectorAll('a').forEach(function (link) {
      if (link.getAttribute('href') === file) link.classList.add('here');
      link.addEventListener('click', function () {
        if (link.classList.contains('nav-category')) return;
        closeCategoryMenus();
        setMenu(false);
      });
    });

    document.addEventListener('click', function (event) {
      if (!nav.contains(event.target)) closeCategoryMenus();
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

  function syncHomepageNav() {
    if (page !== 'index' || !nav) return;
    var expected = window.location.hash ? 'index.html' + window.location.hash : 'index.html';
    nav.querySelectorAll('a').forEach(function (link) {
      link.classList.toggle('here', link.getAttribute('href') === expected);
    });
  }

  function alignHashTarget() {
    syncHomepageNav();
    if (!window.location.hash) return;
    var target = document.getElementById(window.location.hash.slice(1));
    if (target) target.scrollIntoView({ block: 'start' });
  }

  window.addEventListener('hashchange', function () {
    window.setTimeout(alignHashTarget, 0);
  });

  window.addEventListener('load', function () {
    [0, 350, 900].forEach(function (delay) {
      window.setTimeout(alignHashTarget, delay);
    });
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
