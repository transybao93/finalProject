import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Mongo } from 'meteor/mongo';
import { Session } from 'meteor/session';
import { googleMap } from 'meteor/dburles:google-maps';

import './main.html';

Products = new Mongo.Collection('product');
OrderDetails = new Mongo.Collection('order');
Types = new Mongo.Collection('type');
Comment = new Mongo.Collection('comment');
Users = new Mongo.Collection('user');
Delivery = new Mongo.Collection('delivery');
Orders = new Mongo.Collection('order2');

// Products = new Mongo.Collection('product');
// OrderDetails = new Mongo.Collection('order');
// Orders = new Mongo.Collection('order2');
// Types = new Mongo.Collection('type');
// Users = new Mongo.Collection('user');

orderTotal = 0;
userTotal = 0;
guestTotal = 0;

Template.body.onCreated(function bodyOnCreated() {
  	Meteor.subscribe('type');
  	Meteor.subscribe('products');
  	Meteor.subscribe('showOrder');
  	Meteor.subscribe('commentList');
  	Meteor.subscribe('showUser');
  	Meteor.subscribe('showDelivery');
	Meteor.subscribe('showOrder2');


  $(document).ready(function() {
		$(".register").hide();
		$(".forgotP").hide();
	});
  	
});

/*
* 
* Basic
*/
//===========================
Template.hello.onCreated(function helloOnCreated() {
  // counter starts at 0
  this.counter = new ReactiveVar(0);
});

Template.hello.helpers({
  counter() {
    return Template.instance().counter.get();
  },
});

Template.hello.events({
  'click button'(event, instance) {
    // increment the counter when button is clicked
    instance.counter.set(instance.counter.get() + 1);
  },
});
//===========================
/*
* 
* Manager
*/
//===========================
//add food template
Template.addFood.onCreated(function addFoodOnCreated() {
  
});
Template.addFood.helpers({
  listType:function(){
  	return Types.find();
  }
});

Template.addFood.events({
  'submit .addFoodForm'(event, instance){
  	event.preventDefault();
  	var typeID = event.target.lType.value;
  	var unit = event.target.lUnit.value;
  	var pName = event.target.pName.value;
  	var price = event.target.pPricepU.value;
  	var des = event.target.pDescription.value;
  	var discount = event.target.pDiscount.value;
  	var status = "serving";
  	if(typeID != '' && unit != '' && pName != '' && price != '')
  	{
  		var data = [];
  		data[0] = typeID;
  		data[1] = unit;
  		data[2] = pName;
  		data[3] = price;
  		data[4] = des;
  		data[5] = discount;
  		data[6] = status;
  		Meteor.call('addProduct', data, function(err, result){
  			if(result == 0)
  			{	
  				toastr.error('Existed !');
  				// alert('Existed !');
  			}else{
  				toastr.success('Insert success');
  				// alert('Insert success !');
  			}
  		});
  	}
  },
});

//add type template
Template.addType.events({
	'submit .addTypeForm'(event, instance){
		event.preventDefault();

		var tName = event.target.tName.value;
		var tDescription = event.target.tDescription.value;
		var data = [];
		if(tName != '' && tDescription != '')
		{
			data[0] = tName;
			data[1] = tDescription;
			Meteor.call('addType', data, function(err, result){
				if(result == 0)
				{
					event.target.tName.value = '';
					event.target.tDescription.value = '';
					toastr.error('Existed type !');
					// alert('Exitsed type !');
				}else{
					event.target.tName.value = '';
					event.target.tName.focus();
					event.target.tDescription.value = '';
				}
			});
		}else{
			toastr.error('Empty info !');
			// alert('Empty info !');
		}
		
	},
});

//type list template
Template.typeList.events({
	'click #btnDelete'(event, instance){
		Meteor.call('deleteType', this._id);
	},
	'click #btnView'(event, instance){
		var tName = this.tName;
		// alert("Type name: " + this.tName + "\nType description: " + this.tDescription);
		//alert(tName);
		Meteor.call('showTypeIDByName', tName);
	},
});

Template.typeList.helpers({
  listType:function(){
  	return Types.find();
  }
});

//===========================
/*
* 
* Main template function
*/
//===========================

//phần thêm sửa xóa đồ ăn/uống
Template.foodManagement.helpers({
	products:function(){
		return Products.find();
	},
});

Template.foodManagement.events({
	'click #btnDelete'(event, instance){
		Meteor.call('deleteProduct', this._id);
	},
});

//top menu template
Template.topmenu.helpers({
	types:function(){
		return Types.find();
	},
	countOrder:function(){
		if(Session.get('uEmail'))
		{
			return OrderDetails.find({orNo: Session.get('uOrderNo')}).count();
		}else{
			return OrderDetails.find({orNo: Session.get('guestOrderNo')}).count();
		}
		
	}
});

Template.topmenu.events({
	'click #typeName'(event, instance){
		//alert(this._id);
		Router.go('/category/'+this._id);
	},
});

//food list template
Template.foodList.onCreated(function foodListCreated() {
	var guestOrderNo = Session.get('guestOrderNo');
	var randomSession = randomGuestOrder(32);
	//alert(randomSession);
	if(!guestOrderNo)
	{
		Session.set('guestOrderNo', randomSession);
	}

});

Template.lFood.helpers({
  // number:function(){
  // 	return Session.get('guestOrderNo');
  // }
});

Template.lFood2.helpers({
  // number:function(){
  // 	return Session.get('guestOrderNo');
  // }
});

Template.foodList.helpers({
  products:function(){
  	return Products.find();
  },
  commentList:function(){
  	return Comment.find();
  },
  
});

