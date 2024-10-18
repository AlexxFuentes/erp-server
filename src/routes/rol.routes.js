import { Router } from 'express'
import { auth } from '../middlewares/auth.middleware.js'
import * as rolController from '../controllers/rol.controller.js'

const router = Router()

router.get('/', auth, rolController.getRoles)

router.get('/:id', auth, rolController.getRoleById)

router.post('/', auth, rolController.createRole)

router.put('/:id', auth, rolController.updateRole)

router.delete('/:id', auth, rolController.deleteRole)

export default router
