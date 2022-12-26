const express = require("express"); 

const app = express(); 
const PORT = process.env.PORT || 3000; 

let variable = new Map([

["youtube","https://www.youtube.com/?gl=IN"],
["netflix","https://www.netflix.com/browse"]

])

// For testing purposes 
app.get("/:value", (req, res) => { 

    res.redirect(301, variable.get(req.params.value))
}); 

app.listen(PORT, () => { 
    console.log(`API is listening on port ${PORT}`); 
});