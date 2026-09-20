import { Kicker } from "@/components/primitives/kicker";
import { Reveal, RevealPart } from "@/components/primitives/reveal";
import { Section } from "@/components/primitives/section";
import { testimonials, testimonialsHead } from "@/content";

export default function ReviewsSection() {
  return (
    <Section id="reviews">
      <Reveal>
        <RevealPart className="mb-head max-w-[min(820px,92%)]">
          <Kicker>{testimonialsHead.kicker}</Kicker>
          <h2 className="text-h2">{testimonialsHead.heading}</h2>
        </RevealPart>

        <div className="grid grid-cols-3 gap-gap-sm max-dt:grid-cols-2 max-tb:grid-cols-1">
          {testimonials.map((item) => (
            <RevealPart
              key={item.id}
              as="figure"
              className="bg-panel border-line rounded-tile p-card duration-[550ms] ease-kawai relative m-0 border transition-[transform,box-shadow] hover:-translate-y-1 hover:shadow-panel"
            >
              <span
                className="font-display text-brand mb-3 block text-[3.4rem] leading-[0.6] opacity-20"
                aria-hidden="true"
              >
                &ldquo;
              </span>
              <blockquote className="m-0">
                <p className="text-[1.02rem] leading-[1.7]">{item.quote}</p>
              </blockquote>
              <figcaption className="border-line mt-5 border-t pt-4">
                <b className="font-display block font-medium">{item.author}</b>
                <span className="text-ink-soft text-[0.83rem]">{item.role}</span>
              </figcaption>
            </RevealPart>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}
