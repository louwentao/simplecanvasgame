export default class EvtWorker {
    private static _handls: {
        [key: string]: {
            caller: any,
            handl: Function,
            once?: boolean,
        }[]
    } = {}
    public static on(event: string, handl: Function, caller: any): void {
        if (undefined === EvtWorker._handls[event]) {
            EvtWorker._handls[event] = [{ caller, handl }];
        }
        else {
            EvtWorker._handls[event].push({ caller, handl });
        }
    }
    public static once(event: string, handl: Function, caller: any): void {
        if (undefined === EvtWorker._handls[event]) {
            EvtWorker._handls[event] = [{ caller, handl, once: true }];
        }
        else {
            EvtWorker._handls[event].push({ caller, handl, once: true });
        }
    }
    public static off(event: string, handl: Function | undefined = undefined, caller: any = undefined): void {
        const list = EvtWorker._handls[event];
        if (list && list instanceof Array) {
            if (undefined === caller) {
                EvtWorker._handls[event] = [];
                return;
            }
            list.forEach((e, i) => {
                if (e.caller === caller && (undefined === handl || handl === e.handl)) {
                    list.splice(i--, 1);
                }
            });
        }
    }
    public static offall(caller: any = undefined) {
        if (!caller) {
            EvtWorker._handls = {};
        }
        else {
            for (var index in EvtWorker._handls) {
                const list = EvtWorker._handls[index];
                if (list && list instanceof Array) {
                    list.forEach((k, i) => {
                        if (k.caller === caller) {
                            list.splice(i--, 1)
                        }
                    });
                }
            }
        }
    }
    public static emit(event: string, ...params: any[]) {
        const list = EvtWorker._handls[event];
        if (list && list instanceof Array) {
            list.forEach((t, i) => {
                t.handl.call(t.caller, ...params);
                if (t.once) {
                    list.splice(i--, 1);
                }
            });
        }
    }
}