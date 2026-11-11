# AWS EC2 Deployment Guide

## 1. Instance Provisioning
1. Launch an Ubuntu 24.04 LTS `t3.medium` or `t3.small` instance on AWS EC2.
2. Configure Security Group:
   - Inbound: Port 22 (SSH - restricted to admin IP), Port 80 (HTTP), Port 443 (HTTPS).
   - Inbound Port 3306 (MySQL): Never open to the public internet; restrict to private VPC or localhost.

## 2. Server Configuration
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y python3-pip python3-venv nginx mysql-server git

# Secure MySQL Installation
sudo mysql_secure_installation
```

## 3. Database Setup (MySQL 8.x)
```sql
CREATE DATABASE financial_fraud_assistance_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'fraud_app_user'@'localhost' IDENTIFIED BY 'STRONG_PRODUCTION_PASSWORD';
GRANT ALL PRIVILEGES ON financial_fraud_assistance_db.* TO 'fraud_app_user'@'localhost';
FLUSH PRIVILEGES;
```

## 4. Backend Setup
```bash
git clone <repo-url> /var/www/fraud-assistance
cd /var/www/fraud-assistance/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with production secrets, DB credentials, DEBUG=False, ALLOWED_HOSTS
python manage.py migrate
python manage.py seed_demo_data
python manage.py collectstatic --noinput
```

## 5. Systemd Gunicorn Service (`/etc/systemd/system/fraudassist.service`)
```ini
[Unit]
Description=Gunicorn daemon for FraudAssist API
After=network.target

[Service]
User=ubuntu
Group=www-data
WorkingDirectory=/var/www/fraud-assistance/backend
ExecStart=/var/www/fraud-assistance/backend/venv/bin/gunicorn --workers 3 --bind 127.0.0.1:8000 config.wsgi:application

[Install]
WantedBy=multi-user.target
```

## 6. Frontend Build & Nginx Reverse Proxy
```bash
cd /var/www/fraud-assistance/frontend
npm install
npm run build
sudo cp -r dist/* /var/www/html/
```

### Nginx Configuration (`/etc/nginx/sites-available/fraudassist`)
```nginx
server {
    listen 80;
    server_name your-domain.in www.your-domain.in;

    # Frontend SPA
    location / {
        root /var/www/html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API & Docs
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Static Assets
    location /static/ {
        alias /var/www/fraud-assistance/backend/staticfiles/;
    }
}
```

Enable SSL via Certbot:
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.in -d www.your-domain.in
```
