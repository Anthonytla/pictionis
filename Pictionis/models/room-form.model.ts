import { z } from "zod";

const roomFormModel = z.object({
    playerNumber: z.number(),
    countDown: z.number(),
    maxRound: z.number(),
});

export type RoomForm = z.infer<typeof roomFormModel>;

export default roomFormModel;