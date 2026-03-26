import { Router } from 'express'
import { tasks, users } from '../data/db'
import { authMiddleware } from '../middleware/auth'
import { validateCreateTask, validateUpdateTask } from '../validators/task.validator'

const router = Router()

// Все маршруты задач требуют авторизации
router.use(authMiddleware)

/**
 * GET /api/tasks
 * Получить список всех задач с фильтрацией и сортировкой
 * Query params: filter (all|active|completed|overdue), sort (dueDate|createdAt|status)
 */
router.get('/', (req, res) => {
  try {
    const { filter, sort } = req.query
    let result = [...tasks]

    const now = new Date().toISOString().split('T')[0]

    // Фильтрация
    if (filter === 'active') {
      result = result.filter(t => !t.isCompleted)
    } else if (filter === 'completed') {
      result = result.filter(t => t.isCompleted)
    } else if (filter === 'overdue') {
      result = result.filter(t => !t.isCompleted && t.dueDate && t.dueDate < now)
    }

    // Сортировка
    if (sort === 'dueDate') {
      result.sort((a, b) => {
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      })
    } else if (sort === 'createdAt') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    } else if (sort === 'status') {
      result.sort((a, b) => Number(a.isCompleted) - Number(b.isCompleted))
    }

    res.json({
      data: result,
      meta: {
        total: result.length,
        filter,
        sort,
      },
    })
  } catch (error) {
    res.status(500).json({
      message: 'Internal server error',
    })
  }
})

/**
 * POST /api/tasks
 * Создать новую задачу
 */
router.post('/', validateCreateTask, (req, res) => {
  try {
    const { title, description, dueDate } = req.body
    const userId = req.user!.id

    const newTask = {
      id: crypto.randomUUID(),
      title,
      description: description || '',
      dueDate: dueDate || null,
      isCompleted: false,
      ownerId: userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    tasks.push(newTask)

    res.status(201).json(newTask)
  } catch (error) {
    res.status(500).json({
      message: 'Internal server error',
    })
  }
})

/**
 * PUT /api/tasks/:id
 * Обновить задачу
 */
router.put('/:id', validateUpdateTask, (req, res) => {
  try {
    const { id } = req.params
    const { title, description, dueDate, isCompleted } = req.body
    const currentUser = req.user!

    const taskIndex = tasks.findIndex(t => t.id === id)

    if (taskIndex === -1) {
      res.status(404).json({
        message: 'Task not found',
      })
      return
    }

    const task = tasks[taskIndex]

    // Проверка прав: владелец или админ
    if (task.ownerId !== currentUser.id && currentUser.role !== 'admin') {
      res.status(403).json({
        message: 'Forbidden: You can only edit your own tasks',
      })
      return
    }

    // Обновляем поля
    tasks[taskIndex] = {
      ...task,
      title: title !== undefined ? title : task.title,
      description: description !== undefined ? description : task.description,
      dueDate: dueDate !== undefined ? dueDate : task.dueDate,
      isCompleted: isCompleted !== undefined ? isCompleted : task.isCompleted,
      updatedAt: new Date().toISOString(),
    }

    res.json(tasks[taskIndex])
  } catch (error) {
    res.status(500).json({
      message: 'Internal server error',
    })
  }
})

/**
 * DELETE /api/tasks/:id
 * Удалить задачу
 */
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params
    const currentUser = req.user!

    const taskIndex = tasks.findIndex(t => t.id === id)

    if (taskIndex === -1) {
      res.status(404).json({
        message: 'Task not found',
      })
      return
    }

    const task = tasks[taskIndex]

    // Проверка прав: владелец или админ
    if (task.ownerId !== currentUser.id && currentUser.role !== 'admin') {
      res.status(403).json({
        message: 'Forbidden: You can only delete your own tasks',
      })
      return
    }

    tasks.splice(taskIndex, 1)

    res.status(204).send()
  } catch (error) {
    res.status(500).json({
      message: 'Internal server error',
    })
  }
})

export default router
