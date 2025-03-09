CREATE DATABASE TempAnalysis;
USE TempAnalysis;

CREATE TABLE temperature (
    Id integer PRIMARY KEY AUTO_INCREMENT,
    Intervals varchar(20),
    City varchar(100),
    BatteryTemperature decimal(3, 1),
    LocalTemperature decimal(3, 1)
);

insert into temperature values(1, 'Morning', 'Chennai', 28.7, 29.7);