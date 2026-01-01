export interface ArchiveImage {
    url: string;
    altText?: string | null;
  }
  
  export interface ArchiveProduct {
    id: string;
    title: string;
    handle: string;
    productType?: string | null;
    image?: ArchiveImage;
  }
  