Template.lFood.events({
	'click #btnOrder'(event, instance){

		//alert("guest session: " + Session.get('guestOrderNo'));
		var pID = this._id;
		var orNo = "";
		var uEmail = "";
		var orEmail = "";
		if(Session.get('uOrderNo'))
		{
			//uEmail = Session.get('uEmail');
			orNo = Session.get('uOrderNo');
			// alert("orNo in btnOrder: " + orNo);
			orEmail = Session.get('uEmail');
			// orNo = Session.get('uEmail');
		}else{
			orNo = Session.get('guestOrderNo');
		}
		// alert("order no: " + orNo);
		var orQuantity = 1;
		var orTotal = this.pPricePerUnit * orQuantity;
		var orDiscount = 0;
		var orShipType = "not set";
		var orStatus = "ordering";
		var orProductName = this.pName;
		
		// alert('email when order: ' + orEmail);
		//add to order sum variable
		if(Session.get('uOrderNo'))
		{
			
			orderTotal = orderTotal + orTotal;
			Session.set('orderSum', orderTotal);
			userTotal = orderTotal;
			//alert('chỗ này, orderSum: ' + Session.get('orderSum'));
			document.getElementById("orderTotal2").innerHTML = orderTotal;
		}else{
			orderTotal = orderTotal + orTotal;
			// alert("Sum order: " + Session.get('orderSum'));
			Session.set('orderSum', orderTotal);
			guestTotal = orderTotal;
			// alert('order total: ' + orderTotal);
			// alert('guest order total: ' + guestTotal);
			document.getElementById("orderTotal2").innerHTML = guestTotal;
		}

		// alert('order email 2: ' + orEmail);
		if(orNo != '' && pID != '')
		{
			var data = [];
			data[0] = pID;
			data[1] = orNo;
			data[2] = orQuantity;
			data[3] = orTotal;
			data[4] = orDiscount;
			data[5] = orShipType;
			data[6] = orStatus;
			data[7] = orProductName;
			data[8] = orEmail;

			// if(uEmail != null || uEmail != '')
			// {
			// 	date[8] = uEmail;
			// }
			
			// date[8] = uEmail;
			//data[8] = uEmail;
			Meteor.call('addGuestOrder', data, function(err, result){
				if(result == 1)
				{
					toastr.success('Ordered this food !');
					//alert('Ordered this food !');
				}else{
					toastr.info('Updated this food quantity !');
					//alert('Update this food quantity');
				}
			});
			
		}

	},
	'click #btnViewMore'(event, instance){
		//alert('food ID: ' + this._id);
		var fID = this._id;
		var p = Products.find({_id: fID}).fetch();
		var c = Comment.find({foodID: fID}, {sort: {cCommentAt: -1}}).fetch();
		var cCount = Comment.find({foodID: fID}).count();
		printCommentByFoodID(c);
		Meteor.call('updateCountViewForFood', fID);
		// printFoodDetailsByID(p);
		document.getElementById('fID').innerHTML = this._id;
		document.getElementById('fName').innerHTML = this.pName + ' ( -'+this.pDiscount+'% )';
	  	document.getElementById('fUnit').innerHTML = this.pUnit;
	  	document.getElementById('fPpu').innerHTML = this.pPricePerUnit;
	  	document.getElementById('fStatus').innerHTML = this.pStatus;
	  	document.getElementById('fCustomerView').innerHTML = this.pCustomerViews;
	  	document.getElementById('fDescription').innerHTML = this.pDescription;
	  	document.getElementById('fImage').src = this.pImagePath;
	  	//update count
	  	if(cCount > 0)
	  	{
	  		document.getElementById('commentCount').innerHTML = cCount;
	  	}else{
	  		document.getElementById('commentCount').innerHTML = '0';
	  	}
	  	

	  	//show like
	  	
		//update count views for choosen food
		if(Session.get('uEmail'))
		{
			document.getElementById('uSession').innerHTML = Session.get('uOrderNo');
		}else{
			document.getElementById('uSession').innerHTML = Session.get('guestOrderNo');
		}

		//printCommentByFoodID(c);
		
		
	},
});

Template.lFood2.events({
	'click #btnOrder'(event, instance){

		//alert("guest session: " + Session.get('guestOrderNo'));
		var pID = this._id;
		var orNo = "";
		var uEmail = "";
		var orEmail = "";
		if(Session.get('uOrderNo'))
		{
			//uEmail = Session.get('uEmail');
			orNo = Session.get('uOrderNo');
			// alert("orNo in btnOrder: " + orNo);
			orEmail = Session.get('uEmail');
			// orNo = Session.get('uEmail');
		}else{
			orNo = Session.get('guestOrderNo');
		}
		// alert("order no: " + orNo);
		var orQuantity = 1;
		var orTotal = this.pPricePerUnit * orQuantity;
		var orDiscount = 0;
		var orShipType = "not set";
		var orStatus = "ordering";
		var orProductName = this.pName;
		
		// alert('email when order: ' + orEmail);
		//add to order sum variable
		if(Session.get('uOrderNo'))
		{
			
			orderTotal = orderTotal + orTotal;
			Session.set('orderSum', orderTotal);
			userTotal = orderTotal;
			//alert('chỗ này, orderSum: ' + Session.get('orderSum'));
			document.getElementById("orderTotal2").innerHTML = orderTotal;
		}else{
			orderTotal = orderTotal + orTotal;
			// alert("Sum order: " + Session.get('orderSum'));
			Session.set('orderSum', orderTotal);
			guestTotal = orderTotal;
			// alert('order total: ' + orderTotal);
			// alert('guest order total: ' + guestTotal);
			document.getElementById("orderTotal2").innerHTML = guestTotal;
		}

		// alert('order email 2: ' + orEmail);
		if(orNo != '' && pID != '')
		{
			var data = [];
			data[0] = pID;
			data[1] = orNo;
			data[2] = orQuantity;
			data[3] = orTotal;
			data[4] = orDiscount;
			data[5] = orShipType;
			data[6] = orStatus;
			data[7] = orProductName;
			data[8] = orEmail;

			// if(uEmail != null || uEmail != '')
			// {
			// 	date[8] = uEmail;
			// }
			
			// date[8] = uEmail;
			//data[8] = uEmail;
			Meteor.call('addGuestOrder', data, function(err, result){
				if(result == 1)
				{
					toastr.success('Ordered this food !');
					//alert('Ordered this food !');
				}else{
					toastr.info('Updated this food quantity !');
					//alert('Update this food quantity');
				}
			});
			
		}

	},
	'click #btnViewMore'(event, instance){
		//alert('food ID: ' + this._id);
		var fID = this._id;
		var p = Products.find({_id: fID}).fetch();
		var c = Comment.find({foodID: fID}, {sort: {cCommentAt: -1}}).fetch();
		var cCount = Comment.find({foodID: fID}).count();
		printCommentByFoodID(c);
		Meteor.call('updateCountViewForFood', fID);
		// printFoodDetailsByID(p);
		document.getElementById('fID').innerHTML = this._id;
		document.getElementById('fName').innerHTML = this.pName + ' ( -'+this.pDiscount+'% )';
	  	document.getElementById('fUnit').innerHTML = this.pUnit;
	  	document.getElementById('fPpu').innerHTML = this.pPricePerUnit;
	  	document.getElementById('fStatus').innerHTML = this.pStatus;
	  	document.getElementById('fCustomerView').innerHTML = this.pCustomerViews;
	  	document.getElementById('fDescription').innerHTML = this.pDescription;
	  	document.getElementById('fImage').src = this.pImagePath;
	  	//update count
	  	if(cCount > 0)
	  	{
	  		document.getElementById('commentCount').innerHTML = cCount;
	  	}else{
	  		document.getElementById('commentCount').innerHTML = '0';
	  	}
	  	

	  	//show like
	  	
		//update count views for choosen food
		if(Session.get('uEmail'))
		{
			document.getElementById('uSession').innerHTML = Session.get('uOrderNo');
		}else{
			document.getElementById('uSession').innerHTML = Session.get('guestOrderNo');
		}

		//printCommentByFoodID(c);
		
		
	},
});

