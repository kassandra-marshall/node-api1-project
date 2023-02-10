// BUILD YOUR SERVER HERE
const express = require('express');
const User = require('./users/model');

const server = express();
server.use(express.json());

server.get('/api/users', (req, res) => {
    User.find()
        .then(users => {
            res.status(200).json(users);
        })
        .catch(err => {
            res.status(500).json({
                message: 'The users information could not be retrieved',
                err: err.message,
                stack: err.stack
            })
        })
});

server.get('/api/users/:id', (req, res) => {
    User.findById(req.params.id)
        .then(user => {
            if (!user){
                res.status(404).json({
                    message: 'The user with the specified ID does not exist'
                })
            }else
            res.status(200).json(user)
        })
        .catch(err => {
            res.status(500).json({
                message: 'The user information could not be retrieved',
                err: err.message,
                stack: err.stack
            })
        })
});

server.post('/api/users', (req, res) => {
    const user = req.body;
    if(!user.name || !user.bio) {
        res.status(400).json({
            message: 'Please provide name and bio for the user'
        })
    }else 
    User.insert(user)
        .then(user => {
            res.status(201).json(user)
        })
        .catch(err => {
            res.status(500).json({
                message: 'There was an error while saving the user to the database',
                err: err.message,
                stack: err.stack
            })
        })
});

server.put('/api/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, bio } = req.body;
        const updatedUser = await User.update(id, {name, bio})
        if (!updatedUser){
            res.status(404).json({
                message: 'The user with the specified ID does not exist'
            })
        } else{
            if(!name || !bio){
                res.status(400).json({
                    message: 'Please provide name and bio for the user'
                })
            } else {
                updatedUser
                res.status(200).json(updatedUser);
            }
        } 
    } catch (err) {
        res.status(500).json({
            message: 'The user information could not be modified',
            err: err.message,
            stack: err.stack
        })
    }
});

server.delete('/api/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const possibleUser = await User.findById(id)
        if(!possibleUser){
            res.status(404).json({
                message: 'The user with the specified ID does not exist'
            })
        }else {
            const deletedUser = await User.remove(id)
            res.json(deletedUser)
        }
    } catch (err) {
        res.status(500).json({
            message: 'The user could not be removed',
            err: err.message,
            stack: err.stack
        }) 
        
    }
    // users = users.filter(user => user.id !== req.params.id);
    // res.status(200).json(users);
});

module.exports = server; // EXPORT YOUR SERVER instead of {}
