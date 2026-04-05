// Fix for passive event listener warnings in Cocos2d-js
// This script must run BEFORE cocos2d-js is loaded

(function() {
    'use strict';
    
    console.log('Applying passive event listener fix for Cocos2d-js...');
    
    // Store original addEventListener BEFORE cocos2d-js loads
    var originalAddEventListener = EventTarget.prototype.addEventListener;
    
    // Override addEventListener to automatically add passive option for touch/wheel events
    EventTarget.prototype.addEventListener = function(type, listener, options) {
        var newOptions = options;
        
        // Auto-add passive:true for scroll-blocking events
        if (type === 'mousewheel' || type === 'wheel' || type === 'DOMMouseScroll' || 
            type === 'touchstart' || type === 'touchmove') {
            
            // Only add passive if not already specified
            if (typeof options === 'object') {
                if (options.passive === undefined) {
                    newOptions = Object.assign({}, options, { passive: true });
                }
            } else if (options === undefined || options === null) {
                // No options provided, add passive: true
                newOptions = { passive: true };
            } else if (typeof options === 'boolean') {
                // Options is useCapture boolean, convert to object
                newOptions = { passive: true, capture: options };
            }
            
            // Only log in debug mode
            if (window._CCSettings && window._CCSettings.debug) {
                console.log('Auto-added passive:true to ' + type + ' event listener');
            }
        }
        
        // Call original addEventListener
        return originalAddEventListener.call(this, type, listener, newOptions);
    };
    
    // Also patch touch events globally for better performance
    ['touchstart', 'touchmove'].forEach(function(eventName) {
        document.addEventListener(eventName, function() {}, { passive: true });
    });
    
    console.log('Passive event listener fix applied successfully');
    
    // Export for debugging
    window._passiveFixApplied = true;
})();