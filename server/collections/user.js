import { SimpleSchema} from 'meteor/aldeed:simple-schema';
/**
 * User bean
 * @type {SimpleSchema}
 */
userSchema = new SimpleSchema({
   username:{
		type: String,
	 	label: 'username',
		optional:false,
   },
   password:{
		type: String,
	 	label: 'password',
		max: 50,
		optional:false,
   },
   email:{
		type: String,
	 	label: 'email',
    optional:false,
   },
   phoneNumber:{
    type: String,
    label: 'phoneNumber',
    optional:true
   },
   address:{
		type: String,
	 	label: 'address',
    optional:true,
   },
   registeredAt:{
      type: new Date(),
      label: 'registeredAt',
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
   }

});