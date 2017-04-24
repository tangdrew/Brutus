import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Term } from './term';

declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'term-tabs',
  templateUrl: 'term-tabs.component.html',
  styleUrls: ['term-tabs.component.css'],
})

export class TermTabsComponent {

  @Input() term: Term;
  @Input() terms: Term[];
  @Output() activeTerm = new EventEmitter<Term>();

  constructor() {}

  ngAfterViewInit(){
    var hidWidth;
    var scrollBarWidths = 40;

    var widthOfList = function(){
      var itemsWidth = 0;
      $('.list li').each(function(){
        var itemWidth = $(this).outerWidth();
        itemsWidth+=itemWidth;
      });
      return itemsWidth;
    };

    var widthOfHidden = function(){
      return (($('.wrapper').outerWidth())-widthOfList()-getLeftPosi())-scrollBarWidths;
    };

    var getLeftPosi = function(){
      return $('.list').position().left;
    };

    var reAdjust = function(){
      if (($('.wrapper').outerWidth()) < widthOfList()) {
        $('.scroller-right').show();
      }
      else {
        $('.scroller-right').hide();
      }

      if (getLeftPosi()<0) {
        $('.scroller-left').show();
      }
      else {
        $('.item').animate({left:"-="+getLeftPosi()+"px"},'slow');
      	$('.scroller-left').hide();
      }
    }

    reAdjust();

    $(window).on('resize',function(e){
      	reAdjust();
    });

    $('.scroller-right').click(function() {

      $('.scroller-left').fadeIn('slow');
      $('.scroller-right').fadeOut('slow');

      $('.list').animate({left:"+="+widthOfHidden()+"px"},'slow',function(){

      });
    });

    $('.scroller-left').click(function() {

    	$('.scroller-right').fadeIn('slow');
    	$('.scroller-left').fadeOut('slow');

      	$('.list').animate({left:"-="+getLeftPosi()+"px"},'slow',function(){

      	});
    });

    $('.scroller-left').click();
  }

}
