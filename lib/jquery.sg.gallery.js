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
     // jQuery.support.transition
     // to verify that CSS3 transition is supported (or any of its browser-specific implementations)
     // https://gist.github.com/373874
     $.support.transition = (function(){
				 var thisBody = document.body || document.documentElement,
				 thisStyle = thisBody.style,
				 support = thisStyle.WebkitTransition !== undefined || 
				     thisStyle.MozTransition !== undefined || 
				     thisStyle.OTransition !== undefined || 
				     thisStyle.transition !== undefined;
				 return support;
			     })();
     // create the gallery in the wrapped set
     $.fn.gallery = function(callerSettings) {
	 var settings = {prevBtn: '#sg-prev',
			 nextBtn: '#sg-next',
			 startIdx: 0,
			 opacity: 0.5, 
			 opacityDelay: 0.5, 
			 moveDelay: 1,
			 startX: 0,
			 fullScreen: false
			};
	 settings = $.extend(settings, callerSettings||{});
	 //the current photo
	 var current = settings.startIdx;
	 // get the base url of the script: needed to find images
	 var source = $('script[src*="jquery.sg.gallery"]:first');
	 var baseurl = "";
	 if (source.length !== 0) {
	     var sourceUrl = source.attr('src');
	     baseurl = sourceUrl.substring(0, sourceUrl.indexOf("jquery.sg.gallery"));
	 }
	 var container = this;
	 $(this).addClass('sg-gallery');
	 var imgs = $(this).children("img");
	 var nImgs = imgs.length;
	 // set height of the container
	 if (settings.fullScreen === true) { 
	     //fullscreen: set container height to the max(image height, window height)
	     if ($(imgs[0]).height() > $(window).height()) {
		 $(this).css('height', $(window).height());		 
	     } else {
		 $(this).css('height', $(imgs[0]).height());		 
	     }
	 } else {
	     //set container height to the height of the first image
	     $(this).css('height', $(imgs[0]).height());
	 }
	 var transitionStr = 'opacity '+settings.opacityDelay+'s ease-in-out, left '+settings.moveDelay+'s ease-in-out';
	 var imgCss = {
	     '-o-transition': transitionStr,
	     '-webkit-transition': transitionStr,
	     '-moz-transition': transitionStr,
	     transition: transitionStr,
	     zoom: 1 //ie hack to make alpha filters work
	 };
	 // position of the first image relative to the containing box
	 var pos = {x: 0, y: 0};
	 imgs.each(function(index) {
		       imgCss['left'] = settings.startX+pos.x+'px';
		       $(this).addClass('sg-gallery-img');
		       $(this).css(imgCss);
		       pos.x += $(this).width();
		       if(index !== settings.startIdx) {
			   $(this).css('opacity', settings.opacity);
			   $(this).css('-ms-filter', 
				       "progid:DXImageTransform.Microsoft.Alpha(Opacity="+settings.opacity*100+")");
			   $(this).css('filter', 'alpha(opacity = '+settings.opacity*100+')');
		       }
		       // bind full-trasparency event
		       $(this).bind('full-trasparency', function() {
					// set full trasparency on the image
					$(this).css('opacity', 1); //fully trasparent
					$(this).css('-ms-filter', 
						    "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)");
					$(this).css('filter', 'alpha(opacity = 100)');
				    });
		       // add click event to each image
		       $(this).click(function() {
					 current = index;
					 var clickedImg = this;
					 //apply opacity to the transparent image
					 imgs.each(function() {
						       if ($(this).css('opacity') !== settings.opacity) {
							   $(this).css('opacity', settings.opacity);
							   $(this).css('-ms-filter', 
								       'progid:DXImageTransform.Microsoft.Alpha(Opacity='+settings.opacity*100+')');
							   $(this).css('filter', 'alpha(opacity = '+settings.opacity*100+')');
						       }
						   });
					 //move images in containing div
					 var pxLeft = settings.startX + $(clickedImg).position().left;
					 var toMove = $(container).children("img");
					 toMove.each(function() {
							 if ($.support.transition) {
							     $(this).css('left', $(this).position().left - pxLeft);
							 } else {
							     $(this).animate({'left': $(this).position().left - pxLeft},
									     settings.moveDelay*1000);
							 }
						     });
					 var trigger = function() {
					     $(clickedImg).trigger('full-trasparency');
					 };
					 setTimeout(trigger, settings.moveDelay*1000);
				     });
		   });
	 //add styles and hover behaviour to prev and next buttons
	 $(settings.prevBtn).css({'height': $(container).css('height'),
				  'background': 'url('+baseurl+'images/sg-blank.gif) left 45% no-repeat'
				 });
	 $(settings.nextBtn).css({'height': $(container).css('height'),
				  'background': 'url('+baseurl+'images/sg-blank.gif) right 45% no-repeat'});
	 $(settings.prevBtn).hover(function() {
				       if (current > 0) {
					   $(this).css('background', 
						   'url('+baseurl+'images/sg-btn-prev.gif) left 45% no-repeat');
				       }
				   },
				   function() {
				       $(this).css('background', 
						   'url('+baseurl+'images/sg-blank.gif) left 45% no-repeat');
				   });
	 $(settings.nextBtn).hover(function() {
				       if (current < nImgs-1) {
					   $(this).css('background', 
						       'url('+baseurl+'images/sg-btn-next.gif) right 45% no-repeat');
				       }
				   },
				   function() {
				       $(this).css('background', 
						   'url('+baseurl+'images/sg-blank.gif) right 45% no-repeat');
				   });
	 //bind click on next and previous image
	 $(settings.prevBtn).click(function () {
				       if (current > 0) {
					   current -= 1;
					   $(imgs[current]).trigger('click');
				       }
				   });
	 $(settings.nextBtn).click(function () {
				       if (current < nImgs-1) {
					   current += 1;
					   $(imgs[current]).trigger('click');
				       }
				    });
     };
})(jQuery);