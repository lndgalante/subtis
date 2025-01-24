import { useEffect, useRef, useState } from "react";
import { AspectRatio } from "~/components/ui/aspect-ratio";

// lib
import { generatePlaceholderURL } from "~/lib/thumbhash";

// types
type Props = {
  alt: string;
  src: string | null;
  hashUrl: string | null;
};

export function ThumbHashPosterImage({ src, hashUrl, alt }: Props) {
  // react hooks
  const [imgIsLoading, setImgIsLoading] = useState(true);
  const imageReference = useRef<HTMLImageElement>(null);

  // effects
  useEffect(() => {
    if (imageReference.current?.complete) {
      setImgIsLoading(false);
    }
  }, []);

  // handlers
  function onLoaded(): void {
    setImgIsLoading(false);
  }

  if (!src || !hashUrl) {
    return null;
  }

  // constants
  const placeholderURL = generatePlaceholderURL(hashUrl);

  return (
    <div className="w-[384px] h-[575px] rounded-sm overflow-hidden">
      <AspectRatio ratio={384 / 575} className="relative">
        <img
          src={placeholderURL}
          alt={`${alt} placeholder`}
          className="absolute inset-0 w-[384px] h-[575px] object-cover"
        />
        <img
          onLoad={onLoaded}
          className={`absolute inset-0 ${imgIsLoading ? "opacity-0" : "opacity-100"} transition-opacity ease-in-out duration-300 w-[380px] h-[571px] rounded-[2px] inset-[2px] object-cover`}
          src={src}
          alt={alt}
          loading="eager"
          decoding="async"
        />
      </AspectRatio>
    </div>
  );
}

// <div className="w-[228px] h-[340px]">
//   <AspectRatio ratio={16 / 9} className="relative">
//     <img
//       src={placeholderURL}
//       alt={`${alt} placeholder`}
//       className={`absolute inset-0 w-[228px] h-[340px] ${imgIsLoading ? "opacity-100" : "opacity-0"} transition-all duration-75 ease-linear group-hover:opacity-100 object-cover`}
//     />
//     <img
//       ref={imageReference}
//       onLoad={onLoaded}
//       className={`absolute inset-[2px] w-[224px] h-[336px] ${imgIsLoading ? "opacity-0" : "opacity-100"} transition-all ease-in-out duration-300  rounded-[2px] object-cover`}
//       src={src}
//       alt={alt}
//       loading="eager"
//       decoding="async"
//     />
//   </AspectRatio>
// </div>;
