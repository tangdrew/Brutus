export class Course {
    _id: number;
    title: string;
    term: string;
    school: string;
    instructor: Object;
    subject: string;
    catalog_num: string;
    section: string;
    room: Object;
    meeting_days: string;
    start_time: string;
    end_time: string;
    start_date: string;
    end_date: string;
    seats: number;
    overview: string;
    topic: string;
    attributes: string;
    requirements: string;
    component: string;
    class_num: number;
    course_id: number;
    score: number;
    course_descriptions: [Object];
    course_component: [Object];

    constructor(){}
}
