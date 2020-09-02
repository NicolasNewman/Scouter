import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import LogPane from '../components/LogPane';
import FormActions from '../actions/form';
import LogActions from '../actions/log';

function mapStateToProps(state, ownProps) {
    return {
        dataStore: ownProps.dataStore,
        serverPort: state.form.serverPort,
        dbPort: state.form.dbPort,
        dbName: state.form.dbName,
        adminPassword: state.form.adminPassword,
        filePath: state.form.filePath,
        logs: state.log,
        logEvent: (name: string, text: string, level: 'MESSAGE' | 'WARNING' | 'ERROR') => {},
        createLog: (name: string) => {},
        deleteLog: (name: string) => {}
    };
}

function mapDispatchToProps(dispatch: Dispatch) {
    return bindActionCreators(
        {
            ...FormActions,
            ...LogActions
        },
        dispatch
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(LogPane);
