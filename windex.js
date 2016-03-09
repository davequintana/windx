/**
 * Author: Dave Quintana (c) 2016
 * Created by davequintana on 3/5/16.
 * https://github.com/davequintana/windx
 * Version: 1.0.0
 * WindX -- Keep your windows clean -- is a javascript library that allows you to manage the state
 * of your browser for responsive design. It is based on modules that extend the base client module.
 * License: MIT License
 * The MIT License (MIT)
 * Copyright (c) 2016 Dave Quintana
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:

 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
 * OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * Modules: windx
 *            |-  client
 *                  |-  version
 *                  |-  viewport
 *                  |      |-  initViewport         @return object {h,w}
 *                  |      |-  getViewport          @return function
 *                  |      |-  getViewportWidth     @return function
 *                  |      |-  getViewportHeight    @return function
 *                  |-  predicates
 *                  |      |-  isMobile             @return boolean
 *                  |      |-  isLargeMobile        @return boolean
 *                  |      |-  isTablet             @return boolean
 *                  |      |-  isDesktop            @return boolean
 *                  |      |-  isLargeDesktop       @return boolean
 *                  |      |-  containsMobile       @return boolean
 *                  |      |-  containsLargeMobile  @return boolean
 *                  |      |-  containsTablet       @return boolean
 *                  |      |-  containsDesktop      @return boolean
 *                  |      |-  containsLargeDesktop @return boolean
 *                  |-  actions
 *                         |- scrollX               @return int
 *                         |- scrollY               @return int
 *                         |- removeWindxState      @return function
 *                         |- toggleStickyFooter    @return function
 *                         |- setWindowState        @return function
 *                         |- setPanelHeight        @return void
 *                         |- resize                @return function
 *                         |- init                  @exec client
 *
 */

// polyfill to allow for NodeLists to forEach
if ( ! NodeList.prototype.forEach ) {
  NodeList.prototype.forEach = Array.prototype.forEach;
}

// polyfill to allow for efficient call of scrolling and resizing functions
// credit David Walsh: https://davidwalsh.name/javascript-debounce-function
// and Jeremy Ashkenas: http://underscorejs.org/docs/underscore.html
function debounce(func, wait, immediate) {

  "use strict";

  var timeout;

  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) {
        func.apply(context, args);
      }
    };

    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) {
      func.apply(context, args);
    }

  };

}

/* Check to see if the global object exists, if it does
 * exist then init it, if not, create the module
 * We are passing in the window object and undefined
 * for efficiency when it is minified
 */
