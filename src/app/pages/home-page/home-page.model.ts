export interface Slide {
    id?: number;
    img: string;
    url: string;
    title: string;
}

export interface Update {
    headline: string;
    datePublished: Date;
    tags: string;
    image: string;
    likes: number;
    slug: string;
}