Template.foodList.events({
	'click #btnOrder'(event, instance){

		//alert("guest session: " + Session.get('guestOrderNo'));
		var pID = this._id;
		var orNo = "";
		var uEmail = "";
		var orEmail = "";
		if(Session.get('uOrderNo'))
		{
			//uEmail = Session.get('uEmail');
			orNo = Session.get('uOrderNo');
			// alert("orNo in btnOrder: " + orNo);
			orEmail = Session.get('uEmail');
			// orNo = Session.get('uEmail');
		}else{
			orNo = Session.get('guestOrderNo');
		}
		// alert("order no: " + orNo);
		var orQuantity = 1;
		var orTotal = this.pPricePerUnit * orQuantity;
		var orDiscount = 0;
		var orShipType = "not set";
		var orStatus = "ordering";
		var orProductName = this.pName;
		
		// alert('email when order: ' + orEmail);
		//add to order sum variable
		if(Session.get('uOrderNo'))
		{
			
			orderTotal = orderTotal + orTotal;
			Session.set('orderSum', orderTotal);
			userTotal = orderTotal;
			//alert('chỗ này, orderSum: ' + Session.get('orderSum'));
			document.getElementById("orderTotal2").innerHTML = orderTotal;
		}else{
			orderTotal = orderTotal + orTotal;
			// alert("Sum order: " + Session.get('orderSum'));
			Session.set('orderSum', orderTotal);
			guestTotal = orderTotal;
			// alert('order total: ' + orderTotal);
			// alert('guest order total: ' + guestTotal);
			document.getElementById("orderTotal2").innerHTML = guestTotal;
		}

		// alert('order email 2: ' + orEmail);
		if(orNo != '' && pID != '')
		{
			var data = [];
			data[0] = pID;
			data[1] = orNo;
			data[2] = orQuantity;
			data[3] = orTotal;
			data[4] = orDiscount;
			data[5] = orShipType;
			data[6] = orStatus;
			data[7] = orProductName;
			data[8] = orEmail;

			// if(uEmail != null || uEmail != '')
			// {
			// 	date[8] = uEmail;
			// }
			
			// date[8] = uEmail;
			//data[8] = uEmail;
			Meteor.call('addGuestOrder', data, function(err, result){
				if(result == 1)
				{
					toastr.success('Ordered this food !');
					//alert('Ordered this food !');
				}else{
					toastr.info('Updated this food quantity !');
					//alert('Update this food quantity');
				}
			});
			
		}

	},
	'click #btnViewMore'(event, instance){
		//alert('food ID: ' + this._id);
		var fID = this._id;
		var p = Products.find({_id: fID}).fetch();
		var c = Comment.find({foodID: fID}, {sort: {cCommentAt: -1}}).fetch();
		var cCount = Comment.find({foodID: fID}).count();
		printCommentByFoodID(c);
		Meteor.call('updateCountViewForFood', fID);
		// printFoodDetailsByID(p);
		document.getElementById('fID').innerHTML = this._id;
		document.getElementById('fName').innerHTML = this.pName + ' ( -'+this.pDiscount+'% )';
	  	document.getElementById('fUnit').innerHTML = this.pUnit;
	  	document.getElementById('fPpu').innerHTML = this.pPricePerUnit;
	  	document.getElementById('fStatus').innerHTML = this.pStatus;
	  	document.getElementById('fCustomerView').innerHTML = this.pCustomerViews;
	  	document.getElementById('fDescription').innerHTML = this.pDescription;
	  	document.getElementById('fImage').src = this.pImagePath;
	  	//update count
	  	if(cCount > 0)
	  	{
	  		document.getElementById('commentCount').innerHTML = cCount;
	  	}else{
	  		document.getElementById('commentCount').innerHTML = '0';
	  	}
	  	

	  	//show like
	  	
		//update count views for choosen food
		if(Session.get('uEmail'))
		{
			document.getElementById('uSession').innerHTML = Session.get('uOrderNo');
		}else{
			document.getElementById('uSession').innerHTML = Session.get('guestOrderNo');
		}

		//printCommentByFoodID(c);
		
		
	},

});

