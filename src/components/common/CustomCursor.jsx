import React, { useState, useEffect, useRef } from "react";
import { useMousePosition, lerp } from "../../hooks/useMousePosition";

const CustomCursor = () => {
  const { x, y } = useMousePosition();
  const [cursorType, setCursorType] = useState("default");

  const outerRef = useRef(null);
  const dotRef = useRef(null);
  const rafId = useRef(null);

  const outerPos = useRef({ x: 0, y: 0 });

  // 🔥 Smooth but fast movement
  const speed = 0.4;

  useEffect(() => {
    const handleHover = (e) => {
      const target = e.target;

      const isInteractive = target.closest(
        "a, button, [role='button'], .portfolio-item, .service-card, .video-card, .hover-trigger, .group, .cursor-none"
      );

      if (isInteractive) setCursorType("hover");
      else setCursorType("default");
    };

    document.addEventListener("mouseover", handleHover);
    return () => document.removeEventListener("mouseover", handleHover);
  }, []);

  useEffect(() => {
    const animate = () => {
      if (outerRef.current && dotRef.current) {
        // Smooth follow
        outerPos.current.x = lerp(outerPos.current.x, x, speed);
        outerPos.current.y = lerp(outerPos.current.y, y, speed);

        outerRef.current.style.transform = `translate3d(${outerPos.current.x}px, ${outerPos.current.y}px, 0)`;
        dotRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }

      rafId.current = requestAnimationFrame(animate);
    };

    rafId.current = requestAnimationFrame(animate);

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [x, y]);

  return (
    <>
      {/* OUTER RING */}
      <div
        ref={outerRef}
        className={`fixed left-0 top-0 z-[10000] -ml-[20px] -mt-[20px] h-[40px] w-[40px] rounded-full pointer-events-none hidden lg:block transition-colors duration-300 ${
          cursorType === "hover"
            ? "border border-accent"
            : "border border-navy/50"
        }`}
      />

      {/* INNER DOT */}
      <div
        ref={dotRef}
        className="fixed left-0 top-0 z-[10001] -ml-[3px] -mt-[3px] h-[6px] w-[6px] rounded-full bg-accent pointer-events-none hidden lg:block"
      />
    </>
  );
};

export default CustomCursor;
