import {processMessage} from "../helpers/message.js";

export const postMessage = async (req, res)=>{
    try {
        const {message} = req.body;

        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Cache-Control'
        });

       const sendSSEResponse = (data) => {
        res.write(`data: ${JSON.stringify(data)}\n\n`);
       }

       await processMessage(message, sendSSEResponse);
       res.end();
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
    
