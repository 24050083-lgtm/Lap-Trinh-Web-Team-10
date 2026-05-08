from django.urls import path, include
from rest_framework.routers import DefaultRouter

# --- 1. GOM TẤT CẢ IMPORT LÊN ĐẦU ---
from .views import (
    CategoryViewSet, SupplierViewSet, ProductViewSet, ProductImageViewSet, ComboViewSet,
    ComboItemViewSet, InventoryLogViewSet, CustomerViewSet,
    LoyaltyPointViewSet, ReviewViewSet, DiscountViewSet,
    OrderViewSet, OrderItemViewSet, PaymentViewSet,
    ShippingDetailViewSet, GiftMessageViewSet, BannerViewSet,
    RegisterAPIView, LoginAPIView, UserManagementAPIView, UserDetailAPIView,
    CheckoutAPIView, ForgotPasswordAPIView, VerifyOTPAPIView, ResetPasswordAPIView,
    ForgotPasswordPhoneAPIView, VerifyOTPPhoneAPIView, ResetPasswordPhoneAPIView
)

# --- 2. KHỞI TẠO ROUTER CHO CÁC VIEWSET ---
router = DefaultRouter()

router.register('categories', CategoryViewSet)
router.register('suppliers', SupplierViewSet)
router.register('products', ProductViewSet)
router.register('product-images', ProductImageViewSet)
router.register('combos', ComboViewSet)
router.register('combo-items', ComboItemViewSet)
router.register('inventory-logs', InventoryLogViewSet)
router.register('customers', CustomerViewSet)
router.register('loyalty-points', LoyaltyPointViewSet)
router.register('reviews', ReviewViewSet)
router.register('discounts', DiscountViewSet)
router.register('orders', OrderViewSet)
router.register('order-items', OrderItemViewSet)
router.register('payments', PaymentViewSet)
router.register('shipping-details', ShippingDetailViewSet)
router.register('gift-messages', GiftMessageViewSet)
router.register('banners', BannerViewSet)

# --- 3. GOM CHUNG VÀO MỘT DANH SÁCH URLPATTERNS DUY NHẤT ---
urlpatterns = [
    # API Đăng ký và Đăng nhập (Nên đặt lên trước router)
    path('register/', RegisterAPIView.as_view(), name='api_register'),
    path('login/', LoginAPIView.as_view(), name='api_login'),
    
    # API Quản lý Người dùng
    path('users/', UserManagementAPIView.as_view(), name='api_users'),
    path('users/<int:user_id>/', UserDetailAPIView.as_view(), name='api_user_detail'),
    
    # API Thanh toán (Checkout)
    path('checkout/', CheckoutAPIView.as_view(), name='api_checkout'),
    
    # API Quên mật khẩu
    path('forgot-password/', ForgotPasswordAPIView.as_view(), name='api_forgot_password'),
    path('verify-otp/', VerifyOTPAPIView.as_view(), name='api_verify_otp'),
    path('reset-password/', ResetPasswordAPIView.as_view(), name='api_reset_password'),
    
    # API Quên mật khẩu (SMS)
    path('forgot-password-phone/', ForgotPasswordPhoneAPIView.as_view(), name='api_forgot_password_phone'),
    path('verify-otp-phone/', VerifyOTPPhoneAPIView.as_view(), name='api_verify_otp_phone'),
    path('reset-password-phone/', ResetPasswordPhoneAPIView.as_view(), name='api_reset_password_phone'),
    
    # Kéo tất cả 15 đường dẫn của router vào đây
    path('', include(router.urls)), 
]