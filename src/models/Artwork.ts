export interface Artwork {
    id: string;
    title: string;
    year: string;
    media: string;
    image: string;
    isHomePage?: boolean;
    price: string;
    arrangement?: string;
    grouping?: Array<string>;
    buyerID?: string;
    saleDate?: string;
    taxStatus?: string;
    salePrice?: string;
    saleRevenue?: string;
};