//search template
Template.search.events({
	'submit .searchForm'(event, instance){
		event.preventDefault();
		var text = event.target.searchValue.value;
		if(text)
		{
			Router.go('/search/'+text);
		}else{
			toastr.warning('Empty value !');
			//alert('Empty value !');
		}
		
	}
});

//checkout template
Template.checkOutTemplate.onCreated(function orderListOnCreated(){
	Meteor.subscribe('showOrder');
});


Template.checkOutTemplate.helpers({
	orderList: function(){
		if(Session.get('uEmail'))
		{
			return OrderDetails.find({orNo: Session.get('uOrderNo'), orStatus: 'ordering'});
		}else{
			return OrderDetails.find({orNo: Session.get('guestOrderNo'), orStatus: 'ordering'});
		}
		
	},
	sumOrder: function(){
		return Session.get('orderSum');
	}
});


Template.checkOutTemplate.events({
	'click #btnRemoveOrder'(event, instance){
		var fID = this._id;
		Meteor.call('deleteOrderFoodByID', fID);
		

		orderTotal = orderTotal - this.orTotal;
		var sessionTotal = Session.get('orderSum') - this.orTotal;

		Session.set('orderSum', sessionTotal);
	
		document.getElementById('orderTotal2').innerHTML = Session.get('orderSum');

		//delete total price
		
		// if(Session.get('uEmail'))
		// {
		// 	userTotal = userTotal - this.orTotal;
		// }else{
		// 	guestTotal = guestTotal - this.orTotal;
		// }
	},
	'click #pQ'(event, instance){
		var oID = this._id;
		var pID = this.orProductID;
		var p = Products.findOne({_id: pID});
		var data = [];
		data[0] = oID;
		data[1] = pID;
		//alert("oid: " + data[0] + " - pID: " + data[1]);
		Meteor.call('plusQuantity', data, function(err, result){
			if(result == 1)
			{
				//update session total again
				// if(Session.get('uEmail'))
				// {
				// 	userTotal = userTotal + p.pPricePerUnit;
				// }else{
				// 	guestTotal = guestTotal + p.pPricePerUnit;
				// }

				orderTotal = orderTotal + p.pPricePerUnit;
				var sessionTotal = Session.get('orderSum') + p.pPricePerUnit;
				Session.set('orderSum', sessionTotal);
				document.getElementById('orderTotal2').innerHTML = Session.get('orderSum');
			}else{
				toastr.error('Quantity cannot > 20');
				// alert("Limited plus");
			}
		});
	},
	'click #mQ'(event, instance){
		var oID = this._id;
		var pID = this.orProductID;
		var p = Products.findOne({_id: pID});
		var data = [];
		data[0] = oID;
		data[1] = pID;
		//alert("oid: " + data[0] + " - pID: " + data[1]);
		Meteor.call('minusQuantity', data, function(err, result){
			if(result == 1)
			{
				//update session total again
				orderTotal = orderTotal - p.pPricePerUnit;
				var sessionTotal = Session.get('orderSum') - p.pPricePerUnit;
				Session.set('orderSum', sessionTotal);
			}else{
				toastr.error("Minus cannot <= 1");
				// alert("Minus cannot <= 1");
			}
		});
		
	},

	'click #btnCheckOut'(event, instance){
		Router.go('/checkout');
	},

});

//checkout template 2
Template.mainFinalCheckout.onCreated(function orderListOnCreated(){
	Meteor.subscribe('showOrder');
	Meteor.subscribe('showDelivery');
});

//main final checkout
Template.mainFinalCheckout.helpers({
	orderList: function(){
		if(Session.get('uEmail'))
		{
			return OrderDetails.find({orNo: Session.get('uOrderNo'), orStatus: 'ordering'});
		}else{
			return OrderDetails.find({orNo: Session.get('guestOrderNo'), orStatus: 'ordering'});
		}
		
	},
	sumOrder: function(){
		return Session.get('orderSum');
	},
	uEmail:function(){
		return Session.get('uEmail');
	},
	uName:function()
	{
		return Session.get('uName');
	},
});

