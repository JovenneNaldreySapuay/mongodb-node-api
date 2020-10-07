const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema(
	{
		title: { 
			type: String, 
			required: true 
		},
		description: { 
			type: String, 
			required: true 
		},
		slug: { 
			type: String, 
			required: true 
		},
		price: { 
			type: Number, 
			required: true 
		},
		category: { 
			type: String, 
			required: true 
		},
		rating: { 
			type: Number, 
			required: true,
			min: 1,
			max: 5
		},
		stock: { 
			type: Number, 
			required: true,
			min: 1,
			max: 20
		},
		image: { 
			type: String, 
			required: true 
		},
		_user: { 
			type: Schema.Types.ObjectId, 
			ref: 'user' 
		}
	}, { timestamps: true }
);

module.exports = mongoose.model('product', productSchema);

