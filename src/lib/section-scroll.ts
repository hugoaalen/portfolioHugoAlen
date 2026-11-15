let activeScrollCancel: (() => void) | undefined;

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Smoothly scrolls to a section while dynamically tracking live layout coordinates
 * so lazy-loaded images or GSAP ScrollTrigger pin refreshes never leave the viewport short.
 */
export function scrollToSection(sectionId: string, offset = 88): void {
  const target = document.getElementById(sectionId);
  if (!target) return;

  activeScrollCancel?.();

  const getTargetY = () => {
    const raw = target.getBoundingClientRect().top + window.scrollY - (sectionId === "hero" ? 0 : offset);
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    return Math.min(maxScroll, Math.max(0, raw));
  };

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.scrollTo({ top: getTargetY(), behavior: "instant" });
    return;
  }

  let rafId = 0;
  let settleTimer = 0;
  let cancelled = false;
  const startY = window.scrollY;
  const distance = Math.abs(getTargetY() - startY);
  const duration = Math.min(750, Math.max(320, distance * 0.25));
  const startTime = performance.now();

  const cleanup = () => {
    if (cancelled) return;
    cancelled = true;
    cancelAnimationFrame(rafId);
    window.clearTimeout(settleTimer);
    window.removeEventListener("wheel", cleanup);
    window.removeEventListener("touchstart", cleanup);
    window.removeEventListener("keydown", onKeyDown);
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "].includes(event.key)) {
      cleanup();
    }
  };

  activeScrollCancel = cleanup;
  window.addEventListener("wheel", cleanup, { passive: true, once: true });
  window.addEventListener("touchstart", cleanup, { passive: true, once: true });
  window.addEventListener("keydown", onKeyDown, { passive: true });

  const step = (now: number) => {
    if (cancelled) return;
    const progress = Math.min(1, (now - startTime) / duration);
    const liveTargetY = getTargetY();
    const currentY = startY + (liveTargetY - startY) * easeInOutCubic(progress);
    window.scrollTo({ top: currentY, behavior: "instant" });

    if (progress < 1) {
      rafId = requestAnimationFrame(step);
      return;
    }

    settleTimer = window.setTimeout(() => {
      if (cancelled) return;
      const finalY = getTargetY();
      if (Math.abs(window.scrollY - finalY) > 6) {
        window.scrollTo({ top: finalY, behavior: "instant" });
      }
      cleanup();
    }, 140);
  };

  rafId = requestAnimationFrame(step);
}
