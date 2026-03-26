import type { Request, Response, NextFunction } from 'express'

// DTO для создания задачи
export interface CreateTaskDto {
  title: string
  description?: string
  dueDate?: string
}

// DTO для обновления задачи
export interface UpdateTaskDto {
  title?: string
  description?: string
  dueDate?: string
  isCompleted?: boolean
}

// Валидация для создания задачи
export function validateCreateTask(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const errors: string[] = []

  const { title, description, dueDate } = req.body

  // Проверка title
  if (!title) {
    errors.push('Title is required')
  } else if (typeof title !== 'string') {
    errors.push('Title must be a string')
  } else if (title.trim().length === 0) {
    errors.push('Title cannot be empty')
  } else if (title.trim().length > 200) {
    errors.push('Title must be less than 200 characters')
  }

  // Проверка description
  if (description !== undefined && typeof description !== 'string') {
    errors.push('Description must be a string')
  }

  // Проверка dueDate
  if (dueDate !== undefined && dueDate !== null && dueDate !== '') {
    if (typeof dueDate !== 'string') {
      errors.push('Due date must be a string')
    } else {
      const date = new Date(dueDate)
      if (isNaN(date.getTime())) {
        errors.push('Due date must be a valid date')
      }
    }
  }

  if (errors.length > 0) {
    res.status(400).json({
      message: 'Validation failed',
      errors,
    })
    return
  }

  // Нормализуем данные
  req.body.title = title?.trim()
  req.body.description = description?.trim() || ''
  req.body.dueDate = dueDate || null

  next()
}

// Валидация для обновления задачи
export function validateUpdateTask(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const errors: string[] = []

  const { title, description, dueDate, isCompleted } = req.body

  // Проверка title (если передан)
  if (title !== undefined) {
    if (typeof title !== 'string') {
      errors.push('Title must be a string')
    } else if (title.trim().length === 0) {
      errors.push('Title cannot be empty')
    } else if (title.trim().length > 200) {
      errors.push('Title must be less than 200 characters')
    }
  }

  // Проверка description
  if (description !== undefined && typeof description !== 'string') {
    errors.push('Description must be a string')
  }

  // Проверка dueDate
  if (dueDate !== undefined && dueDate !== null && dueDate !== '') {
    if (typeof dueDate !== 'string') {
      errors.push('Due date must be a string')
    } else {
      const date = new Date(dueDate)
      if (isNaN(date.getTime())) {
        errors.push('Due date must be a valid date')
      }
    }
  }

  // Проверка isCompleted
  if (isCompleted !== undefined && typeof isCompleted !== 'boolean') {
    errors.push('IsCompleted must be a boolean')
  }

  if (errors.length > 0) {
    res.status(400).json({
      message: 'Validation failed',
      errors,
    })
    return
  }

  // Нормализуем данные
  if (title !== undefined) req.body.title = title.trim()
  if (description !== undefined) req.body.description = description.trim()

  next()
}
