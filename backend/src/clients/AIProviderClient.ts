import axios from "axios";

export class AIProviderClient {
    static async startNewSession(opponentModel: any, sessionId: string) {
        const url = opponentModel.baseURL + opponentModel.pathURL + "/newsession";
        await axios.post(url, {sessionId: sessionId});
    }

    static async endSession(opponentModel: any, sessionId: string) {
        const url = opponentModel.provider.baseURL + opponentModel.pathURL + "/endsession";
        await axios.post(url, {sessionId});
    }

    static async sendNewMessage(opponentModel: any, sessionId: string, content: string) {
        const url = opponentModel.provider.baseURL + opponentModel.pathURL + "/newmessage";
        await axios.post(url, {sessionId, content});
    }
}