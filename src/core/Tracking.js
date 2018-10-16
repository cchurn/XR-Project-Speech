/* global $AD*/
/**
 * Add new events here and also add to the switch/case in either trackClick or trackEvent
 */
export let tracked_events = {
    EXAMPLE_TRACKED_EVENT: 'example tracked event',
    TAP_TO_WEBSITE: 'tap to website'
};
/**
 * Track clicks
 */
export function trackClick(e) {
    console.log('%c Tracking click: '+ e +' ', 'background: #ffcc00; color: #000000');
    try {
        switch (e) {
            case tracked_events.TAP_TO_WEBSITE:
                $AD.click('tap to website', 'http://www.oath.com');
                break;
            default:
        }
    } catch(err) {
        console.log('Failed to track click (probably local):', e);
    }
}
/**
 * Track events
 */
export function trackEvent(e) {
    console.log('%c Tracking event: '+ e +' ', 'background: #4caf50; color: #ffffff');
    try {
       switch (e) {
           case tracked_events.EXAMPLE_TRACKED_EVENT:
               $AD.event('example tracked event');
               break;
           default:
       }
    } catch(err) {
        console.log('Failed to track event (probably local):', e);
    }
}