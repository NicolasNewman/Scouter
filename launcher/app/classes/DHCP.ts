import * as dhcp from 'dhcp';

export default class DHCP {
    private dhcpServer: any;
    constructor() {
        this.dhcpServer = dhcp.createServer({
            range: ['192.168.0.2', '192.168.0.99'],
            randomIP: true,
            netmask: '255.255.255.0',
            router: ['192.168.0.1'],
            server: '192.168.0.1'
        });

        this.dhcpServer.on('message', data => {
            console.log(data);
        });
    }

    start = () => {
        this.dhcpServer.listen();
    };

    stop = () => {
        this.dhcpServer.close();
    };
}
