const client = require('./client');

const express = require('express');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/halo', (req, res) => res.status(200).json({ success: true }));

app.get('/datas', async (req, res) => {
	try {
		const data = new Promise((resolve, reject) => {
			client.getAll(null, (err, data) => {
				if (err) reject(err);
				resolve(data);
			});
		});

		const resp = await data;
		res.status(200).json({ data: resp });
	} catch (error) {
		console.log(error);
	}
});

app.post('/save', (req, res) => {
	let newCustomer = {
		name: req.body.name,
		age: req.body.age,
		address: req.body.address,
	};

	client.insert(newCustomer, (err, data) => {
		if (err) throw err;

		console.log('Customer created successfully', data);
		res.redirect('/');
	});
});

app.post('/update', (req, res) => {
	const updateCustomer = {
		id: req.body.id,
		name: req.body.name,
		age: req.body.age,
		address: req.body.address,
	};

	client.update(updateCustomer, (err, data) => {
		if (err) throw err;

		console.log('Customer updated successfully', data);
		res.redirect('/');
	});
});

app.post('/remove', (req, res) => {
	client.remove({ id: req.body.customer_id }, (err, _) => {
		if (err) throw err;

		console.log('Customer removed successfully');
		res.redirect('/');
	});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log('Server running at port %d', PORT);
});