Template.mainFinalCheckout.events({
	'click #btnRemoveOrder'(event, instance){
		var fID = this._id;
		Meteor.call('deleteOrderFoodByID', fID);

		orderTotal = orderTotal - this.orTotal;
		var sessionTotal = Session.get('orderSum') - this.orTotal;

		Session.set('orderSum', sessionTotal);
	},

	'click #btnFinishDelivery'(event, instance){
		var number = document.getElementById('dNumber').value;
		var street = document.getElementById('dStreet').value;
		var ward = document.getElementById('dWard').value;
		var d = document.getElementById('sel1');
		var district = d.options[d.selectedIndex].text;
		var fee = document.getElementById('fee').innerHTML;
		//get user information
		var uName = document.getElementById('userName').value;
		var uEmail = document.getElementById('userEmail').value;
		var uPhone = document.getElementById('uPhone').value;
		var data = [];
		if(number != '' 
			&& street != '' 
			&& ward != '' 
			&& district != 'Choose district'
			&& uName != '' 
			&& uEmail != ''
			&& uPhone != '')
		{
			var fulladdress = number + ', ' + street + ' street, Ward ' + ward + ', District ' + district;
			// alert('address: ' + fulladdress);
			if(Session.get('uEmail'))
			{
				// alert('delivery user');
				var orNo = Session.get('uOrderNo');
				data[0] = orNo;
				data[1] = uName;
				data[2] = uPhone;
				data[3] = uEmail;
				data[4] = fulladdress;
				data[5] = fee;
				
				Meteor.call('addDeliveryforOrder', data, function(err, result){
						// var d = Delivery.find({uName: uName}).count();
						// alert('Count: ' + d);
						// toastr.success('Update delivery information success');
						Router.go('/orderDetail/' + orNo);
				});

				// alert('User order, username: ' + uName + '\nfull address: ' + fulladdress + '\nEmail: ' + uEmail);
			}else{
				// alert('Guest order');
				var orNo = Session.get('guestOrderNo');
				data[0] = orNo;
				data[1] = uName;
				data[2] = uPhone;
				data[3] = uEmail;
				data[4] = fulladdress;
				data[5] = fee;
				
				Meteor.call('addDeliveryforOrder', data, function(err, result){
					Router.go('/orderDetail/' + orNo);
				});
			
				
				
				// alert('Guest order: ' + Session.get('guestOrderNo') + '\nFee : ' + fee + '\nusername: ' + uName);
			}
		}else{
			toastr.error('You are missing some information');
			// alert('You missing something...');
		}
		
	},

	'click #btnGetInfo'(event, instance) {
		document.getElementById('userEmail').value = Session.get('uEmail');
		document.getElementById('userName').value = Session.get('uName');
	},

	'click #btnFinishPickUp'(event, instance){
		var t = document.getElementById('sel2');
		var time = t.options[t.selectedIndex].text;
		var fee = 0;
		var data = [];
		var address = document.getElementById('dAddress').value;
		var uName = document.getElementById('userName').value;
		var uEmail = document.getElementById('userEmail').value;
		var uPhone = document.getElementById('uPhone').value;
		var data = [];
		if(uName != '' 
			&& uEmail != ''
			&& uPhone != ''
			&& time != 'Choose time to pick-up')
		{
			if(Session.get('uEmail'))
			{
				// alert('pick up user');
				var orNo = Session.get('uOrderNo');
				data[0] = orNo;
				data[1] = uName;
				data[2] = uPhone;
				data[3] = uEmail;
				data[4] = address;
				data[5] = fee;
				data[6] = time;
				
				Meteor.call('addPickupforOrder', data, function(err, result){
						// var d = Delivery.find({uName: uName}).count();
						// alert('Count: ' + d);
						// toastr.success('Update delivery information success');
						Router.go('/orderDetail/' + orNo);
				});

				// alert('User order, username: ' + uName + '\nfull address: ' + fulladdress + '\nEmail: ' + uEmail);
			}else{
				// alert('Guest order');
				var orNo = Session.get('guestOrderNo');
				data[0] = orNo;
				data[1] = uName;
				data[2] = uPhone;
				data[3] = uEmail;
				data[4] = address;
				data[5] = fee;
				data[6] = time;

				Meteor.call('addPickupforOrder', data, function(err, result){
					Router.go('/orderDetail/' + orNo);
				});
			
				
				
				// alert('Guest order: ' + Session.get('guestOrderNo') + '\nFee : ' + fee + '\nusername: ' + uName);
			}
		}else{
			toastr.error('You are missing some information');
			// alert('You missing something...');
		}


	},


});

//login template
Template.login.onCreated(function loginOnCreated(){
	Meteor.subscribe('showUser');
	$(document).ready(function() {
		$(".register").hide();
		$(".forgetP").hide();
		$(".successTemplate").hide();
		$(".userPanel").hide();
		document.getElementById("user_remember_me").checked = false;
		document.getElementById("btnRegister").disabled = true;
	});
});

