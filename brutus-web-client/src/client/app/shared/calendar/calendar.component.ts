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

    constructor() {
      this.term = new Term();
    }

    ngOnChanges(changes: SimpleChanges) {
      if(changes.courses) {
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
          let dayNumbers = this.meetingDaysToNumbers(course.meeting_days);
          dayNumbers.forEach(num => {
            events.push(this.formatEvent(course, num));
          });
        }
        if(course.componentIndex != null) {
          let component: any = course.course_components[course.componentIndex];
          component.id = course.id;
          component.subject = course.subject;
          component.catalog_num = course.catalog_num + ' - ' + component.component;
          let dayNumbers = this.meetingDaysToNumbers(component.meeting_days);
          dayNumbers.forEach(num => {
            events.push(this.formatEvent(component, num));
          });
        }
      });
      return events;
    }

    meetingDaysToNumbers(meeting_days: string): number[] {
      let dayNumbers: number[] = [];
      if(meeting_days.includes('Su')) {
        dayNumbers.push(0);
      }
      if(meeting_days.includes('Mo')) {
        dayNumbers.push(1);
      }
      if(meeting_days.includes('Tu')) {
        dayNumbers.push(2);
      }
      if(meeting_days.includes('We')) {
        dayNumbers.push(3);
      }
      if(meeting_days.includes('Th')) {
        dayNumbers.push(4);
      }
      if(meeting_days.includes('Fr')) {
        dayNumbers.push(5);
      }
      if(meeting_days.includes('Sa')) {
        dayNumbers.push(6);
      }
      return dayNumbers;
    }

    formatEvent(course: any, daysAhead: number) {
      let date = this.startDate.format('YYYY-MM-DD');
      let newDate = moment(date).add(daysAhead, 'd');
      return {
        id: course.id,
        title: course.subject + ' ' + course.catalog_num,
        start: newDate.format('YYYY-MM-DD') + 'T' + course.start_time,
        end: newDate.format('YYYY-MM-DD') + 'T' + course.end_time,
        url: '/course/' + course.id
      }
    }
}
