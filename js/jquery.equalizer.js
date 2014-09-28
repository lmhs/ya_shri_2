;(function($) {
  
    var defaults = {
        timeout: 5000,
        colWidth: 2
    };
  
    function setEqualizer(element, timeout, colWidth) {
        var colQuantity     = getQuantity(element,colWidth),
            transitionProp  = 'height ' + timeout/1000 + 's linear',
            colsHTML        = '',
            col             = '<div class="col"></div>',
            cols            = null,
            elH             = $(element).height();

        
        for (var i = 0; i < colQuantity; i++) {
            colsHTML += col;
        }

        $(element).append(colsHTML);

        cols = $(element).find('.col');

        cols.width(colWidth);

        if (supportsTransitions()) {
            run_equalizerTrans(element, cols, elH, timeout, transitionProp);
        } else {
            run_equalizerNoTrans(element, cols, elH, timeout);
        }
    }
      
    function run_equalizerTrans (element, cols, elH, timeout, transitionProp) {
        cols.each(function () {
            var colHeight = getRandomHeight(elH);
            $(this).height(colHeight);
        });

        setTimeout(function() {
            cols.css(
                {
                    WebkitTransition  : transitionProp,
                    MozTransition     : transitionProp,
                    OTransition       : transitionProp,
                    transition        : transitionProp,
                    height            : elH/2
                }
            );
            setTimeout(function() {
                run_equalizerTrans(element, cols, elH, timeout, transitionProp);
            }, timeout);
        }, timeout);
    }

    function run_equalizerNoTrans (element, cols, elH, timeout) {
        $.when(
            cols.animate(
                { height: elH/2 },
                timeout,
                'linear'
            ).each(function() {
                $(this).animate(
                    { height: getRandomHeight(elH) },
                    timeout,
                    'linear'
                );
            }).promise()
        ).done(function() {
            run_equalizerNoTrans(element, cols, elH, timeout);
        });
    }
  
    $.fn.equalizer = function(options) {
    
        var config = $.extend({},defaults,options);

        return this.each(function() {
            setEqualizer(this,config.timeout,config.colWidth);
        });
    };

    function getQuantity(elem,width) {
        return Math.ceil($(elem).width()/width);
    }

    function getRandomHeight(h) {
        return Math.round(h * Math.random());
    }

    function supportsTransitions() {
        var b = document.body || document.documentElement,
            s = b.style,
            p = 'transition';

        if (typeof s[p] == 'string') { return true; }

        // Tests for vendor specific prop
        var v = ['moz', 'webkit', 'o'];
        p = p.charAt(0).toUpperCase() + p.substr(1);

        for (var i=0; i<v.length; i++) {
            if (typeof s[v[i] + p] == 'string') { return true; }
        }

        return false;
    }
  
})(jQuery);