import { SimpleSchema} from 'meteor/aldeed:simple-schema';

orderDetailSchema = new SimpleSchema({
    orNo:{
      type: String,
      label: 'orNo'
    },
    uEmail:{
      type:String,
      label: 'uEmail',
      optional: true
    },
    orProductName:{
      type:String,
      label: 'orProductName'
    },
    orQuantity:{
      type: Number,
      label: 'orQuantity',
      min: 0,
      max: 100
    },
    orProductID:{
      type: String,
      label: 'orProductID'
    },
    orTotal:{
      type: Number,
      label: 'orTotal',
      min: 0
    },
   	orDiscount:{
      type: Number,
      label: 'orDiscount',
      min: 0,
      max: 50,
      optional: true
    },
   	orDate:{
      type: Date,
      label: 'orDate',
      autoValue: function() {
        if (this.isInsert) 
        {
          return new Date();
        } 
        else if (this.isUpsert) 
        {
          return {$setOnInsert: new Date()};
        } 
        else 
        {
          this.unset();  // Prevent user from supplying their own value
        }
      }

    },
    orStatus:{
      type: String,
      label: 'orStatus',
      max: 50
    },
    // orderID:{
    //   type: Number,
    //   label: 'orderID',
    // },


});