import React, { useEffect, useState } from "react";
/**
 * Function accepts a string and returns the string reversed
 */
export const reverseString = (str: string): string => {
    return str.split("").reverse().join("");
};

/**
 * Function that accepts an array of strings and
 * returns a number that represents the average
 * length of the strings in the array
 */
export const averageStringLength = (arr: string[]): number => {
    const total = arr.reduce((acc, str) => acc + str.length, 0);
    return total / arr.length;
}

/**
 * User Interface
 */
export interface User {
    name: string;
    age: number;
    occupation: Occupation;
    occupationId: number;
}

export interface Occupation {
    occupationId: number;
    jobtitle: string;
    companyName: string;
    users?: User[];
}

/**
 * Function accepts an array of Users and an Array
 * of Occupations. However, if the occupation property
 * on the user is empty, it will populate
 * this property from the array of Occupations based
 * on the occupationId property without cloning
 * the original user object.
 */
export const populateOccupation = (users: User[], occupations: Occupation[]): void => {
    users.forEach(user => {
        if (user.occupationId) {
            const occupation = occupations.find(occupation => occupation.occupationId === user.occupationId);
            if (occupation) {
                user.occupation = occupation;
            }
        }
    });
}

/**
 * This functions accepts a number and returns
 * the value when that number is divided by zero.
 */
export const divideByZero = (num: number): number => {
    return num / 0;
}

/**
 * This function deep merges two objects
 */
export const deepMerge = (obj1: any, obj2: any): any => {
    const merged = { ...obj1 };
    Object.keys(obj2).forEach(key => {
        if (typeof obj2[key] === "object") {
            merged[key] = deepMerge(obj1[key], obj2[key]);
        } else {
            merged[key] = obj2[key];
        }
    });
    return merged;
}

/**
 * This function accepts an array of arrays of numbers
 * and pivots them.
 */
export const pivot = (arr: number[][]): number[][] => {
    const pivoted: number[][] = [];
    arr.forEach(row => {
        row.forEach((col, index) => {
            pivoted[index] = [...pivoted[index] || [], col];
        });
    });
    return pivoted;
}

/**
 * This function accepts a number and returns the twos compliment.
 */
export const twosCompliment = (num: number): number => {
    return ~num + 1;
}

/**
 * This function accepts two numbers and binary ORs them.
 */
export const binaryOr = (num1: number, num2: number): number => {
    return num1 | num2;
}

/**
 * Write a class for data fetching all the endpoints at the
 * following URL: https://swapi.dev/api/
 * A private fetch method should be used to fetch the data
 * and parse the results before returning them.
 */

export class Swapi {
    private async fetch(url: string): Promise<any> {
        const response = await fetch(url);
        return await response.json();
    }

    public async getPeople(): Promise<any> {
        return await this.fetch("https://swapi.dev/api/people/");
    }

    public async getPlanets(): Promise<any> {
        return await this.fetch("https://swapi.dev/api/planets/");
    }

    public async getStarships(): Promise<any> {
        return await this.fetch("https://swapi.dev/api/starships/");
    }

    public async getVehicles(): Promise<any> {
        return await this.fetch("https://swapi.dev/api/vehicles/");
    }

    public async getSpecies(): Promise<any> {
        return await this.fetch("https://swapi.dev/api/species/");
    }

    public async getFilms(): Promise<any> {
        return await this.fetch("https://swapi.dev/api/films/");
    }
}

/**
 * Component that uses the Swapi class to fetch the 
 * vehicles and display them in a table.
 */
export const Vehicles = () => {
    const [vehicles, setVehicles] = useState([]);

    useEffect(() => {
        const swapi = new Swapi();
        swapi.getVehicles().then(data => setVehicles(data.results));
    }, []);

    return (
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Model</th>
                    <th>Manufacturer</th>
                    <th>Cost</th>
                    <th>Length</th>
                    <th>Max Speed</th>
                    <th>Crew</th>
                    <th>Passengers</th>
                    <th>Cargo Capacity</th>
                    <th>Consumables</th>
                    <th>Vehicle Class</th>
                </tr>
            </thead>
            <tbody>
                {vehicles.map((vehicle: any) => (
                    <tr key={vehicle.name}>
                        <td>{vehicle.name}</td>
                        <td>{vehicle.model}</td>
                        <td>{vehicle.manufacturer}</td>
                        <td>{vehicle.cost_in_credits}</td>
                        <td>{vehicle.length}</td>
                        <td>{vehicle.max_atmosphering_speed}</td>
                        <td>{vehicle.crew}</td>
                        <td>{vehicle.passengers}</td>
                        <td>{vehicle.cargo_capacity}</td>
                        <td>{vehicle.consumables}</td>
                        <td>{vehicle.vehicle_class}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}


/**
 * Function that accepts a date in GMT and returns
 * it within the current timezone
 */
export const convertToCurrentTimezone = (date: Date): Date => {
    const offset = date.getTimezoneOffset();
    return new Date(date.getTime() - (offset * 60 * 1000)); 
}

/**
 * Function accepts an object or array and
 * recurvsively freezes it and it's decendents.
 */
export const deepFreeze = (obj: any): void => {
    if (obj === null || typeof obj !== "object") {
        return;
    }
    Object.freeze(obj);
    Object.getOwnPropertyNames(obj).forEach(prop => deepFreeze(obj[prop]));
}

/**
 * Function accepts an error an presents it in
 * a dialog box using the new Dialog element.
 * Not an alert box.
 */
export const presentError = (error: Error): void => {
    const dialog = document.createElement("dialog");
    dialog.innerHTML = error.message;
    document.body.appendChild(dialog);
    dialog.showModal();
}

/**
 * Function that accepts an array of users and returns 
 * their average age
 */
export const averageAge = (users: User[]): number => {
    const total = users.reduce((acc, user) => acc + user.age, 0);
    return total / users.length;
}

/**
 * Function accepts a user and returns
 * true if the user's name is stupid.
 * Otherwise, it returns false.
 */
export const isStupid = (user: User): boolean => {
    return user.name === "Stupid";
}

/**
 * Function accepts an array of Users with the
 * occupation property filled and returns
 * an array of Occupations withe the users property
 * populated.
 */
export const populateUsers = (users: User[]): Occupation[] => {
    const occupations: Occupation[] = [];
    users.forEach(user => {
        const occupation = occupations.find(occupation => occupation.occupationId === user.occupationId);
        if (occupation) {
            occupation.users = [...occupation.users || [], user];
        } else {
            occupations.push({ ...user.occupation, users: [user] });
        }
    });
    return occupations;
}

/**
 * Function accepts an array of Users and
 * returns a hash map of the users using
 * the users' name as the key.
 */
export const hashUsers = (users: User[]): { [key: string]: User } => {
    const hashMap: { [key: string]: User } = {};
    users.forEach(user => {
        hashMap[user.name] = user;
    });
    return hashMap;
}

/**
 * Accepts an array of users and sorts
 * the array by users name, then age.
 */
export const sortUsers = (users: User[]): User[] => {
    return users.sort((a, b) => {
        if (a.name === b.name) {
            return a.age - b.age;
        }
        return a.name > b.name ? 1 : -1;
    });
}