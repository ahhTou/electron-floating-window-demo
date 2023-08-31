const { Tray, nativeImage, screen } = require('electron')
const path = require('path')

const getTrayIconFromFilePath = filePath => {
    const icon = nativeImage.createFromPath(filePath).resize({
        width: 18,
        height: 18,
    })

    icon.setTemplateImage(true)

    return icon
}

const getPosition = (tray, win) => {
    const tray_bounds = tray.getBounds()
    const window_bounds = win.getBounds()
    const point = screen.getCursorScreenPoint()
    const screen_bounds0 = screen.getDisplayNearestPoint(point).bounds
    const screen_bounds = screen.getDisplayNearestPoint(point).workAreaSize

    let x
    let y

    let dw = screen_bounds0.width - screen_bounds.width
    if (dw > 0 && tray_bounds.x < dw) {
        // tray is at left
        x = dw
    } else {
        x = tray_bounds.x + tray_bounds.width / 2 - window_bounds.width / 2
    }

    // let dh = screen_bounds0.height - screen_bounds.height
    if (tray_bounds.y < screen_bounds.height / 2) {
        y = tray_bounds.y + tray_bounds.height
    } else {
        y = tray_bounds.y - window_bounds.height - 2
    }

    if (x < 0) x = 0
    if (x + window_bounds.width > screen_bounds.width)
        x = screen_bounds.width - window_bounds.width

    x = Math.round(x)
    y = Math.round(y)

    return { x, y }
}

const createTray = ({ onClick, win }) => {
    const url = path.resolve(__dirname, './tray-fill-icon.png')

    const icon = getTrayIconFromFilePath(url)

    const tray = new Tray(icon)

    tray.on('click', () => {
        const pos = getPosition(tray, win)

        onClick?.(pos)
    })

    return tray
}

module.exports = {
    createTray,
}
