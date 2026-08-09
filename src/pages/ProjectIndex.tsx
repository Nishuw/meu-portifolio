import { useState, useMemo, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { projects } from "@/data/projects";
import Navbar from "@/components/Navbar";
import FloatingNav from "@/components/FloatingNav";
import { useSEO } from "@/hooks/useSEO";

const LAST_VIEWED_KEY = "last-viewed-project";

const ProjectIndex = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("everything");
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  useSEO({
    title: "Ryan Nishikawa | Desenvolvedor Python & IA",
    description:
      "Portfólio de Ryan Nishikawa: automação, RPA, agentes LLM, sistemas RAG e integrações corporativas, além de produtos de IA construídos nos hackathons RAISE Summit e Google Cloud.",
    image: projects[0]?.image,
    type: "website",
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Destaca e rola até o último projeto visitado ao retornar para a listagem.
  useEffect(() => {
    const lastViewed = sessionStorage.getItem(LAST_VIEWED_KEY);
    if (!lastViewed) return;
    setActiveId(lastViewed);
    const timeout = window.setTimeout(() => {
      document
        .querySelector(`[data-project-id="${lastViewed}"]`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 200);
    return () => window.clearTimeout(timeout);
  }, []);

  const handleSelect = (id: string) => {
    setActiveId(id);
    sessionStorage.setItem(LAST_VIEWED_KEY, id);
  };

  const filteredProjects = useMemo(() => {
    if (selectedCategory === "everything") {
      return projects;
    }
    return projects.filter((project) =>
      project.tags.some((tag) => tag.toLowerCase() === selectedCategory.toLowerCase())
    );
  }, [selectedCategory]);

  return (
    <>
      <main className="min-h-screen bg-background page-transition">
        <Navbar 
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
        
        {/* Project Grid */}
        <section ref={sectionRef} className="pt-32 md:pt-24 pb-24 px-6">
          {/* Mobile: Pinterest-style 2-column grid with equal sizes */}
          <div className="grid grid-cols-2 gap-3 md:hidden">
            {filteredProjects.map((project, index) => (
              <Link
                key={project.id}
                to={`/project/${project.id}`}
                data-project-id={project.id}
                onClick={() => handleSelect(project.id)}
                aria-current={activeId === project.id ? "true" : undefined}
                className={`project-card group block transition-all duration-700 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-16"
                }`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <div
                  className={`relative overflow-hidden rounded-2xl bg-muted aspect-[4/5] transition-all duration-500 ${
                    activeId === project.id
                      ? "ring-2 ring-foreground ring-offset-2 ring-offset-background"
                      : ""
                  }`}
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                <div className="pt-2 pb-3">
                  <h3 className="text-xs font-medium group-hover:opacity-70 transition-opacity duration-300 line-clamp-1">
                    {project.title}
                  </h3>
                  <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">
                    {project.tags.slice(0, 2).map((tag) => `#${tag}`).join(" ")}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Desktop: Masonry layout */}
          <div className="hidden md:block columns-2 lg:columns-3 3xl:columns-4 gap-4">
            {filteredProjects.map((project, index) => (
              <Link
                key={project.id}
                to={`/project/${project.id}`}
                data-project-id={project.id}
                onClick={() => handleSelect(project.id)}
                aria-current={activeId === project.id ? "true" : undefined}
                className={`project-card group block mb-4 break-inside-avoid transition-all duration-700 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-16"
                }`}
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                <div
                  className={`relative overflow-hidden rounded-3xl bg-muted transition-all duration-500 ${
                    activeId === project.id
                      ? "ring-2 ring-foreground ring-offset-2 ring-offset-background"
                      : ""
                  }`}
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-auto object-cover"
                    loading="lazy"
                  />
                </div>

                <div className="pt-3 pb-4">
                  <h3 className="text-sm font-medium group-hover:opacity-70 transition-opacity duration-300">
                    {project.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {project.tags.map((tag) => `#${tag}`).join(" ")}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <FloatingNav />
    </>
  );
};

export default ProjectIndex;