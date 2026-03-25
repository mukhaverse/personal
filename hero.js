gsap.registerPlugin(ScrollTrigger);

// ─── INITIAL STATES ───
gsap.set(".hero-title", { opacity: 0, y: 150 });
gsap.set(".hero-divider", { opacity: 0, y: -20 });
gsap.set(".site-nav", { opacity: 0, y: -20 });

gsap.set(".hero-cards .card", { x: 200, opacity: 0 });
gsap.set(".hero-description", { opacity: 0, y: 20 });

// ─── TIMELINE ───
const tl = gsap.timeline({
    defaults: { ease: "power2.out" }
});

// 1. NAV + DIVIDER ENTER
tl.to(".site-nav", {
    opacity: 1,
    y: 0,
    duration: 0.6
})
.to(".hero-divider", {
    opacity: 1,
    y: 0,
    duration: 0.5
}, "-=");


// 2. TITLE APPEARS (CENTER — NO MOVE YET)
tl.to(".hero-title", {
    opacity: 1,
    duration: 0.6
});

// ⏸️ HOLD (this is important — gives it “moment”)
tl.to({}, { duration: 0.3 });


// 3. TITLE MOVES UP
tl.to(".hero-title", {
    y: -55,   
    duration: 0.8
});


// 4. DESCRIPTION ENTERS
tl.to(".hero-description", {
    opacity: 1,
    y: 0,
    duration: 0.6
}, "-=0.3");


// 5. CARDS LAST (RIGHT → LEFT)
tl.to(".hero-cards .card", {
    x: 0,
    opacity: 1,
    stagger: 0.2,
    ease: Sine.easeInOut,
    duration: 1
}, "-=0.9");