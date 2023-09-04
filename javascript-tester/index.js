controllerIndex = null

window.addEventListener("gamepadconnected", (event) =>
{
    handleConnectionStatus(event, true)
})

window.addEventListener("gamepaddisconnected", (event) =>
{
    handleConnectionStatus(event, false)
})

function handleConnectionStatus(event, connected)
{
    console.log("connected", connected)

    const controllerNotConnectedArea = document.getElementById("controller-not-connected-area")
    const controllerConnectedArea = document.getElementById("controller-connected-area")
    const controllerId = document.getElementById("controller-id")

    const gamepad = event.gamepad
    console.log(gamepad)

    if (connected)
    {
        controllerIndex = event.gamepad.index
        controllerNotConnectedArea.style.display = "none"
        controllerConnectedArea.style.display = "block"
        controllerId.innerHTML = gamepad.id
        createButtonLayout(gamepad.buttons)
        createAxesLayout(gamepad.axes)
    } else
    {
        controllerIndex = null
        controllerId.innerHTML = ""
        controllerNotConnectedArea.style.display = "block"
        controllerConnectedArea.style.display = "none"
    }
}


function createAxesLayout(axes)
{
    const buttonArea = document.getElementById("buttons")
    for (let i = 0; i < axes.length; i++)
    {
        buttonArea.innerHTML += createAxesButton(i, 0)
    }
}

function createAxesButton(index, value)
{
    return `
    <div class="axis" id="axis-${index}">
            <div class="button-text-area">
                <div class="axis-name">AXIS ${index}</div>
                <div class="axis-value">${value.toFixed(4)}</div>
            </div>
        <div>
    `
}

function createButtonLayout(buttons)
{
    const buttonArea = document.getElementById("buttons")
    buttonArea.innerHTML = ""
    for (let i = 0; i < buttons.length; i++)
    {
        buttonArea.innerHTML += createButton(i, 0)
    }
}

function createButton(index, value)
{
    return `
        <div class="button" id="button-${index}">
            <svg width="10px" height="50px">
                <rect width="10px" height="50px" fill="grey"></rect>
                <rect 
                    class="button-meter"
                    width="10px" 
                    height="50px" 
                    x="0"
                    y="50"
                    data-original-y-position="50"
                    fill="rgb(200,61,60)"></rect>
            </svg>
            <div class="button-text-area">
                <div class="button-name">B${index}</div>
                <div class="button-value">${value.toFixed(2)}</div>
            </div>
        <div>
    `
}

function updateButtonsOnGrid(index, value)
{
    const button_map = document.getElementById(`button-${index}`)

    const buttonValue = button_map.querySelector(".button-value")
    buttonValue.innerHTML = value.toFixed(2)

    const buttonMeter = button_map.querySelector(".button-meter")
    const meterHeight = Number(buttonMeter.dataset.originalYPosition) //data-original-y-position
    const meterPosition = meterHeight - (meterHeight / 100) * (value * 100)
    buttonMeter.setAttribute("y", meterPosition)
}

function updateButtonsOnController(index, value)
{
    const button = document.getElementById(`controller-b${index}`)
    const selectButtonClass = "selected-button"

    if (button)
    {
        if (value > 0)
        {
            button.classList.add(selectButtonClass)
            button.style.filter = `contrast(${value * 200}%)`
        } else
        {
            button.classList.remove(selectButtonClass)
            button.style.filter = `contrast(100%)`
        }
    }
}

function handleButtons(buttons)
{
    for (let i = 0; i < buttons.length; i++)
    {
        const buttonValue = buttons[i].value
        updateButtonsOnGrid(i, buttonValue)
        updateButtonsOnController(i, buttonValue)
    }
}

function handleJoysticks(axes)
{
    updateAxesGrid(axes)
    updateStick("controller-b10", axes[0], axes[1])
    updateStick("controller-b11", axes[2], axes[3])
}

function updateAxesGrid(axes)
{
    const stickDeadZone = 0.09

    for (let i = 0; i < axes.length; i++)
    {
        const axis = document.querySelector(`#axis-${i} .axis-value`)
        const value = axes[i]
        if (value > stickDeadZone || value < -stickDeadZone)
        {
            axis.innerHTML = value.toFixed(4)
        }
        else
        {
            axis.innerHTML = Number(0).toFixed(4)
        }
    }
}

function updateStick(elementId, leftRightAxis, upDownAxis)
{
    const multiplier = 20
    const stickLeftRight = leftRightAxis * multiplier
    const stickUpDown = upDownAxis * multiplier

    const stick = document.getElementById(elementId)
    const x = Number(stick.dataset.originalXPosition)
    const y = Number(stick.dataset.originalYPosition)

    stick.setAttribute("cx", x + stickLeftRight)
    stick.setAttribute("cy", y + stickUpDown)
}


function handleRumble(gamepad)
{
    const rumbleOnButtonPress = document.getElementById("rumble-on-button-press")

    if (rumbleOnButtonPress.checked)
    {
        if (gamepad.buttons.some(button => button.value > 0))
        {
            gamepad.vibrationActuator.playEffect("dual-rumble", {
                startDelay: 0,
                duration: 25,
                weakMagnitude: 1.0,
                strongManitude: 1.0
            })
        }
    }
}

function gameLoop()
{
    if (controllerIndex !== null)
    {
        const gamepad = navigator.getGamepads()[controllerIndex]
        handleButtons(gamepad.buttons)
        handleJoysticks(gamepad.axes)
        handleRumble(gamepad)
    }
    requestAnimationFrame(gameLoop)
}

gameLoop()