//import { SimpleSchema} from 'meteor/aldeed:simple-schema';
// import { Mongo } from 'meteor/mongo';

// Posts = new Mongo.Collection('posts');

typesSchema = new SimpleSchema({
    tName: {
      type: String,
      label: 'tName'
    },
    tDescription: {
      type: String,
      label: 'tName',
      optional: true
    },


});