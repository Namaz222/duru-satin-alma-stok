import { createClient } from '@supabase/supabase-js';
import { Supplier, Order, Invoice, ProductRequest, StockMovement, ProductCard } from './types';

// Paylaştığın URL ve Key bilgileri buraya işlendi
const SUPABASE_URL = 'https://zkfbgasojzewgdbizicn.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_l1eYrk1WhMU0js0rLxfm1g_nv4Ru9gV';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const formatError = (error: any) => {
  if (!error) return "Bilinmeyen bir hata oluştu.";
  console.error("Supabase Teknik Detay:", error);
  return error.message || JSON.stringify(error);
};

export const DB = {
  // Ürün Kartları
  get_product_cards: async (): Promise<ProductCard[]> => {
    const { data, error } = await supabase.from('product_cards').select('*').order('name');
    if (error) throw new Error(formatError(error));
    return data || [];
  },
  save_product_card: async (card: ProductCard) => {
    const { error } = await supabase.from('product_cards').upsert(card);
    if (error) throw new Error(formatError(error));
  },
  delete_product_card: async (id: string) => {
    const { error } = await supabase.from('product_cards').delete().eq('id', id);
    if (error) throw new Error(formatError(error));
  },

  // Tedarikçiler
  getSuppliers: async (): Promise<Supplier[]> => {
    const { data, error } = await supabase.from('suppliers').select('*').order('name');
    if (error) throw new Error(formatError(error));
    return data || [];
  },
  saveSupplier: async (supplier: Supplier) => {
    const { error } = await supabase.from('suppliers').upsert(supplier);
    if (error) throw new Error(formatError(error));
  },
  deleteSupplier: async (id: string) => {
    const { error } = await supabase.from('suppliers').delete().eq('id', id);
    if (error) throw new Error(formatError(error));
  },

  // Talepler
  getRequests: async (): Promise<ProductRequest[]> => {
    const { data, error } = await supabase.from('requests').select('*').order('request_date', { ascending: false });
    if (error) throw new Error(formatError(error));
    return data || [];
  },
  saveRequest: async (request: ProductRequest) => {
    const { error } = await supabase.from('requests').upsert(request);
    if (error) throw new Error(formatError(error));
  },

  // Siparişler
  getOrders: async (): Promise<Order[]> => {
    const { data, error } = await supabase.from('orders').select('*').order('order_date', { ascending: false });
    if (error) throw new Error(formatError(error));
    return data || [];
  },
  saveOrder: async (order: Order) => {
    const { error } = await supabase.from('orders').upsert(order);
    if (error) throw new Error(formatError(error));
  },
  deleteOrder: async (id: string) => {
    const { error } = await supabase.from('orders').delete().eq('id', id);
    if (error) throw new Error(formatError(error));
  },

  // Muhasebe
  getInvoices: async (): Promise<Invoice[]> => {
    const { data, error } = await supabase.from('invoices').select('*').order('invoice_date', { ascending: false });
    if (error) throw new Error(formatError(error));
    return data || [];
  },
  saveInvoice: async (invoice: Invoice) => {
    const { error } = await supabase.from('invoices').upsert(invoice);
    if (error) throw new Error(formatError(error));
  },

  // Stok Hareketleri
  getStockMovements: async (): Promise<StockMovement[]> => {
    const { data, error } = await supabase.from('stock_movements').select('*').order('date', { ascending: false });
    if (error) throw new Error(formatError(error));
    return data || [];
  },
  saveStockMovement: async (movement: StockMovement) => {
    const { error } = await supabase.from('stock_movements').upsert(movement);
    if (error) throw new Error(formatError(error));
  }

};
