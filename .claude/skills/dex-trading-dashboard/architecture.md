# System Architecture Reference

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (Next.js)                        │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│  │Dashboard │ │Bot Panel │ │Portfolio │ │ Alerts   │           │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘           │
│       └────────────┴────────────┴────────────┘                  │
│                           │                                      │
│                    WebSocket + REST                              │
└───────────────────────────┬─────────────────────────────────────┘
                            │
┌───────────────────────────┴─────────────────────────────────────┐
│                     API Gateway / Backend                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │ Auth Service│  │ Bot Manager │  │Alert Service│             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │Portfolio Svc│  │  AI Agent   │  │ WebSocket   │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
└───────────────────────────┬─────────────────────────────────────┘
                            │
┌───────────────────────────┴─────────────────────────────────────┐
│                      Data Layer                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │PostgreSQL│  │  Redis   │  │ Vector DB│  │ Queue    │        │
│  │(Primary) │  │ (Cache)  │  │(AI/RAG)  │  │(BullMQ)  │        │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │
└─────────────────────────────────────────────────────────────────┘
                            │
┌───────────────────────────┴─────────────────────────────────────┐
│                   External Integrations                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │DEX APIs  │  │ Trading  │  │Price Feed│  │Blockchain│        │
│  │(Uniswap, │  │  Bots    │  │(CoinGecko│  │  RPCs    │        │
│  │ Jupiter) │  │(Custom)  │  │Chainlink)│  │          │        │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagrams

### Bot Control Flow
```
User Action → Frontend → API → Bot Manager → Bot Instance
                                    ↓
                              Status Update
                                    ↓
                    WebSocket ← Event Queue ← Bot Response
                        ↓
                   Frontend Update
```

### Alert System Flow
```
Price/Event Source → Alert Engine → Condition Check
                                          ↓
                                    [Match Found]
                                          ↓
                    Notification Service → Multi-Channel Delivery
                                               ├── Push
                                               ├── Email
                                               ├── Telegram
                                               └── Discord
```

### AI Agent Flow
```
User Query → AI Service → Context Retrieval (Vector DB)
                               ↓
                    LLM Processing (Claude/GPT)
                               ↓
                    Tool Execution (if needed)
                               ↓
                    Response Generation
                               ↓
                    Frontend Display
```

## Database Schema Overview

### Core Tables
- `users` - User accounts and preferences
- `wallets` - Connected wallet addresses
- `bots` - Bot configurations and metadata
- `bot_instances` - Running bot instances
- `trades` - Trade history from bots
- `portfolios` - Portfolio snapshots
- `alerts` - Alert configurations
- `alert_history` - Triggered alert logs
- `ai_conversations` - AI chat history

### Key Relationships
```
users 1──N wallets
users 1──N bots
bots 1──N bot_instances
bot_instances 1──N trades
users 1──N portfolios
users 1──N alerts
alerts 1──N alert_history
users 1──N ai_conversations
```

## API Endpoint Structure

### REST Endpoints
```
/api/v1/
├── auth/
│   ├── POST /login
│   ├── POST /register
│   └── POST /refresh
├── bots/
│   ├── GET /              # List all bots
│   ├── POST /             # Create bot
│   ├── GET /:id           # Get bot details
│   ├── PATCH /:id         # Update bot config
│   ├── DELETE /:id        # Delete bot
│   ├── POST /:id/start    # Start bot
│   ├── POST /:id/stop     # Stop bot
│   └── GET /:id/stats     # Bot statistics
├── portfolio/
│   ├── GET /overview      # Portfolio summary
│   ├── GET /assets        # Asset breakdown
│   ├── GET /history       # Historical data
│   └── GET /performance   # Performance metrics
├── alerts/
│   ├── GET /              # List alerts
│   ├── POST /             # Create alert
│   ├── PATCH /:id         # Update alert
│   ├── DELETE /:id        # Delete alert
│   └── GET /history       # Alert history
└── ai/
    ├── POST /chat         # AI conversation
    ├── POST /analyze      # Portfolio analysis
    └── GET /suggestions   # Get recommendations
```

### WebSocket Events
```
Client → Server:
- subscribe:bot:{id}
- subscribe:portfolio
- subscribe:alerts
- unsubscribe:{channel}

Server → Client:
- bot:status:{id}
- bot:trade:{id}
- portfolio:update
- alert:triggered
- price:update
```

## Security Architecture

### Authentication Flow
```
1. User login with credentials/wallet
2. Server validates and issues JWT + Refresh Token
3. JWT stored in httpOnly cookie
4. Refresh token stored securely
5. API requests include JWT
6. Token refresh on expiry
```

### API Security Layers
1. Rate limiting (per user/IP)
2. JWT validation
3. Permission checks
4. Input validation
5. SQL injection prevention (ORM)
6. XSS protection (sanitization)

### Sensitive Data Handling
- Bot API keys: Encrypted at rest (AES-256)
- Wallet connections: Read-only by default
- User passwords: bcrypt hashed
- Audit logs: Immutable append-only
