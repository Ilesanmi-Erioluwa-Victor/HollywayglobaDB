export interface createProductI {
  title: string;
  slug: string;
  description: string;
  price: number;
  quantity: number;
  // images: string[];
  stock: number;
  colors: string[];
  categoryId: string;
}
