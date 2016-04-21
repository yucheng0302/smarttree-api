/**
 * Helper libray manage DB data config that might be sharable between different models
 */

'use strict';

var DB_Config = function() {};

//Helper function to generate tablename based on sensortype
//1. water
//2. light
//3. speed
//4. voice
DB_Config.prototype.getTableSensor = function(currType) {
  var tableName = '';
  var type = parseInt(currType, 10);
  switch(type) {
    case 1:
      tableName = 'WaterSensor';
      break;
    case 4:
      tableName = 'VoiceSensor';
      break;
    case 3:
      tableName = 'SpeedSensor';
      break;
    default: //light sensor
      tableName = 'LightSensor';
      break;
  }
  return tableName;
}

module.exports = DB_Config;
