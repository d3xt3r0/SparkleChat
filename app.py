from fastapi import FastAPI, Request, WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from collections import deque
from utils.response import Response

class ConnectionManager:

    available_connections = deque()
    active_connections = {}

    

    def __init__(self):
        self.stranger_socket: WebSocket
        self.resp = Response()

    async def connect(self, user: WebSocket):
        await user.accept()
        

        if ConnectionManager.available_connections:
            stranger = ConnectionManager.available_connections.popleft()
            ConnectionManager.active_connections[user] = stranger
            ConnectionManager.active_connections[stranger] = user
            await user.send_json(self.resp.json(Response.RESPONSE_ALERT,'connected to a user'))
            await stranger.send_json(self.resp.json(Response.RESPONSE_ALERT,'connected to a user'))
        else:
            ConnectionManager.available_connections.append(user)
            await user.send_json(self.resp.json(Response.RESPONSE_ALERT,'No users available now...'))
        print(ConnectionManager.available_connections)

    async def send_message(self, user : WebSocket, message:str):
        await ConnectionManager.active_connections[user].send_json(self.resp.json(Response.RESPONSE_OK,message))

    def disconnect(self, websocket: WebSocket):
        del ConnectionManager.available_connections[websocket]
        ConnectionManager.active_connections.pop(websocket)

    

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

manager = ConnectionManager()

@app.get("/", response_class=HTMLResponse)
async def get_root(request: Request):
    return templates.TemplateResponse(
        request=request, name="index.html"
    )

@app.get("/chat", response_class=HTMLResponse)
async def get_chat(request: Request):
    return templates.TemplateResponse(
        request=request, name="chat.html"
    )

@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    await manager.connect(websocket)
    try: 
        while True:
            data = await websocket.receive_text()
            await manager.send_message(websocket, data)
    except WebSocketDisconnect:
        manager.disconnect(websocket)