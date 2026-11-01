---
parent: Getting Started
nav_order: 5
---
# Breadboard Wiring

![Breadboard Wiring](/assets/images/slides/5_Breadboard_Wiring.webp)
{: .mt-6 }

## Breadboard wiring quick reference
- Connect VCC to ![Positive Rail](/assets/images/plus-rail.webp){: .inline-img }
- Connect GND to ![Ground Rail](/assets/images/minus-rail.webp){: .inline-img }
- 6 Buttons connected to GP0…GP5 ![6 Buttons](/assets/images/breadboard-buttons.webp){: .inline-img }
- Connect to GP9 here ![GP9](/assets/images/gp9-connection-holes.webp){: .inline-img }
- Connect to GP28 here ![GP28](/assets/images/gp28-connection-holes.webp){: .inline-img }
- Raspberry Pi Pico 2W ![Raspberry Pi Pico 2W](/assets/images/raspberry-pi-pico-2w.webp){: .inline-img }
- Piezo Buzzer ![Piezo Buzzer](/assets/images/piezo-buzzer.webp){: .inline-img }
- OLED Display ![OLED Display](/assets/images/oled.webp){: .inline-img }


There is now a resettable fuse on the breadboard (not included in the image above, see below) which disconnects the circuit in case a student accidentally creates a short circuit on the breadboard. You still need to verify all connections before powering on the circuit, because incorrect connections to the sensors can cause permanent damage to their sensitive electronics, rendering them useless. The [Do's and Don'ts](/getting-started/important-dos-and-donts.html) section covers important points to keep in mind.

![Resettable Fuse](/assets/images/resettable-fuse.webp)
*A resettable fuse (PPTC fuse or polyfuse) is the small orange-yellow component connecting the Pico 3.3V Out Pin to the breadboard ![Positive Rail](/assets/images/plus-rail.webp){: .inline-img } rail. When there is a short circuit, such as a jumper wire accidentally connecting VCC (breadboard ![Positive Rail](/assets/images/plus-rail.webp){: .inline-img } rail) to GND  (![Ground Rail](/assets/images/minus-rail.webp){: .inline-img } rail), it trips, preventing damage to the electronics. A few seconds after the circuit is fixed or the power is turned off, it cools down and resets itself. The students should verify all the connections and resume the experiment.*
{: .caption }
