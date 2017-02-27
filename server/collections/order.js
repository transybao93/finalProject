import { SimpleSchema} from 'meteor/aldeed:simple-schema';

orderSchema = new SimpleSchema({
    orNo:{
      type: String,
      label: 'orNo'
    },
    orUserEmail:{
      type: String,
      label: 'orUserEmail',
      optional:true,
    },
    orTotal:{
      type: Number,
      label: 'orTotal',
      min: 0,
      optional:true,
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
   	orShipType:{
      type: String,
      label: 'orShipType',
      optional:true,
    },
    orStatus:{
    	type: String,
    	label: 'orStatus',
    	max: 50
    },

});