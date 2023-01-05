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
		if (err) return res.status(400).json({ message: err.message });

		res.status(201).json({
			message: 'Customer created successfully',
			data,
		});
	});
});

app.put('/update/:id', (req, res) => {
	const updateCustomer = {
		id: req.params.id,
		name: req.body.name,
		age: req.body.age,
		address: req.body.address,
	};

	client.update(updateCustomer, (err, data) => {
		if (err) return res.status(400).json({ message: err.message });

		res.status(200).json({
			message: 'Customer updated successfully',
			data,
		});
	});
});

app.delete('/remove/:id', (req, res) => {
	client.remove({ id: req.params.id }, (err, _) => {
		if (err) return res.status(400).json({ message: err.message });

		res.status(200).json({
			message: 'Customer removed successfully',
			data: null,
		});
	});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log('Server running at port %d', PORT);
});
