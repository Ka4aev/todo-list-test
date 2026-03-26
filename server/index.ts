import express from 'express'
import cors from 'cors'
import type { Request, Response, NextFunction } from 'express'
import authRoutes from './routes/auth.routes'
import taskRoutes from './routes/tasks.routes'

const app = express()
const PORT = process.env.PORT || 3001

// CORS настройка для работы с фронтендом на Nuxt (порт 3000)
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

// Парсинг JSON
app.use(express.json())

// Парсинг URL-encoded данных
app.use(express.urlencoded({ extended: true }))

// Middleware для логирования запросов (в development)
if (process.env.NODE_ENV !== 'production') {
  app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`)
    next()
  })
}

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// API маршруты
app.use('/api/auth', authRoutes)
app.use('/api/tasks', taskRoutes)

// Обработка 404
app.use((req: Request, res: Response) => {
  res.status(404).json({
    message: 'Not found',
    path: req.path,
  })
})

// Глобальный обработчик ошибок
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err)

  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  })
})

// Запуск сервера
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════╗
║  Todo List API Server                          ║
║  Running on: http://localhost:${PORT}           ║
║  Environment: ${process.env.NODE_ENV || 'development'}                          ║
╠════════════════════════════════════════════════╣
║  Endpoints:                                    ║
║  POST   /api/auth/login                        ║
║  GET    /api/tasks                             ║
║  POST   /api/tasks                             ║
║  PUT    /api/tasks/:id                         ║
║  DELETE /api/tasks/:id                         ║
╚════════════════════════════════════════════════╝
  `)
})

export default app
