export interface Produit {
    libelle: string;
    prix: number;
    category: string;
    published: string;
}
 
export interface CustomerSource {
    source: Produit;
}