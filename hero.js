gsap.registerPlugin(ScrollTrigger);


gsap.set(".hero-title", { opacity: 0, y: 150, scale:1.5});
gsap.set(".hero-divider", { opacity: 0, y: -20 });
gsap.set(".site-nav", { opacity: 0, y: -20 });
const w = window.innerWidth;
// gsap.set(".hero-cards .card", { x: 70, opacity: 0 });
gsap.set(".hero-description", { opacity: 0, x: -20,  y: () => {    
        if (w < 576) return -50;
        if (w < 992) return 35;
        return 0;
    } });
gsap.set(".hero-cards .card", { y: 10, opacity: 0 });


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

        if (w < 576) return -200;    
        if (w < 992) return -250;    
        return -40;                  
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
   y: () => {

        if (w < 576) return -170;    
        if (w < 992) return -240;    
        return -30;                  
    },
    opacity: 1,
    scale: 1,
    stagger: 0.15,
    duration: 0.6,
    ease: "back.out(2)"
}, "-=1.3");

gsap.set(".hero-cards .card", {
    force3D: true,
    willChange: "transform"
});

gsap.to(".hero-cards .card", {
    y: "-=10",
    duration: 1.2,
    ease: "sine.inOut",
    yoyo: true,
    repeat: -1,
    stagger: {
        each: 0.3,
        yoyo: true,
        repeat: -1
    }
});