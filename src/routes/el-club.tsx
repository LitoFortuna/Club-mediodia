import { createFileRoute } from "@tanstack/react-router";
import headerImg from "@/assets/CM_header.jpg";
import stickerImg from "@/assets/CM_logo_sticker_blackwhite.png";
import symbolImg from "@/assets/CM_simbolo-negativo.png";

export const Route = createFileRoute("/el-club")({
  head: () => ({
    meta: [
      { title: "El Club — Club Mediodía" },
      {
        name: "description",
        content: "Conoce a la banda detrás del mediodía mental. Psicodelia doméstica y memoria borrosa.",
      },
    ],
  }),
  component: ElClubPage,
});

function ElClubPage() {
  return (
    <div className="bg-black text-white selection:bg-orange selection:text-black">
      {/* HERO SECTION */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <img
          src={headerImg}
          alt="Club Mediodía Band"
          className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        
        <div className="relative z-10 text-center px-6">
          <p className="font-display uppercase tracking-[0.6em] text-xs mb-4 text-orange animate-pulse">
            La Banda
          </p>
          <h1 className="font-display text-7xl md:text-9xl font-black tracking-tighter uppercase leading-none">
            EL <span className="text-orange">CLUB</span>
          </h1>
        </div>
      </section>

      {/* MANIFESTO / STORY */}
      <section className="py-32 px-6 relative">
        <div className="absolute top-0 right-0 big-number opacity-5 select-none -translate-y-1/2">
          CM
        </div>
        
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-12">
            <h2 className="font-display text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
              Psicodelia <br />
              <span className="text-orange">Doméstica</span>
            </h2>
            <div className="space-y-6 font-body text-lg md:text-xl text-gray-400 leading-relaxed max-w-xl">
              <p>
                Club Mediodía no es solo una banda; es un estado mental. Nacidos en la penumbra de una terraza calurosa, buscamos capturar el sonido de lo que se olvida.
              </p>
              <p>
                Nuestra música habita en el espacio entre el recuerdo y la distorsión. Este disco retrata la vida cotidiana atravesada por estados mentales cambiantes: recuerdos, ansiedad, nostalgia, deseo. Momentos comunes que, vistos desde dentro, se vuelven extraños, intensos o ligeramente irreales.
              </p>
            </div>
            
            <div className="pt-8">
              <img src={symbolImg} alt="Símbolo CM" className="w-24 h-24 opacity-20 invert" />
            </div>
          </div>

          <div className="relative">
             <div className="aspect-[4/5] bg-zinc-900 overflow-hidden border border-white/5 relative group">
                <img 
                  src={stickerImg} 
                  alt="Sticker Club Mediodía" 
                  className="w-full h-full object-contain p-12 transition-transform duration-700 group-hover:scale-110 rotate-12" 
                />
                <div className="absolute inset-0 bg-orange/10 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity" />
             </div>
             <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-orange/5 rounded-full blur-3xl" />
          </div>
        </div>
      </section>

      {/* LOS TRES PILARES CONCEPTUALES (ARTBOOK) */}
      <section className="py-24 px-6 border-t border-white/5 bg-zinc-950/60">
        <div className="max-w-7xl mx-auto">
          <p className="font-display uppercase tracking-[0.4em] text-xs text-orange mb-4">
            Racional del Álbum
          </p>
          <h2 className="font-display text-4xl md:text-6xl font-black uppercase tracking-tighter mb-16">
            CONCEPTO & <span className="text-orange">MEMORIA</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="p-8 border border-white/10 bg-black/40 space-y-4">
              <p className="font-display text-xs uppercase tracking-widest text-orange">01 · Mediodía Mental</p>
              <h3 className="font-display text-2xl font-bold uppercase">Un momento suspendido</h3>
              <p className="font-body text-sm text-gray-400 leading-relaxed">
                El disco vive en una especie de mediodía emocional. Demasiado temprano para acabar el día y demasiado tarde para empezarlo. El calor pesa, el tiempo se vuelve lento, la mente empieza a divagar.
              </p>
            </div>
            <div className="p-8 border border-white/10 bg-black/40 space-y-4">
              <p className="font-display text-xs uppercase tracking-widest text-orange">02 · Psicodelia Cotidiana</p>
              <h3 className="font-display text-2xl font-bold uppercase">Psicodelia Doméstica</h3>
              <p className="font-body text-sm text-gray-400 leading-relaxed">
                No es épica, ni cósmica. Es una calle vacía, una taza de café a medio acabar, una conversación mal recordada, una fiesta que termina mal, un domingo largo...
              </p>
            </div>
            <div className="p-8 border border-white/10 bg-black/40 space-y-4">
              <p className="font-display text-xs uppercase tracking-widest text-orange">03 · Memoria Imperfecta</p>
              <h3 className="font-display text-2xl font-bold uppercase">Filtro de distorsión</h3>
              <p className="font-body text-sm text-gray-400 leading-relaxed">
                La memoria como filtro que altera, erosiona y distorsiona. Las canciones hablan de recuerdos que cambian: "miles de versiones de qué nos dijimos", "memoria borrosa al mediodía".
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* THE MEMBERS */}
      <section className="py-32 border-t border-white/5 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
            <h2 className="font-display text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none">
              LOS <br />
              <span className="text-orange">MIEMBROS</span>
            </h2>
            <p className="font-display uppercase tracking-widest text-sm text-gray-600 max-w-xs text-right">
              Identidades borrosas, <br />sonido definido.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              { name: "Adriel Achaval", role: "Voz, guitarra y coros", desc: "El arquitecto del mediodía mental." },
              { name: "Marco Mazzotta", role: "Batería, coros y arreglos", desc: "Ritmos que habitan en la penumbra." },
              { name: "Mauri Armora Basanta", role: "Bajo, coros y arreglos", desc: "El pulso constante de la terraza." }
            ].map((m, i) => (
              <div key={i} className="group border-l border-white/10 pl-8 py-4 hover:border-orange transition-colors">
                <p className="text-orange font-display font-bold text-xs uppercase tracking-widest mb-4">0{i+1}</p>
                <h3 className="font-display text-3xl font-black uppercase tracking-tight mb-2 group-hover:text-orange transition-colors">{m.name}</h3>
                <p className="font-display text-xs uppercase tracking-[0.2em] text-white/40 mb-6">{m.role}</p>
                <p className="text-gray-500 font-body">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-40 text-center relative overflow-hidden bg-black">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-black font-display uppercase tracking-tighter select-none">
              CLUB
           </div>
        </div>
        <div className="relative z-10">
          <h2 className="font-display text-4xl md:text-7xl font-black uppercase tracking-tighter mb-12">
            ¿Quieres ser parte <br /> del <span className="text-orange">mediodía</span>?
          </h2>
          <a
            href="/contacto"
            className="inline-block px-12 py-5 bg-orange text-black font-display font-bold uppercase tracking-widest text-sm transition-all hover:bg-white hover:scale-105"
          >
            Únete al club
          </a>
        </div>
      </section>
    </div>
  );
}
