(function () {
  // QR modal open/close behavior
  (function qrModalBehavior() {
    const modal = document.getElementById("qr-modal");
    if (!modal) return;
    const modalCloseButtons = modal.querySelectorAll("[data-qr-modal-close]");

    function openModal() {
      modal.classList.add("qr-modal-open");
      document.documentElement.style.overflow = "hidden";
      modal.setAttribute("aria-hidden", "false");
    }

    function closeModal() {
      modal.classList.remove("qr-modal-open");
      document.documentElement.style.overflow = "";
      modal.setAttribute("aria-hidden", "true");
    }

    ["btn-qr-modal", "btn-qr-modal-desktop", "desktop-qr"].forEach((id) => {
      const btn = document.getElementById(id);
      if (!btn) return;
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        openModal();
      });
    });

    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    modalCloseButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        closeModal();
      });
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("qr-modal-open")) {
        closeModal();
      }
    });
  })();

  // Dynamic QR generation for desktop sidebar and mobile modal
  (function dynamicQrGeneration() {
    function refreshQr() {
      if (typeof window.QRCode === "undefined") return;
      const url = window.location.href || document.location.href;

      try {
        const desktopEl = document.getElementById("desktop-qr");
        if (desktopEl) {
          desktopEl.innerHTML = "";
          let dSize = Math.floor(
            Math.min(
              desktopEl.clientWidth || 0,
              desktopEl.clientHeight || 0,
            ) * 0.9,
          );
          if (!dSize || !Number.isFinite(dSize)) dSize = 240;
          // eslint-disable-next-line no-new
          new window.QRCode(desktopEl, {
            text: url,
            width: dSize,
            height: dSize,
          });
        }
      } catch {
        // ignore
      }

      try {
        const modalEl = document.getElementById("modal-qr");
        if (modalEl) {
          modalEl.innerHTML = "";
          let mSize = Math.floor(
            Math.min(
              modalEl.clientWidth || 0,
              modalEl.clientHeight || 0,
            ) * 0.9,
          );
          if (!mSize || !Number.isFinite(mSize)) mSize = 320;
          // eslint-disable-next-line no-new
          new window.QRCode(modalEl, {
            text: url,
            width: mSize,
            height: mSize,
          });
        }
      } catch {
        // ignore
      }
    }

    function initQr() {
      refreshQr();
    }

    window.updateQrCode = refreshQr;

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initQr, { once: true });
    } else {
      initQr();
    }
  })();

  // Mobile hide/show for top-right button (QR)
  (function mobileQrButtonVisibility() {
    const qrBtn = document.getElementById("btn-qr-modal");
    if (!qrBtn) return;
    // On recipe pages, the layout script (_layouts/recipe.html) controls
    // scroll-based hide/show for the back + QR + image zoom buttons.
    const isRecipePage = !!document.querySelector(".post-content");
    if (isRecipePage) return;
    let lastY = window.scrollY || 0;

    function setHidden(hidden) {
      if (hidden) {
        qrBtn.classList.add("btn-hidden");
      } else {
        qrBtn.classList.remove("btn-hidden");
      }
    }

    window.addEventListener(
      "scroll",
      () => {
        const isMobile = window.matchMedia("(max-width: 767px)").matches;
        if (!isMobile) return;
        const y = window.scrollY || 0;
        const goingDown = y > lastY && y > 6;
        const atTop = y <= 0;
        if (goingDown) setHidden(true);
        if (atTop || y < lastY) setHidden(false);
        lastY = y;
      },
      { passive: true },
    );
  })();
})();

