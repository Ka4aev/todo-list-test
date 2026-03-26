import type { Request, Response, NextFunction } from 'express'
import { users } from '../data/db'

// Расширяем интерфейс Request для добавления пользователя
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string
        email: string
        role: 'admin' | 'user'
      }
    }
  }
}

// Middleware для проверки авторизации
export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Unauthorized: No token provided' })
    return
  }

  const token = authHeader.replace('Bearer ', '')
  const userId = token // В нашем случае токен = ID пользователя

  const user = users.find(u => u.id === userId)

  if (!user) {
    res.status(401).json({ message: 'Unauthorized: Invalid token' })
    return
  }

  // Добавляем пользователя в request
  req.user = {
    id: user.id,
    email: user.email,
    role: user.role,
  }

  next()
}
