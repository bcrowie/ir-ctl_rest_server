# ir-ctl_rest_server
This is a REST API written for NodeJS for control of a 38khz Infrared Transmitter connected to a Raspberry Pi via GPIO.

## Prerequisites

- You will need an IR transmitter. You can either purchase one yourself, something similar to this: https://rb.gy/f6sfox or you can wire an IR LED to the GPIO using a 200ohm resistor and an NPN transistor. Here is a guide that can be used for the wiring: https://blog.gordonturner.com/2020/06/10/raspberry-pi-ir-transmitter/. I recommend purchasing the link to the amazon product, or wiring both a transmitter and receiver to the Pi as it will give you the ability to record commands from any remote you would like, rather than digging around for hex codes on the internet. This guide does not cover the installation for the IR receiver or recording IR codes.
- RaspbianOS Installed (Or another systemd compatible linux distro)
- NodeJS

## Installation

Connect the Infrared transmitter to the raspberry pi; There are three pins. 5v on the Pi connects to VCC on the transmitter, a Ground pin to GND, and pin 23 to DAT. See below:

![RPi IR Transmitter Wiring Diagram](https://imgur.com/Pn6BZhy "RPi IR Transmitter Wiring Diagram")

Enable the transmitter in the boot configuration:

- Connect to the Raspberry Pi via SSH: ssh pi@192.x.x.x (or use the terminal if you have access to the desktop)
- Run the following command
    sudo nano /boot/config.txt
- Add the following line to the end of the file if you only added the transmitter:
    dtoverlay=gpio-ir-tx,gpio_pin=23
- Reboot
    sudo reboot


When the Pi boots again, clone this repo to /opt
    sudo git clone https://github.com/bcrowie/ir-ctl_rest_server.git /opt/ir-ctl_rest_server

The included 'codes.json' file has codes for an Insignia Television. You can change these to whatever you would like as long as you know the codes that correspond to your device(s) you are trying to control.

After configuring 'codes.json', install the server as a systemd service:
    sudo ln /opt/ir-ctl_rest_server/ir_ctl.service /etc/systemd/system/ir_ctl.service
    sudo systemctl enable ir_ctl.service
    sudo systemctl start ir_ctl.service

Make sure the service is running successfully:
    systemctl status ir_ctl.service

If status says active, you are good to start using the API.

## Usage

The API responds on port 3000. If this port is already in use and you would like to change it, make sure to do so in app.js where port 3000 is defined.

To issue an infrared command, you need to send a command to the IP address and port, with the correct endpoint. 

For example, if I wanted to issue the power command, I would send this either in a web browser, or terminal, or from Home Assistant you can setup a shell command:
    curl -X GET http://192.168.1.100:3000/command/power

If the power command is found in the 'codes.json' file, you could get an http 200 response of success. If it is not found, it will return a 404 failure.

Volume Down:
    curl -X GET http://your.ip.add.ress:3000/command/volume_up

Input
    curl -X GET http://your.ip.add.ress:3000/command/input

When altering 'codes.json', the application must be able to find the key exactly as it is listed in the file, and as it is sent otherwise the command will fail. So if you were to change:
    "volume_up": "0x86050c",
to
    "Volume-Up": "0x66440a",
you must now send the command:
    curl -X GET http://your.ip.add.ress:3000/command/Volume-Up

Credit given to [cz172638](https://github.com/cz172638) for [ir-ctl](https://github.com/cz172638/v4l-utils/tree/master/utils/ir-ctl)