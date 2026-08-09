import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getProjectById, projects } from "@/data/projects";
import Navbar from "@/components/Navbar";
import FloatingNav from "@/components/FloatingNav";
import Lightbox, { LightboxImage } from "@/components/Lightbox";
import { useSEO } from "@/hooks/useSEO";
import { ArrowLeft, ArrowRight, Expand } from "lucide-react";

const Project = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const project = getProjectById(id || "");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useSEO({
    title: project
      ? `${project.title} — Ryan Nishikawa`
      : "Projeto não encontrado — Ryan Nishikawa",
    description: project?.description,
    image: project?.images[0],
    type: "article",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!project) {
    return (
      <>
        <main className="min-h-screen bg-background">
          <Navbar />
          <div className="pt-40 pb-24 px-6 text-center">
            <h1 className="text-headline font-serif mb-4">Projeto não encontrado</h1>
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Voltar para os projetos
            </Link>
          </div>
        </main>
        <FloatingNav />
      </>
    );
  }

  const currentIndex = projects.findIndex((p) => p.id === project.id);
  const prevProject = currentIndex > 0 ? projects[currentIndex - 1] : null;
  const nextProject =
    currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null;

  const lightboxImages: LightboxImage[] = project.images.map((image, index) => ({
    src: image,
    alt: `${project.title} — imagem ${index + 1}`,
    caption: project.captions?.[index],
  }));

  return (
    <>
      <main className="min-h-screen bg-background page-transition">
        <Navbar />

        {/* Hero */}
        <section className="relative pt-16">
          <div className="relative w-full h-[70vh] md:h-[88vh] overflow-hidden">
            <img
              src={project.images[0]}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 px-6 pb-10 md:pb-16">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4 fade-in-up">
                {project.client} · {project.year}
              </p>
              <h1 className="text-display font-serif max-w-5xl fade-in-up fade-in-up-delay-1">
                {project.title}
              </h1>
            </div>
          </div>
        </section>

        {/* Editorial intro */}
        <section className="px-6 py-16 md:py-24 border-b border-border">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-4 space-y-8 fade-in-up">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
                  Papel
                </p>
                <p className="text-sm">{project.role}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
                  Período
                </p>
                <p className="text-sm">{project.year}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
                  Stack
                </p>
                <ul className="space-y-1">
                  {project.stack?.map((item) => (
                    <li key={item} className="text-sm">{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
                  Áreas
                </p>
                <p className="text-sm text-muted-foreground">
                  {project.tags.map((tag) => `#${tag}`).join(" ")}
                </p>
              </div>
            </div>

            <div className="lg:col-span-8 fade-in-up fade-in-up-delay-2">
              <p className="font-serif text-2xl md:text-3xl lg:text-4xl leading-[1.35] first-letter:float-left first-letter:font-serif first-letter:text-6xl md:first-letter:text-7xl first-letter:leading-[0.8] first-letter:pr-3 first-letter:pt-1">
                {project.description}
              </p>

              {project.highlights && (
                <div className="mt-12">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4 border-b border-border pb-2">
                    Destaques
                  </p>
                  <ul className="divide-y divide-border">
                    {project.highlights.map((h, i) => (
                      <li key={h} className="flex gap-6 py-4">
                        <span className="text-xs text-muted-foreground pt-2 tabular-nums">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="font-serif text-xl md:text-2xl leading-snug">
                          {h}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Gallery */}
        <section className="px-6 py-16">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-6">
            Galeria
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {project.images.map((image, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setLightboxIndex(index)}
                aria-label={`Ampliar imagem ${index + 1} de ${project.title}`}
                className={`project-card group relative block overflow-hidden rounded-3xl bg-muted fade-in-up cursor-zoom-in ${
                  index % 3 === 0 ? "md:col-span-2" : ""
                }`}
                style={{ animationDelay: `${index * 120}ms` }}
              >
                <img
                  src={image}
                  alt={`${project.title} — imagem ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <span className="absolute inset-0 flex items-center justify-center bg-background/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="p-3 rounded-full bg-background/80 text-foreground">
                    <Expand size={20} />
                  </span>
                </span>
                {project.captions?.[index] && (
                  <span className="absolute inset-x-0 bottom-0 p-4 text-left text-xs text-background bg-gradient-to-t from-foreground/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 line-clamp-2">
                    {project.captions[index]}
                  </span>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* Navigation */}
        <section className="py-12 px-6 border-t border-border">
          <div className="flex items-center justify-between gap-6">
            {prevProject ? (
              <button
                onClick={() => navigate(`/project/${prevProject.id}`)}
                className="group flex items-center gap-3 text-left hover:opacity-70 transition-opacity duration-300"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-2 transition-transform duration-300" />
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">
                    Anterior
                  </p>
                  <p className="font-serif text-lg">{prevProject.title}</p>
                </div>
              </button>
            ) : (
              <div />
            )}

            {nextProject ? (
              <button
                onClick={() => navigate(`/project/${nextProject.id}`)}
                className="group flex items-center gap-3 text-right hover:opacity-70 transition-opacity duration-300"
              >
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">
                    Próximo
                  </p>
                  <p className="font-serif text-lg">{nextProject.title}</p>
                </div>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
              </button>
            ) : (
              <div />
            )}
          </div>
        </section>
      </main>
      <FloatingNav />
      <Lightbox
        images={lightboxImages}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />
    </>
  );
};

export default Project;
