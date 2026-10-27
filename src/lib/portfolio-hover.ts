import { gsap } from "gsap";

const buttons = ".hero-panel > nav a, .project-card footer a";
const surfaces = ".project-card, .showcase-panel, #experience-container > li > div, #education-container li > div, #about-container, .section-title, .footer-invitation";
const targets = `${buttons}, ${surfaces}`;

export function initializePortfolioHover(root: HTMLElement) {
  const media = gsap.matchMedia();
  media.add("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
    const context = gsap.context(() => {}, root);
    const states = new Map<HTMLElement, { hover: boolean; focused: boolean; bounds: DOMRect; enter: () => void; leave: () => void; move: (event: PointerEvent) => void }>();
    const create = (element: HTMLElement) => {
      const existing = states.get(element);
      if (existing) return existing;
      const state = { hover: false, focused: false, bounds: element.getBoundingClientRect(), enter: () => {}, leave: () => {}, move: (_event: PointerEvent) => {} };
      context.add(() => {
        const timeline = gsap.timeline({ paused: true, defaults: { duration: 0.4, ease: "power3.out" } });
        if (element.matches(buttons)) {
          element.classList.add("motion-button");
          const color = getComputedStyle(element).getPropertyValue("--p-accent-ink").trim();
          const x = gsap.quickTo(element, "x", { duration: 0.55, ease: "elastic.out(1, 0.5)" });
          const y = gsap.quickTo(element, "y", { duration: 0.55, ease: "elastic.out(1, 0.5)" });
          timeline.to(element, { "--button-fill": 1, color, scale: 1.025 }, 0);
          timeline.eventCallback("onReverseComplete", () => gsap.set(element, { clearProps: "color,transform,--button-fill" }));
          const icon = element.querySelector("svg, [aria-hidden='true']");
          if (icon) timeline.to(icon, { x: 3, y: -2, rotation: -8, ease: "back.out(2)" }, 0);
          state.move = (event) => {
            x(((event.clientX - state.bounds.left) / state.bounds.width - 0.5) * 8);
            y(((event.clientY - state.bounds.top) / state.bounds.height - 0.5) * 6);
          };
          state.leave = () => { timeline.timeScale(1.2).reverse(); x(0); y(0); };
        } else if (element.matches(".project-card, .showcase-panel")) {
          const window = element.querySelector<HTMLElement>(".preview-window");
          const light = element.querySelector<HTMLElement>(".preview-hover-light");
          const preview = element.querySelector<HTMLElement>(".project-preview");
          if (window && preview) {
            gsap.set(window, { transformPerspective: 900, transformOrigin: "50% 50%" });
            const rx = gsap.quickTo(window, "rotationX", { duration: 0.5, ease: "power3.out" });
            const ry = gsap.quickTo(window, "rotationY", { duration: 0.5, ease: "power3.out" });
            const x = gsap.quickTo(window, "x", { duration: 0.5, ease: "power3.out" });
            const y = gsap.quickTo(window, "y", { duration: 0.5, ease: "power3.out" });
            const lx = light ? gsap.quickTo(light, "x", { duration: 0.6, ease: "power3.out" }) : null;
            const ly = light ? gsap.quickTo(light, "y", { duration: 0.6, ease: "power3.out" }) : null;
            timeline.to(window, { scale: 1.035, duration: 0.65 }, 0);
            if (light) timeline.to(light, { opacity: 0.65 }, 0);
            const title = element.querySelector("h3");
            if (title) timeline.to(title, { x: 5 }, 0);
            state.move = (event) => {
              const nx = (event.clientX - state.bounds.left) / state.bounds.width - 0.5;
              const ny = (event.clientY - state.bounds.top) / state.bounds.height - 0.5;
              rx(-ny * 7); ry(nx * 10); x(nx * 5); y(ny * 5);
              const bounds = preview.getBoundingClientRect();
              lx?.(event.clientX - bounds.left); ly?.(event.clientY - bounds.top);
            };
            state.leave = () => { timeline.timeScale(0.9).reverse(); rx(0); ry(0); x(0); y(0); };
          }
        } else if (element.matches(".section-title")) {
          timeline.to(element, { "--title-turn": "9deg", "--title-scale": 1.12, duration: 0.6, ease: "elastic.out(1, 0.45)" });
        } else {
          element.classList.add("motion-section");
          timeline.to(element, { "--section-line": 1, duration: 0.5 }, 0);
          const title = element.querySelector("h3") || (element.matches(".footer-invitation") ? element.querySelector("span") : null);
          if (title) timeline.to(title, { x: 7 }, 0);
          const arrow = element.matches(".footer-invitation") ? element.querySelector("[aria-hidden]") : null;
          if (arrow) timeline.to(arrow, { x: 8, y: -8, rotation: 8 }, 0);
        }
        state.enter = () => { state.bounds = element.getBoundingClientRect(); timeline.timeScale(1).play(); };
        const leave = state.leave;
        state.leave = () => { leave(); timeline.timeScale(1.1).reverse(); };
      });
      states.set(element, state);
      return state;
    };
    const ancestors = (event: Event) => {
      const result: HTMLElement[] = [];
      let element = event.target instanceof Element ? event.target.closest<HTMLElement>(targets) : null;
      while (element && root.contains(element)) { result.push(element); element = element.parentElement?.closest<HTMLElement>(targets) ?? null; }
      return result;
    };
    const over = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      ancestors(event).forEach((element) => {
        if (event.relatedTarget instanceof Node && element.contains(event.relatedTarget)) return;
        const state = create(element); state.hover = true; state.enter();
      });
    };
    const out = (event: PointerEvent) => ancestors(event).forEach((element) => {
      if (event.relatedTarget instanceof Node && element.contains(event.relatedTarget)) return;
      const state = states.get(element); if (!state) return; state.hover = false; if (!state.focused) state.leave();
    });
    const move = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      ancestors(event).forEach((element) => { const state = create(element); if (!state.hover) { state.hover = true; state.enter(); } state.move(event); });
    };
    const focus = (event: FocusEvent) => ancestors(event).forEach((element) => { const state = create(element); state.focused = true; state.enter(); });
    const blur = (event: FocusEvent) => ancestors(event).forEach((element) => {
      if (event.relatedTarget instanceof Node && element.contains(event.relatedTarget)) return;
      const state = states.get(element); if (!state) return; state.focused = false; if (!state.hover) state.leave();
    });
    const reset = () => states.forEach((state) => { if (!state.hover) return; state.hover = false; if (!state.focused) state.leave(); });
    root.addEventListener("pointerover", over); root.addEventListener("pointerout", out); root.addEventListener("pointermove", move);
    root.addEventListener("focusin", focus); root.addEventListener("focusout", blur); window.addEventListener("scroll", reset, { passive: true }); window.addEventListener("resize", reset);
    return () => {
      root.removeEventListener("pointerover", over); root.removeEventListener("pointerout", out); root.removeEventListener("pointermove", move);
      root.removeEventListener("focusin", focus); root.removeEventListener("focusout", blur); window.removeEventListener("scroll", reset); window.removeEventListener("resize", reset);
      context.revert(); states.forEach((_, element) => element.classList.remove("motion-button", "motion-section")); states.clear();
    };
  });
  return () => media.revert();
}
