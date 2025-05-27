import React from "react";

function YoutubeModal() {
  const isMobile = window.innerWidth < 600; // Adjust the breakpoint as needed

  const getIframeSize = () => {
    if (isMobile) {
      return { width: 300, height: 160 };
    } else {
      return { width: 915, height: 515 };
    }
  };

  const { width, height } = getIframeSize();

  return (
    <div className="flex items-center justify-center my-12 md:my-48 mx-4 md:mx-48">
      <div className="w-full md:w-screen max-w-4xl flex items-center justify-center">
        <div
          className={`aspect-w-16 aspect-h-9 w-full md:w-auto`}
          style={{ width, height }}
        >
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/lo7JfaSy4Q0?start=9"
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
}

export default YoutubeModal;
