# --- GOM TẤT CẢ IMPORT LÊN ĐẦU FILE ---
import random
from datetime import timedelta
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
from twilio.rest import Client
from django.contrib.auth.models import User  # Đã đưa import User lên đầu
from django.contrib.auth import authenticate
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.db import transaction
from .models import (
    Category, Supplier, Product, ProductImage, Combo, ComboItem, InventoryLog,
    Customer, LoyaltyPoint, Review, Discount, Order, OrderItem,
    Payment, ShippingDetail, GiftMessage, UserProfile, Banner, PasswordResetOTP
)
from .serializers import (
    CategorySerializer, SupplierSerializer, ProductSerializer, ProductImageSerializer,
    ComboSerializer, ComboItemSerializer, InventoryLogSerializer, CustomerSerializer,
    LoyaltyPointSerializer, ReviewSerializer, DiscountSerializer,
    OrderSerializer, OrderItemSerializer, PaymentSerializer,
    ShippingDetailSerializer, GiftMessageSerializer, BannerSerializer
)

# --- CÁC API VIEWSETS CÓ SẴN CỦA BẠN ---

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class SupplierViewSet(viewsets.ModelViewSet):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def _save_extra_images(self, product, request):
        """Lưu các ảnh phụ tải lên vào ProductImage"""
        uploaded_images = request.FILES.getlist('uploaded_images')
        for idx, img_file in enumerate(uploaded_images):
            ProductImage.objects.create(
                product=product,
                image=img_file,
                order=idx
            )

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        product = serializer.save()
        # Lưu những ảnh phụ nếu có
        self._save_extra_images(product, request)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        product = serializer.save()
        # Nếu có ảnh mới tải lên thì xóa những ảnh cũ rồi thêm mới
        uploaded_images = request.FILES.getlist('uploaded_images')
        if uploaded_images:
            product.images.all().delete()
            self._save_extra_images(product, request)
        return Response(serializer.data)

class ProductImageViewSet(viewsets.ModelViewSet):
    queryset = ProductImage.objects.all()
    serializer_class = ProductImageSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

class ComboViewSet(viewsets.ModelViewSet):
    queryset = Combo.objects.all()
    serializer_class = ComboSerializer

class ComboItemViewSet(viewsets.ModelViewSet):
    queryset = ComboItem.objects.all()
    serializer_class = ComboItemSerializer

class InventoryLogViewSet(viewsets.ModelViewSet):
    queryset = InventoryLog.objects.all()
    serializer_class = InventoryLogSerializer

class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer

class LoyaltyPointViewSet(viewsets.ModelViewSet):
    queryset = LoyaltyPoint.objects.all()
    serializer_class = LoyaltyPointSerializer

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer

class DiscountViewSet(viewsets.ModelViewSet):
    queryset = Discount.objects.all()
    serializer_class = DiscountSerializer

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all().order_by('-created_at')
    serializer_class = OrderSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        email = self.request.query_params.get('email', None)
        if email:
            queryset = queryset.filter(customer__email=email)
        return queryset

class OrderItemViewSet(viewsets.ModelViewSet):
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer

class ShippingDetailViewSet(viewsets.ModelViewSet):
    queryset = ShippingDetail.objects.all()
    serializer_class = ShippingDetailSerializer

class GiftMessageViewSet(viewsets.ModelViewSet):
    queryset = GiftMessage.objects.all()
    serializer_class = GiftMessageSerializer

class BannerViewSet(viewsets.ModelViewSet):
    queryset = Banner.objects.all()
    serializer_class = BannerSerializer
    permission_classes = [AllowAny] # Cho phép Frontend lấy danh sách không cần đăng nhập, nhưng POST/PUT vẫn tuân theo config chung nếu cấu hình, ở đây tôi mở tạm hoặc dùng permission tùy chỉnh nếu cần. Đơn giản nhất dùng ModelViewSet mặc định



# --- API ĐĂNG KÝ VÀ ĐĂNG NHẬP ---

