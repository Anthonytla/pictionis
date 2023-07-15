import { z } from "zod";

const loginFormModel = z.object({
  email: z.string().email(),
  password: z.string().min(3).max(20),
});

export type LoginForm = z.infer<typeof loginFormModel>;

export default loginFormModel;
