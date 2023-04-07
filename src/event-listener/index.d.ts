export default class EvtWorker {
    private static _handls;
    static on(event: string, handl: Function, caller: any): void;
    static once(event: string, handl: Function, caller: any): void;
    static off(event: string, handl?: Function | undefined, caller?: any): void;
    static offall(caller?: any): void;
    static emit(event: string, ...params: any[]): void;
}
