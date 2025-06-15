# Stock Recommendation API

A production-ready Node.js API for stock market recommendations with Firebase authentication and PostgreSQL database.

## Features

- 🔐 Firebase Authentication & Authorization
- 📊 Stock market data analysis
- 🛡️ Security hardened (Helmet, Rate limiting, Input validation)
- 📝 Comprehensive logging with Winston
- 🐳 Docker containerization
- 🔄 PM2 cluster mode support
- 📈 Health monitoring
- 🚀 Production optimizations

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 13+
- Firebase project setup
- Docker (optional)

### Installation

1. Clone repository:
   ```bash
   git clone <repository-url>
   cd stock-recommendation-api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Setup environment:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Setup database:
   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

5. Start application:
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   
   # PM2 Cluster
   npm run pm2:start
   ```

### Docker Deployment

```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f
```

## API Endpoints

### Authentication
- `POST /api/auth/sync` - Sync user with database
- `POST /api/auth/update-role` - Update user role (Admin only)
- `GET /api/auth/profile` - Get user profile

### Data
- `GET /api/data/n-50` - Get stock symbols
- `POST /api/data/sma` - Get SMA analysis
- `GET /api/data/sma/dates` - Get available SMA dates
- `POST /api/data/sma/by-date` - Get SMA by specific date
- `POST /api/data/sma/custom` - Get custom SMA analysis

### System
- `GET /health` - Health check endpoint

## Production Deployment

### Environment Variables

Ensure all required environment variables are set:
- `NODE_ENV=production`
- `DATABASE_URL` - PostgreSQL connection string
- `FIREBASE_SERVICE_ACCOUNT_PATH` - Path to Firebase service account
- `CORS_ORIGIN` - Allowed origins (comma-separated)
- `FLASK_URL` - Analytics service URL

### Security Considerations

1. **Environment Variables**: Never commit sensitive data
2. **Firebase Service Account**: Store securely, restrict permissions
3. **Database**: Use connection pooling, enable SSL
4. **CORS**: Restrict to specific domains
5. **Rate Limiting**: Configured per endpoint type
6. **Input Validation**: All inputs validated with Joi
7. **Error Handling**: No sensitive data in error responses

### Monitoring

- Application logs: `./logs/`
- Health check: `GET /health`
- PM2 monitoring: `npm run pm2:logs`
- Docker logs: `docker-compose logs`

### Performance Optimizations

- Connection pooling (Prisma)
- Response compression (gzip)
- In-memory caching for frequent queries
- Request/response logging
- Cluster mode with PM2
- Docker multi-stage build

## Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format
```

## License

MIT License