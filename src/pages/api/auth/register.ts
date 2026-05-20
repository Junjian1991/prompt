import type { NextApiRequest, NextApiResponse } from 'next';
import { createUser } from '@/utils/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: '请填写所有字段' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: '密码长度至少为6位' });
  }

  const user = await createUser(name, email, password);

  if (!user) {
    return res.status(400).json({ message: '该邮箱已被注册' });
  }

  res.status(201).json({ message: '注册成功' });
}
