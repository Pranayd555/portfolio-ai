import { Request, Response } from  'express';
import { askAI } from '../services/gemini.service';

export async function sendMessage(req: Request, res: Response) {
    try{
        const { message } = req.body;
        const ans = await askAI(message);

        res.json({
            success: true,
            reply: ans
        })
    } catch(error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while processing your request.'
        })
    }
}