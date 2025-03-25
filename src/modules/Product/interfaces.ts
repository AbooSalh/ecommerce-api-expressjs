export interface ICreateProduct {
  title: string;
  description: string;
  quantity: number;
  price: number;
  discount?: number;
  colors?: string[];
  imageCover: string;
  images?: string[];
  category: string;
  subCategories?: string[];
  brand?: string;
}
