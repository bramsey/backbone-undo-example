$(function() {
	var Item = Backbone.Model.extend({
		clear: function() {
			this.destroy();
		}
	});

	var ItemList = Backbone.Collection.extend({
		model: Item,
		url: 'http://localhost:4567/items'
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
			//_.bindAll(this, 'render', 'close');
			this.model.bind('change', this.render, this);
			this.model.bind('destroy', this.remove, this);
			this.model.view = this;
	    },
	
		render: function() {
			//alert(this.model.get('content'));
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
			this.model.save({content: value});
			this.$el.removeClass("editing");
	    },
	
		updateOnEnter: function(e) {
			if (e.keyCode == 27) {
				this.input.val(this.model.get('content'));
				this.$el.removeClass("editing");
				return;
			}
			if (e.keyCode == 13) this.close();
	    },
	
		clear: function() {
			this.model.clear();
	    },
	
		warnDelete: function() {
			//alert(this.$el);
			this.$el.css('background', '#f66');
		},
		
		unwarnDelete: function() {
			//alert(this.$el);
			this.$el.css('background', '');
		}
	});

	var ListView = Backbone.View.extend({
		el: $('#list'),
		
		events: {
			'keypress #new-item': 'createOnEnter'
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
		}
	});
	
	var list = new ListView;
});