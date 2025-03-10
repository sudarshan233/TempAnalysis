create database tempanalysis;
use tempanalysis;

create table temperature(
    Id integer primary key auto_increment,
    Intervals varchar(20),
    ReadingsTime timestamp not null default now(),
    ReadingsDay varchar(10), 
    City varchar(100),
    BatteryTemperature decimal(3,1),
    LocalTemperature decimal(3, 1)
);

