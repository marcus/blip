import { expect, test } from "bun:test";
import { windowCommand } from "./window-controls";
const clients = [{address:"0x123",class:"org.quickshell",title:"Messages"}, {address:"0x456",class:"chromium",title:"Messages"}];
test("maximize targets the originating window, not current focus", () => {
  expect(windowCommand("maximize", "0x123", clients, "")).toEqual(["hyprctl", "dispatch", 'hl.dsp.window.fullscreen({ mode = "maximized", action = "toggle", window = "address:0x123" })']);
});
test("minimize preserves the desktop's animated helper with a stock fallback", () => {
  expect(windowCommand("minimize", "0x123", clients, "/demo/window-minimize")).toEqual(["env", "WINDOW_TITLEBAR_HEIGHT=0", "/demo/window-minimize", "0x123"]);
  expect(windowCommand("minimize", "0x123", clients, "")).toEqual(["omarchy-hyprland-window-minimize", "0x123"]);
});
test("stale, unrelated and malformed window targets do nothing", () => {
  for (const address of ["0x999", "0x456", '0x123\" })']) expect(windowCommand("maximize", address, clients, "")).toBeNull();
  expect(windowCommand("maximize", "0x123", null, "")).toBeNull();
  expect(windowCommand("delete", "0x123", clients, "")).toBeNull();
});