class RegisterAPIView(APIView):
    permission_classes = (AllowAny,) # Ai cũng có thể gọi API này

    def post(self, request):
        # Lấy dữ liệu từ Frontend gửi lên
        username = request.data.get("username")
        password = request.data.get("password")
        email = request.data.get("email")
        first_name = request.data.get("first_name", "")

        # Kiểm tra xem đã nhập đủ thông tin chưa
        if not username or not password:
            return Response({"error": "Vui lòng cung cấp tài khoản và mật khẩu!"}, status=status.HTTP_400_BAD_REQUEST)

        # Kiểm tra xem username đã tồn tại trong DB chưa
        if User.objects.filter(username=username).exists():
            return Response({"error": "Tài khoản này đã tồn tại!"}, status=status.HTTP_400_BAD_REQUEST)

        # Tạo user mới
        user = User.objects.create_user(
            username=username, 
            email=email, 
            password=password, 
            first_name=first_name
        )
        
        return Response({
            "message": "Đăng ký thành công!",
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email
            }
        }, status=status.HTTP_201_CREATED)


class LoginAPIView(APIView):
    permission_classes = (AllowAny,) # Ai cũng có thể gọi API này

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        
        # Kiểm tra tài khoản và mật khẩu
        user = authenticate(username=username, password=password)
        
        if user:
            # Đăng nhập thành công -> Trả về thông tin User kèm quyền is_staff
            return Response({
                "message": "Đăng nhập thành công!",
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "first_name": user.first_name or user.username,  # Hiển thị first_name hoặc username
                    "is_staff": user.is_staff, # ĐÂY LÀ CHÌA KHÓA QUAN TRỌNG NHẤT
                }
            }, status=status.HTTP_200_OK)
            
        # Nếu sai thông tin
        return Response({"error": "Sai tài khoản hoặc mật khẩu!"}, status=status.HTTP_400_BAD_REQUEST)


# --- API QUẢN LÝ NGƯỜI DÙNG (ADMIN ONLY) ---

class UserManagementAPIView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        """GET /users/ - Lấy danh sách tất cả users (admin only)"""
        if not request.user.is_staff:
            return Response({"error": "Bạn không có quyền truy cập!"}, status=status.HTTP_403_FORBIDDEN)
        
        users_data = []
        for user in User.objects.all():
            profile = user.profile if hasattr(user, 'profile') else None
            users_data.append({
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'phone': profile.phone if profile else '',
                'date_of_birth': profile.date_of_birth if profile else None,
                'address': profile.address if profile else '',
                'is_staff': user.is_staff,
                'is_active': user.is_active,
                'date_joined': user.date_joined
            })
        return Response(users_data, status=status.HTTP_200_OK)

    def post(self, request):
        """POST /users/ - Tạo user mới (admin only)"""
        if not request.user.is_staff:
            return Response({"error": "Bạn không có quyền truy cập!"}, status=status.HTTP_403_FORBIDDEN)
        
        username = request.data.get("username")
        email = request.data.get("email")
        password = request.data.get("password")
        first_name = request.data.get("first_name", "")
        last_name = request.data.get("last_name", "")
        phone = request.data.get("phone", "")
        date_of_birth = request.data.get("date_of_birth")
        address = request.data.get("address", "")
        is_staff = request.data.get("is_staff", False)

        # Kiểm tra username đã tồn tại
        if User.objects.filter(username=username).exists():
            return Response({"error": "Tài khoản này đã tồn tại!"}, status=status.HTTP_400_BAD_REQUEST)

        # Tạo user mới
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
            is_staff=is_staff
        )

        # Tạo profile cho user
        UserProfile.objects.create(
            user=user,
            phone=phone,
            date_of_birth=date_of_birth,
            address=address
        )

        return Response({
            "message": "Tạo người dùng thành công!",
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "phone": phone,
                "date_of_birth": date_of_birth,
                "address": address,
                "is_staff": user.is_staff
            }
        }, status=status.HTTP_201_CREATED)


