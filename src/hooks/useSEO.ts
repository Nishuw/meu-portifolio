import { useEffect } from "react";

interface SEOOptions {
  title: string;
  description?: string;
  image?: string;
  type?: "website" | "article" | "profile";
  url?: string;
}

const DEFAULT_TITLE = "Ryan Nishikawa — Desenvolvedor Python & IA";

const setMetaTag = (attr: "name" | "property", key: string, content?: string) => {
  if (!content) return;
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attr, key);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
};

const setCanonical = (url: string) => {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", "canonical");
    document.head.appendChild(element);
  }
  element.setAttribute("href", url);
};

const toAbsoluteUrl = (value?: string) => {
  if (!value) return undefined;
  if (/^https?:\/\//.test(value)) return value;
  return `${window.location.origin}${value.startsWith("/") ? "" : "/"}${value}`;
};

/**
 * Atualiza title e metatags (description, Open Graph, Twitter) por rota.
 * Como este é um SPA sem SSR, as tags são aplicadas no cliente a cada navegação.
 */
export const useSEO = ({ title, description, image, type = "website", url }: SEOOptions) => {
  useEffect(() => {
    const resolvedUrl = url ?? window.location.href;
    const resolvedImage = toAbsoluteUrl(image);

    document.title = title;
    setMetaTag("name", "description", description);

    setMetaTag("property", "og:title", title);
    setMetaTag("property", "og:description", description);
    setMetaTag("property", "og:type", type);
    setMetaTag("property", "og:url", resolvedUrl);
    setMetaTag("property", "og:image", resolvedImage);

    setMetaTag("name", "twitter:card", resolvedImage ? "summary_large_image" : "summary");
    setMetaTag("name", "twitter:title", title);
    setMetaTag("name", "twitter:description", description);
    setMetaTag("name", "twitter:image", resolvedImage);

    setCanonical(resolvedUrl);

    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, [title, description, image, type, url]);
};
