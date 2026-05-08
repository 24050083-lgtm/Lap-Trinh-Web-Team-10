import { Eye, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getFallbackImage } from '../utils/imageHelper';

const ShopProductCard = ({ product, onAddToCart }) => {
  return (
    <article className="group overflow-hidden rounded-[28px] border border-orange-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-72 overflow-hidden">
        <img
          src={product.image || getFallbackImage(product.category_name || product.category, product.name || product.id)}
          alt={product.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          onError={(e) => { e.target.onerror = null; e.target.src = getFallbackImage(product.category_name || product.category, product.name || product.id); }}
        />
        <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-orange-600 shadow-sm">
          {product.badge || product.category_name}
        </div>
      </div>

      <div className="space-y-4 p-6">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-500">
            {product.category_name}
          </p>
          <h3 className="min-h-[56px] text-xl font-bold text-slate-800">
            {product.name}
          </h3>
          <p className="min-h-[48px] text-sm leading-6 text-slate-500">
            {product.description}
          </p>
        </div>

        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm text-slate-400">Giá từ</p>
            <p className="text-2xl font-black text-slate-900">
              {Number(product.price).toLocaleString('vi-VN')} đ
            </p>
          </div>
          <p className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600">
            {product.stockLabel || 'Còn hàng'}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Link
            to={`/product/${product.id}`}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-orange-300 hover:text-orange-600"
          >
            <Eye size={18} />
            Xem chi tiết
          </Link>

          <button
            type="button"
            onClick={onAddToCart}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            <ShoppingCart size={18} />
            Thêm giỏ hàng
          </button>
        </div>
      </div>
    </article>
  );
};

export default ShopProductCard;
