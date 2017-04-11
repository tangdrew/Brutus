import { Component, Input } from '@angular/core';
import { Course } from '../courses/course';
import { Term } from '../terms/term';

declare var $: any;
declare var moment: any;

@Component({
  moduleId: module.id,
  selector: 'calendar',
  templateUrl: 'calendar.component.html',
  styleUrls: ['calendar.component.css'],
})

export class CalendarComponent {

    @Input() courses: Course[];
    @Input() term: Term;
    startDate: any

    constructor() {}

    ngOnChanges() {
      //Once the data is loaded, initialize the calendar
      if(this.courses) {
        this.startDate = moment(this.term.start_date).startOf('week');
        this.initializeCalendar(this.courses);
      }
    }

    initializeCalendar(courses: Course[]) {
      $('#calendar').fullCalendar({
                    theme: true,
                    defaultView: 'agendaWeek',
                    defaultDate: this.startDate,
                    height: "auto",
                    header: false,
                    allDaySlot: false,
                    minTime: "07:00:00",
                    maxTime: "22:00:00",
                    selectable: true,
                    editable: false,
                    eventLmit: true,
                    eventBackgroundColor: "#634b89",
                    eventTextColor: "#fff",
                    color: "#634b89",
                    timeFormat: 'h(:mm)t',
                    columnFormat: 'ddd',
                    events: this.mapCoursesToCalEvents(this.courses)
                });
    }

    mapCoursesToCalEvents(courses: Course[]): any[] {
      let events: any[] = [];
      courses.forEach(course => {
        if(course.meeting_days.includes('Su')) {
          events.push(this.formatEvent(course, 0));
        }
        if(course.meeting_days.includes('Mo')) {
          events.push(this.formatEvent(course, 1));
        }
        if(course.meeting_days.includes('Tu')) {
          events.push(this.formatEvent(course, 2));
        }
        if(course.meeting_days.includes('We')) {
          events.push(this.formatEvent(course, 3));
        }
        if(course.meeting_days.includes('Th')) {
          events.push(this.formatEvent(course, 4));
        }
        if(course.meeting_days.includes('Fr')) {
          events.push(this.formatEvent(course, 5));
        }
        if(course.meeting_days.includes('Sa')) {
          events.push(this.formatEvent(course, 6));
        }
      });
      return events;
    }

    formatEvent(course: Course, daysAhead: number) {
      let date = this.startDate.format('YYYY-MM-DD');
      let newDate = moment(date).add(daysAhead, 'd');
      return {
        title: course.title,
        start: newDate.format('YYYY-MM-DD') + 'T' + course.start_time,
        end: newDate.format('YYYY-MM-DD') + 'T' + course.end_time
      }
    }
}
