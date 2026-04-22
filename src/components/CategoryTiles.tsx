import Link from 'next/link';

type Tile = {
  id: string;
  name: string;
  productCount: number;
  imageUrl: string | null;
};

export default function CategoryTiles({ tiles }: { tiles: Tile[] }) {
  if (tiles.length === 0) return null;

  return (
    <section style={{ padding: '64px 0', backgroundColor: '#fff' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <p style={{ color: 'var(--color-primary)', fontSize: '13px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>
            Shop by Category
          </p>
          <h2 style={{ fontSize: '32px', color: 'var(--color-text-main)', marginBottom: '8px' }}>Popular Categories</h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${Math.min(tiles.length, 3)}, 1fr)`,
            gap: '24px',
          }}
        >
          {tiles.map((tile) => (
            <Link
              key={tile.id}
              href={`/?category=${encodeURIComponent(tile.name)}#products`}
              style={{
                position: 'relative',
                aspectRatio: '4/3',
                borderRadius: '8px',
                overflow: 'hidden',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-secondary)',
                backgroundImage: tile.imageUrl ? `url(${tile.imageUrl})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'flex-end',
                color: '#fff',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              }}
              className="category-tile"
            >
              <span
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(180deg, rgba(51,39,26,0) 40%, rgba(51,39,26,0.75) 100%)',
                  pointerEvents: 'none',
                }}
              />
              <div style={{ position: 'relative', padding: '24px', width: '100%' }}>
                <div style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'var(--font-heading)', marginBottom: '4px' }}>
                  {tile.name}
                </div>
                <div style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', opacity: 0.9 }}>
                  {tile.productCount} {tile.productCount === 1 ? 'product' : 'products'}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
