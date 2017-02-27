commentSchema = new SimpleSchema({
    cEmail: {
      type: String,
      label: 'cEmail'
    },
    cName:{
      type:String,
      label: 'cName',
      optional:true
    },
    foodID:{
    	type: String,
    	label: 'foodID'
    },
    cContent: {
      type: String,
      label: 'cContent',
    },
    cCommentAt:{
      type: Date,
      label: 'cCommentAt',
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
    }
});