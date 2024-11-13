
import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function CanvasAnimation() {
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    const canvas = canvasRef.current;
    const c = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ["#176ab6", "#fb9b39", ...Array(98).fill("#fff")];
    const n_stars = 150;

    const randomInt = (max, min) =>
      Math.floor(Math.random() * (max - min) + min);

    const bg = c.createRadialGradient(
      canvas.width / 2,
      canvas.height * 3,
      canvas.height,
      canvas.width / 2,
      canvas.height,
      canvas.height * 4
    );
    bg.addColorStop(0, "#32465E");
    bg.addColorStop(0.4, "#000814");
    bg.addColorStop(0.8, "#000814");
    bg.addColorStop(1, "#000");

    class Star {
      constructor(x, y, radius, color) {
        this.x = x || randomInt(0, canvas.width);
        this.y = y || randomInt(0, canvas.height);
        this.radius = radius || Math.random() * 1.1;
        this.color = color || colors[randomInt(0, colors.length)];
        this.dy = -Math.random() * 0.3;
      }

      draw() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        c.shadowBlur = randomInt(3, 15);
        c.shadowColor = this.color;
        c.strokeStyle = this.color;
        c.fillStyle = "rgba(255, 255, 255, 0.5)";
        c.fill();
        c.stroke();
        c.closePath();
      }

      update(arrayStars) {
        if (this.y - this.radius < 0) this.createNewStar(arrayStars);
        this.y += this.dy;
        this.draw();
      }

      createNewStar(arrayStars) {
        const index = arrayStars.indexOf(this);
        arrayStars.splice(index, 1);
        arrayStars.push(new Star(false, canvas.height + 5));
      }
    }

    let stars = [];
    function init() {
      for (let i = 0; i < n_stars; i++) {
        stars.push(new Star());
      }
    }

    function animate() {
      requestAnimationFrame(animate);
      c.clearRect(0, 0, canvas.width, canvas.height);
      c.fillStyle = bg;
      c.fillRect(0, 0, canvas.width, canvas.height);
      stars.forEach((star) => star.update(stars));
    }

    init();
    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      stars = [];
      init();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleButtonClick = () => {
      navigate("/home");
  };

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full bg-black z-0"
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white space-y-4 z-10 mt-96">
        <h1 className="text-4xl md:text-5xl font-bold">Welcome To Nomad</h1>
        {/* <useAuth> */}
        <div
          className="flex items-center justify-center h-screen"
          onClick={handleButtonClick}
        >
          <div className="relative group">
            <button className="relative inline-block p-px font-semibold leading-6 text-white bg-gray-800 shadow-2xl cursor-pointer rounded-xl shadow-zinc-900 transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95">
              <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-teal-400 via-blue-500 to-purple-500 p-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>

              <span className="relative z-10 block px-6 py-3 rounded-xl bg-gray-950">
                <div className="relative z-10 flex items-center space-x-2">
                  <span className="transition-all duration-500 group-hover:translate-x-1">
                  Continue Your Journey
                  </span>
                  <svg
                    className="w-6 h-6 transition-transform duration-500 group-hover:translate-x-1"
                    data-slot="icon"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      clip-rule="evenodd"
                      d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                      fill-rule="evenodd"
                    ></path>
                  </svg>
                </div>
              </span>
            </button>
          </div>
        </div>
        {/* </useAuth> */}
      </div>
    </div>
  );
}
