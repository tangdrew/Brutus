import { Component, Input, SimpleChanges } from '@angular/core';
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
    @Input() colorClass: string;
    startDate: any
    events: any

    constructor() {}

    ngOnChanges(changes: SimpleChanges) {
      //Once the data is loaded the first time, initialize the calendar
      if(this.courses && !changes.courses.previousValue) {
        this.startDate = moment(this.term.start_date).startOf('week');
        this.events = this.mapCoursesToCalEvents(this.courses);
        this.initializeCalendar(this.courses);
      }

      //When courses list changes after first load, add or remove course from calendar
      if(changes.courses.previousValue) {
        //Remove any old events
        let newEvents = this.mapCoursesToCalEvents(changes.courses.currentValue);
        this.events.forEach((event: any) => {
          let flag = true;
          newEvents.forEach((newEvent) => {
            if(event.id == newEvent.id) {
              flag = false;
            }
          });
          if(flag) {
            $('#calendar').fullCalendar('removeEvents', event.id);
          }
        })
        //Add any new events
        newEvents.forEach((newEvent) => {
          let flag = true;
          this.events.forEach((event: any) => {
            if(newEvent.id == event.id) {
              flag = false;
            }
          });
          if(flag) {
            $('#calendar').fullCalendar('renderEvent', newEvent);
          }
        })

        this.events = newEvents;
      }
    }

    initializeCalendar(courses: Course[]) {
      console.log('rendering cal');
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
        //Check if meeting_days exists
        if(course.meeting_days) {
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
        }
      });
      return events;
    }

    formatEvent(course: Course, daysAhead: number) {
      let date = this.startDate.format('YYYY-MM-DD');
      let newDate = moment(date).add(daysAhead, 'd');
      return {
        id: course._id,
        title: course.title,
        start: newDate.format('YYYY-MM-DD') + 'T' + course.start_time,
        end: newDate.format('YYYY-MM-DD') + 'T' + course.end_time,
        url: '/course/' + course._id
      }
    }
}
