# Code Patterns & Examples

## Component Patterns

### Dashboard Widget Pattern
```typescript
// components/dashboard/widgets/BaseWidget.tsx
interface WidgetProps {
  title: string;
  isLoading?: boolean;
  error?: Error | null;
  onRefresh?: () => void;
  children: React.ReactNode;
}

export function BaseWidget({
  title,
  isLoading,
  error,
  onRefresh,
  children
}: WidgetProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        {onRefresh && (
          <Button variant="ghost" size="sm" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? <WidgetSkeleton /> : error ? <WidgetError error={error} /> : children}
      </CardContent>
    </Card>
  );
}
```

### Bot Status Component Pattern
```typescript
// components/bots/BotStatusBadge.tsx
type BotStatus = 'running' | 'stopped' | 'error' | 'syncing';

const statusConfig: Record<BotStatus, { label: string; variant: string; icon: LucideIcon }> = {
  running: { label: 'Running', variant: 'success', icon: PlayCircle },
  stopped: { label: 'Stopped', variant: 'secondary', icon: StopCircle },
  error: { label: 'Error', variant: 'destructive', icon: AlertCircle },
  syncing: { label: 'Syncing', variant: 'warning', icon: RefreshCw },
};

export function BotStatusBadge({ status }: { status: BotStatus }) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge variant={config.variant}>
      <Icon className="mr-1 h-3 w-3" />
      {config.label}
    </Badge>
  );
}
```

## Hook Patterns

### Real-time Data Hook
```typescript
// lib/hooks/useRealtimeData.ts
export function useRealtimeData<T>(
  channel: string,
  initialData: T
): { data: T; isConnected: boolean } {
  const [data, setData] = useState<T>(initialData);
  const [isConnected, setIsConnected] = useState(false);
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.emit(`subscribe:${channel}`);
    setIsConnected(true);

    socket.on(`${channel}:update`, (newData: T) => {
      setData(newData);
    });

    return () => {
      socket.emit(`unsubscribe:${channel}`);
      socket.off(`${channel}:update`);
    };
  }, [socket, channel]);

  return { data, isConnected };
}
```

### Bot Control Hook
```typescript
// lib/hooks/useBotControl.ts
export function useBotControl(botId: string) {
  const queryClient = useQueryClient();

  const startBot = useMutation({
    mutationFn: () => api.post(`/bots/${botId}/start`),
    onSuccess: () => {
      queryClient.invalidateQueries(['bot', botId]);
      toast.success('Bot started successfully');
    },
    onError: (error) => {
      toast.error(`Failed to start bot: ${error.message}`);
    },
  });

  const stopBot = useMutation({
    mutationFn: () => api.post(`/bots/${botId}/stop`),
    onSuccess: () => {
      queryClient.invalidateQueries(['bot', botId]);
      toast.success('Bot stopped successfully');
    },
  });

  return {
    startBot: startBot.mutate,
    stopBot: stopBot.mutate,
    isStarting: startBot.isPending,
    isStopping: stopBot.isPending,
  };
}
```

## Service Patterns

### Bot Adapter Interface
```typescript
// services/bot-manager/adapters/types.ts
export interface BotAdapter {
  id: string;
  name: string;

  // Lifecycle
  initialize(config: BotConfig): Promise<void>;
  start(): Promise<void>;
  stop(): Promise<void>;

  // Status
  getStatus(): Promise<BotStatus>;
  getStats(): Promise<BotStats>;

  // Events
  onTrade(callback: (trade: Trade) => void): void;
  onError(callback: (error: Error) => void): void;
  onStatusChange(callback: (status: BotStatus) => void): void;
}

// Example implementation
export class GridBotAdapter implements BotAdapter {
  // ... implementation
}
```

### Alert Handler Pattern
```typescript
// services/alerts/handlers/PriceAlertHandler.ts
export class PriceAlertHandler implements AlertHandler {
  constructor(
    private priceService: PriceService,
    private notificationService: NotificationService
  ) {}

  async check(alert: Alert): Promise<boolean> {
    const currentPrice = await this.priceService.getPrice(alert.asset);

    const triggered = this.evaluateCondition(
      currentPrice,
      alert.condition,
      alert.threshold
    );

    if (triggered) {
      await this.notificationService.send(alert.userId, {
        type: 'price_alert',
        title: `Price Alert: ${alert.asset}`,
        body: `${alert.asset} has ${alert.condition} ${alert.threshold}`,
        data: { alertId: alert.id, price: currentPrice },
      });
    }

    return triggered;
  }

  private evaluateCondition(
    price: number,
    condition: 'above' | 'below',
    threshold: number
  ): boolean {
    return condition === 'above' ? price >= threshold : price <= threshold;
  }
}
```

## API Patterns

### Controller Pattern
```typescript
// api/controllers/botController.ts
export const botController = {
  async list(req: Request, res: Response) {
    const userId = req.user.id;
    const bots = await botService.listByUser(userId);
    return res.json({ success: true, data: bots });
  },

  async start(req: Request, res: Response) {
    const { id } = req.params;
    const userId = req.user.id;

    // Verify ownership
    const bot = await botService.getById(id);
    if (bot.userId !== userId) {
      throw new ForbiddenError('Not authorized to control this bot');
    }

    await botManager.start(id);
    return res.json({ success: true, message: 'Bot started' });
  },
};
```

### Error Handling Pattern
```typescript
// lib/errors.ts
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 404, 'NOT_FOUND');
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, 'VALIDATION_ERROR');
  }
}

// Middleware
export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: { message: err.message, code: err.code },
    });
  }

  console.error('Unhandled error:', err);
  return res.status(500).json({
    success: false,
    error: { message: 'Internal server error', code: 'INTERNAL_ERROR' },
  });
}
```

## Database Patterns

### Repository Pattern
```typescript
// repositories/botRepository.ts
export const botRepository = {
  async findById(id: string) {
    return prisma.bot.findUnique({
      where: { id },
      include: { instances: true, trades: { take: 10, orderBy: { createdAt: 'desc' } } },
    });
  },

  async findByUser(userId: string) {
    return prisma.bot.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  },

  async create(data: CreateBotInput) {
    return prisma.bot.create({ data });
  },

  async updateStatus(id: string, status: BotStatus) {
    return prisma.bot.update({
      where: { id },
      data: { status, lastStatusChange: new Date() },
    });
  },
};
```

## Testing Patterns

### Component Test
```typescript
// __tests__/components/BotCard.test.tsx
describe('BotCard', () => {
  it('displays bot status correctly', () => {
    render(<BotCard bot={mockBot} />);
    expect(screen.getByText('Running')).toBeInTheDocument();
  });

  it('calls onStart when start button clicked', async () => {
    const onStart = vi.fn();
    render(<BotCard bot={{ ...mockBot, status: 'stopped' }} onStart={onStart} />);

    await userEvent.click(screen.getByRole('button', { name: /start/i }));
    expect(onStart).toHaveBeenCalledWith(mockBot.id);
  });
});
```

### API Integration Test
```typescript
// __tests__/api/bots.test.ts
describe('POST /api/v1/bots/:id/start', () => {
  it('starts a bot successfully', async () => {
    const response = await request(app)
      .post(`/api/v1/bots/${testBot.id}/start`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it('returns 403 for unauthorized user', async () => {
    const response = await request(app)
      .post(`/api/v1/bots/${testBot.id}/start`)
      .set('Authorization', `Bearer ${otherUserToken}`);

    expect(response.status).toBe(403);
  });
});
```
