class Response:

    RESPONSE_OK = 200
    RESPONSE_ERROR = 404
    RESPONSE_ALERT = 203

    def __init__(self) -> None:
        pass
    
    def json(self, code, message) -> dict:
        return {'code':code, 'message':message}