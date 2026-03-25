/* ═══════════════════════════════════════════════════════════════════
   fan-cards.js — Interactive fan card contact section
   Requires GSAP (loaded before this script in index.html)
   ═══════════════════════════════════════════════════════════════════ */

/* ════════════════════════════════════════════════════════════════════
   TWEAK ZONE — all position & animation numbers live here
   ════════════════════════════════════════════════════════════════════

   FAN_ANGLE_RANGE  Total rotation arc across all card slots (degrees).
                    Bigger  → wider spread.  Smaller → tighter/more stacked.

   FAN_Y_BASE       How far down the whole fan sits from stage centre (px).
                    Bigger  → fan moves lower inside the stage container.

   FAN_EDGE_DIP     Extra droop for cards near the outer edges (px).
                    Bigger  → edge cards dip more dramatically below centre.

   FAN_X_SPREAD     Total horizontal spread, centre-to-centre of outer cards (px).
                    Bigger  → cards fan out wider left-to-right.

   BACK_SCALE       Size of non-front cards relative to the front card (0–1).
                    0.92 → back cards appear 8 % smaller than the front card.

   DUR_SWAP         Duration of the swap animation in seconds.
                    Both cards move simultaneously for this duration.

   EASE_TO_FRONT    GSAP easing for the card arriving at the front slot.
   EASE_TO_BACK     GSAP easing for the card leaving the front slot.
   ════════════════════════════════════════════════════════════════════ */

const FAN_ANGLE_RANGE = 55;
const FAN_Y_BASE      = 60;
const FAN_EDGE_DIP    = 24;
const FAN_X_SPREAD    = 100;
const BACK_SCALE      = 0.92;

const DUR_SWAP      = 0.55;
const EASE_TO_FRONT = "back.out(1.4)";
const EASE_TO_BACK  = "power3.inOut";

/* ════════════════════════════════════════════════════════════════════
   END TWEAK ZONE — no need to edit below this line
   ════════════════════════════════════════════════════════════════════ */

(function () {
    "use strict";

    const stage = document.getElementById("fanStage");
    if (!stage) return; // guard: exit if contact section isn't on this page

    const cards = Array.from(stage.querySelectorAll(".fan-card"));
    const N     = cards.length;
    if (N === 0) return;

    // The rightmost slot is always the visible "front" position.
    const FRONT_SLOT = N - 1;

    // slots[slotIndex] = cardIndex occupying that slot.
    // Initial state: card 0 (intro) → slot N-1 (rightmost/front).
    //                card 1 → slot N-2, card 2 → slot N-3, …
    // i.e. slots = [N-1, N-2, …, 1, 0]
    const slots    = cards.map((_, i) => N - 1 - i);

    // cardSlot[cardIndex] = slotIndex (inverse lookup)
    const cardSlot = new Array(N);
    slots.forEach((cardIdx, slotIdx) => {
        cardSlot[cardIdx] = slotIdx;
    });

    /* ── Slot → visual transform ────────────────────────────────────── */
    function slotTransform(slotIdx, isFront) {
        // t: 0 = leftmost slot, 1 = rightmost slot
        const t        = N === 1 ? 1 : slotIdx / (N - 1);
        const rotation = (t - 0.5) * FAN_ANGLE_RANGE;
        const x        = (t - 0.5) * FAN_X_SPREAD;
        // Edges dip a bit more than centre cards
        const y        = FAN_Y_BASE + Math.abs(t - 0.5) * 2 * FAN_EDGE_DIP;
        const scale    = isFront ? 1 : BACK_SCALE;
        // Front card always on top; others stack left-to-right
        const zIndex   = isFront ? N + 10 : slotIdx;

        return { rotation, x, y, scale, zIndex };
    }

    /* ── Apply transforms to every card ─────────────────────────────── */
    function renderAll(animate) {
        cards.forEach((card, cardIdx) => {
            const slotIdx = cardSlot[cardIdx];
            const isFront = slotIdx === FRONT_SLOT;
            const tf      = slotTransform(slotIdx, isFront);

            card.classList.toggle("is-front", isFront);

            if (!animate) {
                gsap.set(card, { ...tf, transformOrigin: "center bottom" });
            } else {
                gsap.to(card, {
                    ...tf,
                    transformOrigin: "center bottom",
                    duration: DUR_SWAP,
                    ease:     isFront ? EASE_TO_FRONT : EASE_TO_BACK,
                    overwrite: "auto",
                });
            }
        });
    }

    /* ── Swap clicked card with the current front card ───────────────── */
    function swapWithFront(clickedCardIdx) {
        const currentFrontCardIdx = slots[FRONT_SLOT];
        const clickedSlotIdx      = cardSlot[clickedCardIdx];

        // Swap slot assignments
        slots[FRONT_SLOT]       = clickedCardIdx;
        slots[clickedSlotIdx]   = currentFrontCardIdx;
        cardSlot[clickedCardIdx]      = FRONT_SLOT;
        cardSlot[currentFrontCardIdx] = clickedSlotIdx;

        renderAll(true);
    }

    /* ── Ripple effect ───────────────────────────────────────────────── */
    function spawnRipple(card, e) {
        const rect   = card.getBoundingClientRect();
        const size   = Math.max(rect.width, rect.height);
        const ripple = document.createElement("span");
        ripple.className = "fan-ripple";
        ripple.style.cssText =
            `width:${size}px; height:${size}px;` +
            `left:${e.clientX - rect.left - size / 2}px;` +
            `top:${e.clientY  - rect.top  - size / 2}px;`;
        card.appendChild(ripple);
        ripple.addEventListener("animationend", () => ripple.remove());
    }

    /* ── Click handler ───────────────────────────────────────────────── */
    cards.forEach((card, cardIdx) => {
        card.addEventListener("click", (e) => {
            const isCurrentlyFront = cardSlot[cardIdx] === FRONT_SLOT;

            if (isCurrentlyFront) {
                // Intro card (index 0) is not a link — swallow the click.
                // All other cards in the front slot → let the href open.
                if (cardIdx === 0) e.preventDefault();
                return;
            }

            // Non-front card clicked → swap it into the front slot
            e.preventDefault();
            spawnRipple(card, e);
            swapWithFront(cardIdx);
        });
    });

    /* ── Hover lift for non-front cards ─────────────────────────────── */
    cards.forEach((card, cardIdx) => {
        card.addEventListener("mouseenter", () => {
            if (cardSlot[cardIdx] === FRONT_SLOT) return;
            gsap.to(card, { y: "-=10", duration: 0.22, ease: "power2.out", overwrite: "auto" });
        });

        card.addEventListener("mouseleave", () => {
            if (cardSlot[cardIdx] === FRONT_SLOT) return;
            const tf = slotTransform(cardSlot[cardIdx], false);
            gsap.to(card, { y: tf.y, duration: 0.28, ease: "power2.out", overwrite: "auto" });
        });
    });

    /* ── Initial layout (instant, no animation) ──────────────────────── */
    renderAll(false);

    /* ── Entrance animation — cards cascade up staggered by slot ─────── */
    // Sort cards left-to-right so they appear in natural fan order
    const cardsBySlot = [...cards].sort(
        (a, b) => cardSlot[cards.indexOf(a)] - cardSlot[cards.indexOf(b)]
    );

    gsap.from(cardsBySlot, {
        y:        160,
        opacity:  0,
        duration: 0.6,
        stagger:  0.07,
        ease:     "back.out(1.3)",
        delay:    0.15,
    });

}());