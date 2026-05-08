-- ====================================================================
-- PHẦN 0: KHỞI TẠO DATABASE
-- ====================================================================
DROP DATABASE IF EXISTS flower_shop;
CREATE DATABASE flower_shop;
USE flower_shop;

-- ====================================================================
-- PHẦN 1: TẠO CẤU TRÚC BẢNG (DDL)
-- ====================================================================

CREATE TABLE categories (
    category_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT
);

CREATE TABLE suppliers (
    supplier_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    phone VARCHAR(20),
    address TEXT
);

CREATE TABLE combos (
    combo_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    price DECIMAL(12, 2) NOT NULL,
    description TEXT
);

CREATE TABLE products (
    product_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    category_id INT,
    supplier_id INT,
    price DECIMAL(12, 2) NOT NULL,
    stock_quantity INT DEFAULT 0,
    FOREIGN KEY (category_id) REFERENCES categories(category_id),
    FOREIGN KEY (supplier_id) REFERENCES suppliers(supplier_id)
);

CREATE TABLE combo_items (
    combo_item_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    combo_id INT,
    product_id INT,
    quantity INT NOT NULL DEFAULT 1,
    FOREIGN KEY (combo_id) REFERENCES combos(combo_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

CREATE TABLE inventory_logs (
    log_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    product_id INT,
    action_type VARCHAR(50), 
    quantity INT NOT NULL,
    log_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

CREATE TABLE customers (
    customer_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT
);

CREATE TABLE loyalty_points (
    point_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    points_earned INT DEFAULT 0,
    points_used INT DEFAULT 0,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

CREATE TABLE reviews (
    review_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    product_id INT,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    review_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

CREATE TABLE discounts (
    discount_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_percent DECIMAL(5, 2),
    max_discount_amount DECIMAL(12, 2),
    valid_until DATE
);

CREATE TABLE orders (
    order_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    discount_id INT,
    order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(12, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending',
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    FOREIGN KEY (discount_id) REFERENCES discounts(discount_id)
);

CREATE TABLE order_items (
    order_item_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    product_id INT,
    quantity INT NOT NULL,
    unit_price DECIMAL(12, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

CREATE TABLE payments (
    payment_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    payment_method VARCHAR(50),
    payment_status VARCHAR(50),
    payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
);

CREATE TABLE shipping_details (
    shipping_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    shipping_address TEXT NOT NULL,
    shipper_name VARCHAR(100),
    shipper_phone VARCHAR(20),
    shipping_status VARCHAR(50) DEFAULT 'Preparing',
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
);

CREATE TABLE gift_messages (
    message_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    sender_name VARCHAR(150),
    recipient_name VARCHAR(150),
    message_content TEXT,
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
);

-- ====================================================================
-- PHẦN 2: THÊM DỮ LIỆU MẪU (DML)
-- ====================================================================

INSERT INTO categories (name, description) VALUES
('Hoa Tang Lễ', 'Hoa chia buồn, vòng hoa kính viếng'),
('Hoa Cưới', 'Hoa cầm tay cô dâu, hoa trang trí tiệc cưới'),
('Hoa Sinh Nhật', 'Bó hoa, lẵng hoa rực rỡ tặng dịp sinh nhật'),
('Hoa Khai Trương', 'Kệ hoa, lẵng hoa lớn chúc mừng khai trương hồng phát'),
('Hoa Ngày Lễ', 'Hoa tặng các dịp đặc biệt như 8/3, 20/10, Valentine'),
('Lan Hồ Điệp', 'Các chậu Lan Hồ Điệp sang trọng, cao cấp');

INSERT INTO suppliers (name, phone, address) VALUES
('Đà Lạt Hasfarm', '02633822156', '450 Nguyên Tử Lực, TP. Đà Lạt'),
('Mê Linh Flower Farm', '0983123456', 'Xã Mê Linh, Huyện Mê Linh, Hà Nội'),
('Import Flora Corp', '02839101122', '150 Hàm Nghi, Quận 1, TP. HCM'),
('Vườn Lan Hồ Điệp Bảo Lộc', '0914556677', 'Lộc Phát, TP. Bảo Lộc, Lâm Đồng'),
('Sa Đéc Garden', '02773861234', 'Làng hoa Sa Đéc, Đồng Tháp'),
('Dalat Flower Hub', '0905888999', '12 Phan Chu Trinh, TP. Đà Lạt'),
('Hà Lan Flower Import', '02437668899', 'Thụy Khuê, Tây Hồ, Hà Nội'),
('Hợp tác xã Hoa Tươi Vĩnh Hy', '0972000111', 'Vĩnh Hy, Ninh Thuận'),
('Green Farm Sapa', '0948222333', 'Tả Phìn, Sa Pa, Lào Cai'),
('Đại lý Phụ kiện Hoa Việt', '0933445566', 'Lý Thái Tổ, Quận 10, TP. HCM');

INSERT INTO combos (name, price, description) VALUES
('Combo Sinh Nhật Ngọt Ngào', 850000, 'Gồm 1 bó hoa baby trắng và 1 bánh kem chocolate size 15cm'),
('Combo Tình Yêu Lãng Mạn', 1200000, 'Gồm 1 bó hoa hồng đỏ 99 bông và 1 chú gấu bông Teddy 1m2'),
('Combo Khai Trương Hồng Phát', 2500000, 'Gồm 1 kệ hoa chúc mừng 2 tầng và 1 chai rượu vang Chile cao cấp'),
('Combo Sức Khỏe Bình An', 950000, 'Gồm 1 lẵng hoa tone vàng xanh và 1 giỏ trái cây nhập khẩu');

INSERT INTO products (name, category_id, supplier_id, price, stock_quantity) VALUES
('Vòng Hoa Chia Buồn Cúc Trắng', 1, 2, 1200000, 10),
('Vòng Hoa Lan Trắng Kính Viếng', 1, 8, 1800000, 5),
('Bó Hoa Cầm Tay Cô Dâu', 2, 1, 850000, 15),
('Hoa Cài Áo Chú Rể', 2, 7, 150000, 50),
('Lẵng Hoa Hồng Sinh Nhật Ngọt Ngào', 3, 3, 750000, 20),
('Giỏ Hoa Cẩm Tú Cầu Tặng Mẹ', 3, 1, 950000, 18),
('Kệ Hoa Khai Trương Đại Cát', 4, 5, 2500000, 8),
('Lẵng Hoa Đồng Tiền Chúc Mừng', 4, 5, 650000, 25),
('Bó Hoa Hướng Dương Rực Rỡ', 5, 6, 450000, 30),
('Bó Hoa Baby Trắng Khổng Lồ', 5, 9, 1100000, 10),
('Chậu Lan Hồ Điệp 5 Cành Đột Biến', 6, 4, 1500000, 12),
('Chậu Lan Hồ Điệp 9 Cành Vàng', 6, 4, 2700000, 8);

INSERT INTO combo_items (combo_id, product_id, quantity) VALUES
(1, 5, 1), (2, 10, 1), (2, 9, 1), (3, 7, 1), (3, 11, 1), (4, 6, 1), (4, 8, 1);

INSERT INTO inventory_logs (product_id, action_type, quantity) VALUES
(1, 'NHAP_KHO', 20), (3, 'NHAP_KHO', 30), (9, 'NHAP_KHO', 50), (11, 'NHAP_KHO', 15);

INSERT INTO customers (full_name, phone, address, email) VALUES
('Nguyễn Hoàng Nam', '0905123456', '12 Lê Lợi, Quận 1, TP. HCM', 'nam.nguyen@gmail.com'),
('Trần Thị Thanh Mai', '0912987654', '45 Nguyễn Trãi, Thanh Xuân, Hà Nội', 'mai.tran@gmail.com');

INSERT INTO loyalty_points (customer_id, points_earned, points_used) VALUES
(1, 500, 100), (2, 1200, 0);

INSERT INTO discounts (code, discount_percent, valid_until) VALUES
('WELCOME10', 10, '2026-12-31'),
('VALENTINE', 15, '2026-02-15');

INSERT INTO orders (customer_id, discount_id, total_amount, status) VALUES
(1, NULL, 850000, 'Completed'),
(2, 1, 1080000, 'Processing');

INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES
(1, 3, 1, 850000),
(2, 1, 1, 1200000);

-- SỬA LỖI TẠI ĐÂY: Loại bỏ các ký tự lạ và đóng ngoặc đúng cách
INSERT INTO shipping_details (order_id, shipping_address, shipping_status) VALUES
(1, '123 Đường Trần Hưng Đạo, Quận 1, TP.HCM', 'Đã giao thành công'),
(2, '456 Đường Lê Lợi, Quận Gò Vấp, TP.HCM', 'Đang giao hàng'),
(1, '789 Đường Nguyễn Văn Cừ, Quận 5, TP.HCM', 'Chờ lấy hàng');

INSERT INTO gift_messages (order_id, sender_name, recipient_name, message_content) VALUES
(1, 'Anh Nam', 'Vợ yêu', 'Chúc em một ngày vui vẻ!'),
(2, 'Công ty TNHH ABC', 'Gia quyến', 'Thành kính phân ưu.');

-- ====================================================================
-- PHẦN 3: PHÂN QUYỀN
-- ====================================================================

CREATE USER IF NOT EXISTS 'admin_shop'@'localhost' IDENTIFIED BY 'admin_123';
GRANT ALL PRIVILEGES ON flower_shop.* TO 'admin_shop'@'localhost' WITH GRANT OPTION;

CREATE USER IF NOT EXISTS 'user_khachhang'@'localhost' IDENTIFIED BY 'user_pass_456';
GRANT SELECT ON flower_shop.* TO 'user_khachhang'@'localhost';

FLUSH PRIVILEGES;

-- ====================================================================
-- PHẦN 4: KIỂM TRA
-- ====================================================================
SELECT 'OK' AS Status, (SELECT COUNT(*) FROM products) AS Total_Products;