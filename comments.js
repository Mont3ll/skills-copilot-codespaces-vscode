// Create web server

// Import required modules
const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator');

// Create web server
const app = express();
const port = 8080;

// Set up body parser and static directory
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Set up route to handle POST requests
app.post('/comment', [
    // Validate input
    check('name').isLength({ min: 1 }).withMessage('Name is required'),
    check('comment').isLength({ min: 1 }).withMessage('Comment is required')
], (req, res) => {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    };
    // Create comment object
    const comment = {
        name: req.body.name,
        comment: req.body.comment,
        timeStamp: Date.now()
    };
    // Read comments from file
    fs.readFile('./data/comments.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
        } else {
            // Parse comments from JSON
            const comments = JSON.parse(data);
            // Add new comment to comments array
            comments.push(comment);
            // Write comments back to file
            fs.writeFile('./data/comments.json', JSON.stringify(comments), (err) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Comment saved to file');
                };
            });
        };
    });
    // Send response
    res.status(200).send('Comment added');
});

// Set up route to handle GET requests
app.get('/comment', (req, res) => {
    // Read comments from file
    fs.readFile('./data/comments.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
        } else {
            // Parse comments from JSON
            const comments = JSON.parse(data);
            // Send response
            res.send(comments);
        };
    });
});

// Start web server
app.listen(port, () => console.log(`Server listening on port ${port}`));