var windx = windx || (function(window, undefined) {

  "use strict";

  var client = client || {};
  client.version = '1.0';
  // cache internal DOM queries.
  var _doc = typeof document !== 'undefined' && document.body;
  var _windxClasses = _doc.classList;

  /*
   * Module: client.viewport
   * @returns: initViewport:object,
   *           getViewport:function,
   *           getViewportWidth:function,
   *           getViewportHeight:function
   */
  client.viewport =  client.viewport || (function() {

    var initViewport = {
      'width' : _doc.clientWidth,
      'height' : _doc.clientHeight
    };

    function getViewport() {

      return {
        'width' : getViewportWidth,
        'height' : getViewportHeight
      };

    }

    function getViewportWidth() {
      return document.body.clientWidth;
    }

    function getViewportHeight() {
      return document.body.clientHeight;
    }

    return {
      'initViewport': initViewport,
      'getViewport' : getViewport(),
      'getViewportWidth' : getViewportWidth,
      'getViewportHeight' : getViewportHeight
    };

  })();

  /*
   * Module: client.predicates
   * @returns: isMobile:boolean
   *           isLargeMobile:boolean
   *           isTablet:boolean
   *           isDesktop:boolean
   *           isLargeDesktop:boolean
   *           containsMobile:boolean
   *           containsLargeMobile:boolean
   *           containsDesktop:boolean
   *           containsLargeDesktop:boolean
   *
   */
  client.predicates = client.predicates || (function() {

    var _getWidth = client.viewport.getViewportWidth;

    function isMobile() {
      return _getWidth() <= 480;
    }

    function isLargeMobile() {
      return _getWidth() > 480 && _getWidth() <= 800;
    }

    function isTablet() {
      return _getWidth() > 800 && _getWidth() <= 1000;
    }

    function isDesktop() {
      return _getWidth() > 1000 && _getWidth() <= 1300;
    }

    function isLargeDesktop() {
      return _getWidth() > 1300;
    }

    function containsMobile() {
      return _windxClasses.contains('mobile');
    }

    function containsLargeMobile() {
      return _windxClasses.contains('large-mobile');
    }

    function containsTablet() {
      return _windxClasses.contains('tablet');
    }

    function containsDesktop() {
      return _windxClasses.contains('desktop');
    }

    function containsLargeDesktop() {
      return _windxClasses.contains('large-desktop');
    }

    return {
      'isMobile' : isMobile,
      'isLargeMobile' : isLargeMobile,
      'isTablet' : isTablet,
      'isDesktop' : isDesktop,
      'isLargeDesktop' : isLargeDesktop,
      'containsMobile' : containsMobile,
      'containsLargeMobile' : containsLargeMobile,
      'containsTablet' : containsTablet,
      'containsDesktop' : containsDesktop,
      'containsLargeDesktop' : containsLargeDesktop
    };

  })();

  /*
   * Module: client.actions
   * @return: scrollX:int
              scrollY:int:debounce
              removeWindxState:function
              toggleStickyFooter:function
              setWindowState:function
              resize:function:debounce
              init:exec
   */
  client.actions = client.actions || (function(window) {

    function scrollX() {
      return window.pageXOffset;
    }

    function scrollY() {
      return window.pageYOffset;
    }

    function removeWindxState() {
      return _windxClasses.remove('mobile','large-mobile','tablet','desktop','large-desktop');
    }

    function toggleStickyFooter() {

      if ( window.innerHeight > document.body.clientHeight ) {
        return document.body.classList.add('sticky-footer');
      } else {
        return document.body.classList.remove('sticky-footer');
      }

    }

    function setWindowState() {

      var predicates = client.predicates;

      if ( predicates.isMobile() && !predicates.containsMobile() ) {
        removeWindxState();
        _windxClasses.add('mobile');
      } else if ( predicates.isLargeMobile() && !predicates.containsLargeMobile() ) {
        removeWindxState();
        _windxClasses.add('large-mobile');
      } else if ( predicates.isTablet() && !predicates.containsTablet() ) {
        removeWindxState();
        _windxClasses.add('tablet');
      } else if ( predicates.isDesktop() && !predicates.containsDesktop() ) {
        removeWindxState();
        _windxClasses.add('desktop');
      } else if ( predicates.isLargeDesktop() && !predicates.containsLargeDesktop() ) {
        removeWindxState();
        _windxClasses.add('large-desktop');
      }

    }

    function setPanelHeight() {
      // TODO: abstract out to a function that sets the aspect ratio independently
      var panel = document.querySelectorAll('[class*="panel-"]'),
          classList = document.body.classList,
          aspect = (window.outerHeight / window.outerWidth);

      if ( aspect >= 0 && aspect < 0.75 ) {
        // wide screens get the full height
        classList.remove('portrait','super-portrait');
        classList.add('landscape');
      } else if ( aspect >= 0.75 && aspect < 1.5 ) {
        // desktop to tablet should have a class to blow up the size
        classList.remove('super-portrait', 'landscape');
        classList.add('portrait');
      } else if  ( aspect >= 1.5 ) {
        // mobile should apply aspect ratio class to double the size
        classList.remove('landscape','portrait');
        classList.add('super-portrait');
      }
      panel.forEach(function(item) {
        if ( aspect >= 1.5 ) {
          item.style.height = (window.outerHeight / aspect)  + 'px';
        } else {
          item.style.height = window.outerHeight + 'px';
        }
      });

    }

    function resize() {
      toggleStickyFooter();
      setPanelHeight();
      setWindowState();
    }

    function init() {

      var lastScrollPosition = 0;
      toggleStickyFooter();
      setWindowState();
      setPanelHeight();

      window.onresize = debounce(function() {
        return resize.call(this);
      }, 50);

    }

    return {
      'scrollX' : scrollX,
      'scrollY' : scrollY,
      'removeWindxState': removeWindxState,
      'toggleStickyFooter' : toggleStickyFooter,
      'setWindowState' : setWindowState,
      'resize' : resize,
      'init' : init
    };

  })(window);

  client.actions.init();

  return client;

})(window, undefined);


// TODO: implement scrolling events for up and down and determine offsets for elements to be sticky
//function hideNavigation() {
//  document.body.classList.remove('hidden-main-navigation');
//}
//
//function showNavigation() {
//  document.body.classList.add('hidden-main-navigation');
//}
//
//function setNavigationState() {
//  if ( document.getElementById('main-navigation') !== 'undefined' ) {
//    document.body.classList.add('main-navigation');
//  }
//}
//window.onscroll = debounce(function() {
//  var newScrollPosition = window.scrollY;
//
//  if (newScrollPosition < lastScrollPosition) {
//    hideNavigation.call(this);
//  } else {
//    showNavigation.call(this);
//  }
//  lastScrollPosition = newScrollPosition;
//}, 2);
//setNavigationState();
//_windxTypes = ['mobile','large-mobile','tablet','desktop','large-desktop'];

