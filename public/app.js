$(function() {
	var Item = Backbone.Model.extend({});

	var ItemList = Backbone.Collection.extend({
		model: Item,
		url: 'http://localhost:4567/items'
	});

	var items = new ItemList;

	var ItemView = Backbone.View.extend({
		tagName: 'li',
		className: 'item',
		template: _.template("<div class='item-content'><%=content%></div>"),
		
		events: {

		},
		
		initialize: function() {
			_.bindAll(this, 'render');
			this.model.bind('change', this.render, this);
			this.model.view = this;
	    },
	
		render: function() {
			//alert(this.model.get('content'));
			this.$el.html(this.template(this.model.toJSON()));
			//$(this.el).setProperty('id', 'item-' + this.model.id);
			//this.setContent();
			
			return this;
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