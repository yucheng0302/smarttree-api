#### Node.js + restify + MariaDB + MVC structure

node-restify

bunyan

node-mariasql


Example queries
```sql
select * from WaterSensor
select * from Comments
select * from SensorType
select * from VoiceSensor
select * from SmartTrees
INSERT INTO Sensors (id, name, sensorType) VALUES ('9311e600-079e-11e6-b512-3e1d05defe78', 'Sensor 1', 1)
INSERT INTO Sensors (id, name, sensorType) VALUES ('9311ea88-079e-11e6-b512-3e1d05defe78', 'Sensor 1-1', 1)

select * from Comments

INSERT INTO WaterSensor (id, wateron, watertemp) VALUES ('9311ea88-079e-11e6-b512-3e1d05defe78', false, 50)

INSERT INTO SmartTrees_Sensors (treeId, sensorId) VALUES ('45304c60-9eac-48bf-9d0b-c02dda6c6cb3', '9311ea88-079e-11e6-b512-3e1d05defe78')

select * from SmartTrees LEFT JOIN SmartTrees_Sensors ON SmartTrees.id = SmartTrees_Sensors.treeId WHERE SmartTrees.id='45304c60-9eac-48bf-9d0b-c02dda6c6cb3'

select SmartTrees.*, count(distinct (Comments.id)) AS likecount, count(distinct (SmartTrees_Sensors.sensorId)) AS sensorCount from SmartTrees LEFT JOIN SmartTrees_Sensors ON SmartTrees.id = SmartTrees_Sensors.treeId LEFT JOIN Comments ON Comments.treeId = SmartTrees.id WHERE SmartTrees.id='45304c60-9eac-48bf-9d0b-c02dda6c6cb3' AND Comments.islike=true

select SmartTrees_Sensors.treeId, Sensors.*, WaterSensor.wateron, WaterSensor.watertemp from SmartTrees_Sensors LEFT JOIN Sensors ON SmartTrees_Sensors.sensorId = Sensors.id LEFT JOIN WaterSensor ON WaterSensor.id=SmartTrees_Sensors.sensorId WHERE SmartTrees_Sensors.treeId='45304c60-9eac-48bf-9d0b-c02dda6c6cb3'

select SmartTrees_Sensors.sensorId, WaterSensor.wateron, WaterSensor.watertemp from SmartTrees_Sensors LEFT JOIN WaterSensor ON WaterSensor.id=SmartTrees_Sensors.sensorId WHERE SmartTrees_Sensors.treeId='45304c60-9eac-48bf-9d0b-c02dda6c6cb3'

select SmartTrees_Sensors.sensorId, WaterSensor.wateron, WaterSensor.watertemp from SmartTrees_Sensors LEFT JOIN WaterSensor ON WaterSensor.id=SmartTrees_Sensors.sensorId WHERE SmartTrees_Sensors.treeId='45304c60-9eac-48bf-9d0b-c02dda6c6cb3'

select SmartTrees_Sensors.sensorId, LightSensor.lighton, LightSensor.lightcolor from SmartTrees_Sensors JOIN LightSensor ON LightSensor.id=SmartTrees_Sensors.sensorId WHERE SmartTrees_Sensors.treeId='45304c60-9eac-48bf-9d0b-c02dda6c6cb3'

select SmartTrees_Sensors.sensorId, VoiceSensor.voiceon, VoiceSensor.volume from SmartTrees_Sensors JOIN VoiceSensor ON VoiceSensor.id=SmartTrees_Sensors.sensorId WHERE SmartTrees_Sensors.treeId='45304c60-9eac-48bf-9d0b-c02dda6c6cb3'

select SmartTrees_Sensors.treeId, Sensors.sensorType, Sensors.name, WaterSensor.*, VoiceSensor.*, SpeedSensor.*, LightSensor.* FROM Sensors LEFT JOIN SmartTrees_Sensors ON SmartTrees_Sensors.sensorId=Sensors.id LEFT JOIN WaterSensor ON Sensors.id=WaterSensor.id LEFT JOIN VoiceSensor ON Sensors.id=VoiceSensor.id LEFT JOIN LightSensor ON LightSensor.id=Sensors.id LEFT JOIN SpeedSensor ON Sensors.id=LightSensor.id WHERE Sensors.id='9311ea88-079e-11e6-b512-3e1d05defe78'

```
