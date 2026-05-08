const defaultCareTips = [
  'Cắt chéo gốc hoa khoảng 1-2cm trước khi cắm.',
  'Thay nước sạch mỗi ngày để hoa tươi lâu hơn.',
  'Đặt hoa ở nơi thoáng mát, tránh nắng gắt và quạt mạnh.',
];

export const flowers = [
  {
    id: 1,
    name: 'Bó hồng Ecuador đỏ premium',
    category: 'Hoa tình yêu',
    category_name: 'Hoa tình yêu',
    price: 1200000,
    image: 'https://images.unsplash.com/photo-1561181286-d3fea73e413f?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1561181286-d3fea73e413f?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1519378058457-4c29a0a2efac?auto=format&fit=crop&w=900&q=80',
    ],
    description: 'Bó hoa hồng đỏ nhập khẩu sang trọng, phù hợp cho các dịp tỏ tình và kỷ niệm.',
    longDescription: 'Thiết kế gồm hoa hồng Ecuador đỏ cánh lớn, phối lá bạc và giấy gói tông kem. Từng cành được tuyển chọn để giữ phom nở đẹp, thích hợp làm món quà gây ấn tượng ngay từ ánh nhìn đầu tiên.',
    occasion: 'Tỏ tình, kỷ niệm, Valentine',
    size: '25 cành',
    colors: 'Đỏ ruby',
    origin: 'Ecuador tuyển chọn',
    stockLabel: 'Bán chạy',
    badge: 'Best Seller',
    careTips: defaultCareTips,
  },
  {
    id: 2,
    name: 'Bó tulip trắng tinh khôi',
    category: 'Hoa sinh nhật',
    category_name: 'Hoa sinh nhật',
    price: 890000,
    image: 'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1468327768560-75b778cbb551?auto=format&fit=crop&w=900&q=80',
    ],
    description: 'Tulip trắng thanh lịch mang đến cảm giác nhẹ nhàng, sang trọng và hiện đại.',
    longDescription: 'Mẫu tulip trắng được bó theo phong cách Hàn Quốc, phù hợp tặng sinh nhật, chúc mừng hoặc trang trí văn phòng. Thiết kế tinh giản nhưng vẫn nổi bật bởi sự mềm mại của cánh hoa và tông màu trung tính.',
    occasion: 'Sinh nhật, cảm ơn, tặng sếp',
    size: '18 cành',
    colors: 'Trắng kem',
    origin: 'Đà Lạt',
    stockLabel: 'Còn hàng',
    badge: 'Thanh lịch',
    careTips: defaultCareTips,
  },
  {
    id: 3,
    name: 'Giỏ hướng dương rạng rỡ',
    category: 'Hoa khai trương',
    category_name: 'Hoa khai trương',
    price: 950000,
    image: 'https://images.unsplash.com/photo-1597848212624-a19eb3ba01a7?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1597848212624-a19eb3ba01a7?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=900&q=80',
    ],
    description: 'Giỏ hoa hướng dương tạo năng lượng tích cực, rất hợp chúc mừng khai trương hoặc thăng chức.',
    longDescription: 'Sự kết hợp giữa hướng dương, đồng tiền vàng và lá phụ tạo nên tổng thể tươi sáng, mang ý nghĩa phát triển và may mắn. Giỏ hoa dễ trưng bày tại quầy lễ tân, cửa hàng hoặc văn phòng mới.',
    occasion: 'Khai trương, thăng chức, chúc mừng',
    size: 'Giỏ lớn 2 tầng',
    colors: 'Vàng nắng',
    origin: 'Vườn Đà Lạt',
    stockLabel: 'Mới về',
    badge: 'Nổi bật',
    careTips: defaultCareTips,
  },
  {
    id: 4,
    name: 'Bó baby trắng dịu dàng',
    category: 'Hoa tình yêu',
    category_name: 'Hoa tình yêu',
    price: 420000,
    image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1494336934272-fd0f40fa41d1?auto=format&fit=crop&w=900&q=80',
    ],
    description: 'Bó hoa baby trắng nhẹ nhàng, thích hợp tặng người thương hoặc chụp ảnh kỷ niệm.',
    longDescription: 'Thiết kế tối giản với lớp giấy gói lụa mềm, nổi bật bởi sắc trắng tinh khôi. Mẫu hoa rất được yêu thích cho dịp cầu hôn, kỷ niệm hoặc làm quà tặng ngọt ngào hàng ngày.',
    occasion: 'Kỷ niệm, cầu hôn, quà tặng',
    size: 'Bó vừa',
    colors: 'Trắng sữa',
    origin: 'Đà Lạt',
    stockLabel: 'Còn hàng',
    badge: 'Nhẹ nhàng',
    careTips: defaultCareTips,
  },
  {
    id: 5,
    name: 'Lẵng lan hồ điệp vàng',
    category: 'Hoa chúc mừng',
    category_name: 'Hoa chúc mừng',
    price: 2450000,
    image: 'https://images.unsplash.com/photo-1566903450838-8686d6785671?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1566903450838-8686d6785671?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=900&q=80',
    ],
    description: 'Lan hồ điệp vàng sang trọng, biểu tượng cho tài lộc và sự thịnh vượng.',
    longDescription: 'Lẵng hoa được dựng form chắc chắn với 5 cành lan hồ điệp vàng, phối chậu sứ cao cấp. Đây là lựa chọn phù hợp cho tặng doanh nghiệp, tân gia hoặc trang trí không gian sang trọng.',
    occasion: 'Tân gia, chúc mừng, doanh nghiệp',
    size: 'Chậu 5 cành',
    colors: 'Vàng kim',
    origin: 'Nhà vườn cao cấp',
    stockLabel: 'Đặt trước 4 giờ',
    badge: 'Sang trọng',
    careTips: defaultCareTips,
  },
  {
    id: 6,
    name: 'Giỏ cẩm tú cầu xanh',
    category: 'Hoa văn phòng',
    category_name: 'Hoa văn phòng',
    price: 760000,
    image: 'https://images.unsplash.com/photo-1508784411316-02b8cd4d3a3a?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1508784411316-02b8cd4d3a3a?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1468327768560-75b778cbb551?auto=format&fit=crop&w=900&q=80',
    ],
    description: 'Cẩm tú cầu xanh cho cảm giác mát mắt, phù hợp trang trí bàn làm việc hoặc quầy tiếp khách.',
    longDescription: 'Tông xanh pastel phối cùng lá bạc tạo cảm giác hiện đại và thư thái. Mẫu giỏ nhỏ gọn, dễ đặt ở văn phòng, studio hoặc làm quà tặng cảm ơn cho đối tác.',
    occasion: 'Cảm ơn, văn phòng, trang trí',
    size: 'Giỏ vừa',
    colors: 'Xanh pastel',
    origin: 'Đà Lạt',
    stockLabel: 'Còn hàng',
    badge: 'Tinh tế',
    careTips: defaultCareTips,
  },
  {
    id: 7,
    name: 'Bình ly thơm thanh lịch',
    category: 'Hoa chúc mừng',
    category_name: 'Hoa chúc mừng',
    price: 780000,
    image: 'https://images.unsplash.com/photo-1589123053646-4e8c4647900b?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1589123053646-4e8c4647900b?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=900&q=80',
    ],
    description: 'Bình hoa ly trắng vàng mang hương thơm dịu nhẹ và phong cách thanh lịch.',
    longDescription: 'Mẫu bình ly được phối theo phong cách hiện đại, thích hợp trưng trong phòng khách hoặc gửi tặng lời chúc bình an. Hương thơm dễ chịu và sắc hoa sang giúp không gian thêm tinh tế.',
    occasion: 'Chúc mừng, cảm ơn, tân gia',
    size: 'Bình cao 60cm',
    colors: 'Trắng vàng',
    origin: 'Đà Lạt',
    stockLabel: 'Còn hàng',
    badge: 'Thơm lâu',
    careTips: defaultCareTips,
  },
  {
    id: 8,
    name: 'Bó mẫu đơn hồng ngọt ngào',
    category: 'Hoa tình yêu',
    category_name: 'Hoa tình yêu',
    price: 1650000,
    image: 'https://images.unsplash.com/photo-1468327768560-75b778cbb551?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1468327768560-75b778cbb551?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1455656678494-4d1b5f3e7ad1?auto=format&fit=crop&w=900&q=80',
    ],
    description: 'Mẫu đơn hồng mềm mại, mang đến cảm giác lãng mạn và sang trọng.',
    longDescription: 'Bó hoa sử dụng mẫu đơn hồng phối cùng lá eucalyptus, phù hợp cho các dịp cầu hôn, kỷ niệm hoặc tặng người thương. Thiết kế có độ bồng đẹp, lên ảnh nổi bật và rất mềm mại.',
    occasion: 'Kỷ niệm, cầu hôn, sinh nhật người yêu',
    size: '20 bông',
    colors: 'Hồng phấn',
    origin: 'Nhập khẩu',
    stockLabel: 'Giới hạn trong ngày',
    badge: 'Luxury',
    careTips: defaultCareTips,
  },
  {
    id: 9,
    name: 'Kệ chia buồn cúc trắng',
    category: 'Hoa chia buồn',
    category_name: 'Hoa chia buồn',
    price: 1350000,
    image: 'https://images.unsplash.com/photo-1525263238612-46003f330605?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1525263238612-46003f330605?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1502977249166-824b3a8a4d6d?auto=format&fit=crop&w=900&q=80',
    ],
    description: 'Kệ hoa tone trắng trang nhã gửi lời chia sẻ và thành kính.',
    longDescription: 'Mẫu kệ sử dụng cúc trắng, lan trắng và lá nền xanh đậm để tạo sự trang nghiêm. Form đứng cao, phù hợp gửi viếng tang lễ tại nhà riêng, chùa hoặc nhà tang lễ.',
    occasion: 'Tang lễ, viếng thăm',
    size: 'Kệ đứng 1m8',
    colors: 'Trắng xanh',
    origin: 'Thiết kế theo yêu cầu',
    stockLabel: 'Nhận gấp trong 2 giờ',
    badge: 'Trang trọng',
    careTips: defaultCareTips,
  },
  {
    id: 10,
    name: 'Giỏ đồng tiền cam năng động',
    category: 'Hoa sinh nhật',
    category_name: 'Hoa sinh nhật',
    price: 560000,
    image: 'https://images.unsplash.com/photo-1494336934272-fd0f40fa41d1?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1494336934272-fd0f40fa41d1?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1455656678494-4d1b5f3e7ad1?auto=format&fit=crop&w=900&q=80',
    ],
    description: 'Giỏ hoa tone cam vui tươi giúp món quà sinh nhật thêm rực rỡ.',
    longDescription: 'Sự phối hợp giữa đồng tiền, cát tường và lá bạc tạo nên tổng thể trẻ trung. Mẫu hoa phù hợp tặng bạn bè, đồng nghiệp hoặc người thân trong những dịp cần sự tích cực và ấm áp.',
    occasion: 'Sinh nhật, chúc mừng, quà tặng',
    size: 'Giỏ mini',
    colors: 'Cam đào',
    origin: 'Vườn hoa nội địa',
    stockLabel: 'Còn hàng',
    badge: 'Tươi mới',
    careTips: defaultCareTips,
  },
  {
    id: 11,
    name: 'Bó lavender tím thơ mộng',
    category: 'Hoa văn phòng',
    category_name: 'Hoa văn phòng',
    price: 690000,
    image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1455656678494-4d1b5f3e7ad1?auto=format&fit=crop&w=900&q=80',
    ],
    description: 'Lavender tím mang hương thơm nhẹ và cảm giác thư giãn cho góc nhỏ của bạn.',
    longDescription: 'Bó lavender được bó theo phong cách rustic với nơ vải bố tự nhiên. Đây là lựa chọn phù hợp cho trang trí bàn làm việc, studio hoặc làm món quà tinh tế dành cho người yêu sự nhẹ nhàng.',
    occasion: 'Trang trí, cảm ơn, thư giãn',
    size: 'Bó vừa',
    colors: 'Tím lavender',
    origin: 'Hoa khô cao cấp',
    stockLabel: 'Còn hàng',
    badge: 'Thư giãn',
    careTips: defaultCareTips,
  },
  {
    id: 12,
    name: 'Bó cúc tana trắng mini',
    category: 'Hoa hàng ngày',
    category_name: 'Hoa hàng ngày',
    price: 360000,
    image: 'https://images.unsplash.com/photo-1455656678494-4d1b5f3e7ad1?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1455656678494-4d1b5f3e7ad1?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=900&q=80',
    ],
    description: 'Bó cúc tana mini dễ thương, phù hợp tặng nhẹ nhàng mỗi ngày.',
    longDescription: 'Tana trắng là kiểu hoa nhỏ nhắn nhưng lên form rất đáng yêu. Bó hoa này phù hợp cho quà tặng hàng ngày, decor góc học tập hoặc gửi lời nhắn dịu dàng tới người bạn yêu quý.',
    occasion: 'Quà tặng mỗi ngày, decor, cảm ơn',
    size: 'Bó mini',
    colors: 'Trắng vàng nhạt',
    origin: 'Đà Lạt',
    stockLabel: 'Còn hàng',
    badge: 'Dễ thương',
    careTips: defaultCareTips,
  },
];

