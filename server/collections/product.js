import { SimpleSchema} from 'meteor/aldeed:simple-schema';
// import { Mongo } from 'meteor/mongo';

// Posts = new Mongo.Collection('posts');
/**
 * Product bean
 * @type {SimpleSchema}
 */
productSchema = new SimpleSchema({
    pName:{
      type: String,
      label: 'pName',
      max: 150
    },
    pUnit:{
      type: String,
      label: 'pUnit',
      max: 10
    },
    pPricePerUnit:{
      type: Number,
      label: 'pPricePerUnit',
      min: 0
    },
    pDescription:{
      type: String,
      label: 'pDescription',
      optional: true
    },
    pTypeID:{
      type: String,
      label: 'pTypeID'
    },
    pDiscount:{
      type: Number,
      label: 'pDiscount',
      min: 0,
      max: 50
    },
    pStatus:{
      type: String,
      label: 'pStatus',
      max: 50,
      optional: true,
      autoValue: function() {
        if (this.isInsert) 
        {
          return "serving";
        } 
      }
    },
    pCustomerViews:{
      type: Number,
      label: 'pCustomerViews',

    },

    pCreatedAt:{
      type: Date,
      label: 'pCreatedAt',
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
          this.unset();
        }
      }
    },

    pImagePath:{
      type:String,
      label: 'pImagePath',
      optional:true,
    },

});