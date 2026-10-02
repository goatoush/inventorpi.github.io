---
nav_order: 3
---
# Lesson Plan for Teachers
{: .no_toc }

<br>
## Table of Contents
{: .no_toc .text-delta }

- TOC
{:toc}

<br>
Teachers can run a one hour workshop with middle school students interested in STEM. Each class experiments kit includes 5 identical invention kits and one additional sensors kit. There is also a "Get started with MicroPython on Raspberry Pi Pico" book included, which is not essential to running the workshop. It is available for optional extra reading, if desired.

![Class Experiments Kit](/assets/images/class-experiments-kit.jpg)
*Class Experiments Kit. Each class experiments kit includes 5 identical invention kits and one additional sensors kit.*
{: .fs-2.grey-dk-100.text-center }

### Reference Slides for the Workshop

Reference slides from our first workshop are included below, which you can use as-is, or incorporate within your presentation.

<a title="Download Slides" href="/assets/Inventor%20Pi%20-%20Introduction%20to%20Electronics.pdf" download="Inventor Pi - Introduction to Electronics.pdf"><img style="border: solid 1px black; border-radius: 5px; overflow: hidden" width="300" src="/assets/images/slides/Inventor%20Pi%20-%20Introduction%20to%20Electronics.jpg"/>
<br>Download Slides ↓</a>

Please familiarize yourself with the contents of the invention kit and the additional sensors kit. You can use the kits and the [Getting Started](/getting-started/) section of this website to try out the different experiments yourself before the class. The additional sensors kit includes reward stickers that you can distribute for the best creative ideas, active participation, etc. There are also some tiny NFC nail stickers that light up when brought near a smartphone with NFC (often at the back near the top center).

{: .important }
The first step is installing the Thonny app. Please share these [instructions](/getting-started/install-thonny-app.html) with the students ahead of time, so they can install the app on their laptops before the class.

### Breadboard Connections and Safety

It is important for the students to learn how breadboard connections work and to be safe. The additional sensors kit includes a breadboard with no backing to show how it works. There is a resettable fuse on the breadboard which disconnects the circuit in case a student accidentally creates a short circuit on the breadboard. But incorrectly wiring a sensor can cause it to heat up, destroying sensitive electronics. The [Do's and Don'ts section](/getting-started/important-dos-and-donts.html) covers important points to keep in mind.

![Resettable Fuse](/assets/images/resettable-fuse.jpg)
*A resettable fuse (PPTC fuse or polyfuse) is the small orange-yellow component connecting the Pico 3.3V Out Pin to the breadboard **+**{: .text-red-000} rail. When there is a short circuit, such as a jumper wire accidentally connecting VCC (breadboard **+**{: .text-red-000} rail) to GND  (breadboard **-**{: .text-blue-000} rail), it trips, preventing damage to the electronics. A few seconds after the circuit is fixed or the power is turned off, it cools down and resets itself. The students should verify all the connections and resume the experiment.*
{: .fs-2.grey-dk-100.text-center }

When setting up the connectors, students should disconnect the USB cable from Pico, and have multiple students verify the connections before connecting the USB cable. It is useful to count the pin distance from other used pins on the board.

{: .new-title }
> Safety Procedure
>
> Power Off ➔ Connect Components ➔ Verify Each Connection ➔ Power On

### Lesson Plan Outline

1. Introduction - Learn about electronics, breadboards, safety (10-20 min)
1. Divide class into 5 teams (one per invention kit) (3-5 min)
1. Students familiarize themselves with the invention kit components (3-5 min)
1. Run first experiments, learning the basics (Blink, then Humidity Temp Sensor) (5-10 min)
1. Run random experiments from the list, and present to other teams (20-30 min)
1. Clean up and pack the kits (5-7 min)

### Some Additional Notes
- To facilitate running additional workshops in future, students should pack the contents back into the boxes the way they found them.
- If teams have more than 3 students, they can take turns reading about an experiment and running an experiment.
- When students borrow sensors from the additional sensors kit, they should return the sensors after their experiment so other teams can borrow them.
- Some experiments work in pairs, requiring 2 teams to collaborate using two Picos at the same time (Microphone sensor and melody, and bluetooth advertise and scan).
- Bluetooth advertise and scan should be a fun experiment for the entire class, where all the devices synchronize their LED colors to match one advertising device. You could direct one team to work on Bluetooth advertise and others to setup Bluetooth scan before time runs out.

### Class Experiments Kit Contents

| Kit                       | Item Description                                                                                                                                | Quantity Per Kit | Total Quantity |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- | -------------- |
| 5x Invention Kit          | Breadboard with Raspberry Pi Pico 2W, 6 push buttons, piezo buzzer, OLED screen module, RGB LED Module, resettable PPTC fuse, preset connectors | 1                | 5              |
| 5x Invention Kit          | Empty Battery Pack with USB-C to USB-A Adapter                                                                                                  | 1                | 5              |
| 5x Invention Kit          | AA Alkaline Batteries, packed in a plastic bag with bubble wrap for shipping                                                                    | 3                | 18             |
| 5x Invention Kit          | Micro USB to USB-C Cable                                                                                                                        | 1                | 5              |
| 5x Invention Kit          | Micro Servo Motor                                                                                                                               | 2                | 10             |
| 5x Invention Kit          | Capacitive Touch Sensor                                                                                                                         | 1                | 5              |
| 5x Invention Kit          | Temp & Humidity Sensor                                                                                                                          | 1                | 5              |
| 5x Invention Kit          | Ultrasonic Distance Sensor                                                                                                                      | 1                | 5              |
| 5x Invention Kit          | Joystick Module                                                                                                                                 | 1                | 5              |
| 5x Invention Kit          | 10cm Jumper Wires                                                                                                                               | 20               | 100            |
| 1x Additional Sensors Kit | PIR Motion Sensor Module                                                                                                                        | 1                | 1              |
| 1x Additional Sensors Kit | Knock Sensor Module                                                                                                                             | 1                | 1              |
| 1x Additional Sensors Kit | Potentiometer Module                                                                                                                            | 1                | 1              |
| 1x Additional Sensors Kit | Microphone Sensor                                                                                                                               | 1                | 1              |
| 1x Additional Sensors Kit | Accelerometer Module                                                                                                                            | 1                | 1              |
| 1x Additional Sensors Kit | Photo Interrupter Module                                                                                                                        | 1                | 1              |
| 1x Additional Sensors Kit | Crash Sensor Module                                                                                                                             | 1                | 1              |
| 1x Additional Sensors Kit | Photoresistor Module                                                                                                                            | 1                | 1              |
| 1x Additional Sensors Kit | Rotation Encoder Module                                                                                                                         | 1                | 1              |
| 1x Additional Sensors Kit | NFC Nail Reward Stickers                                                                                                                        | 5                | 5              |
| 1x Additional Sensors Kit | Assorted Reward Stickers                                                                                                                        | 4                | 4              |
| 1x Additional Sensors Kit | Breadboard without Backing                                                                                                                      | 1                | 1              |
| 1x Book                   | Getting started with Micropython on Raspberry Pi Pico Book                                                                                      | 1                | 1              |