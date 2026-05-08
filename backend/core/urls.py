from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import HttpResponse

# Định nghĩa hàm cho trang chủ
def home(request):
    return HttpResponse("Chào mừng bạn đến với trang chủ!")

urlpatterns = [
    # 1. Đường dẫn trang chủ
    path('', home), 
    
    # 2. Đường dẫn trang quản trị
    path('admin/', admin.site.urls),
    
    # 3. Đường dẫn API (Đảm bảo tên app khớp với project của bạn)
    # Nếu bạn dùng app tên 'products', hãy giữ nguyên là 'products.urls'
    path('api/', include('products.urls')), 
]

# Cấu hình phục vụ file Media khi ở chế độ DEBUG
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)