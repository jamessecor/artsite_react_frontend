export type Groupings = '' | "nomophobia" | "digital_edits" | "storage" | "mug_dish_glass" | "merica" | "wallabies";

export enum GroupingsLabels {
    nomophobia = "#nomophobia",
    // digital_edits = "digital_edits",
    storage = "as not seen",
    mug_dish_glass = "animal mug, dish, and glass",
    merica = "Freedom Fries",
    wallabies = "Off the Wallabies"
};

export interface Artwork {
    id: string;
    title: string;
    year: string;
    media: string;
    image: string;
    isHomePage?: boolean;
    price: string;
    arrangement?: string;
    grouping?: Array<Groupings>;
    buyerID?: string;
    saleDate?: string;
    taxStatus?: string;
    salePrice?: string;
    saleRevenue?: string;
};
