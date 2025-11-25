---
name: dex-trading-dashboard
description: |
  Use this skill when working on the Dex Trading Dashboard web application.

  English Triggers: DEX trading, trading bot, portfolio tracking, dashboard development,
  bot monitoring, trading alerts, investment portfolio, crypto dashboard,
  bot control panel, trading analytics, AI trading agent, start bot, stop bot,
  wallet tracking, DeFi positions, P&L tracking, performance chart

  Thai Triggers (ภาษาไทย):
  - บอทเทรด, บอทซื้อขาย, ระบบบอท, จัดการบอท, เปิดบอท, ปิดบอท, สถานะบอท
  - แดชบอร์ด, หน้าจอหลัก, ภาพรวม, กราฟ, ชาร์ต
  - พอร์ตการลงทุน, พอร์ตโฟลิโอ, ติดตามพอร์ต, มูลค่าพอร์ต
  - แจ้งเตือน, ระบบแจ้งเตือน, ตั้งค่าแจ้งเตือน, การแจ้งเตือนราคา
  - กำไรขาดทุน, P&L, ผลตอบแทน, ประสิทธิภาพ
  - กระเป๋าเงิน, วอลเล็ท, เชื่อมต่อกระเป๋า
  - AI วิเคราะห์, ระบบ AI, ถาม AI, แชทบอท
  - DeFi, สภาพคล่อง, LP, Staking, Farming
  - คริปโต, เหรียญ, โทเคน, บล็อกเชน
  - พัฒนาเว็บ, สร้างหน้า, เพิ่มฟีเจอร์, แก้บัก
---

# Dex Trading Dashboard Development Skill

## Project Overview

A comprehensive web application for monitoring and managing DEX (Decentralized Exchange) trading bots and investment portfolios in a single unified dashboard.

## Core Features

### 1. Dashboard & Visualization
- Real-time portfolio overview with charts and graphs
- P&L tracking (daily, weekly, monthly, all-time)
- Asset allocation visualization
- Trading history and performance metrics
- Multi-chain support display

### 2. Bot Management
- Start/Stop/Pause bot controls
- Bot status indicators (running, stopped, error, syncing)
- Configuration management per bot
- Multiple bot instances support
- Health monitoring and uptime tracking

### 3. AI Agent Integration
- Portfolio analysis and recommendations
- Risk assessment and alerts
- Market sentiment analysis
- Strategy optimization suggestions
- Natural language query interface

### 4. Alert System
- Price alerts (threshold-based)
- Bot status change notifications
- P&L alerts (profit targets, stop-loss)
- System health alerts
- Multi-channel delivery (push, email, Telegram, Discord)

### 5. Portfolio Tracking
- Multi-wallet aggregation
- Cross-chain portfolio view
- DeFi positions tracking (LP, staking, farming)
- Historical performance analytics
- Import/Export capabilities

## Tech Stack Recommendations

### Frontend
- **Framework**: Next.js 14+ (App Router) or React + Vite
- **UI Library**: shadcn/ui + Tailwind CSS
- **Charts**: Recharts, TradingView Lightweight Charts, or Apache ECharts
- **State Management**: Zustand or TanStack Query
- **Real-time**: Socket.io or WebSocket

### Backend
- **Runtime**: Node.js with Express/Fastify or Bun
- **API**: REST + WebSocket for real-time updates
- **Database**: PostgreSQL (main) + Redis (cache/sessions)
- **Queue**: Bull/BullMQ for background jobs
- **ORM**: Prisma or Drizzle

### AI/Agent
- **LLM Integration**: OpenAI API, Anthropic Claude, or local models
- **Agent Framework**: LangChain, AutoGPT patterns, or custom
- **Vector DB**: Pinecone, Qdrant, or pgvector for context

### Infrastructure
- **Deployment**: Vercel, Railway, or self-hosted Docker
- **Monitoring**: Prometheus + Grafana
- **Logging**: Winston/Pino + Loki

## Development Guidelines

### Code Standards
- TypeScript strict mode enabled
- ESLint + Prettier for formatting
- Conventional commits for git history
- Component-based architecture
- API versioning (v1, v2, etc.)

### Security Considerations
- Never store private keys in database
- Use encrypted environment variables
- Implement rate limiting
- JWT/Session-based authentication
- API key encryption at rest
- Audit logging for sensitive operations

### Performance Goals
- Dashboard load time < 2 seconds
- Real-time updates latency < 500ms
- Support 100+ concurrent users
- Mobile-responsive design

## File Structure Convention

```
src/
├── app/                    # Next.js app router pages
│   ├── dashboard/
│   ├── bots/
│   ├── portfolio/
│   ├── alerts/
│   └── settings/
├── components/
│   ├── ui/                 # Base UI components
│   ├── dashboard/          # Dashboard-specific
│   ├── bots/               # Bot management
│   ├── charts/             # Chart components
│   └── alerts/             # Alert components
├── lib/
│   ├── api/                # API clients
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Utility functions
│   └── ai/                 # AI agent logic
├── services/
│   ├── bot-manager/        # Bot control service
│   ├── portfolio/          # Portfolio aggregation
│   ├── alerts/             # Alert system
│   └── ai-agent/           # AI analysis service
├── types/                  # TypeScript types
└── config/                 # Configuration files
```

## When Developing

1. **Adding new features**: Follow the existing component structure
2. **API endpoints**: Use consistent REST conventions
3. **Database changes**: Create migrations with Prisma
4. **New bot integrations**: Implement the BotAdapter interface
5. **UI components**: Use shadcn/ui as base, customize as needed
6. **Charts**: Prefer Recharts for simple, TradingView for advanced

## Common Tasks

### Adding a New Bot Type
1. Create adapter in `services/bot-manager/adapters/`
2. Implement `BotAdapter` interface
3. Register in bot factory
4. Add UI controls in `components/bots/`

### Creating New Dashboard Widget
1. Create component in `components/dashboard/widgets/`
2. Add to widget registry
3. Implement data fetching hook
4. Add to dashboard layout config

### Setting Up New Alert Type
1. Define alert schema in `types/alerts.ts`
2. Create handler in `services/alerts/handlers/`
3. Add notification channel support
4. Create UI for alert configuration

## Testing Strategy

- Unit tests for utility functions
- Integration tests for API endpoints
- E2E tests for critical user flows
- Visual regression for dashboard components