class UserDetailAPIView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, user_id):
        """GET /users/{id}/ - Lấy thông tin user"""
        if not request.user.is_staff:
            return Response({"error": "Bạn không có quyền truy cập!"}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            user = User.objects.get(id=user_id)
            profile = user.profile if hasattr(user, 'profile') else None
            return Response({
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "phone": profile.phone if profile else '',
                "date_of_birth": profile.date_of_birth if profile else None,
                "address": profile.address if profile else '',
                "is_staff": user.is_staff,
                "is_active": user.is_active,
                "date_joined": user.date_joined
            }, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "Người dùng không tồn tại!"}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, user_id):
        """PUT /users/{id}/ - Cập nhật user (admin only)"""
        if not request.user.is_staff:
            return Response({"error": "Bạn không có quyền truy cập!"}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            user = User.objects.get(id=user_id)
            
            # Cập nhật các trường của user
            user.username = request.data.get("username", user.username)
            user.email = request.data.get("email", user.email)
            user.first_name = request.data.get("first_name", user.first_name)
            user.last_name = request.data.get("last_name", user.last_name)
            user.is_staff = request.data.get("is_staff", user.is_staff)
            user.is_active = request.data.get("is_active", user.is_active)

            # Cập nhật mật khẩu nếu có
            if request.data.get("password"):
                user.set_password(request.data.get("password"))

            user.save()

            # Cập nhật hoặc tạo profile
            profile, created = UserProfile.objects.get_or_create(user=user)
            profile.phone = request.data.get("phone", profile.phone)
            profile.date_of_birth = request.data.get("date_of_birth", profile.date_of_birth)
            profile.address = request.data.get("address", profile.address)
            profile.save()

            return Response({
                "message": "Cập nhật người dùng thành công!",
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "phone": profile.phone,
                    "date_of_birth": profile.date_of_birth,
                    "address": profile.address,
                    "is_staff": user.is_staff,
                    "is_active": user.is_active
                }
            }, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "Người dùng không tồn tại!"}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, user_id):
        """DELETE /users/{id}/ - Xóa user (admin only)"""
        if not request.user.is_staff:
            return Response({"error": "Bạn không có quyền truy cập!"}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            user = User.objects.get(id=user_id)
            username = user.username
            user.delete()
            return Response({
                "message": f"Xóa người dùng {username} thành công!"
            }, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "Người dùng không tồn tại!"}, status=status.HTTP_404_NOT_FOUND)

