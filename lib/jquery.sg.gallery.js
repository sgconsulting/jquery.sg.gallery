/***********************************
File:    jquery.sg.gallery.js
Author  : filippo pacini <filippo.pacini@gmail.com>
License :
The contents of this file are subject to the Mozilla Public
License Version 1.1 (the "License"); you may not use this file
except in compliance with the License. You may obtain a copy of
the License at http://www.mozilla.org/MPL/

Software distributed under the License is distributed on an "AS IS"
basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See
the License for the specific language governing rights and
limitations under the License.
The Initial Developer of the Original Code is S.G. Consulting
srl. Portions created by S.G. Consulting s.r.l. are Copyright (C)
2011 S.G. Consulting srl. All Rights Reserved.

************************************/
(function($){
     // create the gallery in the wrapped set
     $.fn.gallery = function(callerSettings) {
	 var settings = {prevBtn: '#prev',
			 nextBtn: '#next',
			 startIdx: 0,
			 opacity: 0.5, 
			 opacityDelay: 0.5, 
			 moveDelay: 1,
			 startX: 0
			};
	 settings = $.extend(settings, callerSettings||{});
	 var current = settings.startIdx; //the current photo
	 var container = this;
	 var imgs = $(this).children("img");
	 var transitionStr = 'opacity '+settings.opacityDelay+'s ease-in-out, left '+settings.moveDelay+'s ease-in-out';
	 var imgCss = {
	     '-o-transition': transitionStr,
	     '-webkit-transition': transitionStr,
	     '-moz-transition': transitionStr,
	     transition: transitionStr,
	     position: 'absolute',
	     top: 0,
	     'z-index': 0
	 };
	 // position of the first image relative to the containing box
	 var pos = {x: 0, y: 0};
	 imgs.each(function(index) {
		       imgCss['left'] = settings.startX+pos.x+'px';
		       $(this).css(imgCss);
		       pos.x += $(this).width();
		       if(index !== settings.startIdx) {
			   $(this).css('opacity', settings.opacity);			   
		       }
		       // bind full-trasparency event
		       $(this).bind('full-trasparency', function() {
					// set full trasparency on the image
					$(this).css('opacity', 1); //fully trasparent
				    });
		       // add click event to each image
		       $(this).click(function() {
					 current = index;
					 var clickedImg = this;
					 //apply opacity to all images
					 imgs.each(function() {
						       if ($(this).css('opacity') !== settings.opacity) {
							   $(this).css('opacity', settings.opacity);
						       }
						   });
					 //move images in containing div
					 var pxLeft = settings.startX + $(clickedImg).position().left;
					 var toMove = $(container).children("img");
					 toMove.each(function() {
							 $(this).css('left', $(this).position().left - pxLeft);
						     });
					 var trigger = function() {
					     $(clickedImg).trigger('full-trasparency');
					 };
					 setTimeout(trigger, 1000);
				     });
		   });
	 //bind click on next and previous image
	 $(settings.prevBtn).click(function () {
				       current -= 1;
				       $(imgs[current]).trigger('click');
				   });
	 $(settings.nextBtn).click(function () {
				       current += 1;
				       $(imgs[current]).trigger('click');
				    });
     };
})(jQuery);