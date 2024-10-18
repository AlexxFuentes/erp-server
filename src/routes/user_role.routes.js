import { Router } from 'express'
import { auth } from '../middlewares/auth.middleware.js'
import * as UserRoleController from '../controllers/config/user_role.controller.js'

const router = Router()

router.get('/:userId', auth, UserRoleController.getUserRoles)

router.post('/:userId', auth, UserRoleController.addUserRole)

router.delete('/:userId/:roleId', auth, UserRoleController.removeUserRole)