type Status = 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | string;

const FLOW: Status[] = ['PENDING', 'PAID', 'SHIPPED', 'DELIVERED'];

const LABELS: Record<string, string> = {
  PENDING: 'Order placed',
  PAID: 'Payment confirmed',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
};

export default function OrderStatusTimeline({ status }: { status: Status }) {
  if (status === 'CANCELLED') {
    return (
      <div
        style={{
          padding: '20px',
          border: '1px solid #fecaca',
          backgroundColor: '#fef2f2',
          borderRadius: 'var(--radius-sm)',
          textAlign: 'center',
          color: '#991b1b',
          fontWeight: 600,
        }}
      >
        This order was cancelled.
      </div>
    );
  }

  const currentIndex = FLOW.indexOf(status);
  const activeIndex = currentIndex === -1 ? 0 : currentIndex;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${FLOW.length}, 1fr)`,
        gap: '4px',
        padding: '20px 8px',
      }}
    >
      {FLOW.map((step, i) => {
        const reached = i <= activeIndex;
        const isCurrent = i === activeIndex;
        return (
          <div
            key={step}
            style={{
              textAlign: 'center',
              position: 'relative',
            }}
          >
            {/* connector */}
            {i < FLOW.length - 1 && (
              <div
                style={{
                  position: 'absolute',
                  top: '18px',
                  left: '50%',
                  right: `-50%`,
                  height: '3px',
                  backgroundColor: i < activeIndex ? 'var(--color-primary)' : 'var(--color-border)',
                  zIndex: 0,
                }}
              />
            )}

            {/* node */}
            <div
              style={{
                position: 'relative',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                margin: '0 auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: reached ? 'var(--color-primary)' : '#fff',
                border: `2px solid ${reached ? 'var(--color-primary)' : 'var(--color-border)'}`,
                color: reached ? '#fff' : 'var(--color-text-muted)',
                fontWeight: 700,
                fontSize: '14px',
                zIndex: 1,
                boxShadow: isCurrent ? '0 0 0 6px rgba(208,152,162,0.18)' : 'none',
              }}
            >
              {reached ? '✓' : i + 1}
            </div>

            <div
              style={{
                marginTop: '10px',
                fontSize: '12px',
                fontWeight: 600,
                color: reached ? 'var(--color-text-main)' : 'var(--color-text-muted)',
              }}
            >
              {LABELS[step] ?? step}
            </div>
          </div>
        );
      })}
    </div>
  );
}