# --- API THANH TOÁN (CHECKOUT) ---
class CheckoutAPIView(APIView):
    permission_classes = (AllowAny,)

    @transaction.atomic
    def post(self, request):
        try:
            items = request.data.get('items', [])
            total_price = request.data.get('total_price', 0)
            shipping_address = request.data.get('shipping_address', '')
            payment_method = request.data.get('payment_method', 'COD')
            customer_email = request.data.get('email', 'guest@example.com')
            customer_name = request.data.get('name', 'Guest')
            customer_phone = request.data.get('phone', '')

            # Các trường bổ sung cho Giao hoa hộ & Lời nhắn
            shipping_fee = request.data.get('shipping_fee', 0)
            message_fee = request.data.get('message_fee', 0)
            is_gift = request.data.get('is_gift', False)
            gift_sender = request.data.get('gift_sender', '')
            gift_recipient = request.data.get('gift_recipient', '')
            gift_message = request.data.get('gift_message', '')

            if not items:
                return Response({"error": "Giỏ hàng trống!"}, status=status.HTTP_400_BAD_REQUEST)

            # Tìm hoặc tạo Customer dựa vào email
            customer, created = Customer.objects.get_or_create(
                email=customer_email,
                defaults={
                    'name': customer_name,
                    'phone': customer_phone,
                    'address': shipping_address
                }
            )

            # Lưu ý Customer Model ko có is_staff, nhưng nếu cập nhật địa chỉ khi mua
            if not created and not customer.address:
                customer.address = shipping_address
                customer.save()

            # Tạo Order
            order = Order.objects.create(
                customer=customer,
                total_amount=total_price,
                shipping_fee=shipping_fee,
                message_fee=message_fee,
                status='PENDING'
            )

            # Tạo GiftMessage nếu có bật giao hoa hộ
            if is_gift:
                GiftMessage.objects.create(
                    order=order,
                    sender_name=gift_sender,
                    recipient_name=gift_recipient,
                    message=gift_message
                )

            # Lưu từng Item của Order
            for item in items:
                product_id = item.get('id')
                quantity = item.get('quantity', 1)
                
                try:
                    product = Product.objects.get(id=product_id)
                    price = item.get('price', product.price) # Lấy giá từ FE phòng khi giá thay đổi
                    
                    OrderItem.objects.create(
                        order=order,
                        product=product,
                        quantity=quantity,
                        price_at_purchase=price
                    )
                except Product.DoesNotExist:
                    continue

            # Tạo thông tin Payment (COD/BANK)
            Payment.objects.create(
                order=order,
                payment_method=payment_method,
                is_paid=False
            )

            # Thông tin Shipping
            ShippingDetail.objects.create(
                order=order,
                shipping_address=shipping_address
            )

            return Response({
                "message": "Tạo đơn hàng thành công!",
                "order_id": order.id
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

# --- API QUÊN MẬT KHẨU ---

class ForgotPasswordAPIView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        email = request.data.get("email")
        if not email:
            return Response({"error": "Vui lòng cung cấp email!"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "Email này chưa được đăng ký trong hệ thống!"}, status=status.HTTP_404_NOT_FOUND)

        # Tạo mã 4 số ngẫu nhiên
        otp = str(random.randint(1000, 9999))
        
        # Vô hiệu hóa các mã OTP cũ
        PasswordResetOTP.objects.filter(user=user, is_used=False).update(is_used=True)

        # Lưu OTP mới vào DB
        PasswordResetOTP.objects.create(user=user, otp=otp)

        # IN RA TERMINAL ĐỂ TEST (Khong dung tieng Viet co dau de tranh loi Windows Console)
        print(f"\n{'='*50}\n[TESTING] MA OTP CUA EMAIL {user.email} LA: {otp}\n{'='*50}\n")

        # Gửi email
        try:
            subject = "Mã xác nhận quên mật khẩu - Mộc Store"
            message = f"Xin chào {user.username},\n\nMã xác nhận để đặt lại mật khẩu của bạn là: {otp}\n\nMã này có hiệu lực trong 5 phút. Vui lòng không chia sẻ mã này cho bất kỳ ai.\n\nTrân trọng,\nMộc Store"
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [user.email],
                fail_silently=False,
            )
            return Response({"message": "Mã xác nhận đã được gửi đến email của bạn!"}, status=status.HTTP_200_OK)
        except Exception as e:
            # Bắt buộc dùng email thật, trả về lỗi nếu chưa cấu hình
            return Response({"error": "Hệ thống chưa được cấu hình Email gửi đi (Chưa điền Mật khẩu ứng dụng trong settings.py). Vui lòng cấu hình để nhận mã thật!"}, status=status.HTTP_400_BAD_REQUEST)


class VerifyOTPAPIView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        email = request.data.get("email")
        otp = request.data.get("otp")

        if not email or not otp:
            return Response({"error": "Thiếu email hoặc mã OTP!"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
            # Lấy mã OTP mới nhất chưa sử dụng
            reset_obj = PasswordResetOTP.objects.filter(user=user, otp=otp, is_used=False).latest('created_at')
            
            # Kiểm tra thời hạn 5 phút
            if timezone.now() > reset_obj.created_at + timedelta(minutes=5):
                return Response({"error": "Mã OTP đã hết hạn!"}, status=status.HTTP_400_BAD_REQUEST)

            # OTP hợp lệ
            return Response({"message": "Mã OTP hợp lệ!"}, status=status.HTTP_200_OK)

        except User.DoesNotExist:
            return Response({"error": "Email không tồn tại!"}, status=status.HTTP_404_NOT_FOUND)
        except PasswordResetOTP.DoesNotExist:
            return Response({"error": "Mã OTP không chính xác!"}, status=status.HTTP_400_BAD_REQUEST)


class ResetPasswordAPIView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        email = request.data.get("email")
        otp = request.data.get("otp")
        new_password = request.data.get("new_password")

        if not all([email, otp, new_password]):
            return Response({"error": "Thiếu thông tin yêu cầu!"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
            reset_obj = PasswordResetOTP.objects.filter(user=user, otp=otp, is_used=False).latest('created_at')

            if timezone.now() > reset_obj.created_at + timedelta(minutes=5):
                return Response({"error": "Mã OTP đã hết hạn!"}, status=status.HTTP_400_BAD_REQUEST)

            # Cập nhật mật khẩu mới
            user.set_password(new_password)
            user.save()

            # Đánh dấu OTP đã sử dụng
            reset_obj.is_used = True
            reset_obj.save()

            return Response({"message": "Đặt lại mật khẩu thành công!"}, status=status.HTTP_200_OK)

        except User.DoesNotExist:
            return Response({"error": "Email không tồn tại!"}, status=status.HTTP_404_NOT_FOUND)
        except PasswordResetOTP.DoesNotExist:
            return Response({"error": "Mã OTP không chính xác hoặc đã được sử dụng!"}, status=status.HTTP_400_BAD_REQUEST)


# --- API QUÊN MẬT KHẨU BẰNG SỐ ĐIỆN THOẠI (SMS) ---

class ForgotPasswordPhoneAPIView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        phone = request.data.get("phone")
        if not phone:
            return Response({"error": "Vui lòng cung cấp số điện thoại!"}, status=status.HTTP_400_BAD_REQUEST)

        # Chuyển đổi định dạng số điện thoại nếu cần (Ví dụ: 09... thành +849...)
        # Ở đây ta giả sử số điện thoại đã đúng định dạng quốc tế hoặc Twilio chấp nhận định dạng local
        formatted_phone = phone
        if phone.startswith('0'):
            formatted_phone = '+84' + phone[1:]

        # Tìm user bằng số điện thoại trong UserProfile
        user = User.objects.filter(profile__phone=phone).first()
        if not user:
            # Thử tìm bằng định dạng +84 nếu profile lưu theo định dạng cũ
            user = User.objects.filter(profile__phone=formatted_phone).first()
            
        if not user:
            return Response({"error": "Số điện thoại này chưa được đăng ký trong hệ thống!"}, status=status.HTTP_404_NOT_FOUND)

        otp = str(random.randint(1000, 9999))
        PasswordResetOTP.objects.filter(user=user, is_used=False).update(is_used=True)
        PasswordResetOTP.objects.create(user=user, otp=otp)

        # IN RA TERMINAL ĐỂ TEST (Khong dung tieng Viet co dau de tranh loi Windows Console)
        print(f"\n{'='*50}\n[TESTING] MA OTP SMS CHO {formatted_phone} LA: {otp}\n{'='*50}\n")

        # Gửi SMS qua Twilio
        try:
            client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
            message = client.messages.create(
                body=f"Mã xác nhận quên mật khẩu Mộc Store của bạn là: {otp}. Mã có hiệu lực 5 phút.",
                from_=settings.TWILIO_PHONE_NUMBER,
                to=formatted_phone
            )
            return Response({"message": "Mã xác nhận đã được gửi đến số điện thoại của bạn!"}, status=status.HTTP_200_OK)
        except Exception as e:
            # Bắt buộc dùng SMS thật, trả về lỗi nếu chưa cấu hình
            return Response({"error": "Hệ thống chưa được cấu hình SMS Twilio (Chưa điền API Key trong settings.py). Vui lòng cấu hình để nhận tin nhắn thật!"}, status=status.HTTP_400_BAD_REQUEST)


class VerifyOTPPhoneAPIView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        phone = request.data.get("phone")
        otp = request.data.get("otp")

        if not phone or not otp:
            return Response({"error": "Thiếu số điện thoại hoặc mã OTP!"}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.filter(profile__phone=phone).first()
        if not user:
            formatted_phone = '+84' + phone[1:] if phone.startswith('0') else phone
            user = User.objects.filter(profile__phone=formatted_phone).first()

        if not user:
            return Response({"error": "Số điện thoại không tồn tại!"}, status=status.HTTP_404_NOT_FOUND)

        try:
            reset_obj = PasswordResetOTP.objects.filter(user=user, otp=otp, is_used=False).latest('created_at')
            if timezone.now() > reset_obj.created_at + timedelta(minutes=5):
                return Response({"error": "Mã OTP đã hết hạn!"}, status=status.HTTP_400_BAD_REQUEST)

            return Response({"message": "Mã OTP hợp lệ!"}, status=status.HTTP_200_OK)
        except PasswordResetOTP.DoesNotExist:
            return Response({"error": "Mã OTP không chính xác!"}, status=status.HTTP_400_BAD_REQUEST)


class ResetPasswordPhoneAPIView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        phone = request.data.get("phone")
        otp = request.data.get("otp")
        new_password = request.data.get("new_password")

        if not all([phone, otp, new_password]):
            return Response({"error": "Thiếu thông tin yêu cầu!"}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.filter(profile__phone=phone).first()
        if not user:
            formatted_phone = '+84' + phone[1:] if phone.startswith('0') else phone
            user = User.objects.filter(profile__phone=formatted_phone).first()

        if not user:
            return Response({"error": "Số điện thoại không tồn tại!"}, status=status.HTTP_404_NOT_FOUND)

        try:
            reset_obj = PasswordResetOTP.objects.filter(user=user, otp=otp, is_used=False).latest('created_at')
            if timezone.now() > reset_obj.created_at + timedelta(minutes=5):
                return Response({"error": "Mã OTP đã hết hạn!"}, status=status.HTTP_400_BAD_REQUEST)

            user.set_password(new_password)
            user.save()
            reset_obj.is_used = True
            reset_obj.save()

            return Response({"message": "Đặt lại mật khẩu thành công!"}, status=status.HTTP_200_OK)
        except PasswordResetOTP.DoesNotExist:
            return Response({"error": "Mã OTP không chính xác hoặc đã được sử dụng!"}, status=status.HTTP_400_BAD_REQUEST)