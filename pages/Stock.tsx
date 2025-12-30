import React, { useState, useEffect, useMemo } from 'react';
import { DB } from '../db';
import { ProductRequest, RequestStatus, UnitType, StockMovement } from '../types';
import { Boxes, ArrowUpRight, ArrowDownLeft, Search, History, X, Calendar } from 'lucide-react';

const Stock: React.FC = () => {
  const [requests, setRequests] = useState<ProductRequest[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'OUT' | 'RETURN'>('OUT');
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [adjustmentQty, setAdjustmentQty] = useState<number>(0);
  const [selectedUnit, setSelectedUnit] = useState<UnitType>(UnitType.ADET);

  const loadData = async () => {
    const [requestsData, movementsData] = await Promise.all([
      DB.getRequests(),
      DB.getStockMovements()
    ]);
    setRequests(requestsData);
    setMovements(movementsData);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Stok Hesaplama Mantığı (Girişler - Çıkışlar + İadeler)
  const stockData = useMemo(() => {
    const receivedProducts = requests.filter(r => r.status === RequestStatus.RECEIVED);
    const stocks: Record<string, { product_name: string, unit: UnitType, quantity: number }> = {};

    receivedProducts.forEach(r => {
      const key = `${r.product_name.trim().toUpperCase()}-${r.unit}`;
      if (!stocks[key]) {
        stocks[key] = { product_name: r.product_name.trim().toUpperCase(), unit: r.unit, quantity: 0 };
      }
      stocks[key].quantity += r.quantity;
    });

    movements.forEach(m => {
      const key = `${m.product_name.toUpperCase()}-${m.unit}`;
      if (stocks[key]) {
        if (m.type === 'OUT') stocks[key].quantity -= m.quantity;
        if (m.type === 'RETURN') stocks[key].quantity += m.quantity;
      }
    });

    return stocks;
  }, [requests, movements]);

  const stockList = useMemo(() => {
    return Object.values(stockData).filter((s: any) => 
      s.product_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [stockData, searchTerm]);

  const outputLogs = useMemo(() => {
    const aggregated: Record<string, StockMovement> = {};
    
    movements.filter(m => m.type === 'OUT').forEach(m => {
      const key = `${m.product_name.toUpperCase()}-${m.unit}-${m.date}`;
      if (!aggregated[key]) {
        aggregated[key] = { ...m };
      } else {
        aggregated[key].quantity += m.quantity;
      }
    });

    return Object.values(aggregated).sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [movements]);

  const handleAdjustment = async () => {
    if (adjustmentQty <= 0) return alert("Lütfen geçerli bir miktar giriniz.");
    
    if (modalType === 'OUT') {
      const currentStock = stockData[`${selectedProduct.toUpperCase()}-${selectedUnit}`]?.quantity || 0;
      if (adjustmentQty > currentStock) {
        alert(`Yetersiz Stok! Mevcut stok: ${currentStock} ${selectedUnit}.`);
        return;
      }
    }
    
    const movement: StockMovement = {
      id: crypto.randomUUID(),
      product_name: selectedProduct, // DÜZELTME: product_name (Supabase uyumu)
      unit: selectedUnit,
      quantity: adjustmentQty,
      type: modalType,
      date: new Date().toISOString().split('T')[0]
    };

    await DB.saveStockMovement(movement);
    await loadData();
    setIsModalOpen(false);
    setAdjustmentQty(0);
  };

  const openModal = (type: 'OUT' | 'RETURN', product_name: string, unit: UnitType) => {
    setModalType(type);
    setSelectedProduct(product_name);
    setSelectedUnit(unit);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 h-full flex flex-col overflow-hidden">
      <div className="flex justify-between items-end shrink-0">
        <div>
          <h1 className="text-xl font-black text-gray-900 uppercase">Stok Kontrol Ekranı</h1>
          <p className="text-xs text-gray-500 font-medium italic">Envanter yönetimi ve günlük çıkış izleme.</p>
        </div>
        <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-xl border border-blue-100">
          <Boxes className="text-blue-600" size={18} />
          <span className="text-[10px] font-black text-blue-700 uppercase tracking-widest">{stockList.length} Çeşit Ürün</span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 flex-1 overflow-hidden">
        <div className="xl:col-span-3 bg-white rounded-[25px] shadow-lg border overflow-hidden flex flex-col">
          <div className="p-4 border-b bg-gray-50/50 flex justify-between items-center shrink-0">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Envanterde ara..." 
                className="w-full pl-12 pr-4 py-2 border rounded-xl outline-none text-sm font-bold shadow-sm focus:border-green-500 transition-all" 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
              />
            </div>
          </div>

          <div className="overflow-y-auto flex-1">
            <table className="w-full text-left text-sm">
              <thead className="bg-white border-b sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase">ÜRÜN ADI</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase text-center">MEVCUT STOK</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase text-right">İŞLEMLER</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {stockList.map((stock) => (
                  <tr key={`${stock.product_name}-${stock.unit}`} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-black text-base text-gray-900 uppercase">{stock.product_name}</span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase">{stock.unit}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`text-2xl font-black ${stock.quantity > 5 ? 'text-green-600' : 'text-red-600'}`}>
                        {stock.quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <button 
                          onClick={() => openModal('OUT', stock.product_name, stock.unit)}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg font-black text-[10px] uppercase shadow-sm hover:bg-red-700 transition-all active:scale-95"
                        >
                          STOK ÇIKIŞI
                        </button>
                        <button 
                          onClick={() => openModal('RETURN', stock.product_name, stock.unit)}
                          className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-black text-[10px] uppercase border border-blue-100 hover:bg-blue-100 transition-all"
                        >
                          İADE AL
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-gray-900 rounded-[25px] shadow-xl border border-gray-800 flex flex-col overflow-hidden">
          <div className="p-5 border-b border-gray-800 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-red-400">
              <History size={18} />
              <h3 className="text-[11px] font-black uppercase tracking-widest">Günlük Toplam Çıkışlar</h3>
            </div>
          </div>
          <div className="overflow-y-auto flex-1 p-3 space-y-3">
            {outputLogs.map((move) => (
              <div key={`${move.product_name}-${move.date}`} className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-white font-black text-xs uppercase leading-tight flex-1 mr-2">{move.product_name}</span>
                  <div className="bg-red-500/30 text-red-300 px-2 py-1 rounded text-[11px] font-black uppercase border border-red-500/20">
                    -{move.quantity} {move.unit}
                  </div>
                </div>
                <div className="flex items-center text-[10px] font-bold text-gray-500 space-x-2">
                  <Calendar size={12} />
                  <span>{move.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/90 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-[35px] w-full max-w-md flex flex-col overflow-hidden shadow-2xl border-[6px] border-gray-100">
            <div className={`p-6 border-b flex justify-between items-center text-white ${modalType === 'OUT' ? 'bg-red-600' : 'bg-blue-600'}`}>
              <div className="flex items-center space-x-3">
                {modalType === 'OUT' ? <ArrowUpRight /> : <ArrowDownLeft />}
                <h3 className="text-xl font-black uppercase tracking-tighter">
                  {modalType === 'OUT' ? 'Stok Çıkışı' : 'İade Kaydı'}
                </h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-white/60 hover:text-white"><X size={28} /></button>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="text-center p-4 bg-gray-50 rounded-2xl border">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">İşlem Yapılan Ürün</p>
                <h4 className="text-2xl font-black text-gray-900 uppercase tracking-tight">{selectedProduct}</h4>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Hareket Miktarı</label>
                <input 
                  type="number" 
                  autoFocus
                  className="w-full p-6 border-4 border-gray-50 rounded-[25px] font-black text-5xl text-center bg-gray-50 outline-none focus:border-gray-200 transition-all"
                  value={adjustmentQty || ''}
                  onChange={(e) => setAdjustmentQty(parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>

            <div className="p-6 bg-gray-50 border-t">
              <button 
                onClick={handleAdjustment}
                className={`w-full py-5 rounded-2xl font-black text-xl text-white shadow-lg uppercase tracking-widest transition-all active:scale-95 ${modalType === 'OUT' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                Onayla
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stock;