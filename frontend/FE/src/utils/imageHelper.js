export const FALLBACK_IMAGES = {
  "Hoa Hồng": [
    "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800",
    "https://images.unsplash.com/photo-1496062031456-07b8f162a322?q=80&w=800",
    "https://images.unsplash.com/photo-1559563458-527698bf5295?q=80&w=800"
  ],
  "Hoa Cưới": [
    "https://images.unsplash.com/photo-1546171055-25f9bf1a03b6?q=80&w=800",
    "https://images.unsplash.com/photo-1519378304602-45a4216ec35d?q=80&w=800"
  ],
  "Hoa Sinh Nhật": [
    "https://images.unsplash.com/photo-1508610048659-a06b669e3321?q=80&w=800",
    "https://images.unsplash.com/photo-1597848212624-a19eb3ba01a7?q=80&w=800"
  ],
  "Hoa Khai Trương": [
    "https://images.unsplash.com/photo-1508784411316-02b8cd4d3a3a?q=80&w=800",
    "https://images.unsplash.com/photo-1519378304602-45a4216ec35d?q=80&w=800"
  ],
  "Hoa Chia Buồn": [
    "https://images.unsplash.com/photo-1506755855567-92ff770e8d30?q=80&w=800",
    "https://images.unsplash.com/photo-1525263238612-46003f330605?q=80&w=800"
  ],
  "Hoa Lan": [
    "https://images.unsplash.com/photo-1596431969037-ce540134bd7a?q=80&w=800",
    "https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?q=80&w=800"
  ],
  "Hoa Baby": [
    "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800",
    "https://images.unsplash.com/photo-1525310238806-e7244926ff49?q=80&w=800"
  ],
  "DEFAULT": [
    "https://images.unsplash.com/photo-1561181286-d3fea73e413f?q=80&w=800",
    "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?q=80&w=800"
  ]
};

const getSeed = (str) => {
  if (!str) return 0;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
};

export const getFallbackImage = (categoryName = "", identifier = "") => {
  let matchedKey = "DEFAULT";
  const lowerCat = categoryName ? categoryName.toString().toLowerCase() : "";
  
  if (lowerCat.includes("hồng") || lowerCat.includes("rose")) matchedKey = "Hoa Hồng";
  else if (lowerCat.includes("cưới") || lowerCat.includes("wedding")) matchedKey = "Hoa Cưới";
  else if (lowerCat.includes("sinh nhật") || lowerCat.includes("birthday")) matchedKey = "Hoa Sinh Nhật";
  else if (lowerCat.includes("khai trương") || lowerCat.includes("congratulations")) matchedKey = "Hoa Khai Trương";
  else if (lowerCat.includes("chia buồn") || lowerCat.includes("tang") || lowerCat.includes("condolence")) matchedKey = "Hoa Chia Buồn";
  else if (lowerCat.includes("lan") || lowerCat.includes("orchid")) matchedKey = "Hoa Lan";
  else if (lowerCat.includes("baby")) matchedKey = "Hoa Baby";
  
  const imageArray = FALLBACK_IMAGES[matchedKey] || FALLBACK_IMAGES["DEFAULT"];
  const seed = getSeed(identifier.toString());
  const index = seed % imageArray.length;
  
  return imageArray[index];
};
