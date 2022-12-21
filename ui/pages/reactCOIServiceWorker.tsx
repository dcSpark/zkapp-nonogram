export {};

function loadCOIServiceWorker() {
  if (typeof window !== 'undefined' && window.location.hostname != 'localhost') {
    const coi = window.document.createElement('script');
    coi.setAttribute('src', '/zkapp-nonogram/coi-serviceworker.min.js');
    window.document.head.appendChild(coi);
  }
}

loadCOIServiceWorker();
