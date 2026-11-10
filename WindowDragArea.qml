import QtQuick

MouseArea {
  property var windowChrome: null
  property point pressPoint
  enabled: windowChrome !== null
  onPressed: mouse => { pressPoint = Qt.point(mouse.x, mouse.y) }
  onPositionChanged: mouse => {
    if (pressed && Math.hypot(mouse.x - pressPoint.x, mouse.y - pressPoint.y) >= Qt.styleHints.startDragDistance)
      windowChrome.startSystemMove()
  }
  onDoubleClicked: windowChrome.windowAction("maximize")
}
