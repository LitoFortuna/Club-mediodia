import type { Product } from "@/lib/types";

function formatPrice(cents: number, currency: string): string {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency }).format(cents / 100);
}

export function ProductCard({ product }: { product: Product }) {
  const image = product.image_url ?? null;
  // Si la imagen es un .jpg servido por nosotros, hay una versión .webp al lado
  const imageWebp =
    image && image.startsWith("/") && image.endsWith(".jpg")
      ? image.replace(/\.jpg$/, ".webp")
      : null;

  return (
    <div className="group flex flex-col border border-white/10 overflow-hidden bg-zinc-950 transition-all hover:border-orange/40">
      <div className="relative w-full aspect-square overflow-hidden bg-white/5">
        {image ? (
          <picture>
            {imageWebp && <source srcSet={imageWebp} type="image/webp" />}
            <img
              src={image}
              alt={product.name}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </picture>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/20 font-display uppercase tracking-widest text-xs">
            Club Mediodía
          </div>
        )}
        {product.sold_out && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="px-4 py-2 font-display uppercase tracking-widest text-xs border border-white/30 text-white">
              Agotado
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5 md:p-6">
        <div className="flex-1">
          <h3 className="font-display text-lg md:text-xl font-bold text-white">{product.name}</h3>
          <p className="mt-1 font-body text-sm text-white/50">{product.description}</p>
        </div>

        <div className="flex items-center justify-between gap-4 pt-2">
          <span className="font-display text-lg font-bold text-orange">
            {formatPrice(product.price_cents, product.currency)}
          </span>

          {product.sold_out ? (
            <span className="font-display uppercase tracking-widest text-xs text-white/40">
              Agotado
            </span>
          ) : product.buy_url ? (
            <a
              href={product.buy_url}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-3 bg-orange text-black font-display font-bold uppercase tracking-widest text-xs transition-all hover:bg-white hover:scale-105 active:scale-95"
            >
              Comprar
            </a>
          ) : (
            <span className="font-display uppercase tracking-widest text-xs text-white/40">
              Próximamente
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
