-- Created by Vertabelo (http://vertabelo.com)
-- Last modification date: 2019-11-05 13:06:34.568

-- tables
-- Table: Employee
CREATE TABLE Employee (
    employee_id integer NOT NULL CONSTRAINT Employee_pk PRIMARY KEY,
    user_name text NOT NULL,
    password text NOT NULL,
    paparking_spots_id integer NOT NULL,
    created_at datetime NOT NULL,
    updated_at datetime NOT NULL,
    deleted_at datetime NOT NULL,
    CONSTRAINT Employee_ParkingSpots FOREIGN KEY (paparking_spots_id)
    REFERENCES ParkingSpots (parking_spots_id)
);

-- Table: ParkingSpots
CREATE TABLE ParkingSpots (
    parking_spots_id integer NOT NULL CONSTRAINT ParkingSpots_pk PRIMARY KEY,
    tittle text NOT NULL,
    price float NOT NULL,
    rating float NOT NULL,
    capacity integer NOT NULL,
    available integer NOT NULL,
    latitude float NOT NULL,
    longitude float NOT NULL,
    created_at datetime NOT NULL,
    updated_at datetime NOT NULL,
    deleted_at datetime NOT NULL
);

-- Table: Rating
CREATE TABLE Rating (
    rating_id integer NOT NULL CONSTRAINT Rating_pk PRIMARY KEY,
    rating_value float NOT NULL,
    parking_spots_id integer NOT NULL,
    user_id integer NOT NULL,
    created_at datetime NOT NULL,
    updated_at datetime NOT NULL,
    deleted_at datetime NOT NULL,
    CONSTRAINT Rating_ParkingSpots FOREIGN KEY (parking_spots_id)
    REFERENCES ParkingSpots (parking_spots_id),
    CONSTRAINT Rating_Users FOREIGN KEY (user_id)
    REFERENCES Users (user_id)
);

-- Table: Reservation
CREATE TABLE Reservation (
    reservation_id integer NOT NULL CONSTRAINT Reservation_pk PRIMARY KEY,
    status text NOT NULL,
    period integer NOT NULL,
    parking_spots_id integer NOT NULL,
    user_id integer NOT NULL,
    ticket text NOT NULL,
    created_at datetime NOT NULL,
    updated_at datetime NOT NULL,
    deleted_at datetime NOT NULL,
    CONSTRAINT Reservation_ParkingSpots FOREIGN KEY (parking_spots_id)
    REFERENCES ParkingSpots (parking_spots_id),
    CONSTRAINT Reservation_Users FOREIGN KEY (user_id)
    REFERENCES Users (user_id)
);

-- Table: Users
CREATE TABLE Users (
    user_id integer NOT NULL CONSTRAINT Users_pk PRIMARY KEY,
    name text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    image text NOT NULL,
    plate_number text NOT NULL,
    created_at datetime NOT NULL,
    updated_at datetime NOT NULL,
    deleted_at datetime NOT NULL
);

-- End of file.

