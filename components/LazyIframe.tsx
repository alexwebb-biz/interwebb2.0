import React from 'react';

type LazyIframeProps = {
  src: string;
  title: string;
  className?: string;
  allow?: string;
  referrerPolicy?: React.IframeHTMLAttributes<HTMLIFrameElement>['referrerPolicy'];
};

export const LazyIframe: React.FC<LazyIframeProps> = ({
  src,
  title,
  className,
  allow,
  referrerPolicy = 'no-referrer-when-downgrade',
}) => {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    if (visible) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '300px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [visible]);

  return (
    <div ref={ref} className={className}>
      {visible ? (
        <iframe
          src={src}
          title={title}
          loading="lazy"
          referrerPolicy={referrerPolicy}
          className="w-full h-full border-0"
          allow={allow}
        />
      ) : (
        <div className="w-full h-full bg-slate-950/40 animate-pulse" aria-label="Loading preview" />
      )}
    </div>
  );
};

