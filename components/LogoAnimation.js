import React, { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";

const DotLottieReact = dynamic(
  () =>
    import("@lottiefiles/dotlottie-react").then((mod) => mod.DotLottieReact),
  { ssr: false }
);

const LogoAnimation = () => {
  const [dotLottie, setDotLottie] = useState(null);
  const [isHovering, setIsHovering] = useState(false);

  const dotLottieRefCallback = useCallback((instance) => {
    if (instance) {
      setDotLottie(instance);
    }
  }, []);

  useEffect(() => {
    if (!dotLottie) return;

    const handleComplete = () => {
      if (isHovering) {
        dotLottie.play();
      }
    };

    dotLottie.addEventListener("complete", handleComplete);

    return () => {
      dotLottie.removeEventListener("complete", handleComplete);
    };
  }, [dotLottie, isHovering]);

  const handleMouseEnter = () => {
    setIsHovering(true);
    if (dotLottie) {
      dotLottie.play();
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  return (
    <div
      className="logo-container"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <DotLottieReact
        src="animations/ee-logo.lottie"
        autoplay
        loop={false}
        style={{ width: "125px", height: "125px", cursor: "pointer" }}
        dotLottieRefCallback={dotLottieRefCallback}
      />
      <noscript>
        <Image
          src="images/ee-logo.svg"
          alt="Eeshaan Pirani Logo"
          width={125}
          height={125}
        />
      </noscript>
    </div>
  );
};

export default LogoAnimation;
