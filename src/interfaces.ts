export interface Item {
  id: string;
  title: string;
  description: string;
  image: string;
  expectedDeliveryDate: string;
  seller: string;
  sellerImage: string;
}

export interface CalculatePriceBody {
  quantity: number;
}

export interface Config {
  servers: ServerItems;
}

interface ServerItem {
  name: string;
  errorFrequency: number;
}

export type ServerItems = ServerItem[];
