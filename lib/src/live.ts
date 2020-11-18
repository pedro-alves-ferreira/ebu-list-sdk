import { Workflow } from './api/constants';
import { Transport } from './transport';

//////////////////////////////////////////////////////////////////////////////

export class Live {
    public constructor(private readonly transport: Transport) {
        this.transport = transport;
    }

    public async getAllSources() {
        return this.transport.get('/api/live/sources');
    }

    public async startCapture(filename: string, durationMs: number, sources: string[]) {
        const workflow = {
            configuration: {
                durationMs,
                filename,
                ids: sources,
            },
            type: Workflow.liveCapture,
        };
        this.sendWorkflow(workflow);
    }

    private async sendWorkflow(workflow: object) {
        return this.transport.post('/api/workflow/', workflow);
    }
}
