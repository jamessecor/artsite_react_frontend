export type Groupings = '' | "nomophobia" | "digital_edits" | "storage" | "mug_dish_glass" | "merica" | "wallabies";

export enum GroupingsLabels {
    wallabies = "Off the Wallabies",
    merica = "Freedom Fries",
    nomophobia = "#nomophobia",
    // digital_edits = "digital_edits",
    mug_dish_glass = "animal mug, dish, and glass",
    storage = "as not seen"
};

export enum GroupingsLabelsOrder {
    wallabies = 1,
    merica = 2,
    nomophobia = 3,
    mug_dish_glass = 4,
    storage = 5
};

export interface Artwork {
    id: string;
    title: string;
    year: string;
    media: string;
    image: string;
    isHomePage?: boolean;
    price: string;
    arrangement?: number;
    grouping?: Array<Groupings>;
    buyerID?: string;
    saleDate?: string;
    taxStatus?: string;
    salePrice?: string;
    saleRevenue?: string;
    isNFS?: boolean;
};
