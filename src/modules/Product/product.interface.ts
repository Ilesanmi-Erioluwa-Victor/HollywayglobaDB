export interface createProductI {
  title: string;
  slug: string[];
  description: string;
  price: number;
  quantity: number;
  // images: string[];
  stock: number;
  brand: any;
  colors: string[];
  categoryId: string;
  adminId: string;
}
