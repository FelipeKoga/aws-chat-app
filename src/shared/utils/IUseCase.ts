interface IUseCase<Payload, Response> {
    invoke(payload: Payload): Promise<Response>
}

export { IUseCase };
