export enum UnitType {
  ADET = 'ADET',
  KG = 'KG',
  LITRE = 'LİTRE',
  PAKET = 'PAKET',
  KOLI = 'KOLİ'
}

export enum Category {
  DRY_FOOD = 'KURU GIDA',
  FRESH_FOOD = 'TAZE GIDA',
  BEVERAGE = 'İÇECEK',
  CLEANING = 'TEMİZLİK',
  OTHER = 'DİĞER'
}

export enum OrderStatus {
  PENDING = 'BEKLEMEDE',
  IN_TRANSIT = 'YOLDA',
  COMPLETED = 'TAMAMLANDI',
  INCOMPLETE = 'EKSİK'
}

export enum RequestStatus {
  PENDING = 'BEKLEMEDE',
  APPROVED = 'ONAYLANDI',
  RECEIVED = 'TESLİM ALINDI',
  CANCELLED = 'İPTAL'
}

export enum ContactMethod {
  PHONE = 'TELEFON',
  EMAIL = 'E-POSTA',
  WHATSAPP = 'WHATSAPP'
}

export interface ProductCard {
  id: string;
  name: string;
  category: Category;
  unit: UnitType;
}

export interface Supplier {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  categories: Category[];
  contact_person: string;
  preferred_method: ContactMethod;
}

export interface OrderItem {
  id: string;
  product_name: string;
  quantity: number;
  unit: UnitType;
  unit_price: number;
}

export interface Order {
  id: string;
  supplier_id: string;
  supplier_name: string;
  order_date: string;
  status: OrderStatus;
  items: OrderItem[];
  total_amount: number;
}

export interface Invoice {
  id: string;
  supplier_id: string;
  supplier_name: string;
  invoice_number: string;
  invoice_date: string;
  total_amount: number;
  is_paid: boolean;
}

export interface ProductRequest {
  id: string;
  product_name: string;
  quantity: number;
  unit: UnitType;
  status: RequestStatus;
  request_date: string;
}

export interface StockMovement {
  id: string;
  product_name: string;
  unit: UnitType;
  quantity: number;
  type: 'OUT' | 'RETURN';
  date: string;
}