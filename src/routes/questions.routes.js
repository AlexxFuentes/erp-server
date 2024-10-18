import { Router } from 'express'
import { auth } from '../middlewares/auth.middleware.js'
import * as questionsController from '../controllers/auth/questions.controller.js'

const router = Router()

router.get('/:user', auth, questionsController.getQuestionsByUser)

router.post('/', auth, questionsController.createQuestion)

router.put('/:id', auth, questionsController.updateQuestion)

router.delete('/:id', auth, questionsController.deleteQuestion)

router.get('/validateanswers/:user', questionsController.validateQuestions)

export default router