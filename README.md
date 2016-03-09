# WindX -- Keep your windows clean -- 
A javascript library that allows you to manage the state of your browser for responsive design. It is based on modules that extend the base client module.

# Modules
1. client
2. client.version
3. client.viewport
  - client.viewport.initViewport @return object {w,h}
  - client.viewport.getViewport @return function
  - client.viewport.getViewportWidth @return function
  - client.viewport.getViewportHeight @return function
4. client.predicates
  - client.predicates.isMobile @return boolean
  - client.predicates.isLargeMobile @return boolean
  - client.predicates.isTablet @return boolean
  - client.predicates.isDesktop @return boolean
  - client.predicates.isLargeDesktop @return boolean
  - client.predicates.containsMobile @return boolean
  - client.predicates.containsLargeMobile @return boolean
  - client.predicates.containsTablet @return boolean
  - client.predicates.containsDesktop @return boolean
  - client.predicates.containsLargeDesktop @return boolean
5. client.predicates.actions
  - client.predicates.actions.scrollX @return number int
  - client.predicates.actions.scrollY @return number int debounce()
  - client.predicates.actions.removeWindxState @return function
  - client.predicates.actions.toggleStickyFooter @return function
  - client.predicates.actions.setWindowState @return function
  - client.predicates.actions.setPanelHeight @return void
  - client.predicates.actions.resize @return function
  - client.predicates.actions.init @exec client
