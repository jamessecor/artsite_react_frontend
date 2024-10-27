import _ from 'lodash';
import { IArtworkFormData } from "../components/ArtworkForm";

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

export type TaxStatus = 'paid' | 'unpaid';

export interface ILike {
    timestamp: string;
    amount: number;
};

export interface IImage {
    size: number;
    url: string;
}
export interface IArtwork {
    _id?: string;
    title: string;
    year: string;
    media: string;
    width: string;
    height: string;
    images: Array<IImage>;
    isHomePage?: boolean;
    price: string;
    arrangement?: number;
    grouping?: Array<Groupings>;
    buyerID?: string;
    saleDate?: Date | null;
    taxStatus?: TaxStatus;
    salePrice?: string;
    saleRevenue?: string;
    isNFS?: boolean;
    likes?: Array<ILike>;
    totalLikes?: number;
};

export const ArtworkAttributes = {
    create: (): IArtwork => ({
        title: '',
        year: '',
        media: '',
        images: [],
        price: '',
        width: '',
        height: ''
    })
}

export const iArtworkToFormData = (iArtwork: IArtwork): IArtworkFormData => {
    const { images, _id, ...rest } = iArtwork;
    return rest;
};

export const getImageSrc = (images: Array<IImage>) => {
    const sortedImages = images.sort((a, b) => b.size - a.size);
    return sortedImages.length > 0 ? sortedImages[0].url : undefined;
}
