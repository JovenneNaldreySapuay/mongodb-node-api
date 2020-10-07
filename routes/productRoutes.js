const express = require('express');
const mongoose = require('mongoose');

const Product = mongoose.model('product');

const validate = (data) => {
  let errors = {};
  if (data.title === '') errors.title = "Server error: Can't be empty";
  if (data.description === '') errors.description = "Server error: Can't be empty";
  if (data.price === '') errors.price = "Server error: Can't be empty";
  const isValid = Object.keys(errors).length === 0;
  return { errors, isValid };
}

module.exports = app => {
		
	// Create new product
	app.post('/api/products', async (req, res) => {
			    
	    const { 
	    	errors, 
			isValid 
	    } = validate(req.body);

		const { 
			title, 
			slug,
			description, 
			price, 
			category,
			rating,
			stock, 
			image 
		} = req.body;
		
		if (isValid) {			
			try {
				const productData = new Product(
					{ 
						title, 
						slug,
						description, 
						price, 
						category,
						rating,
						stock, 
						image
					}
				);

				await productData.save();
				
				res.json(productData);

			} catch (err) {
				res.status(422).send(err);
			}
		} else {
			res.status(400).json({ errors });
		}
	});

	// Get all products 
	app.get('/api/products', async (req, res) => {
		await Product
			.find().
			exec(function (err, data) {
				if (err) { 
					res.status(500).json({ errors: { global: err }}); 
					return; 
				}

				res.json(data);
			});
	});

	// Get product by ID
	app.get('/api/products/:_id', async (req, res) => {

		const { _id } = req.params; 
		
		await Product.
			findById({ 
				_id: new mongoose.Types.ObjectId(_id)
			}).
			exec(function (err, data) {
				if (err) { 
					res.status(500).json({ errors: { global: err }}); 
					return; 
				}

				res.json(data);
			});
	});
	
	// Update a product
	app.put('/api/products/:_id', async (req, res) => {

		const { 
			title, 
			description,
			slug,
			price,
			category,
			stock 
		} = req.body; 

		await Product.findOneAndUpdate({ 
		    	_id: new mongoose.Types.ObjectId(req.params._id)
		    }, 
			{ $set: { 
				title, 
				description,
				slug,
				price,
				category,
				stock 
			}}, 
			{ 
				upsert: true,
				new: true
			}, 
			(err, data) => {
				res.status(201);
				res.json(data);
			}
		);
	});
	
	// Delete a product
	app.delete('/api/products/:_id', async (req, res) => {
		await Product.deleteOne({ 
			_id: new mongoose.Types.ObjectId(req.params._id) 
		}, (err, data) => {
			res.json(data);
		});
	});
	
	// Search a product 
	app.get('/products/search/:q', async (req, res) => {

		const { q } = req.params;

		await Product
			.find({
				title: { $regex: q, $options: 'i' }
			}).
			exec(function (err, data) {
				if (err) { 
					res.status(500).json({ errors: { global: err }}); 
					return; 
				}

				res.json(data);
			});
	});

};

