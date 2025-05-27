export const GTM_ID = process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID;
export const GA_TRACKING_ID =
  process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_TRACKING_ID;

export const GTMPageView = (url: string) => {
  interface PageEventProps {
    event: string;
    page: string;
  }

  const pageEvent: PageEventProps = {
    event: "pageview",
    page: url,
  };
  //@ts-ignore
  window && window.dataLayer && window.dataLayer.push(pageEvent);
  return pageEvent;
};
