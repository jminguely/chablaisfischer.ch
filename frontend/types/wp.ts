export interface WpMenuItem {
  id: string;
  label: string;
  path: string;
}

export type WpPage = {
  id: string;
  slug: string;
  title: string;
  content: string;
  fields?: {
    projects?: {
      nodes?: any[];
    };
  };
};

export type WpProject = {
  id: string;
  slug: string;
  title: string;
  content: string;
  featuredImage?: {
    node: {
      altText: string;
      sourceUrl: string;
    };
  };
};
