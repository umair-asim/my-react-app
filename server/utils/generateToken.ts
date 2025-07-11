import jwt from 'jsonwebtoken';

interface UserTokenPayload {
  id: number;
  email: string;
  name: string;
  public_id: string;
}

export default function generateToken(user: UserTokenPayload): string {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name, public_id: user.public_id },
    process.env.JWT_SECRET as string,
    { expiresIn: '7d' }
  );
}
