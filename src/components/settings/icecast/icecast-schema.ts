
import * as z from "zod";

export const icecastSettingsSchema = z.object({
  hostname: z.string().min(1, "Hostname is required"),
  port: z.coerce.number().int().min(0).max(65535),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  sourcePassword: z.string().min(1, "Source password is required"),
  mountPoint: z.string().min(1, "Mount point is required"),
  enableStats: z.boolean().default(true),
  connectionType: z.enum(["direct", "cors-proxy"]).default("direct"),
  useHttps: z.boolean().default(false),
});

export type IcecastSettings = z.infer<typeof icecastSettingsSchema>;

export const defaultIcecastSettings: IcecastSettings = {
  hostname: "s7.yesstreaming.net",
  port: 8042,
  username: "admin",
  password: "Oh3SnL1FJpvc",
  sourcePassword: "hackme", // Default source password
  mountPoint: "/stream",
  enableStats: true,
  connectionType: "direct",
  useHttps: false,
};
