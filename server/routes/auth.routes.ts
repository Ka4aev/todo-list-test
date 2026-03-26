import { Router } from 'express'
import { users } from '../data/db'
import { validateLogin } from '../validators/auth.validator'

const router = Router()

/**
 * POST /api/auth/login
 * Авторизация пользователя
 */
router.post('/login', validateLogin, (req, res) => {
  const { email, password } = req.body

  // Ищем пользователя
  const user = users.find(u => u.email === email && u.password === password)

  if (!user) {
    res.status(401).json({
      message: 'Invalid email or password',
    })
    return
  }

  // Возвращаем токен (в реальном приложении здесь был бы JWT)
  const token = user.id

  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  })
})

export default router
