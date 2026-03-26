gsap.registerPlugin(ScrollTrigger);


gsap.set(".hero-title", { opacity: 0, y: 150, scale:1.5});
gsap.set(".hero-divider", { opacity: 0, y: -20 });
gsap.set(".site-nav", { opacity: 0, y: -20 });

gsap.set(".hero-cards .card", { x: 70, opacity: 0 });
gsap.set(".hero-description", { opacity: 0, x: -20, y:70 });


const tl = gsap.timeline({
    defaults: { ease: "power2.out" }
});


tl.to(".hero-title", {
    scale: 1,
    opacity: 1,
    duration: 0.7,
    ease: "power4.out",
    delay:.7
});




tl.to(".hero-title", {
   y: () => {
        const w = window.innerWidth;

        if (w < 576) return -190;     // phones → big shift
        if (w < 992) return -150;     // tablets → medium
        return -45;                  // desktops → smaller
    },
    duration: 0.6
});




tl.to(".hero-divider", {
    opacity: 1,
    y: 0,
    duration: 0.6
}, "-=0.2");

tl.to(".site-nav", {
    opacity: 1,
    y: 0,
    duration: 0.6
}, "-=0.5");




tl.to(".hero-description", {
    opacity: 1,
    x: 0,
    duration: 0.6
}, "-=0.3");




tl.to(".hero-cards .card", {
    x: 0,
    opacity: 1,
    scale: 1,
    stagger: 0.12,
    duration: 0.6,
    ease: "power2.out"
}, "-=0.4");