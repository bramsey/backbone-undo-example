$(function() {
	var Item = Backbone.Model.extend({
		initialize: function() {
			this.bind('change', this.storeAction, this);
			this.bind('destroy', this.storeAction, this);
		},
		
		storeAction: function(event) {
			var attributes = this.previousAttributes(), action = {};
			if (attributes.id) {
				action.attributes = attributes;
				if (event._changing) {
					action.type = 'change';
					action.model = this;
					action.undo = function () {
						this.model.save(this.attributes);
					};
				} else {// destroy action
					action.type = 'destroy';
				}
				this.trigger('undoableAction', action);			
			}
		}
	});

	var ItemList = Backbone.Collection.extend({
		model: Item,
		url: 'http://localhost:4567/items', 
		initialize: function() {
			this.bind('undoableAction', this.storeLastAction, this);
		},
		
		storeLastAction: function(event) {
			this.lastAction = event;
			if (event.type === 'destroy') {
				this.lastAction.list = this;
				this.lastAction.undo = function () {
					this.list.create(this.attributes);
					this.list.lastAction = null;
				};
			}
		}
	});

	var items = new ItemList;

	var ItemView = Backbone.View.extend({
		tagName: 'li',
		className: 'item',
		template: _.template("<div class='item-content'><%=content%></div><span class='item-destroy'>X</span><input type='text' class='item-input' value='<%=content%>' />"),
		
		events: {
			'click .item-content': 'edit',
			'click .item-destroy': 'clear',
			'keyup .item-input': 'updateOnEnter',
			'blur .item-input': 'close',
			'mouseover .item-destroy': 'warnDelete',
			'mouseout .item-destroy': 'unwarnDelete'
		},
		
		initialize: function() {
			this.model.bind('change', this.render, this);
			this.model.bind('destroy', this.remove, this);
			this.model.bind('undoableAction', this.showUndo, this);
			this.model.view = this;
	    },
	
		render: function() {
			this.$el.html(this.template(this.model.toJSON()));
			this.input = this.$('.item-input');
			
			return this;
		},
		
		edit: function() {
			this.$el.addClass('editing');
			this.input.focus();
		},
		
		close: function() {
			var value = this.input.val();
			if (!value) this.clear();
			if (this.model.get('content') !== value) this.model.save({content: value});
			this.$el.removeClass("editing");
	    },
	
		updateOnEnter: function(e) {
			if (e.keyCode == 27) {
				this.input.val(this.model.get('content'));
				this.$el.removeClass("editing");
				return;
			}
			if (e.keyCode == 13) {
				this.$el.find('.item-input')[0].blur();
				this.$el.removeClass("editing");
			}
	    },
	
		clear: function() {
			this.model.destroy();
	    },
	
		warnDelete: function() {
			this.$el.css('background', '#f66');
		},
		
		unwarnDelete: function() {
			this.$el.css('background', '');
		},
		
		showUndo: function() {
			var $undo = $('#undo');
			$undo.show();
			/*setTimeout(function() {
				$undo.hide();
			}, 10000);*/
		}
	});

	var ListView = Backbone.View.extend({
		el: $('#list'),
		
		events: {
			'keypress #new-item': 'createOnEnter',
			'click #undo': 'undoAction'
		},
		
		initialize: function() {
			_.bindAll(this, 'addOne', 'addAll', 'render');
			
			this.input = this.$('#new-item');
			
			items.bind('add', this.addOne, this);
			items.bind('reset', this.addAll, this);
			items.bind('all',  this.render, this);
			
			items.fetch();
		},
		
		addOne: function(item) {
			var view = new ItemView({model: item}).render().el;
			this.$('#items').append(view);
		},
		
		addAll: function() {
			items.each(this.addOne);
		},
		
		createOnEnter: function(e) {
			if (e.keyCode != 13) return;
			if (!this.input.val()) return;
			
			items.create({
				content: this.input.val()
			});
			this.input.val('');
		},
		
		undoAction: function() {
			var action = items.lastAction;
			action.undo();
			$('#undo').hide();
			return false;
		}
	});
	
	var list = new ListView;
});