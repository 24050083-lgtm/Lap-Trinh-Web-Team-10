from django.contrib import admin
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin as DefaultUserAdmin
from .models import (
    UserProfile, Category, Supplier, Product, ProductImage, Combo, ComboItem, 
    InventoryLog, Customer, LoyaltyPoint, Review, Discount, 
    Order, OrderItem, Payment, ShippingDetail, GiftMessage, Banner
)

# Tuỳ chỉnh Trang Admin Django
admin.site.site_header = "Hệ Thống Quản Trị Admin"
admin.site.site_title = "Admin Portal"
admin.site.index_title = "Quản Lý Shop Hoa Tươi"

# 1. Quản lý Người dùng (User & UserProfile)

class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False
    verbose_name_plural = 'Thông tin mở rộng (Profile)'

class UserAdmin(DefaultUserAdmin):
    inlines = (UserProfileInline, )
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'is_active')
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'groups')
    search_fields = ('username', 'first_name', 'last_name', 'email')

admin.site.unregister(User) # Hủy đăng ký mặc định
admin.site.register(User, UserAdmin) # Cập nhật User Admin mới

# 2. Quản lý Danh mục
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'slug']
    search_fields = ['name']
    prepopulated_fields = {'slug': ('name',)}

# 3. Quản lý Nhà cung cấp
@admin.register(Supplier)
class SupplierAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'phone']
    search_fields = ['name', 'phone']

# 4. Quản lý Sản phẩm và Hình ảnh
class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 3  # Hiển thị sẵn 3 ô upload ảnh
    fields = ['image', 'order']
    ordering = ['order']

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'category', 'price', 'stock', 'supplier', 'created_at']
    list_filter = ['category', 'supplier', 'created_at']
    search_fields = ['name']
    list_editable = ['price', 'stock']
    inlines = [ProductImageInline]

@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ['id', 'product', 'image', 'order']
    list_filter = ['product']
    search_fields = ['product__name']

# 5. Quản lý Combo (Đính kèm ComboItem)
class ComboItemInline(admin.TabularInline):
    model = ComboItem
    extra = 1

@admin.register(Combo)
class ComboAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'price', 'is_active']
    list_filter = ['is_active']
    search_fields = ['name']
    inlines = [ComboItemInline]

# 6. Quản lý Tồn kho
@admin.register(InventoryLog)
class InventoryLogAdmin(admin.ModelAdmin):
    list_display = ['id', 'product', 'quantity_changed', 'reason', 'created_at']
    list_filter = ['created_at']
    search_fields = ['product__name', 'reason']

# 7. Quản lý Khách hàng
@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'email', 'phone']
    search_fields = ['name', 'email', 'phone']

# 8. Điểm thưởng
@admin.register(LoyaltyPoint)
class LoyaltyPointAdmin(admin.ModelAdmin):
    list_display = ['id', 'customer', 'points', 'updated_at']
    search_fields = ['customer__name']
    list_filter = ['updated_at']

# 9. Đánh giá sản phẩm
@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['id', 'product', 'customer', 'rating', 'created_at']
    list_filter = ['rating', 'created_at']
    search_fields = ['product__name', 'customer__name']

# 10. Giảm giá
@admin.register(Discount)
class DiscountAdmin(admin.ModelAdmin):
    list_display = ['id', 'code', 'percentage', 'valid_from', 'valid_to', 'is_active']
    list_filter = ['is_active', 'valid_from', 'valid_to']
    search_fields = ['code']

# 11. Đơn hàng (Đính kèm chi tiết mua hoa)
class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['price_at_purchase']

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'customer', 'total_amount', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['customer__name', 'id']
    list_editable = ['status']
    inlines = [OrderItemInline]

# 12. Thanh toán
@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['id', 'order', 'payment_method', 'is_paid', 'transaction_id', 'paid_at']
    list_filter = ['payment_method', 'is_paid']
    search_fields = ['order__id', 'transaction_id']
    list_editable = ['is_paid']

# 13. Giao hàng
@admin.register(ShippingDetail)
class ShippingDetailAdmin(admin.ModelAdmin):
    list_display = ['id', 'order', 'tracking_number', 'shipped_at']
    search_fields = ['order__id', 'tracking_number']

# 14. Quà tặng & Lời nhắn
@admin.register(GiftMessage)
class GiftMessageAdmin(admin.ModelAdmin):
    list_display = ['id', 'order', 'sender_name', 'recipient_name']
    search_fields = ['sender_name', 'recipient_name']

# 15. Quản lý Banner Trang chủ (CMS)
@admin.register(Banner)
class BannerAdmin(admin.ModelAdmin):
    list_display = ['id', 'title', 'is_active', 'order']
    list_filter = ['is_active']
    list_editable = ['is_active', 'order']
    search_fields = ['title', 'subtitle']