import { branchGroups, siteConfig } from "@/content";

/**
 * EducationalOrganization JSON-LD, built from the content layer so the
 * branch list and contact details never drift from the page.
 */
export function StructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: siteConfig.name,
    alternateName: siteConfig.nameTh,
    description: siteConfig.description,
    url: siteConfig.url,
    logo: `${siteConfig.url}${siteConfig.logo.src}`,
    foundingDate: String(siteConfig.foundedYear),
    telephone: siteConfig.phone.display,
    email: siteConfig.email,
    sameAs: [
      siteConfig.line.url,
      siteConfig.facebook.url,
      siteConfig.instagram.url,
    ],
    location: branchGroups.flatMap((group) =>
      group.branches.map((branch) => ({
        "@type": "Place",
        name: branch.name,
        address: {
          "@type": "PostalAddress",
          // Splitting `detail` finally lets these land in the right
          // fields: a floor is part of the street address, a district
          // or province is the locality. Both are omitted when the
          // branch has no value rather than filled with the other.
          ...(branch.floor ? { streetAddress: branch.floor } : {}),
          ...(branch.area ? { addressLocality: branch.area } : {}),
          addressRegion: group.region,
          addressCountry: "TH",
        },
      })),
    ),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