Template.login.events({

	'click .na'(event, instance){
		$(document).ready(function() {
			$(".login1").fadeOut("fast", function(){
				$(".register").fadeIn("slow");
			});
			
		});
	},
	'click #btnBack'(event, instance)
	{
		$(document).ready(function() {
			$('.register').fadeOut('fast', function(){
				$('.login1').fadeIn('slow');
			});
			
		});
	},
	'click .fp'(event, instance){
		$(document).ready(function() {
			$('.login1').fadeOut('fast', function(){
				$('.forgotP').fadeIn('slow');
			});
			
		});
	},

	'click #btnBack2'(event, instance)
	{
		$(document).ready(function() {
			$('.forgotP').fadeOut('fast', function(){
				$('.login1').fadeIn('slow');
			});
			
		});
	},
	

	'click #user_agree_term'(event, instance)
	{
		if(document.getElementById("user_agree_term").checked == true)
		{
			document.getElementById("btnRegister").disabled = false;
		}else{
			document.getElementById("btnRegister").disabled = true;
		}
	},

	'submit .registerForm'(event, instance)
	{
		event.preventDefault();
		var u_username = event.target.uName.value;
		var u_email = event.target.uEmail.value;
		var u_pass = event.target.uPass.value;
		var u_repass = event.target.rpass.value;
		if(u_username == "" || u_email == "" ||
		 u_pass == "" || u_pass != u_repass)
		{
			if(u_username == "")
			{
				document.getElementById("user_username").focus();
				document.getElementById("user_username").style.outline = "0";
				toastr.warning("Username cannot be blank");
				return;
			}

			if(u_email == "")
			{
				document.getElementById("user_email").focus();
				document.getElementById("user_email").style.outline = "0";
				toastr.warning("Email cannot be blank");
				return;
			}

			if(u_pass == "")
			{
				document.getElementById("user_password").focus();
				document.getElementById("user_password").style.outline = "0";
				toastr.warning("Password cannot be blank");
				return;
			}

			if(u_pass != u_repass)
			{
				toastr.warning("Your confirm password what you typed is not match to password !");
				return;
			}
		}else{
			var data = [];
			
			data[0] = u_username;
			data[1] = u_email;
			data[2] = CryptoJS.MD5(u_pass).toString();
			// alert("md5 password: " + CryptoJS.MD5(u_pass));
			Meteor.call('addNewUser', data, function (error, result) {
				if(result == 1)
				{
					toastr.success("Registered successfull!");
					$(document).ready(function() {
						$('.register').fadeOut('fast', function(){
							$('.login1').fadeIn('slow');
						});
					});
					//reset form
					resetRegisterForm();
				}
				if(result == 0){
					toastr.error("This email has already existed! Please try again!");
				}
			});
		}
	},

	'submit .loginForm'(event, instance)
	{
		guestTotal = orderTotal;
		
		event.preventDefault();
		var uemail = event.target.uEmail.value;
		var upass = event.target.uPass.value;
		var userRandomSession = "";
		var data = [];
		
		if(uemail != "" && upass != "")
		{
			
			//set data to array
			data[0] = uemail;
			data[1] = CryptoJS.MD5(upass).toString();
			data[2] = randomGuestOrder(32);
			// alert("data[3]: " + data[2]);
			Meteor.call('checkUserLogin', data, function (error, result) {
				if(result != 0)
				{
					
					//set session
					
					Session.set("uOrderNo", data[2]);
					// alert("uOrderNo: " + data[2]);
					Session.set("uEmail", uemail);
					Session.set("uName", result);
					$("#userLink").text(result);
					toastr.success("Login successful!");
					$(document).ready(function() {
						$('.login1').fadeOut('fast', function(){
							$('.userPanel').fadeIn('slow');

						});
					});


					//erase fill
					document.getElementById("loginEmail").value = "";
					document.getElementById("loginPass").value = "";
					//load price by email
					var o = OrderDetails.find({orNo: Session.get("uEmail")}).fetch();
					//set total amount for the session
					document.getElementById("orderTotal2").innerHTML = calculatePriceOfUser(o);
					orderTotal = calculatePriceOfUser(o);
					Session.set("sumOrder", calculatePriceOfUser(o));
					//set email
					document.getElementById('cName').value = result;
					document.getElementById('cName').disabled = true;

				}
				if(result == 0){
					toastr.error("Email or password is wrong! Please try again!");
				}
			});
		}else{
			toastr.warning("Please input something to login!");
		}
		
	},

	'click #btnLogout'(event, instance)
	{
		userTotal = orderTotal;
		// Session.set("sumOrder", guestTotal);
		Session.set("sumOrder", null);
		Session.get("orderSum", guestTotal);
		Session.set('uName', null);
		$("#userLink").text("Login");
		toastr.success("Logged out !");
		$(document).ready(function() {
			$('.userPanel').fadeOut('fast', function(){
				$('.login1').fadeIn('slow');

			});
		
		});

		// alert('orderTotal2: ' + document.getElementById('orderTotal2').innerHTML);
		// alert('orderSum: ' + Session.get('orderSum'));
		// alert('sumOrder: ' + Session.get('sumOrder'));
		// alert('guest total: ' + guestTotal);
		document.getElementById('orderTotal2').innerHTML = 123;

		//erase total amount
		//Session.set('orderSum', 0);
		//clear session
		
		Session.set("uEmail", null);
		if(Session.get("uEmail") == null)
		{
			var x = OrderDetails.find({orNo: Session.get("guestOrderNo")}).fetch();
			document.getElementById("orderTotal2").innerHTML = calculatePriceOfUser(x);
			orderTotal = calculatePriceOfUser(x);
			Session.set('sumOrder', calculatePriceOfUser(x));

			// document.getElementById("orderTotal2").innerHTML = 0;
			// orderTotal = 0;
			// Session.set('sumOrder', 0);

		}

		Router.go('/');
		
	},

	'keyup #user_username'(event, instance)
	{
		//alert(document.getElementById("user_username").value);
		document.getElementById("user_username_2").innerHTML = document.getElementById("user_username").value;
		//alert("123");
	},


	'click #btnProfile'(event, instance) 
	{
		var uEmail = Session.get('uEmail');
		// alert('email: ' + uEmail);
		var u = Users.find({email: uEmail}).fetch();
		var uID = printUserID(u);
		// alert('user id: ' + uID);
		Router.go('/profile/' + uID);
	},

	'click #btnOrders'(event, instance) 
	{
		var uEmail = Session.get('uEmail');
		// alert('email: ' + uEmail);
		var u = Users.find({email: uEmail}).fetch();
		var uID = printUserID(u);
		Router.go('/orders');
	}

});

// Template.login.onCreated(function registerOnCreated(){
// 	$(document).ready(function() {
// 		document.getElementById("user_remember_me").checked = false;
// 		document.getElementById("btnRegister").disabled = true;
// 	});
// });

//template commentTemplate
Template.commentTemplate.helpers({
	commentList:function(){
		return Comment.find();
		
	},
});



Template.commentTemplate.onCreated(function commentListOnCreated(){
	Meteor.subscribe('commentList');
});

Template.commentTemplate.events({
	'submit .commentForm'(event, instance){
		event.preventDefault();

		var userID;
		var foodID = document.getElementById('fID').innerHTML;
		var cName = event.target.cName.value;
		var cComment = event.target.cComment.value;
		// alert('food id: ' + foodID);
		// var foodID = document.getElementById('fID').innerHTML;
		// var userID;
		// var cName = document.getElementById('cName').value;
		// var cComment = document.getElementById('cComment').value;

		if(Session.get('uEmail'))
		{
			userID = Session.get('uEmail');
		}else{
			userID = event.target.cName.value;
		}
		var data = [];
		data[0] = foodID;
		// alert('username: ' + cName);
		data[1] = cName;
		data[2] = cComment;
		if(cComment != "")
		{
			// toastr.success("OK !");
			Meteor.call('addComment', data, function (error, result) {
				if(result == 1)
				{
					toastr.success("Comment post successfully !");
					event.target.cName.value = "";
					event.target.cComment.value = "";
					//load lại table
					var c = Comment.find({foodID: foodID}, {sort: {cCommentAt: -1}}).fetch();
					printCommentByFoodID(c);
					//update lại số comment
					var cCount = Comment.find({foodID: foodID}).count();
					document.getElementById('commentCount').innerHTML = cCount;
				}
			});
		}else{
			toastr.warning("Name or comment content cannot be blank");
		}

	},

	'click #showComment'(event, instance){
		// var foodID = document.getElementById('fID').innerHTML;
		// alert('food id: ' + foodID);
		// var c = Comment.find({foodID: foodID}).fetch();
		// printCommentByFoodID(c);
	},

});

