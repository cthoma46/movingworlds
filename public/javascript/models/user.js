(function(User) {
 
 // Define a user
 User.Model = Backbone.Model.extend({
   initialize: function() {
     // Add a nested messages collection
     this.set({ messages: new Message.List() });
   }
 });

 // Define a user list
 User.List = Backbone.Collection.extend({
   model: User.Model
 });

})(mw.module("user"));