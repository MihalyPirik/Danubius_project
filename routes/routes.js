const express = require('express');
const router = express.Router();

router.get('/', (req, res) => { res.send('Get All API') });

router.get('/:id', (req, res) => { res.send('Get by ID API') });

router.post('/', (req, res) => { res.send('Post API') });

router.patch('/:id', (req, res) => { res.send('Update by ID API') });

router.delete('/:id', (req, res) => { res.send('Delete by ID API') });

module.exports = router;