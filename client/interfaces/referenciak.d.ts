export interface image {
    id: number,
    url: string,
    alt: string,
}

export interface referencia {
    id: number;
    company: string;
    title: string;
    images: image[];
}