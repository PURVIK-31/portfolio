import { baseURL } from "./config";
import { person, social, about, home } from "./content";

const profileLinks = social.filter((s) => s.link.startsWith("http")).map((s) => s.link);

/** Site-wide entity graph: who the site is about + the site itself. Rendered once in the root layout. */
export function siteSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${baseURL}/#person`,
        name: person.name,
        givenName: person.firstName,
        familyName: person.lastName,
        jobTitle: person.role,
        description: person.bio,
        url: baseURL,
        image: `${baseURL}${person.avatar}`,
        email: `mailto:${person.email}`,
        sameAs: profileLinks,
        knowsAbout: person.knowsAbout,
        knowsLanguage: person.languages,
        nationality: { "@type": "Country", name: person.country },
        address: {
          "@type": "PostalAddress",
          addressLocality: person.city,
          addressRegion: person.region,
          addressCountry: "IN",
        },
        alumniOf: {
          "@type": "CollegeOrUniversity",
          name: person.alumniOf,
        },
        worksFor: about.work.experiences
          .filter((e) => e.timeframe.includes("Present"))
          .map((e) => ({ "@type": "Organization", name: e.company })),
        mainEntityOfPage: `${baseURL}${about.path}`,
      },
      {
        "@type": "WebSite",
        "@id": `${baseURL}/#website`,
        url: baseURL,
        name: `${person.name} – Portfolio`,
        alternateName: ["Purvik", "purvik.tech"],
        description: home.description,
        inLanguage: "en",
        publisher: { "@id": `${baseURL}/#person` },
        author: { "@id": `${baseURL}/#person` },
      },
    ],
  };
}

export function faqSchema(items: { question: string; answer: string }[], path = "/") {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${baseURL}${path === "/" ? "" : path}#faq`,
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}
