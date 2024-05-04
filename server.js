const http = require('http');
const Koa = require('koa');
const cors = require('@koa/cors');
const path = require('path');
const app = new Koa();
const server = http.createServer(app.callback());
const { koaBody } = require('koa-body');
const { getData, setId, addData, updateData, deleteData } = require('./dataparser');
const port = 7100;

app.use(koaBody({
	text: true,
	urlencoded: true,
	multipart: true,
	json: true,
}))
.use(cors())
.use(async (ctx) => {

    ctx.response.status = 201;
    ctx.response.text = "OK";
    
    let query = ctx.request.query;
    if (ctx.request.method === "GET") {
        
    }
    switch (query.method) {
        case 'allTickets':
            let resp = await getData().then(data => data.tickets)
            ctx.response.body = JSON.stringify(resp);
            break;

        case 'createTicket':
            let dt = ctx.request.body;
            if (dt.id === null) {
                dt.id = await setId();
                ctx.response.body = JSON.stringify(dt);
                await addData(dt);
            }
            else if (dt.id) {
                updateData(dt);
                if (dt.details) {
                    delete dt.details;
                };
                ctx.response.body = JSON.stringify(dt);
            }
    
            break;

        case 'ticketById':
            let json = await getData();
        
            let ticketAll = json.tickets.find(el => el.id == query.id);
            let description = json.descriptions.find(el => el.id == query.id);
        
            if (description != undefined) {
                ticketAll.details = description.details;
            }
            else {
                ticketAll.details = 'No details for this ticket found'
            }
        
            ctx.response.body = JSON.stringify(ticketAll);
            break;
        case 'deleteById':
            if(query.id) {
                deleteData(query.id);
                ctx.response.body = "deleted";
            };
            break;
        }
    }
);


server.listen(port, (err) => {
    if (err) {
        console.log(err)
        return;
    }
    console.log("Server is listening to " + port);
});
