import { Course } from '../courses/course';

export class User {
    _id: number;
    email: string;
    auth0Id: string;
    createdAt: string;
    courses: Course[];
    admin: boolean;

    constructor(){}
}
