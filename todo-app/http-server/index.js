const http = require("http");
const fs = require("fs");
const minimist = require("minimist");

// Parse command-line arguments
const args = minimist(process.argv.slice(2));
const port = args.port || 3000; // Default to port 3000 if no port is provided

let homeContent = "";
let projectContent = "";
let registrationContent = "";

// Read HTML files
fs.readFile("home.html", (err, home) => {
    if (err) throw err;
    homeContent = home;
});

fs.readFile("project.html", (err, project) => {
    if (err) throw err;
    projectContent = project;
});

fs.readFile("registration.html", (err, registration) => {
    if (err) throw err;
    registrationContent = registration;
});

// Create HTTP server
http
    .createServer((request, response) => {
        let url = request.url;
        response.writeHeader(200, { "Content-Type": "text/html" });
        switch (url) {
            case "/project":
                response.write(projectContent);
                response.end();
                break;
            case "/registration":
                response.write(registrationContent);
                response.end();
                break;
            default:
                response.write(homeContent);
                response.end();
                break;
        }
    })
    .listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });