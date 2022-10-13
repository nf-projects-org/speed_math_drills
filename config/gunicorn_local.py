"""Gunicorn config file"""
# Django WSGI application path in pattern MODULE_NAME:VARIABLE_NAME

wsgi_app = "speedmathsdrills.wsgi:application"

loglevel = "info"

workers =2

bind = "0.0.0.0:8000"

reload = True

accesslog = "/var/log/gunicorn/speedmathsdrills.com.log"
errorlog = "/var/log/gunicorn/speedmathsdrills.com.log"


capture_output = True

pidfile = "./gunicorn.pid"

daemon = False
