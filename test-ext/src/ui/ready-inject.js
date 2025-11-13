(function(){
  function sendReady() {
    try {
      var height = (document.documentElement && document.documentElement.scrollHeight) || (document.body && document.body.scrollHeight) || 0;
      var width = (document.documentElement && document.documentElement.scrollWidth) || (document.body && document.body.scrollWidth) || 0;
      var message = {
        alga: true,
        version: '1',
        type: 'ready',
        payload: { height: height, width: width }
      };
      window.parent && window.parent.postMessage(message, '*');
    } catch (err) {
      try { console.error('[alga-ext] ready postMessage failed', err); } catch (_) {}
    }
  }

  function init() {
    if (window.__algaReadySignalled) return;
    window.__algaReadySignalled = true;
    sendReady();
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(init, 0);
  } else {
    window.addEventListener('DOMContentLoaded', init, { once: true });
  }

  window.addEventListener('alga:ready', init, { once: true });
})();
