export declare global {
  namespace Express {
    interface Request {
      role: string;
      id: number; // You can define the type according to your needs
    }
  }
}
