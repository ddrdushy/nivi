// Escape `<` in the serialized payload to block `</script>` injection
// even if a field contains unsanitized user content. See:
// https://nextjs.org/docs/app/guides/json-ld
function serialize(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serialize(data) }}
    />
  );
}

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
  'https://niviorganics.com';

export const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Nivi Organics',
  url: SITE_URL,
  logo: `${SITE_URL}/images/decorations/hero_bg.png`,
  sameAs: [] as string[],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    email: 'hello@niviorganics.com',
    telephone: '+94-11-234-5678',
    areaServed: 'Worldwide',
  },
  description:
    'Premium single-origin essential oils, raw butters, and herbal powders sourced directly from growers around the world.',
};