//dropdown template
Template.dropdownTemplate.events({
	'click #btnDelivery'(event, instance){
		$(document).ready(function() {
			$('.delivery').css("display", "block");
			$('.pickup').css("display", "none");
		});
	},

	'click #btnPickup'(event, instance){
		$(document).ready(function() {
			$('.delivery').css("display", "none");
			$('.pickup').css("display", "block");
		});

		//show estimate time
		// var orNo = "";
		// if(Session.get('uEmail'))
		// {
		// 	orNo = Session.get('uOrderNo');
		// }else{
		// 	orNo = Session.get('guestOrderNo');
		// }
		// var o = Orders.find({orNo: orNo});
		// var quantity = 0;
		// quantity += o.orQuantity;
		// alert('quantity: ' + quantity);
		// document.getElementById('estimateTime').innerHTML = estimateTime(countOrder);
		//set time by current time
	},

	'change #sel1'(event, instance){
		var district = document.getElementById('sel1').value;
		if(district == '1' || district == '2' || 
			district == '3' || district == '4' ||
			district == '5' || district == '6' ||
			 district == '7' || district == '8' ||
			  district == '9' || district == '10' ||
			   district == '11' || district == '12')
		{
			document.getElementById('fee').innerHTML = '10';
		}else if( district == 'binhtan' || district == 'binhthanh' || 
			district == 'thuduc' || district == 'phunhuan')
		{
			document.getElementById('fee').innerHTML = '5';
		}else{
			document.getElementById('fee').innerHTML = '2';
		}
	},




});


//order detail template
Template.orderDetailTemplate.helpers({
	orderList: function(){
		if(Session.get('uEmail'))
		{
			return OrderDetails.find({orNo: Session.get('uOrderNo'), orStatus: 'ordering'});
		}else{
			return OrderDetails.find({orNo: Session.get('guestOrderNo'), orStatus: 'ordering'});
		}
		
	},
	sumOrder: function(){
		return Session.get('orderSum');
	},
	uEmail:function(){
		return Session.get('uEmail');
	},
	uName:function()
	{
		return Session.get('uName');
	},
});



Template.orderDetailTemplate.events({
	'click #btnConfirm': function () {
		var orderNumber = document.getElementById('orderNumber').innerHTML;
		var fee = document.getElementById('orFee').innerHTML;
		var orderTotal = document.getElementById('orderTotal2').innerHTML;
		var total = Number(fee) + Number(orderTotal);
		var data = [];
		data[0] = orderNumber;
		data[1] = total;
		if(confirm('Do you check all the information and still want to place order?') == true)
		{
			Meteor.call('updateOrderStatus', data, function(){
				//set lại guest session

				Session.set('guestOrderNo', null);
				Session.set('uOrderNo', null);
				Session.set('orderSum', null);
				Session.set('sumOrder', null);
				// alert('session user email: ' + Session.get('uEmail'));
				// alert('session user order: ' + Session.get('uOrderNo'));
				if(Session.get('uEmail'))
				{
					
					var randomSession = randomGuestOrder(32);
					Session.set('uOrderNo', randomSession);
					orderTotal = 0;
					userTotal = 0;
					// alert('new user session: ' + Session.get('uOrderNo'));
					// alert('order total: ' + orderTotal);
					// alert('user total: ' + userTotal);
					// alert('guest total: ' + guestTotal);
				}else{
					var randomSession = randomGuestOrder(32);
					Session.set('guestOrderNo', randomSession);
					// alert('new guest session: ' + Session.get('guestOrderNo'));
					guestTotal = 0;
				}

				// var randomSession = randomGuestOrder(32);
				// Session.set('guestOrderNo', randomSession);
				
				Router.go('/finish');
			});
		}
		
	}
});

//template finish
Template.finishTemplate.events({
	'click #btnBackHome': function () {
		orderTotal = 0;
		guestTotal = 0;
		userTotal = 0;
		// alert('order total: ' + orderTotal);
		// alert('guest Total: ' + guestTotal);
		// alert('user total: ' + userTotal);

	}
});

//template user profile

// Template.userProfileTemplate.onCreated(function userProfileOnCreated(){
// 	Meteor.subscribe('commentList');
// });

Template.userProfileTemplate.helpers({
	
});

Template.userProfileTemplate.events({
	'submit .changePasswordForm'(event, instance) {
		event.preventDefault();

		var old_pass = event.target.oldPass.value;
		var new_pass = event.target.newPass.value;
		var confirm_pass = event.target.confirmPass.value;
		
		if(old_pass != '' && new_pass != '' && new_pass == confirm_pass)
		{
			var data = [];
			data[0] = Session.get('uEmail');
			data[1] = CryptoJS.MD5(old_pass).toString();
			data[2] = CryptoJS.MD5(new_pass).toString();
			Meteor.call('updatePassword', data, function(error, result){
				if(result == 1)
				{
					toastr.success('Updated password successfully !');
				}
				if(result == 0){
					toastr.error('Your password is not correct !');
				}
			});
		}else{
			toastr.error('You are missing something !');
		}
	},

	'submit .updateForm'(event, instance){
		event.preventDefault();
		// alert('123' + event.target.uPhone.value);
		var phone = event.target.uPhone.value;
		var address = event.target.uAddress.value;
		var email = Session.get('uEmail');

		if(phone != '' && address != '')
		{
			var data = [];
			data[0] = email;
			data[1] = phone;
			data[2] = address;
			Meteor.call('updateUserInfo', data, function(error, result){
				if(result == 1)
				{
					toastr.success('Updated information successfully !');
				}
				if(result == 0)
				{
					toastr.error('Cannot update information');
				}
			});
		}else{
			toastr.error('You are missing some information !');
		}
	},


});

//template user order list
Template.userOrderList.onCreated(function userOrderListOnCreated(){
	Meteor.subscribe('commentList');
});

Template.userOrderList.helpers({
	orderList: function () {
		return Orders.find({orUserEmail: Session.get('uEmail'), orStatus: 'ordered'}, {sort: {orDate: -1}});
	},
	orderCount: function(){
		return Orders.find({orUserEmail: Session.get('uEmail'), orStatus: 'ordered'}).count();
	}
});

