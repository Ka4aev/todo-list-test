import type { Request, Response, NextFunction } from 'express'

// DTO для логина
export interface LoginDto {
  email: string
  password: string
}

// Валидация для логина
export function validateLogin(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const errors: string[] = []

  const { email, password } = req.body

  // Проверка email
  if (!email) {
    errors.push('Email is required')
  } else if (typeof email !== 'string') {
    errors.push('Email must be a string')
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Email must be a valid email address')
  }

  // Проверка password
  if (!password) {
    errors.push('Password is required')
  } else if (typeof password !== 'string') {
    errors.push('Password must be a string')
  } else if (password.length < 6) {
    errors.push('Password must be at least 6 characters')
  }

  if (errors.length > 0) {
    res.status(400).json({
      message: 'Validation failed',
      errors,
    })
    return
  }

  next()
}
