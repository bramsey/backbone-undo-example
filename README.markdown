# Backbone Undo Example

This project uses sinatra and backbone.js to provide an example of a basic editable item list with undoable changes.  Instead of asking the user to confirm commonly irreversable actions, this list makes them reversable.  

Item change and delete actions are made reversable by storing the item's previous state in an action object on the items collection and providing the ability to revert when a link with the id "undo" is clicked by the user.
