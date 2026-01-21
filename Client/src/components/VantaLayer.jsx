import { useEffect } from "react";

function VantaLayer() {
  useEffect(() => {
    const vanta = window.VANTA.GLOBE({
      el: "#vanta-layer", // STATIC element
      mouseControls: true,
      touchControls: true,
      gyroControls: false,

      backgroundColor: 0xf5f3ff,
      color: 0x7c3aed,
      color2: 0xec4899,
      size: 0.9,
    });

    return () => {
      if (vanta) vanta.destroy();
    };
  }, []);

  return (
    <div
      id="vanta-layer"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
      }}
    />
  );
}

export default VantaLayer;


