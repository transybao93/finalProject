import { SimpleSchema} from 'meteor/aldeed:simple-schema';

deliverySchema = new SimpleSchema({
    orNo:
    {
    	type: String,
    	label: 'orNo',
    },
    userName:{
        type:String,
        label: 'userName'
    },
    uPhone:{
        type:String,
        label: 'uPhone'
    },
    userEmail:{
        type:String,
        label: 'userEmail'
    },
    dType:{
        type:String,
        label: 'dType'
    },
    dAddress:{
        type:String,
        label: 'dAddress',
        optional:true,
    },
    dFee:{
        type: Number,
        label:'dFee',
        optional:true
    },
    dTime:{
        type:String,
        label:'dTime',
        optional:true
    }


});

