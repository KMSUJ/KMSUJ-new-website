"""
Django settings for kmsuj_website project.

Generated by 'django-admin startproject' using Django 3.2.9.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/3.2/ref/settings/
"""
import os
from pathlib import Path
import sys

def _get_secret():
    SECRET_PATH = Path("/secret")
    if not SECRET_PATH.exists():
        print("WARNING, using unsecure key!", file=sys.stderr)
        return 'django-insecure-a(^dwp%kd9m__b&$borsh##d8ghhi^t=&yj5g_!y4s+gg(cn_6'
    with open(SECRET_PATH, 'r') as secret_file:
        return secret_file.read().strip()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = _get_secret()

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

# Allow only local users to communicate with django
# Really just nginx needs to talk to this bad boy
ALLOWED_HOSTS = [
    "localhost",
    "127.0.0.1",
]

LOGGING_ROOT = os.environ['DJANGO_LOGGING_ROOT']

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'level': 'WARNING',
        },
        'file': {
            'class': 'logging.handlers.RotatingFileHandler',
            'level': 'INFO',
            'filename': os.path.join(LOGGING_ROOT, "info.log"),
            'maxBytes': 8 * 1024 * 1024,
            'backupCount': 8,
        },
    },
    'root': {
        'handlers': ['file', 'console'],
    },
}


# Application definition

INSTALLED_APPS = [
    'kmsuj_website',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'tinymce',
    'crispy_forms',
    'django_bleach',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'kmsuj_website.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': ['templates'],
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

WSGI_APPLICATION = 'kmsuj_website.wsgi.application'


# Database
# https://docs.djangoproject.com/en/3.2/ref/settings/#databases

DATABASE_ROOT = os.environ["DATABASE_ROOT_DIR"]

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(DATABASE_ROOT, 'db.sqlite3'),
    }
}

# Password validation
# https://docs.djangoproject.com/en/3.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/3.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.1/howto/static-files/
STATICFILES_DIRS = (
    # Put strings here, like "/home/html/static" or "C:/www/django/static".
    # Always use forward slashes, even on Windows.
    # Don't forget to use absolute paths, not relative paths.
    os.path.join(BASE_DIR, 'static'),
)

# https://docs.djangoproject.com/en/3.2/howto/static-files/

STATIC_URL = '/kmsuj-page/'

STATIC_ROOT = '/static/static'

# Default primary key field type
# https://docs.djangoproject.com/en/3.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


CRISPY_TEMPLATE_PACK = 'bootstrap4'


# Which HTML tags are allowed
BLEACH_ALLOWED_TAGS = [
    'p', 'b', 'i', 'u', 'em', 'strong', 'a', 'pre', 'div', 'strong', 'sup', 'sub', 'ol', 'ul', 'li', 'address',
    'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'code', 'table', 'tbody', 'tr', 'td', 'hr', 'img',
    'br', 'iframe',
]

# Which HTML attributes are allowed
BLEACH_ALLOWED_ATTRIBUTES = [
    'href', 'title', 'style', 'alt', 'src', 'dir', 'class', 'border', 'cellpadding', 'cellspacing', 'id',
    'name', 'align', 'width', 'height', 'target', 'rel',
]

# Which CSS properties are allowed in 'style' attributes (assuming
# style is an allowed attribute)
BLEACH_ALLOWED_STYLES = [
    'font-family', 'font-weight', 'text-decoration', 'font-variant', 'float',
    'height', 'width', 'min-height', 'min-width', 'max-height', 'max-width',
    'margin', 'margin-top', 'margin-bottom', 'margin-right', 'margin-left',
    'padding', 'padding-top', 'padding-bottom', 'padding-left', 'padding-right',
    'text-align', 'title', 'page-break-after', 'display', 'color', 'background-color',
    'font-size', 'line-height', 'border-collapse', 'border-spacing', 'empty-cells', 'border',
    'list-style-type', 'vertical-align',
]

# Strip unknown tags if True, replace with HTML escaped characters if
# False
BLEACH_STRIP_TAGS = True

# Strip comments, or leave them in.
BLEACH_STRIP_COMMENTS = False

MEDIA_URL = '/media/'

TINYMCE_DEFAULT_CONFIG = {
    'height': 360,
    'width': 1120,
    'cleanup_on_startup': True,
    'custom_undo_redo_levels': 20,
    'selector': 'textarea',
    'theme': 'modern',
    'plugins': '''
            textcolor save link image media preview codesample contextmenu
            table code lists fullscreen  insertdatetime  nonbreaking
            contextmenu directionality searchreplace wordcount visualblocks
            visualchars code fullscreen autolink lists  charmap print  hr
            anchor pagebreak
            ''',
    'toolbar1': '''
            fullscreen preview bold italic underline | fontselect,
            fontsizeselect  | forecolor backcolor | alignleft alignright |
            aligncenter alignjustify | indent outdent | bullist numlist table |
            | link image media | codesample |
            ''',
    'toolbar2': '''
            visualblocks visualchars |
            charmap hr pagebreak nonbreaking anchor |  code |
            ''',
    'contextmenu': 'formats | link image',
    'menubar': True,
    'statusbar': True,
    'valid_elements': '@[%s],%s' % ('|'.join(BLEACH_ALLOWED_ATTRIBUTES), ','.join(BLEACH_ALLOWED_TAGS)),
    'valid_styles': {'*': ','.join(BLEACH_ALLOWED_STYLES)},
}
TINYMCE_DEFAULT_CONFIG_WITH_IMAGES = {  # Additional settings for editors where image upload is allowed
    'plugins': 'preview paste searchreplace autolink code visualblocks visualchars image link media codesample table charmap hr nonbreaking anchor toc advlist lists wordcount imagetools textpattern quickbars emoticons autosave',
    'toolbar': 'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent | numlist bullist | image media link codesample',
    'paste_data_images': True,
    'file_picker_types': 'image',
    'file_picker_callback': 'tinymce_local_file_picker',
}

from kmsuj_website.generated_settings import *
