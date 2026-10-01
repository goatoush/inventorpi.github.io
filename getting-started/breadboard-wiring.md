---
parent: Getting Started
nav_order: 5
---
# Breadboard Wiring

<br>
![Additional Sensors](/assets/images/slides/5_Breadboard_Wiring.jpg)

There is now a resettable fuse on the breadboard (not included in the image above, see below) which disconnects the circuit in case a student accidentally creates a short circuit on the breadboard. But incorrectly wiring a sensor can cause it to heat up, destroying sensitive electronics. The [Do's and Don'ts section](/getting-started/important-dos-and-donts.html) covers important points to keep in mind.

![Resettable Fuse](/assets/images/resettable-fuse.jpg)
*A resettable fuse (PPTC fuse or polyfuse) is the small orange-yellow component connecting the Pico 3.3V Out Pin to the breadboard **+**{: .text-red-000} rail. When there is a short circuit, such as a jumper wire accidentally connecting VCC (breadboard **+**{: .text-red-000} rail) to GND  (breadboard **-**{: .text-blue-000} rail), it trips, preventing damage to the electronics. A few seconds after the circuit is fixed or the power is turned off, it cools down and resets itself. The students should verify all the connections and resume the experiment.*
{: .fs-2.grey-dk-100.text-center }
