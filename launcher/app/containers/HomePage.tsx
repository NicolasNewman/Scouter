import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import Home from '../components/Home';
import FormActions from '../actions/form';

function mapStateToProps(state, ownProps) {
    return {
        dataStore: ownProps.dataStore,
        serverPort: state.form.serverPort,
        dbPort: state.form.dbPort
    };
}

function mapDispatchToProps(dispatch: Dispatch) {
    return bindActionCreators(
        {
            ...FormActions
        },
        dispatch
    );
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Home);
