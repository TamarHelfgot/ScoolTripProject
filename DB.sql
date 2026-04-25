CREATE DATABASE SchoolTripDB;
GO;

USE SchoolTripDB;
GO;

CREATE TABLE Class (
    Id         INT IDENTITY(1,1) PRIMARY KEY,
    ClassName  NVARCHAR(50) NOT NULL
);

-- Role: 1=Admin | 2=Teacher | 3=Student
CREATE TABLE Users (
    Id         NVARCHAR(9)    PRIMARY KEY,       
    FirstName  NVARCHAR(50)   NOT NULL,
    LastName   NVARCHAR(50)   NOT NULL,
    ClassId    INT            NOT NULL,
    UserRole       INT            NOT NULL
	               CHECK (UserRole IN (1, 2, 3)),  
    CONSTRAINT FK_Users_Class
        FOREIGN KEY (ClassId) REFERENCES Class(Id)
);

CREATE TABLE Locations (
    Id         INT              IDENTITY(1,1) PRIMARY KEY,
    UserId     NVARCHAR(9)      NOT NULL,
    Latitude   DECIMAL(9,6)     NOT NULL,
    Longitude  DECIMAL(9,6)     NOT NULL,
    Time       DATETIME         NOT NULL DEFAULT GETDATE(),

    CONSTRAINT FK_Locations_Users
        FOREIGN KEY (UserId) REFERENCES Users(Id)
);



