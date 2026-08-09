import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export interface LightboxImage {
  src: string;
  alt: string;
  caption?: string;
}

interface LightboxProps {
  images: LightboxImage[];
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

const Lightbox = ({ images, index, onClose, onNavigate }: LightboxProps) => {
  const isOpen = index !== null;
  const total = images.length;
  // Direção da transição: 1 avança, -1 volta.
  const [direction, setDirection] = useState(0);

  const goTo = useCallback(
    (next: number, dir: number) => {
      if (total === 0) return;
      const wrapped = (next + total) % total;
      setDirection(dir);
      onNavigate(wrapped);
    },
    [onNavigate, total]
  );

  const goPrev = useCallback(() => {
    if (index === null) return;
    goTo(index - 1, -1);
  }, [goTo, index]);

  const goNext = useCallback(() => {
    if (index === null) return;
    goTo(index + 1, 1);
  }, [goTo, index]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") goPrev();
      if (event.key === "ArrowRight") goNext();
    };

    document.addEventListener("keydown", handleKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose, goPrev, goNext]);

  if (!isOpen || index === null) return null;

  const current = images[index];
  const hasMultiple = total > 1;

  return createPortal(
    <div
      className="lightbox-overlay fixed inset-0 z-[100] flex flex-col bg-background/95 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label="Visualizador de imagens"
      onClick={onClose}
    >
      {/* Barra superior: contador e fechar */}
      <div className="flex items-center justify-between px-6 py-4">
        <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground tabular-nums">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar visualizador"
          className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-300"
        >
          <X size={20} />
        </button>
      </div>

      {/* Imagem */}
      <div
        className="relative flex-1 flex items-center justify-center px-4 md:px-16 overflow-hidden"
        onClick={(event) => event.stopPropagation()}
      >
        {hasMultiple && (
          <button
            type="button"
            onClick={goPrev}
            aria-label="Imagem anterior"
            className="absolute left-2 md:left-6 z-10 p-3 rounded-full bg-background/60 border border-border text-foreground hover:bg-foreground hover:text-background transition-all duration-300"
          >
            <ChevronLeft size={22} />
          </button>
        )}

        <figure
          key={index}
          className={`max-h-full flex flex-col items-center gap-4 ${
            direction >= 0 ? "lightbox-image-in-right" : "lightbox-image-in-left"
          }`}
        >
          <img
            src={current.src}
            alt={current.alt}
            className="max-h-[70vh] w-auto max-w-full object-contain rounded-2xl shadow-2xl"
          />
          {current.caption && (
            <figcaption className="max-w-2xl text-center text-sm text-muted-foreground font-serif italic px-4">
              {current.caption}
            </figcaption>
          )}
        </figure>

        {hasMultiple && (
          <button
            type="button"
            onClick={goNext}
            aria-label="Próxima imagem"
            className="absolute right-2 md:right-6 z-10 p-3 rounded-full bg-background/60 border border-border text-foreground hover:bg-foreground hover:text-background transition-all duration-300"
          >
            <ChevronRight size={22} />
          </button>
        )}
      </div>

      {/* Paginação por pontos */}
      {hasMultiple && (
        <div
          className="flex items-center justify-center gap-2 py-6"
          onClick={(event) => event.stopPropagation()}
        >
          {images.map((image, dotIndex) => (
            <button
              key={image.src + dotIndex}
              type="button"
              onClick={() => goTo(dotIndex, dotIndex > index ? 1 : -1)}
              aria-label={`Ir para a imagem ${dotIndex + 1}`}
              aria-current={dotIndex === index}
              className={`h-2 rounded-full transition-all duration-300 ${
                dotIndex === index
                  ? "w-8 bg-foreground"
                  : "w-2 bg-muted-foreground/40 hover:bg-muted-foreground"
              }`}
            />
          ))}
        </div>
      )}
    </div>,
    document.body
  );
};

export default Lightbox;
