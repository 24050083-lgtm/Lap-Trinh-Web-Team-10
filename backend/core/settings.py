import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = 'django-insecure-your-secret-key-here'

DEBUG = True

ALLOWED_HOSTS = []

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',  # 1. THÊM DÒNG NÀY ĐỂ CHẠY CORS
    'products',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # 2. THÊM DÒNG NÀY LÊN ĐẦU TIÊN
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'core.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'core.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'flower_shop',
        'USER': 'root',
        'PASSWORD': '12345',
        'HOST': '127.0.0.1',
        'PORT': '3306',
        'OPTIONS': {
            'charset': 'utf8mb4',
            'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
        },
    }
}

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Cấu hình file tĩnh và Media (Ảnh hoa)
STATIC_URL = 'static/'
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# 3. THÊM DÒNG NÀY XUỐNG CUỐI FILE ĐỂ CHO PHÉP REACT TRUY CẬP
CORS_ALLOW_ALL_ORIGINS = True

# --- CẤU HÌNH GỬI EMAIL SMTP ---
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
# Thay đổi email và mật khẩu ứng dụng (App Password) của bạn ở đây:
EMAIL_HOST_USER = 'phamhohoanganhprbp@gmail.com'  
EMAIL_HOST_PASSWORD = ''  # BẠN PHẢI ĐIỀN MẬT KHẨU ỨNG DỤNG VÀO ĐÂY
DEFAULT_FROM_EMAIL = 'Flora Boutique <phamhohoanganhprbp@gmail.com>'

# --- CẤU HÌNH TWILIO SMS ---
TWILIO_ACCOUNT_SID = 'your_twilio_account_sid'
TWILIO_AUTH_TOKEN = 'your_twilio_auth_token'
TWILIO_PHONE_NUMBER = 'your_twilio_phone_number'