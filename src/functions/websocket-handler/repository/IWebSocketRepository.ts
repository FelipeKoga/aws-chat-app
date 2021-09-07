interface IWebSocketRepository {

    getEmailByConnectionId(connectionId: string): Promise<string>

    connect(connectionId: string, connectedAt: number, email: string): Promise<void>

    disconnect(connectionId: string, email: string): Promise<void>

    postMessage(): Promise<void>

}

export { IWebSocketRepository };
