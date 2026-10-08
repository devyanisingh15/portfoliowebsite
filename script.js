/* debbie. — portfolio interactions · curated by ui.debbie */

/* ---------------------------------------------------------------------------
   Site configuration
   CONTACT_EMAIL is the single place to set Debbie's address. Every contact
   link (nav “Let’s talk”, the Contact Me and Enter keys, dialog links and the
   contact section) reads from it. hello@debbie.example is a development
   placeholder only — replace it with a real address before publishing.
--------------------------------------------------------------------------- */
const SITE_CONFIG = {
  CONTACT_EMAIL: "hello@debbie.example",
};

(() => {
  "use strict";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* Contact links ------------------------------------------------------- */
  function applyContactEmail() {
    const email = SITE_CONFIG.CONTACT_EMAIL;
    document.querySelectorAll("[data-contact-link]").forEach((link) => {
      link.href = `mailto:${email}`;
    });
    document.querySelectorAll("[data-email-text]").forEach((el) => {
      el.textContent = email;
    });
    document.querySelectorAll("[data-year]").forEach((el) => {
      el.textContent = String(new Date().getFullYear());
    });
  }

  /* Automatic key sequence ---------------------------------------------- */
  const keyboard = document.querySelector(".keyboard");
  const keys = keyboard ? Array.from(keyboard.querySelectorAll(".key")) : [];

  const SEQUENCE = {
    step: 340,  // ms between presses
    hold: 190,  // ms a key stays down before release
    rest: 1500, // ms pause after Enter before repeating
    resume: 600 // ms grace before restarting after an interaction ends
  };

  const pause = {
    pointer: false,
    focus: false,
    dialog: false,
    hidden: document.hidden,
    reduced: reducedMotion.matches,
  };

  let index = 0;
  let stepTimer = 0;
  let releaseTimer = 0;
  let running = false;

  function releaseAll() {
    window.clearTimeout(releaseTimer);
    keys.forEach((key) => key.classList.remove("is-auto-pressed"));
  }

  function step() {
    const key = keys[index];
    key.classList.add("is-auto-pressed");
    releaseTimer = window.setTimeout(() => key.classList.remove("is-auto-pressed"), SEQUENCE.hold);

    const isLast = index === keys.length - 1;
    index = isLast ? 0 : index + 1;
    stepTimer = window.setTimeout(step, isLast ? SEQUENCE.step + SEQUENCE.rest : SEQUENCE.step);
  }

  function stopSequence() {
    running = false;
    window.clearTimeout(stepTimer);
    releaseAll();
  }

  function updateSequence() {
    const shouldRun = keys.length > 0 && !Object.values(pause).some(Boolean);
    if (shouldRun === running) return;
    if (shouldRun) {
      running = true;
      stepTimer = window.setTimeout(step, SEQUENCE.resume);
    } else {
      stopSequence();
    }
  }

  function setPause(reason, value) {
    pause[reason] = value;
    updateSequence();
  }

  if (keyboard) {
    keyboard.addEventListener("pointerenter", () => setPause("pointer", true));
    keyboard.addEventListener("pointerleave", () => setPause("pointer", false));
    keyboard.addEventListener("pointercancel", () => setPause("pointer", false));
    keyboard.addEventListener("focusin", (event) => {
      setPause("focus", event.target.matches(":focus-visible"));
    });
    keyboard.addEventListener("focusout", (event) => {
      if (!keyboard.contains(event.relatedTarget)) setPause("focus", false);
    });
  }

  document.addEventListener("visibilitychange", () => setPause("hidden", document.hidden));
  reducedMotion.addEventListener("change", (event) => setPause("reduced", event.matches));

  /* Dialogs ------------------------------------------------------------- */
  let dialogTrigger = null;

  function openDialog(dialog, trigger) {
    if (!dialog || dialog.open) return;
    dialogTrigger = trigger;
    setPause("dialog", true);
    dialog.showModal();
  }

  document.querySelectorAll("[data-dialog]").forEach((trigger) => {
    trigger.setAttribute("aria-haspopup", "dialog");
    trigger.addEventListener("click", () => {
      openDialog(document.getElementById(trigger.dataset.dialog), trigger);
    });
  });

  document.querySelectorAll("dialog").forEach((dialog) => {
    dialog.querySelectorAll("[data-close]").forEach((button) => {
      button.addEventListener("click", () => dialog.close());
    });

    // clicking the backdrop (outside the panel) closes the dialog
    dialog.addEventListener("click", (event) => {
      if (event.target !== dialog) return;
      const box = dialog.getBoundingClientRect();
      const inside = event.clientX >= box.left && event.clientX <= box.right &&
        event.clientY >= box.top && event.clientY <= box.bottom;
      if (!inside) dialog.close();
    });

    // a contact link inside a dialog closes it first so the mail client opens cleanly
    dialog.querySelectorAll("[data-contact-link]").forEach((link) => {
      link.addEventListener("click", () => dialog.close());
    });

    // Escape fires "cancel" then "close"; every path ends here
    dialog.addEventListener("close", () => {
      const trigger = dialogTrigger;
      dialogTrigger = null;
      setPause("dialog", false);
      if (trigger && trigger.isConnected) trigger.focus({ preventScroll: true });
    });
  });

  /* Marquee ------------------------------------------------------------- */
  const marquee = document.querySelector("[data-marquee]");
  const MARQUEE_SPEED = 48; // px per second

  function buildMarquee() {
    if (!marquee) return;
    const track = marquee.querySelector(".marquee__track");
    const groups = track.querySelectorAll(".marquee__group");
    const template = groups[0].querySelector(".marquee__item");

    // measure a single sentence (including its trailing gap)
    groups.forEach((group) => group.replaceChildren(template.cloneNode(true)));
    const itemWidth = groups[0].getBoundingClientRect().width;
    if (!itemWidth) return;

    // each group must be at least as wide as the widest likely viewport
    const target = Math.max(window.innerWidth, document.documentElement.clientWidth, window.screen.width || 0);
    const copies = Math.max(1, Math.ceil(target / itemWidth));
    groups.forEach((group) => {
      const items = Array.from({ length: copies }, () => template.cloneNode(true));
      group.replaceChildren(...items);
    });

    const groupWidth = groups[0].getBoundingClientRect().width;
    track.style.setProperty("--marquee-duration", `${(groupWidth / MARQUEE_SPEED).toFixed(2)}s`);
  }

  let resizeFrame = 0;
  let lastWidth = window.innerWidth;
  window.addEventListener("resize", () => {
    if (window.innerWidth === lastWidth) return;
    lastWidth = window.innerWidth;
    window.cancelAnimationFrame(resizeFrame);
    resizeFrame = window.requestAnimationFrame(buildMarquee);
  });

  /* Init ---------------------------------------------------------------- */
  applyContactEmail();
  buildMarquee();
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(buildMarquee);
  }
  updateSequence();
})();
