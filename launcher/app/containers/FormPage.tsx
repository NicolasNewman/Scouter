import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import SetupForm from '../components/SetupForm';
import FormActions from '../actions/form';
import LogActions from '../actions/log';
import { withRouter } from 'react-router';

function mapStateToProps(state, ownProps) {
    return {
        dataStore: ownProps.dataStore,
        serverPort: state.form.serverPort,
        dbPort: state.form.dbPort,
        dbName: state.form.dbName,
        adminPassword: state.form.adminPassword,
        filePath: state.form.filePath,
        logText: state.log.text
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SetupForm));
