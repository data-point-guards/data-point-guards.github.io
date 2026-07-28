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

  if (page === 'sources') {
    var annotations = document.querySelectorAll('.bib .annotation');
    if (annotations.length) {
      var annotatedBib = annotations[0].parentElement;
      var detailsItems = [];
      annotatedBib.classList.add('annotated-bib');

      var toolbar = document.createElement('div');
      toolbar.className = 'bib-toolbar';
      toolbar.setAttribute('aria-label', 'Annotation controls');

      var count = document.createElement('div');
      count.className = 'bib-count';
      count.textContent = annotations.length + ' annotated sources';

      var controls = document.createElement('div');
      controls.className = 'bib-controls';

      var expandAll = document.createElement('button');
      expandAll.type = 'button';
      expandAll.textContent = 'Expand all';

      var collapseAll = document.createElement('button');
      collapseAll.type = 'button';
      collapseAll.textContent = 'Collapse all';

      controls.appendChild(expandAll);
      controls.appendChild(collapseAll);
      toolbar.appendChild(count);
      toolbar.appendChild(controls);
      annotatedBib.parentNode.insertBefore(toolbar, annotatedBib);

      annotations.forEach(function (annotation) {
        var citation = annotation.previousElementSibling;
        if (!citation || !citation.classList.contains('ref')) return;

        var entry = document.createElement('article');
        entry.className = 'bib-entry';
        citation.parentNode.insertBefore(entry, citation);
        entry.appendChild(citation);

        var details = document.createElement('details');
        details.className = 'annotation-details';

        var summary = document.createElement('summary');
        var label = document.createElement('span');
        label.className = 'annotation-summary-label';
        label.textContent = 'Read annotation';

        var icon = document.createElement('span');
        icon.className = 'annotation-summary-icon';
        icon.setAttribute('aria-hidden', 'true');

        summary.appendChild(label);
        summary.appendChild(icon);
        details.appendChild(summary);
        details.appendChild(annotation);
        entry.appendChild(details);
        detailsItems.push(details);

        details.addEventListener('toggle', function () {
          label.textContent = details.open ? 'Hide annotation' : 'Read annotation';
          syncControls();
        });
      });

      function syncControls() {
        var openCount = detailsItems.filter(function (details) {
          return details.open;
        }).length;
        expandAll.disabled = openCount === detailsItems.length;
        collapseAll.disabled = openCount === 0;
      }

      expandAll.addEventListener('click', function () {
        detailsItems.forEach(function (details) { details.open = true; });
        syncControls();
      });

      collapseAll.addEventListener('click', function () {
        detailsItems.forEach(function (details) { details.open = false; });
        syncControls();
      });

      var printStates = [];
      window.addEventListener('beforeprint', function () {
        printStates = detailsItems.map(function (details) { return details.open; });
        detailsItems.forEach(function (details) { details.open = true; });
      });

      window.addEventListener('afterprint', function () {
        detailsItems.forEach(function (details, index) {
          details.open = printStates[index];
        });
        syncControls();
      });

      syncControls();
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
