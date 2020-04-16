import { Request, Response } from 'express';
import { createUser } from './services/CreateUser';

export function helloWorld(request: Request, response: Response) {
  const user = createUser({
    email: 'bruno@email.com',
    password: '1234',
    techs: ['Node.js', 'React Native', { title: 'React Native', experience: 1000 }]
  });

  return response.json({ message: 'Hello' });
}