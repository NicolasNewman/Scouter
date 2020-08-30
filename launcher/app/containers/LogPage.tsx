import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import Log from '../components/Log';
import FormActions from '../actions/form';
import LogActions from '../actions/log';

function mapStateToProps(state, ownProps) {
    return {
        serverPort: state.form.serverPort,
        dbPort: state.form.dbPort,
        dbName: state.form.dbName,
        adminPassword: state.form.adminPassword,
        filePath: state.form.filePath,
        logText: state.log.text,
        logEvent: (event: string) => {}
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

export default connect(mapStateToProps, mapDispatchToProps)(Log);
