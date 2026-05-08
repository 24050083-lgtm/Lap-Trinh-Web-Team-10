from django.db import models
from django.contrib.auth.models import User
from django.utils.text import slugify

# --- USER PROFILE - Mở rộng thông tin User ---
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    date_of_birth = models.DateField(null=True, blank=True, verbose_name="Ngày sinh")
    address = models.TextField(blank=True, verbose_name="Địa chỉ")
    phone = models.CharField(max_length=20, blank=True, verbose_name="Số điện thoại")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Profile of {self.user.username}"

    class Meta:
        verbose_name_plural = "User Profiles"
class Category(models.Model):
    name = models.CharField(max_length=100, verbose_name="Tên danh mục")
    slug = models.SlugField(unique=True)

    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self): return self.name

# 2. Nhà cung cấp
class Supplier(models.Model):
    name = models.CharField(max_length=200, verbose_name="Nhà cung cấp")
    phone = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)

    def __str__(self): return self.name

# Helper: tạo đường dẫn theo tên sản phẩm
def product_directory_path(instance, filename):
    """Lưu ảnh vào media/flowers/<slug-ten-san-pham>/filename"""
    if hasattr(instance, 'product'):
        # Dùng cho ProductImage (ảnh phụ)
        folder = slugify(instance.product.name)
    else:
        # Dùng cho Product (ảnh chính)
        folder = slugify(instance.name)
    return f'flowers/{folder}/{filename}'

# 3. Sản phẩm (Hoa)
class Product(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    supplier = models.ForeignKey(Supplier, on_delete=models.SET_NULL, null=True, blank=True)
    name = models.CharField(max_length=200, verbose_name="Tên sản phẩm")
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Giá")
    stock = models.IntegerField(default=0, verbose_name="Số lượng tồn")
    image = models.ImageField(upload_to=product_directory_path, null=True, blank=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self): return self.name

# 3b. Hình ảnh phụ của Sản phẩm (nhiều ảnh cho 1 sản phẩm)
class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to=product_directory_path, verbose_name="Hình ảnh")
    order = models.IntegerField(default=0, verbose_name="Thứ tự hiển thị")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', 'id']
        verbose_name = "Hình ảnh sản phẩm"
        verbose_name_plural = "Hình ảnh sản phẩm"

    def __str__(self):
        return f"Ảnh #{self.id} của {self.product.name}"

# 4. Combo hoa (Gói cắm sẵn)
class Combo(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    is_active = models.BooleanField(default=True)

    def __str__(self): return self.name

# 5. Các sản phẩm trong một Combo
class ComboItem(models.Model):
    combo = models.ForeignKey(Combo, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

# 6. Nhật ký nhập/xuất kho
class InventoryLog(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity_changed = models.IntegerField(help_text="Số âm nếu xuất kho, số dương nếu nhập kho")
    reason = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

# 7. Khách hàng
class Customer(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20)
    address = models.TextField()

    def __str__(self): return self.name

# 8. Điểm thưởng khách hàng thân thiết
class LoyaltyPoint(models.Model):
    customer = models.OneToOneField(Customer, on_delete=models.CASCADE)
    points = models.IntegerField(default=0)
    updated_at = models.DateTimeField(auto_now=True)

# 9. Đánh giá sản phẩm
class Review(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    rating = models.IntegerField(default=5) # Từ 1 đến 5 sao
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

# 10. Mã giảm giá
class Discount(models.Model):
    code = models.CharField(max_length=50, unique=True)
    percentage = models.DecimalField(max_digits=5, decimal_places=2, help_text="Phần trăm giảm giá")
    valid_from = models.DateTimeField()
    valid_to = models.DateTimeField()
    is_active = models.BooleanField(default=True)

    def __str__(self): return self.code

# 11. Đơn hàng
class Order(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Chờ xử lý'),
        ('PROCESSING', 'Đang cắm hoa'),
        ('SHIPPED', 'Đang giao'),
        ('DELIVERED', 'Đã giao'),
        ('CANCELLED', 'Đã hủy'),
    ]
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='orders')
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    shipping_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    message_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self): return f"Đơn hàng #{self.id} - {self.customer.name}"

# 12. Chi tiết đơn hàng (Mua những hoa gì)
class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    quantity = models.PositiveIntegerField(default=1)
    price_at_purchase = models.DecimalField(max_digits=10, decimal_places=2)

# 13. Thanh toán
class Payment(models.Model):
    order = models.OneToOneField(Order, on_delete=models.CASCADE)
    payment_method = models.CharField(max_length=50, choices=[('COD', 'Tiền mặt'), ('BANK', 'Chuyển khoản')])
    is_paid = models.BooleanField(default=False)
    transaction_id = models.CharField(max_length=100, blank=True, null=True)
    paid_at = models.DateTimeField(null=True, blank=True)

# 14. Chi tiết giao hàng
class ShippingDetail(models.Model):
    order = models.OneToOneField(Order, on_delete=models.CASCADE)
    shipping_address = models.TextField()
    tracking_number = models.CharField(max_length=100, blank=True, null=True)
    shipped_at = models.DateTimeField(null=True, blank=True)

# 15. Lời nhắn tặng quà (Đi kèm bó hoa)
class GiftMessage(models.Model):
    order = models.OneToOneField(Order, on_delete=models.CASCADE)
    sender_name = models.CharField(max_length=100)
    recipient_name = models.CharField(max_length=100)
    message = models.TextField()

# 16. Banner cập nhật hình ảnh ngoài trang chủ
class Banner(models.Model):
    title = models.CharField(max_length=255, blank=True, verbose_name="Tiêu đề chính")
    subtitle = models.CharField(max_length=255, blank=True, verbose_name="Tiêu đề phụ")
    image = models.ImageField(upload_to='banners/')
    link = models.CharField(max_length=255, blank=True, verbose_name="Đường dẫn nút")
    is_active = models.BooleanField(default=True, verbose_name="Hiển thị")
    order = models.IntegerField(default=0, verbose_name="Thứ tự")

    class Meta:
        ordering = ['order', '-id']

    def __str__(self):
        return self.title if self.title else f"Banner #{self.id}"

# 17. Lưu mã OTP cho chức năng quên mật khẩu
class PasswordResetOTP(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='otps')
    otp = models.CharField(max_length=4)
    created_at = models.DateTimeField(auto_now_add=True)
    is_used = models.BooleanField(default=False)

    def __str__(self):
        return f"OTP for {self.user.email} - {self.otp}"