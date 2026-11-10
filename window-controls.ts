/** Window actions target the originating surface, even if focus changes. */
import { existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

export function windowCommand(action: string, address: string, clients: unknown, animatedMinimize: string): string[] | null {
  if (!/^0x[0-9a-f]+$/i.test(address) || !Array.isArray(clients)) return null;
  const client = clients.find(c => c?.address === address);
  if (!client || client.class !== "org.quickshell" || !/^(Messages|Blip( \([0-9]+\))?)$/.test(client.title)) return null;
  if (action === "maximize") return ["hyprctl", "dispatch", `hl.dsp.window.fullscreen({ mode = "maximized", action = "toggle", window = "address:${address}" })`];
  if (action === "minimize") return animatedMinimize ? ["env", "WINDOW_TITLEBAR_HEIGHT=0", animatedMinimize, address] : ["omarchy-hyprland-window-minimize", address];
  return null;
}

if (import.meta.main) {
  const result = Bun.spawnSync(["hyprctl", "clients", "-j"]);
  let clients: unknown = null;
  try { clients = JSON.parse(result.stdout.toString()); } catch { }
  const custom = join(homedir(), ".local/bin/window-minimize");
  const command = windowCommand(process.argv[2], process.argv[3], clients, existsSync(custom) ? custom : "");
  if (!command) process.exit(1);
  process.exit(Bun.spawnSync(command).exitCode);
}
