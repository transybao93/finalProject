import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

Products = new Mongo.Collection('product');
OrderDetails = new Mongo.Collection('order');
Orders = new Mongo.Collection('order2');
Types = new Mongo.Collection('type');
Users = new Mongo.Collection('user');
Comment = new Mongo.Collection('comment');
Delivery = new Mongo.Collection('delivery');

Meteor.startup(() => {
  // code to run on server at startup

  //define some database
  Products.attachSchema(productSchema);
  OrderDetails.attachSchema(orderDetailSchema);
  Orders.attachSchema(orderSchema);
  Types.attachSchema(typesSchema);
  Users.attachSchema(userSchema);
  Comment.attachSchema(commentSchema);
  Delivery.attachSchema(deliverySchema);

  //meteor methods
  Meteor.methods({
    /**
     * add new types
     * @param Array data [array data with 2 values]
     */
  	addType:function(data){
  		var name = data[0];
  		var des = data[1];
  		var x = Types.find({tName: name}).count();
  		if(x == 0)
  		{
  			Types.insert({
  				tName: name,
  				tDescription: des
  			});
  			return 1;
  		}else{
  			return 0;
  		}
  	},
    /**
     * [deleteType description]
     * @param  String tID [type ID]
     * @return boolean     [true/false]
     */
  	deleteType:function(tID){
  		if(!tID)
  		{
  			throw new Meteor.Error('Type ID does not exist !');
  		}else{
			  Types.remove(tID);
  		}
  		
  	},
  	showTypeIDByName:function(tName){
  		var x = Types.findOne({tName: tName});
  		if (x) 
  		{
		   var tID = x._id;
		}
  	},
    /**
     * add new product
     * @param Object data [contain 7 values]
     */
    addProduct:function(data){
      var typeID = data[0];
      var unit = data[1];
      var pName = data[2];
      var price = data[3];
      var des = data[4];
      var discount = data[5];
      var status = data[6];
      var x = Products.find({pName:pName, pTypeID:typeID}).count();
      if(data && x == 0)
      {
        //Products.remove({});
        Products.insert({
          pName:pName,
          pUnit:unit,
          pPricePerUnit:price,
          pDescription:des,
          pTypeID:typeID,
          pDiscount: discount
        });
        return 1;
      }else{
        return 0;
      }
    },
    /**
     * delete a product by product ID
     * @param int pID [product ID]
     */
    deleteProduct:function(pID){
      if(pID)
      {
        Products.remove(pID);
      }
    },
    addGuestOrder:function(data){
      if(data)
      {
        var pID = data[0];
        var orNo = data[1];
        // console.log('orNo in server: ' + orNo);
        var orQuantity = data[2];
        var orTotal = data[3];
        var orDiscount = data[4];
        var orShipType = data[5];
        var orStatus = data[6];
        var orName = data[7];
        var uEmail = "";
        if(data[8] != null)
        {
          uEmail = data[8];
        }
        // console.log("email: " + uEmail);
        // if(data[8] != '' || data[8] != null)
        // {
        //    uEmail = data[8];
        // }
        
        //ar uEmail = date[8];
        //check data
        var x = OrderDetails.find({orNo: orNo, orProductID: pID, orStatus: 'ordering'}).count();
        var o = Orders.find({orNo: orNo, orUserEmail: uEmail}).count();
        // console.log('count from Order: ' + o);
        if(o == 0)
        {
          Orders.insert({
            orNo: orNo,
            orUserEmail: uEmail,
            orStatus: 'ordering'
          });
        }

        if(x == 0)
        {
          

          OrderDetails.insert({
            orNo: orNo,
            uEmail: uEmail,
            orQuantity: orQuantity,
            orProductID: pID,
            orTotal: orTotal,
            orDiscount: orDiscount,
            orShipType: orShipType,
            orStatus: orStatus,
            orProductName: orName
          });
          return 1;
        }else{
          //if exist so update that record
          var p = Products.findOne({_id: pID});
          var pPrice = p.pPricePerUnit;
          var k = OrderDetails.findOne({orNo: orNo, orProductID: pID, orStatus: 'ordering'});
          var currentQuantity = k.orQuantity;
          var currentTotal = pPrice * (k.orQuantity+1);
          OrderDetails.update(
            {orNo: orNo, orProductID: pID}, 
            {$set: {orQuantity: currentQuantity + 1, 
              orTotal: currentTotal,
            } 
          });
          return 0;
        }
        
      }
    },
    deleteOrderFoodByID:function(fID){
      var x = OrderDetails.find({_id: fID, orStatus: 'ordering'}).count();
      if(x > 0)
      {
        OrderDetails.remove(fID);
      }
    },
    plusQuantity:function(data){
      var oID = data[0];
      var pID = data[1];
      var q = OrderDetails.findOne({_id: oID, orProductID: pID, orStatus: 'ordering'});
      var q2 = q.orQuantity;
      
      if(q2 < 20)
      {
        var p = Products.findOne({_id: pID});
        var pPrice = p.pPricePerUnit;
        var q3 = q2 + 1;
        var currentTotal = pPrice * (q3);
        OrderDetails.update({_id: oID, orProductID: pID, orStatus: 'ordering'},
            {$set: {orQuantity: q3, orTotal: currentTotal}
          });
        return 1;
      }else{
        return 0;
      }
      

    },
    minusQuantity:function(data){
      var oID = data[0];
      var pID = data[1];
      var q = OrderDetails.findOne({_id: oID, orProductID: pID, orStatus: 'ordering'});
      var q2 = q.orQuantity;
      
      if(q2 > 1)
      {
        var p = Products.findOne({_id: pID});
        var pPrice = p.pPricePerUnit;
        var q3 = q2 - 1;
        var currentTotal = pPrice * (q3);
        OrderDetails.update({_id: oID, orProductID: pID, orStatus: 'ordering'},
            {$set: {orQuantity: q3, orTotal: currentTotal}
          });
        return 1;
      }else{
        return 0;
      }
      

    },

    updateCountViewForFood:function(fID){
      var p = Products.findOne({_id: fID});
      if(p)
      {
        var count2 = p.pCustomerViews + 1;
        Products.update({_id: fID},
            {$set: {pCustomerViews: count2}
          });
      }
    },

    deleteOrder:function(oID)
    {
      var x = OrderDetails.find({_id: oID, orStatus: 'ordering'}).count();
      if(x > 0)
      {
        OrderDetails.remove(oID);
      }
    },


    addNewUser:function(data)
    {
      var username = data[0];
      var email = data[1];
      var password = data[2];
      //check duplicate
      var count = Users.find({email: email}).count();
      if(count == 0)
      {
        Users.insert({
          username:username,
          password:password,
          email:email,
        });
        return 1;
      }else{
        return 0;
      }
      
    },

    checkUserLogin:function(data)
    {
      var email = data[0];
      var password = data[1];
      var uNo = data[2];
      var x = Users.find({email: email, password: password});
      if(x.count() > 0)
      {
        //insert into Order table
        Orders.insert({
          orNo: uNo,
          orUserEmail: email,
          orStatus: 'ordering'
        });

        //return username to client
        var k = Users.findOne({email: email});
        return k.username;
      }else{
        return 0;
      }
    },

    addComment:function(data)
    {
      var foodID = data[0];
      var username = data[1];
      var cComment = data[2];
      var x = Comment.find({cEmail: username, foodID: foodID}).count();
      //insert 
      Comment.insert({
        cEmail: username,
        foodID: foodID,
        cContent: cComment
      });
      return 1;
    },

    //add delivery and user information
    addDeliveryforOrder:function(data)
    {
        var orNo = data[0];
        var uName = data[1];
        var uPhone = data[2];
        var uEmail = data[3];
        var fulladdress = data[4];
        var fee = data[5];
        var d = Delivery.find({orNo: orNo}).count();
        //console.log('log name + email: ' + uName + ' - ' + uEmail);
        if(d == 0)
        {
          Delivery.insert({
            orNo: orNo,
            userName: uName,
            uPhone: uPhone,
            userEmail: uEmail,
            dType: 'Delivery',
            dAddress: fulladdress,
            dFee: fee

          });
          
        }
        if(d>0)
        {
          Delivery.update(
            {orNo: orNo}, 
            {$set: {userName: uName, 
              uPhone: uPhone,
              userEmail: uEmail,
              dAddress: fulladdress,
              dFee: fee
            } 
          });
        }

        
    },

    updateOrderStatus:function(data)
    {
      //update Order table
      Orders.update(
        {orNo: data[0]}, 
        {$set: {orStatus: 'ordered', orTotal: data[1]} 
      });

      //update OrderDetails table
      OrderDetails.update(
        {orNo: data[0]}, 
        {$set: {orStatus: 'ordered'} 
      });

    },

    addPickupforOrder:function(data)
    {
        var orNo = data[0];
        var uName = data[1];
        var uPhone = data[2];
        var uEmail = data[3];
        var fulladdress = data[4];
        var fee = data[5];
        var time = data[6];
        var d = Delivery.find({orNo: orNo}).count();
        //console.log('log name + email: ' + uName + ' - ' + uEmail);
        if(d == 0)
        {
          Delivery.insert({
            orNo: orNo,
            userName: uName,
            uPhone: uPhone,
            userEmail: uEmail,
            dType: 'Pickup',
            dAddress: fulladdress,
            dFee: fee,
            dTime: time

          });
          
        }
        if(d>0)
        {
          Delivery.update(
            {orNo: orNo}, 
            {$set: {userName: uName, 
              uPhone: uPhone,
              userEmail: uEmail,
              dType: 'Pickup',
              dAddress: fulladdress,
              dFee: fee,
              dTime: time
            } 
          });
        }

        
    },

    updatePassword:function(data){
      var uEmail = data[0];
      var uOldPass = data[1];
      var uNewPass = data[2];
      //console.log('email: ' + uEmail + ' - password: ' + data[1]);
      var u = Users.find({email: uEmail, password: uOldPass}).count();
      //console.log('count: ' + u);
      if(u > 0)
      {
        Users.update(
            {email: uEmail}, 
            {$set: {password: uNewPass} 
          });
        return 1;
      }else{
        return 0;
      }
    },


    updateUserInfo:function(data)
    {
      var email = data[0];
      var phone = data[1];
      var address = data[2];
      var u = Users.find({email: email}).count();
      if(u > 0)
      {
        Users.update(
            {email: email}, 
            {$set: {
              phoneNumber: phone,
              address: address
              } 
          });
        return 1;
      }else{
        return 0;
      }
    },

    updateProductInformation:function(data){
      var pid = data[0];
      var price = data[1];
      var imagePath = data[2];
      var pName = data[3];
      Products.update(
        {_id: pid}, 
        {$set: {
          pName: pName,
          pPricePerUnit: price,
          pImagePath: imagePath
          } 
      });
      return 1;

    },




  });
});

	Meteor.publish('type', function(){
		var data = Types.find();
		if(data)
		{
			return data;
		}
		return this.ready();
	});

  Meteor.publish('products', function(){
    var data = Products.find();
    if(data)
    {
      return data;
    }
    return this.ready();
  });
  Meteor.publish('showOrder', function(){
    var data = OrderDetails.find();
    if(data)
    {
      return data;
    }
    return this.ready();
  });

  Meteor.publish('commentList', function(){
    var data = Comment.find();
    if(data)
    {
      return data;
    }
    return this.ready();
  });

  Meteor.publish('showUser', function(){
    var data = Users.find();
    if(data)
    {
      return data;
    }
    return this.ready();
  });

  Meteor.publish('showDelivery', function(){
    var data = Delivery.find();
    if(data)
    {
      return data;
    }
    return this.ready();
  });

  Meteor.publish('showOrder2', function(){
    var data = Orders.find();
    if(data)
    {
      return data;
    }
    return this.ready();
  });