import { useState, FunctionComponent, useEffect } from "react";
import NextImage, { ImageProps } from "next/image";
import { FALLBACK_IMAGE } from "@framework/const";

interface StaticRequire {
  default: StaticImageData;
}
type StaticImport = StaticRequire | StaticImageData;

interface Props extends ImageProps {
  fallbackSrc?: string | StaticImport;
}

const Image: FunctionComponent<Props> = ({
  src,
  fallbackSrc = FALLBACK_IMAGE,
  ...rest
}) => {
  const [imgSrc, setImgSrc] = useState<string | StaticImport>(src);

  useEffect(() => {
    const isInvalidImage = (src: string | StaticImport) =>
      !src || src === "null" || src === "undefined";
    if (isInvalidImage(imgSrc)) {
      if (isInvalidImage(fallbackSrc)) {
        setImgSrc(FALLBACK_IMAGE);
      } else {
        setImgSrc(fallbackSrc);
      }
    }
  }, [imgSrc]);

  return (
    // <NextImage
    //   unoptimized={true}
    //   src={imgSrc}
    //   {...rest}
    //   onError={() => {
    //     setImgSrc(fallbackSrc);
    //   }}
    // />
    <span
      onClick={rest.onClick}
      style={{
        boxSizing: "border-box",
        display: "block",
        overflow: "hidden",
        width: "initial",
        height: "initial",
        background: "none",
        opacity: 1,
        border: "0px",
        margin: "0px",
        padding: "0px",
        position: "absolute",
        inset: "0px",
        zIndex: 49,
      }}
    >
      <img
        alt={rest.alt || imgSrc.toString()}
        src={imgSrc as string}
        decoding="async"
        data-nimg="fill"
        style={{
          position: "absolute",
          inset: "0px",
          boxSizing: "border-box",
          padding: "0px",
          border: "none",
          margin: "auto",
          display: "block",
          width: "0px",
          height: "0px",
          minWidth: "100%",
          maxWidth: "100%",
          minHeight: "100%",
          maxHeight: "100%",
          objectFit: rest.objectFit || "scale-down",
        }}
        onError={() => {
          setImgSrc(fallbackSrc);
        }}
      />
      <noscript></noscript>
    </span>
  );
};

export default Image;
