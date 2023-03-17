export type Groupings = string | "nomophobia" | "digital_edits" | "storage" | "mug_dish_glass" | "merica" | "wallabies";

export type GroupingsToHide = Partial<Groupings>;

export enum GroupingsLabels {
    wallabies = "Off the Wallabies",
    merica = "Freedom Fries",
    nomophobia = "#nomophobia",
    digital_edits = "digital_edits",
    mug_dish_glass = "animal mug, dish, and glass",
    storage = "as not seen"
};

export enum GroupingsLabelsOrder {
    wallabies = 1,
    merica = 2,
    nomophobia = 3,
    mug_dish_glass = 4,
    storage = 5,
    digital_edits = 6
};

export interface IArtwork {
    _id?: string;
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

export const ArtworkAttributes = {
    create: (): IArtwork => ({
        title: '',
        year: '',
        media: '',
        image: '',
        price: ''
    })
}
