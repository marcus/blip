#!/usr/bin/env python3
"""Exercise the shipping controls and drag region with no bridge or messages."""
from pathlib import Path
import os, shutil, subprocess, tempfile
repo = Path(__file__).resolve().parents[1]
qml = '''import QtQuick
import QtTest
Item {
  width:400; height:160
  WindowControls { id: controls }
  SignalSpy { id: closeSpy; target:controls; signalName:"closeRequested" }
  SignalSpy { id: minSpy; target:controls; signalName:"minimizeRequested" }
  SignalSpy { id: maxSpy; target:controls; signalName:"maximizeRequested" }
  QtObject {
    id: chrome
    property int moves: 0
    property int maximizes: 0
    function startSystemMove() { moves++ }
    function windowAction(action) { if (action === "maximize") maximizes++ }
  }
  WindowDragArea { id: drag; x:100; width:200; height:60; windowChrome:chrome }
  TestCase {
    name:"WindowControls"; when:windowShown
    function test_actions_and_keyboard() {
      mouseClick(controls,12,16); compare(closeSpy.count,1);
      mouseClick(controls,36,16); compare(minSpy.count,1);
      mouseClick(controls,60,16); compare(maxSpy.count,1);
      var button=findChild(controls,"blipWindowControl2");
      button.forceActiveFocus(); verify(controls.controlFocused);
      keyClick(Qt.Key_Space); compare(maxSpy.count,2);
    }
    function test_drag_threshold_and_double_click() {
      mousePress(drag,10,20); compare(chrome.moves,0);
      mouseMove(drag,60,20); verify(chrome.moves > 0); mouseRelease(drag,60,20);
      mouseDoubleClickSequence(drag,10,20); compare(chrome.maximizes,1);
    }
  }
}
'''
runner=shutil.which('qmltestrunner') or '/usr/lib/qt6/bin/qmltestrunner'
with tempfile.TemporaryDirectory(prefix='blip-chrome-test-') as temp:
    p=Path(temp); (p/'tst_chrome.qml').write_text(qml)
    for name in ['WindowControls.qml','WindowDragArea.qml']: shutil.copy2(repo/name,p/name)
    env={**os.environ,'QT_QPA_PLATFORM':'offscreen','QT_QPA_PLATFORMTHEME':'generic','QT_QUICK_BACKEND':'software'}
    raise SystemExit(subprocess.run([runner,'-input',temp],env=env).returncode)
