import { useEffect } from "react";

interface DocumentHeadOptions {
  title?: string;
  description?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
}

export default function useDocumentHead(options: DocumentHeadOptions = {}) {
  const {
    title,
    description,
    canonical,
    ogTitle,
    ogDescription,
    ogImage,
    twitterCard,
    twitterTitle,
    twitterDescription,
    twitterImage,
  } = options;

  useEffect(() => {
    if (typeof window === "undefined") return; // SSR safety

    if (title) document.title = title;

    if (description) setMetaName("description", description);

    if (canonical) {
      let link = document.querySelector<HTMLLinkElement>(
        "link[rel='canonical']"
      );
      if (link) link.setAttribute("href", canonical);
      else {
        link = document.createElement("link");
        link.rel = "canonical";
        link.href = canonical;
        document.head.appendChild(link);
      }
    }

    if (ogTitle) setMetaProperty("og:title", ogTitle);
    if (ogDescription) setMetaProperty("og:description", ogDescription);
    if (ogImage)
      setMetaProperty(
        "og:image",
        ogImage ?? `${window.location.origin}/assets/images/public/favicon192.png`
      );
    if (twitterCard) setMetaName("twitter:card", twitterCard);
    if (twitterTitle) setMetaName("twitter:title", twitterTitle);
    if (twitterDescription)
      setMetaName("twitter:description", twitterDescription);
    if (twitterImage) setMetaName("twitter:image", twitterImage);

    function setMetaProperty(property: string, content: string) {
      let meta = document.querySelector<HTMLMetaElement>(
        `meta[property='${property}']`
      );
      if (meta) meta.setAttribute("content", content);
      else {
        meta = document.createElement("meta");
        meta.setAttribute("property", property);
        meta.setAttribute("content", content);
        document.head.appendChild(meta);
      }
    }

    function setMetaName(name: string, content: string) {
      let meta = document.querySelector<HTMLMetaElement>(
        `meta[name='${name}']`
      );
      if (meta) meta.setAttribute("content", content);
      else {
        meta = document.createElement("meta");
        meta.setAttribute("name", name);
        meta.setAttribute("content", content);
        document.head.appendChild(meta);
      }
    }
  }, [
    title,
    description,
    canonical,
    ogTitle,
    ogDescription,
    ogImage,
    twitterCard,
    twitterTitle,
    twitterDescription,
    twitterImage,
  ]);
}
