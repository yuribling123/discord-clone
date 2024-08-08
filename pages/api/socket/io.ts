import { NextApiResponseServerIo } from "@/type";
import { Server as NetServer } from "http";
import { NextApiRequest } from "next";
import { Server as ServerIO } from "socket.io";

//configuration object 
export const config = {
  api: {
    bodyParser: false,
  },
};

//handles incoming HTTP requests
const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {

  //Checks if a Socket.IO server instance (io) is already attached to the HTTP server 
  if (!res.socket.server.io) {

    //the path that the Socket.IO server will listen on
    const path = "/api/socket/io";
    //This server instance will be used to attach the Socket.IO server
    const httpServer: NetServer = res.socket.server as any;
 
    //Creates a new instance of a Socket.IO server
    const io = new ServerIO(
      httpServer,{
        //Configures the Socket.IO server to listen on the specified path
        path:path,
        addTrailingSlash:false,

      }
    );
    //Attaches the newly created Socket.IO server instance to the HTTP server.
    res.socket.server.io = io;

  }

  //Ends the HTTP response
  res.end(); 
};

export default ioHandler;