Template.userOrderList.events({
	'click #viewMore': function () {
		var total = this.orTotal;
		var orNo = this.orNo;
		var od = OrderDetails.find({orNo: orNo}).fetch();
		document.getElementById('total').innerHTML = total;
		document.getElementById('orNo').innerHTML = orNo;
		printFoodDetailsByOrderNumber(od);
	}
});

//template type list
Template.foodManagement.events({
	'click #btnEdit': function () {
		document.getElementById('pID').value = this._id;
		document.getElementById('pPrice').value = this.pPricePerUnit;
		document.getElementById('pImagePath').value = this.pImagePath;
		document.getElementById('pName').value = this.pName;
	}


});

//template product list
Template.productList.events({
	'submit .updateProductForm'(event, instance){
		event.preventDefault();
		var id = event.target.pID.value;
		var price = event.target.pPrice.value;
		var imagePath = event.target.pImagePath.value;
		var pName = event.target.pName.value;
		var data = [];
		data[0] = id;
		data[1] = price;
		data[2] = imagePath;
		data[3] = pName
		Meteor.call('updateProductInformation', data, function(err, result){
			if(result == 1)
			{
				toastr.success('Updated price and image link');
			}
		});
	},

});


// Template.gMap.onCreated(function(){
// 	GoogleMaps.ready('exampleMap', function(map) {
// 	    // Add a marker to the map once it's ready
// 	    var marker = new google.maps.Marker({
// 	      position: map.options.center,
// 	      map: map.instance
// 	    });
// 	  });
// });

// Template.gMap.helpers({
// 	  exampleMapOptions: function() {
// 	    // Make sure the maps API has loaded
// 	    if (GoogleMaps.loaded()) {
// 	      // Map initialization options
// 	      return {
// 	        center: new google.maps.LatLng(-37.8136, 144.9631),
// 	        zoom: 8
// 	      };
// 	    }
// 	  },
// });

// Template.gMap.onRendered(function() {
//   GoogleMaps.load();
// });

//===========================
/*
*
* Other functions
*/
//===========================

//create random guest order
function randomGuestOrder(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for(var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

function printFoodDetailsByID(o) {
  var out = '';
  for (var p in o) {

  	document.getElementById('fName').innerHTML = 'o[p].pName';
  	document.getElementById('fUnit').innerHTML = o[p].pUnit;
  	document.getElementById('fPpu').innerHTML = o[p].pPricePerUnit;
  	document.getElementById('fDiscount').innerHTML = o[p].pDiscount;
  	document.getElementById('fStatus').innerHTML = o[p].pStatus;
  	document.getElementById('fCustomerView').innerHTML = o[p].pCustomerViews;
  	document.getElementById('fDescription').innerHTML = o[p].pDescription;
    out += p + ': ' + o[p].pName + '\n'
  }
  //alert(out);
}

function printFoodDetailsByOrderNumber(o) {
  var out = '<ol>';
  for (var p in o) 
  {
  	// alert("Name: " + o[p].cEmail);
  	//document.getElementById('commentEmail').innerHTML = o[p].cEmail;
    out += '<li>' + o[p].orProductName + ' (x' + o[p].orQuantity + ')</li>';
  }
  out += '</ol>';
  document.getElementById('singleFood').innerHTML = out;
}

function printCommentByFoodID(o) {
  var out = '';
  for (var p in o) 
  {
  	// alert("Name: " + o[p].cEmail);
  	//document.getElementById('commentEmail').innerHTML = o[p].cEmail;
    out += '<p>' + o[p].cEmail + ': ' + o[p].cContent + 
    '<br><i style="color:gray">'+
    o[p].cCommentAt
    +'</i></p>'
  }
  document.getElementById('commentEmail').innerHTML = out;
}

function calculatePriceOfUser(o) {
  var out = '';
  var total = 0;
  for (var p in o) {
  	total += o[p].orTotal;
    //out += p + ': ' + (o[p].orTotal * o[p].orQuantity) + '\n';
  }
  return total;
}

function printUserID(o) {
  var out = '';
  var uID = '';
  for (var p in o) {
  	uID = o[p]._id;
  }
  return uID;
}

function printUserPhone(o) {
  var out = '';
  var uID = '';
  for (var p in o) {
  	uID = o[p].phoneNumber;
  }
  return uID;
}

function printUserAddress(o) {
  var out = '';
  var uID = '';
  for (var p in o) {
  	uID = o[p].address;
  }
  return uID;
}

function printUsername(o) {
  var out = '';
  var username = '';
  for (var p in o) {
  	username = o[p].username;
  }
  return username;
}

function printObject(o) {
  var out = '';
  for (var p in o) {
    out += p + ': ' + o[p].orProductName + '\n';
  }
  // alert(out);
}

function resetRegisterForm()
{
	document.getElementById('user_username').value = "";
	document.getElementById('user_password').value = "";
	document.getElementById('user_email').value = "";
	document.getElementById('user_rpassword').value = "";
	document.getElementById('user_agree_term').checked = false;
}

function getDateTime(now) {
    //var now     = new Date(); 
    var year    = now.getFullYear();
    var month   = now.getMonth()+1; 
    var day     = now.getDate();
    var hour    = now.getHours();
    var minute  = now.getMinutes();
    var second  = now.getSeconds(); 
    if(month.toString().length == 1) {
        var month = '0'+month;
    }
    if(day.toString().length == 1) {
        var day = '0'+day;
    }   
    if(hour.toString().length == 1) {
        var hour = '0'+hour;
    }
    if(minute.toString().length == 1) {
        var minute = '0'+minute;
    }
    if(second.toString().length == 1) {
        var second = '0'+second;
    }   
    var dateTime = year+'/'+month+'/'+day+' '+hour+':'+minute+':'+second;   
     return dateTime;
}

function addZero(k)
{
	if(k < 10)
	{
		k = '0' + k;
	}
	return k;
}

function estimateTime(x)
{
	if(x <= 0)
	{
		return 0;
	}
	else if(x > 0)
	{
		return x*5;
	}
}