"use strict";

const fetch = require("node-fetch");

let Service, Characteristic;
var CommunityTypes;
var FakeGatoHistoryService;

module.exports = homebridge => {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  CommunityTypes = require("hap-nodejs-community-types")(homebridge);

  homebridge.registerAccessory("homebridge-bme280", "BME280", BME280Plugin);
};

class BME280Plugin {
  constructor(log, config) {
    this.log = log;
    this.name = config.name;
    this.url = config.url;
    this.name_temperature = config.name_temperature || this.name;
    this.name_humidity = config.name_humidity || this.name;
    this.refresh = config["refresh"] || 60; // Update every minute

    this.log(`BME280 sensor url: ${this.url}`);

    this.informationService = new Service.AccessoryInformation();

    this.informationService
      .setCharacteristic(Characteristic.Manufacturer, "Bosch")
      .setCharacteristic(Characteristic.Model, "ESP8266-BME280")
      .setCharacteristic(Characteristic.SerialNumber, "280");

    this.temperatureService = new Service.TemperatureSensor(
      this.name_temperature
    );

    this.temperatureService
      .getCharacteristic(Characteristic.CurrentTemperature)
      .setProps({
        minValue: -100,
        maxValue: 100
      });

    this.temperatureService.addCharacteristic(
      CommunityTypes.AtmosphericPressureLevel
    );

    this.humidityService = new Service.HumiditySensor(this.name_humidity);

    setInterval(this.devicePolling.bind(this), this.refresh * 1000);
  }

  devicePolling() {
    fetch(this.url)
      .then(res => res.json())
      .then(data => {
        this.log(`data(temp) = ${JSON.stringify(data, null, 2)}`);
        
        this.temperatureService.setCharacteristic(
          Characteristic.CurrentTemperature,
          roundInt(data.temp)
        );
        this.temperatureService.setCharacteristic(
          CommunityTypes.AtmosphericPressureLevel,
          roundInt(data.pressure)
        );
        this.humidityService.setCharacteristic(
          Characteristic.CurrentRelativeHumidity,
          roundInt(data.humidity)
        );
      })
      .catch(err => {
        this.log(`BME read error: ${err}`);
      });
  }

  getServices() {
    return [
      this.informationService,
      this.temperatureService,
      this.humidityService
    ];
  }
}

function roundInt(string) {
  return Math.round(parseFloat(string) * 10) / 10;
}
