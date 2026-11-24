const app = require("./src/app")
const http = require("http");

const { Server } = require("socket.io");

const server = http.createServer(app);

const io = new Server(server,{
    cors:
        ["http://localhost:5500", 
            "http://127.0.0.1:5500"
        ] ,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true
    
})

app.set("io",io);

io.on("connection",(socket)=>{
    console.log("client connected:",socket.id); 

    socket.on("disconnected",()=>{
        console,log("client disconnected:",socket.id);
    })
})

// Define the port number
const PORT = 5000;

// Create a basic route for the root URL ('/')
app.get('/', (req, res) => { 
    res.send('Hello World! Your Express server is running.');
});

// Start the server and listen for requests
server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`); 
});


const connectDb = require("./src/database/database");

