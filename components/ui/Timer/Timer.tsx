import { useRouter } from "next/router";
import { useEffect, useState } from "react";

function Timer() {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const target = new Date("11/31/2023 23:59:59");
    const interval = setInterval(() => {
      const now = new Date();
      const difference = target.getTime() - now.getTime();
      const d = Math.floor(difference / (1000 * 60 * 60 * 24));
      setDays(d);
      const h = Math.floor((difference / (1000 * 60 * 60)) % 24);
      setHours(h);
      const m = Math.floor((difference / (1000 * 60)) % 60);
      setMinutes(m);
      const s = Math.floor((difference / 1000) % 60);
      setSeconds(s);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const router = useRouter();

  return (
    <div className="flex justify-center flex-wrap p-4 sm:p-11">
      <button
        className="relative inline-flex items-center px-4 sm:px-96 py-4 sm:py-2.5 text-lg sm:text-sm font-medium text-center text-white bg-white rounded-lg focus:ring-1 bg-gradient-to-r from-red-700 via-blue-800 to-red-700 text-blue shadow-2xl bg-white-600"
        onClick={() => router.push("/featured/acdelco")}
      >
        <img
          className="absolute w-12 top-0 left-1 -mt-10 sm:-mt-6 animate-pulse"
          src={"/images/fire.webp"}
          alt=""
        />
        <img
          className="hidden sm:block w-1/4 sm:w-1/5 absolute top-1/2 left-1/3 transform -translate-x-1/2 -translate-y-1/2 sm:w-32"
          src="/images/fs.webp"
          alt=""
        />
        <img
          className="sm:hidden w-1/4 sm:w-1/5 absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 sm:w-32"
          src="/images/fs.webp"
          alt=""
        />
        <p className="hidden sm:block absolute top-1/2 right-1 transform -translate-x-1/2 -translate-y-1/2 text-3xl sm:text-4xl  text-white">
          باقي يومين!!
        </p>
        <div className="flex flex-col items-center md:tp-36">
          <div className="w-14 sm:w-10 h-14 sm:h-10 ml-2 font-bold text-white bg-black rounded-lg shadow-lg text-center">
            {days}
          </div>
          <div className="text-sm sm:text-xs text-white ml-2">Days</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-14 sm:w-10 h-14 sm:h-10 ml-2 font-bold text-white bg-black rounded-lg shadow-lg text-center">
            {hours}
          </div>
          <div className="text-sm sm:text-xs text-white ml-2">Hours</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-14 sm:w-10 h-14 sm:h-10 ml-2 font-bold text-white bg-black rounded-lg shadow-lg text-center">
            {minutes}
          </div>
          <div className="text-sm sm:text-xs text-white ml-2">Minutes</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-14 sm:w-10 h-14 sm:h-10 ml-2 font-bold text-white bg-black rounded-lg shadow-lg text-center">
            {seconds}
          </div>
          <div className="text-sm sm:text-xs text-white ml-2">Seconds</div>
        </div>
      </button>
    </div>
  );
}

export default Timer;
