Router.route('/', function () {
  this.render('mainTemplate');
});

Router.route('/admin', function(){
	this.render('mainAdminTemplate');
});

Router.route('category', {
	template: 'newCate',
	path: '/category/:typeID',
	data: {
		products:function(){
			var tID = Router.current().params.typeID;
			//alert(tID);
			return Products.find({pTypeID: tID});
		}
		
	}
});

Router.route('/checkout', function(){
	this.render('checkoutTemplate2');
});

Router.route('search', {
	template: 'searchTemplate',
	path: '/search/:txtSearch',
	data: {
		products:function(){
			var text = Router.current().params.txtSearch;
			//alert(text);
			//alert(tID);

			// return Products.find({$or: [{
			// 	pName: new RegExp(text)}, 
			// 	{pDescription: new RegExp(text)}]
			// });

			return Products.find({$or: [
				{pName: new RegExp(text, "i")}, 
				{pDescription: new RegExp(text, "i")}
				]
			});
			
		}
		
	}
});

// Router.route('/orderDetail', function(){
// 	this.render('orderDetailTemplate');
// });

Router.route('orderDetail', {
	template: 'orderDetailTemplate',
	path: '/orderDetail/:orNo',
	data: {
		orderList:function(){
			var orNo = Router.current().params.orNo;
			// alert(orNo);
			return Orders.find({orNo: orNo});
		},
		deliveryInfo:function(){
			var orNo2 = Router.current().params.orNo;
			// alert(orNo);
			return Delivery.find({orNo: orNo2});
		}
		
	}
});

Router.route('/finish', function(){
	this.render('finishTemplate');
});

Router.route('profile', {
	template: 'userProfileTemplate',
	path: '/profile/:uID',
	data: {
		userDetails:function(){
			var uID = Router.current().params.uID;
			return Users.find({_id: uID});
		},
		
	}
});

Router.route('/orders', function(){
	this.render('userOrderList');
});