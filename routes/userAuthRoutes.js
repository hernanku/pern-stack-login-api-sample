const express = require('express');

const router = express.Router();


// routes
router.get('/healthz', (req, res) => {
    res.json({
        message: "service is up!", 
    }).status(200);
});


module.exports = router;
