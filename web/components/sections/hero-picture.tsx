import { getImageProps } from "next/image";
import { hero } from "@/content";

/**
 * The hero photo as a real `<picture>`, built from next/image's
 * optimised srcsets.
 *
 * Both heroes render this same element. Below 720px — where the scrub
 * hero is display:none — they both resolve to hero-mobile.jpg, and
 * above it they both resolve to hero.jpg, so the browser downloads the
 * hero exactly once either way instead of fetching the hidden one too.
 */
export function HeroPicture({ className }: { className?: string }) {
  const common = {
    alt: hero.image.alt,
    sizes: "100vw",
    priority: true,
    quality: 82,
  } as const;

  const {
    props: { srcSet: mobileSrcSet },
  } = getImageProps({
    ...common,
    src: hero.imageMobile.src,
    width: hero.imageMobile.width,
    height: hero.imageMobile.height,
  });

  const { props: desktop } = getImageProps({
    ...common,
    src: hero.image.src,
    width: hero.image.width,
    height: hero.image.height,
  });

  return (
    <picture>
      <source media="(max-width: 720px)" srcSet={mobileSrcSet} />
      {/* getImageProps output — art direction needs a real <picture> */}
      <img {...desktop} className={className} alt={hero.image.alt} />
    </picture>
  );
}
