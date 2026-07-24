import { useEffect } from "react";

type PageHeadProps = {
  title: string;
  description?: string;
};

/**
 * Lightweight, dependency-free replacement for a head manager.
 * Updates <title> and description/OG meta tags at runtime.
 */
export function PageHead({ title, description }: PageHeadProps) {
  useEffect(() => {
    const previousTitle = document.title;
    if (title) document.title = title;

    const metas: HTMLMetaElement[] = [];
    const setMeta = (attr: "name" | "property", key: string, content: string) => {
      let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
      const created = !el;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
      if (created) metas.push(el);
    };

    if (description) {
      setMeta("name", "description", description);
      setMeta("property", "og:description", description);
    }
    if (title) {
      setMeta("property", "og:title", title);
      setMeta("name", "twitter:title", title);
    }

    return () => {
      document.title = previousTitle;
      metas.forEach((m) => m.parentNode?.removeChild(m));
    };
  }, [title, description]);

  return null;
}
