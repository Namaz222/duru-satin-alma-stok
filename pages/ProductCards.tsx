import React, { useState, useEffect } from 'react';
import { DB } from '../db';
import { ProductCard, Category, UnitType } from '../types';
import { Plus, Search, Trash2, X, Loader2 } from 'lucide-react';

const ProductCards: React.FC = () => {
  const [product_cards, set_product_cards] = useState<ProductCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCard, setNewCard] = useState<Partial<ProductCard>>({ name: '', category: Category.DRY_FOOD, unit: UnitType.ADET });

  const loadData = async () => {
    setLoading(true);
    const data = await DB.get_product_cards();
    set_product_cards(data);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const cardToSave = {
      id: crypto.randomUUID(),
      name: newCard.name?.toUpperCase(),
      category: newCard.category,
      unit: newCard.unit
    };
    await DB.save_product_card(cardToSave);
    setIsModalOpen(false);
    loadData();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-xl font-black uppercase">Ürün Kartları</h1>
        <button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 text-white px-6 py-2 rounded-xl">Yeni Kart</button>
      </div>
      <div className="bg-white rounded-2xl shadow border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 font-black">ÜRÜN</th>
              <th className="p-4 font-black">KATEGORİ</th>
              <th className="p-4 font-black">BİRİM</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {product_cards.map(card => (
              <tr key={card.id} className="border-t">
                <td className="p-4 font-bold">{card.name}</td>
                <td className="p-4">{card.category}</td>
                <td className="p-4">{card.unit}</td>
                <td className="p-4 text-right">
                  <button onClick={() => DB.delete_product_card(card.id).then(loadData)} className="text-red-500"><Trash2 size={16}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <form onSubmit={handleSave} className="bg-white p-8 rounded-3xl w-full max-w-md">
            <input className="w-full p-4 border rounded-xl mb-4" placeholder="Ürün Adı" onChange={e => setNewCard({...newCard, name: e.target.value})} />
            <button className="w-full bg-indigo-600 text-white py-4 rounded-xl font-black">KAYDET</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProductCards;