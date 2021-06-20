const http = require("http");
const fs = require("fs").promises;

const server = http.createServer(async (request, response) => {
	const {method, url, headers} = request;

	if (method === "GET" && url === "/super-mario-world-js/") {
		const data = await fs.readFile("./index.html", "utf8");
		response.setHeader("Content-type", "text/html");
		response.write(data);
	} else if (method === "GET" && url.startsWith("/super-mario-world-js/src/") && !url.includes("..")) {
		const filePath = "./src/" + url.substring(26);
		try {
			const stat = await fs.stat(filePath);
			if (stat.isDirectory()) {
				response.writeHead(404);
				response.end();
				return;
			}
		} catch (err) {
			if (err.code === "ENOENT") {
				response.writeHead(404);
				response.end();
				return;
			}
			response.writeHead(500);
			response.write(err.stack);
			response.end();
			return;
		}
		const data = await fs.readFile(filePath, "utf8");
		if (url.endsWith(".js")) {
			response.setHeader("Content-type", "application/javascript; charset=utf-8");
		} else {
			response.setHeader("Content-type", "text/plain; charset=utf-8");
		}
		response.write(data);
	} else if (method === "GET" && url.startsWith("/super-mario-world-js/assets/") && !url.includes("..")) {
		const filePath = "./assets/" + url.substring(29);
		try {
			const stat = await fs.stat(filePath);
			if (stat.isDirectory()) {
				response.writeHead(404);
				response.end();
				return;
			}
		} catch (err) {
			if (err.code === "ENOENT") {
				response.writeHead(404);
				response.end();
				return;
			}
			response.writeHead(500);
			response.write(err.stack);
			response.end();
			return;
		}
		const data = await fs.readFile(filePath);
		if (url.endsWith(".png")) {
			response.setHeader("Content-type", "image/png");
		} else {
			response.setHeader("Content-type", "text/plain; charset=utf-8");
		}
		response.write(data);
	} else if (method === "GET" && url === "/super-mario-world-js/src/script.js") {
		const data = await fs.readFile("./src/script.js", "utf8");
		response.setHeader("Content-type", "application/javascript; charset=utf-8");
		response.write(data);
	} else {
		response.setHeader("Content-type", "text/plain; charset=utf-8");
		response.write(url.toString());
	}

	response.end();
});

server.listen(7080, function(err) {
	if (err) {
		return console.log(err);
	}
	console.log("http://localhost:7080/");
})