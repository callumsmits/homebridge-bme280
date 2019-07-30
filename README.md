# homebridge-bme280

[Bosch BME280](https://www.bosch-sensortec.com/bst/products/all_products/bme280)
temperature/humidity/barometric pressure sensor service plugin for [Homebridge](https://github.com/nfarina/homebridge).

* Display of temperature, humidity and Barometric Pressure from a BME280 connected to a ESP8266.
* Gets remote data over http

## Installation
1.	Install Homebridge using `npm install -g homebridge`
2.	Install this plugin `npm install -g callumsmits/homebridge-bme280`
3.	Update your configuration file - see below for an example

Connect the BME280 chip to the I2C bus

## Configuration
* `accessory`: "BME280"
* `name`: descriptive name
* `name_temperature` (optional): descriptive name for the temperature sensor
* `name_humidity` (optional): descriptive name for the humidity sensor
* `refresh`: Optional, time interval for refreshing data in seconds, defaults to 60 seconds.

Example configuration:

```json
    "accessories": [
        {
            "accessory": "BME280",
            "name": "Room sensor",
            "name_temperature": "Temperature",
            "name_humidity": "Humidity",
            "url": "http://room-monitor.local/current"
       }
    ]
```

This plugin creates two services: TemperatureSensor and HumiditySensor.

## Credits
Based on [homebridge-bme280](rxseger/homebridge-bme280)

* NorthernMan54 - Barometric Pressure and Device Polling
* simont77 - History Service

## License

MIT
