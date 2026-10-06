---
parent: Experiments
nav_order: 1
---
# Blink

{: #summary }
### A MicroPython code example running on a Raspberry Pi Pico 2 W microcontroller to blink an onboard LED repeatedly

Let's start with a simple micropython script to control the onboard LED on the Pico microcontroller. We access the GPIO (General Purpose Input Output) pins by using the Pin object from the machine library. The onboard LED can be accessed at GP25, or the name "LED" as Pin("LED") or Pin(25). We use Pin.OUT to set it as an output pin. We will use input pins later with sensors.

Create a new file in Thonny, with file name blink.py. Copy and paste the code below into the file you created.

```python
from machine import Pin
from time import sleep

led = Pin("LED", Pin.OUT)
```

Now let's add the main loop. In the code below, led.toggle() function toggles the LED on and off. We add a 1 second delay with the sleep(1) statement. Both lines repeat indefinitely inside a 'while True:' code block. Copy and paste the code below to the end of the blink.py file.

```python
while True:
    led.toggle()
    sleep(1)
```

Save the file and run the script using the green 'Current Run Script' button. If everything worked as expected, you should see an LED on the Raspberry Pi Pico blink on and off repeatedly. Congratulations, you have written and run your first MicroPython script.
