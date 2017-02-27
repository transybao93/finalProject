// import { Template } from 'meteor/templating';
// import { ReactiveVar } from 'meteor/reactive-var';

// //import './admin.html';

// Products = new Mongo.Collection('product');
// Orders = new Mongo.Collection('order');
// Types = new Mongo.Collection('type');

// //phần code

// Template.body.onCreated(function bodyOnCreated() {
//   Meteor.subscribe('type');
//   Meteor.subscribe('products');
// });

// //add type template
// Template.addType.events({
// 	'submit .addTypeForm'(event, instance){
// 		event.preventDefault();

// 		var tName = event.target.tName.value;
// 		var tDescription = event.target.tDescription.value;
// 		var data = [];
// 		if(tName != '' && tDescription != '')
// 		{
// 			data[0] = tName;
// 			data[1] = tDescription;
// 			Meteor.call('addType', data, function(err, result){
// 				if(result == 0)
// 				{
// 					event.target.tName.value = '';
// 					event.target.tDescription.value = '';
// 					alert('Exitsed type !');
// 				}else{
// 					event.target.tName.value = '';
// 					event.target.tName.focus();
// 					event.target.tDescription.value = '';
// 				}
// 			});
// 		}else{
// 			alert('Empty info !');
// 		}
		
// 	},
// });

// //type list template
// Template.typeList.events({
// 	'click #btnDelete'(event, instance){
// 		Meteor.call('deleteType', this._id);
// 	},
// 	'click #btnView'(event, instance){
// 		var tName = this.tName;
// 		alert("Type name: " + this.tName + "\nType description: " + this.tDescription);
// 		//alert(tName);
// 		Meteor.call('showTypeIDByName', tName);
// 	},
// });

// Template.typeList.helpers({
//   listType:function(){
//   	return Types.find();
//   }
// });

// //phần thêm sửa xóa đồ ăn/uống
// Template.foodManagement.helpers({
// 	products:function(){
// 		return Products.find();
// 	},
// });

// Template.foodManagement.events({
// 	'click #btnDelete'(event, instance){
// 		Meteor.call('deleteProduct', this._id);
// 	},
// });

// //add food template
// Template.addFood.onCreated(function addFoodOnCreated() {
//   //Meteor.subscribe('type');
// });

// Template.addFood.helpers({
//   listType:function(){
//   	return Types.find();
//   }
// });

// Template.addFood.events({
//   'submit .addFoodForm'(event, instance){
//   	event.preventDefault();
//   	var typeID = event.target.lType.value;
//   	var unit = event.target.lUnit.value;
//   	var pName = event.target.pName.value;
//   	var price = event.target.pPricepU.value;
//   	var des = event.target.pDescription.value;
//   	var discount = event.target.pDiscount.value;
//   	var status = "serving";
//   	if(typeID != '' && unit != '' && pName != '' && price != '')
//   	{
//   		var data = [];
//   		data[0] = typeID;
//   		data[1] = unit;
//   		data[2] = pName;
//   		data[3] = price;
//   		data[4] = des;
//   		data[5] = discount;
//   		data[6] = status;
//   		Meteor.call('addProduct', data, function(err, result){
//   			if(result == 0)
//   			{	
//   				alert('Existed !');
//   			}else{
//   				alert('Insert success !');
//   			}
//   		});
//   	}
//   },
// });