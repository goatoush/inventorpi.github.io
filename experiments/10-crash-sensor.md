---
parent: Experiments
nav_order: 10
---
# Crash Sensor

![Crash Sensor](/assets/images/circuits/Crash%20Sensor%20Circuit.jpg)

{: #summary }
### A MicroPython code example running on a Raspberry Pi Pico 2 W microcontroller connected to a crash sensor module with a limit switch, an RGB LED module and an OLED display module (SSD1306) on a breadboard to change the LED color and show the status on the display when crash is detected

A crash sensor uses a limit switch. This can be used with a hard stop to detect when a mechanism, such as a robotic arm, reaches the limit of its motion and trigger a limit switch. It is also used in oven and refrigerator doors to turn on the internal light when the door is opened.

Create a new file in Thonny, with file name crash_sensor.py. Copy and paste the code below into the file you created.

```python
print("\nCrash Sensor")

# DESCRIPTION

# A crash sensor uses a limit switch. This can be used with a hard stop to detect 
# when a mechanism, such as a robotic arm, reaches the limit of its motion and
# trigger a limit switch. It is also used in oven and refrigerator doors to turn 
# on the internal light when the door is opened.

# CONNECTIONS REQUIRED

# Connect Crash Sensor (KY-021) module 
#   Pins: GND => GND, VCC => VCC, S => GP28

from machine import Pin
from oled import OLED
from buzzer import Buzzer
from rgbled import RGBLED

sensor = Pin(28, Pin.IN, Pin.PULL_UP)
oled = OLED(scl_pin=15, sda_pin=14)
buzzer = Buzzer(pwm_pin=16)
rgbled = RGBLED(red_pin=12, green_pin=11, blue_pin=10)

try:
    while True:
        
        # Sensor value is 1 => No crash detected.
        # Loop while no crash detected
        oled.reset()
        rgbled.set_color(g=255)
        while sensor.value() == 1: pass
        
        # Sensor value is no longer 1 => Crash detected.
        # Loop while crash detected
        oled.print("Crash")
        rgbled.set_color(r=255)
        buzzer.play_tone(200)
        while sensor.value() == 0: pass

except KeyboardInterrupt:
    print("\nInterrupted by user!")

finally:
    oled.reset()
    rgbled.reset()
    buzzer.reset()
```