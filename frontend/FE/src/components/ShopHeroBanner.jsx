import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const slides = [
  {
    image:
      'https://images.unsplash.com/photo-1562690868-60bbe7293e94?auto=format&fit=crop&w=2000&q=80',
    subtitle: 'Giao nhanh trong ngày',
    title: 'Đa dạng mẫu hoa tươi cho mọi khoảnh khắc đặc biệt của bạn',
  },
  {
    image:
      'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=2000&q=80',
    subtitle: 'Thiết kế tinh tế',
    title: 'Từ bó hoa nhẹ nhàng đến lẵng hoa sang trọng đều có sẵn tại shop',
  },
  {
    image:
      'https://images.unsplash.com/photo-1596431969037-ce540134bd7a?auto=format&fit=crop&w=2000&q=80',
    subtitle: 'Ưu đãi cho đơn đầu tiên',
    title: 'Xem chi tiết sản phẩm và thêm vào giỏ hàng chỉ trong vài giây',
  },
];

const ShopHeroBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="group relative h-[430px] overflow-hidden md:h-[580px]">
      {slides.map((slide, index) => (
        <div
          key={slide.title}
          className={`absolute inset-0 flex items-center justify-center bg-cover bg-center transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ backgroundImage: `url(${slide.image})` }}
        >
          <div className="absolute inset-0 bg-slate-950/45" />

          <div className="relative z-10 mx-auto max-w-5xl px-4 text-center text-white">
            <p className="text-sm font-bold uppercase tracking-[0.35em] text-orange-300">
              {slide.subtitle}
            </p>
            <h1 className="mt-6 text-4xl font-black leading-tight md:text-6xl">
              {slide.title}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-orange-50 md:text-lg">
              Hoa tươi được tuyển chọn mỗi ngày, phù hợp cho sinh nhật, khai
              trương, kỷ niệm, chúc mừng và quà tặng thường nhật.
            </p>

            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                to="/products"
                className="rounded-full bg-orange-500 px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] transition hover:bg-orange-600"
              >
                Xem cửa hàng hoa
              </Link>
              <Link
                to="/cart"
                className="rounded-full border border-white/60 px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] text-white transition hover:bg-white hover:text-slate-900"
              >
                Xem giỏ hàng
              </Link>
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() =>
          setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
        }
        className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/20 p-3 text-white opacity-0 transition hover:bg-orange-500 group-hover:opacity-100"
      >
        <ChevronLeft size={22} />
      </button>

      <button
        type="button"
        onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
        className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/20 p-3 text-white opacity-0 transition hover:bg-orange-500 group-hover:opacity-100"
      >
        <ChevronRight size={22} />
      </button>
    </section>
  );
};

export default ShopHeroBanner;