const fallbackById = new Map(flowers.map((flower) => [String(flower.id), flower]));

export const flowerCategories = ['Tất cả', ...new Set(flowers.map((flower) => flower.category))];

export const normalizeFlower = (flower = {}) => {
  const fallback =
    fallbackById.get(String(flower.id ?? '')) ||
    flowers.find(
      (item) =>
        item.name.toLowerCase() === String(flower.name ?? '').toLowerCase(),
    );

  const image = flower.image || fallback?.image || flowers[0].image;
  const category =
    flower.category ||
    flower.category_name ||
    fallback?.category ||
    'Hoa tươi';

  return {
    ...fallback,
    ...flower,
    id: Number(flower.id ?? fallback?.id ?? Date.now()),
    name: flower.name || fallback?.name || 'Mẫu hoa đang cập nhật',
    price: Number(flower.price ?? fallback?.price ?? 0),
    image,
    gallery:
      Array.isArray(flower.gallery) && flower.gallery.length > 0
        ? flower.gallery
        : fallback?.gallery || [image],
    category,
    category_name: category,
    description:
      flower.description ||
      flower.desc ||
      fallback?.description ||
      'Mẫu hoa được tuyển chọn và thiết kế bởi đội ngũ florist.',
    longDescription:
      flower.longDescription ||
      flower.description ||
      flower.desc ||
      fallback?.longDescription ||
      fallback?.description ||
      'Mẫu hoa được tuyển chọn và thiết kế bởi đội ngũ florist.',
    occasion: flower.occasion || fallback?.occasion || 'Quà tặng mọi dịp',
    size: flower.size || fallback?.size || 'Bó tiêu chuẩn',
    colors: flower.colors || fallback?.colors || 'Phối màu theo mùa',
    origin: flower.origin || fallback?.origin || 'Vườn hoa tuyển chọn',
    stockLabel: flower.stockLabel || fallback?.stockLabel || 'Còn hàng',
    badge: flower.badge || fallback?.badge || 'Nổi bật',
    careTips: flower.careTips || fallback?.careTips || defaultCareTips,
  };
};

export const normalizeFlowers = (items = []) => items.map(normalizeFlower);

export const findFlowerById = (id) =>
  flowers.find((flower) => String(flower.id) === String(id));

export const filterFlowersBySearch = (items = [], query = '') => {
  const keyword = query.trim().toLowerCase();

  if (!keyword) {
    return items;
  }

  return items.filter((flower) => {
    const haystack = [
      flower.name,
      flower.category,
      flower.category_name,
      flower.description,
      flower.longDescription,
      flower.occasion,
      flower.colors,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return haystack.includes(keyword);
  });
};
