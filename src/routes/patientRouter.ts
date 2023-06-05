import express, { Request, Response } from 'express';
import { validationResult, body } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { readData, writeData, Patient } from '../utils/fileUtils.js';

const router = express.Router();
const salt = 10;
const secretKey = 'your-secret-key';

router.get('/', (req: Request, res: Response) => {
  const data = readData();
  res.json(data);
});

router.get('/patients', (req: Request, res: Response) => {
  const data = readData();
  res.json(data.patients);
});

router.get('/patients/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const data = readData();
  const patient = data.patients.find((patient) => patient.id === id);
  res.json(patient);
});

router.post(
  '/patients',
  [
    body('name').notEmpty(),
    body('age').isInt({ min: 2 }),
    body('gender').notEmpty(),
    body('email').isEmail(),
    body('phone').matches(/^\+49 \d+$/),
    body('hairLossStage').notEmpty(),
    body('beforeImage').notEmpty(),
    body('afterImage').optional().notEmpty(),
    body('comments').optional().notEmpty(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at leest 6 characters long.'),
  ],
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      age,
      gender,
      email,
      phone,
      hairLossStage,
      beforeImage,
      afterImage,
      comments,
      password,
      registerCode,
    } = req.body;

    const hashedPassword = bcrypt.hashSync(password, salt);
    const hashedRegisterCode = bcrypt.hashSync(registerCode, salt);

    const newPatient: Patient = {
      id: uuidv4(),
      name,
      age,
      gender,
      email,
      phone,
      hairLossStage,
      beforeImage,
      afterImage,
      comments,
      password: hashedPassword,
      registerCode: hashedRegisterCode,
    };

    const data = readData();
    data.patients.push(newPatient);

    writeData(data);

    const token = jwt.sign({ id: newPatient.id }, secretKey);

    res.status(201).json({ patient: newPatient, token });
  }
);

export default router;