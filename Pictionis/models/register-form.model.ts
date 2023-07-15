import { z } from "zod";

const registerFormModel = z.object({
  email: z.string().email(),
  password: z.string().min(3).max(20),
  username: z.string().min(1).max(20),
});

export type RegisterForm = z.infer<typeof registerFormModel>;

export default registerFormModel;
