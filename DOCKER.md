# Docker Setup

Bu proje Docker ile containerize edilmiştir. Hem development hem production ortamları için kullanılabilir.

## Gereksinimler

- Docker 20.10+
- Docker Compose 2.0+

## Hızlı Başlangıç

### 1. Environment Variables

`.env` dosyası oluştur:

```bash
cp .env.example .env
```

**Önemli:** Production'da `JWT_SECRET`'i mutlaka değiştir!

### 2. Docker ile Çalıştırma

#### Tüm servisleri başlat (PostgreSQL + Next.js App)

```bash
docker-compose up -d
```

Bu komut:
- PostgreSQL veritabanını başlatır (port 5432)
- Next.js uygulamasını build eder ve başlatır (port 3000)
- Prisma migration'ları çalıştırır
- Seed data'yı yükler

#### Logları görüntüle

```bash
docker-compose logs -f app
```

#### Servisleri durdur

```bash
docker-compose down
```

#### Volume'ları temizle (veritabanı silinir!)

```bash
docker-compose down -v
```

### 3. Uygulamaya Erişim

- **Frontend:** http://localhost:3000
- **Database:** localhost:5432
- **Health Check:** http://localhost:3000/api/health

### 4. Default Login Credentials

Seed data ile oluşturulan admin hesabı:

```
Email: admin@example.com
Password: admin
```

## Development

### Sadece Database çalıştır (local development için)

```bash
docker-compose up db -d
```

Sonra local'de:

```bash
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev
```

## Production

Production için `docker-compose.yml` içindeki environment variables'ları güncelle:

```yaml
environment:
  DATABASE_URL: postgresql://user:pass@host:5432/db
  JWT_SECRET: your-real-production-secret-here
  NODE_ENV: production
```

## Troubleshooting

### Container başlamıyor

```bash
# Logları kontrol et
docker-compose logs app

# Container'ı yeniden build et
docker-compose up --build
```

### Database bağlantı hatası

```bash
# Database container'ın çalıştığından emin ol
docker-compose ps

# Database loglarını kontrol et
docker-compose logs db
```

### Migration hataları

```bash
# Container içinde migration'ı manuel çalıştır
docker-compose exec app npx prisma migrate deploy
```

### Seed data yüklenmedi

```bash
# Container içinde seed'i manuel çalıştır
docker-compose exec app npx prisma db seed
```

## Architecture

```
┌─────────────────┐
│   Browser       │
└────────┬────────┘
         │ :3000
         ▼
┌─────────────────┐
│   Next.js App   │
│   (Container)   │
└────────┬────────┘
         │ :5432
         ▼
┌─────────────────┐
│   PostgreSQL    │
│   (Container)   │
└─────────────────┘
```

## Commands Reference

| Komut | Açıklama |
|-------|----------|
| `docker-compose up -d` | Servisleri başlat (background) |
| `docker-compose down` | Servisleri durdur |
| `docker-compose logs -f app` | App loglarını izle |
| `docker-compose exec app sh` | App container'a shell ile bağlan |
| `docker-compose restart app` | App'i yeniden başlat |
| `docker-compose ps` | Çalışan container'ları listele |
