/* Data Point Guards — shared chart engine
   Theme, scroll-triggered animation, point annotations, count-up numbers. */

/* ---------- Global theme ---------- */
if (window.Chart) {
  Chart.defaults.font.family = "'Libre Franklin', sans-serif";
  Chart.defaults.font.size = 12;
  Chart.defaults.color = '#666';
  Chart.defaults.animation.duration = 1200;
  Chart.defaults.animation.easing = 'easeOutQuart';
  Chart.defaults.elements.bar.borderRadius = 5;
  Chart.defaults.elements.line.borderWidth = 3;
  Chart.defaults.elements.point.radius = 4;
  Chart.defaults.plugins.tooltip.backgroundColor = '#0d1420';
  Chart.defaults.plugins.tooltip.padding = 10;
  Chart.defaults.plugins.tooltip.cornerRadius = 4;
  Chart.defaults.plugins.tooltip.titleFont = { family: "'Libre Franklin', sans-serif", weight: '700' };
  Chart.defaults.plugins.legend.labels.boxWidth = 14;
  Chart.defaults.plugins.legend.labels.boxHeight = 14;

  /* ---------- Annotation plugin: labeled points on a chart ----------
     Usage in chart config:
     options: { pluginNotes: [ { x: '2024', y: 9807, text: 'The 2024 surge', dx: -8, dy: -16, align: 'right' } ] } */
  Chart.register({
    id: 'pointNotes',
    afterDatasetsDraw: function (chart) {
      var notes = chart.options.pluginNotes;
      if (!notes || !chart.scales.x || !chart.scales.y) return;
      var ctx = chart.ctx;
      ctx.save();
      notes.forEach(function (n) {
        var px = chart.scales.x.getPixelForValue(n.x);
        var py = chart.scales.y.getPixelForValue(n.y);
        if (isNaN(px) || isNaN(py)) return;
        ctx.beginPath();
        ctx.arc(px, py, 5, 0, Math.PI * 2);
        ctx.strokeStyle = '#e76f51';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.font = "700 11px 'Libre Franklin', sans-serif";
        ctx.fillStyle = '#1d3557';
        ctx.textAlign = n.align || 'left';
        ctx.fillText(n.text, px + (n.dx || 8), py + (n.dy || -10));
      });
      ctx.restore();
    }
  });
}

/* ---------- Scroll-triggered charts ----------
   lazyChart('canvasId', function () { return chartConfig; })
   The chart is created only when the canvas scrolls into view,
   so its drawing animation plays in front of the reader. */
function lazyChart(canvasId, configFactory) {
  var el = document.getElementById(canvasId);
  if (!el) return;
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      obs.unobserve(el);
      new Chart(el, configFactory());
    });
  }, { threshold: 0.35 });
  obs.observe(el);
}

/* ---------- Count-up numbers ----------
   <span data-countto="66" data-suffix=" of 67"></span> counts 0 -> 66 on scroll. */
(function () {
  function animate(el) {
    var target = parseFloat(el.getAttribute('data-countto'));
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    var dur = 1400, start = null;
    function frame(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = Math.round(target * eased);
      el.textContent = prefix + val.toLocaleString() + suffix;
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  document.addEventListener('DOMContentLoaded', function () {
    var els = document.querySelectorAll('[data-countto]');
    if (!els.length) return;
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        obs.unobserve(entry.target);
        animate(entry.target);
      });
    }, { threshold: 0.6 });
    els.forEach(function (el) { obs.observe(el); });
  });
})();

/* ---------- Reading progress bar (shared) ---------- */
window.addEventListener('scroll', function () {
  var bar = document.getElementById('progress');
  if (!bar) return;
  var h = document.documentElement;
  bar.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100) + '%';
});
