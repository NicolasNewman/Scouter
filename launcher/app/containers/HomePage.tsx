import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import Home from '../components/Home';
import FormActions from '../actions/form';
import LogActions from '../actions/log';

function mapStateToProps(state, ownProps) {
    return {
        dataStore: ownProps.dataStore,
        serverPort: state.form.serverPort,
        dbPort: state.form.dbPort,
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

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Home);
