import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export async function PUT(req, res) {
  const { email, password } = await req.json();
  //console.log(req.body)

  // Verificar las credenciales del usuario (esto es solo un ejemplo)
  if (email === 'user@example.com' && password === 'password') {
    const token = jwt.sign({ email }, 'your-secret-key', { expiresIn: '1h' },{status: 200});
    return NextResponse.json({ token });
  } else {
    return NextResponse.json({ message: 'Credenciales inválidas' },{status: 400});
  }

  
}