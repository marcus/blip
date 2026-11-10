import QtQuick
import QtQuick.Controls

// Client-side controls share the sidebar toolbar; no extra title strip.
FocusScope {
  id: root
  implicitWidth: 72
  implicitHeight: 32
  property bool windowActive: true
  property color foreground: "white"
  signal closeRequested()
  signal minimizeRequested()
  signal maximizeRequested()
  readonly property bool controlFocused: activeFocus
  Row {
    Repeater {
      model: [
        {label: "Close window", symbol: "×", tint: "#ff5f57"},
        {label: "Minimize window", symbol: "−", tint: "#febc2e"},
        {label: "Maximize or restore window", symbol: "+", tint: "#28c840"}
      ]
      delegate: AbstractButton {
        id: button
        required property var modelData
        required property int index
        objectName: "blipWindowControl" + index
        width: 24
        height: 32
        hoverEnabled: true
        Accessible.name: modelData.label
        ToolTip.visible: hovered
        ToolTip.text: modelData.label
        background: Rectangle {
          anchors.centerIn: parent
          width: 14; height: 14; radius: 7
          gradient: Gradient {
            GradientStop { position: 0; color: root.windowActive || button.hovered ? Qt.lighter(button.modelData.tint, button.down ? 0.85 : 1.12) : Qt.alpha(root.foreground, 0.30) }
            GradientStop { position: 1; color: root.windowActive || button.hovered ? Qt.darker(button.modelData.tint, button.down ? 1.35 : 1.06) : Qt.alpha(root.foreground, 0.20) }
          }
          border.width: button.visualFocus ? 2 : 0.5
          border.color: button.visualFocus ? root.foreground : "#30000000"
          Text {
            anchors.centerIn: parent
            text: button.modelData.symbol
            textFormat: Text.PlainText
            visible: button.hovered || button.visualFocus
            color: "#99000000"
            font.pixelSize: 13
            font.bold: true
          }
        }
        onClicked: {
          if (index === 0) root.closeRequested()
          else if (index === 1) root.minimizeRequested()
          else root.maximizeRequested()
        }
      }
    }
  }
}
