export interface LawPolicyRegulation {
    title: string;
    datePublished: Date;
    url: string;
    slug: string;
    id: number;
} 

export interface SkitterImages {
    img: string;
    className: string;
    title?: string;
    caption?: string;
    readMore?: boolean;
    url?: string;
    slug?: string
}