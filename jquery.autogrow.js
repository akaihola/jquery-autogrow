/* 
 * Auto Expanding Text Area (1.2.2)
 * by Chrys Bader (www.chrysbader.com)
 * chrysb@gmail.com
 *
 * Special thanks to:
 * Jake Chapa - jake@hybridstudio.com
 * John Resig - jeresig@gmail.com
 *
 * Copyright (c) 2008 Chrys Bader (www.chrysbader.com)
 * Licensed under the GPL (GPL-LICENSE.txt) license. 
 *
 *
 * NOTE: This script requires jQuery to work.  Download jQuery at www.jquery.com
 *
 */
 
(function(jQuery) {
		  
	var self = null;
 
	jQuery.fn.autogrow = function(o)
	{	
		return this.each(function() {
			new jQuery.autogrow(this, o);
		});
	};
	

    /**
     * The autogrow object.
     *
     * @constructor
     * @name jQuery.autogrow
     * @param Object e The textarea to create the autogrow for.
     * @param Hash o A set of key/value pairs to set as configuration properties.
     * @cat Plugins/autogrow
     */
	
	jQuery.autogrow = function (e, o)
	{
		this.options		  	= o || {};
		this.dummy			  	= null;
		this.interval	 	  	= null;
		this.line_height	  	= this.options.lineHeight || parseInt(jQuery(e).css('line-height'));
		this.min_height		  	= this.options.minHeight || parseInt(jQuery(e).css('min-height'));
		this.max_height		  	= this.options.maxHeight || parseInt(jQuery(e).css('max-height'));;
		this.expand_callback		= this.options.expandCallback;
		this.textarea		  	= jQuery(e);
		
		// In IE if line-height is not specified in css, it will always return NaN
		if (jQuery.browser.msie && (isNaN(this.line_height))) {
			// set the line height for IE
			jQuery(e).css('line-height','100%');
			this.line_height=parseInt(jQuery(e).css('line-height'));
		}
		this.line_height = isNaN(this.line_height)? 0 : this.line_height;
		
		// Only one textarea activated at a time, the one being used
		this.init();
	};
	
	jQuery.autogrow.fn = jQuery.autogrow.prototype = {
    autogrow: '1.2.2'
  };
	
 	jQuery.autogrow.fn.extend = jQuery.autogrow.extend = jQuery.extend;
	
	jQuery.autogrow.fn.extend({
						 
		init: function() {			
			var self = this;			
			this.textarea.css({overflow: 'hidden', display: 'block'});
			this.textarea.bind('focus', function() { self.startExpand() } ).bind('blur', function() { self.stopExpand() });
			this.checkExpand();	
		},
						 
		startExpand: function() {				
		  var self = this;
			this.interval = window.setInterval(function() {self.checkExpand()}, 400);
		},
		
		stopExpand: function() {
			clearInterval(this.interval);	
		},
		
		checkExpand: function() {
			
			if (this.dummy == null)
			{
				this.dummy = jQuery('<div></div>');
				this.dummy.css({
					'font-size'  : this.textarea.css('font-size'),
					'font-family': this.textarea.css('font-family'),
					'width'      : this.textarea.css('width'),
					'padding-top'   : this.textarea.css('padding-top'),
					'padding-right' : this.textarea.css('padding-right'),
					'padding-bottom': this.textarea.css('padding-bottom'),
					'padding-left'  : this.textarea.css('padding-left'),
					'line-height': this.line_height + 'px',
					'overflow-x' : 'hidden',
					'position'   : 'absolute',
					'top'        : 0,
					'left'	 : -9999,
					'white-space': 'pre-wrap',
					'word-wrap': 'break-word'
				}).appendTo('body');
			}
			
			// Match dummy width (i.e. when using % width or "auto" and window has been resized)
			var dummyWidth = this.dummy.css('width');
			var textareaWidth = this.textarea.css('width');
			
			// Strip HTML tags
			var html = this.textarea.val().replace(/(<|>)/g, '');
			
			// IE is different, as per usual
			if (jQuery.browser.msie)
			{
				html = html.replace(/\n/g, '<BR>new');
			}
			else
			{
				html = html.replace(/\n/g, '<br>new');
			}
			
			// Grow if the text has been updated or textarea resized
			if (this.dummy.html() != html || dummyWidth != textareaWidth)
			{
				this.dummy.html(html);		 // update dummy content
				this.dummy.width(textareaWidth); // update dummy width to match
				
				if (this.max_height > 0 && (this.dummy.height() + this.line_height > this.max_height))
				{
					this.textarea.css('overflow-y', 'auto');	
				}
				else
				{
					this.textarea.css('overflow-y', 'hidden');
					if (this.textarea.height() < this.dummy.height() + this.line_height || (this.dummy.height() < this.textarea.height()))
					{	
						this.textarea.animate({height: (this.dummy.height() + this.line_height) + 'px'}, 100);	
					}
				}
			}
			
			if (this.expand_callback) {
				var self = this;
				window.setTimeout(function(){self.expand_callback()},500);
			}
		}
						 
	 });
})(jQuery);
