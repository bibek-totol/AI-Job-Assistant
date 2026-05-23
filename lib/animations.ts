import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText)
}

/** Stagger-reveal a list of elements from below */
export function revealFromBelow(
  targets: gsap.TweenTarget,
  options: { delay?: number; stagger?: number; duration?: number; scrollTrigger?: ScrollTrigger.Vars } = {}
) {
  return gsap.fromTo(
    targets,
    { y: 60, opacity: 0, filter: "blur(4px)" },
    {
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      duration: options.duration ?? 0.9,
      ease: "power3.out",
      stagger: options.stagger ?? 0.08,
      delay: options.delay ?? 0,
      scrollTrigger: options.scrollTrigger,
    }
  )
}

/** Clip-path wipe reveal (bottom → top) */
export function clipReveal(
  targets: gsap.TweenTarget,
  options: { stagger?: number; scrollTrigger?: ScrollTrigger.Vars } = {}
) {
  return gsap.fromTo(
    targets,
    { clipPath: "inset(100% 0 0 0)", opacity: 0 },
    {
      clipPath: "inset(0% 0 0 0)",
      opacity: 1,
      duration: 1,
      ease: "power4.out",
      stagger: options.stagger ?? 0.1,
      scrollTrigger: options.scrollTrigger,
    }
  )
}

/** Counter animation for stat numbers */
export function animateCounter(el: HTMLElement, target: number, prefix = "", suffix = "") {
  const obj = { val: 0 }
  gsap.to(obj, {
    val: target,
    duration: 2,
    ease: "power2.out",
    onUpdate: () => {
      el.textContent = prefix + Math.round(obj.val).toLocaleString() + suffix
    },
  })
}

/** Floating parallax on mouse move */
export function initParallax(containerEl: HTMLElement, layers: { el: HTMLElement; depth: number }[]) {
  const handler = (e: MouseEvent) => {
    const cx = containerEl.offsetWidth / 2
    const cy = containerEl.offsetHeight / 2
    const dx = (e.clientX - cx) / cx
    const dy = (e.clientY - cy) / cy

    layers.forEach(({ el, depth }) => {
      gsap.to(el, {
        x: dx * depth * 30,
        y: dy * depth * 30,
        duration: 1.2,
        ease: "power2.out",
      })
    })
  }
  containerEl.addEventListener("mousemove", handler)
  return () => containerEl.removeEventListener("mousemove", handler)
}
