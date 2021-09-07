interface IWebSocketRepository {

    getEmailByConnectionId(connectionId: string): Promise<string>

    connect(connectionId: string, connectedAt: number, email: string): Promise<void>

    disconnect(connectionId: string, email: string): Promise<void>

    postMessage(emails: string[], data: any): Promise<void>

}

export { IWebSocketRepository };
