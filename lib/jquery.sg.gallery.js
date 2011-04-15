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
     var overlay = function(wrappedSet, current, settings) {
	 wrappedSet.append('<div id="sg-overlay"></div>');
	 var overlayStyle = {
	     position: 'absolute',
	     'z-index': 10,
	     top: 0,
	     left: $(current).width(),
	     width: '100%',
	     height: $(current).height(),
	     'background-color': 'rgba(0, 0, 0, '+settings.opacity+')'	     
	 };
	 $('#sg-overlay').css(overlayStyle);
     };

     // create the gallery in the wrapped set
     $.fn.gallery = function(callerSettings) {
	 var settings = {opacity: 0.5};
	 settings = $.extend(settings, callerSettings||{});
	 var imgs = $(this).children("img");
	 var pos = {x: 0, y: 0};
	 var imgCss = {
	     '-moz-transition': 'all 02s ease-in-out',
	     transition: 'all 02s ease-in-out',
	     position: 'absolute',
	     top: 0,
	     'z-index': 0
	 };
	 imgs.each(function(index) {
		       imgCss['left'] = pos.x+'px';
		       $(this).css(imgCss);
		       pos.x += $(this).width();
		       if(index !== 0) {
			   $(this).css('opacity', settings.opacity);			   
		       }
		       // add click event
		       $(this).click(function() {
					 //apply opacity to all images
					 imgs.each(function(imgIndex) {
						       $(this).css('opacity', settings.opacity);
						   });
					 // set full trasparency on the clicked one
					 $(this).css('opacity', 1); //fully trasparent
				     });
		   });
	 var current = imgs[0]; //the first photo is the current one
	 //overlay(this, current, settings);
     };
})(jQuery);