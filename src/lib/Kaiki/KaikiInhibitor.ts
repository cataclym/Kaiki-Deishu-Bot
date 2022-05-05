import { Inhibitor, InhibitorOptions } from "discord-akairo";
import KaikiAkairoClient from "./KaikiAkairoClient";

export default class KaikiInhibitor extends Inhibitor {
    client: KaikiAkairoClient;

    constructor(id: string, options?: InhibitorOptions) {
        super(id, options);
    }
}