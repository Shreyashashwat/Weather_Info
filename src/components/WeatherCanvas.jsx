import { useRef, useEffect } from "react";

const WeatherCanvas = ({ weather }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    let particles = [];

    const cancel = () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resize);
    };

    // === Weather Animations ===

    // 🌧 Rain
    const drawRain = () => {
      particles = Array.from({ length: 200 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        l: Math.random() * 20 + 10,
        speed: Math.random() * 4 + 2,
      }));

      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "rgba(255,255,255,0.3)";
        ctx.lineWidth = 1;
        particles.forEach((drop) => {
          ctx.beginPath();
          ctx.moveTo(drop.x, drop.y);
          ctx.lineTo(drop.x, drop.y + drop.l);
          ctx.stroke();
          drop.y += drop.speed;
          if (drop.y > canvas.height) {
            drop.y = 0;
            drop.x = Math.random() * canvas.width;
          }
        });
        animationRef.current = requestAnimationFrame(animate);
      };
      animate();
    };

    // ❄️ Snow
    const drawSnow = () => {
      particles = Array.from({ length: 150 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 3 + 1,
        d: Math.random() + 1,
      }));

      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "rgba(255,255,255,0.8)";
        particles.forEach((flake) => {
          ctx.beginPath();
          ctx.arc(flake.x, flake.y, flake.r, 0, Math.PI * 2);
          ctx.fill();
          flake.y += flake.d;
          if (flake.y > canvas.height) {
            flake.y = 0;
            flake.x = Math.random() * canvas.width;
          }
        });
        animationRef.current = requestAnimationFrame(animate);
      };
      animate();
    };

    // ☁️ Clouds
    const drawClouds = () => {
      particles = Array.from({ length: 6 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() *  (canvas.height * 0.6),
        speed: Math.random() * 0.3 + 0.2,
      }));

      const drawCloud = (x, y) => {
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.ellipse(x, y, 60, 40, 0, 0, Math.PI * 2);
        ctx.ellipse(x + 40, y + 10, 50, 30, 0, 0, Math.PI * 2);
        ctx.ellipse(x - 40, y + 10, 50, 30, 0, 0, Math.PI * 2);
        ctx.fill();
      };

      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
       
        particles.forEach((cloud) => {
          drawCloud(cloud.x, cloud.y);
          cloud.x += cloud.speed;
          if (cloud.x > canvas.width + 100) cloud.x = -100;
        });
        animationRef.current = requestAnimationFrame(animate);
      };
      animate();
    };

    // ☀️ Clear
    const drawClear = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#87CEEB";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.arc(canvas.width - 100, 100, 50, 0, Math.PI * 2);
      ctx.fillStyle = "#FFD700";
      ctx.fill();
    };

    // 🌫 Fog
    const drawFog = () => {
      particles = Array.from({ length: 30 }, (_, i) => ({
        y: (i / 30) * canvas.height,
        alpha: Math.random() * 0.05 + 0.02,
        x: 0,
        vx: Math.random() * 0.3 - 0.15,
      }));

      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((fog) => {
          ctx.fillStyle = `rgba(200, 200, 200, ${fog.alpha})`;
          ctx.fillRect(fog.x, fog.y, canvas.width, 15);
          fog.x += fog.vx;
          if (fog.x > canvas.width) fog.x = -canvas.width;
          if (fog.x < -canvas.width) fog.x = canvas.width;
        });
        animationRef.current = requestAnimationFrame(animate);
      };
      animate();
    };

    // 🎬 Dispatcher
    switch (weather) {
      case "Rain":
        drawRain();
        break;
      case "Snow":
        drawSnow();
        break;
      case "Clouds":
        drawClouds();
        break;
      case "Clear":
        drawClear();
        break;
      case "Mist":
      case "Fog":
        drawFog();
        break;
      default:
        drawClear();
    }

    return cancel;
  }, [weather]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: -1,
        width: "100%",
        height: "100%",
      }}
    />
  );
};

export default WeatherCanvas;
