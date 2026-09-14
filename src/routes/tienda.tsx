import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { adminDb } from "@/lib/firebase.server";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/lib/types";

const getProducts = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const snapshot = await adminDb.collection("products").orderBy("order", "asc").get();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const products: Product[] = snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...(doc.data() as Omit<Product, "id">),
    }));

    return { products, error: null as string | null };
  } catch (err) {
    console.error("Error loading products:", err);
    return { products: [] as Product[], error: "No se pudo cargar la tienda." };
  }
});

export const Route = createFileRoute("/tienda")({
  head: () => ({
    meta: [
      { title: "Tienda — Club Mediodía" },
      {
        name: "description",
        content: "Merchandising oficial de Club Mediodía: camisetas, vinilos y más.",
      },
      { property: "og:title", content: "Tienda — Club Mediodía" },
      { property: "og:description", content: "Merchandising oficial de Club Mediodía." },
    ],
    links: [{ rel: "canonical", href: "https://clubmediodia.es/tienda" }],
  }),
  loader: () => getProducts(),
  component: TiendaPage,
  errorComponent: ({ error }) => (
    <div className="px-6 py-24 text-center text-orange">
      <p>{error instanceof Error ? error.message : "No se pudo cargar la tienda."}</p>
    </div>
  ),
});

function TiendaPage() {
  const { products, error } = Route.useLoaderData();

  return (
    <>
      <section className="px-6 pt-16 md:pt-24 pb-16 bg-background relative overflow-hidden">
        <div className="absolute top-0 right-0 big-number opacity-5 translate-x-1/4 -translate-y-1/4 select-none">
          SHOP
        </div>
        <div className="mx-auto max-w-5xl relative z-10">
          <p className="font-display uppercase tracking-[0.4em] text-xs mb-6 text-orange font-semibold">
            Tienda
          </p>
          <h1 className="font-display text-6xl md:text-9xl font-bold tracking-tighter leading-[0.8] text-white">
            LLÉVATE
            <br />
            <span className="text-orange">EL MEDIODÍA</span>
          </h1>
          <p className="mt-8 font-body text-lg md:text-xl max-w-xl text-white/50">
            Merchandising oficial. Envíos gestionados por cada proveedor al confirmar la compra.
          </p>
        </div>
      </section>

      <section className="px-6 pb-24 bg-background">
        <div className="mx-auto max-w-5xl">
          {error && (
            <p className="text-center text-arena py-12 border border-arena/20 bg-arena/5">
              {error}
            </p>
          )}
          {!error && products.length === 0 && (
            <div className="text-center py-24 border border-white/10 bg-white/5">
              <p className="font-display text-2xl text-white/40">
                Todavía no hay productos.
                <br />
                <span className="text-sm uppercase tracking-widest text-orange mt-4 block font-semibold">
                  Vuelve pronto.
                </span>
              </p>
            </div>
          )}
          {products.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
